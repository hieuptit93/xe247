/**
 * XE 247 - Export collected data to Supabase
 *
 * Usage: node export-to-supabase.js
 *
 * Prerequisites:
 * 1. Create Supabase project at https://supabase.com
 * 2. Run the SQL schema below in Supabase SQL Editor
 * 3. Add SUPABASE_URL and SUPABASE_KEY to .env
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

// You'll need to install: npm install @supabase/supabase-js
// const { createClient } = require('@supabase/supabase-js');

const OUTPUT_DIR = process.env.OUTPUT_DIR || './output';

/*
=== SUPABASE SCHEMA ===
Run this SQL in your Supabase SQL Editor:

-- Enable PostGIS for location queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Providers table
CREATE TABLE providers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  google_place_id TEXT UNIQUE,
  name TEXT NOT NULL,
  phone TEXT,
  phone_intl TEXT,
  zalo_id TEXT,
  facebook_url TEXT,
  website TEXT,
  google_maps_url TEXT,

  address TEXT,
  location GEOGRAPHY(POINT, 4326),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),

  city_code TEXT,
  city_name TEXT,
  district TEXT,

  rating_avg DECIMAL(2, 1),
  rating_count INTEGER DEFAULT 0,

  working_hours JSONB,
  is_open_now BOOLEAN,

  categories TEXT[],
  google_types TEXT[],

  photos JSONB,

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended', 'rejected')),
  business_status TEXT,

  data_source TEXT,
  collected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- EV Stations table
CREATE TABLE charging_stations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ocm_id TEXT UNIQUE,
  uuid TEXT,
  name TEXT NOT NULL,

  operator TEXT,
  operator_website TEXT,

  address TEXT,
  address_line2 TEXT,
  city TEXT,
  state TEXT,
  postcode TEXT,
  country TEXT DEFAULT 'VN',

  location GEOGRAPHY(POINT, 4326),
  lat DECIMAL(10, 8),
  lng DECIMAL(11, 8),

  chargers JSONB,
  total_ports INTEGER,
  max_power_kw DECIMAL(6, 2),

  status TEXT DEFAULT 'active',
  status_title TEXT,

  usage_type TEXT,
  is_free BOOLEAN DEFAULT FALSE,
  usage_cost TEXT,

  phone TEXT,
  email TEXT,
  website TEXT,

  photos JSONB,
  amenities TEXT[],

  general_comments TEXT,
  access_comments TEXT,

  date_last_verified TIMESTAMPTZ,
  date_last_status_update TIMESTAMPTZ,

  data_source TEXT,
  collected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_vi TEXT NOT NULL,
  icon TEXT,
  parent_id TEXT REFERENCES categories(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (id, name, name_vi, icon, sort_order) VALUES
('rescue', 'Rescue', 'Cứu hộ', '🆘', 1),
('repair', 'Repair', 'Sửa chữa', '🔧', 2),
('carwash', 'Car Wash', 'Rửa xe', '🚿', 3),
('customization', 'Customization', 'Độ xe', '🏎️', 4),
('ev_charging', 'EV Charging', 'Trạm sạc', '⚡', 5),
('maintenance', 'Maintenance', 'Bảo dưỡng', '⚙️', 6),
('tires', 'Tires', 'Lốp xe', '🛞', 7),
('painting', 'Painting', 'Đồng sơn', '🎨', 8);

-- Reviews table
CREATE TABLE reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID REFERENCES providers(id),
  station_id UUID REFERENCES charging_stations(id),
  user_id UUID,

  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  tags TEXT[],
  comment TEXT,
  photos JSONB,

  provider_reply TEXT,
  provider_reply_at TIMESTAMPTZ,

  source TEXT, -- 'app', 'google_import'
  google_author TEXT,
  google_timestamp BIGINT,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_providers_location ON providers USING GIST (location);
CREATE INDEX idx_providers_city ON providers (city_code);
CREATE INDEX idx_providers_categories ON providers USING GIN (categories);
CREATE INDEX idx_providers_status ON providers (status);
CREATE INDEX idx_providers_rating ON providers (rating_avg DESC NULLS LAST);

CREATE INDEX idx_stations_location ON charging_stations USING GIST (location);
CREATE INDEX idx_stations_status ON charging_stations (status);
CREATE INDEX idx_stations_operator ON charging_stations (operator);

-- Function to update location from lat/lng
CREATE OR REPLACE FUNCTION update_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.lat IS NOT NULL AND NEW.lng IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.lng, NEW.lat), 4326)::geography;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER providers_location_trigger
BEFORE INSERT OR UPDATE ON providers
FOR EACH ROW EXECUTE FUNCTION update_location();

CREATE TRIGGER stations_location_trigger
BEFORE INSERT OR UPDATE ON charging_stations
FOR EACH ROW EXECUTE FUNCTION update_location();

*/

async function exportToSupabase() {
  console.log('📤 Export to Supabase\n');

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY; // Use service key for admin access

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.log('❌ Supabase credentials not found in .env');
    console.log('');
    console.log('Add these to your .env file:');
    console.log('  SUPABASE_URL=https://your-project.supabase.co');
    console.log('  SUPABASE_SERVICE_KEY=your-service-role-key');
    console.log('');
    console.log('Get these from: Supabase Dashboard → Settings → API');
    console.log('');
    console.log('Also run the SQL schema in Supabase SQL Editor first.');
    console.log('Schema is included in the comments of this file.');
    process.exit(1);
  }

  // Uncomment when ready to use:
  // const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // Load collected data
  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(OUTPUT_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    console.log(`📁 Processing ${file} (${data.length} records)...`);

    // Determine table based on filename
    const table = file.includes('ev-station') ? 'charging_stations' : 'providers';

    // Batch insert (Supabase supports up to 1000 rows per insert)
    const batchSize = 100;
    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);

      // Uncomment when ready:
      // const { data: result, error } = await supabase
      //   .from(table)
      //   .upsert(batch, { onConflict: table === 'providers' ? 'google_place_id' : 'ocm_id' });

      // if (error) {
      //   console.error(`   Error inserting batch: ${error.message}`);
      // } else {
      //   console.log(`   Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(data.length/batchSize)}`);
      // }

      console.log(`   [DRY RUN] Would insert batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(data.length/batchSize)}`);
    }
  }

  console.log('\n✅ Export complete!');
}

// Export to CSV as alternative
async function exportToCSV() {
  console.log('📤 Export to CSV\n');

  const files = fs.readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const filePath = path.join(OUTPUT_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (data.length === 0) continue;

    // Get headers from first object
    const headers = Object.keys(data[0]);

    // Convert to CSV
    const csvRows = [headers.join(',')];
    for (const row of data) {
      const values = headers.map(h => {
        const val = row[h];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return `"${JSON.stringify(val).replace(/"/g, '""')}"`;
        if (typeof val === 'string' && (val.includes(',') || val.includes('"') || val.includes('\n'))) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });
      csvRows.push(values.join(','));
    }

    const csvPath = filePath.replace('.json', '.csv');
    fs.writeFileSync(csvPath, csvRows.join('\n'));
    console.log(`   ${file} → ${path.basename(csvPath)}`);
  }

  console.log('\n✅ CSV export complete!');
}

// Run based on command
const command = process.argv[2];
if (command === '--csv') {
  exportToCSV().catch(console.error);
} else {
  exportToSupabase().catch(console.error);
}
