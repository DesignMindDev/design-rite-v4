import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import fs from 'fs'
import path from 'path'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const AI_PROVIDERS_PATH = path.join(process.cwd(), 'data', 'ai-providers.json')

// Load AI providers data to get the correct Assistant ID
function loadProvidersData() {
  if (!fs.existsSync(AI_PROVIDERS_PATH)) {
    return { providers: [] }
  }
  const data = fs.readFileSync(AI_PROVIDERS_PATH, 'utf8')
  return JSON.parse(data)
}

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get the provider ID from context, default to first assessment provider
    const providerId = context?.provider
    const providersData = loadProvidersData()

    let selectedProvider = null
    if (providerId) {
      selectedProvider = providersData.providers.find((p: any) => p.id === providerId)
    }

    // If no specific provider or not found, get first enabled assessment provider
    if (!selectedProvider) {
      selectedProvider = providersData.providers.find((p: any) =>
        p.use_case === 'assessment' && p.enabled && p.provider_type === 'openai'
      )
    }

    // Fallback to environment variable
    const assistantId = selectedProvider?.api_key || process.env.ASSESSMENT_ASSISTANT_ID || 'asst_k6HbBQBgNG3p04jxkbqUtplv'

    if (!assistantId || !assistantId.startsWith('asst_')) {
      throw new Error('No valid Assistant ID found')
    }

    // Create a new thread for this conversation
    const thread = await openai.beta.threads.create()

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message,
    })

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    })

    // Wait for the run to complete
    let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)

    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000))
      runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id)
    }

    if (runStatus.status !== 'completed') {
      throw new Error(`Assistant run failed with status: ${runStatus.status}`)
    }

    // Get the assistant's response
    const messages = await openai.beta.threads.messages.list(thread.id)
    const lastMessage = messages.data[0]

    if (lastMessage.role !== 'assistant') {
      throw new Error('No assistant response found')
    }

    // Extract the text content
    const content = lastMessage.content[0]
    if (content.type !== 'text') {
      throw new Error('Assistant response is not text')
    }

    return NextResponse.json({
      message: content.text.value,
      threadId: thread.id,
      assistantId: assistantId,
      providerId: selectedProvider?.id,
      success: true
    })

  } catch (error) {
    console.error('Assistant API Error:', error)

    return NextResponse.json({
      error: 'Failed to get assistant response',
      details: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }, { status: 500 })
  }
}