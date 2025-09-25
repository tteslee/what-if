const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAppFunctionality() {
  console.log('🧪 Testing app functionality after RLS policy changes...\n');

  try {
    // Test 1: Can we read public cities?
    console.log('1. Testing public city read access...');
    const { data: cities, error: citiesError } = await supabase
      .from('cities')
      .select('*')
      .eq('is_public', true)
      .limit(5);

    if (citiesError) {
      console.error('❌ Failed to read public cities:', citiesError);
    } else {
      console.log(`✅ Successfully read ${cities.length} public cities`);
    }

    // Test 2: Can we read public interventions?
    console.log('\n2. Testing public intervention read access...');
    const { data: interventions, error: interventionsError } = await supabase
      .from('interventions')
      .select('*')
      .eq('is_public', true)
      .limit(5);

    if (interventionsError) {
      console.error('❌ Failed to read public interventions:', interventionsError);
    } else {
      console.log(`✅ Successfully read ${interventions.length} public interventions`);
    }

    // Test 3: Can we read public scenarios?
    console.log('\n3. Testing public scenario read access...');
    const { data: scenarios, error: scenariosError } = await supabase
      .from('scenarios')
      .select('*')
      .eq('is_public', true)
      .limit(5);

    if (scenariosError) {
      console.error('❌ Failed to read public scenarios:', scenariosError);
    } else {
      console.log(`✅ Successfully read ${scenarios.length} public scenarios`);
    }

    // Test 4: Check authentication
    console.log('\n4. Testing authentication...');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('❌ Auth error:', authError);
    } else if (user) {
      console.log('✅ User is authenticated:', user.id);
      
      // Test 5: Try to insert a test city (if authenticated)
      console.log('\n5. Testing city insert (authenticated user)...');
      const testCity = {
        id: `test-${Date.now()}`,
        name: 'Test City for RLS',
        lang: 'en',
        scale: 'Citywide',
        main_challenges: ['test challenge'],
        created_by: user.id,
        is_public: false
      };

      const { data: insertData, error: insertError } = await supabase
        .from('cities')
        .insert(testCity)
        .select();

      if (insertError) {
        console.error('❌ City insert failed:', insertError);
      } else {
        console.log('✅ City insert successful:', insertData[0].name);
        
        // Clean up test data
        await supabase
          .from('cities')
          .delete()
          .eq('id', testCity.id);
        console.log('🧹 Test city cleaned up');
      }
    } else {
      console.log('ℹ️  No authenticated user (this is normal for anonymous users)');
    }

    console.log('\n🎉 App functionality test completed!');
    console.log('\nIf all tests passed, your app should be working correctly.');
    console.log('If any tests failed, you can run the rollback script.');

  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
}

testAppFunctionality().catch(console.error);
