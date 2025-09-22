-- Migration script to add lang column to cities, interventions, and scenarios tables
-- This script adds the lang column and migrates existing data

-- Add lang column to cities table
ALTER TABLE cities ADD COLUMN IF NOT EXISTS lang VARCHAR(2) DEFAULT 'en';

-- Add lang column to interventions table  
ALTER TABLE interventions ADD COLUMN IF NOT EXISTS lang VARCHAR(2) DEFAULT 'en';

-- Add lang column to scenarios table
ALTER TABLE scenarios ADD COLUMN IF NOT EXISTS lang VARCHAR(2) DEFAULT 'en';

-- Update existing records to have 'en' as default language
UPDATE cities SET lang = 'en' WHERE lang IS NULL;
UPDATE interventions SET lang = 'en' WHERE lang IS NULL;
UPDATE scenarios SET lang = 'en' WHERE lang IS NULL;

-- Add constraints to ensure lang is either 'en' or 'ko'
ALTER TABLE cities ADD CONSTRAINT cities_lang_check CHECK (lang IN ('en', 'ko'));
ALTER TABLE interventions ADD CONSTRAINT interventions_lang_check CHECK (lang IN ('en', 'ko'));
ALTER TABLE scenarios ADD CONSTRAINT scenarios_lang_check CHECK (lang IN ('en', 'ko'));

-- Make lang column NOT NULL after setting defaults
ALTER TABLE cities ALTER COLUMN lang SET NOT NULL;
ALTER TABLE interventions ALTER COLUMN lang SET NOT NULL;
ALTER TABLE scenarios ALTER COLUMN lang SET NOT NULL;

-- Create indexes for better performance on language filtering
CREATE INDEX IF NOT EXISTS idx_cities_lang ON cities(lang);
CREATE INDEX IF NOT EXISTS idx_interventions_lang ON interventions(lang);
CREATE INDEX IF NOT EXISTS idx_scenarios_lang ON scenarios(lang);
