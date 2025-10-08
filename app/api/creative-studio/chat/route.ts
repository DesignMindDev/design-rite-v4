// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'
import { logAIConversation, generateUserHash, generateSessionId } from '../../../../lib/ai-session-logger'

// Creative Studio Chat API
// Manages chat messages and conversation history

interface ChatMessageCreateRequest {
  projectId: string
  role: 'user' | 'assistant'
  content: string
  provider?: string
}

interface ChatMessageResponse {
  id: string
  projectId: string
  role: 'user' | 'assistant'
  content: string
  provider?: string
  timestamp: string
  metadata?: Record<string, any>
}

// GET /api/creative-studio/chat - Get chat messages for a project
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    const { data: messages, error } = await supabaseAdmin
      .from('chat_messages')
      .select(`
        id,
        project_id,
        role,
        content,
        provider,
        timestamp,
        metadata
      `)
      .eq('project_id', projectId)
      .order('timestamp', { ascending: true })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching chat messages:', error)
      return NextResponse.json(
        { error: 'Failed to fetch chat messages', details: error.message },
        { status: 500 }
      )
    }

    // Transform to match frontend interface
    const transformedMessages: ChatMessageResponse[] = (messages || []).map(msg => ({
      id: msg.id,
      projectId: msg.project_id,
      role: msg.role,
      content: msg.content,
      provider: msg.provider,
      timestamp: msg.timestamp,
      metadata: msg.metadata
    }))

    return NextResponse.json({
      messages: transformedMessages,
      total: transformedMessages.length,
      hasMore: transformedMessages.length === limit,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Chat GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/creative-studio/chat - Create new chat message
export async function POST(request: NextRequest) {
  try {
    const body: ChatMessageCreateRequest = await request.json()

    // Validation
    if (!body.projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    if (!body.role || !['user', 'assistant'].includes(body.role)) {
      return NextResponse.json(
        { error: 'Role must be either "user" or "assistant"' },
        { status: 400 }
      )
    }

    if (!body.content || body.content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message content is required' },
        { status: 400 }
      )
    }

    // Verify project exists
    const { data: project, error: projectError } = await supabaseAdmin
      .from('projects')
      .select('id')
      .eq('id', body.projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Create chat message
    const { data: message, error } = await supabaseAdmin
      .from('chat_messages')
      .insert({
        project_id: body.projectId,
        role: body.role,
        content: body.content.trim(),
        provider: body.provider || null,
        timestamp: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating chat message:', error)
      return NextResponse.json(
        { error: 'Failed to create chat message', details: error.message },
        { status: 500 }
      )
    }

    // Log conversation to Supabase (non-blocking) - only for assistant messages
    if (body.role === 'assistant') {
      const sessionId = body.projectId || generateSessionId()
      const userHash = generateUserHash(request)
      logAIConversation({
        sessionId,
        userHash,
        userMessage: 'User message from chat history',
        aiResponse: body.content,
        aiProvider: body.provider || 'creative-studio',
        metadata: {
          feature: 'creative-studio-chat',
          projectId: body.projectId
        }
      }).catch(err => console.error('[Creative Studio Chat] Logging error:', err))
    }

    // Transform response
    const response: ChatMessageResponse = {
      id: message.id,
      projectId: message.project_id,
      role: message.role,
      content: message.content,
      provider: message.provider,
      timestamp: message.timestamp,
      metadata: message.metadata
    }

    return NextResponse.json({
      message: response,
      success: true,
      sessionId: body.projectId
    }, { status: 201 })

  } catch (error) {
    console.error('Chat POST error:', error)

    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/creative-studio/chat - Clear chat history for a project
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const messageId = searchParams.get('messageId')

    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      )
    }

    let query = supabaseAdmin
      .from('chat_messages')
      .delete()
      .eq('project_id', projectId)

    // If messageId is provided, delete only that message
    if (messageId) {
      query = query.eq('id', messageId)
    }

    const { error } = await query

    if (error) {
      console.error('Error deleting chat messages:', error)
      return NextResponse.json(
        { error: 'Failed to delete chat messages', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: messageId ? 'Message deleted successfully' : 'Chat history cleared successfully'
    })

  } catch (error) {
    console.error('Chat DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}