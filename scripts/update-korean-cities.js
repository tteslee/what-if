const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateKoreanCities() {
  console.log('🇰🇷 Updating Korean custom cities...\n');
  
  try {
    // First, let's see what cities we have
    console.log('📊 Current cities:');
    const { data: allCities, error: allCitiesError } = await supabase
      .from('cities')
      .select('id, name, lang')
      .order('name');
    
    if (allCitiesError) {
      console.error('❌ Error fetching cities:', allCitiesError);
      return;
    }
    
    console.log(allCities);
    
    // Find Korean cities (cities with Korean characters or Korea-related names)
    const koreanCities = allCities.filter(city => 
      /[가-힣]/.test(city.name) || // Contains Korean characters
      city.name.toLowerCase().includes('korea') ||
      city.name.toLowerCase().includes('seoul') ||
      city.name.toLowerCase().includes('busan') ||
      city.name.toLowerCase().includes('incheon') ||
      city.name.toLowerCase().includes('daegu') ||
      city.name.toLowerCase().includes('daejeon') ||
      city.name.toLowerCase().includes('gwangju') ||
      city.name.toLowerCase().includes('ulsan')
    );
    
    console.log(`\n🔍 Found ${koreanCities.length} Korean cities:`);
    koreanCities.forEach(city => {
      console.log(`   - ${city.name} (${city.id}) - currently lang: ${city.lang}`);
    });
    
    if (koreanCities.length === 0) {
      console.log('ℹ️  No Korean cities found to update.');
      return;
    }
    
    // Update Korean cities to have lang = 'ko'
    console.log('\n🔄 Updating Korean cities to lang = "ko"...');
    
    for (const city of koreanCities) {
      const { error: updateError } = await supabase
        .from('cities')
        .update({ lang: 'ko' })
        .eq('id', city.id);
      
      if (updateError) {
        console.error(`❌ Error updating city ${city.name}:`, updateError);
      } else {
        console.log(`✅ Updated ${city.name} to lang = "ko"`);
      }
    }
    
    // Verify the updates
    console.log('\n🔍 Verifying updates...');
    const { data: updatedCities, error: verifyError } = await supabase
      .from('cities')
      .select('id, name, lang')
      .eq('lang', 'ko');
    
    if (verifyError) {
      console.error('❌ Error verifying updates:', verifyError);
    } else {
      console.log('✅ Korean cities after update:');
      updatedCities.forEach(city => {
        console.log(`   - ${city.name} (${city.id}) - lang: ${city.lang}`);
      });
    }
    
    // Test language filtering
    console.log('\n🧪 Testing language filtering...');
    
    const { data: enCities, error: enError } = await supabase
      .from('cities')
      .select('id, name, lang')
      .eq('lang', 'en')
      .limit(5);
    
    const { data: koCities, error: koError } = await supabase
      .from('cities')
      .select('id, name, lang')
      .eq('lang', 'ko')
      .limit(5);
    
    if (enError || koError) {
      console.error('❌ Error testing language filtering:', enError || koError);
    } else {
      console.log(`✅ EN cities: ${enCities.length} found`);
      console.log(`✅ KO cities: ${koCities.length} found`);
    }
    
    console.log('\n🎉 Korean cities update completed!');
    console.log('📝 Your Korean custom cities should now be visible when you switch to Korean language.');
    
  } catch (error) {
    console.error('❌ Update failed:', error);
    process.exit(1);
  }
}

updateKoreanCities();
