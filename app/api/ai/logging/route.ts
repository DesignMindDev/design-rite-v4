import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case 'log_conversation':
        return await logConversation(data)
      case 'get_sessions':
        return await getUserSessions(data)
      case 'get_session':
        return await getSession(data)
      case 'create_session':
        return await createSession(data)
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('AI Logging Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

async function logConversation(data: any) {
  const {
    sessionId,
    userHash,
    userMessage,
    aiResponse,
    aiProvider,
    timestamp,
    assessmentData,
    metadata
  } = data

  // Log the conversation entry
  const { error: logError } = await supabase
    .from('ai_conversations')
    .insert({
      session_id: sessionId,
      user_hash: userHash,
      user_message: userMessage,
      ai_response: aiResponse,
      ai_provider: aiProvider,
      timestamp: timestamp || new Date().toISOString(),
      assessment_data: assessmentData,
      metadata: metadata || {}
    })

  if (logError) {
    console.error('Supabase conversation log error:', logError)
    return NextResponse.json(
      { error: 'Failed to log conversation' },
      { status: 500 }
    )
  }

  // Update session last activity
  const { error: sessionError } = await supabase
    .from('ai_sessions')
    .update({
      last_activity: new Date().toISOString(),
      message_count: supabase.raw('message_count + 1')
    })
    .eq('session_id', sessionId)

  if (sessionError) {
    console.error('Session update error:', sessionError)
  }

  return NextResponse.json({ success: true })
}

async function getUserSessions(data: any) {
  const { userHash, limit = 10 } = data

  const { data: sessions, error } = await supabase
    .from('ai_sessions')
    .select(`
      session_id,
      session_name,
      created_at,
      last_activity,
      message_count,
      ai_provider,
      assessment_data
    `)
    .eq('user_hash', userHash)
    .order('last_activity', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Get sessions error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sessions' },
      { status: 500 }
    )
  }

  return NextResponse.json({ sessions })
}

async function getSession(data: any) {
  const { sessionId, userHash } = data

  // Get session details
  const { data: session, error: sessionError } = await supabase
    .from('ai_sessions')
    .select('*')
    .eq('session_id', sessionId)
    .eq('user_hash', userHash)
    .single()

  if (sessionError) {
    console.error('Get session error:', sessionError)
    return NextResponse.json(
      { error: 'Session not found' },
      { status: 404 }
    )
  }

  // Get conversation history
  const { data: conversations, error: convError } = await supabase
    .from('ai_conversations')
    .select('*')
    .eq('session_id', sessionId)
    .order('timestamp', { ascending: true })

  if (convError) {
    console.error('Get conversations error:', convError)
    return NextResponse.json(
      { error: 'Failed to fetch conversation history' },
      { status: 500 }
    )
  }

  return NextResponse.json({
    session,
    conversations: conversations || []
  })
}

async function createSession(data: any) {
  const {
    sessionId,
    userHash,
    sessionName,
    aiProvider,
    assessmentData
  } = data

  const { error } = await supabase
    .from('ai_sessions')
    .insert({
      session_id: sessionId,
      user_hash: userHash,
      session_name: sessionName || `Session ${new Date().toLocaleDateString()}`,
      ai_provider: aiProvider || 'simulated',
      assessment_data: assessmentData || null,
      created_at: new Date().toISOString(),
      last_activity: new Date().toISOString(),
      message_count: 0
    })

  if (error) {
    console.error('Create session error:', error)
    return NextResponse.json(
      { error: 'Failed to create session' },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, sessionId })
}