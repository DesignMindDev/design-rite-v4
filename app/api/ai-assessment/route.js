// app/api/ai-assessment/route.js
import { NextResponse } from 'next/server';

// Multi-AI Provider Configuration
const AI_PROVIDERS = {
  claude: {
    endpoint: 'https://api.anthropic.com/v1/messages',
    model: 'claude-3-sonnet-20240229',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    }
  },
  openai: {
    endpoint: 'https://api.openai.com/v1/chat/completions',
    model: 'gpt-4',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    }
  }
};

// AI Provider Selection Logic
const selectBestProvider = (taskType, userTier = 'professional') => {
  const strategies = {
    'security-analysis': {
      primary: 'claude',
      fallback: 'openai',
      reasoning: 'Claude excels at detailed security assessments and compliance analysis'
    },
    'proposal-generation': {
      primary: 'openai',
      fallback: 'claude',
      reasoning: 'GPT-4 creates more engaging proposals and technical documentation'
    },
    'compliance-check': {
      primary: 'claude',
      fallback: 'openai',
      reasoning: 'Claude is more conservative and accurate for regulatory compliance'
    },
    'real-time-insights': {
      primary: 'claude',
      fallback: 'openai',
      reasoning: 'Claude provides more thoughtful, contextual insights'
    }
  };

  return strategies[taskType] || { primary: 'claude', fallback: 'openai' };
};

// Security Assessment Prompt Generator
const createSecurityAssessmentPrompt = (sessionData) => {
  return `You are a senior security consultant with 20+ years of experience designing enterprise security systems. Analyze this facility and provide professional recommendations.

FACILITY DETAILS:
- Type: ${sessionData.facilityType || 'Not specified'}
- Size: ${sessionData.squareFootage || 'Not specified'} sq ft
- Budget Range: ${sessionData.budget ? `$${parseInt(sessionData.budget).toLocaleString()}` : 'Not specified'}
- Primary Concerns: ${sessionData.securityConcerns?.join(', ') || 'Not specified'}
- Compliance Requirements: ${sessionData.compliance?.join(', ') || 'None specified'}
- Timeline: ${sessionData.timeline || 'Not specified'}

ANALYSIS REQUIRED:
Provide a comprehensive security assessment with the following structure:

1. RISK ASSESSMENT (High/Medium/Low with specific threats)
2. SECURITY SOLUTION SUMMARY (specific camera counts, access control doors, etc.)
3. COMPLIANCE REQUIREMENTS (based on facility type and specified requirements)
4. IMPLEMENTATION STRATEGY (phases if budget-constrained)
5. KEY RECOMMENDATIONS (3-5 actionable items)
6. ESTIMATED INVESTMENT (based on budget and requirements)

Focus on:
- NDAA-compliant equipment only (Axis, Hanwha, Avigilon for cameras; Genetec, Milestone for VMS)
- Realistic 2024 pricing and specifications
- Industry best practices for the facility type
- ROI justification and risk mitigation

Provide response in clear, professional language suitable for facility managers and security directors.`;
};

// Real-time Insight Generator
const generateRealTimeInsight = (userInput, context, sessionData) => {
  const insights = {
    facilityType: {
      'healthcare': {
        insight: "Healthcare facilities require HIPAA compliance with strict access controls and patient privacy protection.",
        recommendation: "Implement biometric access control, visitor management system, and zone-based monitoring with audit trails.",
        priority: "High"
      },
      'retail': {
        insight: "Retail environments need loss prevention balanced with customer experience and traffic flow.",
        recommendation: "Deploy AI-powered theft detection, customer analytics, and POS integration for comprehensive coverage.",
        priority: "High"
      },
      'office': {
        insight: "Corporate offices need employee safety and asset protection with visitor management.",
        recommendation: "Focus on access control, visitor screening, and perimeter monitoring with emergency response integration.",
        priority: "Medium"
      },
      'warehouse': {
        insight: "Warehouses require perimeter security, cargo protection, and inventory monitoring.",
        recommendation: "Install truck dock monitoring, inventory tracking integration, and wide-area surveillance coverage.",
        priority: "High"
      },
      'education': {
        insight: "Educational institutions need comprehensive safety with emergency response and visitor screening.",
        recommendation: "Implement multi-zone lockdown capabilities, visitor management, and campus-wide communication systems.",
        priority: "Critical"
      },
      'manufacturing': {
        insight: "Manufacturing facilities need industrial-grade security integrated with safety systems.",
        recommendation: "Deploy explosion-proof cameras, safety system integration, and specialized monitoring for hazardous areas.",
        priority: "Critical"
      }
    },
    budget: {
      low: {
        insight: "Budget-conscious approach requires strategic prioritization of critical security areas.",
        recommendation: "Phase 1: Secure main entrances and high-value areas. Phase 2: Expand coverage as budget allows.",
        priority: "High"
      },
      medium: {
        insight: "Your budget allows for comprehensive coverage with advanced features and integration.",
        recommendation: "Include AI analytics, integrated access control, and professional monitoring capabilities.",
        priority: "Medium"
      },
      high: {
        insight: "Premium budget enables enterprise-grade solutions with redundancy and advanced analytics.",
        recommendation: "Deploy full integration with business systems, advanced AI, and comprehensive backup systems.",
        priority: "Low"
      }
    },
    compliance: {
      'HIPAA': {
        insight: "HIPAA compliance requires strict access controls and comprehensive audit trails.",
        recommendation: "Implement biometric access, encrypted storage, and detailed logging of all system access.",
        priority: "Critical"
      },
      'CJIS': {
        insight: "CJIS compliance demands background-checked personnel and secure system access.",
        recommendation: "Ensure all system administrators have proper clearance and implement multi-factor authentication.",
        priority: "Critical"
      },
      'PCI DSS': {
        insight: "PCI compliance requires secure payment processing areas and restricted access.",
        recommendation: "Isolate payment processing zones with dedicated access control and monitoring.",
        priority: "High"
      }
    }
  };

  // Determine insight category and value
  let category, value;
  
  if (context === 'facilityType') {
    category = 'facilityType';
    value = userInput;
  } else if (context === 'budget') {
    const budgetNum = parseInt(userInput);
    category = 'budget';
    value = budgetNum <= 50000 ? 'low' : budgetNum <= 150000 ? 'medium' : 'high';
  } else if (context === 'compliance' && Array.isArray(userInput)) {
    category = 'compliance';
    value = userInput[0]; // Get first compliance requirement for insight
  }

  return insights[category]?.[value] || null;
};

// Call AI Provider
const callAIProvider = async (provider, prompt) => {
  const config = AI_PROVIDERS[provider];
  if (!config) throw new Error(`Provider ${provider} not configured`);

  try {
    let body;
    
    if (provider === 'claude') {
      body = JSON.stringify({
        model: config.model,
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      });
    } else if (provider === 'openai') {
      body = JSON.stringify({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 2000,
        temperature: 0.7
      });
    }

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: config.headers,
      body: body
    });

    if (!response.ok) {
      throw new Error(`${provider} API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (provider === 'claude') {
      return data.content[0].text;
    } else if (provider === 'openai') {
      return data.choices[0].message.content;
    }
  } catch (error) {
    console.error(`Error calling ${provider}:`, error);
    throw error;
  }
};

// Generate Assessment
const generateAssessment = async (sessionData, taskType = 'security-analysis') => {
  const provider = selectBestProvider(taskType);
  const prompt = createSecurityAssessmentPrompt(sessionData);
  
  try {
    // Try primary provider
    const result = await callAIProvider(provider.primary, prompt);
    return {
      content: result,
      provider: provider.primary,
      reasoning: provider.reasoning
    };
  } catch (error) {
    console.warn(`Primary provider (${provider.primary}) failed, trying fallback`);
    try {
      // Fallback to secondary provider
      const result = await callAIProvider(provider.fallback, prompt);
      return {
        content: result,
        provider: provider.fallback,
        reasoning: `Fallback: ${provider.reasoning}`
      };
    } catch (fallbackError) {
      console.error('Both providers failed:', error, fallbackError);
      throw new Error('AI assessment service temporarily unavailable');
    }
  }
};

// Main API Handler
export async function POST(request) {
  try {
    const { sessionData, requestType = 'full-assessment', context } = await request.json();

    // Validate input
    if (!sessionData) {
      return NextResponse.json(
        { error: 'Session data is required' },
        { status: 400 }
      );
    }

    // Handle different request types
    if (requestType === 'real-time-insight') {
      const insight = generateRealTimeInsight(sessionData.value, context, sessionData);
      
      return NextResponse.json({
        success: true,
        insight: insight,
        timestamp: new Date().toISOString(),
        requestType: 'real-time-insight'
      });
    }

    if (requestType === 'full-assessment') {
      // Generate comprehensive AI assessment
      const assessment = await generateAssessment(sessionData);
      
      // Generate additional insights for all provided data
      const insights = [];
      
      if (sessionData.facilityType) {
        const facilityInsight = generateRealTimeInsight(sessionData.facilityType, 'facilityType', sessionData);
        if (facilityInsight) insights.push({ ...facilityInsight, context: 'facilityType' });
      }
      
      if (sessionData.budget) {
        const budgetInsight = generateRealTimeInsight(sessionData.budget, 'budget', sessionData);
        if (budgetInsight) insights.push({ ...budgetInsight, context: 'budget' });
      }
      
      if (sessionData.compliance && sessionData.compliance.length > 0) {
        const complianceInsight = generateRealTimeInsight(sessionData.compliance, 'compliance', sessionData);
        if (complianceInsight) insights.push({ ...complianceInsight, context: 'compliance' });
      }

      return NextResponse.json({
        success: true,
        assessment: {
          content: assessment.content,
          provider: assessment.provider,
          reasoning: assessment.reasoning,
          generated_at: new Date().toISOString(),
          session_summary: {
            facility_type: sessionData.facilityType,
            square_footage: sessionData.squareFootage,
            budget_range: sessionData.budget,
            security_concerns: sessionData.securityConcerns,
            compliance_requirements: sessionData.compliance,
            timeline: sessionData.timeline
          }
        },
        insights: insights,
        requestType: 'full-assessment'
      });
    }

    return NextResponse.json(
      { error: 'Invalid request type' },
      { status: 400 }
    );

  } catch (error) {
    console.error('AI Assessment API Error:', error);
    
    return NextResponse.json(
      { 
        error: 'Assessment generation failed', 
        message: error.message,
        fallback: {
          content: "We're experiencing high demand for AI assessments. Please try again in a few moments, or contact our team directly for immediate assistance.",
          provider: 'fallback',
          timestamp: new Date().toISOString()
        }
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    service: 'AI Security Assessment API',
    version: '1.0.0',
    providers: Object.keys(AI_PROVIDERS),
    timestamp: new Date().toISOString()
  });
}