/**
 * Document AI - AI Chat API Route (SUPABASE AUTH VERSION)
 * Migrated from Supabase Edge Function to Next.js API Route
 * Uses Supabase Auth instead of Next-Auth
 *
 * Original: Designalmostright/supabase/functions/ai-chat
 * Migrated: 2025-10-02
 * Auth: Supabase Auth (auth.users + profiles)
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

// Supabase admin client for database operations (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

interface ChatRequest {
  message: string;
  conversation_id?: string;
  company_name?: string;
  use_documents?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    // ============================================
    // AUTHENTICATION - Supabase Auth
    // ============================================
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    console.log('[Doc AI Chat] Processing request for user:', userId);

    // ============================================
    // PARSE REQUEST BODY
    // ============================================
    const body: ChatRequest = await req.json();
    const { message, conversation_id, company_name, use_documents = true } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'message is required' },
        { status: 400 }
      );
    }

    // ============================================
    // FETCH USER PROFILE
    // Changed from 'users' to 'profiles'
    // ============================================
    const { data: userProfile } = await supabaseAdmin
      .from('profiles')  // Changed from 'users'
      .select('full_name, email, company')
      .eq('id', userId)
      .single();

    const userName = userProfile?.full_name || 'User';
    const userEmail = userProfile?.email || '';
    const userCompany = company_name || userProfile?.company || '';

    // ============================================
    // GET OR CREATE CONVERSATION
    // ============================================
    let conversationId = conversation_id;

    if (!conversationId) {
      // Create new conversation
      const { data: newConversation, error: convError } = await supabaseAdmin
        .from('chat_conversations')
        .insert({
          user_id: userId,
          title: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
          company_name: userCompany,
          assessment_type: 'general'
        })
        .select()
        .single();

      if (convError || !newConversation) {
        console.error('[Doc AI Chat] Failed to create conversation:', convError);
        return NextResponse.json(
          { error: 'Failed to create conversation' },
          { status: 500 }
        );
      }

      conversationId = newConversation.id;
      console.log('[Doc AI Chat] Created new conversation:', conversationId);
    }

    // ============================================
    // BUILD DOCUMENT CONTEXT (if enabled)
    // ============================================
    let documentContext = '';

    if (use_documents) {
      // Get user's documents
      const { data: userDocs } = await supabaseAdmin
        .from('user_documents')
        .select('id, filename, extracted_text')
        .eq('user_id', userId)
        .not('extracted_text', 'is', null)
        .limit(5);

      // Get global documents
      const { data: globalDocs } = await supabaseAdmin
        .from('global_documents')
        .select('id, filename, content')
        .not('content', 'is', null)
        .limit(5);

      // Combine document text (max 10KB total)
      const allDocs = [...(userDocs || []), ...(globalDocs || [])];
      const contextParts: string[] = [];
      let totalLength = 0;
      const maxContextLength = 10000; // 10KB limit

      for (const doc of allDocs) {
        const content = doc.extracted_text || doc.content || '';
        const docText = `[Document: ${doc.filename}]\n${content}\n\n`;

        if (totalLength + docText.length > maxContextLength) {
          break;
        }

        contextParts.push(docText);
        totalLength += docText.length;
      }

      if (contextParts.length > 0) {
        documentContext = `\n\n## Relevant Documents:\n${contextParts.join('')}`;
        console.log(`[Doc AI Chat] Added ${contextParts.length} documents to context (${totalLength} chars)`);
      }
    }

    // ============================================
    // GET AI CONFIGURATION FROM ADMIN SETTINGS
    // ============================================
    const { data: adminSettings } = await supabaseAdmin
      .from('admin_settings')
      .select('global_prompt, ai_model, api_key_encrypted, temperature, max_tokens, general_assistant_id')
      .limit(1)
      .single();

    const systemPrompt = adminSettings?.global_prompt || 'You are a helpful AI assistant for security and low-voltage system design.';
    const aiModel = adminSettings?.ai_model || 'gpt-4o-mini';
    const apiKey = adminSettings?.api_key_encrypted || process.env.OPENAI_API_KEY;
    const temperature = adminSettings?.temperature || 0.7;
    const maxTokens = adminSettings?.max_tokens || 1500;
    const assistantId = adminSettings?.general_assistant_id;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // ============================================
    // SAVE USER MESSAGE
    // ============================================
    const { error: saveUserMsgError } = await supabaseAdmin
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        role: 'user',
        content: message
      });

    if (saveUserMsgError) {
      console.error('[Doc AI Chat] Failed to save user message:', saveUserMsgError);
    }

    // ============================================
    // GET CONVERSATION HISTORY
    // ============================================
    const { data: messageHistory } = await supabaseAdmin
      .from('chat_messages')
      .select('role, content')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(20); // Last 20 messages

    // ============================================
    // CALL OPENAI API
    // ============================================
    let assistantResponse = '';

    // Option 1: Use Assistants API if assistant_id provided
    if (assistantId && assistantId.startsWith('asst_')) {
      console.log('[Doc AI Chat] Using OpenAI Assistants API:', assistantId);

      // Create thread
      const threadResponse = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        }
      });

      const threadData = await threadResponse.json();
      const threadId = threadData.id;

      // Add message to thread
      await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          role: 'user',
          content: message + documentContext
        })
      });

      // Run assistant
      const runResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          assistant_id: assistantId
        })
      });

      const runData = await runResponse.json();
      const runId = runData.id;

      // Poll for completion (max 30 seconds)
      let runStatus = 'queued';
      let pollCount = 0;
      while (runStatus !== 'completed' && pollCount < 30) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const statusResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/runs/${runId}`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'OpenAI-Beta': 'assistants=v2'
          }
        });
        const statusData = await statusResponse.json();
        runStatus = statusData.status;
        pollCount++;

        if (runStatus === 'failed' || runStatus === 'cancelled' || runStatus === 'expired') {
          throw new Error(`Assistant run ${runStatus}`);
        }
      }

      // Get messages
      const messagesResponse = await fetch(`https://api.openai.com/v1/threads/${threadId}/messages`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'OpenAI-Beta': 'assistants=v2'
        }
      });
      const messagesData = await messagesResponse.json();
      const assistantMessage = messagesData.data.find((m: any) => m.role === 'assistant');
      assistantResponse = assistantMessage?.content[0]?.text?.value || 'No response from assistant';

    }
    // Option 2: Use Chat Completions API (fallback)
    else {
      console.log('[Doc AI Chat] Using OpenAI Chat Completions API');

      const messages = [
        {
          role: 'system',
          content: systemPrompt + documentContext
        },
        ...(messageHistory || []).map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      const chatResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: aiModel,
          messages,
          temperature,
          max_tokens: maxTokens
        })
      });

      if (!chatResponse.ok) {
        const errorData = await chatResponse.text();
        console.error('[Doc AI Chat] OpenAI API error:', errorData);
        throw new Error(`OpenAI API error: ${chatResponse.status}`);
      }

      const chatData = await chatResponse.json();
      assistantResponse = chatData.choices[0]?.message?.content || 'No response generated';
    }

    // ============================================
    // SAVE ASSISTANT RESPONSE
    // ============================================
    const { error: saveAssistantMsgError } = await supabaseAdmin
      .from('chat_messages')
      .insert({
        conversation_id: conversationId,
        user_id: userId,
        role: 'assistant',
        content: assistantResponse
      });

    if (saveAssistantMsgError) {
      console.error('[Doc AI Chat] Failed to save assistant message:', saveAssistantMsgError);
    }

    // ============================================
    // UPDATE TOKEN USAGE
    // ============================================
    const estimatedTokens = Math.ceil((message.length + assistantResponse.length) / 4);
    await supabaseAdmin.rpc('increment_token_usage', {
      user_id_param: userId,
      tokens: estimatedTokens
    });

    // ============================================
    // LOG ACTIVITY (using Design-Rite activity_logs)
    // ============================================
    await supabaseAdmin.from('activity_logs').insert({
      user_id: userId,
      action: 'ai_chat',
      success: true,
      details: {
        conversation_id: conversationId,
        message_length: message.length,
        response_length: assistantResponse.length,
        model: aiModel
      }
    });

    // ============================================
    // INCREMENT USAGE (using Design-Rite rate limiting)
    // ============================================
    await supabaseAdmin.rpc('increment_usage', {
      user_uuid: userId,
      feature_name: 'ai_chat',
      period_type: 'daily'
    });

    // ============================================
    // RETURN RESPONSE
    // ============================================
    return NextResponse.json({
      success: true,
      message: assistantResponse,
      conversation_id: conversationId,
      token_estimate: estimatedTokens
    });

  } catch (error) {
    console.error('[Doc AI Chat] Error:', error);

    // Log failed activity
    try {
      const supabase = createRouteHandlerClient({ cookies });
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user?.id) {
        await supabaseAdmin.from('activity_logs').insert({
          user_id: session.user.id,
          action: 'ai_chat',
          success: false,
          details: {
            errorMessage: (error as Error).message
          }
        });
      }
    } catch (logError) {
      console.error('[Doc AI Chat] Failed to log error:', logError);
    }

    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
    }
  });
}
