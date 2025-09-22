const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  console.log('Starting language column migration...');
  
  try {
    // Read the SQL migration file
    const fs = require('fs');
    const path = require('path');
    const sqlFile = path.join(__dirname, '..', 'migrate-lang-columns.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    
    // Split the SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      console.log(`\nExecuting statement ${i + 1}/${statements.length}:`);
      console.log(statement);
      
      try {
        const { data, error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.error(`Error executing statement ${i + 1}:`, error);
          // Continue with other statements even if one fails
        } else {
          console.log(`✅ Statement ${i + 1} executed successfully`);
        }
      } catch (err) {
        console.error(`Exception executing statement ${i + 1}:`, err.message);
        // Continue with other statements
      }
    }
    
    console.log('\n🎉 Migration completed!');
    
    // Verify the migration by checking table structures
    console.log('\nVerifying migration...');
    
    const { data: citiesData, error: citiesError } = await supabase
      .from('cities')
      .select('id, name, lang')
      .limit(5);
    
    if (citiesError) {
      console.error('Error verifying cities table:', citiesError);
    } else {
      console.log('Cities sample:', citiesData);
    }
    
    const { data: interventionsData, error: interventionsError } = await supabase
      .from('interventions')
      .select('id, title, lang')
      .limit(5);
    
    if (interventionsError) {
      console.error('Error verifying interventions table:', interventionsError);
    } else {
      console.log('Interventions sample:', interventionsData);
    }
    
    const { data: scenariosData, error: scenariosError } = await supabase
      .from('scenarios')
      .select('id, what_if_question, lang')
      .limit(5);
    
    if (scenariosError) {
      console.error('Error verifying scenarios table:', scenariosError);
    } else {
      console.log('Scenarios sample:', scenariosData);
    }
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
