const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkPublicStatus() {
  console.log('🔍 Checking public status of Korean data...\n');
  
  try {
    // Check Korean cities with public status
    console.log('📊 Korean Cities (all):');
    const { data: allKoCities, error: allKoCitiesError } = await supabase
      .from('cities')
      .select('id, name, lang, is_public')
      .eq('lang', 'ko');
    
    if (allKoCitiesError) {
      console.error('❌ Error fetching Korean cities:', allKoCitiesError);
    } else {
      console.log(`✅ Found ${allKoCities.length} Korean cities:`);
      allKoCities.forEach(city => {
        console.log(`   - ${city.name} (${city.id}) - public: ${city.is_public}`);
      });
    }
    
    // Check Korean interventions with public status
    console.log('\n📊 Korean Interventions (all):');
    const { data: allKoInterventions, error: allKoInterventionsError } = await supabase
      .from('interventions')
      .select('id, title, lang, is_public')
      .eq('lang', 'ko');
    
    if (allKoInterventionsError) {
      console.error('❌ Error fetching Korean interventions:', allKoInterventionsError);
    } else {
      console.log(`✅ Found ${allKoInterventions.length} Korean interventions:`);
      allKoInterventions.forEach(intervention => {
        console.log(`   - ${intervention.title} (${intervention.id}) - public: ${intervention.is_public}`);
      });
    }
    
    // Check what happens when we query for public Korean data
    console.log('\n📊 Public Korean Cities:');
    const { data: publicKoCities, error: publicKoCitiesError } = await supabase
      .from('cities')
      .select('id, name, lang, is_public')
      .eq('lang', 'ko')
      .eq('is_public', true);
    
    if (publicKoCitiesError) {
      console.error('❌ Error fetching public Korean cities:', publicKoCitiesError);
    } else {
      console.log(`✅ Found ${publicKoCities.length} public Korean cities`);
    }
    
    // Check what happens when we query for public Korean interventions
    console.log('\n📊 Public Korean Interventions:');
    const { data: publicKoInterventions, error: publicKoInterventionsError } = await supabase
      .from('interventions')
      .select('id, title, lang, is_public')
      .eq('lang', 'ko')
      .eq('is_public', true);
    
    if (publicKoInterventionsError) {
      console.error('❌ Error fetching public Korean interventions:', publicKoInterventionsError);
    } else {
      console.log(`✅ Found ${publicKoInterventions.length} public Korean interventions`);
    }
    
  } catch (error) {
    console.error('❌ Check failed:', error);
    process.exit(1);
  }
}

checkPublicStatus();
