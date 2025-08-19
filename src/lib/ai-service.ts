import OpenAI from 'openai';
import { City, Intervention } from './schemas';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, this should be handled server-side
});

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export class AIService {
  private static instance: AIService;
  private conversationHistory: AIChatMessage[] = [];

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  private constructor() {}

  async generateCityProfile(description: string): Promise<City> {
    const systemPrompt = `You are an urban planning expert. Based on the user's description, create a detailed city profile in JSON format that matches this structure:

{
  "id": "unique-id",
  "name": "City Name",
  "population": number,
  "households": number,
  "incomeGini": number (0-1),
  "modalSplit": {
    "car": number (0-1),
    "transit": number (0-1),
    "walk": number (0-1),
    "cycle": number (0-1)
  },
  "emissionsMtCO2e": number,
  "avgCommuteMin": number,
  "housingVacancyRate": number (0-1),
  "baselineHealthIndex": number (0-100),
  "trustIndex": number (0-100)
}

Ensure all numbers are realistic and the modal split percentages sum to approximately 1.0.`;

    const userPrompt = `Please create a city profile for: ${description}`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const cityData = JSON.parse(jsonMatch[0]);
      
      // Validate and ensure required fields
      const city: City = {
        id: cityData.id || `custom-${Date.now()}`,
        name: cityData.name || 'Custom City',
        population: cityData.population || 100000,
        households: cityData.households || Math.round(cityData.population / 2.4),
        incomeGini: cityData.incomeGini || 0.4,
        modalSplit: {
          car: cityData.modalSplit?.car || 0.6,
          transit: cityData.modalSplit?.transit || 0.2,
          walk: cityData.modalSplit?.walk || 0.15,
          cycle: cityData.modalSplit?.cycle || 0.05,
        },
        emissionsMtCO2e: cityData.emissionsMtCO2e || 0.8,
        avgCommuteMin: cityData.avgCommuteMin || 25,
        housingVacancyRate: cityData.housingVacancyRate || 0.1,
        baselineHealthIndex: cityData.baselineHealthIndex || 75,
        trustIndex: cityData.trustIndex || 70,
      };

      return city;
    } catch (error: unknown) {
      console.error('Error generating city profile:', error);
      const errorObj = error as { status?: number; message?: string };
      if (errorObj?.status === 429) {
        throw new Error('OpenAI API quota exceeded. Please check your billing and usage limits.');
      } else if (errorObj?.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your API key configuration.');
      } else if (errorObj?.status === 403) {
        throw new Error('OpenAI API access denied. Please check your account permissions.');
      }
      throw new Error(`Failed to generate city profile: ${errorObj?.message || 'Unknown error'}`);
    }
  }

  async generateInterventionProfile(description: string): Promise<Intervention> {
    const systemPrompt = `You are an urban innovation expert. Based on the user's description, create a detailed intervention profile in JSON format that matches this structure:

{
  "id": "unique-id",
  "name": "Intervention Name",
  "domain": "Mobility|Energy|Housing|PublicHealth|Governance",
  "description": "Detailed description",
  "params": {
    "keyParameter1": number,
    "keyParameter2": number,
    "keyParameter3": number
  },
  "rollout": {
    "scope": "Pilot|District|Citywide",
    "durationMonths": number
  },
  "governanceModel": "Municipal|PublicPrivate|CommunityOwned"
}

Choose the most appropriate domain based on the intervention description. Generate realistic parameter values based on the intervention type.`;

    const userPrompt = `Please create an intervention profile for: ${description}`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('No response from AI');
      }

      // Extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in AI response');
      }

      const interventionData = JSON.parse(jsonMatch[0]);
      
      // Validate and ensure required fields
      const intervention: Intervention = {
        id: interventionData.id || `custom-${Date.now()}`,
        name: interventionData.name || 'Custom Intervention',
        domain: interventionData.domain || 'Mobility',
        description: interventionData.description || description,
        params: interventionData.params || {
          impact: 0.5,
          cost: 1000000,
          timeline: 12,
        },
        rollout: {
          scope: interventionData.rollout?.scope || 'District',
          durationMonths: interventionData.rollout?.durationMonths || 18,
        },
        governanceModel: interventionData.governanceModel || 'Municipal',
      };

      return intervention;
    } catch (error: unknown) {
      console.error('Error generating intervention profile:', error);
      const errorObj = error as { status?: number; message?: string };
      if (errorObj?.status === 429) {
        throw new Error('OpenAI API quota exceeded. Please check your billing and usage limits.');
      } else if (errorObj?.status === 401) {
        throw new Error('Invalid OpenAI API key. Please check your API key configuration.');
      } else if (errorObj?.status === 403) {
        throw new Error('OpenAI API access denied. Please check your account permissions.');
      }
      throw new Error(`Failed to generate intervention profile: ${errorObj?.message || 'Unknown error'}`);
    }
  }

  async chat(message: string, context: 'city' | 'intervention'): Promise<string> {
    const systemPrompt = context === 'city' 
      ? 'You are an urban planning expert helping to create a city profile. Ask clarifying questions to understand the urban context better.'
      : 'You are an urban innovation expert helping to create an intervention profile. Ask clarifying questions to understand the intervention better.';

    this.conversationHistory.push({ role: 'user', content: message });

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          ...this.conversationHistory
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const assistantMessage = response.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a response. Please try again.';
      this.conversationHistory.push({ role: 'assistant', content: assistantMessage });

      return assistantMessage;
    } catch (error: unknown) {
      console.error('Error in AI chat:', error);
      const errorObj = error as { status?: number; message?: string };
      if (errorObj?.status === 429) {
        return 'I apologize, but the OpenAI API quota has been exceeded. Please check your billing and usage limits.';
      } else if (errorObj?.status === 401) {
        return 'I apologize, but there\'s an issue with the API key configuration.';
      } else if (errorObj?.status === 403) {
        return 'I apologize, but there\'s an access permission issue with the OpenAI API.';
      }
      return `I apologize, but I encountered an error: ${errorObj?.message || 'Unknown error'}. Please try again.`;
    }
  }

  clearConversation(): void {
    this.conversationHistory = [];
  }
}

export const aiService = AIService.getInstance();
