import { NextRequest, NextResponse } from 'next/server';

const CLAUDE_CONFIG = {
  endpoint: 'https://api.anthropic.com/v1/messages',
  model: 'claude-3-5-sonnet-20241022',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01'
  }
};

const DISCOVERY_SYSTEM_PROMPT = `You are a senior security consultant helping integrators conduct systematic client discovery for security system projects.

Your role is to guide integrators through the 7-step discovery methodology:
1. WHO - Stakeholders, users, decision makers
2. WHAT - Protection goals, requirements, existing infrastructure 
3. WHEN - Timeline, deadlines, funding schedules
4. WHERE - Physical layout, installation locations, infrastructure
5. WHY - Project drivers, priorities, success metrics
6. HOW - Technical implementation, integration, support
7. COMPLIANCE - Codes, regulations, industry standards

CRITICAL GUIDELINES:
- Build on previous conversation context naturally
- Ask specific, probing follow-up questions
- Extract key information (company name, facility type, etc.)
- Maintain professional, consultative tone
- Help integrators capture all details for winning proposals

Remember: Your goal is ensuring integrators capture EVERYTHING needed for a successful project.`;

async function callClaude(prompt: string) {
  try {
    const response = await fetch(CLAUDE_CONFIG.endpoint, {
      method: 'POST',
      headers: CLAUDE_CONFIG.headers,
      body: JSON.stringify({
        model: CLAUDE_CONFIG.model,
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Claude API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Claude API call failed:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        error: 'Claude API not configured' 
      }, { status: 500 });
    }

    // Build conversation context for Claude
    const conversationContext = conversationHistory
      .slice(-10) // Keep last 10 messages for context
      .map((msg: any) => `${msg.role === 'user' ? 'INTEGRATOR' : 'ASSISTANT'}: ${msg.content}`)
      .join('\n\n');

    const prompt = `${DISCOVERY_SYSTEM_PROMPT}

CONVERSATION HISTORY:
${conversationContext}

INTEGRATOR'S LATEST MESSAGE: ${message}

Respond as the discovery assistant, building naturally on the conversation. Extract key details like company names, facility types, and requirements. Ask intelligent follow-up questions to systematically capture client needs.`;

    const claudeResponse = await callClaude(prompt);

    return NextResponse.json({
      success: true,
      message: {
        role: 'assistant',
        content: claudeResponse,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('Discovery Assistant API error:', error);
    
    return NextResponse.json({
      error: 'Failed to process discovery request',
      fallback: {
        role: 'assistant',
        content: "I'm having trouble with the AI service right now. Let me help you manually. You mentioned ABC Warehouse in Sandusky, OH needs a technology refresh for their appliance warehouse. Let's start with the key stakeholders - who are the decision makers for this project?",
        timestamp: new Date()
      }
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Discovery Assistant API',
    status: 'healthy',
    claude_configured: !!process.env.ANTHROPIC_API_KEY,
    timestamp: new Date().toISOString()
  });
}