// app/api/enhanced-assessment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Anthropic configuration
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_BASE_URL = 'https://api.anthropic.com/v1/messages';

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'Enhanced Assessment API',
    timestamp: new Date().toISOString(),
    features: {
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY,
      supabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, sessionData, fileData, chatMessage } = body;

    console.log(`Processing action: ${action}`);

    switch (action) {
      case 'save_discovery':
        return handleDiscoverySave(sessionData);
      
      case 'upload_file':
        return handleFileUpload(fileData);
      
      case 'process_document':
        return handleDocumentProcessing(fileData);
      
      case 'chat_message':
        return handleChatMessage(chatMessage, sessionData);
      
      case 'generate_assessment':
        return handleAssessmentGeneration(sessionData);
      
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Enhanced Assessment API error:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        details: process.env.NODE_ENV === 'development' ? error.message : 'Server error'
      },
      { status: 500 }
    );
  }
}

// Save or update discovery data
async function handleDiscoverySave(sessionData: any) {
  try {
    const sessionId = sessionData.sessionId || crypto.randomUUID();
    const qualificationScore = calculateQualificationScore(sessionData);

    // In production, save to Supabase
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
      details: error.message 
    }, { status: 500 });
  }
}

// Handle file upload to browser storage (temporary for demo)
async function handleFileUpload(fileData: any) {
  try {
    console.log(`Processing file upload: ${fileData.fileName}`);
    
    // For now, we'll process the file content directly
    // In production, you'd save to Supabase Storage first
    return NextResponse.json({
      success: true,
      fileId: crypto.randomUUID(),
      message: "File uploaded successfully. Processing with AI..."
    });
  } catch (error) {
    console.error('File upload error:', error);
    return NextResponse.json({ 
      error: 'File upload failed',
      details: error.message 
    }, { status: 500 });
  }
}

// REAL document processing with OpenAI
async function handleDocumentProcessing(fileData: any) {
  try {
    console.log(`Processing document with AI: ${fileData.fileName || 'uploaded file'}`);
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OpenAI API key not configured');
    }

    let extractedText = '';
    let documentAnalysis = {};

    // Process different file types
    if (fileData.fileType?.includes('image') && fileData.base64Data) {
      // Use OpenAI Vision API for images/drawings
      try {
        const visionResponse = await openai.chat.completions.create({
          model: "gpt-4-vision-preview",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "You are a security consultant analyzing project documents. Extract key information about facility type, security requirements, compliance needs, budget indicators, timeline, existing infrastructure, and any specific equipment mentioned. Focus on actionable security system design information."
                },
                {
                  type: "image_url",
                  image_url: {
                    url: fileData.base64Data
                  }
                }
              ]
            }
          ],
          max_tokens: 1000
        });
        
        extractedText = visionResponse.choices[0].message.content || 'No content extracted from image';
      } catch (visionError) {
        console.error('Vision API error:', visionError);
        extractedText = 'Image analysis failed - please try uploading as PDF or text document';
      }
    } else if (fileData.fileType?.includes('text') || fileData.textContent) {
      // Process text files directly
      extractedText = fileData.textContent || fileData.fileContent || 'No text content provided';
    } else {
      extractedText = 'File type not supported for content extraction';
    }

    // Analyze extracted content with OpenAI
    if (extractedText && extractedText !== 'Image analysis failed - please try uploading as PDF or text document') {
      try {
        const analysisResponse = await openai.chat.completions.create({
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are a security consultant analyzing project documents. Extract and return structured information in JSON format:
              {
                "facilityType": "string - type of building/facility",
                "securityRequirements": ["array of security needs mentioned"],
                "complianceNeeds": ["array of compliance standards or regulations"],
                "budgetIndications": "string - any budget information found",
                "timelineRequirements": "string - project timeline or deadlines",
                "existingInfrastructure": "string - current security or network systems",
                "keyFindings": ["array of important observations"],
                "riskFactors": ["array of security risks identified"],
                "recommendations": ["array of initial security recommendations"]
              }`
            },
            {
              role: "user", 
              content: `Analyze this document content for security system design: ${extractedText.substring(0, 3000)}`
            }
          ],
          max_tokens: 1000,
          temperature: 0.3
        });

        try {
          documentAnalysis = JSON.parse(analysisResponse.choices[0].message.content || '{}');
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          documentAnalysis = { 
            rawAnalysis: analysisResponse.choices[0].message.content,
            extractionError: 'Failed to parse structured analysis'
          };
        }
      } catch (analysisError) {
        console.error('Document analysis error:', analysisError);
        documentAnalysis = { 
          error: 'AI analysis failed',
          rawText: extractedText.substring(0, 500) + '...'
        };
      }
    }

    console.log(`Document analysis completed for: ${fileData.fileName}`);

    return NextResponse.json({
      success: true,
      extractedText: extractedText.substring(0, 1000) + (extractedText.length > 1000 ? '...' : ''),
      analysis: documentAnalysis
    });
  } catch (error) {
    console.error('Document processing error:', error);
    return NextResponse.json({ 
      error: 'Document processing failed',
      details: error.message 
    }, { status: 500 });
  }
}

// REAL chat message handling with OpenAI/Anthropic
async function handleChatMessage(chatMessage: any, sessionData: any) {
  try {
    const { message, sessionId } = chatMessage;
    
    if (!process.env.OPENAI_API_KEY && !ANTHROPIC_API_KEY) {
      throw new Error('No AI API keys configured');
    }

    // Build context from discovery data and documents
    let context = buildContextString(sessionData);

    // Determine which AI provider to use
    const useAnthropic = shouldUseAnthropic(message);

    let aiResponse;
    let provider;

    if (useAnthropic && ANTHROPIC_API_KEY) {
      try {
        provider = 'anthropic';
        aiResponse = await callAnthropicAPI(message, context);
      } catch (anthropicError) {
        console.error('Anthropic API error, falling back to OpenAI:', anthropicError);
        provider = 'openai';
        aiResponse = await callOpenAI(message, context);
      }
    } else {
      provider = 'openai';
      aiResponse = await callOpenAI(message, context);
    }

    console.log(`Chat response generated using ${provider}`);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      provider: provider
    });
  } catch (error) {
    console.error('Chat message error:', error);
    return NextResponse.json({ 
      error: 'Chat processing failed',
      details: error.message 
    }, { status: 500 });
  }
}

// REAL assessment generation
async function handleAssessmentGeneration(sessionData: any) {
  try {
    if (!process.env.OPENAI_API_KEY && !ANTHROPIC_API_KEY) {
      throw new Error('No AI API keys configured');
    }

    console.log('Generating comprehensive assessment with AI...');

    // Build comprehensive context
    const context = buildContextString(sessionData);
    const assessmentPrompt = buildAssessmentPrompt(sessionData, context);

    let assessmentData;
    let provider = 'anthropic';

    // Use Anthropic Claude for comprehensive assessments (preferred)
    if (ANTHROPIC_API_KEY) {
      try {
        assessmentData = await callAnthropicAPI(assessmentPrompt, '', true);
      } catch (anthropicError) {
        console.error('Anthropic assessment error, falling back to OpenAI:', anthropicError);
        provider = 'openai';
        assessmentData = await callOpenAIAssessment(assessmentPrompt);
      }
    } else {
      provider = 'openai';
      assessmentData = await callOpenAIAssessment(assessmentPrompt);
    }

    console.log(`Assessment generated using ${provider}`);

    return NextResponse.json({
      success: true,
      assessment: assessmentData,
      sessionId: sessionData.sessionId,
      qualificationScore: sessionData.qualificationScore || 0,
      provider: provider
    });
  } catch (error) {
    console.error('Assessment generation error:', error);
    return NextResponse.json({ 
      error: 'Assessment generation failed',
      details: error.message 
    }, { status: 500 });
  }
}

// Helper functions for AI integration
function shouldUseAnthropic(message: string): boolean {
  const anthropicKeywords = [
    'compliance', 'assessment', 'analysis', 'detailed', 'comprehensive',
    'regulation', 'standard', 'requirement', 'evaluate', 'review'
  ];
  
  return anthropicKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
}

function buildContextString(sessionData: any): string {
  let context = `DISCOVERY INFORMATION:
- User Type: ${sessionData.userType}
- Project Driver: ${sessionData.projectDriver || 'Not specified'}
- Budget Tier: ${sessionData.budgetTier || 'Not specified'}
- Client Priorities: ${sessionData.clientPriorities?.join(', ') || 'Not specified'}
- Storage/Retention: ${sessionData.storageRetention || 'Not specified'}
- Decision Maker: ${sessionData.decisionMaker || 'Not specified'}
- Timeline: ${sessionData.timeline || 'Not specified'}
- Qualification Score: ${sessionData.qualificationScore || 'Not calculated'}/100
`;

  if (sessionData.uploadedFiles && sessionData.uploadedFiles.length > 0) {
    context += `\nUPLOADED DOCUMENTS:\n`;
    sessionData.uploadedFiles.forEach((doc: any, idx: number) => {
      context += `${idx + 1}. ${doc.name} (${doc.category})\n`;
      if (doc.aiAnalysis) {
        context += `   Analysis: ${JSON.stringify(doc.aiAnalysis).substring(0, 200)}...\n`;
      }
    });
  }

  return context;
}

async function callAnthropicAPI(message: string, context: string, isAssessment: boolean = false): Promise<string> {
  const systemPrompt = isAssessment 
    ? `You are a senior security consultant following the Design-Rite 7-step discovery methodology. Generate a comprehensive, professional security assessment following industry best practices. Use specific equipment models, realistic pricing, and ensure NDAA compliance.`
    : `You are the Design-Rite AI Assistant, a specialized security consultant with 20+ years of experience. Follow the 7-step discovery process and provide professional guidance based on the context provided. Be specific, actionable, and focus on compliance and best practices.`;

  const fullPrompt = context ? `${context}\n\nUser: ${message}` : message;

  const response = await fetch(ANTHROPIC_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-3-sonnet-20240229',
      max_tokens: isAssessment ? 4000 : 1500,
      messages: [
        {
          role: 'user',
          content: `${systemPrompt}\n\n${fullPrompt}`
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.content[0].text;
}

async function callOpenAI(message: string, context: string): Promise<string> {
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

  return response.choices[0].message.content || 'No response generated';
}

async function callOpenAIAssessment(prompt: string): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content: "You are a world-class security consultant generating comprehensive assessments with detailed BOMs and compliance analysis. Ensure NDAA compliance and use specific equipment models with realistic pricing."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 4000,
    temperature: 0.3
  });

  return response.choices[0].message.content || 'Assessment generation failed';
}

function buildAssessmentPrompt(sessionData: any, context: string): string {
  return `Generate a comprehensive security assessment following the Design-Rite methodology:

${context}

UPLOADED DOCUMENTS: ${sessionData.uploadedFiles?.length || 0} files analyzed

Generate a professional assessment with:

1. EXECUTIVE SUMMARY (2-3 paragraphs)
2. CURRENT SECURITY ANALYSIS 
   - Strengths, vulnerabilities, risk level
3. RECOMMENDED SOLUTIONS
   - Video surveillance system design
   - Access control recommendations  
   - Compliance features required
4. DETAILED BILL OF MATERIALS
   - Entry tier ($X,XXX - $X,XXX)
   - Mid-tier ($X,XXX - $X,XXX)  
   - Premium tier ($X,XXX - $X,XXX)
   - Use specific NDAA-compliant equipment models
5. COMPLIANCE REQUIREMENTS
   - Based on facility type and uploaded documents
6. IMPLEMENTATION ROADMAP
   - Phase 1, 2, 3 with timelines
7. INVESTMENT SUMMARY
   - ROI projections and cost breakdown
8. NEXT STEPS
   - Client presentation recommendations

Ensure all equipment is NDAA Section 889 compliant. Use realistic 2024 pricing and specific model numbers from approved vendors (Axis, Hanwha, Avigilon, etc.).`;

// Helper function to calculate qualification score
function calculateQualificationScore(sessionData: any): number {
  let score = 0;
  
  // Project driver (20 points)
  if (sessionData.projectDriver) score += 20;
  
  // Client priorities (15 points)
  if (sessionData.clientPriorities?.length > 0) score += 15;
  
  // Budget tier (20 points)
  if (sessionData.budgetTier) score += 20;
  
  // Storage retention (10 points)
  if (sessionData.storageRetention) score += 10;
  
  // Decision maker (15 points)
  if (sessionData.decisionMaker) score += 15;
  
  // Timeline (5 points)
  if (sessionData.timeline) score += 5;
  
  // User type bonus (5 points for professional/enterprise)
  if (sessionData.userType === 'professional' || sessionData.userType === 'enterprise') score += 5;
  
  // Site mapping (10 points)
  if (sessionData.siteMapping && Object.keys(sessionData.siteMapping).length > 0) score += 10;
  
  return Math.min(score, 100);
}}
