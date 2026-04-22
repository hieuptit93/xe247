-- =============================================
-- XE 247 - Create Favorites Table
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

-- 1. Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider_id UUID NOT NULL REFERENCES providers(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),

    -- Prevent duplicate favorites
    UNIQUE(user_id, provider_id)
);

-- 2. Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_provider_id ON favorites(provider_id);
CREATE INDEX IF NOT EXISTS idx_favorites_created_at ON favorites(created_at DESC);

-- 3. Enable RLS
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies
-- Users can view their own favorites
DROP POLICY IF EXISTS "Users can view own favorites" ON favorites;
CREATE POLICY "Users can view own favorites" ON favorites
    FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own favorites
DROP POLICY IF EXISTS "Users can insert own favorites" ON favorites;
CREATE POLICY "Users can insert own favorites" ON favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
DROP POLICY IF EXISTS "Users can delete own favorites" ON favorites;
CREATE POLICY "Users can delete own favorites" ON favorites
    FOR DELETE USING (auth.uid() = user_id);

-- 5. Grant permissions
GRANT SELECT, INSERT, DELETE ON favorites TO authenticated;

-- 6. Create a function to get favorite count for a provider
CREATE OR REPLACE FUNCTION get_provider_favorite_count(p_provider_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM favorites WHERE provider_id = p_provider_id);
END;
$$;

-- 7. Create a function to check if user has favorited a provider
CREATE OR REPLACE FUNCTION is_favorite(p_user_id UUID, p_provider_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM favorites
        WHERE user_id = p_user_id AND provider_id = p_provider_id
    );
END;
$$;

-- 8. Grant execute permissions
GRANT EXECUTE ON FUNCTION get_provider_favorite_count TO authenticated;
GRANT EXECUTE ON FUNCTION is_favorite TO authenticated;

-- 9. Verify table created
SELECT 'favorites table created successfully' as status;
