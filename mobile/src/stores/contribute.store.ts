import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

export type ContributionType = 'new_location' | 'update_info' | 'add_photo' | 'report_closed';
export type ContributionStatus = 'pending' | 'approved' | 'rejected' | 'merged';
export type ContributorTier = 'bronze' | 'silver' | 'gold' | 'diamond';

export interface ContributorProfile {
  id: string;
  user_id: string;
  total_points: number;
  tier: ContributorTier;
  locations_added: number;
  locations_updated: number;
  photos_uploaded: number;
  reports_submitted: number;
  total_views: number;
  badges: string[];
  created_at: string;
  updated_at: string;
}

export interface Contribution {
  id: string;
  user_id: string;
  type: ContributionType;
  name?: string;
  phone?: string;
  address?: string;
  location?: { lat: number; lng: number };
  category_id?: string;
  images?: string[];
  provider_id?: string;
  points_earned: number;
  status: ContributionStatus;
  created_at: string;
}

export interface Badge {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
}

interface ContributeState {
  profile: ContributorProfile | null;
  contributions: Contribution[];
  badges: Badge[];
  isLoading: boolean;
  error: string | null;

  // Draft for new contribution
  draft: {
    name: string;
    phone: string;
    address: string;
    latitude: number | null;
    longitude: number | null;
    categoryId: string | null;
    images: string[];
  };

  // Actions
  fetchProfile: () => Promise<void>;
  fetchContributions: () => Promise<void>;
  fetchBadges: () => Promise<void>;
  submitContribution: (
    type: ContributionType,
    data: {
      name?: string;
      phone?: string;
      address?: string;
      latitude?: number;
      longitude?: number;
      categoryId?: string;
      images?: string[];
      providerId?: string;
      userLatitude: number;
      userLongitude: number;
    }
  ) => Promise<{ success: boolean; points?: number; error?: string }>;
  updateDraft: (data: Partial<ContributeState['draft']>) => void;
  clearDraft: () => void;
  checkDuplicate: (name: string, lat: number, lng: number) => Promise<any[]>;
}

const INITIAL_DRAFT = {
  name: '',
  phone: '',
  address: '',
  latitude: null as number | null,
  longitude: null as number | null,
  categoryId: null as string | null,
  images: [] as string[],
};

const POINTS_MAP: Record<ContributionType, { withPhoto: number; withoutPhoto: number }> = {
  new_location: { withPhoto: 15, withoutPhoto: 5 },
  update_info: { withPhoto: 5, withoutPhoto: 5 },
  add_photo: { withPhoto: 3, withoutPhoto: 3 },
  report_closed: { withPhoto: 8, withoutPhoto: 8 },
};

export const useContributeStore = create<ContributeState>((set, get) => ({
  profile: null,
  contributions: [],
  badges: [],
  isLoading: false,
  error: null,
  draft: { ...INITIAL_DRAFT },

  fetchProfile: async () => {
    try {
      set({ isLoading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ profile: null, isLoading: false });
        return;
      }

      // Get or create profile
      const { data, error } = await supabase
        .rpc('get_or_create_contributor_profile', { p_user_id: user.id });

      if (error) throw error;

      set({ profile: data, isLoading: false });
    } catch (err: any) {
      console.error('Error fetching contributor profile:', err);
      set({ error: err.message, isLoading: false });
    }
  },

  fetchContributions: async () => {
    try {
      set({ isLoading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        set({ contributions: [], isLoading: false });
        return;
      }

      const { data, error } = await supabase
        .from('contributions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      set({ contributions: data || [], isLoading: false });
    } catch (err: any) {
      console.error('Error fetching contributions:', err);
      set({ error: err.message, isLoading: false });
    }
  },

  fetchBadges: async () => {
    try {
      const { data, error } = await supabase
        .from('badges')
        .select('*')
        .order('points_required', { ascending: true });

      if (error) throw error;

      set({ badges: data || [] });
    } catch (err: any) {
      console.error('Error fetching badges:', err);
    }
  },

  submitContribution: async (type, data) => {
    try {
      set({ isLoading: true, error: null });

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return { success: false, error: 'Vui long dang nhap de dong gop' };
      }

      // Calculate points
      const hasPhoto = (data.images?.length || 0) > 0;
      const points = hasPhoto ? POINTS_MAP[type].withPhoto : POINTS_MAP[type].withoutPhoto;

      // Calculate distance
      let distance = null;
      if (data.latitude && data.longitude && data.userLatitude && data.userLongitude) {
        distance = calculateDistance(
          data.userLatitude,
          data.userLongitude,
          data.latitude,
          data.longitude
        );
      }

      // Prepare contribution data
      const contributionData: any = {
        user_id: user.id,
        type,
        points_earned: points,
        status: 'pending',
      };

      if (type === 'new_location') {
        contributionData.name = data.name;
        contributionData.phone = data.phone;
        contributionData.address = data.address;
        contributionData.category_id = data.categoryId;
        contributionData.images = data.images;

        if (data.latitude && data.longitude) {
          contributionData.location = `POINT(${data.longitude} ${data.latitude})`;
        }
      }

      if (data.userLatitude && data.userLongitude) {
        contributionData.user_location = `POINT(${data.userLongitude} ${data.userLatitude})`;
        contributionData.distance_meters = distance;
      }

      if (data.providerId) {
        contributionData.provider_id = data.providerId;
      }

      const { data: result, error } = await supabase
        .from('contributions')
        .insert(contributionData)
        .select()
        .single();

      if (error) throw error;

      // Refresh profile and contributions
      await get().fetchProfile();
      await get().fetchContributions();

      set({ isLoading: false });
      return { success: true, points };
    } catch (err: any) {
      console.error('Error submitting contribution:', err);
      set({ error: err.message, isLoading: false });
      return { success: false, error: err.message };
    }
  },

  updateDraft: (data) => {
    set((state) => ({
      draft: { ...state.draft, ...data },
    }));
  },

  clearDraft: () => {
    set({ draft: { ...INITIAL_DRAFT } });
  },

  checkDuplicate: async (name, lat, lng) => {
    try {
      const { data, error } = await supabase.rpc('check_duplicate_location', {
        p_name: name,
        p_lat: lat,
        p_lng: lng,
        p_threshold_meters: 100,
      });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error checking duplicate:', err);
      return [];
    }
  },
}));

// Haversine formula for distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth's radius in meters
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Tier thresholds and colors
export const TIER_CONFIG = {
  bronze: { min: 0, max: 99, label: 'Dong', icon: '🥉', color: '#CD7F32' },
  silver: { min: 100, max: 299, label: 'Bac', icon: '🥈', color: '#C0C0C0' },
  gold: { min: 300, max: 999, label: 'Vang', icon: '🥇', color: '#FFD700' },
  diamond: { min: 1000, max: Infinity, label: 'Kim Cuong', icon: '💎', color: '#B9F2FF' },
};

export function getNextTier(currentPoints: number): { tier: ContributorTier; pointsNeeded: number } | null {
  if (currentPoints >= 1000) return null; // Already at max
  if (currentPoints >= 300) return { tier: 'diamond', pointsNeeded: 1000 - currentPoints };
  if (currentPoints >= 100) return { tier: 'gold', pointsNeeded: 300 - currentPoints };
  return { tier: 'silver', pointsNeeded: 100 - currentPoints };
}
