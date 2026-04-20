import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Provider, Favorite } from '@/types/database';

interface FavoritesState {
  favorites: Provider[];
  favoriteIds: Set<string>;
  isLoading: boolean;

  // Actions
  fetchFavorites: (userId: string) => Promise<void>;
  addFavorite: (userId: string, providerId: string) => Promise<{ error: Error | null }>;
  removeFavorite: (userId: string, providerId: string) => Promise<{ error: Error | null }>;
  isFavorite: (providerId: string) => boolean;
  toggleFavorite: (userId: string, providerId: string) => Promise<{ error: Error | null }>;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  favoriteIds: new Set(),
  isLoading: false,

  fetchFavorites: async (userId: string) => {
    set({ isLoading: true });

    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          provider_id,
          providers (*)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      const providers = data
        ?.map((f: any) => f.providers)
        .filter(Boolean) as Provider[];

      const ids = new Set(data?.map((f: any) => f.provider_id) || []);

      set({
        favorites: providers || [],
        favoriteIds: ids,
      });
    } catch (error) {
      console.error('Fetch favorites error:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  addFavorite: async (userId: string, providerId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, provider_id: providerId } as any);

      if (error) throw error;

      set((state) => ({
        favoriteIds: new Set([...state.favoriteIds, providerId]),
      }));

      // Refetch to get full provider data
      await get().fetchFavorites(userId);

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  removeFavorite: async (userId: string, providerId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('provider_id', providerId);

      if (error) throw error;

      set((state) => {
        const newIds = new Set(state.favoriteIds);
        newIds.delete(providerId);
        return {
          favoriteIds: newIds,
          favorites: state.favorites.filter((p) => p.id !== providerId),
        };
      });

      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  },

  isFavorite: (providerId: string) => {
    return get().favoriteIds.has(providerId);
  },

  toggleFavorite: async (userId: string, providerId: string) => {
    if (get().isFavorite(providerId)) {
      return get().removeFavorite(userId, providerId);
    } else {
      return get().addFavorite(userId, providerId);
    }
  },
}));
