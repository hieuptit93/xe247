export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          phone: string | null;
          full_name: string | null;
          avatar_url: string | null;
          role: 'consumer' | 'provider' | 'admin';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          phone?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'consumer' | 'provider' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          phone?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          role?: 'consumer' | 'provider' | 'admin';
          created_at?: string;
          updated_at?: string;
        };
      };
      providers: {
        Row: {
          id: string;
          owner_id: string | null;
          name: string;
          phone: string | null;
          address: string | null;
          lat: number | null;
          lng: number | null;
          category: string;
          services: string[] | null;
          working_hours: Json | null;
          photos: string[] | null;
          rating_avg: number;
          rating_count: number;
          status: 'pending' | 'active' | 'inactive';
          metadata: Json | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id?: string | null;
          name: string;
          phone?: string | null;
          address?: string | null;
          lat?: number | null;
          lng?: number | null;
          category: string;
          services?: string[] | null;
          working_hours?: Json | null;
          photos?: string[] | null;
          rating_avg?: number;
          rating_count?: number;
          status?: 'pending' | 'active' | 'inactive';
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string | null;
          name?: string;
          phone?: string | null;
          address?: string | null;
          lat?: number | null;
          lng?: number | null;
          category?: string;
          services?: string[] | null;
          working_hours?: Json | null;
          photos?: string[] | null;
          rating_avg?: number;
          rating_count?: number;
          status?: 'pending' | 'active' | 'inactive';
          metadata?: Json | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          provider_id: string;
          user_id: string;
          rating: number;
          comment: string | null;
          photos: string[] | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          user_id: string;
          rating: number;
          comment?: string | null;
          photos?: string[] | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          user_id?: string;
          rating?: number;
          comment?: string | null;
          photos?: string[] | null;
          created_at?: string;
        };
      };
      favorites: {
        Row: {
          user_id: string;
          provider_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          provider_id: string;
          created_at?: string;
        };
        Update: {
          user_id?: string;
          provider_id?: string;
          created_at?: string;
        };
      };
    };
    Functions: {
      search_nearby_providers: {
        Args: {
          p_lat: number;
          p_lng: number;
          radius_km?: number;
          category_filter?: string | null;
        };
        Returns: Database['public']['Tables']['providers']['Row'][];
      };
    };
  };
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Provider = Database['public']['Tables']['providers']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type Favorite = Database['public']['Tables']['favorites']['Row'];
