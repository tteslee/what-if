const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function makeKoreanDataPublic() {
  console.log('🔧 Making Korean data public...\n');
  
  try {
    // Update Korean cities to be public
    console.log('📊 Updating Korean cities to public...');
    const { data: citiesData, error: citiesError } = await supabase
      .from('cities')
      .update({ is_public: true })
      .eq('lang', 'ko')
      .eq('is_public', false)
      .select('id, name, is_public');
    
    if (citiesError) {
      console.error('❌ Error updating Korean cities:', citiesError);
    } else {
      console.log(`✅ Updated ${citiesData.length} Korean cities to public`);
      citiesData.forEach(city => {
        console.log(`   - ${city.name} (${city.id}) - public: ${city.is_public}`);
      });
    }
    
    // Update Korean interventions to be public
    console.log('\n📊 Updating Korean interventions to public...');
    const { data: interventionsData, error: interventionsError } = await supabase
      .from('interventions')
      .update({ is_public: true })
      .eq('lang', 'ko')
      .eq('is_public', false)
      .select('id, title, is_public');
    
    if (interventionsError) {
      console.error('❌ Error updating Korean interventions:', interventionsError);
    } else {
      console.log(`✅ Updated ${interventionsData.length} Korean interventions to public`);
      interventionsData.forEach(intervention => {
        console.log(`   - ${intervention.title} (${intervention.id}) - public: ${intervention.is_public}`);
      });
    }
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    
    const { data: publicKoCities, error: publicKoCitiesError } = await supabase
      .from('cities')
      .select('id, name, lang, is_public')
      .eq('lang', 'ko')
      .eq('is_public', true);
    
    const { data: publicKoInterventions, error: publicKoInterventionsError } = await supabase
      .from('interventions')
      .select('id, title, lang, is_public')
      .eq('lang', 'ko')
      .eq('is_public', true);
    
    if (publicKoCitiesError || publicKoInterventionsError) {
      console.error('❌ Error verifying updates:', publicKoCitiesError || publicKoInterventionsError);
    } else {
      console.log(`✅ Now have ${publicKoCities.length} public Korean cities`);
      console.log(`✅ Now have ${publicKoInterventions.length} public Korean interventions`);
    }
    
    console.log('\n🎉 Korean data is now public and should be visible!');
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

makeKoreanDataPublic();
