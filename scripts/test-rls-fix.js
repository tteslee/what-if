const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testRLSPolicies() {
  console.log('Testing RLS policies...\n');

  // Test 1: Check current policies
  console.log('1. Checking current policies...');
  const { data: policies, error: policiesError } = await supabase
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'cities');

  if (policiesError) {
    console.error('Error fetching policies:', policiesError);
  } else {
    console.log('Current cities policies:');
    policies.forEach(policy => {
      console.log(`- ${policy.policyname}: ${policy.cmd} ${policy.qual || policy.with_check || 'N/A'}`);
    });
  }

  // Test 2: Check if user is authenticated
  console.log('\n2. Checking authentication...');
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  
  if (authError) {
    console.error('Auth error:', authError);
  } else if (user) {
    console.log('✅ User is authenticated:', user.id);
    
    // Test 3: Try to insert a test city
    console.log('\n3. Testing city insert...');
    const testCity = {
      id: `test-${Date.now()}`,
      name: 'Test City',
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
      console.error('❌ Insert failed:', insertError);
    } else {
      console.log('✅ Insert successful:', insertData);
      
      // Clean up test data
      await supabase
        .from('cities')
        .delete()
        .eq('id', testCity.id);
      console.log('🧹 Test data cleaned up');
    }
  } else {
    console.log('❌ No authenticated user');
  }
}

testRLSPolicies().catch(console.error);
