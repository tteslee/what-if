import { create } from 'zustand';
import { Scenario, Result, City, Intervention } from './schemas';
import { sampleCities, sampleInterventions } from '../data/sample-data';
import { runScenario, runComparison } from './simulate';
import { storageService } from './storage-service';

interface WhatIfStore {
  // Data
  cities: City[];
  interventions: Intervention[];
  scenarios: Scenario[];
  results: Record<string, Result>;
  
  // UI State
  currentStep: number;
  selectedCityId: string | null;
  selectedInterventionId: string | null;
  whatIfQuestion: string;
  assumptions: string[];
  
  // Actions
  setCurrentStep: (step: number) => void;
  setSelectedCity: (cityId: string) => void;
  setSelectedIntervention: (interventionId: string) => void;
  setWhatIfQuestion: (question: string) => void;
  addAssumption: (assumption: string) => void;
  removeAssumption: (index: number) => void;
  clearAssumptions: () => void;
  
  // Scenario Management
  createScenario: () => Scenario | null;
  runScenario: (scenarioId: string) => Result | null;
  runComparison: (scenarioIds: string[]) => Result[];
  
  // Data Loading
  loadSampleData: () => void;
  
  // Custom Profile Management
  addCustomCity: (city: City) => void;
  addCustomIntervention: (intervention: Intervention) => void;
  deleteCustomCity: (cityId: string) => void;
  deleteCustomIntervention: (interventionId: string) => void;
  generateCustomCity: (description: string) => Promise<City | null>;
  generateCustomIntervention: (description: string) => Promise<Intervention | null>;
  
  // Reset
  reset: () => void;
}

export const useWhatIfStore = create<WhatIfStore>((set, get) => ({
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
    const { selectedCityId, selectedInterventionId, whatIfQuestion, assumptions } = state;
    
    if (!selectedCityId || !selectedInterventionId || !whatIfQuestion.trim()) {
      return null;
    }
    
    const city = state.cities.find(c => c.id === selectedCityId);
    const intervention = state.interventions.find(i => i.id === selectedInterventionId);
    
    if (!city || !intervention) {
      return null;
    }
    
    const scenario: Scenario = {
      id: `scenario-${Date.now()}`,
      title: whatIfQuestion,
      cityId: selectedCityId,
      intervention,
      assumptions: [...assumptions],
    };
    
    set((state) => ({
      scenarios: [...state.scenarios, scenario]
    }));
    
    return scenario;
  },
  
  runScenario: (scenarioId: string) => {
    const state = get();
    const scenario = state.scenarios.find(s => s.id === scenarioId);
    const city = state.cities.find(c => c.id === scenario?.cityId);
    
    if (!scenario || !city) {
      return null;
    }
    
    const result = runScenario(scenario, city);
    
    set((state) => ({
      results: { ...state.results, [scenarioId]: result }
    }));
    
    return result;
  },
  
  runComparison: (scenarioIds: string[]) => {
    const state = get();
    const scenarios = state.scenarios.filter(s => scenarioIds.includes(s.id));
    const city = state.cities.find(c => c.id === scenarios[0]?.cityId);
    
    if (scenarios.length === 0 || !city) {
      return [];
    }
    
    const results = runComparison(scenarios, city);
    
    // Store results
    const newResults = { ...state.results };
    results.forEach((result, index) => {
      newResults[scenarios[index].id] = result;
    });
    
    set({ results: newResults });
    
    return results;
  },
  
  // Data Loading
  loadSampleData: () => {
    const customCities = storageService.getCustomCities();
    const customInterventions = storageService.getCustomInterventions();
    
    set({
      cities: [...sampleCities, ...customCities],
      interventions: [...sampleInterventions, ...customInterventions],
    });
  },
  
  // Custom Profile Management
  addCustomCity: (city: City) => {
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
      const response = await fetch('/api/ai/generate-city', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate city');
      }

      const city = await response.json();
      const state = get();
      state.addCustomCity(city);
      return city;
    } catch (error) {
      console.error('Error generating custom city:', error);
      return null;
    }
  },
  
  generateCustomIntervention: async (description: string) => {
    try {
      const response = await fetch('/api/ai/generate-intervention', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate intervention');
      }

      const intervention = await response.json();
      const state = get();
      state.addCustomIntervention(intervention);
      return intervention;
    } catch (error) {
      console.error('Error generating custom intervention:', error);
      return null;
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
