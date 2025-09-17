import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

    // Simple test response
    const response = `I received your message: "${message}". Let me help you with discovery. What's the company name and facility type?`;

    return NextResponse.json({
      success: true,
      message: {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    
    return NextResponse.json({
      error: 'Request processing failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Discovery Assistant API',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
}