import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      cities: {
        Row: {
          id: string;
          name: string;
          scale: string;
          main_challenges: string[];
          population_context: any;
          neighbourhood_characteristics: string | null;
          vulnerable_groups: string[] | null;
          regulatory_context: string | null;
          timeline: string | null;
          budget_constraints: string | null;
          existing_assets: string[] | null;
          demographics: any;
          mobility: any;
          housing: any;
          environment: any;
          health: any;
          economy: any;
          social_governance: any;
          fiscal: any;
          data_quality: any;
          implementation_readiness: any;
          custom_indicators: any;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          is_public: boolean;
        };
        Insert: {
          id: string;
          name: string;
          scale: string;
          main_challenges: string[];
          population_context?: any;
          neighbourhood_characteristics?: string | null;
          vulnerable_groups?: string[] | null;
          regulatory_context?: string | null;
          timeline?: string | null;
          budget_constraints?: string | null;
          existing_assets?: string[] | null;
          demographics?: any;
          mobility?: any;
          housing?: any;
          environment?: any;
          health?: any;
          economy?: any;
          social_governance?: any;
          fiscal?: any;
          data_quality?: any;
          implementation_readiness?: any;
          custom_indicators?: any;
          created_by?: string | null;
          is_public?: boolean;
        };
        Update: {
          id?: string;
          name?: string;
          scale?: string;
          main_challenges?: string[];
          population_context?: any;
          neighbourhood_characteristics?: string | null;
          vulnerable_groups?: string[] | null;
          regulatory_context?: string | null;
          timeline?: string | null;
          budget_constraints?: string | null;
          existing_assets?: string[] | null;
          demographics?: any;
          mobility?: any;
          housing?: any;
          environment?: any;
          health?: any;
          economy?: any;
          social_governance?: any;
          fiscal?: any;
          data_quality?: any;
          implementation_readiness?: any;
          custom_indicators?: any;
          updated_at?: string;
          is_public?: boolean;
        };
      };
      interventions: {
        Row: {
          id: string;
          title: string;
          summary: string;
          category: string;
          scope_of_application: string;
          detailed_description: string | null;
          parameters: any;
          synergies: string[] | null;
          intended_outcomes: string[] | null;
          stakeholder_focus: string[] | null;
          implementation_notes: string | null;
          risks: string[] | null;
          categories: string[] | null;
          description: string | null;
          params: any;
          mechanisms: any;
          implementation: any;
          assumptions: string[] | null;
          sub_interventions: any;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          is_public: boolean;
        };
        Insert: {
          id: string;
          title: string;
          summary: string;
          category: string;
          scope_of_application: string;
          detailed_description?: string | null;
          parameters?: any;
          synergies?: string[] | null;
          intended_outcomes?: string[] | null;
          stakeholder_focus?: string[] | null;
          implementation_notes?: string | null;
          risks?: string[] | null;
          categories?: string[] | null;
          description?: string | null;
          params?: any;
          mechanisms?: any;
          implementation?: any;
          assumptions?: string[] | null;
          sub_interventions?: any;
          created_by?: string | null;
          is_public?: boolean;
        };
        Update: {
          id?: string;
          title?: string;
          summary?: string;
          category?: string;
          scope_of_application?: string;
          detailed_description?: string | null;
          parameters?: any;
          synergies?: string[] | null;
          intended_outcomes?: string[] | null;
          stakeholder_focus?: string[] | null;
          implementation_notes?: string | null;
          risks?: string[] | null;
          categories?: string[] | null;
          description?: string | null;
          params?: any;
          mechanisms?: any;
          implementation?: any;
          assumptions?: string[] | null;
          sub_interventions?: any;
          updated_at?: string;
          is_public?: boolean;
        };
      };
      scenarios: {
        Row: {
          id: string;
          what_if_question: string;
          city_id: string;
          intervention_ids: string[];
          notes: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          is_public: boolean;
        };
        Insert: {
          id: string;
          what_if_question: string;
          city_id: string;
          intervention_ids: string[];
          notes?: string | null;
          created_by?: string | null;
          is_public?: boolean;
        };
        Update: {
          id?: string;
          what_if_question?: string;
          city_id?: string;
          intervention_ids?: string[];
          notes?: string | null;
          updated_at?: string;
          is_public?: boolean;
        };
      };
      scenario_results: {
        Row: {
          id: string;
          scenario_id: string;
          narrative_summary: string;
          stakeholder_impacts: any;
          system_effects: any;
          policy_interactions: any;
          risks: any;
          assumptions: any;
          signals: any;
          experiments: any;
          synergies: string[] | null;
          gaps: string[] | null;
          generated_at: string;
          confidence_0_1: number;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id: string;
          scenario_id: string;
          narrative_summary: string;
          stakeholder_impacts: any;
          system_effects: any;
          policy_interactions: any;
          risks: any;
          assumptions: any;
          signals: any;
          experiments: any;
          synergies?: string[] | null;
          gaps?: string[] | null;
          generated_at: string;
          confidence_0_1: number;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          scenario_id?: string;
          narrative_summary?: string;
          stakeholder_impacts?: any;
          system_effects?: any;
          policy_interactions?: any;
          risks?: any;
          assumptions?: any;
          signals?: any;
          experiments?: any;
          synergies?: string[] | null;
          gaps?: string[] | null;
          generated_at?: string;
          confidence_0_1?: number;
          updated_at?: string;
        };
      };
    };
  };
}
