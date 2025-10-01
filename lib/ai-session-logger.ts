/**
 * AI Session Logger
 * Centralized logging for all AI chat interactions
 * Logs to Supabase via /api/ai/logging endpoint
 */

interface LogConversationParams {
  sessionId: string
  userHash: string
  userMessage: string
  aiResponse: string
  aiProvider: string
  metadata?: {
    page?: string
    feature?: string
    model?: string
    tokenCount?: number
    responseTime?: number
    [key: string]: any
  }
}

interface CreateSessionParams {
  sessionId: string
  userHash: string
  sessionName: string
  aiProvider: string
  assessmentData?: any
}

/**
 * Log a conversation turn (user message + AI response)
 * Call this AFTER getting AI response
 */
export async function logAIConversation(params: LogConversationParams): Promise<boolean> {
  try {
    const response = await fetch('/api/ai/logging', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'log_conversation',
        data: {
          sessionId: params.sessionId,
          userHash: params.userHash,
          userMessage: params.userMessage,
          aiResponse: params.aiResponse,
          aiProvider: params.aiProvider,
          timestamp: new Date().toISOString(),
          metadata: params.metadata || {}
        }
      })
    })

    if (!response.ok) {
      console.error('[AI Logger] Failed to log conversation:', response.statusText)
      return false
    }

    return true
  } catch (error) {
    console.error('[AI Logger] Error logging conversation:', error)
    return false // Don't fail the main request if logging fails
  }
}

/**
 * Create a new AI session
 * Call this when starting a new conversation
 */
export async function createAISession(params: CreateSessionParams): Promise<boolean> {
  try {
    const response = await fetch('/api/ai/logging', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create_session',
        data: {
          sessionId: params.sessionId,
          userHash: params.userHash,
          sessionName: params.sessionName,
          aiProvider: params.aiProvider,
          assessmentData: params.assessmentData || null
        }
      })
    })

    if (!response.ok) {
      console.error('[AI Logger] Failed to create session:', response.statusText)
      return false
    }

    return true
  } catch (error) {
    console.error('[AI Logger] Error creating session:', error)
    return false
  }
}

/**
 * Generate a consistent user hash from browser/session data
 * Used to track anonymous users across sessions
 */
export function generateUserHash(request?: Request): string {
  if (typeof window !== 'undefined') {
    // Client-side: Use localStorage or generate new hash
    let userHash = localStorage.getItem('dr_user_hash')
    if (!userHash) {
      userHash = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('dr_user_hash', userHash)
    }
    return userHash
  } else if (request) {
    // Server-side: Generate hash from IP + User-Agent
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'
    // Simple hash (not cryptographic, just for tracking)
    const hashInput = `${ip}_${userAgent}`
    return `server_${Buffer.from(hashInput).toString('base64').substr(0, 16)}`
  } else {
    // Fallback
    return `anonymous_${Date.now()}`
  }
}

/**
 * Generate a unique session ID
 */
export function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Extract feature name from URL path
 */
export function getFeatureFromPath(path: string): string {
  if (path.includes('discovery')) return 'discovery-assistant'
  if (path.includes('help')) return 'help-assistant'
  if (path.includes('creative')) return 'creative-studio-chat'
  if (path.includes('general')) return 'general-chat'
  if (path.includes('ai-chat')) return 'ai-chat'
  return 'unknown'
}
