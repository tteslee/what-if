-- What-if Database Setup for Supabase
-- Run this SQL in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS interventions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS scenario_results ENABLE ROW LEVEL SECURITY;

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  scale TEXT NOT NULL CHECK (scale IN ('Citywide', 'DistrictNeighbourhood', 'CorridorStreet', 'SpecificSite')),
  main_challenges TEXT[] NOT NULL,
  population_context JSONB,
  neighbourhood_characteristics TEXT,
  vulnerable_groups TEXT[],
  regulatory_context TEXT,
  timeline TEXT,
  budget_constraints TEXT,
  existing_assets TEXT[],
  demographics JSONB,
  mobility JSONB,
  housing JSONB,
  environment JSONB,
  health JSONB,
  economy JSONB,
  social_governance JSONB,
  fiscal JSONB,
  data_quality JSONB,
  implementation_readiness JSONB,
  custom_indicators JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  is_public BOOLEAN DEFAULT true
);

-- Interventions table
CREATE TABLE IF NOT EXISTS interventions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('BehaviourChange', 'CivicParticipation', 'SkillsAndIndustry', 'PhysicalInfrastructure', 'Governance', 'PolicyAndRegulation', 'Finance', 'Technology')),
  scope_of_application TEXT NOT NULL,
  detailed_description TEXT,
  parameters JSONB,
  synergies TEXT[],
  intended_outcomes TEXT[],
  stakeholder_focus TEXT[],
  implementation_notes TEXT,
  risks TEXT[],
  categories TEXT[],
  description TEXT,
  params JSONB,
  mechanisms JSONB,
  implementation JSONB,
  assumptions TEXT[],
  sub_interventions JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  is_public BOOLEAN DEFAULT true
);

-- Scenarios table
CREATE TABLE IF NOT EXISTS scenarios (
  id TEXT PRIMARY KEY,
  what_if_question TEXT NOT NULL,
  city_id TEXT NOT NULL REFERENCES cities(id) ON DELETE CASCADE,
  intervention_ids TEXT[] NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT,
  is_public BOOLEAN DEFAULT true
);

-- Scenario Results table
CREATE TABLE IF NOT EXISTS scenario_results (
  id TEXT PRIMARY KEY,
  scenario_id TEXT NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
  narrative_summary TEXT NOT NULL,
  stakeholder_impacts JSONB NOT NULL,
  system_effects JSONB NOT NULL,
  policy_interactions JSONB NOT NULL,
  risks JSONB NOT NULL,
  assumptions JSONB NOT NULL,
  signals JSONB NOT NULL,
  experiments JSONB NOT NULL,
  synergies TEXT[],
  gaps TEXT[],
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL,
  confidence_0_1 DECIMAL NOT NULL CHECK (confidence_0_1 >= 0 AND confidence_0_1 <= 1),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_cities_public ON cities(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_interventions_public ON interventions(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_scenarios_public ON scenarios(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_scenarios_city_id ON scenarios(city_id);
CREATE INDEX IF NOT EXISTS idx_scenario_results_scenario_id ON scenario_results(scenario_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_cities_updated_at BEFORE UPDATE ON cities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interventions_updated_at BEFORE UPDATE ON interventions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scenarios_updated_at BEFORE UPDATE ON scenarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scenario_results_updated_at BEFORE UPDATE ON scenario_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies (allow public read, authenticated write)
CREATE POLICY "Allow public read access" ON cities FOR SELECT USING (is_public = true);
CREATE POLICY "Allow public read access" ON interventions FOR SELECT USING (is_public = true);
CREATE POLICY "Allow public read access" ON scenarios FOR SELECT USING (is_public = true);
CREATE POLICY "Allow public read access" ON scenario_results FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON cities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert" ON interventions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert" ON scenarios FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated insert" ON scenario_results FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated update" ON cities FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON interventions FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON scenarios FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated update" ON scenario_results FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated delete" ON cities FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON interventions FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON scenarios FOR DELETE USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated delete" ON scenario_results FOR DELETE USING (auth.role() = 'authenticated');

-- Insert sample data
INSERT INTO cities (id, name, scale, main_challenges, population_context, neighbourhood_characteristics, vulnerable_groups, regulatory_context, timeline, budget_constraints, existing_assets, is_public) VALUES
('helsinki', 'Helsinki', 'Citywide', ARRAY['air quality', 'congestion', 'housing affordability', 'social inequality'], 
 '{"size": 656920, "demographics": "aging population with growing tech sector"}', 
 'mixed-use with strong public transport', 
 ARRAY['elderly', 'low-income', 'immigrants'], 
 'Strong environmental regulations, progressive urban planning', 
 '3-year implementation window', 
 '€50M available for urban innovation', 
 ARRAY['extensive tram network', 'public housing blocks', 'green spaces'], 
 true),
('madrid', 'Madrid', 'Citywide', ARRAY['heat island effect', 'air pollution', 'traffic congestion'], 
 '{"size": 3223000, "demographics": "diverse population with strong cultural heritage"}', 
 'dense urban core with expanding suburbs', 
 ARRAY['elderly', 'children', 'outdoor workers'], 
 'EU air quality standards, local climate action plan', 
 '2-year pilot phase', 
 '€30M for climate adaptation', 
 ARRAY['metro system', 'parks and plazas', 'historic buildings'], 
 true),
('singapore', 'Singapore', 'Citywide', ARRAY['land scarcity', 'climate resilience', 'aging infrastructure'], 
 '{"size": 5704000, "demographics": "multicultural population with high tech adoption"}', 
 'high-density mixed-use development', 
 ARRAY['elderly', 'low-income workers', 'migrant workers'], 
 'Strong government planning, strict environmental standards', 
 '5-year strategic planning cycle', 
 'SGD 100M for smart city initiatives', 
 ARRAY['MRT system', 'green buildings', 'water catchment areas'], 
 true);

-- Insert sample interventions
INSERT INTO interventions (id, title, summary, category, scope_of_application, detailed_description, parameters, synergies, intended_outcomes, stakeholder_focus, implementation_notes, risks, is_public) VALUES
('school-air-quality-sensors', 'School Air Quality Sensors', 'Install low-cost sensors in schools to monitor air quality and inform traffic management', 'Technology', 'Primary schools in urban areas', 'Deploy a network of air quality sensors in and around primary schools to monitor pollution levels in real-time. The data will be used to inform traffic management decisions and raise awareness about air quality issues affecting children.', '{"sensorsCount": 200, "schoolsCovered": 50, "dataFrequency": "5 minutes", "costPerSensor": "€150"}', ARRAY['Works best with: School Streets', 'Green Corridors', 'Traffic Calming'], ARRAY['Reduce children''s exposure to air pollution', 'Improve traffic management around schools', 'Increase public awareness of air quality issues'], ARRAY['children', 'parents', 'school administrators', 'traffic planners'], '6-month pilot phase, €30K budget, requires school board approval and data governance framework', ARRAY['Sensor maintenance and calibration challenges', 'Privacy concerns about location data', 'Potential for data overload without clear action protocols'], true),
('congestion-pricing', 'Congestion Pricing', 'Introduce a daily charge for driving in the city centre during peak hours', 'PolicyAndRegulation', 'City centre zone during peak hours', 'Implement a variable pricing system for vehicle access to the city centre during peak hours, with exemptions for essential services and low-income residents.', '{"dailyCharge": "€15", "coverageArea": "0.15 km²", "peakHours": 6, "exemptions": "20%"}', ARRAY['Works best with: Public Transport Improvements', 'Active Travel Infrastructure'], ARRAY['Reduce traffic congestion in city centre', 'Encourage modal shift to public transport', 'Generate revenue for sustainable transport infrastructure'], ARRAY['commuters', 'local businesses', 'delivery drivers', 'residents'], '18-month implementation, €3.2M capital cost, requires public consultation and legal framework', ARRAY['Displacement of traffic to adjacent areas', 'Negative impact on local businesses', 'Public resistance to new charges'], true),
('community-solar', 'Community Solar', 'Install solar panels on public buildings and offer community energy sharing', 'Technology', 'Public buildings and community facilities', 'Deploy solar photovoltaic systems on public buildings and create a community energy sharing program that allows residents to invest in and benefit from renewable energy generation.', '{"solarCapacity": "2.5 MW", "publicBuildings": "30%", "communityParticipation": "25%", "energyPriceReduction": "15%"}', ARRAY['Works best with: Energy Efficiency Programs', 'Community Engagement'], ARRAY['Increase renewable energy adoption', 'Reduce energy costs for participants', 'Build community ownership of energy infrastructure'], ARRAY['low-income households', 'community groups', 'public building users'], '24-month project, €8.5M capital cost, requires regulatory approval for energy sharing', ARRAY['High upfront costs may limit participation', 'Seasonal variations in energy generation', 'Complex legal and regulatory framework'], true),
('school-streets', 'School Streets', 'Close streets around schools during drop-off and pick-up times', 'PhysicalInfrastructure', 'Streets adjacent to primary schools', 'Temporarily close streets around schools during morning drop-off and afternoon pick-up times to create safe, car-free zones for children walking and cycling to school.', '{"closureDuration": "2 hours", "schoolsCovered": 25, "enforcementMethod": "Automatic barriers", "communityEngagement": "High"}', ARRAY['Works best with: School Air Quality Sensors', 'Active Travel Promotion'], ARRAY['Improve child safety around schools', 'Encourage active travel to school', 'Reduce air pollution near schools'], ARRAY['children', 'parents', 'school staff', 'local residents'], '12-month pilot, €500K budget, requires community consultation and traffic impact assessment', ARRAY['Displacement of traffic to adjacent streets', 'Resistance from car-dependent families', 'Enforcement challenges'], true),
('participatory-budgeting', 'Participatory Budgeting', 'Allow citizens to directly decide how to spend a portion of the municipal budget', 'CivicParticipation', 'Citywide with district-level implementation', 'Allocate a percentage of the municipal budget for citizens to propose and vote on local projects, with special outreach to underrepresented communities.', '{"budgetPercentage": "5%", "minimumVotingAge": 16, "projectCategories": 4, "outreachTarget": "80%"}', ARRAY['Works best with: Digital Democracy Platforms', 'Community Engagement'], ARRAY['Increase civic participation and engagement', 'Improve transparency in budget allocation', 'Address local community needs more effectively'], ARRAY['residents', 'community groups', 'local businesses', 'youth'], 'Annual cycle, €2M budget allocation, requires digital platform and community outreach', ARRAY['Low participation rates', 'Difficulty reaching underrepresented groups', 'Potential for populist or short-term projects'], true);
