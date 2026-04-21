import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import { Provider } from '@/types/database';

interface Location {
  lat: number;
  lng: number;
}

interface ProviderState {
  providers: Provider[];
  selectedProvider: Provider | null;
  isLoading: boolean;
  searchRadius: number;
  selectedCategory: string | null;

  // Actions
  searchNearby: (location: Location) => Promise<void>;
  setSelectedProvider: (provider: Provider | null) => void;
  setSearchRadius: (radius: number) => void;
  setSelectedCategory: (category: string | null) => void;
  getProviderById: (id: string) => Promise<Provider | null>;
  refreshProvider: (id: string) => Promise<void>;
}

export const useProviderStore = create<ProviderState>((set, get) => ({
  providers: [],
  selectedProvider: null,
  isLoading: false,
  searchRadius: 50, // Increased default radius
  selectedCategory: null,

  searchNearby: async (location: Location) => {
    set({ isLoading: true });

    try {
      const { searchRadius, selectedCategory } = get();

      const { data, error } = await supabase.rpc('search_nearby_providers', {
        p_lat: location.lat,
        p_lng: location.lng,
        radius_km: searchRadius,
        category_filter: selectedCategory,
      } as any);

      if (error) throw error;

      set({ providers: data || [] });
    } catch (error) {
      console.error('Search error:', error);
      set({ providers: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  setSelectedProvider: (provider) => {
    set({ selectedProvider: provider });
  },

  setSearchRadius: (radius) => {
    set({ searchRadius: radius });
  },

  setSelectedCategory: (category) => {
    set({ selectedCategory: category });
  },

  getProviderById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('providers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get provider error:', error);
      return null;
    }
  },

  refreshProvider: async (id: string) => {
    const provider = await get().getProviderById(id);
    if (provider) {
      set({ selectedProvider: provider });
      // Update in list too
      set((state) => ({
        providers: state.providers.map((p) =>
          p.id === id ? provider : p
        ),
      }));
    }
  },
}));
