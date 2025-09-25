const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAuthIssue() {
  console.log('🔍 Debugging authentication issue...\n');

  // Test 1: Check current policies
  console.log('1. Checking current RLS policies...');
  const { data: policies, error: policiesError } = await supabase
    .rpc('exec_sql', { 
      sql: `
        SELECT 
          tablename,
          policyname,
          cmd,
          qual,
          with_check
        FROM pg_policies 
        WHERE tablename = 'cities' 
        AND policyname LIKE '%insert%'
        ORDER BY policyname;
      `
    });

  if (policiesError) {
    console.error('Error fetching policies:', policiesError);
  } else {
    console.log('Current cities insert policies:');
    console.log(JSON.stringify(policies, null, 2));
  }

  // Test 2: Try a simple insert to see the exact error
  console.log('\n2. Testing direct insert...');
  const testCity = {
    id: `debug-test-${Date.now()}`,
    name: 'Debug Test City',
    lang: 'en',
    scale: 'Citywide',
    main_challenges: ['debug test'],
    created_by: 'test-user-id',
    is_public: false
  };

  const { data: insertData, error: insertError } = await supabase
    .from('cities')
    .insert(testCity)
    .select();

  if (insertError) {
    console.error('❌ Insert error details:');
    console.error('Code:', insertError.code);
    console.error('Message:', insertError.message);
    console.error('Details:', insertError.details);
    console.error('Hint:', insertError.hint);
  } else {
    console.log('✅ Insert successful:', insertData);
    
    // Clean up
    await supabase
      .from('cities')
      .delete()
      .eq('id', testCity.id);
  }

  // Test 3: Check if RLS is enabled
  console.log('\n3. Checking RLS status...');
  const { data: rlsStatus, error: rlsError } = await supabase
    .rpc('exec_sql', { 
      sql: `
        SELECT 
          schemaname,
          tablename,
          rowsecurity
        FROM pg_tables 
        WHERE tablename = 'cities';
      `
    });

  if (rlsError) {
    console.error('Error checking RLS status:', rlsError);
  } else {
    console.log('RLS status for cities table:');
    console.log(JSON.stringify(rlsStatus, null, 2));
  }
}

debugAuthIssue().catch(console.error);
