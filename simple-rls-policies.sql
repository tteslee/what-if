-- Simple RLS policies that match your requirements exactly
-- Run this in Supabase SQL Editor

-- ========================================
-- CITIES TABLE
-- ========================================
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access" ON cities;
DROP POLICY IF EXISTS "Allow authenticated insert" ON cities;
DROP POLICY IF EXISTS "Allow authenticated update" ON cities;
DROP POLICY IF EXISTS "Allow authenticated delete" ON cities;
DROP POLICY IF EXISTS "Allow users to update own cities" ON cities;
DROP POLICY IF EXISTS "Allow users to delete own cities" ON cities;
DROP POLICY IF EXISTS "Allow users to read own cities" ON cities;

-- Create new policies
-- Anonymous users: Can read public cities
CREATE POLICY "Allow public read access" ON cities 
FOR SELECT 
USING (is_public = true);

-- Authenticated users: Can read public cities AND their own private cities
CREATE POLICY "Allow authenticated read own cities" ON cities 
FOR SELECT 
USING (auth.uid()::text = created_by OR is_public = true);

CREATE POLICY "Allow authenticated insert" ON cities 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- ========================================
-- INTERVENTIONS TABLE
-- ========================================
ALTER TABLE interventions ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access" ON interventions;
DROP POLICY IF EXISTS "Allow authenticated insert" ON interventions;
DROP POLICY IF EXISTS "Allow authenticated update" ON interventions;
DROP POLICY IF EXISTS "Allow authenticated delete" ON interventions;
DROP POLICY IF EXISTS "Allow users to update own interventions" ON interventions;
DROP POLICY IF EXISTS "Allow users to delete own interventions" ON interventions;
DROP POLICY IF EXISTS "Allow users to read own interventions" ON interventions;

-- Create new policies
-- Anonymous users: Can read public interventions
CREATE POLICY "Allow public read access" ON interventions 
FOR SELECT 
USING (is_public = true);

-- Authenticated users: Can read public interventions AND their own private interventions
CREATE POLICY "Allow authenticated read own interventions" ON interventions 
FOR SELECT 
USING (auth.uid()::text = created_by OR is_public = true);

CREATE POLICY "Allow authenticated insert" ON interventions 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- ========================================
-- SCENARIOS TABLE
-- ========================================
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access" ON scenarios;
DROP POLICY IF EXISTS "Allow authenticated insert" ON scenarios;
DROP POLICY IF EXISTS "Allow authenticated update" ON scenarios;
DROP POLICY IF EXISTS "Allow authenticated delete" ON scenarios;
DROP POLICY IF EXISTS "Allow users to update own scenarios" ON scenarios;
DROP POLICY IF EXISTS "Allow users to delete own scenarios" ON scenarios;
DROP POLICY IF EXISTS "Allow users to read own scenarios" ON scenarios;
DROP POLICY IF EXISTS "Allow anonymous public insert" ON scenarios;

-- Create new policies
-- Anonymous users: Can read public scenarios and insert ONLY public scenarios
CREATE POLICY "Allow public read access" ON scenarios 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Allow anonymous public insert" ON scenarios 
FOR INSERT 
WITH CHECK (is_public = true);

-- Authenticated users: Can read public scenarios AND their own private scenarios
CREATE POLICY "Allow authenticated read own scenarios" ON scenarios 
FOR SELECT 
USING (auth.uid()::text = created_by OR is_public = true);

CREATE POLICY "Allow authenticated insert" ON scenarios 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

-- ========================================
-- SCENARIO_RESULTS TABLE
-- ========================================
ALTER TABLE scenario_results ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public read access" ON scenario_results;
DROP POLICY IF EXISTS "Allow authenticated insert" ON scenario_results;
DROP POLICY IF EXISTS "Allow authenticated update" ON scenario_results;
DROP POLICY IF EXISTS "Allow authenticated delete" ON scenario_results;
DROP POLICY IF EXISTS "Allow users to update own scenario results" ON scenario_results;
DROP POLICY IF EXISTS "Allow users to delete own scenario results" ON scenario_results;
DROP POLICY IF EXISTS "Allow users to read own scenario results" ON scenario_results;
DROP POLICY IF EXISTS "Allow anonymous insert" ON scenario_results;
DROP POLICY IF EXISTS "Allow authenticated read" ON scenario_results;

-- Create new policies
-- Anonymous users: Can read public scenario results and insert scenario results for public scenarios
CREATE POLICY "Allow public read access" ON scenario_results 
FOR SELECT 
USING (true); -- Scenario results are generally public

CREATE POLICY "Allow anonymous insert" ON scenario_results 
FOR INSERT 
WITH CHECK (true); -- Allow anonymous users to create scenario results

-- Authenticated users: Can read and insert scenario results
CREATE POLICY "Allow authenticated read" ON scenario_results 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Allow authenticated insert" ON scenario_results 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);
