import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// OpenAI Assistant ID
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID || 'asst_bqlPjRKyztWpplupYhCimIzS';

export async function POST(request: Request) {
  try {
    const { message, threadId } = await request.json();

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    if (!message || !threadId) {
      return NextResponse.json(
        { error: 'Message and threadId are required' },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    console.log(`Processing message for thread ${threadId}: ${message}`);

    // Add the user message to the thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID,
    });

    console.log('Created run:', run.id);

    // Poll for completion
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);

    // Wait for the run to complete with a timeout
    const maxAttempts = 30; // 30 seconds timeout
    let attempts = 0;

    while (runStatus.status === 'queued' || runStatus.status === 'in_progress') {
      if (attempts >= maxAttempts) {
        throw new Error('Assistant response timeout');
      }

      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
      attempts++;
    }

    if (runStatus.status === 'failed') {
      console.error('Run failed:', runStatus.last_error);
      throw new Error(`Assistant run failed: ${runStatus.last_error?.message || 'Unknown error'}`);
    }

    if (runStatus.status !== 'completed') {
      throw new Error(`Unexpected run status: ${runStatus.status}`);
    }

    // Get the assistant's response
    const messages = await openai.beta.threads.messages.list(threadId, {
      order: 'desc',
      limit: 1,
    });

    const assistantMessage = messages.data[0];

    if (!assistantMessage || assistantMessage.role !== 'assistant') {
      throw new Error('No assistant response found');
    }

    // Extract the text content
    const textContent = assistantMessage.content.find(
      (content): content is any => content.type === 'text'
    );

    if (!textContent) {
      throw new Error('No text content in assistant response');
    }

    const response = textContent.text.value;

    console.log('Assistant response:', response.substring(0, 100) + '...');

    // Log conversation to Supabase
    await logChatConversation(threadId, message, response, 'openai_assistant');

    return NextResponse.json({
      response: response,
      threadId: threadId,
      runId: run.id,
      status: 'completed'
    });

  } catch (error) {
    console.error('Error in chat message API:', error);

    // Provide helpful fallback response
    const fallbackResponse = `I apologize, but I'm experiencing technical difficulties right now.

Here are some ways I can usually help you:

🔒 **Security Systems**: Questions about cameras, access control, intrusion detection
💰 **Pricing**: Information about our real-time pricing and cost estimates
📍 **Platform**: Help navigating Security Estimate, AI Discovery, and AI Assistant tools
🏢 **Company**: Information about Design-Rite and our services

Please try again in a moment, or contact support@design-rite.com if the issue persists.`;

    return NextResponse.json({
      response: fallbackResponse,
      error: error instanceof Error ? error.message : 'Unknown error',
      fallback: true
    });
  }
}

export async function GET() {
  return NextResponse.json({
    service: 'Design-Rite Chat Message Handler',
    status: 'healthy',
    openai_configured: !!process.env.OPENAI_API_KEY,
    assistant_configured: !!ASSISTANT_ID,
    assistant_id: ASSISTANT_ID,
    timestamp: new Date().toISOString()
  });
}

// Helper function to log chat conversations to Supabase
async function logChatConversation(threadId: string, userMessage: string, assistantResponse: string, provider: string) {
  try {
    const { data, error } = await supabase
      .from('chatbot_conversations')
      .insert([
        {
          thread_id: threadId,
          user_message: userMessage,
          assistant_response: assistantResponse,
          provider: provider,
          assistant_id: ASSISTANT_ID,
          created_at: new Date().toISOString()
        }
      ]);

    if (error) {
      console.error('Error logging chat conversation:', error);
    } else {
      console.log('✅ Chat conversation logged to Supabase');
    }
  } catch (error) {
    console.error('Failed to log chat conversation:', error);
  }
}