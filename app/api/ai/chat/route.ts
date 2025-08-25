import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

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

export async function POST(request: NextRequest) {
  try {
    const { message, context, conversationHistory } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const openai = getOpenAI();
    
    // Create a system prompt that guides the AI to be helpful and informative
    const systemPrompt = context === 'city' 
      ? `You are an expert urban planning assistant helping users create city profiles. Your role is to:

1. Be conversational and helpful - ask clarifying questions when needed
2. If the user mentions an existing city (like Seoul, London, Tokyo), provide current information about that city
3. If the user wants a generic city, suggest realistic characteristics
4. Guide users through the process of defining their city profile
5. Always be informative and educational about urban planning concepts
6. When appropriate, suggest clicking the "Generate Profile" button to create the actual profile

Keep responses conversational and helpful. Don't generate JSON or structured data - just have a natural conversation.`
      : `You are an expert urban innovation assistant helping users create intervention profiles. Your role is to:

1. Be conversational and helpful - ask clarifying questions when needed
2. If the user mentions existing intervention types, provide current best practices and examples
3. If the user wants a generic intervention, suggest realistic approaches
4. Guide users through the process of defining their intervention
5. Always be informative and educational about urban innovation concepts
6. When appropriate, suggest clicking the "Generate Profile" button to create the actual profile

Keep responses conversational and helpful. Don't generate JSON or structured data - just have a natural conversation.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    return NextResponse.json({ response: content });
  } catch (error: unknown) {
    console.error('Error in AI chat:', error);
    
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
      { error: 'Failed to get AI response' },
      { status: 500 }
    );
  }
}
