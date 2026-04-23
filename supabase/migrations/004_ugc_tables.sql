-- =============================================
-- XE 247 - User-Generated Content (UGC) Tables
-- Version: 2.1
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

-- =============================================================================
-- 1. CONTRIBUTOR PROFILES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS contributor_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Points & Tier
    total_points INT DEFAULT 0,
    tier VARCHAR(20) DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'diamond')),

    -- Stats
    locations_added INT DEFAULT 0,
    locations_updated INT DEFAULT 0,
    photos_uploaded INT DEFAULT 0,
    reports_submitted INT DEFAULT 0,
    total_views INT DEFAULT 0,

    -- Badges (JSON array of badge slugs)
    badges JSONB DEFAULT '[]'::jsonb,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 2. BADGES TABLE
-- =============================================================================

CREATE TABLE IF NOT EXISTS badges (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    criteria JSONB,
    points_required INT,
    tier_required VARCHAR(20),

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed default badges
INSERT INTO badges (slug, name, description, icon, criteria) VALUES
    ('explorer', 'Nguoi kham pha', 'Them dia diem dau tien', '🔍', '{"type": "locations_added", "count": 1}'),
    ('scout_10', 'Trinh sat', 'Them 10 dia diem', '🗺️', '{"type": "locations_added", "count": 10}'),
    ('scout_50', 'Tham hiem gia', 'Them 50 dia diem', '🧭', '{"type": "locations_added", "count": 50}'),
    ('photographer', 'Nhiep anh gia', 'Upload 10 anh', '📸', '{"type": "photos_uploaded", "count": 10}'),
    ('quality_hunter', 'Tho san chat luong', '10 contributions duoc approved', '✅', '{"type": "approved_contributions", "count": 10}'),
    ('data_cleaner', 'Nguoi don dep', 'Bao cao 5 tiem da dong cua chinh xac', '🧹', '{"type": "accurate_closures", "count": 5}'),
    ('rising_star', 'Ngoi sao dang len', 'Dat hang Bac', '⭐', '{"type": "tier", "value": "silver"}'),
    ('contributor_gold', 'Cong hien vang', 'Dat hang Vang', '🥇', '{"type": "tier", "value": "gold"}'),
    ('legend', 'Huyen thoai', 'Dat hang Kim Cuong', '💎', '{"type": "tier", "value": "diamond"}')
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- 3. CONTRIBUTIONS TABLE
-- =============================================================================

CREATE TYPE contribution_type AS ENUM ('new_location', 'update_info', 'add_photo', 'report_closed');
CREATE TYPE contribution_status AS ENUM ('pending', 'approved', 'rejected', 'merged');

CREATE TABLE IF NOT EXISTS contributions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Contribution type
    type contribution_type NOT NULL,

    -- Location data (for new_location type)
    name VARCHAR(200),
    phone VARCHAR(20),
    address TEXT,
    location GEOGRAPHY(POINT, 4326),
    category_id TEXT REFERENCES categories(key),

    -- Images
    images TEXT[],

    -- For updates to existing providers
    provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,
    update_field VARCHAR(50),
    old_value TEXT,
    new_value TEXT,

    -- Verification data
    user_location GEOGRAPHY(POINT, 4326),
    distance_meters DECIMAL(10,2),
    ocr_confidence DECIMAL(3,2),
    photo_verified BOOLEAN DEFAULT false,

    -- Points
    points_earned INT DEFAULT 0,

    -- Status
    status contribution_status DEFAULT 'pending',
    rejection_reason TEXT,
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMPTZ,

    -- If approved, link to created/updated provider
    result_provider_id UUID REFERENCES providers(id) ON DELETE SET NULL,

    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================================================
-- 4. ADD discovered_by TO PROVIDERS
-- =============================================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'providers' AND column_name = 'discovered_by'
    ) THEN
        ALTER TABLE providers ADD COLUMN discovered_by UUID REFERENCES auth.users(id);
        ALTER TABLE providers ADD COLUMN discovered_at TIMESTAMPTZ;
    END IF;
END $$;

-- =============================================================================
-- 5. INDEXES
-- =============================================================================

CREATE INDEX IF NOT EXISTS idx_contributor_profiles_user_id ON contributor_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_contributor_profiles_tier ON contributor_profiles(tier);
CREATE INDEX IF NOT EXISTS idx_contributor_profiles_points ON contributor_profiles(total_points DESC);

CREATE INDEX IF NOT EXISTS idx_contributions_user_id ON contributions(user_id);
CREATE INDEX IF NOT EXISTS idx_contributions_status ON contributions(status);
CREATE INDEX IF NOT EXISTS idx_contributions_created_at ON contributions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contributions_type ON contributions(type);

-- Spatial index for location-based queries
CREATE INDEX IF NOT EXISTS idx_contributions_location ON contributions USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_contributions_user_location ON contributions USING GIST(user_location);

-- =============================================================================
-- 6. ROW LEVEL SECURITY
-- =============================================================================

ALTER TABLE contributor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

-- Contributor profiles policies
DROP POLICY IF EXISTS "Users can view own profile" ON contributor_profiles;
CREATE POLICY "Users can view own profile" ON contributor_profiles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view all profiles for leaderboard" ON contributor_profiles;
CREATE POLICY "Users can view all profiles for leaderboard" ON contributor_profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "System can insert profile" ON contributor_profiles;
CREATE POLICY "System can insert profile" ON contributor_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "System can update own profile" ON contributor_profiles;
CREATE POLICY "System can update own profile" ON contributor_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Contributions policies
DROP POLICY IF EXISTS "Users can view own contributions" ON contributions;
CREATE POLICY "Users can view own contributions" ON contributions
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert contributions" ON contributions;
CREATE POLICY "Users can insert contributions" ON contributions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Badges are public
DROP POLICY IF EXISTS "Anyone can view badges" ON badges;
CREATE POLICY "Anyone can view badges" ON badges
    FOR SELECT USING (true);

-- =============================================================================
-- 7. FUNCTIONS
-- =============================================================================

-- Auto-create contributor profile on first contribution
CREATE OR REPLACE FUNCTION ensure_contributor_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO contributor_profiles (user_id)
    VALUES (NEW.user_id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS ensure_contributor_profile_trigger ON contributions;
CREATE TRIGGER ensure_contributor_profile_trigger
    BEFORE INSERT ON contributions
    FOR EACH ROW EXECUTE FUNCTION ensure_contributor_profile();

-- Calculate points based on contribution type
CREATE OR REPLACE FUNCTION calculate_contribution_points(
    p_type contribution_type,
    p_has_photo BOOLEAN
)
RETURNS INT AS $$
BEGIN
    CASE p_type
        WHEN 'new_location' THEN
            IF p_has_photo THEN RETURN 15;
            ELSE RETURN 5;
            END IF;
        WHEN 'update_info' THEN RETURN 5;
        WHEN 'add_photo' THEN RETURN 3;
        WHEN 'report_closed' THEN RETURN 8;
        ELSE RETURN 0;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Update contributor stats when contribution is approved
CREATE OR REPLACE FUNCTION update_contributor_stats()
RETURNS TRIGGER AS $$
DECLARE
    new_tier VARCHAR(20);
    new_total INT;
BEGIN
    IF NEW.status = 'approved' AND (OLD.status IS NULL OR OLD.status = 'pending') THEN
        -- Calculate new total
        SELECT total_points + NEW.points_earned INTO new_total
        FROM contributor_profiles WHERE user_id = NEW.user_id;

        -- Determine tier
        new_tier := CASE
            WHEN new_total >= 1000 THEN 'diamond'
            WHEN new_total >= 300 THEN 'gold'
            WHEN new_total >= 100 THEN 'silver'
            ELSE 'bronze'
        END;

        -- Update stats
        UPDATE contributor_profiles SET
            total_points = total_points + NEW.points_earned,
            locations_added = CASE WHEN NEW.type = 'new_location' THEN locations_added + 1 ELSE locations_added END,
            locations_updated = CASE WHEN NEW.type = 'update_info' THEN locations_updated + 1 ELSE locations_updated END,
            photos_uploaded = CASE WHEN NEW.type = 'add_photo' THEN photos_uploaded + 1 ELSE photos_uploaded END,
            reports_submitted = CASE WHEN NEW.type = 'report_closed' THEN reports_submitted + 1 ELSE reports_submitted END,
            tier = new_tier,
            updated_at = NOW()
        WHERE user_id = NEW.user_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS update_contributor_after_approval ON contributions;
CREATE TRIGGER update_contributor_after_approval
    AFTER UPDATE ON contributions
    FOR EACH ROW EXECUTE FUNCTION update_contributor_stats();

-- Get or create contributor profile
CREATE OR REPLACE FUNCTION get_or_create_contributor_profile(p_user_id UUID)
RETURNS contributor_profiles AS $$
DECLARE
    profile contributor_profiles;
BEGIN
    SELECT * INTO profile FROM contributor_profiles WHERE user_id = p_user_id;

    IF profile IS NULL THEN
        INSERT INTO contributor_profiles (user_id)
        VALUES (p_user_id)
        RETURNING * INTO profile;
    END IF;

    RETURN profile;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check for duplicate location
CREATE OR REPLACE FUNCTION check_duplicate_location(
    p_name VARCHAR,
    p_lat DOUBLE PRECISION,
    p_lng DOUBLE PRECISION,
    p_threshold_meters INT DEFAULT 100
)
RETURNS TABLE (
    provider_id UUID,
    provider_name VARCHAR,
    distance_meters DOUBLE PRECISION,
    similarity DOUBLE PRECISION
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.name,
        ST_Distance(
            p.location::geography,
            ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography
        ) as dist,
        similarity(p.name, p_name) as sim
    FROM providers p
    WHERE ST_DWithin(
        p.location::geography,
        ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
        p_threshold_meters
    )
    AND similarity(p.name, p_name) > 0.3
    ORDER BY sim DESC, dist ASC
    LIMIT 5;
END;
$$ LANGUAGE plpgsql;

-- Get leaderboard
CREATE OR REPLACE FUNCTION get_contributor_leaderboard(
    p_limit INT DEFAULT 50
)
RETURNS TABLE (
    rank BIGINT,
    user_id UUID,
    total_points INT,
    tier VARCHAR,
    locations_added INT,
    badges JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        ROW_NUMBER() OVER (ORDER BY cp.total_points DESC) as rank,
        cp.user_id,
        cp.total_points,
        cp.tier,
        cp.locations_added,
        cp.badges
    FROM contributor_profiles cp
    WHERE cp.total_points > 0
    ORDER BY cp.total_points DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

-- =============================================================================
-- 8. GRANT PERMISSIONS
-- =============================================================================

GRANT SELECT ON contributor_profiles TO authenticated;
GRANT INSERT, UPDATE ON contributor_profiles TO authenticated;
GRANT SELECT, INSERT ON contributions TO authenticated;
GRANT SELECT ON badges TO authenticated;

GRANT EXECUTE ON FUNCTION get_or_create_contributor_profile TO authenticated;
GRANT EXECUTE ON FUNCTION check_duplicate_location TO authenticated;
GRANT EXECUTE ON FUNCTION get_contributor_leaderboard TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_contribution_points TO authenticated;

-- =============================================================================
-- 9. ENABLE pg_trgm FOR FUZZY MATCHING
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- =============================================================================
-- 10. VERIFY
-- =============================================================================

SELECT 'UGC tables created successfully' as status;
SELECT COUNT(*) as badge_count FROM badges;
