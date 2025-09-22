const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugKoreanData() {
  console.log('🔍 Debugging Korean data...\n');
  
  try {
    // Check Korean cities
    console.log('📊 Korean Cities:');
    const { data: koCities, error: koCitiesError } = await supabase
      .from('cities')
      .select('id, name, lang')
      .eq('lang', 'ko');
    
    if (koCitiesError) {
      console.error('❌ Error fetching Korean cities:', koCitiesError);
    } else {
      console.log(`✅ Found ${koCities.length} Korean cities:`);
      koCities.forEach(city => {
        console.log(`   - ${city.name} (${city.id}) - lang: ${city.lang}`);
      });
    }
    
    // Check Korean interventions
    console.log('\n📊 Korean Interventions:');
    const { data: koInterventions, error: koInterventionsError } = await supabase
      .from('interventions')
      .select('id, title, lang')
      .eq('lang', 'ko');
    
    if (koInterventionsError) {
      console.error('❌ Error fetching Korean interventions:', koInterventionsError);
    } else {
      console.log(`✅ Found ${koInterventions.length} Korean interventions:`);
      koInterventions.forEach(intervention => {
        console.log(`   - ${intervention.title} (${intervention.id}) - lang: ${intervention.lang}`);
      });
    }
    
    // Check Korean scenarios
    console.log('\n📊 Korean Scenarios:');
    const { data: koScenarios, error: koScenariosError } = await supabase
      .from('scenarios')
      .select('id, what_if_question, city_id, intervention_ids, lang')
      .eq('lang', 'ko');
    
    if (koScenariosError) {
      console.error('❌ Error fetching Korean scenarios:', koScenariosError);
    } else {
      console.log(`✅ Found ${koScenarios.length} Korean scenarios:`);
      koScenarios.forEach(scenario => {
        console.log(`   - ${scenario.what_if_question}`);
        console.log(`     City ID: ${scenario.city_id}`);
        console.log(`     Intervention IDs: ${scenario.intervention_ids?.join(', ')}`);
        console.log(`     Lang: ${scenario.lang}`);
      });
    }
    
    // Check if Korean scenarios reference Korean cities/interventions
    if (koScenarios && koScenarios.length > 0) {
      console.log('\n🔍 Checking scenario data consistency...');
      
      for (const scenario of koScenarios) {
        console.log(`\nScenario: ${scenario.what_if_question}`);
        
        // Check if city exists in Korean data
        const cityExists = koCities?.find(c => c.id === scenario.city_id);
        console.log(`   City ${scenario.city_id}: ${cityExists ? '✅ Found' : '❌ NOT FOUND'}`);
        
        // Check if interventions exist in Korean data
        if (scenario.intervention_ids) {
          for (const interventionId of scenario.intervention_ids) {
            const interventionExists = koInterventions?.find(i => i.id === interventionId);
            console.log(`   Intervention ${interventionId}: ${interventionExists ? '✅ Found' : '❌ NOT FOUND'}`);
          }
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Debug failed:', error);
    process.exit(1);
  }
}

debugKoreanData();
