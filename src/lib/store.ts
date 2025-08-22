import { create } from 'zustand';
import { storageService } from './storage-service';
import { sampleCities, sampleInterventions } from '../data/sample-data';
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
  createScenario: () => Scenario | null;
  generateScenario: (scenarioId: string) => Promise<ScenarioResult | null>;
  loadSampleData: () => void;
  generateCustomCity: (description: string) => Promise<CityProfile | null>;
  generateCustomIntervention: (description: string) => Promise<Intervention | null>;
  addCustomCity: (city: CityProfile) => void;
  addCustomIntervention: (intervention: Intervention) => void;
  deleteCustomCity: (cityId: string) => void;
  deleteCustomIntervention: (interventionId: string) => void;
  clearLegacyData: () => void;
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
  createScenario: () => {
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
    };

    set((state) => ({
      scenarios: [...state.scenarios, scenario],
    }));

    return scenario;
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
      
      set((state) => ({
        results: { ...state.results, [scenarioId]: result },
      }));

      return result;
    } catch (error) {
      console.error('Error generating scenario:', error);
      throw error;
    }
  },
  
  loadSampleData: () => {
    console.log('Loading sample data...');
    
    // Clear any legacy data first
    storageService.clearLegacyData();
    
    const customCities = storageService.getCustomCities();
    const customInterventions = storageService.getCustomInterventions();
    
    console.log('Sample cities:', sampleCities);
    console.log('Custom cities:', customCities);
    console.log('Sample interventions:', sampleInterventions);
    console.log('Custom interventions:', customInterventions);
    
    const newCities = [...sampleCities, ...customCities];
    const newInterventions = [...sampleInterventions, ...customInterventions];
    
    console.log('About to set state with:', { newCities, newInterventions });
    
    set({
      cities: newCities,
      interventions: newInterventions,
    });
    
    console.log('Store state after loading:', {
      cities: newCities,
      interventions: newInterventions,
    });
    
    // Verify the state was actually updated
    setTimeout(() => {
      const state = get();
      console.log('Store state verification after timeout:', {
        cities: state.cities,
        interventions: state.interventions,
      });
    }, 100);
  },
  
  // Custom Profile Management
  addCustomCity: (city: CityProfile) => {
    storageService.saveCustomCity(city);
    set((state) => ({
      cities: [...state.cities, city]
    }));
  },
  
  addCustomIntervention: (intervention: Intervention) => {
    storageService.saveCustomIntervention(intervention);
    set((state) => ({
      interventions: [...state.interventions, intervention]
    }));
  },
  
  deleteCustomCity: (cityId: string) => {
    storageService.deleteCustomCity(cityId);
    set((state) => ({
      cities: state.cities.filter(c => c.id !== cityId)
    }));
  },
  
  deleteCustomIntervention: (interventionId: string) => {
    storageService.deleteCustomIntervention(interventionId);
    set((state) => ({
      interventions: state.interventions.filter(i => i.id !== interventionId)
    }));
  },
  
  generateCustomCity: async (description: string) => {
    try {
      console.log('Calling generate city API with description:', description);
      
      const response = await fetch('/api/ai/generate-city', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      console.log('API response status:', response.status);
      console.log('API response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const responseText = await response.text();
        console.error('API error response text:', responseText);
        
        let errorMessage = 'Failed to generate city';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response as JSON:', parseError);
          errorMessage = `HTTP ${response.status}: ${responseText.substring(0, 100)}`;
        }
        
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      console.log('API success response text:', responseText);
      
      let cityData;
      try {
        cityData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse success response as JSON:', parseError);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
      }

      console.log('Parsed city data:', cityData);
      const state = get();
      state.addCustomCity(cityData);
      return cityData;
    } catch (error) {
      console.error('Error generating custom city:', error);
      throw error; // Re-throw the error so the UI can handle it
    }
  },
  
  generateCustomIntervention: async (description: string) => {
    try {
      console.log('Calling generate intervention API with description:', description);
      
      const response = await fetch('/api/ai/generate-intervention', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      console.log('API response status:', response.status);
      console.log('API response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const responseText = await response.text();
        console.error('API error response text:', responseText);
        
        let errorMessage = 'Failed to generate intervention';
        try {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.error || errorMessage;
        } catch (parseError) {
          console.error('Failed to parse error response as JSON:', parseError);
          errorMessage = `HTTP ${response.status}: ${responseText.substring(0, 100)}`;
        }
        
        throw new Error(errorMessage);
      }

      const responseText = await response.text();
      console.log('API success response text:', responseText);
      
      let interventionData;
      try {
        interventionData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse success response as JSON:', parseError);
        throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
      }

      console.log('Parsed intervention data:', interventionData);
      const state = get();
      state.addCustomIntervention(interventionData);
      return interventionData;
    } catch (error) {
      console.error('Error generating custom intervention:', error);
      throw error; // Re-throw the error so the UI can handle it
    }
  },
  
  clearLegacyData: () => {
    storageService.clearLegacyData();
    // Reload data after clearing legacy data
    const customCities = storageService.getCustomCities();
    const customInterventions = storageService.getCustomInterventions();
    
    set({
      cities: [...sampleCities, ...customCities],
      interventions: [...sampleInterventions, ...customInterventions],
    });
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
