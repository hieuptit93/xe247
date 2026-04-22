import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database';
import { Session } from '@supabase/supabase-js';
import * as WebBrowser from 'expo-web-browser';
import * as AuthSession from 'expo-auth-session';
import { useFavoritesStore } from './favorites.store';

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
        // Fetch favorites on app start
        useFavoritesStore.getState().fetchFavorites(session.user.id)
          .catch(err => console.error('Init fetchFavorites error:', err));
      }
    } catch (error) {
      console.error('Auth init error:', error);
    } finally {
      set({ isLoading: false });
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔔 Auth state changed:', event, !!session);
      set({ session, isGuest: false });
      if (session) {
        // Fire and forget - don't block auth flow
        get().fetchProfile().catch(err => console.error('🔔 fetchProfile error:', err));
        get().completeOnboarding().catch(err => console.error('🔔 completeOnboarding error:', err));
        // Fetch favorites
        useFavoritesStore.getState().fetchFavorites(session.user.id)
          .catch(err => console.error('🔔 fetchFavorites error:', err));
      } else {
        set({ profile: null, isProvider: false });
      }
    });
  },

  signInWithEmail: async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login with:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      console.log('🔐 Login result:', { hasSession: !!data.session, error: error?.message });

      if (error) {
        return { error: new Error(error.message) };
      }

      return { error: null };
    } catch (error) {
      console.error('🔐 Login error:', error);
      return { error: error as Error };
    }
  },

  signUpWithEmail: async (email: string, password: string) => {
    try {
      console.log('📝 Attempting signup with:', email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      console.log('📝 Signup result:', {
        hasUser: !!data.user,
        hasSession: !!data.session,
        error: error?.message,
      });

      if (error) {
        return { error: new Error(error.message) };
      }

      // Check if email confirmation is required (user exists but no session)
      if (data.user && !data.session) {
        console.log('📝 Email confirmation required');
        return { error: new Error('Vui lòng kiểm tra email để xác nhận tài khoản') };
      }

      return { error: null };
    } catch (error) {
      console.error('📝 Signup error:', error);
      return { error: error as Error };
    }
  },

  signInWithGoogle: async () => {
    try {
      // Generate redirect URL - uses app scheme (xe247://)
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: 'xe247',
        path: 'auth/callback',
      });
      console.log('🔑 Google OAuth redirect URL:', redirectUrl);

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
        console.log('🔑 Opening Google auth URL...');
        const result = await WebBrowser.openAuthSessionAsync(
          data.url,
          redirectUrl
        );

        console.log('🔑 Auth result type:', result.type);

        if (result.type === 'success') {
          const url = result.url;
          console.log('🔑 Callback URL:', url);

          // Extract tokens from URL hash fragment
          const hashPart = url.split('#')[1];
          if (hashPart) {
            const params = new URLSearchParams(hashPart);
            const accessToken = params.get('access_token');
            const refreshToken = params.get('refresh_token');

            console.log('🔑 Got tokens:', { hasAccess: !!accessToken, hasRefresh: !!refreshToken });

            if (accessToken && refreshToken) {
              console.log('🔑 Setting session...');
              try {
                const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken,
                });

                console.log('🔑 setSession completed:', { hasSession: !!sessionData?.session, error: sessionError?.message });

                if (sessionError) {
                  console.error('🔑 Session error:', sessionError.message);
                  return { error: new Error(sessionError.message) };
                }

                // Manually update state
                set({
                  session: sessionData.session,
                  isGuest: false,
                  hasSeenOnboarding: true,
                });

                console.log('🔑 Google login successful!');
                return { error: null };
              } catch (err: any) {
                console.error('🔑 setSession exception:', err?.message || err);
                return { error: new Error(err?.message || 'Session error') };
              }
            }
          }

          // Check for error in URL
          const errorParam = new URLSearchParams(url.split('?')[1]).get('error_description');
          if (errorParam) {
            return { error: new Error(errorParam) };
          }
        } else if (result.type === 'cancel') {
          return { error: new Error('Đăng nhập bị hủy') };
        }
      }

      return { error: null };
    } catch (error) {
      console.error('🔑 Google OAuth error:', error);
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
    console.log('👤 fetchProfile called, hasSession:', !!session);
    if (!session) return;

    try {
      console.log('👤 Fetching profile for user:', session.user.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle(); // Use maybeSingle instead of single to handle no rows

      console.log('👤 Profile fetch result:', { hasData: !!data, error: error?.message });

      if (error) {
        console.error('👤 Profile query error:', error.message);
        return;
      }

      if (data) {
        const profile = data as unknown as Profile;
        set({
          profile,
          isProvider: profile.role === 'provider',
        });
      } else {
        // New user - create profile from Google metadata
        console.log('👤 No profile found, creating from user metadata...');
        const userMeta = session.user.user_metadata;

        const { error: insertError } = await (supabase
          .from('profiles') as any)
          .insert({
            id: session.user.id,
            full_name: userMeta?.full_name || userMeta?.name || null,
            avatar_url: userMeta?.avatar_url || userMeta?.picture || null,
            role: 'consumer',
          });

        if (insertError) {
          console.error('👤 Create profile error:', insertError.message);
        } else {
          // Fetch the created profile
          const { data: newProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (newProfile) {
            set({ profile: newProfile as unknown as Profile });
          }
          console.log('👤 Profile created successfully');
        }
      }
    } catch (error) {
      console.error('👤 Fetch profile error:', error);
    }
  },

  completeOnboarding: async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    set({ hasSeenOnboarding: true });
  },
}));
