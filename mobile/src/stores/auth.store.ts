import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/types/database';
import { Session } from '@supabase/supabase-js';

interface AuthState {
  session: Session | null;
  profile: Profile | null;
  isLoading: boolean;
  isProvider: boolean;

  // Actions
  initialize: () => Promise<void>;
  signInWithOtp: (phone: string) => Promise<{ error: Error | null }>;
  verifyOtp: (phone: string, token: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<Profile>) => Promise<{ error: Error | null }>;
  switchRole: () => void;
  fetchProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  profile: null,
  isLoading: true,
  isProvider: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      set({ session });

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
      set({ session });
      if (session) {
        await get().fetchProfile();
      } else {
        set({ profile: null, isProvider: false });
      }
    });
  },

  signInWithOtp: async (phone: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone,
        options: {
          channel: 'sms',
        },
      });
      return { error: error ? new Error(error.message) : null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  verifyOtp: async (phone: string, token: string) => {
    try {
      const { error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms',
      });
      return { error: error ? new Error(error.message) : null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, profile: null, isProvider: false });
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
}));
