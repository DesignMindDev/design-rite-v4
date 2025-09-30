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
      // Validate requested provider is enabled and correct type
      if (selectedProvider && (!selectedProvider.enabled || selectedProvider.provider_type !== 'openai')) {
        console.warn(`Requested provider ${providerId} is disabled or not OpenAI compatible, falling back`)
        selectedProvider = null
      }
    }

    // If no specific provider or not found, get first enabled provider by priority
    // Check for general providers first (for demo AI assistants), then assessment providers
    if (!selectedProvider) {
      const generalProviders = providersData.providers
        .filter((p: any) => p.use_case === 'general' && p.enabled && p.provider_type === 'openai')
        .sort((a: any, b: any) => (a.priority || 999) - (b.priority || 999))

      const assessmentProviders = providersData.providers
        .filter((p: any) => p.use_case === 'assessment' && p.enabled && p.provider_type === 'openai')
        .sort((a: any, b: any) => (a.priority || 999) - (b.priority || 999))

      // Prefer general providers (for demo AI assistants), fallback to assessment
      selectedProvider = generalProviders[0] || assessmentProviders[0]

      if (!selectedProvider) {
        console.error('No enabled OpenAI providers found in AI Providers system (checked general and assessment use cases)')
        throw new Error('AI Assistant service is currently unavailable - no providers configured')
      }
    }

    // Fallback to environment variable
    const assistantId = selectedProvider?.api_key || process.env.ASSESSMENT_ASSISTANT_ID || 'asst_k6HbBQBgNG3p04jxkbqUtplv'

    if (!assistantId || !assistantId.startsWith('asst_')) {
      console.error('Assistant ID validation failed:', {
        assistantId,
        selectedProvider: selectedProvider?.id,
        hasEnvVar: !!process.env.ASSESSMENT_ASSISTANT_ID
      })
      throw new Error(`No valid Assistant ID found. Got: ${assistantId}`)
    }

    // Validate that we have a proper OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('Missing OPENAI_API_KEY environment variable')
      throw new Error('OpenAI API key not configured')
    }

    // Log selected provider for monitoring and debugging
    console.log('AI Assistant Request:', {
      selectedProvider: selectedProvider.id,
      providerName: selectedProvider.name,
      assistantId: assistantId.substring(0, 8) + '...',
      priority: selectedProvider.priority,
      useCase: selectedProvider.use_case
    })

    // Create a new thread for this conversation
    const thread = await openai.beta.threads.create()
    console.log('Thread created:', { threadId: thread?.id, threadObject: !!thread })

    if (!thread?.id) {
      throw new Error('Failed to create thread - no thread ID returned')
    }

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: message,
    })

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    })
    console.log('Run created:', { runId: run?.id, threadId: thread.id })

    // Store IDs in variables to prevent scope issues
    const threadId = thread.id
    const runId = run.id

    // Work around OpenAI library bug by using REST API directly
    const threadIdStr = thread.id
    const runIdStr = run.id
    console.log('Using direct REST API call for:', { threadIdStr, runIdStr })

    // Direct REST API call to work around library bug
    const fetchRunStatus = async () => {
      const response = await fetch(`https://api.openai.com/v1/threads/${threadIdStr}/runs/${runIdStr}`, {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'assistants=v2'
        }
      })
      return await response.json()
    }

    let runStatus = await fetchRunStatus()

    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000))
      runStatus = await fetchRunStatus()
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

    // Log successful completion for AI Provider health monitoring
    console.log('AI Assistant Success:', {
      providerId: selectedProvider.id,
      assistantId: assistantId.substring(0, 8) + '...',
      responseLength: content.text.value.length,
      threadId: thread.id.substring(0, 8) + '...'
    })

    return NextResponse.json({
      message: content.text.value,
      threadId: thread.id,
      assistantId: assistantId,
      providerId: selectedProvider?.id,
      providerName: selectedProvider?.name,
      success: true
    })

  } catch (error) {
    console.error('Assistant API Error:', error)

    // Log error for AI Provider health monitoring (selectedProvider might be undefined here)
    const providerInfo = typeof selectedProvider !== 'undefined' ? selectedProvider : null
    console.error('AI Provider Error:', {
      providerId: providerInfo?.id || 'none',
      providerName: providerInfo?.name || 'none',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    })

    // Provide more specific error messages for debugging
    let errorMessage = 'Failed to get assistant response'
    let statusCode = 500

    if (error instanceof Error) {
      if (error.message.includes('No valid Assistant ID')) {
        errorMessage = 'AI Assistant configuration error: Invalid or missing Assistant ID'
        statusCode = 503 // Service Unavailable
      } else if (error.message.includes('OpenAI API key not configured')) {
        errorMessage = 'AI Service configuration error: API key not configured'
        statusCode = 503
      } else if (error.message.includes('Assistant run failed')) {
        errorMessage = 'AI Assistant processing error: Please try again'
        statusCode = 502 // Bad Gateway
      } else if (error.message.includes('quota') || error.message.includes('rate limit')) {
        errorMessage = 'AI Service temporarily unavailable: Please try again in a moment'
        statusCode = 429 // Too Many Requests
      } else if (error.message.includes('unavailable - no providers configured')) {
        errorMessage = 'AI Assessment service unavailable: Please check AI Providers configuration'
        statusCode = 503
      }
    }

    return NextResponse.json({
      error: errorMessage,
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      success: false
    }, { status: statusCode })
  }
}