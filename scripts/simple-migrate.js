const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateLangColumns() {
  console.log('🚀 Starting language column migration...');
  
  try {
    // First, let's check the current state of the tables
    console.log('\n📊 Checking current table state...');
    
    const { data: citiesBefore, error: citiesError } = await supabase
      .from('cities')
      .select('id, name')
      .limit(3);
    
    if (citiesError) {
      console.error('Error checking cities:', citiesError);
    } else {
      console.log('Cities before migration:', citiesBefore);
    }
    
    // Since we can't run raw SQL through the client easily,
    // let's provide instructions for manual execution
    console.log('\n📝 Manual Migration Required');
    console.log('Please run the following SQL commands in your Supabase SQL Editor:');
    console.log('\n' + '='.repeat(60));
    console.log(`
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
    `);
    console.log('='.repeat(60));
    
    console.log('\n✅ After running the SQL above, your database will have:');
    console.log('   - lang column in cities, interventions, and scenarios tables');
    console.log('   - All existing data will have lang = "en"');
    console.log('   - Proper constraints and indexes for performance');
    console.log('   - Korean custom cities will be properly tagged when created');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

migrateLangColumns();
