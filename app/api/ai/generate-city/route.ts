import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { CityProfileSchema } from '../../../../src/lib/schemas';

const getOpenAI = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  console.log('Environment check:', {
    hasApiKey: !!apiKey,
    apiKeyLength: apiKey ? apiKey.length : 0,
    envKeys: Object.keys(process.env).filter(key => key.includes('OPENAI'))
  });
  
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set. Please check your Vercel environment variables configuration.');
  }
  return new OpenAI({ apiKey });
};

export async function GET() {
  return NextResponse.json({ 
    message: 'City generation API is working!',
    timestamp: new Date().toISOString(),
    envCheck: {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      openAIKeyLength: process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.length : 0
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('City generation API called');
    
    // Check environment variable first
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY not found in environment');
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please check your environment variables.' },
        { status: 500 }
      );
    }

    const { description } = await request.json();
    console.log('Received description:', description);

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const openai = getOpenAI();
    console.log('OpenAI client created successfully');
    
    const systemPrompt = `You are an expert urban planning consultant helping to create a city profile for urban intervention simulation. Your goal is to gather the RIGHT data to enable realistic simulation of urban interventions.

## CRITICAL INSTRUCTION: TAKE ACTION IMMEDIATELY
When you have sufficient information about a city, you MUST generate the complete city profile. Do NOT ask follow-up questions. Do NOT ask for clarification. Do NOT ask about purpose or focus areas. GENERATE THE PROFILE.

## CITY PROFILE STRUCTURE (EXACT SCHEMA)
The final profile must match this structure exactly:
{
  "id": "custom-city-[timestamp]",
  "name": "City Name",
  "demographics": { "population": number, "households": number, "medianAge": number, "povertyRatePct": number, "inequalityGini_0_1": number },
  "mobility": { "avgCommuteMin": number, "congestionIndex": number, "modalShare": { "carPct": number, "transitPct": number, "walkPct": number, "cyclePct": number }, "publicTransportCoveragePct": number },
  "housing": { "vacancyRatePct": number, "rentBurdenedHouseholdsPct": number, "affordableUnitsCount": number },
  "environment": { "ghgEmissionsMtCO2e": number, "pm25µgPerM3": number, "no2µgPerM3": number, "urbanCanopyCoverPct": number },
  "health": { "baselineHealthIndex_0_100": number, "respiratoryAdmissionsPer100k": number, "mentalHealthIndex_0_100": number },
  "economy": { "unemploymentRatePct": number, "medianHouseholdIncome": number, "localBusinessFormationRate": number },
  "socialGovernance": { "trustIndex_0_100": number, "civicParticipationRatePct": number, "perceivedSafetyIndex_0_100": number },
  "fiscal": { "municipalBudgetBalanceM": number },
  "dataQuality": { "coverageScore_0_1": number, "freshnessMonths": number, "notes": string },
  "implementationReadiness": { "politicalWill_0_1": number, "institutionalCapacity_0_1": number, "communitySupport_0_1": number, "fundingAvailability_0_1": number }
}

## WHEN TO GENERATE THE PROFILE
Generate the profile immediately when you have:
- A city name/identity
- Population information (or can estimate from context)
- Understanding of main urban challenges
- Ability to infer reasonable values for most schema fields

## WHAT TO DO AFTER GENERATING
1. Present the complete profile in a clear, readable format
2. Say: "Here's your city profile for [City Name]. Please review it to make sure it's accurate."
3. Say: "If you're happy with this profile, click the 'Generate City Profile' button to save it to your scenario."
4. If they want changes, ask: "What would you like me to adjust?"

## ABSOLUTE RULES - NEVER VIOLATE THESE
- **NEVER ask follow-up questions** once you have sufficient information
- **NEVER ask about purpose, focus areas, or comparisons**
- **NEVER ask if they want to explore more options**
- **ALWAYS generate the profile** when you have enough data
- **ALWAYS be decisive** and take action

## DATA COLLECTION STRATEGY
Ask targeted questions ONLY if you're missing essential information:
- Population size
- City type and main characteristics
- Key urban challenges

## REALISTIC VALUES GUIDE
- **London (9M+ population)**: High congestion (0.7-0.8), good transit (25-30%), high inequality (0.5+)
- **Medium city (200k-500k)**: Moderate congestion (0.4-0.6), mixed modal split
- **Small city (50k-200k)**: Lower congestion (0.2-0.4), higher car dependency (70-80%)

## CONVERSATION FLOW
1. **Start broad**: "Tell me about your city - what makes it unique?"
2. **Gather essentials**: Ask for population, city type, main challenges (ONLY if missing)
3. **GENERATE PROFILE**: Create the complete profile immediately when ready
4. **Present for review**: Show profile and ask user to review
5. **Guide to action**: Direct them to click the generate button

## REMEMBER
Your job is to efficiently gather information and generate a complete city profile. When in doubt, GENERATE THE PROFILE. Do not overthink. Do not ask unnecessary questions. Take action.`;

    console.log('Calling OpenAI API...');
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: description }
      ],
      temperature: 0.7,
    });

    console.log('OpenAI API response received');
    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    console.log('OpenAI response content:', content);

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response');
    }

    const cityData = JSON.parse(jsonMatch[0]);
    console.log('Parsed city data:', cityData);
    
    // Validate and set defaults using Zod
    try {
      const validatedCity = CityProfileSchema.parse({
        ...cityData,
        id: cityData.id || `custom-city-${Date.now()}`,
      });
      console.log('City validation successful');
      return NextResponse.json(validatedCity);
    } catch (validationError) {
      console.error('Validation error:', validationError);
      console.error('City data received:', cityData);
      throw new Error(`City data validation failed: ${validationError}`);
    }
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
      { error: `Failed to generate city profile: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
