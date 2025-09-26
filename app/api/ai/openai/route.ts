import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, model = 'gpt-3.5-turbo', apiKey, context } = body

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is required' },
        { status: 400 }
      )
    }

    const systemPrompt = context?.systemPrompt || `You are a security system refinement assistant. Help users improve their security assessments through natural conversation. Focus on practical, actionable recommendations for surveillance, access control, intrusion detection, and compliance requirements. Be specific with equipment suggestions and pricing when possible.`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...context?.conversationHistory?.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })) || [],
      { role: 'user', content: message }
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: 1000,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: `OpenAI API Error: ${errorData.error?.message || response.statusText}` },
        { status: response.status }
      )
    }

    const data = await response.json()
    const aiMessage = data.choices?.[0]?.message?.content

    if (!aiMessage) {
      return NextResponse.json(
        { error: 'No response from OpenAI' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: aiMessage,
      provider: 'OpenAI',
      model,
      usage: data.usage
    })

  } catch (error) {
    console.error('OpenAI API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}