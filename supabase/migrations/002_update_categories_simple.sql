-- =============================================
-- XE 247 - Update Categories
-- Run this in Supabase Dashboard > SQL Editor
-- =============================================

-- 1. Create categories reference table
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

-- 2. Insert categories
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

-- 3. Map old categories to new ones
UPDATE providers SET category = 'repair' WHERE category IN ('car_repair', 'motorcycle_repair');
UPDATE providers SET category = 'service' WHERE category = 'car_parts';
UPDATE providers SET category = 'ev_charging' WHERE category IN ('charging', 'ev');

-- 4. Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_providers_category ON providers(category);

-- 5. Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
CREATE POLICY "Categories are viewable by everyone" ON categories
    FOR SELECT USING (true);

-- 6. Grant permissions
GRANT SELECT ON categories TO anon, authenticated;

-- 7. Verify categories
SELECT * FROM categories ORDER BY display_order;

-- 8. Check provider distribution by category
SELECT category, COUNT(*) as count
FROM providers
GROUP BY category
ORDER BY count DESC;
