import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ScenarioResultSchema, Intervention } from '../../../../src/lib/schemas';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { scenarioId, scenarioData } = await request.json();

    // Use the actual scenario data provided by the user
    const { whatIfQuestion, city, interventions } = scenarioData;

    const prompt = `You are an expert urban planner and systems analyst. Generate a comprehensive scenario analysis for the following urban intervention:

**What-if Question:** ${whatIfQuestion}

**City Context:**
- Name: ${city.name}
- Scale: ${city.scale}
- Main Challenges: ${city.mainChallenges.join(', ')}
${city.populationContext ? `- Population: ${city.populationContext.size.toLocaleString()} (${city.populationContext.demographics})` : ''}
${city.existingAssets ? `- Existing Assets: ${city.existingAssets.join(', ')}` : ''}
${city.neighbourhoodCharacteristics ? `- Neighbourhood Characteristics: ${city.neighbourhoodCharacteristics}` : ''}
${city.vulnerableGroups ? `- Vulnerable Groups: ${city.vulnerableGroups.join(', ')}` : ''}
${city.regulatoryContext ? `- Regulatory Context: ${city.regulatoryContext}` : ''}
${city.timeline ? `- Timeline: ${city.timeline}` : ''}
${city.budgetConstraints ? `- Budget Constraints: ${city.budgetConstraints}` : ''}

**Interventions:**
${interventions.map((int: Intervention, i: number) => `
${i + 1}. ${int.title}
   - Summary: ${int.summary}
   - Category: ${int.category}
   - Scope: ${int.scopeOfApplication}
   ${int.stakeholderFocus ? `- Stakeholder Focus: ${int.stakeholderFocus.join(', ')}` : ''}
   ${int.synergies ? `- Synergies: ${int.synergies.join(', ')}` : ''}
`).join('\n')}

Please provide a structured analysis in the following JSON format. IMPORTANT: Use ONLY the exact enum values specified below:

{
  "scenarioId": "${scenarioId}",
  "narrativeSummary": "A 5-8 sentence story of what might happen if these interventions are tried, anchored in the what-if question and grounded by the context.",
  "stakeholderImpacts": [
    {
      "group": "citizens",
      "benefits": ["benefit 1", "benefit 2"],
      "concerns": ["concern 1", "concern 2"],
      "engagementNeeds": ["need 1", "need 2"],
      "stance": "Support"
    }
  ],
  "systemEffects": [
    {
      "domain": "Environment",
      "effect": "description of effect",
      "polarity": "Positive",
      "confidence": "Medium"
    }
  ],
  "policyInteractions": [
    {
      "policy": "Clean Air Plan",
      "interaction": "Enables",
      "description": "how the intervention interacts with this policy"
    }
  ],
  "risks": [
    {
      "risk": "description of risk",
      "likelihood": "Medium",
      "impact": "High"
    }
  ],
  "assumptions": [
    {
      "assumption": "what the scenario assumes",
      "confidence": "High"
    }
  ],
  "signals": [
    {
      "signal": "air quality readings near schools",
      "description": "what this signal would indicate"
    }
  ],
  "experiments": [
    {
      "experiment": "2-week school street trial with mobile sensors",
      "effort": "Low",
      "timeline": "1 month"
    }
  ],
  "synergies": ["Technology + CivicParticipation creates data-driven democracy"],
  "gaps": ["No finance mechanism included"],
  "generatedAt": "${new Date().toISOString()}",
  "confidence_0_1": 0.75
}

CRITICAL ENUM VALUES - Use ONLY these exact values:

1. For "stance" in stakeholderImpacts: ONLY "Support", "Neutral", "Oppose", or "Mixed"
2. For "polarity" in systemEffects: ONLY "Positive", "Negative", "Neutral", or "Mixed"  
3. For "confidence" in systemEffects: ONLY "High", "Medium", or "Low"
4. For "interaction" in policyInteractions: ONLY "Enables", "ConstrainedBy", "ConflictsWith", or "RequiresChange"
5. For "likelihood" in risks: ONLY "High", "Medium", or "Low"
6. For "impact" in risks: ONLY "High", "Medium", or "Low"
7. For "confidence" in assumptions: ONLY "High", "Medium", or "Low"
8. For "effort" in experiments: ONLY "Low", "Medium", or "High"

Do NOT use variations like "Support with reservations", "Affirms", "Somewhat positive", "Ambiguous", etc. Use ONLY the exact enum values listed above.

Focus on creating a realistic, nuanced analysis that considers both positive and negative outcomes, stakeholder perspectives, and practical implementation challenges.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert urban planner and systems analyst. Provide realistic, nuanced analysis of urban interventions considering multiple stakeholder perspectives, system effects, and implementation challenges. CRITICAL: Always use the exact enum values specified in the prompt - do not create variations or synonyms."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }

    // Parse the JSON response
    let scenarioResult;
    try {
      scenarioResult = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.error('Response text:', responseText);
      throw new Error('Invalid JSON response from AI model');
    }

    // Validate the response against our schema
    const validatedResult = ScenarioResultSchema.parse(scenarioResult);

    return NextResponse.json(validatedResult);

  } catch (error) {
    console.error('Error generating scenario:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
