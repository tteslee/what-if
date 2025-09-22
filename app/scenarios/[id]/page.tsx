'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useWhatIfStore } from '../../../src/lib/store';
import { Scenario, ScenarioResult, CityProfile, Intervention } from '../../../src/lib/schemas';
import { supabase } from '../../../src/lib/supabase';
import { databaseService } from '../../../src/lib/database-service';

export default function ScenarioResultPage() {
  const params = useParams();
  const router = useRouter();
  const { scenarios, results } = useWhatIfStore();
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [city, setCity] = useState<CityProfile | null>(null);
  const [selectedInterventions, setSelectedInterventions] = useState<Intervention[]>([]);

  useEffect(() => {
    const loadScenario = async () => {
      if (!params.id) return;
      
      const scenarioId = params.id as string;
      
      // First try to find in global store
      const foundScenario = scenarios.find(s => s.id === scenarioId);
      const foundResult = results[scenarioId];
      
      if (foundScenario) {
        setScenario(foundScenario);
        
        // Always try to load the result from database, even if found in store
        // This ensures we have the latest result data
        console.log('Scenario found in store, loading result from database for:', scenarioId);
        const resultData = await databaseService.getScenarioResult(scenarioId);
        if (resultData) {
          console.log('Scenario result loaded from database:', resultData);
          setResult(resultData);
        } else {
          console.log('No scenario result found in database, using store result:', foundResult);
          setResult(foundResult || null);
        }
        
        setLoading(false);
        return;
      }
      
      // If not found in store, load from database
      try {
        console.log('Loading scenario from database:', scenarioId);
        const { data, error } = await supabase
          .from('scenarios')
          .select('*')
          .eq('id', scenarioId)
          .single();

        if (error) {
          console.error('Error fetching scenario:', error);
          setLoading(false);
          return;
        }

        if (data) {
          console.log('Scenario data from database:', data);
          const dbScenario: Scenario = {
            id: data.id as string,
            whatIfQuestion: data.what_if_question as string,
            cityId: data.city_id as string,
            interventionIds: data.intervention_ids as string[],
            notes: data.notes as string,
            isPublic: data.is_public as boolean,
            lang: (data.lang as 'en' | 'ko') || 'en',
          };
          
          setScenario(dbScenario);
          
          // Try to load the result as well
          console.log('Loading scenario result for:', scenarioId);
          const resultData = await databaseService.getScenarioResult(scenarioId);
          if (resultData) {
            console.log('Scenario result loaded:', resultData);
            setResult(resultData);
          } else {
            console.log('No scenario result found');
          }
        } else {
          console.log('No scenario data found');
        }
      } catch (error) {
        console.error('Error loading scenario from database:', error);
      }
      
      setLoading(false);
    };
    
    loadScenario();
  }, [params.id, scenarios, results]);

  // Load city and interventions based on the scenario's language, not current language
  useEffect(() => {
    const loadScenarioData = async () => {
      if (!scenario) return;
      
      try {
        // Load city and interventions in the scenario's language
        const [cityData, interventionData] = await Promise.all([
          databaseService.getCities(scenario.lang),
          databaseService.getInterventions(scenario.lang)
        ]);
        
        const foundCity = cityData.find(c => c.id === scenario.cityId);
        const foundInterventions = interventionData.filter(i => scenario.interventionIds.includes(i.id));
        
        setCity(foundCity || null);
        setSelectedInterventions(foundInterventions);
      } catch (error) {
        console.error('Error loading scenario data:', error);
      }
    };
    
    loadScenarioData();
  }, [scenario]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading scenario...</p>
        </div>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Scenario not found</h1>
          <button
            onClick={() => router.push('/scenarios/new')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create New Scenario
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Scenario Analysis</h1>
              <p className="text-slate-600">What if we {scenario.whatIfQuestion}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/scenarios/new')}
                className="px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50"
              >
                Create New
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Export PDF
              </button>
            </div>
          </div>

          {/* Context Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Context</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-slate-900 mb-2">City</h3>
                <p className="text-slate-700">{city?.name}</p>
                {city?.mainChallenges && (
                  <p className="text-sm text-slate-600 mt-1">
                    Challenges: {city.mainChallenges.join(', ')}
                  </p>
                )}
              </div>
              <div>
                <h3 className="font-medium text-slate-900 mb-2">Interventions</h3>
                <div className="space-y-1">
                  {selectedInterventions?.map((intervention) => (
                    <div key={intervention.id} className="text-slate-700">
                      • {intervention.title} ({intervention.category})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {result ? (
          <div className="space-y-6">
            {/* Narrative Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Narrative Summary</h2>
              <p className="text-slate-700 leading-relaxed">{result.narrativeSummary}</p>
            </div>

            {/* Stakeholder Impacts */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Stakeholder Impacts</h2>
              <div className="grid gap-4">
                {result.stakeholderImpacts?.map((impact, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium text-slate-900 capitalize">{impact.group}</h3>
                      {impact.stance && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          impact.stance === 'Support' ? 'bg-green-100 text-green-800' :
                          impact.stance === 'Oppose' ? 'bg-red-100 text-red-800' :
                          impact.stance === 'Mixed' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {impact.stance}
                        </span>
                      )}
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Benefits</h4>
                        <ul className="space-y-1">
                          {impact.benefits?.map((benefit, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start">
                              <span className="text-green-500 mr-2">✓</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Concerns</h4>
                        <ul className="space-y-1">
                          {impact.concerns?.map((concern, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start">
                              <span className="text-red-500 mr-2">⚠</span>
                              {concern}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Engagement Needs</h4>
                        <ul className="space-y-1">
                          {impact.engagementNeeds?.map((need, i) => (
                            <li key={i} className="text-sm text-slate-700 flex items-start">
                              <span className="text-blue-500 mr-2">→</span>
                              {need}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Effects */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">System Effects</h2>
              <div className="grid gap-4">
                {result.systemEffects?.map((effect, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-slate-900">{effect.domain}</h3>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          effect.polarity === 'Positive' ? 'bg-green-100 text-green-800' :
                          effect.polarity === 'Negative' ? 'bg-red-100 text-red-800' :
                          effect.polarity === 'Mixed' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {effect.polarity}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          effect.confidence === 'High' ? 'bg-blue-100 text-blue-800' :
                          effect.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-slate-100 text-slate-800'
                        }`}>
                          {effect.confidence} Confidence
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-700">{effect.effect}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Policy Interactions */}
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Policy & Trend Interactions</h2>
              <div className="grid gap-4">
                {result.policyInteractions?.map((interaction, index) => (
                  <div key={index} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-slate-900">{interaction.policy}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        interaction.interaction === 'Enables' ? 'bg-green-100 text-green-800' :
                        interaction.interaction === 'ConstrainedBy' ? 'bg-yellow-100 text-yellow-800' :
                        interaction.interaction === 'ConflictsWith' ? 'bg-red-100 text-red-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {interaction.interaction}
                      </span>
                    </div>
                    <p className="text-slate-700">{interaction.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Risks & Assumptions */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Risks & Unknowns</h2>
                <div className="space-y-3">
                  {result.risks?.map((risk, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900">{risk.risk}</span>
                        <div className="flex gap-1">
                          <span className={`px-2 py-1 rounded text-xs ${
                            risk.likelihood === 'High' ? 'bg-red-100 text-red-800' :
                            risk.likelihood === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {risk.likelihood}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs ${
                            risk.impact === 'High' ? 'bg-red-100 text-red-800' :
                            risk.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {risk.impact}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Assumptions & Gaps</h2>
                <div className="space-y-3">
                  {result.assumptions?.map((assumption, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-slate-900">{assumption.assumption}</span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          assumption.confidence === 'High' ? 'bg-green-100 text-green-800' :
                          assumption.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {assumption.confidence}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Signals & Experiments */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Signals to Watch</h2>
                <div className="space-y-3">
                  {result.signals?.map((signal, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-3">
                      <h3 className="font-medium text-slate-900 mb-1">{signal.signal}</h3>
                      <p className="text-sm text-slate-700">{signal.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Next Experiments</h2>
                <div className="space-y-3">
                  {result.experiments?.map((experiment, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-slate-900">{experiment.experiment}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          experiment.effort === 'Low' ? 'bg-green-100 text-green-800' :
                          experiment.effort === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {experiment.effort} Effort
                        </span>
                      </div>
                      <p className="text-sm text-slate-700">Timeline: {experiment.timeline}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Portfolio Analysis */}
            {(result.synergies || result.gaps) && (
              <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Portfolio Analysis</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {result.synergies && result.synergies.length > 0 && (
                    <div>
                      <h3 className="font-medium text-slate-900 mb-3">Synergies</h3>
                      <ul className="space-y-2">
                        {result.synergies?.map((synergy, index) => (
                          <li key={index} className="text-slate-700 flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {synergy}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {result.gaps && result.gaps.length > 0 && (
                    <div>
                      <h3 className="font-medium text-slate-900 mb-3">Gaps</h3>
                      <ul className="space-y-2">
                        {result.gaps?.map((gap, index) => (
                          <li key={index} className="text-slate-700 flex items-start">
                            <span className="text-red-500 mr-2">⚠</span>
                            {gap}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="bg-slate-50 rounded-lg p-4 text-center">
              <p className="text-sm text-slate-600">
                Generated on {result.generatedAt} • Confidence: {Math.round(result.confidence_0_1 * 100)}%
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">Scenario Analysis Not Generated</h2>
            <p className="text-slate-600 mb-6">
              The scenario analysis hasn&apos;t been generated yet. This might be due to an error or the analysis is still in progress.
            </p>
            <button
              onClick={() => router.push('/scenarios/new')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create New Scenario
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
