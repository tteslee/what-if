-- ROLLBACK SCRIPT - Use this if you need to undo the lang column migration
-- WARNING: This will remove the lang columns and all language data!

-- Drop indexes first
DROP INDEX IF EXISTS idx_cities_lang;
DROP INDEX IF EXISTS idx_interventions_lang;
DROP INDEX IF EXISTS idx_scenarios_lang;

-- Drop constraints
ALTER TABLE cities DROP CONSTRAINT IF EXISTS cities_lang_check;
ALTER TABLE interventions DROP CONSTRAINT IF EXISTS interventions_lang_check;
ALTER TABLE scenarios DROP CONSTRAINT IF EXISTS scenarios_lang_check;

-- Drop the lang columns
ALTER TABLE cities DROP COLUMN IF EXISTS lang;
ALTER TABLE interventions DROP COLUMN IF EXISTS lang;
ALTER TABLE scenarios DROP COLUMN IF EXISTS lang;
