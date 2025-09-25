'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useWhatIfStore } from '../../../src/lib/store';
import { Scenario } from '../../../src/lib/schemas';
import { supabase } from '../../../src/lib/supabase';
import { databaseService } from '../../../src/lib/database-service';
import { useTranslation } from '../../../src/contexts/TranslationContext';

export default function MyScenariosPage() {
  const router = useRouter();
  const { cities, interventions, scenarios, setScenarios } = useWhatIfStore();
  const { language } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ id: string; email?: string } | null>(null);
  const [localCities, setLocalCities] = useState(cities);
  const [localInterventions, setLocalInterventions] = useState(interventions);
  const [localScenarios, setLocalScenarios] = useState<Scenario[]>([]);
  const isUpdatingPrivacyRef = useRef(false);

  const loadCitiesAndInterventions = useCallback(async () => {
    console.log('Loading cities and interventions for language:', language);
    try {
      const [citiesData, interventionsData] = await Promise.all([
        databaseService.getCities(language),
        databaseService.getInterventions(language)
      ]);
      console.log('Loaded cities and interventions:', { cities: citiesData.length, interventions: interventionsData.length });
      setLocalCities(citiesData);
      setLocalInterventions(interventionsData);
    } catch (error) {
      console.error('Error loading cities and interventions:', error);
    }
  }, [language]);

  const loadUserScenarios = useCallback(async () => {
    if (!user || isUpdatingPrivacyRef.current) return;
    
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

      console.log('Raw database scenarios:', data);
      const transformedScenarios = data?.map((dbScenario: Record<string, unknown>) => {
        console.log('Transforming scenario:', dbScenario.id, 'is_public:', dbScenario.is_public);
        return {
          id: dbScenario.id as string,
          whatIfQuestion: dbScenario.what_if_question as string,
          cityId: dbScenario.city_id as string,
          interventionIds: dbScenario.intervention_ids as string[],
          notes: dbScenario.notes as string,
          isPublic: dbScenario.is_public as boolean,
          lang: (dbScenario.lang as 'en' | 'ko') || 'en',
        };
      }) || [];

      console.log('Transformed scenarios:', transformedScenarios);
      setLocalScenarios(transformedScenarios);
    } catch (error) {
      console.error('Error loading user scenarios:', error);
    }
  }, [user]);

  useEffect(() => {
    const getUser = async () => {
      console.log('My Scenarios - Getting user...');
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('My Scenarios - User result:', { user: user ? { id: user.id, email: user.email } : null, error });
      setUser(user);
      setLoading(false);
    };
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('My Scenarios - Auth state change:', { event, user: session?.user ? { id: session.user.id, email: session.user.email } : null });
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserScenarios();
    }
  }, [user, loadUserScenarios]);

  useEffect(() => {
    // Load cities and interventions for the current language
    // But don't reload scenarios - they should persist across language changes
    loadCitiesAndInterventions();
  }, [loadCitiesAndInterventions]);

  const getCityName = (cityId: string) => {
    const city = localCities.find(c => c.id === cityId);
    return city?.name || 'Unknown City';
  };

  const getInterventionNames = (interventionIds: string[]) => {
    const interventionNames = interventionIds
      .map(id => {
        const intervention = localInterventions.find(i => i.id === id);
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
      const updatedScenarios = localScenarios.filter((s: Scenario) => s.id !== scenarioId);
      setLocalScenarios(updatedScenarios);
    } catch (error) {
      console.error('Error deleting scenario:', error);
    }
  };

  const handleTogglePrivacy = async (scenarioId: string, currentIsPublic: boolean) => {
    if (!user) return;

    isUpdatingPrivacyRef.current = true;
    try {
      console.log('Toggling privacy for scenario:', scenarioId, 'from', currentIsPublic, 'to', !currentIsPublic);
      console.log('User ID:', user.id);
      
      const { data: updateData, error } = await supabase
        .from('scenarios')
        .update({ is_public: !currentIsPublic })
        .eq('id', scenarioId)
        .eq('created_by', user.id)
        .select();

      console.log('Update result:', updateData, 'Error:', error);

      if (error) {
        console.error('Error toggling scenario privacy:', error);
        return;
      }

      console.log('Privacy toggle successful, updating local state');
      // Update local state
      const updatedScenarios = localScenarios.map((s: Scenario) => 
        s.id === scenarioId ? { ...s, isPublic: !currentIsPublic } : s
      );
      setLocalScenarios(updatedScenarios);
      console.log('Local state updated:', updatedScenarios);
    } catch (error) {
      console.error('Error toggling scenario privacy:', error);
    } finally {
      isUpdatingPrivacyRef.current = false;
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

  console.log('My Scenarios - Render state:', { 
    loading, 
    user: user ? { id: user.id, email: user.email } : null,
    userExists: !!user,
    userType: typeof user,
    userKeys: user ? Object.keys(user) : null,
    localScenariosCount: localScenarios.length,
    localScenarios: localScenarios.map(s => ({ id: s.id, lang: s.lang }))
  });

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
        {localScenarios.length === 0 ? (
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
            {localScenarios?.map((scenario) => (
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
                      onClick={() => {
                        console.log('Toggle button clicked for scenario:', scenario.id, 'current isPublic:', scenario.isPublic);
                        handleTogglePrivacy(scenario.id, scenario.isPublic || false);
                      }}
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
        {localScenarios.length > 0 && (
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
