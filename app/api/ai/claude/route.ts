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

${conversationText ? `Previous conversation:\n${conversationText}\n\n` : ''}Human: ${message}\n\nAssistant:`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model,
        max_tokens: 1000,
        temperature: 0.7,
        messages: [{
          role: 'user',
          content: fullPrompt
        }]
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: `Claude API Error: ${errorData.error?.message || response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const aiMessage = data.content?.[0]?.text

    if (!aiMessage) {
      return NextResponse.json(
        { error: 'No response from Claude' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: aiMessage,
      provider: 'Claude',
      model,
      usage: data.usage
    })

  } catch (error) {
    console.error('Claude API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}