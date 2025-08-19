import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { InterventionSchema } from '../../../../src/lib/schemas';

const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set');
  }
  return new OpenAI({ apiKey });
};

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const systemPrompt = `You are an urban innovation expert. Based on the user's description, create a detailed intervention profile in JSON format that matches this structure: {
  "id": "custom-intervention-[timestamp]",
  "name": "Intervention Name",
  "description": "Detailed description of the intervention",
  "domain": "mobility|energy|housing|governance|health|education",
  "params": {
    "costPerHousehold": 500,
    "implementationTime": 24,
    "maintenanceCost": 50
  },
  "rollout": {
    "scope": "citywide|neighborhood|pilot",
    "timeline": "immediate|short-term|long-term"
  },
  "governanceModel": "public|private|partnership|community"
}

Make the values realistic based on the intervention description. Ensure all numeric values are numbers, not strings.`;

    const openai = getOpenAI();
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: description }
      ],
      temperature: 0.7,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const interventionData = JSON.parse(jsonMatch[0]);
    
    // Validate and set defaults using Zod
    const validatedIntervention = InterventionSchema.parse({
      ...interventionData,
      id: interventionData.id || `custom-intervention-${Date.now()}`,
    });

    return NextResponse.json(validatedIntervention);
  } catch (error: unknown) {
    console.error('Error generating intervention profile:', error);
    
    const errorObj = error as { status?: number };
    if (errorObj?.status === 429) {
      return NextResponse.json(
        { error: 'OpenAI API quota exceeded. Please check your billing and usage limits.' },
        { status: 429 }
      );
    } else if (errorObj?.status === 401) {
      return NextResponse.json(
        { error: 'Invalid OpenAI API key. Please check your API key configuration.' },
        { status: 401 }
      );
    } else if (errorObj?.status === 403) {
      return NextResponse.json(
        { error: 'OpenAI API access denied. Please check your account permissions.' },
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate intervention profile' },
      { status: 500 }
    );
  }
}
