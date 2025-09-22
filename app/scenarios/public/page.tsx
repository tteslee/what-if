'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useWhatIfStore } from '../../../src/lib/store';
import { Scenario } from '../../../src/lib/schemas';
import { supabase } from '../../../src/lib/supabase';

export default function PublicScenariosPage() {
  const router = useRouter();
  const { cities, interventions, loadSampleData } = useWhatIfStore();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSampleData();
    loadPublicScenarios();
  }, [loadSampleData]);

  const loadPublicScenarios = async () => {
    try {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching public scenarios:', error);
        return;
      }

      console.log('Public scenarios query result:', data);
      console.log('Number of public scenarios found:', data?.length || 0);
      
      const transformedScenarios = data?.map((dbScenario: Record<string, unknown>) => {
        console.log('Public scenario:', dbScenario.id, 'is_public:', dbScenario.is_public, 'created_by:', dbScenario.created_by);
        return {
          id: dbScenario.id as string,
          whatIfQuestion: dbScenario.what_if_question as string,
          cityId: dbScenario.city_id as string,
          interventionIds: dbScenario.intervention_ids as string[],
          notes: dbScenario.notes as string,
          isPublic: dbScenario.is_public as boolean,
        };
      }) || [];

      console.log('Transformed public scenarios:', transformedScenarios);
      setScenarios(transformedScenarios);
      setLoading(false);
    } catch (error) {
      console.error('Error loading public scenarios:', error);
      setLoading(false);
    }
  };

  const getCityName = (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    return city?.name || 'Unknown City';
  };

  const getInterventionNames = (interventionIds: string[]) => {
    const interventionNames = interventionIds
      .map(id => {
        const intervention = interventions.find(i => i.id === id);
        return intervention?.title || 'Unknown Intervention';
      })
      .join(', ');
    return interventionNames || 'No interventions';
  };

  const handleViewScenario = (scenarioId: string) => {
    router.push(`/scenarios/${scenarioId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading public scenarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Public Scenarios</h1>
          <p className="text-slate-600">Explore scenarios shared by the community</p>
        </div>

        {/* Scenarios List */}
        {scenarios.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No public scenarios yet</h3>
            <p className="text-slate-600 mb-6">Be the first to share a scenario with the community.</p>
            <button
              onClick={() => router.push('/scenarios/new')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create New Scenario
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {scenarios.map((scenario) => (
              <div key={scenario.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-slate-900">
                        What if we {scenario.whatIfQuestion}
                      </h3>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Public
                      </span>
                    </div>
                    <div className="text-sm text-slate-600 mb-3">
                      <div className="mb-1">
                        <span className="font-medium">City:</span> {getCityName(scenario.cityId)}
                      </div>
                      <div className="mb-1">
                        <span className="font-medium">Interventions:</span> {getInterventionNames(scenario.interventionIds)}
                      </div>
                      {scenario.notes && (
                        <div>
                          <span className="font-medium">Notes:</span> {scenario.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleViewScenario(scenario.id)}
                      className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create New Button */}
        {scenarios.length > 0 && (
          <div className="mt-8 text-center">
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
