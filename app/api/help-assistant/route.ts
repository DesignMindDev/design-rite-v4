import { NextResponse } from 'next/server';
import { logAIConversation, generateUserHash, generateSessionId } from '../../../lib/ai-session-logger';

export async function GET() {
  return NextResponse.json({
    service: 'Design-Rite Help Assistant',
    status: 'healthy',
    claude_configured: !!process.env.ANTHROPIC_API_KEY,
    openai_configured: !!process.env.OPENAI_API_KEY,
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    const { message, sessionId, conversationHistory } = await request.json();

    console.log(`Help Assistant - Session: ${sessionId}, Message: ${message}`);

    // Define the controlled system context for the help assistant
    const systemContext = `You are a helpful Design-Rite platform assistant. You help users with:

1. **Platform Navigation**: Guide users through Security Estimate, AI Discovery, and AI Assistant tools
2. **Security System Knowledge**: Answer questions about surveillance, access control, intrusion detection, and fire safety
3. **Pricing Information**: Explain how our real-time pricing works with CDW data and NDAA compliance
4. **Company Information**: Share information about Design-Rite's mission to help sales engineers

**Important Guidelines:**
- Be friendly, professional, and concise
- Focus on Design-Rite platform features and security systems
- If asked about unrelated topics, politely redirect to platform help
- Use emojis sparingly and appropriately
- Provide actionable guidance when possible
- Mention specific tools like "Security Estimate" or "AI Discovery" when relevant

**Key Platform Features to Reference:**
- Security Estimate: 5-minute quick estimates with real pricing
- AI Discovery: 15-20 minute comprehensive assessments
- AI Assistant: Chat-based refinement of existing estimates
- Real-time CDW pricing data for 3,000+ products
- NDAA compliance (excludes banned manufacturers)
- Professional proposal and BOM generation

Keep responses under 300 words and be helpful!`;

    // Check if we have AI API keys configured
    if (process.env.ANTHROPIC_API_KEY) {
      // Use Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307', // Using Haiku for fast, cost-effective responses
          max_tokens: 500,
          system: systemContext,
          messages: [
            ...conversationHistory.map((msg: any) => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: message
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Claude API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantResponse = data.content[0].text;

      // Log conversation to Supabase (non-blocking)
      const userHash = generateUserHash(request);
      const finalSessionId = sessionId || generateSessionId();
      logAIConversation({
        sessionId: finalSessionId,
        userHash,
        userMessage: message,
        aiResponse: assistantResponse,
        aiProvider: 'claude-haiku',
        metadata: {
          feature: 'help-assistant',
          model: 'claude-3-haiku-20240307'
        }
      }).catch(err => console.error('[Help Assistant] Logging error:', err));

      return NextResponse.json({
        response: assistantResponse,
        provider: 'claude-haiku',
        sessionId: finalSessionId
      });

    } else if (process.env.OPENAI_API_KEY) {
      // Use OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // Fast and cost-effective
          max_tokens: 500,
          temperature: 0.7,
          messages: [
            {
              role: 'system',
              content: systemContext
            },
            ...conversationHistory.map((msg: any) => ({
              role: msg.role,
              content: msg.content
            })),
            {
              role: 'user',
              content: message
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      const data = await response.json();
      const assistantResponse = data.choices[0].message.content;

      return NextResponse.json({
        response: assistantResponse,
        provider: 'openai-gpt3.5',
        sessionId: sessionId
      });

    } else {
      // Fallback to enhanced pattern matching when no API keys available
      const response = getEnhancedFallbackResponse(message, conversationHistory);

      return NextResponse.json({
        response: response,
        provider: 'enhanced-fallback',
        sessionId: sessionId
      });
    }

  } catch (error) {
    console.error('Help Assistant API error:', error);

    // Always provide a fallback response
    const fallbackResponse = getEnhancedFallbackResponse(
      typeof error === 'object' && error !== null && 'message' in error
        ? (error as any).message
        : 'general help'
    );

    return NextResponse.json({
      response: fallbackResponse,
      provider: 'fallback',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

function getEnhancedFallbackResponse(message: string, conversationHistory: any[] = []): string {
  const lowerMessage = message.toLowerCase();

  // Pattern matching for common queries
  if (lowerMessage.includes('pricing') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
    return `💰 **Our Pricing Intelligence**

Design-Rite provides real-time pricing from major distributors:

• **Live CDW Data** - Current market prices for 3,000+ security products
• **NDAA Compliant** - Automatically excludes banned manufacturers (Hikvision, Dahua, etc.)
• **Professional Markup** - Industry-standard pricing with installation costs
• **Instant Updates** - Prices refresh automatically from distributor APIs

Start with our **Security Estimate** tool for immediate pricing on your project!`;
  }

  if (lowerMessage.includes('security') || lowerMessage.includes('camera') || lowerMessage.includes('surveillance') || lowerMessage.includes('access control')) {
    return `🔒 **Security System Expertise**

We cover comprehensive security solutions:

• **Video Surveillance** - IP cameras, NVRs, video analytics, storage
• **Access Control** - Card readers, biometrics, mobile credentials
• **Intrusion Detection** - Motion sensors, door/window contacts, glass break
• **Fire Safety** - Smoke detectors, heat sensors, notification devices

Try our **AI Discovery Assistant** for custom recommendations based on your facility type, size, and security concerns!`;
  }

  if (lowerMessage.includes('navigate') || lowerMessage.includes('how to') || lowerMessage.includes('start') || lowerMessage.includes('use')) {
    return `📍 **Platform Navigation Guide**

Choose the right tool for your needs:

1. **Security Estimate** (5 minutes)
   - Quick system configuration
   - Instant pricing estimates
   - Basic recommendations

2. **AI Discovery** (15-20 minutes)
   - Comprehensive facility assessment
   - Detailed compliance analysis
   - Custom security recommendations

3. **AI Assistant** (Ongoing)
   - Refine existing estimates
   - Chat-based improvements
   - Real-time adjustments

Start with Security Estimate if you need something fast!`;
  }

  if (lowerMessage.includes('about') || lowerMessage.includes('company') || lowerMessage.includes('design-rite') || lowerMessage.includes('who')) {
    return `🏢 **About Design-Rite**

We're security professionals who understand sales engineering challenges:

• **Built by Sales Engineers** - We know the pain of Tuesday morning chaos
• **Real Market Intelligence** - Live pricing data and product specifications
• **Professional Outputs** - Proposals, BOMs, implementation plans that win deals
• **Time Savings** - Turn hours of research into minutes of smart automation

**Our Mission**: Transform chaotic project requirements into organized, professional presentations that close deals faster.

*"Get your weekends back" - that's our promise to sales engineers everywhere.*`;
  }

  if (lowerMessage.includes('ai') || lowerMessage.includes('assistant') || lowerMessage.includes('chat')) {
    return `🤖 **AI-Powered Features**

Our platform includes three AI-enhanced tools:

• **AI Discovery Assistant** - Structured 15-20 minute assessment with intelligent questioning
• **AI Assistant Refinement** - Natural conversation to improve existing estimates
• **Smart Recommendations** - AI analyzes your requirements and suggests optimal products

All tools use real market data and industry best practices to generate professional-grade security assessments.

Which AI feature would you like to explore?`;
  }

  if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('question')) {
    return `🆘 **I'm Here to Help!**

I can assist you with:

• **Platform Features** - Security Estimate, AI Discovery, AI Assistant
• **Security Systems** - Cameras, access control, intrusion detection, fire safety
• **Pricing Questions** - How our real-time CDW pricing works
• **Navigation** - Finding the right tool for your project
• **Company Info** - About Design-Rite and our mission

What specific area would you like help with? Feel free to ask detailed questions!`;
  }

  // Check for greeting patterns
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return `👋 **Hello! Welcome to Design-Rite**

I'm here to help you navigate our security estimation platform and answer any questions about:

• Platform tools and features
• Security system recommendations
• Pricing and estimates
• Company information

What would you like to know about? You can ask me anything related to security systems or our platform!`;
  }

  // Generic helpful response
  return `🤔 **I'd be happy to help!**

I specialize in helping with:

• **Platform Navigation** - Security Estimate, AI Discovery, AI Assistant tools
• **Security Systems** - Surveillance, access control, intrusion detection, fire safety
• **Pricing Intelligence** - Real-time CDW data and NDAA compliance
• **Company Information** - About Design-Rite and our mission

Could you be more specific about what you'd like to know? I'm here to make your experience with Design-Rite as smooth as possible!`;
}