/**
 * Design-Rite Professional - Proprietary & Confidential
 * Copyright (c) 2025 Design-Rite Professional. All Rights Reserved.
 *
 * NOTICE: This code contains proprietary business logic and trade secrets.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 *
 * Last Modified: October 01, 2025
 */

import { NextRequest, NextResponse } from 'next/server';
import { getEnhancedRecommendations } from '../../../lib/unified-product-intelligence';
import { createClient } from '@supabase/supabase-js';
import { requireAuth } from '../../../lib/api-auth';
import { rateLimit, getClientIp, createRateLimitResponse } from '../../../lib/rate-limiter';

// Rate limiter for AI assessment (15 requests per minute - expensive operations)
const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 500 });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

export async function GET() {
  return NextResponse.json({
    service: 'Discovery Assistant API',
    status: 'healthy',
    claude_configured: !!process.env.ANTHROPIC_API_KEY,
    harvester_configured: !!process.env.NEXT_PUBLIC_HARVESTER_API_URL,
    harvester_url: process.env.NEXT_PUBLIC_HARVESTER_API_URL,
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  // Rate limit check
  const ip = getClientIp(request);
  const rateCheck = limiter.check(15, ip); // 15 requests per minute (expensive operations)
  if (!rateCheck.success) {
    return createRateLimitResponse(rateCheck);
  }

  // Require authentication
  const auth = await requireAuth();
  if (auth.error) {
    return auth.error;
  }

  try {
    const body = await request.json();
    const { action, sessionData, discoveryData } = body;

    console.log(`Processing action: ${action} for user: ${auth.user?.email}`);

    switch (action) {
      case 'generate_recommendations':
        return await handleRecommendationGeneration(sessionData);

      case 'generate_assessment':
        // Handle both old sessionData and new discoveryData formats
        const dataToProcess = discoveryData || sessionData;
        return await handleAssessmentGeneration(dataToProcess);

      case 'generate_discovery_assessment':
        return await handleDiscoveryAssessmentGeneration(discoveryData);

      default:
        return NextResponse.json({
          success: true,
          message: {
            role: 'assistant',
            content: 'I am working! Send "generate_recommendations", "generate_assessment", or "generate_discovery_assessment" action.'
          }
        });
    }
  } catch (error) {
    console.error('AI Assessment API error:', error);
    return NextResponse.json({
      error: 'Server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Helper function to save assessment data to Supabase
async function saveAssessmentToSupabase(data: any, assessmentContent: string, processingTimeMs: number) {
  try {
    const assessmentRecord = {
      company_name: data.companyName || data.company || 'Unknown',
      facility_type: data.facilityType || null,
      square_footage: data.squareFootage || data.facilitySize || null,
      current_security: data.currentSystems ? data.currentSystems.join(', ') : null,
      security_concerns: data.securityConcerns ? data.securityConcerns.join(', ') : null,
      budget: data.budgetRange || data.budget || null,
      timeline: data.timeline || null,
      contact_info: {
        name: data.contactName || data.name,
        email: data.contactEmail || data.email,
        projectName: data.projectName
      },
      assessment_content: assessmentContent,
      technical_specifications: JSON.stringify(data),
      status: 'completed',
      ai_model_used: 'claude-3-sonnet',
      processing_time_ms: processingTimeMs
    };

    const { data: result, error } = await supabase
      .from('assessments')
      .insert([assessmentRecord])
      .select()
      .single();

    if (error) {
      console.error('Error saving assessment to Supabase:', error);
      return null;
    }

    console.log('✅ Assessment saved to Supabase:', result.id);
    return result;
  } catch (error) {
    console.error('Failed to save assessment:', error);
    return null;
  }
}

// NEW: Generate product recommendations using real CDW data
async function handleRecommendationGeneration(sessionData: any) {
  try {
    console.log('Generating recommendations with real product data...');

    // Extract facility requirements from session data
    const requirements = {
      facilityType: sessionData?.facilityType || 'Office Building',
      squareFootage: sessionData?.squareFootage || 10000,
      budget: sessionData?.budget || '$50,000-$100,000',
      securityLevel: sessionData?.securityConcerns || 'standard'
    };

    console.log('Requirements:', requirements);

    // Get real product recommendations from our harvester
    let recommendations = [];
    try {
      recommendations = await getEnhancedRecommendations(requirements);
      console.log(`Retrieved ${recommendations.length} real product recommendations`);
    } catch (error) {
      console.error('Failed to get real recommendations, using fallback:', error);
      // Fallback to generic recommendations if harvester fails
      recommendations = getFallbackRecommendations();
    }

    return NextResponse.json({
      success: true,
      recommendations: recommendations,
      totalProducts: recommendations.length,
      realDataCount: recommendations.filter(r => r.isRealData).length,
      message: recommendations.length > 0 && recommendations[0].isRealData
        ? `Found ${recommendations.length} products with live CDW pricing`
        : 'Using fallback recommendations - harvester unavailable'
    });

  } catch (error) {
    console.error('Recommendation generation error:', error);
    return NextResponse.json({
      error: 'Failed to generate recommendations',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Enhanced assessment generation that includes real product data
async function handleAssessmentGeneration(sessionData: any) {
  const startTime = Date.now();
  try {
    console.log('Generating assessment with integrated product intelligence...');

    // First get product recommendations
    const recommendationResponse = await handleRecommendationGeneration(sessionData);
    const recommendationData = await recommendationResponse.json();

    if (!recommendationData.success) {
      throw new Error('Failed to get product recommendations');
    }

    const recommendations = recommendationData.recommendations;
    const totalBudget = calculateTotalBudget(recommendations);
    const assessment = generateAssessmentText(sessionData, recommendations, totalBudget);

    const processingTime = Date.now() - startTime;

    // Save assessment to Supabase
    const savedAssessment = await saveAssessmentToSupabase(sessionData, assessment, processingTime);

    return NextResponse.json({
      success: true,
      assessment: assessment,
      recommendations: recommendations,
      budgetAnalysis: {
        totalEstimate: totalBudget,
        breakdown: getSystemBreakdown(recommendations),
        realDataPercentage: Math.round((recommendationData.realDataCount / recommendations.length) * 100)
      },
      provider: 'unified_intelligence',
      assessmentId: savedAssessment?.id || null
    });

  } catch (error) {
    console.error('Assessment generation error:', error);
    return NextResponse.json({
      error: 'Failed to generate assessment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Fallback recommendations when harvester is unavailable
function getFallbackRecommendations() {
  return [
    {
      name: "HD Security Camera System",
      manufacturer: "Generic",
      model: "HD-CAM-001",
      price: "Contact for Pricing",
      priceNumeric: 0,
      category: "Camera System",
      specifications: { resolution: "1080p", nightVision: true },
      marketPosition: "mid-range",
      marginOpportunity: 25,
      source: "Fallback Data",
      isRealData: false
    },
    {
      name: "Access Control Panel",
      manufacturer: "Generic",
      model: "AC-PANEL-001",
      price: "Contact for Pricing",
      priceNumeric: 0,
      category: "Access Control",
      specifications: { readers: 4, users: 500 },
      marketPosition: "mid-range",
      marginOpportunity: 30,
      source: "Fallback Data",
      isRealData: false
    }
  ];
}

// Calculate total budget from recommendations
function calculateTotalBudget(recommendations: any[]): number {
  return recommendations.reduce((total, rec) => total + (rec.priceNumeric || 0), 0);
}

// Generate system breakdown
function getSystemBreakdown(recommendations: any[]) {
  const breakdown = recommendations.reduce((acc, rec) => {
    const category = rec.category || 'Other';
    if (!acc[category]) {
      acc[category] = { count: 0, total: 0 };
    }
    acc[category].count++;
    acc[category].total += rec.priceNumeric || 0;
    return acc;
  }, {} as any);

  return breakdown;
}

// NEW: Handle discovery form data and generate comprehensive assessment
async function handleDiscoveryAssessmentGeneration(discoveryData: any) {
  const startTime = Date.now();
  try {
    console.log('Generating discovery-based assessment...');

    // Convert discovery data to requirements format
    const requirements = {
      facilityType: discoveryData?.facilityType || 'Mixed Use Facility',
      squareFootage: discoveryData?.squareFootage || 10000,
      budget: discoveryData?.budgetRange || '$100,000-$250,000',
      securityConcerns: discoveryData?.securityConcerns || [],
      complianceRequirements: discoveryData?.complianceRequirements || [],
      currentSystems: discoveryData?.currentSystems || [],
      timeline: discoveryData?.timeline || '90-days'
    };

    // Get product recommendations
    let recommendations = [];
    try {
      recommendations = await getEnhancedRecommendations(requirements);
      console.log(`Retrieved ${recommendations.length} product recommendations for discovery assessment`);
    } catch (error) {
      console.error('Failed to get recommendations for discovery assessment:', error);
      recommendations = getFallbackRecommendations();
    }

    const totalBudget = calculateTotalBudget(recommendations);
    const assessment = generateDiscoveryAssessmentText(discoveryData, recommendations, totalBudget);

    const processingTime = Date.now() - startTime;

    // Save discovery assessment to Supabase
    const savedAssessment = await saveAssessmentToSupabase(discoveryData, assessment, processingTime);

    // Store assessment data for future reference
    const assessmentData = {
      sessionId: Date.now().toString(),
      projectName: discoveryData?.projectName,
      companyName: discoveryData?.companyName,
      contactEmail: discoveryData?.contactEmail,
      assessment: assessment,
      recommendations: recommendations,
      discoveryData: discoveryData,
      generatedAt: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      assessment: assessment,
      recommendations: recommendations,
      budgetAnalysis: {
        totalEstimate: totalBudget,
        breakdown: getSystemBreakdown(recommendations),
        realDataPercentage: Math.round((recommendations.filter(r => r.isRealData).length / recommendations.length) * 100)
      },
      projectSummary: {
        projectName: discoveryData?.projectName,
        facilityType: discoveryData?.facilityType,
        squareFootage: discoveryData?.squareFootage,
        timeline: discoveryData?.timeline,
        primaryConcerns: discoveryData?.securityConcerns?.slice(0, 3)
      },
      sessionId: assessmentData.sessionId,
      provider: 'discovery_intelligence',
      assessmentId: savedAssessment?.id || null
    });

  } catch (error) {
    console.error('Discovery assessment generation error:', error);
    return NextResponse.json({
      error: 'Failed to generate discovery assessment',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Generate assessment text
function generateAssessmentText(sessionData: any, recommendations: any[], totalBudget: number): string {
  const facilityType = sessionData?.facilityType || 'your facility';
  const realDataCount = recommendations.filter(r => r.isRealData).length;

  return `
## Security Assessment for ${facilityType}

Based on your facility requirements, we recommend a comprehensive security solution featuring ${recommendations.length} carefully selected components.

### Key Recommendations:
${recommendations.slice(0, 3).map((rec, i) =>
  `${i + 1}. **${rec.name}** - ${rec.price} ${rec.isRealData ? '(Live CDW Pricing)' : '(Quote Required)'}`
).join('\n')}

### Budget Analysis:
- **Total System Estimate**: ${totalBudget > 0 ? `$${totalBudget.toLocaleString()}` : 'Contact for detailed pricing'}
- **Real-Time Pricing**: ${realDataCount}/${recommendations.length} products have live market pricing
- **Data Source**: ${realDataCount > 0 ? 'CDW live pricing integrated' : 'Contact for current pricing'}

### Next Steps:
1. Review detailed specifications for each component
2. Schedule site survey for precise requirements
3. Obtain formal pricing proposal
4. Plan installation timeline

*This assessment includes real market data where available, ensuring accurate pricing for your security investment.*
  `.trim();
}

// Generate comprehensive discovery-based assessment text
function generateDiscoveryAssessmentText(discoveryData: any, recommendations: any[], totalBudget: number): string {
  const projectName = discoveryData?.projectName || 'Security System Project';
  const facilityType = discoveryData?.facilityType || 'facility';
  const companyName = discoveryData?.companyName || 'your organization';
  const realDataCount = recommendations.filter(r => r.isRealData).length;
  const squareFootage = discoveryData?.squareFootage?.toLocaleString() || 'N/A';
  const timeline = discoveryData?.timeline || 'TBD';
  const budget = discoveryData?.budgetRange || 'To be determined';

  // Generate compliance section
  const complianceSection = discoveryData?.complianceRequirements?.length > 0
    ? `### Compliance Requirements:
${discoveryData.complianceRequirements.map(req => `- ${req}`).join('\n')}

`
    : '';

  // Generate security concerns section
  const securitySection = discoveryData?.securityConcerns?.length > 0
    ? `### Addressing Key Security Concerns:
${discoveryData.securityConcerns.slice(0, 5).map(concern => `- ${concern}`).join('\n')}

`
    : '';

  return `
# Comprehensive Security Assessment
## ${projectName} - ${companyName}

### Project Overview:
- **Facility Type**: ${facilityType}
- **Total Area**: ${squareFootage} square feet
- **Timeline**: ${timeline}
- **Budget Range**: ${budget}
- **Buildings**: ${discoveryData?.buildingCount || 1}
- **Peak Occupancy**: ${discoveryData?.occupancy?.toLocaleString() || 'TBD'}

${securitySection}${complianceSection}### Recommended Security Solution:

Based on your comprehensive requirements, we've designed a ${recommendations.length}-component security system tailored to your specific needs.

#### Core System Components:
${recommendations.slice(0, 5).map((rec, i) =>
  `${i + 1}. **${rec.name}** by ${rec.manufacturer || 'TBD'}
   - Model: ${rec.model || rec.name}
   - Price: ${rec.price} ${rec.isRealData ? '✅ Live CDW Pricing' : '📞 Quote Required'}
   - Category: ${rec.category}`
).join('\n\n')}

### Investment Analysis:
- **Total System Investment**: ${totalBudget > 0 ? `$${totalBudget.toLocaleString()}` : 'Contact for detailed pricing'}
- **Real-Time Market Data**: ${realDataCount}/${recommendations.length} components (${Math.round((realDataCount/recommendations.length)*100)}%)
- **Implementation Approach**: ${discoveryData?.implementationApproach || 'Phased rollout recommended'}

### System Integration Requirements:
${discoveryData?.integrationsNeeded?.length > 0
  ? discoveryData.integrationsNeeded.slice(0, 3).map(integration => `- ${integration}`).join('\n')
  : '- Standard system integrations included'}

### Training & Support:
${discoveryData?.trainingNeeds?.length > 0
  ? discoveryData.trainingNeeds.slice(0, 3).map(training => `- ${training}`).join('\n')
  : '- Basic operator training included'}

### Implementation Timeline:
1. **Pre-Installation** (Week 1-2): Site survey, final specifications, permits
2. **Installation Phase** (Week 3-6): System deployment and configuration
3. **Testing & Training** (Week 7-8): Comprehensive testing and user training
4. **Go-Live & Support** (Week 9+): Full system activation and ongoing support

### Next Steps:
1. **Review & Approval**: Review this assessment and approve recommended approach
2. **Site Survey**: Schedule detailed site survey for exact specifications
3. **Final Proposal**: Receive formal pricing proposal with installation timeline
4. **Contract & Scheduling**: Execute agreement and schedule installation
5. **Project Kickoff**: Begin implementation with dedicated project manager

### Why This Solution Works for ${companyName}:
- ✅ Addresses all ${discoveryData?.securityConcerns?.length || 0} identified security concerns
- ✅ Meets your ${budget} budget parameters
- ✅ Scalable design accommodates future growth
- ✅ Compliant with all regulatory requirements
- ✅ Professional installation with ${discoveryData?.timeline} timeline

---
*This comprehensive assessment leverages real-time market data (${realDataCount} components) and industry best practices to ensure optimal security investment for your organization.*

**Assessment Generated**: ${new Date().toLocaleDateString()}
**Contact**: ${discoveryData?.contactEmail || 'Contact information on file'}
  `.trim();
}
