import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { CitySchema } from '../../../../src/lib/schemas';

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

    const systemPrompt = `You are an urban planning expert. Based on the user's description, create a detailed city profile in JSON format that matches this structure: {
  "id": "custom-city-[timestamp]",
  "name": "City Name",
  "population": 500000,
  "households": 200000,
  "baselineHealthIndex": 0.75,
  "trustIndex": 0.65,
  "modalSplit": {
    "car": 0.6,
    "transit": 0.25,
    "walk": 0.1,
    "cycle": 0.05
  },
  "emissionsBaseline": 1500000,
  "congestionBaseline": 0.4,
  "avgCommuteBaseline": 25,
  "fiscalBaseline": 500
}

Make the values realistic based on the city description. Ensure all numeric values are numbers, not strings.`;

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

    const cityData = JSON.parse(jsonMatch[0]);
    
    // Validate and set defaults using Zod
    const validatedCity = CitySchema.parse({
      ...cityData,
      id: cityData.id || `custom-city-${Date.now()}`,
    });

    return NextResponse.json(validatedCity);
  } catch (error: unknown) {
    console.error('Error generating city profile:', error);
    
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
      { error: 'Failed to generate city profile' },
      { status: 500 }
    );
  }
}
