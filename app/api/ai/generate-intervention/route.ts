import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { InterventionSchema } from '../../../../src/lib/schemas';

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
    message: 'Intervention generation API is working!',
    hasOpenAIKey: !!process.env.OPENAI_API_KEY,
    schemaRequirements: {
      categories: ["BehaviourChange", "Participation", "SkillsAndIndustry", "BusinessModels", "UrbanDesign", "Governance", "PolicyAndRegulation", "Finance", "Technology"],
      indicators: ["AvgCommuteMin", "CongestionIndex", "ModalShareCarPct", "ModalShareTransitPct", "ModalShareWalkPct", "ModalShareCyclePct", "HousingVacancyRatePct", "RentBurdenedHouseholdsPct", "AffordableUnitsCount", "GHGEmissionsMtCO2e", "PM25µgPerM3", "NO2µgPerM3", "UrbanCanopyCoverPct", "BaselineHealthIndex_0_100", "RespiratoryAdmissionsPer100k", "MentalHealthIndex_0_100", "UnemploymentRatePct", "MedianHouseholdIncome", "LocalBusinessFormationRate", "TrustIndex_0_100", "CivicParticipationRatePct", "PerceivedSafetyIndex_0_100", "PovertyRatePct", "InequalityGini_0_1", "MunicipalBudgetBalanceM", "ProgrammeCostM"],
      directions: ["Increase", "Decrease", "Target"],
      evidence: ["Low", "Medium", "High"],
      scope: ["Pilot", "District", "Citywide"],
      fundingModel: ["Municipal", "PublicPrivate", "CommunityOwned", "Grant", "UserFees"],
      policyInstruments: ["Regulation", "Incentive", "Standard", "Procurement", "PublicInvestment", "DataGovernance", "EducationCampaign"]
    },
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    console.log('Intervention generation request received');
    const { description } = await request.json();
    console.log('Description received:', description);

    if (!description) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    console.log('Creating OpenAI client...');
    const openai = getOpenAI();
    console.log('OpenAI client created successfully');

    const systemPrompt = `You are an expert urban innovation consultant helping to design interventions for urban simulation. Your goal is to create interventions that can be realistically simulated and will produce measurable outcomes.

## CRITICAL INSTRUCTION: TAKE ACTION IMMEDIATELY
When you have sufficient information about an intervention, you MUST generate the complete intervention profile. Do NOT ask follow-up questions. Do NOT ask for clarification. Do NOT ask about purpose or focus areas. GENERATE THE PROFILE.

## INTERVENTION STRUCTURE (EXACT SCHEMA)
The final profile must match this structure exactly:
{
  "id": "custom-intervention-[timestamp]",
  "title": "Descriptive Title",
  "categories": ["Category1", "Category2"],
  "description": "Clear description of what the intervention does",
  "params": { "param1": number, "param2": number },
  "mechanisms": [
    {
      "description": "Clear causal statement: how the intervention works",
      "expectedEffects": [
        {
          "indicator": "IndicatorName",
          "direction": "Increase|Decrease|Target",
          "magnitudeHintPct": number,
          "evidence": "Low|Medium|High",
          "equityWeight_0_2": number
        }
      ]
    }
  ],
  "implementation": {
    "scope": "Pilot|District|Citywide",
    "durationMonths": number,
    "targetPopulations": ["Population1", "Population2"],
    "targetGeographies": ["Geography1", "Geography2"],
    "partners": ["Partner1", "Partner2"],
    "capexM": number,
    "opexPerYearM": number,
    "fundingModel": "Municipal|PublicPrivate|CommunityOwned|Grant|UserFees",
    "policyInstruments": ["Instrument1", "Instrument2"]
  },
  "assumptions": ["Assumption1", "Assumption2"],
  "risks": ["Risk1", "Risk2"]
}

## WHEN TO GENERATE THE PROFILE
Generate the profile immediately when you have:
- A clear urban challenge being addressed
- A solution approach and mechanism
- Scale and scope of the intervention
- Ability to infer reasonable values for most schema fields

## WHAT TO DO AFTER GENERATING
1. Present the complete profile in a clear, readable format
2. Say: "Here's your intervention profile. Please review it to make sure it's accurate."
3. Say: "If you're happy with this profile, click the 'Generate Intervention Profile' button to save it to your scenario."
4. If they want changes, ask: "What would you like me to adjust?"

## ABSOLUTE RULES - NEVER VIOLATE THESE
- **NEVER ask follow-up questions** once you have sufficient information
- **NEVER ask about purpose, focus areas, or comparisons**
- **NEVER ask if they want to explore more options**
- **ALWAYS generate the profile** when you have enough data
- **ALWAYS be decisive** and take action

## INTERVENTION TYPES & EXAMPLES

### BEHAVIOR CHANGE
- **Congestion pricing**: Reduces car trips, increases transit use
- **Active travel incentives**: Shifts modal split toward walking/cycling
- **Energy efficiency programs**: Reduces emissions, lowers costs

### INFRASTRUCTURE & TECHNOLOGY
- **Green infrastructure**: Improves air quality, reduces heat island
- **Smart mobility**: Optimizes traffic flow, reduces congestion
- **Renewable energy**: Reduces emissions, creates local jobs

### POLICY & GOVERNANCE
- **Zoning changes**: Affects housing supply, development patterns
- **Partnership models**: Leverages private sector, community resources
- **Data governance**: Enables monitoring, builds trust

## REALISTIC EXPECTATIONS
- **Small interventions**: 5-15% change in target indicators
- **Medium interventions**: 15-25% change, often district-scale
- **Large interventions**: 25%+ change, citywide, multiple mechanisms
- **Time to impact**: 6-24 months for most interventions
- **Cost ranges**: $100K-$10M capital, $10K-$1M annual operating

## CONVERSATION FLOW
1. **Start with the problem**: "What urban challenge are you trying to solve?"
2. **Explore the solution**: "How do you think this intervention would work?"
3. **GENERATE PROFILE**: Create the complete profile immediately when ready
4. **Present for review**: Show profile and ask user to review
5. **Guide to action**: Direct them to click the generate button

## SCHEMA REQUIREMENTS
- **Categories**: Must be from the enum list provided
- **Indicators**: Must match the Indicator enum exactly
- **Directions**: Increase, Decrease, or Target only
- **Evidence**: Low, Medium, or High only
- **Scope**: Pilot, District, or Citywide only

## REMEMBER
Your job is to efficiently gather information and generate a complete intervention profile. When in doubt, GENERATE THE PROFILE. Do not overthink. Do not ask unnecessary questions. Take action.`;

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

    console.log('OpenAI response content:', content);
    console.log('Content length:', content.length);

    // Extract JSON from the response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON pattern found in content. Full content:', content);
      throw new Error('No valid JSON found in response');
    }

    console.log('Extracted JSON:', jsonMatch[0]);
    console.log('JSON length:', jsonMatch[0].length);

    let interventionData;
    try {
      interventionData = JSON.parse(jsonMatch[0]);
      console.log('Parsed intervention data:', interventionData);
      console.log('Data keys:', Object.keys(interventionData));
      
      // Log specific fields that commonly cause validation issues
      if (interventionData.categories) {
        console.log('Categories:', interventionData.categories);
      }
      if (interventionData.mechanisms) {
        console.log('Mechanisms count:', interventionData.mechanisms.length);
        interventionData.mechanisms.forEach((mechanism: any, index: number) => {
          console.log(`Mechanism ${index}:`, {
            description: mechanism.description,
            expectedEffects: mechanism.expectedEffects?.map((effect: any) => ({
              indicator: effect.indicator,
              direction: effect.direction,
              evidence: effect.evidence
            }))
          });
        });
      }
      if (interventionData.implementation) {
        console.log('Implementation:', {
          scope: interventionData.implementation.scope,
          fundingModel: interventionData.implementation.fundingModel
        });
      }
    } catch (parseError: unknown) {
      console.error('Failed to parse success response as JSON:', parseError);
      console.error('Raw JSON string:', jsonMatch[0]);
      const errorMessage = parseError instanceof Error ? parseError.message : 'Unknown parse error';
      throw new Error(`Invalid JSON response: ${errorMessage}`);
    }
    
    // Validate and set defaults using Zod
    try {
      console.log('Validating intervention data with schema...');
      const validatedIntervention = InterventionSchema.parse({
        ...interventionData,
        id: interventionData.id || `custom-intervention-${Date.now()}`,
      });
      console.log('Validation successful, returning:', validatedIntervention);
      return NextResponse.json(validatedIntervention);
    } catch (validationError) {
      console.error('Validation error:', validationError);
      console.error('Intervention data received:', interventionData);
      
      // Provide more specific error information
      if (validationError instanceof Error) {
        const errorMessage = validationError.message;
        console.error('Validation error message:', errorMessage);
        
        // Check for common validation issues
        if (errorMessage.includes('categories')) {
          throw new Error(`Categories validation failed. Categories must be from: ["BehaviourChange", "Participation", "SkillsAndIndustry", "BusinessModels", "UrbanDesign", "Governance", "PolicyAndRegulation", "Finance", "Technology"]`);
        }
        if (errorMessage.includes('indicator')) {
          throw new Error(`Indicator validation failed. Indicators must match the exact enum values from the schema.`);
        }
        if (errorMessage.includes('direction')) {
          throw new Error(`Direction validation failed. Direction must be one of: "Increase", "Decrease", "Target"`);
        }
        if (errorMessage.includes('evidence')) {
          throw new Error(`Evidence validation failed. Evidence must be one of: "Low", "Medium", "High"`);
        }
        if (errorMessage.includes('scope')) {
          throw new Error(`Scope validation failed. Scope must be one of: "Pilot", "District", "Citywide"`);
        }
        if (errorMessage.includes('fundingModel')) {
          throw new Error(`Funding model validation failed. Funding model must be one of: "Municipal", "PublicPrivate", "CommunityOwned", "Grant", "UserFees"`);
        }
        
        throw new Error(`Intervention data validation failed: ${errorMessage}`);
      }
      
      throw new Error(`Intervention data validation failed: ${validationError}`);
    }
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
