-- ═══════════════════════════════════════════════════════════
-- XE 247 Database Schema
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard
-- ═══════════════════════════════════════════════════════════

-- Enable PostGIS for location queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- ───────────────────────────────────────────────────────────
-- PROFILES TABLE (extends auth.users)
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  phone TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'consumer' CHECK (role IN ('consumer', 'provider', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ───────────────────────────────────────────────────────────
-- PROVIDERS TABLE
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES public.profiles(id),

  -- External IDs
  osm_id TEXT,
  fsq_id TEXT,
  ocm_id TEXT,
  google_place_id TEXT,

  -- Basic info
  name TEXT NOT NULL,
  phone TEXT,
  address TEXT,

  -- Location
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),
  location GEOGRAPHY(POINT, 4326),

  -- Classification
  category TEXT NOT NULL,
  services TEXT[],

  -- Business details
  working_hours JSONB,
  photos TEXT[],
  website TEXT,

  -- Ratings
  rating_avg DECIMAL(2, 1) DEFAULT 0,
  rating_count INT DEFAULT 0,

  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'rejected')),

  -- Metadata
  data_source TEXT[],
  metadata JSONB,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Unique indexes (allow multiple NULLs)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_osm ON providers(osm_id) WHERE osm_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_fsq ON providers(fsq_id) WHERE fsq_id IS NOT NULL;

-- Spatial index for location queries
CREATE INDEX IF NOT EXISTS idx_providers_location ON providers USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_providers_category ON providers(category);
CREATE INDEX IF NOT EXISTS idx_providers_status ON providers(status);

-- ───────────────────────────────────────────────────────────
-- REVIEWS TABLE
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  photos TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_reviews_provider ON reviews(provider_id);

-- ───────────────────────────────────────────────────────────
-- FAVORITES TABLE
-- ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.favorites (
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, provider_id)
);

-- ───────────────────────────────────────────────────────────
-- AUTO-UPDATE LOCATION TRIGGER
-- ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_provider_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lat IS NOT NULL AND NEW.lng IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  END IF;
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS providers_location_trigger ON providers;
CREATE TRIGGER providers_location_trigger
BEFORE INSERT OR UPDATE ON providers
FOR EACH ROW EXECUTE FUNCTION update_provider_location();

-- ───────────────────────────────────────────────────────────
-- SEARCH NEARBY FUNCTION
-- ───────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION search_nearby_providers(
  p_lat FLOAT,
  p_lng FLOAT,
  radius_km FLOAT DEFAULT 5,
  category_filter TEXT DEFAULT NULL
)
RETURNS SETOF providers AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM providers
  WHERE status = 'active'
    AND location IS NOT NULL
    AND ST_DWithin(
      location,
      ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
      radius_km * 1000
    )
    AND (category_filter IS NULL OR category = category_filter)
  ORDER BY ST_Distance(
    location,
    ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography
  )
  LIMIT 100;
END;
$$ LANGUAGE plpgsql;

-- ───────────────────────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ───────────────────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all, update own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Providers: Everyone can read active, owners can manage
CREATE POLICY "Active providers are viewable by everyone" ON providers FOR SELECT USING (status = 'active' OR status = 'pending');
CREATE POLICY "Owners can insert providers" ON providers FOR INSERT WITH CHECK (auth.uid() = owner_id OR owner_id IS NULL);
CREATE POLICY "Owners can update own providers" ON providers FOR UPDATE USING (auth.uid() = owner_id);

-- Reviews: Everyone can read, users can write own
CREATE POLICY "Reviews are viewable by everyone" ON reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert own reviews" ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON reviews FOR UPDATE USING (auth.uid() = user_id);

-- Favorites: Users manage own
CREATE POLICY "Users can view own favorites" ON favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own favorites" ON favorites FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own favorites" ON favorites FOR DELETE USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════
-- DONE! Your database is ready.
-- ═══════════════════════════════════════════════════════════
