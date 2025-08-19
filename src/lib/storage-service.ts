import { City, Intervention } from './schemas';

export class StorageService {
  private static instance: StorageService;
  private readonly CITIES_KEY = 'what-if-custom-cities';
  private readonly INTERVENTIONS_KEY = 'what-if-custom-interventions';

  static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  private constructor() {}

  // City storage methods
  saveCustomCity(city: City): void {
    try {
      const existingCities = this.getCustomCities();
      const updatedCities = existingCities.filter(c => c.id !== city.id);
      updatedCities.push(city);
      localStorage.setItem(this.CITIES_KEY, JSON.stringify(updatedCities));
    } catch (error) {
      console.error('Error saving custom city:', error);
    }
  }

  getCustomCities(): City[] {
    try {
      const citiesJson = localStorage.getItem(this.CITIES_KEY);
      return citiesJson ? JSON.parse(citiesJson) : [];
    } catch (error) {
      console.error('Error retrieving custom cities:', error);
      return [];
    }
  }

  deleteCustomCity(cityId: string): void {
    try {
      const existingCities = this.getCustomCities();
      const updatedCities = existingCities.filter(c => c.id !== cityId);
      localStorage.setItem(this.CITIES_KEY, JSON.stringify(updatedCities));
    } catch (error) {
      console.error('Error deleting custom city:', error);
    }
  }

  // Intervention storage methods
  saveCustomIntervention(intervention: Intervention): void {
    try {
      const existingInterventions = this.getCustomInterventions();
      const updatedInterventions = existingInterventions.filter(i => i.id !== intervention.id);
      updatedInterventions.push(intervention);
      localStorage.setItem(this.INTERVENTIONS_KEY, JSON.stringify(updatedInterventions));
    } catch (error) {
      console.error('Error saving custom intervention:', error);
    }
  }

  getCustomInterventions(): Intervention[] {
    try {
      const interventionsJson = localStorage.getItem(this.INTERVENTIONS_KEY);
      return interventionsJson ? JSON.parse(interventionsJson) : [];
    } catch (error) {
      console.error('Error retrieving custom interventions:', error);
      return [];
    }
  }

  deleteCustomIntervention(interventionId: string): void {
    try {
      const existingInterventions = this.getCustomInterventions();
      const updatedInterventions = existingInterventions.filter(i => i.id !== interventionId);
      localStorage.setItem(this.INTERVENTIONS_KEY, JSON.stringify(updatedInterventions));
    } catch (error) {
      console.error('Error deleting custom intervention:', error);
    }
  }

  // Utility methods
  clearAllCustomData(): void {
    try {
      localStorage.removeItem(this.CITIES_KEY);
      localStorage.removeItem(this.INTERVENTIONS_KEY);
    } catch (error) {
      console.error('Error clearing custom data:', error);
    }
  }

  exportCustomData(): { cities: City[], interventions: Intervention[] } {
    return {
      cities: this.getCustomCities(),
      interventions: this.getCustomInterventions(),
    };
  }

  importCustomData(data: { cities: City[], interventions: Intervention[] }): void {
    try {
      if (data.cities) {
        localStorage.setItem(this.CITIES_KEY, JSON.stringify(data.cities));
      }
      if (data.interventions) {
        localStorage.setItem(this.INTERVENTIONS_KEY, JSON.stringify(data.interventions));
      }
    } catch (error) {
      console.error('Error importing custom data:', error);
    }
  }
}

export const storageService = StorageService.getInstance();
