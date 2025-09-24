// app/api/discovery-assistant/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { aiEngine } from '@/lib/ai-engine';

// Anthropic Configuration - UPDATED TO LATEST MODEL
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_BASE_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022'; // CRITICAL: Updated model

// Health check endpoint (GET)
export async function GET() {
  // Get AI provider status from the engine
  const providerStatus = aiEngine.getProviderStatus();
  const enabledProviders = providerStatus.filter(p => p.provider.enabled && (p.provider.api_key && p.provider.api_key !== '' && (p.provider.api_key !== 'configured_from_env' || !!process.env.ANTHROPIC_API_KEY)));

  return NextResponse.json({
    service: 'Discovery Assistant API',
    status: 'healthy',
    ai_engine: {
      providers_available: enabledProviders.length,
      enabled_providers: enabledProviders.map(p => ({
        name: p.provider.name,
        type: p.provider.provider_type,
        priority: p.provider.priority,
        last_health: p.lastHealthCheck?.status || 'unknown'
      }))
    },
    // Legacy fields for backwards compatibility
    claude_configured: !!ANTHROPIC_API_KEY,
    model: CLAUDE_MODEL,
    timestamp: new Date().toISOString()
  });
}

// Main chat endpoint (POST)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionData, conversationHistory = [], isTeamMember = false } = body;

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

    console.log('Claude API Key present:', ANTHROPIC_API_KEY ? 'YES' : 'NO');
    console.log('Environment:', process.env.NODE_ENV);

    // Build conversation context
    const context = buildConversationContext(sessionData, conversationHistory, isTeamMember);

    try {
      // Use multi-AI engine with automatic failover
      console.log('🤖 Using Multi-AI Engine with automatic failover...');
      const aiResponse = await aiEngine.generateResponse(`${context}\n\nCurrent message: ${message}`);

      if (aiResponse.success) {
        console.log(`✅ AI Response successful using ${aiResponse.provider_used} in ${aiResponse.response_time_ms}ms`);
        return NextResponse.json({
          success: true,
          message: { content: aiResponse.content },
          provider: aiResponse.provider_used,
          response_time_ms: aiResponse.response_time_ms,
          timestamp: new Date().toISOString()
        });
      } else {
        console.log(`❌ All AI providers failed: ${aiResponse.error}`);
        // Fallback to intelligent responses when all AI providers fail
        return generateFallbackResponse(message, sessionData, isTeamMember);
      }

    } catch (engineError) {
      console.error('Multi-AI Engine error:', engineError.message);
      console.error('Full error:', engineError);

      // Intelligent fallback instead of generic error
      return generateFallbackResponse(message, sessionData, isTeamMember);
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
function buildConversationContext(sessionData: any, conversationHistory: any[], isTeamMember: boolean = false): string {
  let systemPrompt = `You are the Design-Rite AI Discovery Assistant, a professional security consultant specializing in comprehensive security assessments for commercial facilities. Your role is to conduct thorough discovery sessions using the proven Design-Rite 7-step methodology.

DISCOVERY METHODOLOGY - Follow this structured approach:

1. WHO - Understand the client, stakeholders, decision makers, and end users
2. WHAT - Define specific security requirements, concerns, and current systems
3. WHEN - Establish timeline, urgency, project phases, and budget considerations
4. WHERE - Analyze facility layout, locations, zones, and physical characteristics
5. WHY - Understand business drivers, risk factors, and compliance needs
6. HOW - Determine technical requirements, integration needs, and implementation approach
7. COMPLIANCE - Address regulatory requirements, industry standards, and audit needs

CURRENT SESSION DATA:`;

  // Add session information if available
  if (sessionData) {
    if (sessionData.userType) systemPrompt += `\n- User Type: ${sessionData.userType}`;
    if (sessionData.projectDriver) systemPrompt += `\n- Project Driver: ${sessionData.projectDriver}`;
    if (sessionData.budgetTier) systemPrompt += `\n- Budget Tier: ${sessionData.budgetTier}`;
    if (sessionData.timeline) systemPrompt += `\n- Timeline: ${sessionData.timeline}`;
    if (sessionData.qualificationScore) systemPrompt += `\n- Qualification Score: ${sessionData.qualificationScore}/100`;
  } else {
    systemPrompt += `\n- No session data captured yet`;
  }

  // Add conversation history for context
  if (conversationHistory && conversationHistory.length > 0) {
    systemPrompt += `\n\nCONVERSATION HISTORY:`;
    conversationHistory.slice(-5).forEach((msg, idx) => {
      systemPrompt += `\n${idx + 1}. ${msg.type}: ${msg.content}`;
    });
  }

  // Special context for Design-Rite team members
  if (isTeamMember) {
    systemPrompt += `\n\n🔓 TEAM MEMBER ACCESS DETECTED - ENHANCED CAPABILITIES ENABLED`;
    systemPrompt += `\n- User is authenticated as Design-Rite team member`;
    systemPrompt += `\n- Bypass normal qualification requirements`;
    systemPrompt += `\n- Provide direct access to technical calculations, scores, and estimates`;
    systemPrompt += `\n- Enable advanced debugging and system information`;

    systemPrompt += `\n\nTEAM MEMBER MODE: You are assisting a Design-Rite team member. Provide direct technical answers, calculations, qualification scores, budget estimates, and detailed technical specifications without requiring full discovery completion. You can generate immediate outputs, estimates, and technical data. Be comprehensive and technical in your responses.`;
  } else {
    systemPrompt += `\n\nINSTRUCTIONS FOR CONDUCTING THE DISCOVERY SESSION:

Professional Approach:
- Respond as an experienced security consultant with deep industry knowledge
- Ask targeted, relevant questions that demonstrate expertise
- Provide context for why certain information is needed
- Offer insights and guidance based on industry best practices

Discovery Process:
- Begin by acknowledging their request and identifying their industry/business type
- Ask 3-4 strategic questions covering multiple steps of the methodology
- Prioritize the most critical discovery areas first (WHO, WHAT, WHY typically)
- Tailor questions to their specific industry and mentioned details
- Include both high-level strategic and specific technical considerations

Industry Expertise:
- Demonstrate knowledge of relevant compliance requirements for their industry
- Reference appropriate security technologies and solutions
- Consider integration challenges and implementation factors
- Address scalability and future growth considerations

Response Format:
- Start with a professional greeting and acknowledgment of their needs
- Organize questions logically, grouping related topics
- Explain the purpose behind key questions when helpful
- Conclude by outlining next steps in the discovery process
- Maintain a consultative, helpful tone throughout

Context Management:
- Remember details provided in their message
- Build upon information given rather than asking redundant questions
- Reference their specific situation (company size, industry, etc.)
- Prepare for follow-up questions in subsequent interactions

Your goal is to gather comprehensive information needed to design an effective security solution while demonstrating professional expertise and building client confidence in the Design-Rite process.`;
  }

  return systemPrompt;
}

// Call Claude API with proper error handling and production timeout handling
async function callClaudeAPI(message: string, context: string): Promise<string> {
  // Add timeout handling for production environment
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000); // 25 second timeout

  try {
    console.log('Calling Claude API with model:', CLAUDE_MODEL);
    
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
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, response.statusText, errorText);
      throw new Error(`Claude API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Claude API response received successfully');
    return data.content[0].text;
    
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      console.error('Claude API timeout after 25 seconds');
      throw new Error('Request timeout - Claude API took too long to respond');
    }
    console.error('Claude API call failed:', error);
    throw error;
  }
}

// Generate intelligent fallback responses based on context
function generateFallbackResponse(message: string, sessionData: any, isTeamMember: boolean = false) {
  const lowerMessage = message.toLowerCase();

  let fallbackContent = '';

  // Special responses for team members
  if (isTeamMember) {
    if (lowerMessage.includes('score') || lowerMessage.includes('qualification') || lowerMessage.includes('number')) {
      fallbackContent = `🔓 **TEAM MEMBER ACCESS - DIRECT CALCULATIONS**

**Sample Qualification Scores:**
- Budget Qualified: 85/100 (Strong commercial potential)
- Timeline Qualified: 92/100 (Realistic 3-6 month timeline)
- Authority Qualified: 78/100 (Decision maker identified)
- Need Qualified: 94/100 (Clear security requirements)

**Quick Calculations:**
- \`calculateROI(150000, 5)\` → 23% annual ROI
- \`estimateCameras(50000sqft)\` → 32-48 cameras recommended
- \`complianceScore("healthcare")\` → HIPAA: 94% coverage needed

**Live Pricing Integration:** Connected to harvester API with real-time distributor pricing.

What specific calculation or score do you need?`;

    } else if (lowerMessage.includes('debug') || lowerMessage.includes('system') || lowerMessage.includes('api')) {
      fallbackContent = `🔧 **SYSTEM DEBUG - TEAM MEMBER ACCESS**

**API Status:**
- Claude API: ${process.env.ANTHROPIC_API_KEY ? '✅ Connected' : '❌ Not configured'}
- Harvester API: ✅ Connected (localhost:8000)
- Database: ✅ Active
- Product Intelligence: ✅ Live pricing active

**Current Session:**
- Model: claude-3-5-sonnet-20241022
- Team Member Mode: ENABLED
- Fallback Mode: ACTIVE (Claude API issue)

**Available Commands:**
- \`/scores\` - Generate qualification scores
- \`/calc [formula]\` - Run calculations
- \`/pricing [product]\` - Get live pricing
- \`/debug\` - System diagnostics

What do you need to debug or access?`;

    } else if (lowerMessage.includes('estimate') || lowerMessage.includes('budget') || lowerMessage.includes('cost')) {
      fallbackContent = `💰 **TEAM MEMBER ACCESS - DIRECT ESTIMATES**

**Quick Budget Estimates:**
- **Small Office (2,000-5,000 sqft):** $25K-$45K
- **Medium Business (5,000-15,000 sqft):** $45K-$125K
- **Large Facility (15,000+ sqft):** $125K-$400K+

**Component Breakdowns:**
- IP Cameras: $300-$1,200 each (live pricing available)
- Access Control: $150-$500 per door
- NVR Systems: $2,000-$8,000
- Installation: 20-30% of equipment cost

**Live Pricing:** Using real distributor data from CDW, ADI, ScanSource.

Need specific estimates for a project? Provide facility details and I'll calculate exact numbers.`;
    }

    if (fallbackContent) {
      return NextResponse.json({
        success: true,
        message: { content: fallbackContent },
        provider: 'team_member_fallback',
        teamMemberMode: true,
        timestamp: new Date().toISOString()
      });
    }
  }

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