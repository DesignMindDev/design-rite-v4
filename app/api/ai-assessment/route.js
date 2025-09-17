// app/api/enhanced-assessment/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with null check
const openai = process.env.OPENAI_API_KEY ? new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
}) : null;

// Anthropic API configuration with UPDATED MODEL
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_BASE_URL = 'https://api.anthropic.com/v1/messages';

// FIXED: Updated to current Claude model
const CLAUDE_MODEL = 'claude-3-5-sonnet-20241022';

export async function GET() {
  // Health check endpoint
  return NextResponse.json({
    status: 'healthy',
    claude_configured: !!ANTHROPIC_API_KEY,
    openai_configured: !!process.env.OPENAI_API_KEY,
    model: CLAUDE_MODEL,
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    console.log(`Processing action: ${action}`);

    switch (action) {
      case 'save_discovery':
        return await handleDiscoverySave(body.sessionData);
      
      case 'upload_file':
        return await handleFileUpload(body.fileData);
      
      case 'process_document':
        return await handleDocumentProcessing(body.fileData);
      
      case 'chat_message':
        return await handleChatMessage(body.chatMessage, body.sessionData);
      
      case 'generate_assessment':
        return await handleAssessmentGeneration(body.sessionData);
      
      default:
        return NextResponse.json({ 
          error: 'Invalid action',
          availableActions: ['save_discovery', 'upload_file', 'process_document', 'chat_message', 'generate_assessment']
        }, { status: 400 });
    }
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json({ 
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// IMPROVED: Better error handling and logging for chat messages
async function handleChatMessage(chatMessage: any, sessionData: any) {
  try {
    const { message, sessionId } = chatMessage;
    
    console.log('Processing chat message:', message.substring(0, 100) + '...');
    
    // Build context from discovery data
    const context = buildContextString(sessionData);
    console.log('Built context length:', context.length);

    // Determine which AI provider to use
    const useAnthropic = shouldUseAnthropic(message);
    console.log('Using Anthropic:', useAnthropic, 'ANTHROPIC_API_KEY available:', !!ANTHROPIC_API_KEY);

    let aiResponse;
    let provider;

    if (useAnthropic && ANTHROPIC_API_KEY) {
      try {
        console.log('Calling Anthropic API...');
        provider = 'anthropic';
        aiResponse = await callAnthropicAPI(message, context);
        console.log('Anthropic response received, length:', aiResponse.length);
      } catch (anthropicError) {
        console.error('Anthropic API error, falling back to OpenAI:', anthropicError);
        if (openai) {
          provider = 'openai';
          aiResponse = await callOpenAI(message, context);
        } else {
          throw new Error('Both Claude and OpenAI are unavailable');
        }
      }
    } else if (openai) {
      console.log('Using OpenAI as primary provider...');
      provider = 'openai';
      aiResponse = await callOpenAI(message, context);
    } else {
      throw new Error('No AI providers are configured');
    }

    console.log(`Chat response generated using ${provider}`);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      provider: provider,
      context_length: context.length
    });
  } catch (error) {
    console.error('Chat message error:', error);
    
    // IMPROVED: More helpful fallback responses
    const intelligentFallback = generateIntelligentFallback(chatMessage.message, sessionData);
    
    return NextResponse.json({
      success: true, // Keep success true to avoid error states in UI
      response: intelligentFallback,
      provider: 'fallback',
      warning: 'Using fallback response due to AI service unavailability'
    });
  }
}

// IMPROVED: Generate contextual fallback responses
function generateIntelligentFallback(message: string, sessionData: any): string {
  const lowerMessage = message.toLowerCase();
  
  // Context-aware responses based on discovery data
  if (lowerMessage.includes('budget') || lowerMessage.includes('cost')) {
    return `Based on your ${sessionData.facilityType || 'facility'} requirements, I'd recommend considering budget tiers from $25,000 for basic coverage up to $150,000+ for comprehensive enterprise solutions. Would you like me to break down what each tier typically includes?`;
  }
  
  if (lowerMessage.includes('camera') || lowerMessage.includes('surveillance')) {
    return `For your security system, we typically recommend NDAA-compliant cameras with features like 4K resolution, advanced analytics, and cloud storage integration. The number of cameras depends on your square footage and security objectives. Could you tell me more about the specific areas you want to monitor?`;
  }
  
  if (lowerMessage.includes('access control') || lowerMessage.includes('door')) {
    return `Access control is crucial for ${sessionData.facilityType || 'your facility'}. We usually implement card readers, biometric systems, or mobile credentials depending on your security requirements and budget. How many entry points need to be secured?`;
  }
  
  if (lowerMessage.includes('compliance') || lowerMessage.includes('regulation')) {
    return `Compliance requirements vary by industry and facility type. For ${sessionData.facilityType || 'your facility'}, we'll ensure all recommendations meet relevant standards including NDAA compliance for federal facilities. What specific compliance requirements do you need to meet?`;
  }
  
  if (lowerMessage.includes('timeline') || lowerMessage.includes('when') || lowerMessage.includes('schedule')) {
    return `Installation timelines typically range from 2-8 weeks depending on system complexity and site conditions. For your project, we'd need to assess the scope during our site survey. Do you have any specific deadlines or constraints we should know about?`;
  }
  
  // Generic professional response
  return `I understand you're asking about "${message}". While I'm experiencing some technical connectivity issues with our AI systems, I'd be happy to help you with your security assessment. Could you provide more specific details about your requirements, and I'll give you the most relevant guidance possible?`;
}

// FIXED: Updated Claude API call with correct model and better error handling
async function callAnthropicAPI(message: string, context: string, isAssessment: boolean = false): Promise<string> {
  if (!ANTHROPIC_API_KEY) {
    throw new Error('Anthropic API key not configured');
  }

  const systemPrompt = isAssessment 
    ? `You are a senior security consultant following the Design-Rite 7-step discovery methodology. Generate a comprehensive, professional security assessment following industry best practices. Use specific equipment models, realistic pricing, and ensure NDAA compliance.`
    : `You are the Design-Rite AI Assistant, a specialized security consultant with 20+ years of experience. You help integrators through systematic discovery to design optimal security solutions. 

Key principles:
- Follow the 7-step discovery process (WHO, WHAT, WHEN, WHERE, WHY, HOW, COMPLIANCE)
- Be specific and actionable
- Focus on NDAA-compliant solutions
- Provide realistic pricing guidance
- Consider the client's business objectives

Current conversation context: ${context}`;

  const fullPrompt = context ? `Context: ${context}\n\nUser Question: ${message}` : message;

  console.log('Making Anthropic API call with model:', CLAUDE_MODEL);

  const response = await fetch(ANTHROPIC_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL, // FIXED: Using updated model
      max_tokens: isAssessment ? 4000 : 1500,
      messages: [
        {
          role: 'user',
          content: `${systemPrompt}\n\n${fullPrompt}`
        }
      ],
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Anthropic API error:', response.status, errorText);
    throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  
  if (!data.content || !data.content[0] || !data.content[0].text) {
    throw new Error('Invalid response format from Anthropic API');
  }

  return data.content[0].text;
}

async function callOpenAI(message: string, context: string): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI client not initialized');
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: `You are the Design-Rite AI Assistant, a specialized security consultant. Follow the 7-step discovery process and provide professional guidance based on the context provided.`
      },
      {
        role: "user",
        content: `${context}\n\nUser Question: ${message}`
      }
    ],
    max_tokens: 1500,
    temperature: 0.7
  });

  return response.choices[0].message?.content || 'No response generated';
}

// Determine if a message should use Anthropic (Claude) or OpenAI
function shouldUseAnthropic(message: string): boolean {
  const anthropicKeywords = [
    'compliance', 'assessment', 'analysis', 'detailed', 'comprehensive',
    'regulation', 'standard', 'requirement', 'evaluate', 'review',
    'security', 'risk', 'audit', 'specification'
  ];
  
  return anthropicKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
}

// Build context string from session data
function buildContextString(sessionData: any): string {
  let context = `DISCOVERY SESSION CONTEXT:
- User Type: ${sessionData.userType || 'Not specified'}
- Project Driver: ${sessionData.projectDriver || 'Not specified'}
- Budget Tier: ${sessionData.budgetTier || 'Not specified'}
- Client Priorities: ${sessionData.clientPriorities?.join(', ') || 'Not specified'}
- Storage/Retention: ${sessionData.storageRetention || 'Not specified'}
- Decision Maker: ${sessionData.decisionMaker || 'Not specified'}
- Timeline: ${sessionData.timeline || 'Not specified'}
- Qualification Score: ${sessionData.qualificationScore || 'Not calculated'}/100

CONVERSATION HISTORY:
`;

  // Add recent chat messages for context
  if (sessionData.chatMessages && sessionData.chatMessages.length > 0) {
    const recentMessages = sessionData.chatMessages.slice(-6); // Last 6 messages
    recentMessages.forEach((msg: any) => {
      context += `${msg.type === 'user' ? 'User' : 'Assistant'}: ${msg.content.substring(0, 200)}...\n`;
    });
  }

  if (sessionData.uploadedFiles && sessionData.uploadedFiles.length > 0) {
    context += `\nUPLOADED DOCUMENTS:\n`;
    sessionData.uploadedFiles.forEach((doc: any, idx: number) => {
      context += `${idx + 1}. ${doc.name} (${doc.category})\n`;
      if (doc.aiAnalysis) {
        context += `   Analysis: ${JSON.stringify(doc.aiAnalysis).substring(0, 150)}...\n`;
      }
    });
  }

  return context;
}

// Simple qualification score calculator
function calculateQualificationScore(sessionData: any): number {
  let score = 0;
  
  if (sessionData.userType) score += 15;
  if (sessionData.projectDriver) score += 15;
  if (sessionData.budgetTier) score += 20;
  if (sessionData.clientPriorities?.length > 0) score += 15;
  if (sessionData.timeline) score += 10;
  if (sessionData.decisionMaker) score += 10;
  if (sessionData.uploadedFiles?.length > 0) score += 15;
  
  return Math.min(score, 100);
}

// Save discovery data (simplified for demo)
async function handleDiscoverySave(sessionData: any) {
  try {
    const sessionId = sessionData.sessionId || crypto.randomUUID();
    const qualificationScore = calculateQualificationScore(sessionData);

    console.log(`Discovery saved for session ${sessionId}, score: ${qualificationScore}`);

    return NextResponse.json({
      success: true,
      sessionId: sessionId,
      qualificationScore: qualificationScore,
      readyForDeliverable: qualificationScore >= 75
    });
  } catch (error) {
    console.error('Discovery save error:', error);
    return NextResponse.json({ 
      error: 'Failed to save discovery data',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Placeholder handlers for file operations
async function handleFileUpload(fileData: any) {
  return NextResponse.json({
    success: true,
    fileId: crypto.randomUUID(),
    message: "File uploaded successfully"
  });
}

async function handleDocumentProcessing(fileData: any) {
  return NextResponse.json({
    success: true,
    extractedText: "Document processed",
    analysis: { category: "general", confidence: 0.8 }
  });
}

async function handleAssessmentGeneration(sessionData: any) {
  return NextResponse.json({
    success: true,
    assessment: "Assessment generated",
    provider: "system"
  });
}