import { NextRequest, NextResponse } from 'next/server';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  provider?: string;
}

interface ChatRequest {
  message: string;
  provider: 'openai' | 'claude' | 'auto';
  context: {
    pathname: string;
    previousMessages: ChatMessage[];
  };
}

export async function POST(request: NextRequest) {
  try {
    const { message, provider, context }: ChatRequest = await request.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Choose the best provider based on request
    const selectedProvider = await selectAIProvider(provider, message);

    // Get AI response
    const response = await getAIResponse(message, selectedProvider, context);

    // Track usage for analytics (for the n8n monster you're building!)
    await trackAIUsage(selectedProvider, message, response, context);

    return NextResponse.json({
      response,
      provider: selectedProvider,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('General AI chat error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function selectAIProvider(requestedProvider: string, message: string): Promise<string> {
  if (requestedProvider !== 'auto') {
    return requestedProvider;
  }

  // Smart provider selection based on message type
  const messageType = analyzeMessageType(message);

  // Load AI providers from data file (using your existing infrastructure)
  try {
    const fs = require('fs');
    const path = require('path');
    const providersPath = path.join(process.cwd(), 'data', 'ai-providers.json');
    const providersData = JSON.parse(fs.readFileSync(providersPath, 'utf8'));

    // Find enabled providers with priority
    const enabledProviders = providersData.providers
      .filter((p: any) => p.enabled)
      .sort((a: any, b: any) => a.priority - b.priority);

    // Smart selection based on task type
    if (messageType.isCode) {
      // Claude often better for code
      const claude = enabledProviders.find((p: any) => p.provider_type === 'anthropic');
      if (claude) return 'claude';
    }

    if (messageType.isCreative) {
      // OpenAI often better for creative tasks
      const openai = enabledProviders.find((p: any) => p.provider_type === 'openai');
      if (openai) return 'openai';
    }

    // Default to highest priority provider
    return enabledProviders[0]?.provider_type === 'anthropic' ? 'claude' : 'openai';

  } catch (error) {
    console.error('Provider selection error:', error);
    return 'openai'; // Safe fallback
  }
}

function analyzeMessageType(message: string): { isCode: boolean; isCreative: boolean; isAnalytical: boolean } {
  const lowerMessage = message.toLowerCase();

  const codeKeywords = ['code', 'function', 'programming', 'javascript', 'python', 'typescript', 'react', 'api', 'debug', 'error', 'syntax'];
  const creativeKeywords = ['write', 'story', 'creative', 'blog', 'content', 'marketing', 'copy', 'poem', 'design'];
  const analyticalKeywords = ['analyze', 'data', 'statistics', 'calculate', 'research', 'explain', 'compare'];

  return {
    isCode: codeKeywords.some(keyword => lowerMessage.includes(keyword)),
    isCreative: creativeKeywords.some(keyword => lowerMessage.includes(keyword)),
    isAnalytical: analyticalKeywords.some(keyword => lowerMessage.includes(keyword))
  };
}

async function getAIResponse(message: string, provider: string, context: any): Promise<string> {
  if (provider === 'claude') {
    return await getClaudeResponse(message, context);
  } else {
    return await getOpenAIResponse(message, context);
  }
}

async function getClaudeResponse(message: string, context: any): Promise<string> {
  const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

  if (!anthropicApiKey) {
    throw new Error('Anthropic API key not configured');
  }

  // Build conversation history for context
  const messages = [
    {
      role: 'user',
      content: `Context: User is on page "${context.pathname}" in Design-Rite platform.

Previous conversation:
${context.previousMessages.map((msg: ChatMessage) => `${msg.role}: ${msg.content}`).join('\n')}

Current request: ${message}`
    }
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1500,
      messages: messages
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function getOpenAIResponse(message: string, context: any): Promise<string> {
  const openaiApiKey = process.env.OPENAI_API_KEY;

  if (!openaiApiKey) {
    throw new Error('OpenAI API key not configured');
  }

  // Build conversation history
  const messages = [
    {
      role: 'system',
      content: `You are a helpful AI assistant. The user is currently on page "${context.pathname}" in the Design-Rite platform. Provide direct, helpful responses without any branding constraints.`
    },
    // Add previous messages for context
    ...context.previousMessages.slice(-5).map((msg: ChatMessage) => ({
      role: msg.role,
      content: msg.content
    })),
    {
      role: 'user',
      content: message
    }
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${openaiApiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: messages,
      max_tokens: 1500,
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

async function trackAIUsage(provider: string, request: string, response: string, context: any) {
  // This is where the magic happens for your n8n monster!
  // Track provider performance, response quality, speed, etc.

  const usageData = {
    timestamp: new Date().toISOString(),
    provider,
    requestLength: request.length,
    responseLength: response.length,
    context: context.pathname,
    messageType: analyzeMessageType(request),
    // Add more metrics as needed for your automation platform
  };

  // Store in your analytics system (could be Supabase, file, etc.)
  try {
    // For now, just log. Later you can pipe this to your analytics dashboard
    console.log('AI Usage Tracking:', usageData);

    // TODO: Store in database for analytics dashboard
    // This data will help you build the ultimate AI orchestration platform

  } catch (error) {
    console.error('Failed to track AI usage:', error);
    // Don't fail the request if tracking fails
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    message: 'General AI Chat API',
    endpoints: {
      'POST /api/general-ai-chat': 'Send message to AI (unrestricted)',
    },
    providers: ['openai', 'claude', 'auto'],
    version: '1.0.0'
  });
}