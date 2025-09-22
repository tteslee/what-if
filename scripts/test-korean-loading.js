const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testKoreanLoading() {
  console.log('🧪 Testing Korean data loading...\n');
  
  try {
    // Simulate the same logic as the scenario result page
    const scenarioLang = 'ko';
    const cityId = 'custom-1758554471539'; // Seoul city ID
    const interventionIds = ['custom-1758554835666', 'custom-1758554982795']; // Korean intervention IDs
    
    console.log(`Loading data for language: ${scenarioLang}`);
    console.log(`Looking for city: ${cityId}`);
    console.log(`Looking for interventions: ${interventionIds.join(', ')}`);
    
    // Load cities in Korean
    const { data: citiesData, error: citiesError } = await supabase
      .from('cities')
      .select('*')
      .eq('is_public', true)
      .eq('lang', scenarioLang)
      .order('name');
    
    if (citiesError) {
      console.error('❌ Error fetching cities:', citiesError);
    } else {
      console.log(`✅ Loaded ${citiesData.length} Korean cities`);
      const foundCity = citiesData.find(c => c.id === cityId);
      console.log(`   Found city: ${foundCity ? foundCity.name : 'NOT FOUND'}`);
    }
    
    // Load interventions in Korean
    const { data: interventionsData, error: interventionsError } = await supabase
      .from('interventions')
      .select('*')
      .eq('is_public', true)
      .eq('lang', scenarioLang)
      .order('title');
    
    if (interventionsError) {
      console.error('❌ Error fetching interventions:', interventionsError);
    } else {
      console.log(`✅ Loaded ${interventionsData.length} Korean interventions`);
      const foundInterventions = interventionsData.filter(i => interventionIds.includes(i.id));
      console.log(`   Found interventions: ${foundInterventions.length}`);
      foundInterventions.forEach(intervention => {
        console.log(`     - ${intervention.title} (${intervention.id})`);
      });
    }
    
    // Test the database service logic
    console.log('\n🔧 Testing database service logic...');
    
    // Transform city data (simulate transformCityFromDB)
    const transformedCities = citiesData?.map(city => ({
      id: city.id,
      name: city.name,
      scale: city.scale,
      mainChallenges: city.main_challenges || [],
      populationContext: city.population_context || { size: '', demographics: '' },
      neighbourhoodCharacteristics: city.neighbourhood_characteristics || '',
      vulnerableGroups: city.vulnerable_groups || [],
      regulatoryContext: city.regulatory_context || '',
      timeline: city.timeline || '',
      budgetConstraints: city.budget_constraints || '',
      existingAssets: city.existing_assets || [],
      lang: city.lang || 'en',
    })) || [];
    
    const foundTransformedCity = transformedCities.find(c => c.id === cityId);
    console.log(`   Transformed city found: ${foundTransformedCity ? foundTransformedCity.name : 'NOT FOUND'}`);
    
    // Transform intervention data (simulate transformInterventionFromDB)
    const transformedInterventions = interventionsData?.map(intervention => ({
      id: intervention.id,
      title: intervention.title,
      summary: intervention.summary,
      category: intervention.category,
      scopeOfApplication: intervention.scope_of_application,
      detailedDescription: intervention.detailed_description || '',
      parameters: intervention.parameters || [],
      synergies: intervention.synergies || [],
      intendedOutcomes: intervention.intended_outcomes || [],
      stakeholderFocus: intervention.stakeholder_focus || [],
      implementationNotes: intervention.implementation_notes || '',
      risks: intervention.risks || [],
      lang: intervention.lang || 'en',
    })) || [];
    
    const foundTransformedInterventions = transformedInterventions.filter(i => interventionIds.includes(i.id));
    console.log(`   Transformed interventions found: ${foundTransformedInterventions.length}`);
    foundTransformedInterventions.forEach(intervention => {
      console.log(`     - ${intervention.title} (${intervention.id})`);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testKoreanLoading();
