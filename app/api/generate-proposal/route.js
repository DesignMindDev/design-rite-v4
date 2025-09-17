import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    service: 'Proposal Generation API',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request) {
  try {
    const { discoveryData } = await request.json();
    
    // Simple mock response for testing
    const mockProposal = {
      document: 'Mock proposal document generated successfully',
      requirements: { cameras: 12, doors: 6, storage_days: 30 },
      bom: {
        entry: { total: 45000, items: [] },
        mid: { total: 65000, items: [] },
        premium: { total: 85000, items: [] }
      },
      summary: {
        cameras: 12,
        doors: 6,
        pricing: { entry: 45000, mid: 65000, premium: 85000 }
      }
    };

    return NextResponse.json({
      success: true,
      proposal: mockProposal
    });

  } catch (error) {
    return NextResponse.json({
      error: 'Failed to generate proposal',
      details: error.message
    }, { status: 500 });
  }
}