#!/usr/bin/env node

/**
 * XE 247 - Import collected data to Supabase
 *
 * Usage:
 *   1. First run: node import-to-supabase.js --schema (outputs SQL to run in Supabase)
 *   2. Then run: node import-to-supabase.js (imports data)
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = process.env.OUTPUT_DIR || './output';
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;

const SCHEMA_SQL = `
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
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Constraints
  CONSTRAINT unique_osm UNIQUE NULLS NOT DISTINCT (osm_id),
  CONSTRAINT unique_fsq UNIQUE NULLS NOT DISTINCT (fsq_id)
);

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
`;

function printSchema() {
  console.log('═'.repeat(60));
  console.log('XE 247 - DATABASE SCHEMA');
  console.log('═'.repeat(60));
  console.log('');
  console.log('Copy and run this SQL in Supabase SQL Editor:');
  console.log('https://supabase.com/dashboard/project/jrfulqeeuxuurgvhvamj/sql/new');
  console.log('');
  console.log('─'.repeat(60));
  console.log(SCHEMA_SQL);
  console.log('─'.repeat(60));
}

async function importData() {
  console.log('═'.repeat(60));
  console.log('XE 247 - IMPORT DATA TO SUPABASE');
  console.log('═'.repeat(60));
  console.log('');

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Supabase credentials in .env');
    console.log('   Required: SUPABASE_URL, SUPABASE_ANON_KEY or SUPABASE_SERVICE_KEY');
    process.exit(1);
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Load OSM data
  const osmFile = path.join(OUTPUT_DIR, 'osm-all-providers.json');
  if (!fs.existsSync(osmFile)) {
    console.log('❌ No data found. Run collection first:');
    console.log('   node collect-osm-free.js');
    process.exit(1);
  }

  // Load only regional files (osm-providers-*.json) to avoid duplicates
  const osmFiles = fs.readdirSync(OUTPUT_DIR)
    .filter(f => f.startsWith('osm-providers-') && f.endsWith('.json'));

  console.log('📁 Loading data files...');

  const allProviders = [];
  for (const file of osmFiles) {
    const filePath = path.join(OUTPUT_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(`   ${file}: ${data.length} records`);
    allProviders.push(...data);
  }

  // Dedupe by osm_id
  const seen = new Set();
  const uniqueProviders = allProviders.filter(p => {
    if (!p.osm_id) return true; // Keep items without osm_id
    if (seen.has(p.osm_id)) return false;
    seen.add(p.osm_id);
    return true;
  });

  console.log(`\n📊 Total: ${allProviders.length} → ${uniqueProviders.length} unique providers`);

  // Fetch existing osm_ids from Supabase to skip duplicates
  console.log('🔍 Checking existing records in database...');
  const existingIds = new Set();
  let offset = 0;
  while (true) {
    const { data, error } = await supabase
      .from('providers')
      .select('osm_id')
      .not('osm_id', 'is', null)
      .range(offset, offset + 999);

    if (error || !data || data.length === 0) break;
    data.forEach(r => existingIds.add(r.osm_id));
    offset += 1000;
  }
  console.log(`   Found ${existingIds.size} existing records`);

  // Filter out already imported records
  const newProviders = uniqueProviders.filter(p => !p.osm_id || !existingIds.has(p.osm_id));
  console.log(`   New records to import: ${newProviders.length}\n`);

  if (newProviders.length === 0) {
    console.log('✅ All records already imported!');
    return;
  }

  // Transform data for Supabase
  const transformedData = newProviders.map(p => ({
    osm_id: p.osm_id || null,
    name: p.name || 'Không tên',
    phone: p.phone || null,
    address: p.address || null,
    lat: p.lat || null,
    lng: p.lng || null,
    category: p.category || 'repair',
    services: p.services || null,
    working_hours: p.working_hours || null,
    photos: p.photos || null,
    website: p.website || null,
    rating_avg: 0,
    rating_count: 0,
    status: 'active', // Auto-approve OSM data
    data_source: ['osm'],
    metadata: {
      osm_tags: p.osm_tags || p.tags,
      region_code: p.region_code, // hanoi, hcm, danang
      brand: p.brand,
      vehicle_types: p.vehicle_types,
      collected_at: p.collected_at
    }
  }));

  // Batch insert
  const batchSize = 100;
  let inserted = 0;
  let errors = 0;

  console.log('📤 Importing to Supabase...\n');

  for (let i = 0; i < transformedData.length; i += batchSize) {
    const batch = transformedData.slice(i, i + batchSize);

    const { data, error } = await supabase
      .from('providers')
      .insert(batch);

    if (error) {
      console.error(`   ❌ Batch ${Math.floor(i/batchSize) + 1}: ${error.message}`);
      errors++;
    } else {
      inserted += batch.length;
      process.stdout.write(`\r   ✓ Imported: ${inserted}/${transformedData.length}`);
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 100));
  }

  console.log('\n');
  console.log('═'.repeat(60));
  console.log('✅ IMPORT COMPLETE');
  console.log('═'.repeat(60));
  console.log(`   Inserted: ${inserted}`);
  console.log(`   Errors: ${errors}`);
  console.log('');
  console.log('📱 Data is now available in your mobile app!');
}

// Main
const command = process.argv[2];
if (command === '--schema') {
  printSchema();
} else {
  importData().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
  });
}
