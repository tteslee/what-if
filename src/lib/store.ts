import { create } from 'zustand';
import { databaseService } from './database-service';
import { CityProfile, Intervention, Scenario, ScenarioResult } from './schemas';

interface WhatIfState {
  // Data
  cities: CityProfile[];
  interventions: Intervention[];
  scenarios: Scenario[];
  results: Record<string, ScenarioResult>;
  
  // UI State
  currentStep: number;
  whatIfQuestion: string;
  selectedCityId: string | null;
  selectedInterventionIds: string[]; // Support multiple interventions
  assumptions: string[];
  
  // Actions
  setCurrentStep: (step: number) => void;
  setWhatIfQuestion: (question: string) => void;
  setSelectedCity: (cityId: string) => void;
  addSelectedIntervention: (interventionId: string) => void;
  removeSelectedIntervention: (interventionId: string) => void;
  clearSelectedInterventions: () => void;
  addAssumption: (assumption: string) => void;
  removeAssumption: (index: number) => void;
  createScenario: (isPublic?: boolean, lang?: 'en' | 'ko') => Promise<Scenario | null>;
  generateScenario: (scenarioId: string) => Promise<ScenarioResult | null>;
  loadSampleData: (lang?: 'en' | 'ko') => Promise<void>;
  addCustomCity: (city: CityProfile) => Promise<void>;
  addCustomIntervention: (intervention: Intervention) => Promise<void>;
  deleteCustomCity: (cityId: string) => Promise<void>;
  deleteCustomIntervention: (interventionId: string) => Promise<void>;
  clearLegacyData: () => Promise<void>;
  setScenarios: (scenarios: Scenario[]) => void;
  reset: () => void;
}

export const useWhatIfStore = create<WhatIfState>((set, get) => ({
  // Initial state
  cities: [],
  interventions: [],
  scenarios: [],
  results: {},
  currentStep: 0,
  selectedCityId: null,
  selectedInterventionIds: [],
  whatIfQuestion: '',
  assumptions: [],
  
  // UI Actions
  setCurrentStep: (step: number) => set({ currentStep: step }),
  
  setSelectedCity: (cityId: string) => set({ selectedCityId: cityId }),
  
  addSelectedIntervention: (interventionId: string) => {
    set((state) => ({
      selectedInterventionIds: [...state.selectedInterventionIds, interventionId]
    }));
  },
  
  removeSelectedIntervention: (interventionId: string) => {
    set((state) => ({
      selectedInterventionIds: state.selectedInterventionIds.filter(id => id !== interventionId)
    }));
  },
  
  clearSelectedInterventions: () => set({ selectedInterventionIds: [] }),
  
  setWhatIfQuestion: (question: string) => set({ whatIfQuestion: question }),
  
  addAssumption: (assumption: string) => {
    if (assumption.trim()) {
      set((state) => ({ 
        assumptions: [...state.assumptions, assumption.trim()] 
      }));
    }
  },
  
  removeAssumption: (index: number) => {
    set((state) => ({
      assumptions: state.assumptions.filter((_, i) => i !== index)
    }));
  },
  
  clearAssumptions: () => set({ assumptions: [] }),
  
  // Scenario Management
  createScenario: async (isPublic: boolean = false, lang: 'en' | 'ko' = 'en') => {
    const state = get();
    if (!state.selectedCityId || state.selectedInterventionIds.length === 0 || !state.whatIfQuestion.trim()) {
      return null;
    }

    const scenario: Scenario = {
      id: `scenario-${Date.now()}`,
      whatIfQuestion: state.whatIfQuestion,
      cityId: state.selectedCityId,
      interventionIds: state.selectedInterventionIds,
      notes: `Assumptions: ${state.assumptions.join(', ')}`,
      isPublic: isPublic,
      lang: lang,
    };

    const success = await databaseService.saveScenario(scenario, isPublic);
    if (success) {
      set((state) => ({
        scenarios: [...state.scenarios, scenario],
      }));
      return scenario;
    }
    
    return null;
  },

  generateScenario: async (scenarioId: string) => {
    const state = get();
    const scenario = state.scenarios.find(s => s.id === scenarioId);
    if (!scenario) return null;

    // Get the actual city and interventions data
    const city = state.cities.find(c => c.id === scenario.cityId);
    const interventions = state.interventions.filter(i => scenario.interventionIds.includes(i.id));

    if (!city || interventions.length === 0) {
      throw new Error('City or interventions not found');
    }

    try {
      const response = await fetch('/api/ai/generate-scenario', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          scenarioId,
          scenarioData: {
            whatIfQuestion: scenario.whatIfQuestion,
            city,
            interventions
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${await response.text()}`);
      }

      const result: ScenarioResult = await response.json();
      
      // Save result to database
      console.log('Saving scenario result to database:', result);
      const saveSuccess = await databaseService.saveScenarioResult(result);
      console.log('Scenario result save success:', saveSuccess);
      
      set((state) => ({
        results: { ...state.results, [scenarioId]: result },
      }));

      return result;
    } catch (error) {
      console.error('Error generating scenario:', error);
      throw error;
    }
  },
  
  loadSampleData: async (lang: 'en' | 'ko' = 'en') => {
    console.log('Loading data from database for language:', lang);
    
    try {
      // First try to load from database
      const [dbCities, dbInterventions, dbScenarios] = await Promise.all([
        databaseService.getCities(lang),
        databaseService.getInterventions(lang),
        databaseService.getScenarios(lang),
      ]);
      
      console.log('Loaded from database:', { cities: dbCities.length, interventions: dbInterventions.length, scenarios: dbScenarios.length });
      
      // If database has data, use it; otherwise fall back to sample data
      let cities = dbCities;
      let interventions = dbInterventions;
      
      if (dbCities.length === 0 || dbInterventions.length === 0) {
        console.log('Database has no data, loading sample data for language:', lang);
        
        if (lang === 'ko') {
          const { sampleCitiesKo, sampleInterventionsKo } = await import('../data/sample-data');
          cities = dbCities.length > 0 ? dbCities : sampleCitiesKo;
          interventions = dbInterventions.length > 0 ? dbInterventions : sampleInterventionsKo;
        } else {
          const { sampleCities, sampleInterventions } = await import('../data/sample-data');
          cities = dbCities.length > 0 ? dbCities : sampleCities;
          interventions = dbInterventions.length > 0 ? dbInterventions : sampleInterventions;
        }
      }
      
      set({
        cities,
        interventions,
        scenarios: dbScenarios,
      });
      
      console.log('Store state after loading:', {
        cities: cities.length,
        interventions: interventions.length,
        scenarios: dbScenarios.length,
      });
    } catch (error) {
      console.error('Error loading data from database:', error);
      
      // Fallback to sample data on error
      try {
        if (lang === 'ko') {
          const { sampleCitiesKo, sampleInterventionsKo } = await import('../data/sample-data');
          set({
            cities: sampleCitiesKo,
            interventions: sampleInterventionsKo,
            scenarios: [],
          });
        } else {
          const { sampleCities, sampleInterventions } = await import('../data/sample-data');
          set({
            cities: sampleCities,
            interventions: sampleInterventions,
            scenarios: [],
          });
        }
      } catch (fallbackError) {
        console.error('Error loading sample data:', fallbackError);
      }
    }
  },
  
  // Custom Profile Management
  addCustomCity: async (city: CityProfile) => {
    const success = await databaseService.saveCity(city);
    if (success) {
      set((state) => ({
        cities: [...state.cities, city]
      }));
    }
  },
  
  addCustomIntervention: async (intervention: Intervention) => {
    const success = await databaseService.saveIntervention(intervention);
    if (success) {
      set((state) => ({
        interventions: [...state.interventions, intervention]
      }));
    }
  },
  
  deleteCustomCity: async (cityId: string) => {
    const success = await databaseService.deleteCity(cityId);
    if (success) {
      set((state) => ({
        cities: state.cities.filter(c => c.id !== cityId)
      }));
    }
  },
  
  deleteCustomIntervention: async (interventionId: string) => {
    const success = await databaseService.deleteIntervention(interventionId);
    if (success) {
      set((state) => ({
        interventions: state.interventions.filter(i => i.id !== interventionId)
      }));
    }
  },
  
  clearLegacyData: async () => {
    // For database, we don't need to clear legacy data as it's already clean
    // Just reload the data
    await get().loadSampleData();
  },
  
  setScenarios: (scenarios: Scenario[]) => {
    set({ scenarios });
  },
  
  // Reset
  reset: () => {
    set({
      scenarios: [],
      results: {},
      currentStep: 0,
      selectedCityId: null,
      selectedInterventionIds: [],
      whatIfQuestion: '',
      assumptions: [],
    });
  },
}));
