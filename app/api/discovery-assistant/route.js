// app/api/discovery-assistant/route.js
import { NextResponse } from 'next/server';

const CLAUDE_CONFIG = {
  endpoint: 'https://api.anthropic.com/v1/messages',
  model: 'claude-3-5-sonnet-20241022',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01'
  }
};

// Discovery Assistant System Prompt
const DISCOVERY_SYSTEM_PROMPT = `You are a senior security consultant and sales engineer with 20+ years of experience helping integrators conduct systematic client discovery for security system projects.

Your role is to guide integrators through the proven 7-step discovery methodology:
1. WHO - Stakeholders, users, decision makers
2. WHAT - Protection goals, requirements, existing infrastructure 
3. WHEN - Timeline, deadlines, funding schedules
4. WHERE - Physical layout, installation locations, infrastructure
5. WHY - Project drivers, priorities, success metrics
6. HOW - Technical implementation, integration, support
7. COMPLIANCE - Codes, regulations, industry standards

CRITICAL GUIDELINES:
- Ask ONE focused question at a time
- Build on previous answers naturally
- Probe for specifics when answers are vague
- Capture decision-maker authority clearly
- Identify budget ranges tactfully
- Note compliance requirements for each facility type
- Maintain professional, consultative tone
- Help integrators avoid missing critical details

Remember: Your goal is ensuring integrators capture EVERYTHING needed for a winning proposal and smooth implementation.`;

// Call Claude API
async function callClaude(prompt) {
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

// Main API endpoint
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, conversationHistory = [] } = body;

    // Validate required fields
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check API key
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ 
        error: 'Claude API not configured. Please add ANTHROPIC_API_KEY to environment variables.' 
      }, { status: 500 });
    }

    // Create discovery-focused prompt
    const conversationContext = conversationHistory.map(msg => 
      `${msg.role === 'user' ? 'INTEGRATOR' : 'ASSISTANT'}: ${msg.content}`
    ).join('\n\n');

    const prompt = `${DISCOVERY_SYSTEM_PROMPT}

CURRENT CONVERSATION:
${conversationContext}

INTEGRATOR'S LATEST MESSAGE: ${message}

Respond as the discovery assistant, asking follow-up questions to systematically capture client requirements. Build naturally on the conversation flow.`;
    
    // Call Claude API
    const claudeResponse = await callClaude(prompt);
    
    // Create response message
    const assistantMessage = {
      role: 'assistant',
      content: claudeResponse,
      timestamp: new Date()
    };

    return NextResponse.json({
      success: true,
      message: assistantMessage
    });

  } catch (error) {
    console.error('Discovery Assistant API error:', error);
    
    return NextResponse.json({
      error: 'Failed to process discovery request',
      details: error.message,
      fallback: {
        role: 'assistant',
        content: `I'm having trouble connecting to the AI service right now. Let's continue manually. What specific details can you share about this client's security requirements?`,
        timestamp: new Date()
      }
    }, { status: 500 });
  }
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    service: 'Discovery Assistant API',
    status: 'healthy',
    claude_configured: !!process.env.ANTHROPIC_API_KEY,
    timestamp: new Date().toISOString()
  });
}