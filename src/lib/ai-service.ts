import { City, Intervention } from './schemas';

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
        throw new Error(errorData.error || 'Failed to generate city profile');
      }

      const cityData = await response.json();
      return cityData;
    } catch (error: unknown) {
      console.error('Error generating city profile:', error);
      const errorObj = error as { message?: string };
      throw new Error(`Failed to generate city profile: ${errorObj?.message || 'Unknown error'}`);
    }
  }

  async generateInterventionProfile(description: string): Promise<Intervention> {
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
        throw new Error(errorData.error || 'Failed to generate intervention profile');
      }

      const interventionData = await response.json();
      return interventionData;
    } catch (error: unknown) {
      console.error('Error generating intervention profile:', error);
      const errorObj = error as { message?: string };
      throw new Error(`Failed to generate intervention profile: ${errorObj?.message || 'Unknown error'}`);
    }
  }

  async chat(message: string, context: 'city' | 'intervention'): Promise<string> {
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message, 
          context, 
          conversationHistory: this.conversationHistory 
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      return data.response;
    } catch (error: unknown) {
      console.error('Error in AI chat:', error);
      const errorObj = error as { message?: string };
      throw new Error(`Failed to get AI response: ${errorObj?.message || 'Unknown error'}`);
    }
  }

  clearConversation(): void {
    this.conversationHistory = [];
  }

  addMessage(message: AIChatMessage): void {
    this.conversationHistory.push(message);
  }

  getConversationHistory(): AIChatMessage[] {
    return [...this.conversationHistory];
  }
}

export const aiService = AIService.getInstance();
