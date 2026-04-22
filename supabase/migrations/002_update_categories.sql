-- Migration: Update provider categories
-- New categories: repair, service, tuning, car_wash, rescue, ev_charging

-- 1. First, check if category column exists and its type
-- If it's an ENUM, we need to add new values
-- If it's TEXT/VARCHAR, we just need to update the data

-- 2. Create or replace the category enum type (if using enum)
DO $$
BEGIN
    -- Drop the old type if it exists and recreate
    -- Note: This requires no active references, so we use ALTER TYPE ADD VALUE instead

    -- Add new enum values if they don't exist
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'provider_category') THEN
        -- Add new values to existing enum
        BEGIN
            ALTER TYPE provider_category ADD VALUE IF NOT EXISTS 'repair';
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
        BEGIN
            ALTER TYPE provider_category ADD VALUE IF NOT EXISTS 'service';
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
        BEGIN
            ALTER TYPE provider_category ADD VALUE IF NOT EXISTS 'tuning';
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
        BEGIN
            ALTER TYPE provider_category ADD VALUE IF NOT EXISTS 'car_wash';
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
        BEGIN
            ALTER TYPE provider_category ADD VALUE IF NOT EXISTS 'rescue';
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
        BEGIN
            ALTER TYPE provider_category ADD VALUE IF NOT EXISTS 'ev_charging';
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
    END IF;
END $$;

-- 3. Create a reference table for categories (optional but recommended)
CREATE TABLE IF NOT EXISTS categories (
    key TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_vi TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Insert/Update categories
INSERT INTO categories (key, name, name_vi, icon, color, display_order) VALUES
    ('repair', 'Repair', 'Sửa chữa', 'construct', '#ff385c', 1),
    ('service', 'Service', 'Xưởng dịch vụ', 'car-sport', '#00a699', 2),
    ('tuning', 'Tuning', 'Độ xe', 'speedometer', '#fc642d', 3),
    ('car_wash', 'Car Wash', 'Rửa xe', 'water', '#428bff', 4),
    ('rescue', 'Rescue', 'Cứu hộ', 'warning', '#e00b41', 5),
    ('ev_charging', 'EV Charging', 'Sạc EV', 'flash', '#00d1b2', 6)
ON CONFLICT (key) DO UPDATE SET
    name = EXCLUDED.name,
    name_vi = EXCLUDED.name_vi,
    icon = EXCLUDED.icon,
    color = EXCLUDED.color,
    display_order = EXCLUDED.display_order;

-- 5. Map old categories to new ones (if needed)
-- Example mappings - adjust based on your actual old data
UPDATE providers SET category = 'repair' WHERE category IN ('car_repair', 'motorcycle_repair', 'repair');
UPDATE providers SET category = 'service' WHERE category IN ('car_parts', 'parts', 'service');
UPDATE providers SET category = 'car_wash' WHERE category IN ('car_wash', 'wash');
UPDATE providers SET category = 'ev_charging' WHERE category IN ('ev_charging', 'charging', 'ev');
UPDATE providers SET category = 'rescue' WHERE category IN ('rescue', 'towing', 'roadside');
UPDATE providers SET category = 'tuning' WHERE category IN ('tuning', 'modification', 'custom');

-- 6. Create index on category for faster filtering
CREATE INDEX IF NOT EXISTS idx_providers_category ON providers(category);

-- 7. Update the search_nearby_providers function to support new categories
CREATE OR REPLACE FUNCTION search_nearby_providers(
    p_lat DOUBLE PRECISION,
    p_lng DOUBLE PRECISION,
    radius_km INTEGER DEFAULT 10,
    category_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    owner_id UUID,
    name TEXT,
    phone TEXT,
    address TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    category TEXT,
    services TEXT[],
    working_hours JSONB,
    images TEXT[],
    rating NUMERIC,
    review_count INTEGER,
    is_verified BOOLEAN,
    is_open BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    distance_km DOUBLE PRECISION
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.owner_id,
        p.name,
        p.phone,
        p.address,
        p.lat,
        p.lng,
        p.category,
        p.services,
        p.working_hours,
        p.images,
        p.rating,
        p.review_count,
        p.is_verified,
        p.is_open,
        p.created_at,
        p.updated_at,
        (
            6371 * acos(
                cos(radians(p_lat)) * cos(radians(p.lat)) *
                cos(radians(p.lng) - radians(p_lng)) +
                sin(radians(p_lat)) * sin(radians(p.lat))
            )
        ) AS distance_km
    FROM providers p
    WHERE
        p.lat IS NOT NULL
        AND p.lng IS NOT NULL
        AND (category_filter IS NULL OR p.category = category_filter)
        AND (
            6371 * acos(
                cos(radians(p_lat)) * cos(radians(p.lat)) *
                cos(radians(p.lng) - radians(p_lng)) +
                sin(radians(p_lat)) * sin(radians(p.lat))
            )
        ) <= radius_km
    ORDER BY distance_km
    LIMIT 100;
END;
$$;

-- 8. Grant permissions
GRANT SELECT ON categories TO anon, authenticated;
GRANT EXECUTE ON FUNCTION search_nearby_providers TO anon, authenticated;

-- 9. Add RLS policy for categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);
