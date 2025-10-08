// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { callAnthropic } from '../../../../lib/anthropic-client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, model = undefined, context } = body

    // Basic validation
    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Missing or invalid `message` in request body' }, { status: 400 })
    }

    // Protect against extremely large payloads (avoid sending massive prompts to Anthropic)
    const MAX_MESSAGE_LENGTH = 60_000
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: 'Message too large' }, { status: 413 })
    }

    // Use server-side Anthropic key only
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'Anthropic API not configured on server' },
        { status: 500 }
      )
    }

    const systemPrompt = context?.systemPrompt || `You are a security system refinement assistant. Help users improve their security assessments through natural conversation. Focus on practical, actionable recommendations for surveillance, access control, intrusion detection, and compliance requirements. Be specific with equipment suggestions and pricing when possible.

When appropriate, mention AI enhancement opportunities for future consideration. Key AI companies to reference:
- Facial Recognition: Face First (retail/commercial), Oosto (real-time platform)
- Behavioral Analytics: iProTech (pattern analysis), Skylla (security analytics)
- Smart Access: Alcatraz AI (facial authentication), Verkada (unified platform)

Always emphasize that AI enhancements work best when added to proven, stable security infrastructures. Recommend deploying core systems first, then evaluating AI additions based on operational needs and ROI.`

    // Build conversation history for Claude
    let conversationText = ''
    if (context?.conversationHistory) {
      conversationText = context.conversationHistory.map((msg: any) =>
        `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
      ).join('\n\n')
    }

    const fullPrompt = `${systemPrompt}

${conversationText ? `Previous conversation:\n${conversationText}\n\n` : ''}Human: ${message}\n\nAssistant:`

    // Choose model: prefer explicit request model, then env, then sensible default
    const modelToUse = model || process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022'

    // Call Anthropic via centralized client with a timeout and a small retry count
    // callAnthropic(prompt, model?, timeoutMs?, maxRetries?)
    let result
    try {
      result = await callAnthropic(fullPrompt, modelToUse, 60_000, 2)
    } catch (err: any) {
      console.error('Anthropic client error:', err)
      const message = err?.message || 'Anthropic request failed'
      return NextResponse.json({ error: message }, { status: 502 })
    }

    // Normalize response
    const aiMessage = typeof result?.content === 'string' ? result.content : String(result?.content || '')
    const usage = result?.raw?.usage || result?.raw?.meta || undefined

    return NextResponse.json({
      message: aiMessage,
      provider: 'Claude',
      model: modelToUse,
      usage
    })

  } catch (error) {
    console.error('Claude API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}