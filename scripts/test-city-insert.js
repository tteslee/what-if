const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testCityInsert() {
  console.log('🧪 Testing city insert with exact same data structure...\n');

  // Test data that matches what the app sends
  const testCity = {
    id: `custom-${Date.now()}`,
    name: 'Test City',
    lang: 'ko',
    scale: 'Citywide',
    main_challenges: ['test challenge'],
    created_by: 'test-user-id',
    is_public: false
  };

  console.log('Test city data:', testCity);

  try {
    const { data, error } = await supabase
      .from('cities')
      .insert(testCity)
      .select();

    if (error) {
      console.error('❌ Insert failed:');
      console.error('Code:', error.code);
      console.error('Message:', error.message);
      console.error('Details:', error.details);
      console.error('Hint:', error.hint);
      
      // Try with upsert instead
      console.log('\n🔄 Trying upsert instead...');
      const { data: upsertData, error: upsertError } = await supabase
        .from('cities')
        .upsert(testCity)
        .select();

      if (upsertError) {
        console.error('❌ Upsert also failed:', upsertError);
      } else {
        console.log('✅ Upsert successful:', upsertData);
        
        // Clean up
        await supabase
          .from('cities')
          .delete()
          .eq('id', testCity.id);
        console.log('🧹 Test data cleaned up');
      }
    } else {
      console.log('✅ Insert successful:', data);
      
      // Clean up
      await supabase
        .from('cities')
        .delete()
        .eq('id', testCity.id);
      console.log('🧹 Test data cleaned up');
    }
  } catch (err) {
    console.error('💥 Unexpected error:', err);
  }
}

testCityInsert().catch(console.error);
