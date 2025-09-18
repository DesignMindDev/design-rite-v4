// app/api/discovery-assistant/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Anthropic Configuration - UPDATED TO LATEST MODEL
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_BASE_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022'; // CRITICAL: Updated model

// Health check endpoint (GET)
export async function GET() {
  return NextResponse.json({
    service: 'Discovery Assistant API',
    status: 'healthy',
    claude_configured: !!ANTHROPIC_API_KEY,
    model: CLAUDE_MODEL,
    timestamp: new Date().toISOString()
  });
}

// Main chat endpoint (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionData, conversationHistory = [] } = body;

    console.log('Discovery Assistant received message:', message);

    // Validate required data
    if (!message) {
      return NextResponse.json({ 
        error: 'Message is required' 
      }, { status: 400 });
    }

    if (!ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return generateFallbackResponse(message, sessionData);
    }

    // Build conversation context
    const context = buildConversationContext(sessionData, conversationHistory);
    
    try {
      // Call Claude API with proper context
      const claudeResponse = await callClaudeAPI(message, context);
      
      return NextResponse.json({
        success: true,
        message: { content: claudeResponse },
        provider: 'claude',
        timestamp: new Date().toISOString()
      });

    } catch (claudeError) {
      console.error('Claude API error:', claudeError);
      
      // Intelligent fallback instead of generic error
      return generateFallbackResponse(message, sessionData);
    }

  } catch (error) {
    console.error('Discovery Assistant API error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error.message 
    }, { status: 500 });
  }
}

// Build conversation context for Claude
function buildConversationContext(sessionData: any, conversationHistory: any[]): string {
  let context = `DESIGN-RITE DISCOVERY SESSION CONTEXT:

DISCOVERY METHODOLOGY: Follow the Design-Rite 7-step discovery process:
1. WHO - Understand the client and stakeholders
2. WHAT - Define security requirements and concerns  
3. WHEN - Establish timeline and urgency
4. WHERE - Analyze facility layout and locations
5. WHY - Understand business drivers and compliance needs
6. HOW - Determine technical requirements and integration
7. COMPLIANCE - Address regulatory and industry standards

CURRENT SESSION DATA:`;

  // Add session information if available
  if (sessionData) {
    if (sessionData.userType) context += `\n- User Type: ${sessionData.userType}`;
    if (sessionData.projectDriver) context += `\n- Project Driver: ${sessionData.projectDriver}`;
    if (sessionData.budgetTier) context += `\n- Budget Tier: ${sessionData.budgetTier}`;
    if (sessionData.timeline) context += `\n- Timeline: ${sessionData.timeline}`;
    if (sessionData.qualificationScore) context += `\n- Qualification Score: ${sessionData.qualificationScore}/100`;
  } else {
    context += `\n- No session data captured yet`;
  }

  // Add conversation history for context
  if (conversationHistory && conversationHistory.length > 0) {
    context += `\n\nCONVERSATION HISTORY:`;
    conversationHistory.slice(-5).forEach((msg, idx) => {
      context += `\n${idx + 1}. ${msg.type}: ${msg.content}`;
    });
  }

  context += `\n\nINSTRUCTIONS: You are the Design-Rite AI Discovery Assistant. Conduct professional security discovery following the 7-step methodology. Ask relevant questions, provide expert guidance, and maintain conversation context. Be specific about security technologies, compliance requirements, and implementation considerations.`;

  return context;
}

// Call Claude API with proper error handling
async function callClaudeAPI(message: string, context: string): Promise<string> {
  const response = await fetch(ANTHROPIC_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `${context}\n\nCurrent message: ${message}`
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Claude API error: ${response.status} ${response.statusText} - ${errorText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

// Generate intelligent fallback responses based on context
function generateFallbackResponse(message: string, sessionData: any) {
  const lowerMessage = message.toLowerCase();
  
  let fallbackContent = '';
  
  // Context-aware responses based on message content
  if (lowerMessage.includes('help') || lowerMessage.includes('start') || lowerMessage.includes('begin')) {
    fallbackContent = `I'd be happy to help you with your security discovery process. Let's start by understanding your facility and security needs.

**To begin, could you tell me:**
- What type of facility are we securing? (office, retail, warehouse, healthcare, etc.)
- What are your primary security concerns?
- Do you have any specific compliance requirements?

This will help me provide targeted recommendations following our 7-step discovery methodology.`;

  } else if (lowerMessage.includes('budget') || lowerMessage.includes('cost') || lowerMessage.includes('price')) {
    fallbackContent = `**Budget Planning for Security Systems:**

Based on our experience, security implementations typically fall into these ranges:
- **Basic Package**: $15,000 - $50,000 (essential cameras and access control)
- **Professional Package**: $50,000 - $150,000 (comprehensive coverage with analytics)
- **Enterprise Package**: $150,000+ (advanced AI, integration, and compliance features)

To provide accurate pricing, I'll need to understand:
- Facility size and layout
- Number of entry points and areas to monitor
- Integration requirements with existing systems
- Compliance standards that must be met`;

  } else if (lowerMessage.includes('camera') || lowerMessage.includes('surveillance') || lowerMessage.includes('video')) {
    fallbackContent = `**Video Surveillance Considerations:**

For effective surveillance design, we consider:
- **Coverage areas**: Entry points, high-value zones, perimeter
- **Camera types**: Fixed, PTZ, thermal, license plate recognition
- **Resolution needs**: 4K for identification, 1080p for general monitoring
- **Storage requirements**: 30-90 days typical retention
- **Analytics**: Motion detection, facial recognition, behavioral analysis

**Key questions for your facility:**
- What areas need monitoring priority?
- Do you need 24/7 or business hours coverage?
- Any specific regulatory requirements for video retention?`;

  } else if (lowerMessage.includes('access') || lowerMessage.includes('door') || lowerMessage.includes('entry')) {
    fallbackContent = `**Access Control System Planning:**

Modern access control provides:
- **Card/mobile credentials**: Convenient and trackable access
- **Biometric options**: Fingerprint, facial recognition for high security
- **Integration capabilities**: Links with video, alarms, and visitor management
- **Audit trails**: Complete tracking of who accessed what, when

**For your facility planning:**
- How many doors need electronic access control?
- Do you need visitor management capabilities?
- Any areas requiring multi-factor authentication?
- Integration needs with existing HR or security systems?`;

  } else {
    fallbackContent = `I'm currently experiencing some technical difficulties with my AI processing, but I can still help you with your security discovery process.

**Let me assist you manually with:**
- Security system planning and design
- Technology recommendations
- Compliance requirement analysis
- Budget planning and phasing strategies

**What specific aspect of your security project would you like to discuss?**
- Surveillance camera systems
- Access control and entry management  
- Perimeter security solutions
- Integration with existing systems
- Compliance requirements (HIPAA, PCI, government standards)

Please let me know what's most important for your facility, and I'll provide detailed guidance.`;
  }

  return NextResponse.json({
    success: true,
    message: { content: fallbackContent },
    provider: 'fallback',
    timestamp: new Date().toISOString()
  });
}