import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    service: 'Discovery Assistant API',
    status: 'healthy',
    claude_configured: !!process.env.ANTHROPIC_API_KEY,
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    return NextResponse.json({
      success: true,
      message: {
        role: 'assistant',
        content: 'I am working! Claude integration will be added next.'
      }
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Server error' 
    }, { status: 500 });
  }
}
