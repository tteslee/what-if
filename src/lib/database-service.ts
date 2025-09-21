import { supabase } from './supabase';
import { CityProfile, Intervention, Scenario, ScenarioResult } from './schemas';

export class DatabaseService {
  private static instance: DatabaseService;

  static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private constructor() {}

  // City methods
  async getCities(): Promise<CityProfile[]> {
    try {
      const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('is_public', true)
        .order('name');

      if (error) {
        console.error('Error fetching cities:', error);
        return [];
      }

      return data?.map(this.transformCityFromDB) || [];
    } catch (error) {
      console.error('Error fetching cities:', error);
      return [];
    }
  }

  async saveCity(city: CityProfile): Promise<boolean> {
    try {
      const cityData = this.transformCityToDB(city);
      const { error } = await supabase
        .from('cities')
        .upsert(cityData);

      if (error) {
        console.error('Error saving city:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving city:', error);
      return false;
    }
  }

  async deleteCity(cityId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('cities')
        .delete()
        .eq('id', cityId);

      if (error) {
        console.error('Error deleting city:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting city:', error);
      return false;
    }
  }

  // Intervention methods
  async getInterventions(): Promise<Intervention[]> {
    try {
      const { data, error } = await supabase
        .from('interventions')
        .select('*')
        .eq('is_public', true)
        .order('title');

      if (error) {
        console.error('Error fetching interventions:', error);
        return [];
      }

      return data?.map(this.transformInterventionFromDB) || [];
    } catch (error) {
      console.error('Error fetching interventions:', error);
      return [];
    }
  }

  async saveIntervention(intervention: Intervention): Promise<boolean> {
    try {
      const interventionData = this.transformInterventionToDB(intervention);
      const { error } = await supabase
        .from('interventions')
        .upsert(interventionData);

      if (error) {
        console.error('Error saving intervention:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving intervention:', error);
      return false;
    }
  }

  async deleteIntervention(interventionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('interventions')
        .delete()
        .eq('id', interventionId);

      if (error) {
        console.error('Error deleting intervention:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting intervention:', error);
      return false;
    }
  }

  // Scenario methods
  async getScenarios(): Promise<Scenario[]> {
    try {
      const { data, error } = await supabase
        .from('scenarios')
        .select('*')
        .eq('is_public', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching scenarios:', error);
        return [];
      }

      return data?.map(this.transformScenarioFromDB) || [];
    } catch (error) {
      console.error('Error fetching scenarios:', error);
      return [];
    }
  }

  async saveScenario(scenario: Scenario): Promise<boolean> {
    try {
      const scenarioData = this.transformScenarioToDB(scenario);
      const { error } = await supabase
        .from('scenarios')
        .upsert(scenarioData);

      if (error) {
        console.error('Error saving scenario:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving scenario:', error);
      return false;
    }
  }

  async deleteScenario(scenarioId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('scenarios')
        .delete()
        .eq('id', scenarioId);

      if (error) {
        console.error('Error deleting scenario:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting scenario:', error);
      return false;
    }
  }

  // Scenario Result methods
  async getScenarioResult(scenarioId: string): Promise<ScenarioResult | null> {
    try {
      const { data, error } = await supabase
        .from('scenario_results')
        .select('*')
        .eq('scenario_id', scenarioId)
        .single();

      if (error) {
        console.error('Error fetching scenario result:', error);
        return null;
      }

      return data ? this.transformScenarioResultFromDB(data) : null;
    } catch (error) {
      console.error('Error fetching scenario result:', error);
      return null;
    }
  }

  async saveScenarioResult(result: ScenarioResult): Promise<boolean> {
    try {
      const resultData = this.transformScenarioResultToDB(result);
      const { error } = await supabase
        .from('scenario_results')
        .upsert(resultData);

      if (error) {
        console.error('Error saving scenario result:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error saving scenario result:', error);
      return false;
    }
  }

  // Data transformation methods
  private transformCityFromDB(dbCity: Record<string, unknown>): CityProfile {
    return {
      id: dbCity.id as string,
      name: dbCity.name as string,
      scale: dbCity.scale as "Citywide" | "DistrictNeighbourhood" | "CorridorStreet" | "SpecificSite",
      mainChallenges: dbCity.main_challenges as string[],
      populationContext: dbCity.population_context as { size?: number; demographics?: string } | undefined,
      neighbourhoodCharacteristics: dbCity.neighbourhood_characteristics as string | undefined,
      vulnerableGroups: dbCity.vulnerable_groups as string[] | undefined,
      regulatoryContext: dbCity.regulatory_context as string | undefined,
      timeline: dbCity.timeline as string | undefined,
      budgetConstraints: dbCity.budget_constraints as string | undefined,
      existingAssets: dbCity.existing_assets as string[] | undefined,
      demographics: dbCity.demographics as unknown,
      mobility: dbCity.mobility as unknown,
      housing: dbCity.housing as unknown,
      environment: dbCity.environment as unknown,
      health: dbCity.health as unknown,
      economy: dbCity.economy as unknown,
      socialGovernance: dbCity.social_governance as unknown,
      fiscal: dbCity.fiscal as unknown,
      dataQuality: dbCity.data_quality as unknown,
      implementationReadiness: dbCity.implementation_readiness as unknown,
      customIndicators: dbCity.custom_indicators as unknown,
    };
  }

  private transformCityToDB(city: CityProfile): Record<string, unknown> {
    return {
      id: city.id,
      name: city.name,
      scale: city.scale,
      main_challenges: city.mainChallenges,
      population_context: city.populationContext,
      neighbourhood_characteristics: city.neighbourhoodCharacteristics,
      vulnerable_groups: city.vulnerableGroups,
      regulatory_context: city.regulatoryContext,
      timeline: city.timeline,
      budget_constraints: city.budgetConstraints,
      existing_assets: city.existingAssets,
      demographics: city.demographics,
      mobility: city.mobility,
      housing: city.housing,
      environment: city.environment,
      health: city.health,
      economy: city.economy,
      social_governance: city.socialGovernance,
      fiscal: city.fiscal,
      data_quality: city.dataQuality,
      implementation_readiness: city.implementationReadiness,
      custom_indicators: city.customIndicators,
      is_public: true,
    };
  }

  private transformInterventionFromDB(dbIntervention: Record<string, unknown>): Intervention {
    return {
      id: dbIntervention.id as string,
      title: dbIntervention.title as string,
      summary: dbIntervention.summary as string,
      category: dbIntervention.category as "BehaviourChange" | "CivicParticipation" | "SkillsAndIndustry" | "PhysicalInfrastructure" | "Governance" | "PolicyAndRegulation" | "Finance" | "Technology",
      scopeOfApplication: dbIntervention.scope_of_application as string,
      detailedDescription: dbIntervention.detailed_description as string | undefined,
      parameters: dbIntervention.parameters as unknown,
      synergies: dbIntervention.synergies as string[] | undefined,
      intendedOutcomes: dbIntervention.intended_outcomes as string[] | undefined,
      stakeholderFocus: dbIntervention.stakeholder_focus as string[] | undefined,
      implementationNotes: dbIntervention.implementation_notes as string | undefined,
      risks: dbIntervention.risks as string[] | undefined,
      categories: dbIntervention.categories as string[] | undefined,
      description: dbIntervention.description as string | undefined,
      params: dbIntervention.params as unknown,
      mechanisms: dbIntervention.mechanisms as unknown,
      implementation: dbIntervention.implementation as unknown,
      assumptions: dbIntervention.assumptions as string[] | undefined,
      subInterventions: dbIntervention.sub_interventions as unknown,
    };
  }

  private transformInterventionToDB(intervention: Intervention): Record<string, unknown> {
    return {
      id: intervention.id,
      title: intervention.title,
      summary: intervention.summary,
      category: intervention.category,
      scope_of_application: intervention.scopeOfApplication,
      detailed_description: intervention.detailedDescription,
      parameters: intervention.parameters,
      synergies: intervention.synergies,
      intended_outcomes: intervention.intendedOutcomes,
      stakeholder_focus: intervention.stakeholderFocus,
      implementation_notes: intervention.implementationNotes,
      risks: intervention.risks,
      categories: intervention.categories,
      description: intervention.description,
      params: intervention.params,
      mechanisms: intervention.mechanisms,
      implementation: intervention.implementation,
      assumptions: intervention.assumptions,
      sub_interventions: intervention.subInterventions,
      is_public: true,
    };
  }

  private transformScenarioFromDB(dbScenario: Record<string, unknown>): Scenario {
    return {
      id: dbScenario.id as string,
      whatIfQuestion: dbScenario.what_if_question as string,
      cityId: dbScenario.city_id as string,
      interventionIds: dbScenario.intervention_ids as string[],
      notes: dbScenario.notes as string | undefined,
    };
  }

  private transformScenarioToDB(scenario: Scenario): Record<string, unknown> {
    return {
      id: scenario.id,
      what_if_question: scenario.whatIfQuestion,
      city_id: scenario.cityId,
      intervention_ids: scenario.interventionIds,
      notes: scenario.notes,
      is_public: true,
    };
  }

  private transformScenarioResultFromDB(dbResult: Record<string, unknown>): ScenarioResult {
    return {
      scenarioId: dbResult.scenario_id as string,
      narrativeSummary: dbResult.narrative_summary as string,
      stakeholderImpacts: dbResult.stakeholder_impacts as unknown,
      systemEffects: dbResult.system_effects as unknown,
      policyInteractions: dbResult.policy_interactions as unknown,
      risks: dbResult.risks as unknown,
      assumptions: dbResult.assumptions as unknown,
      signals: dbResult.signals as unknown,
      experiments: dbResult.experiments as unknown,
      synergies: dbResult.synergies as string[] | undefined,
      gaps: dbResult.gaps as string[] | undefined,
      generatedAt: dbResult.generated_at as string,
      confidence_0_1: dbResult.confidence_0_1 as number,
    };
  }

  private transformScenarioResultToDB(result: ScenarioResult): Record<string, unknown> {
    return {
      id: `result-${result.scenarioId}`,
      scenario_id: result.scenarioId,
      narrative_summary: result.narrativeSummary,
      stakeholder_impacts: result.stakeholderImpacts,
      system_effects: result.systemEffects,
      policy_interactions: result.policyInteractions,
      risks: result.risks,
      assumptions: result.assumptions,
      signals: result.signals,
      experiments: result.experiments,
      synergies: result.synergies,
      gaps: result.gaps,
      generated_at: result.generatedAt,
      confidence_0_1: result.confidence_0_1,
    };
  }

  // Utility methods
  async clearAllData(): Promise<boolean> {
    try {
      // Note: This will only work if you have proper permissions
      // For now, we'll just return true as this might not be needed
      console.log('Clear all data not implemented for database service');
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  }

  async exportData(): Promise<{ cities: CityProfile[], interventions: Intervention[] }> {
    try {
      const cities = await this.getCities();
      const interventions = await this.getInterventions();
      return { cities, interventions };
    } catch (error) {
      console.error('Error exporting data:', error);
      return { cities: [], interventions: [] };
    }
  }
}

export const databaseService = DatabaseService.getInstance();
