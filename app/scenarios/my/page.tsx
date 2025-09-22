'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useWhatIfStore } from '../../../src/lib/store';
import { Scenario } from '../../../src/lib/schemas';
import { supabase } from '../../../src/lib/supabase';

export default function MyScenariosPage() {
  const router = useRouter();
  const { cities, interventions, loadSampleData, scenarios, setScenarios } = useWhatIfStore();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);

  const loadUserScenarios = useCallback(async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('created_by', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user scenarios:', error);
        return;
      }

      const transformedScenarios = data?.map((dbScenario: Record<string, unknown>) => ({
        id: dbScenario.id as string,
        whatIfQuestion: dbScenario.what_if_question as string,
        cityId: dbScenario.city_id as string,
        interventionIds: dbScenario.intervention_ids as string[],
        notes: dbScenario.notes as string,
        isPublic: dbScenario.is_public as boolean,
      })) || [];

      setScenarios(transformedScenarios);
    } catch (error) {
      console.error('Error loading user scenarios:', error);
    }
  }, [user, setScenarios]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserScenarios();
    }
  }, [user, loadUserScenarios]);

  useEffect(() => {
    loadSampleData();
  }, [loadSampleData]);

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

  const handleDeleteScenario = async (scenarioId: string) => {
    if (!confirm('Are you sure you want to delete this scenario?')) return;
    if (!user) return;

    try {
      const { error } = await supabase
        .from('scenarios')
        .delete()
        .eq('id', scenarioId)
        .eq('created_by', user.id);

      if (error) {
        console.error('Error deleting scenario:', error);
        return;
      }

      // Remove from local state
      const updatedScenarios = scenarios.filter((s: Scenario) => s.id !== scenarioId);
      setScenarios(updatedScenarios);
    } catch (error) {
      console.error('Error deleting scenario:', error);
    }
  };

  const handleTogglePrivacy = async (scenarioId: string, currentIsPublic: boolean) => {
    if (!user) return;

    try {
      console.log('Toggling privacy for scenario:', scenarioId, 'from', currentIsPublic, 'to', !currentIsPublic);
      const { error } = await supabase
        .from('scenarios')
        .update({ is_public: !currentIsPublic })
        .eq('id', scenarioId)
        .eq('created_by', user.id);

      if (error) {
        console.error('Error toggling scenario privacy:', error);
        return;
      }

      console.log('Privacy toggle successful, updating local state');
      // Update local state
      const updatedScenarios = scenarios.map((s: Scenario) => 
        s.id === scenarioId ? { ...s, isPublic: !currentIsPublic } : s
      );
      setScenarios(updatedScenarios);
      console.log('Local state updated:', updatedScenarios);
    } catch (error) {
      console.error('Error toggling scenario privacy:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your scenarios...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Please sign in</h1>
          <p className="text-slate-600 mb-6">You need to be signed in to view your scenarios.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Scenarios</h1>
          <p className="text-slate-600">View and manage your saved scenarios</p>
        </div>

        {/* Scenarios List */}
        {scenarios.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No scenarios yet</h3>
            <p className="text-slate-600 mb-6">Create your first scenario to get started.</p>
            <button
              onClick={() => router.push('/scenarios/new')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Create New Scenario
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {scenarios?.map((scenario) => (
              <div key={scenario.id} className="bg-white p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-slate-900">
                      What if we {scenario.whatIfQuestion}
                    </h3>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      scenario.isPublic 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {scenario.isPublic ? 'Public' : 'Private'}
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
                    <button
                      onClick={() => handleTogglePrivacy(scenario.id, scenario.isPublic || false)}
                      className={`px-4 py-2 text-sm rounded-md transition-colors ${
                        scenario.isPublic
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {scenario.isPublic ? 'Make Private' : 'Make Public'}
                    </button>
                    <button
                      onClick={() => handleDeleteScenario(scenario.id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors"
                    >
                      Delete
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
