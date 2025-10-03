/**
 * Document AI Chat API Route
 * Migrated from Supabase Edge Function to Next.js API Route
 * Handles AI conversations with document context and OpenAI integration
 * Auth: Supabase Auth (migrated from Next-Auth 2025-10-02)
 * Original: Designalmostright/supabase/functions/ai-chat
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { incrementUsage, logActivity } from '@/lib/permissions';

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

interface DocAIChatRequest {
  message: string;
  conversationHistory?: Array<{ role: string; content: string }>;
  conversationId?: string;
  structuredData?: {
    siteImages?: string[];
    [key: string]: any;
  };
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

    // ============================================
    // PARSE REQUEST BODY
    // ============================================
    const body: DocAIChatRequest = await req.json();
    const { message, conversationHistory = [], conversationId, structuredData } = body;

    if (!message || message.trim() === '') {
      return NextResponse.json(
        { error: 'Message is required.' },
        { status: 400 }
      );
    }

    console.log('[Doc AI Chat] Processing request for user:', userId);

    // ============================================
    // FETCH ADMIN SETTINGS (API Key + Config)
    // ============================================
    const { data: adminSettings, error: adminError } = await supabaseAdmin
      .from('admin_settings')
      .select('global_prompt, general_assistant_id, ai_model, api_key_encrypted, temperature, max_tokens, max_completion_tokens')
      .limit(1)
      .single();

    if (adminError) {
      console.error('[Doc AI Chat] Error fetching admin settings:', adminError);
    }

    // Get API key from admin settings or environment variable
    const OPENAI_API_KEY = adminSettings?.api_key_encrypted || process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        {
          error: 'OpenAI API key not configured',
          response: "I'm currently unavailable. Please contact your administrator to configure the OpenAI API key."
        },
        { status: 503 }
      );
    }

    const ASSISTANT_ID = adminSettings?.general_assistant_id;
    console.log('[Doc AI Chat] Using API key from:', adminSettings?.api_key_encrypted ? 'admin settings' : 'environment');
    console.log('[Doc AI Chat] Assistant ID configured:', ASSISTANT_ID ? 'Yes' : 'No');

    // ============================================
    // FETCH USER DOCUMENTS
    // ============================================
    const { data: userDocs, error: userDocsError } = await supabaseAdmin
      .from('user_documents')
      .select('filename, file_path, mime_type, extracted_text')
      .eq('user_id', userId);

    if (userDocsError) {
      console.error('[Doc AI Chat] Error fetching user documents:', userDocsError);
    }

    // ============================================
    // FETCH GLOBAL DOCUMENTS
    // ============================================
    const { data: globalDocs, error: globalDocsError } = await supabase
      .from('global_documents')
      .select('filename, file_path, mime_type, extracted_text');

    if (globalDocsError) {
      console.error('[Doc AI Chat] Error fetching global documents:', globalDocsError);
    }

    // ============================================
    // FETCH USER PROFILE (profiles table)
    // Uses Supabase 'profiles' table for user data
    // ============================================
    const { data: user, error: userError} = await supabase
      .from('profiles')
      .select('full_name, email, company')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('[Doc AI Chat] Error fetching user:', userError);
    }

    // ============================================
    // BUILD DOCUMENT CONTEXT
    // ============================================
    let documentsContext = '';

    // Global documents: always include full text
    if (globalDocs && globalDocs.length > 0) {
      documentsContext += '\n\nCompany Documents Available:\n';
      for (const doc of globalDocs) {
        documentsContext += `- ${doc.filename} (${doc.mime_type})\n`;
        if (
          doc.extracted_text &&
          !doc.extracted_text.includes('endstream') &&
          !doc.extracted_text.includes('xref')
        ) {
          documentsContext += `  Content: ${doc.extracted_text}\n`;
        }
      }
    }

    // User documents: conditionally include based on keyword matching
    if (userDocs && userDocs.length > 0) {
      documentsContext += '\n\nUser Documents Available:\n';
      const messageKeywords = message
        .toLowerCase()
        .split(/\s+/)
        .filter((kw) => kw.length > 3 && kw !== 'pdf');

      for (const doc of userDocs) {
        const docTitle = doc.filename.toLowerCase().replace(/\.pdf$/, '');
        const titleKeywords = docTitle.split(/[^a-z0-9]+/).filter((kw) => kw.length > 3);
        const hasMatch = messageKeywords.some((kw) => titleKeywords.includes(kw));

        documentsContext += `- ${doc.filename} (${doc.mime_type})\n`;
        if (
          doc.extracted_text &&
          !doc.extracted_text.includes('endstream') &&
          !doc.extracted_text.includes('xref')
        ) {
          if (hasMatch) {
            const truncatedContent =
              doc.extracted_text.length > 90000
                ? doc.extracted_text.substring(0, 90000) + '...'
                : doc.extracted_text;
            documentsContext += `  Content: ${truncatedContent}\n`;
          }
        }
      }
    }

    // ============================================
    // BUILD USER CONTEXT
    // ============================================
    let userContext = '';
    if (user) {
      userContext = `\n\nUser Information:\nName: ${user.full_name}\nEmail: ${user.email}\nCompany: ${user.company || 'Not specified'}`;
    }

    // ============================================
    // BUILD CONVERSATION HISTORY CONTEXT
    // ============================================
    let historyContext = '';
    if (conversationHistory && conversationHistory.length > 0) {
      historyContext = '\n\nConversation History:\n';
      conversationHistory.slice(-10).forEach((msg) => {
        historyContext += `${msg.role}: ${msg.content}\n`;
      });
    }

    // ============================================
    // PREPARE USER CONTENT (Handle Images)
    // ============================================
    let userContent: any = message;
    if (structuredData?.siteImages && structuredData.siteImages.length > 0) {
      userContent = [
        {
          type: 'text',
          text: message
        },
        ...structuredData.siteImages.map((imageData) => ({
          type: 'image_url',
          image_url: {
            url: imageData
          }
        }))
      ];
    }

    // ============================================
    // OPTION 1: OPENAI ASSISTANTS API
    // ============================================
    if (ASSISTANT_ID) {
      console.log('[Doc AI Chat] Using OpenAI Assistant API with ID:', ASSISTANT_ID);

      // Create thread
      const threadResponse = await fetch('https://api.openai.com/v1/threads', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: userContent
            }
          ]
        })
      });

      if (!threadResponse.ok) {
        const errorText = await threadResponse.text();
        console.error('[Doc AI Chat] Failed to create thread:', errorText);
        throw new Error(`Failed to create thread: ${threadResponse.status}`);
      }

      const thread = await threadResponse.json();
      console.log('[Doc AI Chat] Thread created:', thread.id);

      // Create run
      const runResponse = await fetch(`https://api.openai.com/v1/threads/${thread.id}/runs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        },
        body: JSON.stringify({
          assistant_id: ASSISTANT_ID,
          additional_instructions: `Context Information:${documentsContext}${userContext}${historyContext}`
        })
      });

      if (!runResponse.ok) {
        const errorText = await runResponse.text();
        console.error('[Doc AI Chat] Failed to create run:', errorText);
        throw new Error(`Failed to create run: ${runResponse.status}`);
      }

      const run = await runResponse.json();
      console.log('[Doc AI Chat] Run created:', run.id);

      // Poll for completion
      let runStatus = run.status;
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout

      while (runStatus === 'queued' || runStatus === 'in_progress') {
        if (attempts >= maxAttempts) {
          throw new Error('Run timeout - taking too long to complete');
        }

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const statusResponse = await fetch(
          `https://api.openai.com/v1/threads/${thread.id}/runs/${run.id}`,
          {
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'OpenAI-Beta': 'assistants=v2'
            }
          }
        );

        if (!statusResponse.ok) {
          throw new Error(`Failed to get run status: ${statusResponse.status}`);
        }

        const statusData = await statusResponse.json();
        runStatus = statusData.status;
        attempts++;
        console.log(`[Doc AI Chat] Run status: ${runStatus} (attempt ${attempts})`);
      }

      if (runStatus === 'failed') {
        throw new Error('Assistant run failed');
      }

      if (runStatus === 'completed') {
        // Get messages from thread
        const messagesResponse = await fetch(
          `https://api.openai.com/v1/threads/${thread.id}/messages`,
          {
            headers: {
              'Authorization': `Bearer ${OPENAI_API_KEY}`,
              'OpenAI-Beta': 'assistants=v2'
            }
          }
        );

        if (!messagesResponse.ok) {
          throw new Error(`Failed to get messages: ${messagesResponse.status}`);
        }

        const messagesData = await messagesResponse.json();
        const assistantMessage = messagesData.data.find((msg: any) => msg.role === 'assistant');

        if (assistantMessage && assistantMessage.content && assistantMessage.content.length > 0) {
          const responseText = assistantMessage.content[0].text.value;

          // Log activity
          await logActivity(userId, 'ai_chat', {
            success: true,
            details: { conversationId, messageLength: message.length, responseLength: responseText.length }
          });

          // Increment usage
          await incrementUsage(userId, 'ai_chat');

          return NextResponse.json({ response: responseText });
        } else {
          throw new Error('No assistant response found');
        }
      } else {
        throw new Error(`Unexpected run status: ${runStatus}`);
      }
    }

    // ============================================
    // OPTION 2: CHAT COMPLETIONS API
    // ============================================
    console.log('[Doc AI Chat] No assistant ID, using chat completion');
    const model = adminSettings?.ai_model || 'gpt-4o-mini';
    console.log('[Doc AI Chat] Using model:', model);

    // Build system prompt
    let systemPrompt =
      adminSettings?.global_prompt ||
      'You are Harvey, a helpful AI assistant for Design-Rite. You help security and low-voltage sales engineers create professional proposals, generate accurate quotes, and streamline their workflow.';

    // Replace template variables
    systemPrompt = systemPrompt
      .replace(/\{\{company_name\}\}/g, user?.company || 'your company')
      .replace(/\{\{user_name\}\}/g, user?.full_name || 'there')
      .replace(/\{\{user_email\}\}/g, user?.email || '')
      .replace(/\{\{conversation_history\}\}/g, historyContext)
      .replace(/\{\{documents\}\}/g, documentsContext);

    // Add image context if available
    let imageContext = '';
    if (structuredData?.siteImages && structuredData.siteImages.length > 0) {
      imageContext = `\n\nSITE IMAGES: ${structuredData.siteImages.length} site image(s) have been uploaded and analyzed. When generating proposals, reference these images and include placeholder text like "[Site Image 1]" where appropriate.`;
    }

    systemPrompt +=
      documentsContext +
      userContext +
      imageContext +
      '\n\nWhen generating proposals or invoices, use the available documents to include accurate pricing, services, and company information. Always be helpful and professional.\n\nIMPORTANT: After each response, analyze the conversation for security risk indicators and suggest a priority score (1-100) based on:\n- Mentioned vulnerabilities or security issues (high: 80-100)\n- Compliance requirements (medium-high: 60-90)\n- Budget size and urgency (medium: 40-70)\n- General consultations (low: 20-50)\n\nFormat your priority assessment at the end as: [PRIORITY_SCORE: XX] where XX is your suggested score.';

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      },
      ...conversationHistory.slice(-10),
      {
        role: 'user',
        content: userContent
      }
    ];

    // Handle newer vs legacy models
    const isNewerModel =
      model.includes('gpt-5') ||
      model.includes('gpt-4.1') ||
      model.includes('o3') ||
      model.includes('o4');

    const requestBody: any = {
      model: model,
      messages: messages
    };

    if (isNewerModel) {
      requestBody.max_completion_tokens = adminSettings?.max_completion_tokens || 1500;
    } else {
      requestBody.max_tokens = adminSettings?.max_tokens || 1500;
      requestBody.temperature = adminSettings?.temperature || 0.7;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('[Doc AI Chat] OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    let responseText = data.choices[0].message.content;

    // Extract priority score and update conversation
    if (conversationId) {
      const priorityMatch = responseText.match(/\[PRIORITY_SCORE:\s*(\d+)\]/);
      if (priorityMatch) {
        const score = parseInt(priorityMatch[1], 10);
        const priorityLevel = score >= 80 ? 'high' : score >= 50 ? 'medium' : 'low';

        // Remove priority score from response text
        responseText = responseText.replace(/\[PRIORITY_SCORE:\s*\d+\]/, '').trim();

        // Update conversation with priority score (non-blocking)
        supabase
          .from('chat_conversations')
          .update({
            priority_score: score,
            priority_level: priorityLevel,
            conversation_summary: message.slice(0, 200)
          })
          .eq('id', conversationId)
          .then(({ error }) => {
            if (error) console.error('[Doc AI Chat] Error updating priority:', error);
            else console.log('[Doc AI Chat] Updated conversation priority:', score, priorityLevel);
          });
      }
    }

    // Log activity
    await logActivity(userId, 'ai_chat', {
      success: true,
      details: {
        conversationId,
        model,
        messageLength: message.length,
        responseLength: responseText.length
      }
    });

    // Increment usage
    await incrementUsage(userId, 'ai_chat');

    return NextResponse.json({ response: responseText });

  } catch (error) {
    console.error('[Doc AI Chat] Error:', error);

    // Log failed activity (use the session from the try block scope)
    // Note: session variable is already defined at the top of the POST function (line 44)
    try {
      const supabase = createRouteHandlerClient({ cookies });
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user?.id) {
        await logActivity(session.user.id, 'ai_chat', {
          success: false,
          errorMessage: (error as Error).message
        });
      }
    } catch (logError) {
      console.error('[Doc AI Chat] Error logging failed activity:', logError);
    }

    return NextResponse.json(
      {
        error: (error as Error).message || 'Internal server error',
        response: "I'm having trouble connecting to my AI services right now. Please try again in a moment."
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
