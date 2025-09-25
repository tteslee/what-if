import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { ScenarioResultSchema, Intervention } from '../../../../src/lib/schemas';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { scenarioId, scenarioData, language = 'en' } = await request.json();

    // Use the actual scenario data provided by the user
    const { whatIfQuestion, city, interventions } = scenarioData;
    
    console.log('AI Generation Debug:', {
      scenarioId,
      language,
      whatIfQuestion,
      city: city ? { id: city.id, name: city.name, scale: city.scale } : null,
      interventions: interventions ? interventions.map((i: Intervention) => ({ id: i.id, title: i.title })) : null
    });

    const languageInstruction = language === 'ko' 
      ? 'IMPORTANT: Generate the entire response in Korean (한국어). All text content should be in Korean, including the narrative summary, stakeholder impacts, system effects, and all other sections.'
      : 'IMPORTANT: Generate the entire response in English.';

    const prompt = `You are an expert urban planner and systems analyst. Generate a comprehensive scenario analysis for the following urban intervention:

${languageInstruction}

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

Please provide a structured analysis in the following JSON format. IMPORTANT: 
1. Return ONLY valid JSON - no markdown formatting, no code blocks, no additional text
2. Use ONLY the exact enum values specified below
3. Ensure all required fields are present

{
  "scenarioId": "${scenarioId}",
  "narrativeSummary": "A 5-8 sentence story of what might happen if these interventions are tried, anchored in the what-if question and grounded by the context.",
  "stakeholderImpacts": [
    {
      "group": "Relevant Stakeholder",
      "benefits": ["benefit 1", "benefit 2"],
      "concerns": ["concern 1", "concern 2"],
      "engagementNeeds": ["need 1", "need 2"],
      "stance": "Relevant Stance"
    }
  ],
  "systemEffects": [
    {
      "domain": "Relevant Domain",
      "effect": "description of effect",
      "polarity": "Relevant Polarity",
      "confidence": "Relevant Confidence"
    }
  ],
  "policyInteractions": [
    {
      "policy": "Relevant Policy Name",
      "interaction": "level of relevance",
      "description": "how the intervention interacts with this policy"
    }
  ],
  "risks": [
    {
      "risk": "description of risk",
      "likelihood": "Relevant Likelihood",
      "impact": "Relevant Impact"
    }
  ],
  "assumptions": [
    {
      "assumption": "what the scenario assumes",
      "confidence": "Relevant Confidence"
    }
  ],
  "signals": [
    {
      "signal": "Relevant Signals",
      "description": "what this signal would indicate"
    }
  ],
  "experiments": [
    {
      "experiment": "suggest relevant experiments",
      "effort": "indicate level of effort based on the scale of the intervention",
      "timeline": "indicate the timeline of the experiment"
    }
  ],
  "synergies": ["Suggest relevant synergies based on the intervention or the category of intervention"],
  "gaps": ["Identify gaps in the intervention"],
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

IMPORTANT FOR POLICY INTERACTIONS:
- Generate policies that are actually relevant to the specific interventions and city context
- Consider local, regional, and national policies that would realistically interact with these interventions
- Do NOT use generic examples like "Clean Air Plan" unless the interventions are actually related to air quality
- Think about policies related to: urban planning, transportation, housing, economic development, environmental protection, social services, etc.
- Base policy names on realistic policies that would exist in the given city context

Focus on creating a realistic, nuanced analysis that considers both positive and negative outcomes, stakeholder perspectives, and practical implementation challenges.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert urban planner and systems analyst. Provide realistic, nuanced analysis of urban interventions considering multiple stakeholder perspectives, system effects, and implementation challenges. CRITICAL: 1) Always use the exact enum values specified in the prompt - do not create variations or synonyms. 2) Return ONLY valid JSON format - no markdown, no code blocks, no additional text. 3) For policy interactions, generate policies that are contextually relevant to the specific interventions and city, not generic examples."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error('No response from OpenAI');
    }
    
    console.log('AI Response Debug:', {
      responseLength: responseText.length,
      responsePreview: responseText.substring(0, 200) + '...',
      hasJsonBlocks: responseText.includes('```'),
      hasJsonBlocksWithLang: responseText.includes('```json')
    });

    // Parse the JSON response
    let scenarioResult;
    let jsonText = responseText;
    try {
      // Try to extract JSON from the response if it's wrapped in markdown
      if (responseText.includes('```json')) {
        const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonText = jsonMatch[1];
        }
      } else if (responseText.includes('```')) {
        const jsonMatch = responseText.match(/```\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonText = jsonMatch[1];
        }
      }
      
      scenarioResult = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response as JSON:', parseError);
      console.error('Response text:', responseText);
      console.error('Extracted JSON text:', jsonText);
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
