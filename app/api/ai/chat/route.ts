/**
 * Design-Rite Professional - Proprietary & Confidential
 * Copyright (c) 2025 Design-Rite Professional. All Rights Reserved.
 *
 * NOTICE: This code contains proprietary business logic and trade secrets.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 *
 * Last Modified: October 01, 2025
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'save_chat_message':
        return await saveChatMessage(data)
      case 'get_chat_history':
        return await getChatHistory(data)
      case 'create_chat_session':
        return await createChatSession(data)
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('AI Chat Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function saveChatMessage(data: any) {
  const {
    sessionId,
    userHash,
    userMessage,
    aiResponse,
    aiProvider,
    threadId,
    assistantId,
    timestamp,
    metadata
  } = data

  // Save to chat_conversations table (separate from assessment data)
  const { error: chatError } = await supabase
    .from('chat_conversations')
    .insert({
      session_id: sessionId,
      user_hash: userHash,
      thread_id: threadId,
      assistant_id: assistantId,
      ai_provider: aiProvider,
      user_message: userMessage,
      ai_response: aiResponse,
      timestamp: timestamp || new Date().toISOString(),
      metadata: metadata || {}
    })

  if (chatError) {
    console.error('Supabase chat save error:', chatError)
    return NextResponse.json(
      { error: 'Failed to save chat message' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true })
}

async function getChatHistory(data: any) {
  const { sessionId, userHash } = data

  const { data: messages, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('session_id', sessionId)
    .eq('user_hash', userHash)
    .order('timestamp', { ascending: true })

  if (error) {
    console.error('Get chat history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat history' },
      { status: 500 }
    )
  }

  return NextResponse.json({ messages: messages || [] })
}

async function createChatSession(data: any) {
  const {
    sessionId,
    userHash,
    sessionName,
    aiProvider,
    threadId,
    assistantId,
    assessmentReference
  } = data

  const { error } = await supabase
    .from('chat_sessions')
    .insert({
      session_id: sessionId,
      user_hash: userHash,
      session_name: sessionName || `Chat Session ${new Date().toLocaleDateString()}`,
      ai_provider: aiProvider || 'openai',
      thread_id: threadId,
      assistant_id: assistantId,
      assessment_reference: assessmentReference, // Link to ai_sessions if related
      created_at: new Date().toISOString(),
      last_activity: new Date().toISOString(),
      message_count: 0
    })

  if (error) {
    console.error('Create chat session error:', error)
    return NextResponse.json(
      { error: 'Failed to create chat session' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, sessionId })
}