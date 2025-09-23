'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useWhatIfStore } from '../../../src/lib/store';
import { Scenario } from '../../../src/lib/schemas';
import { supabase } from '../../../src/lib/supabase';
import { useTranslation } from '../../../src/contexts/TranslationContext';

export default function PublicScenariosPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { loadSampleData } = useWhatIfStore();
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [loading, setLoading] = useState(true);
  const [languageFilter, setLanguageFilter] = useState<'all' | 'en' | 'ko'>('all');
  const [scenarioDetails, setScenarioDetails] = useState<Record<string, { cityName: string; interventionNames: string }>>({});

  const loadPublicScenarios = useCallback(async () => {
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
          lang: (dbScenario.lang as 'en' | 'ko') || 'en',
        };
      }) || [];

      console.log('Transformed public scenarios:', transformedScenarios);
      setScenarios(transformedScenarios);
      
      // Load city and intervention names for each scenario
      const details: Record<string, { cityName: string; interventionNames: string }> = {};
      for (const scenario of transformedScenarios) {
        const cityName = await getCityName(scenario.cityId, scenario.lang);
        const interventionNames = await getInterventionNames(scenario.interventionIds, scenario.lang);
        details[scenario.id] = { cityName, interventionNames };
      }
      setScenarioDetails(details);
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading public scenarios:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSampleData();
    loadPublicScenarios();
  }, [loadSampleData, loadPublicScenarios]);

  const getCityName = async (cityId: string, lang: 'en' | 'ko' = 'en'): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('name')
        .eq('id', cityId)
        .eq('lang', lang)
        .single();
      
      if (error || !data) {
        // Fallback to any language if not found in specific language
        const { data: fallbackData } = await supabase
          .from('cities')
          .select('name')
          .eq('id', cityId)
          .single();
        return fallbackData?.name || 'Unknown City';
      }
      
      return data.name || 'Unknown City';
    } catch (error) {
      console.error('Error fetching city name:', error);
      return 'Unknown City';
    }
  };

  const getInterventionNames = async (interventionIds: string[], lang: 'en' | 'ko' = 'en'): Promise<string> => {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .select('title')
        .in('id', interventionIds)
        .eq('lang', lang);
      
      if (error || !data || data.length === 0) {
        // Fallback to any language if not found in specific language
        const { data: fallbackData } = await supabase
          .from('interventions')
          .select('title')
          .in('id', interventionIds);
        
        const names = fallbackData?.map(i => i.title).join(', ') || 'Unknown Intervention';
        return names || 'No interventions';
      }
      
      const names = data.map(i => i.title).join(', ');
      console.log('Intervention names for scenario:', interventionIds, '->', names);
      return names || 'No interventions';
    } catch (error) {
      console.error('Error fetching intervention names:', error);
      return 'No interventions';
    }
  };

  const handleViewScenario = (scenarioId: string) => {
    router.push(`/scenarios/${scenarioId}`);
  };

  const filteredScenarios = scenarios.filter(scenario => {
    if (languageFilter === 'all') return true;
    return scenario.lang === languageFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">{t.publicScenarios.loading}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">{t.publicScenarios.title}</h1>
              <p className="text-sm sm:text-base text-slate-600">
                {t.publicScenarios.subtitle}
                {scenarios.length > 0 && (
                  <span className="block sm:inline sm:ml-2 text-slate-500 mt-1 sm:mt-0">
                    ({filteredScenarios.length} of {scenarios.length} scenarios)
                  </span>
                )}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:space-x-2">
              <label className="text-sm font-medium text-slate-700">Filter by language:</label>
              <select
                value={languageFilter}
                onChange={(e) => setLanguageFilter(e.target.value as 'all' | 'en' | 'ko')}
                className="px-3 py-2 border border-slate-300 rounded-md text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-auto"
              >
                <option value="all">All Languages</option>
                <option value="en">English</option>
                <option value="ko">한국어</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scenarios List */}
        {filteredScenarios.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-slate-200 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">{t.publicScenarios.noScenarios}</h3>
            <p className="text-slate-600 mb-6">{t.publicScenarios.noScenariosDescription}</p>
            <button
              onClick={() => router.push('/scenarios/new')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t.publicScenarios.createNewScenario}
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {filteredScenarios.map((scenario) => (
              <div key={scenario.id} className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 flex-1">
                        What if we {scenario.whatIfQuestion}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {t.publicScenarios.public}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          scenario.lang === 'ko' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {scenario.lang === 'ko' ? '한국어' : 'English'}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-slate-600 space-y-1">
                      <div>
                        <span className="font-medium">{t.publicScenarios.city}:</span> {scenarioDetails[scenario.id]?.cityName || 'Loading...'}
                      </div>
                      <div>
                        <span className="font-medium">{t.publicScenarios.interventions}:</span> {scenarioDetails[scenario.id]?.interventionNames || 'Loading...'}
                      </div>
                      {scenario.notes && (
                        <div>
                          <span className="font-medium">{t.publicScenarios.notes}:</span> {scenario.notes}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end sm:justify-start">
                    <button
                      onClick={() => handleViewScenario(scenario.id)}
                      className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      {t.publicScenarios.view}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create New Button */}
        {filteredScenarios.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push('/scenarios/new')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {t.publicScenarios.createNewScenario}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
