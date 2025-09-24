import { NextResponse } from 'next/server';
import { getEnhancedRecommendations } from '../../../lib/unified-product-intelligence';

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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, sessionData } = body;

    console.log(`Processing action: ${action}`);

    switch (action) {
      case 'generate_recommendations':
        return await handleRecommendationGeneration(sessionData);

      case 'generate_assessment':
        return await handleAssessmentGeneration(sessionData);

      default:
        return NextResponse.json({
          success: true,
          message: {
            role: 'assistant',
            content: 'I am working! Send "generate_recommendations" or "generate_assessment" action with sessionData.'
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

    return NextResponse.json({
      success: true,
      assessment: assessment,
      recommendations: recommendations,
      budgetAnalysis: {
        totalEstimate: totalBudget,
        breakdown: getSystemBreakdown(recommendations),
        realDataPercentage: Math.round((recommendationData.realDataCount / recommendations.length) * 100)
      },
      provider: 'unified_intelligence'
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
