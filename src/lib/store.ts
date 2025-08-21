import { create } from 'zustand';
import { storageService } from './storage-service';
import { sampleCities, sampleInterventions } from '../data/sample-data';
import { CityProfile, Intervention, Scenario, Result } from './schemas';

interface WhatIfState {
  // Data
  cities: CityProfile[];
  interventions: Intervention[];
  scenarios: Scenario[];
  results: Record<string, Result>;
  
  // UI State
  currentStep: number;
  whatIfQuestion: string;
  selectedCityId: string | null;
  selectedInterventionId: string | null;
  assumptions: string[];
  
  // Actions
  setCurrentStep: (step: number) => void;
  setWhatIfQuestion: (question: string) => void;
  setSelectedCity: (cityId: string) => void;
  setSelectedIntervention: (interventionId: string) => void;
  addAssumption: (assumption: string) => void;
  removeAssumption: (index: number) => void;
  createScenario: () => Scenario | null;
  runScenario: (scenarioId: string) => Result | null;
  loadSampleData: () => void;
  generateCustomCity: (description: string) => Promise<CityProfile | null>;
  generateCustomIntervention: (description: string) => Promise<Intervention | null>;
  addCustomCity: (city: CityProfile) => void;
  addCustomIntervention: (intervention: Intervention) => void;
  deleteCustomCity: (cityId: string) => void;
  deleteCustomIntervention: (interventionId: string) => void;
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
  selectedInterventionId: null,
  whatIfQuestion: '',
  assumptions: [],
  
  // UI Actions
  setCurrentStep: (step: number) => set({ currentStep: step }),
  
  setSelectedCity: (cityId: string) => set({ selectedCityId: cityId }),
  
  setSelectedIntervention: (interventionId: string) => set({ selectedInterventionId: interventionId }),
  
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
    if (!state.selectedCityId || !state.selectedInterventionId || !state.whatIfQuestion.trim()) {
      return null;
    }

    const scenario: Scenario = {
      id: `scenario-${Date.now()}`,
      title: state.whatIfQuestion,
      cityId: state.selectedCityId,
      interventionIds: [state.selectedInterventionId],
      intendedImpacts: [
        {
          indicator: 'GHGEmissionsMtCO2e',
          targetDirection: 'Decrease',
          priority_1_5: 3,
        },
        {
          indicator: 'CongestionIndex',
          targetDirection: 'Decrease',
          priority_1_5: 3,
        },
      ],
      notes: `Assumptions: ${state.assumptions.join(', ')}`,
    };

    set((state) => ({
      scenarios: [...state.scenarios, scenario],
    }));

    return scenario;
  },

  runScenario: (scenarioId: string) => {
    const state = get();
    const scenario = state.scenarios.find(s => s.id === scenarioId);
    if (!scenario) return null;

    // For now, create a mock result
    // In the future, this will call the actual simulation engine
    const result: Result = {
      scenarioId,
      kpis: {
        GHGEmissionsMtCO2e: {
          baseline: 1.2,
          delta: -0.1,
          deltaPct: -8.3,
          equityAdjustedDeltaPct: -8.5,
        },
        CongestionIndex: {
          baseline: 0.4,
          delta: -0.05,
          deltaPct: -12.5,
          equityAdjustedDeltaPct: -12.0,
        },
        ModalShareCarPct: {
          baseline: 60,
          delta: -3,
          deltaPct: -5.0,
          equityAdjustedDeltaPct: -5.0,
        },
      },
      qualitativeFindings: [
        'Intervention shows promising results in reducing emissions and congestion',
        'Modal shift from car to active transport observed',
        'Equity analysis suggests benefits are well distributed',
      ],
      confidence_0_1: 0.75,
      equityScore_0_100: 78,
      fiscalImpactM: -2.5,
      stakeholderSentiment: {
        citizens: 0.6,
        businesses: 0.3,
        ngo: 0.8,
        council: 0.7,
      },
    };

    set((state) => ({
      results: { ...state.results, [scenarioId]: result },
    }));

    return result;
  },
  
  loadSampleData: () => {
    console.log('Loading sample data...');
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
  
  // Reset
  reset: () => {
    set({
      scenarios: [],
      results: {},
      currentStep: 0,
      selectedCityId: null,
      selectedInterventionId: null,
      whatIfQuestion: '',
      assumptions: [],
    });
  },
}));
