import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Provider } from '@/types/database';

interface RecentItem {
  provider: Provider;
  viewedAt: number;
}

interface RecentStore {
  recentItems: RecentItem[];
  addToRecent: (provider: Provider) => void;
  clearRecent: () => void;
  getRecentProviders: () => Provider[];
}

const MAX_RECENT_ITEMS = 20;

export const useRecentStore = create<RecentStore>()(
  persist(
    (set, get) => ({
      recentItems: [],

      addToRecent: (provider: Provider) => {
        set((state) => {
          const filtered = state.recentItems.filter(
            (item) => item.provider.id !== provider.id
          );

          const newItems = [
            { provider, viewedAt: Date.now() },
            ...filtered,
          ].slice(0, MAX_RECENT_ITEMS);

          return { recentItems: newItems };
        });
      },

      clearRecent: () => {
        set({ recentItems: [] });
      },

      getRecentProviders: () => {
        return get().recentItems.map((item) => item.provider);
      },
    }),
    {
      name: 'xe247-recent',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
