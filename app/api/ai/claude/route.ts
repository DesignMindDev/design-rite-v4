import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, model = 'claude-3-sonnet-20240229', apiKey, context } = body

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Claude API key is required' },
        { status: 400 }
      )
    }

    const systemPrompt = context?.systemPrompt || `You are a security system refinement assistant. Help users improve their security assessments through natural conversation. Focus on practical, actionable recommendations for surveillance, access control, intrusion detection, and compliance requirements. Be specific with equipment suggestions and pricing when possible.`

    // Build conversation history for Claude
    let conversationText = ''
    if (context?.conversationHistory) {
      conversationText = context.conversationHistory.map((msg: any) =>
        `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`
      ).join('\n\n')
    }

    const fullPrompt = `${systemPrompt}

${conversationText ? `Previous conversation:\n${conversationText}\n\n` : ''}Human: ${message}