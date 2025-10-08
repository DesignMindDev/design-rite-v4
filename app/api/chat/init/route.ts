// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// OpenAI Assistant ID
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || 'asst_bqlPjRKyztWpplupYhCimIzS';

export async function POST() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Create a new thread for this conversation
    const thread = await openai.beta.threads.create();

    console.log('Created new thread:', thread.id);

    return NextResponse.json({
      threadId: thread.id,
      assistantId: ASSISTANT_ID,
      status: 'initialized'
    });

  } catch (error) {
    console.error('Error initializing chat thread:', error);
    return NextResponse.json(
      {
        error: 'Failed to initialize chat thread',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Design-Rite Chat Initialization',
    status: 'healthy',
    openai_configured: !!process.env.OPENAI_API_KEY,
    assistant_configured: !!ASSISTANT_ID,
    assistant_id: ASSISTANT_ID,
    timestamp: new Date().toISOString()
  });
}