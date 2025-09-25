-- Add missing UPDATE policies for privacy toggle functionality
-- This script only adds the UPDATE policies that are missing

-- ========================================
-- CITIES TABLE - Add UPDATE policy
-- ========================================
-- Drop existing update policy if it exists
DROP POLICY IF EXISTS "Allow users to update own cities" ON cities;

-- Create UPDATE policy for cities
CREATE POLICY "Allow users to update own cities" ON cities 
FOR UPDATE 
USING (auth.uid()::text = created_by);

-- ========================================
-- INTERVENTIONS TABLE - Add UPDATE policy
-- ========================================
-- Drop existing update policy if it exists
DROP POLICY IF EXISTS "Allow users to update own interventions" ON interventions;

-- Create UPDATE policy for interventions
CREATE POLICY "Allow users to update own interventions" ON interventions 
FOR UPDATE 
USING (auth.uid()::text = created_by);

-- ========================================
-- SCENARIOS TABLE - Add UPDATE policy
-- ========================================
-- Drop existing update policy if it exists
DROP POLICY IF EXISTS "Allow users to update own scenarios" ON scenarios;

-- Create UPDATE policy for scenarios
CREATE POLICY "Allow users to update own scenarios" ON scenarios 
FOR UPDATE 
USING (auth.uid()::text = created_by);

-- ========================================
-- Verify policies were created
-- ========================================
-- Check cities policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'cities' AND cmd = 'UPDATE';

-- Check interventions policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'interventions' AND cmd = 'UPDATE';

-- Check scenarios policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'scenarios' AND cmd = 'UPDATE';
