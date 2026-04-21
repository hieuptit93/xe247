-- Fix unique constraint to allow multiple NULL values
ALTER TABLE providers DROP CONSTRAINT IF EXISTS unique_osm;
ALTER TABLE providers DROP CONSTRAINT IF EXISTS unique_fsq;

-- Recreate with standard UNIQUE (allows multiple NULLs)
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_osm ON providers(osm_id) WHERE osm_id IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_fsq ON providers(fsq_id) WHERE fsq_id IS NOT NULL;
