import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database';
import { Session } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';

const ONBOARDING_KEY = '@xe247_onboarding_complete';

WebBrowser.maybeCompleteAuthSession();

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isProvider: boolean;
  isGuest: boolean;
  hasSeenOnboarding: boolean;

  // Actions
  initialize: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  continueAsGuest: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: Error | null }>;
  switchRole: () => void;
  fetchProfile: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  profile: null,
  isLoading: true,
  isProvider: false,
  isGuest: false,
  hasSeenOnboarding: false,

  initialize: async () => {
    try {
      // Check if user has completed onboarding
      const onboardingComplete = await AsyncStorage.getItem(ONBOARDING_KEY);
      const hasSeenOnboarding = onboardingComplete === 'true';

      // Check for existing session
      const { data: { session } } = await supabase.auth.getSession();

      set({ session, hasSeenOnboarding });

      if (session) {
        await get().fetchProfile();
      }
    } catch (error) {
      console.error('Auth init error:', error);
    } finally {
      set({ isLoading: false });
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      set({ session, isGuest: false });
      if (session) {
        await get().fetchProfile();
        await get().completeOnboarding();
      } else {
        set({ profile: null, isProvider: false });
      }
    });
  },

  signInWithEmail: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { error: error ? new Error(error.message) : null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  signUpWithEmail: async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });
      return { error: error ? new Error(error.message) : null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  signInWithGoogle: async () => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        path: 'auth/callback',
      });

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      if (data?.url) {
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        if (result.type === 'success') {
          const url = result.url;
          // Extract tokens from URL
          const params = new URLSearchParams(url.split('#')[1]);
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');

          if (accessToken && refreshToken) {
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });

            if (sessionError) {
              return { error: new Error(sessionError.message) };
            }
          }
        }
      }

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  continueAsGuest: async () => {
    await get().completeOnboarding();
    set({ isGuest: true, hasSeenOnboarding: true });
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, profile: null, isProvider: false, isGuest: false });
  },

  updateProfile: async (data: Partial<Profile>) => {
    const { session } = get();
    if (!session) return { error: new Error('Not authenticated') };

    try {
      const { error } = await (supabase
        .from('profiles') as any)
        .update(data)
        .eq('id', session.user.id);

      if (!error) {
        set((state) => ({
          profile: state.profile ? { ...state.profile, ...data } : null,
        }));
      }

      return { error: error ? new Error(error.message) : null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  switchRole: () => {
    set((state) => ({ isProvider: !state.isProvider }));
  },

  fetchProfile: async () => {
    const { session } = get();
    if (!session) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!error && data) {
        const profile = data as unknown as Profile;
        set({
          profile,
          isProvider: profile.role === 'provider',
        });
      }
    } catch (error) {
      console.error('Fetch profile error:', error);
    }
  },

  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    set({ hasSeenOnboarding: true });
  },
}));
