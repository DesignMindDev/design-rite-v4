import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const AI_PROVIDERS_PATH = path.join(process.cwd(), 'data', 'ai-providers.json')

interface AIProvider {
  id: string
  name: string
  provider_type: 'anthropic' | 'openai' | 'google' | 'xai'
  api_key: string
  endpoint: string
  model: string
  priority: number
  enabled: boolean
  max_tokens: number
  timeout_seconds: number
  created_at: string
  updated_at: string
}

interface HealthCheck {
  id: string
  provider_id: string
  status: 'healthy' | 'degraded' | 'down'
  response_time_ms?: number
  error_message?: string
  checked_at: string
}

interface AIProvidersData {
  providers: AIProvider[]
  health_checks: HealthCheck[]
  settings: {
    health_check_interval_minutes: number
    auto_failover_enabled: boolean
    fallback_to_static_responses: boolean
  }
}

function loadProvidersData(): AIProvidersData {
  if (!fs.existsSync(AI_PROVIDERS_PATH)) {
    const defaultData: AIProvidersData = {
      providers: [],
      health_checks: [],
      settings: {
        health_check_interval_minutes: 5,
        auto_failover_enabled: true,
        fallback_to_static_responses: true
      }
    }
    fs.writeFileSync(AI_PROVIDERS_PATH, JSON.stringify(defaultData, null, 2))
    return defaultData
  }

  const data = fs.readFileSync(AI_PROVIDERS_PATH, 'utf8')
  return JSON.parse(data)
}

function saveProvidersData(data: AIProvidersData): void {
  fs.writeFileSync(AI_PROVIDERS_PATH, JSON.stringify(data, null, 2))
}

// GET - Retrieve AI providers configuration
export async function GET(request: NextRequest) {
  try {
    const data = loadProvidersData()

    // Don't expose API keys in the response
    const sanitizedProviders = data.providers.map(provider => ({
      ...provider,
      api_key: provider.api_key ? '***configured***' : ''
    }))

    return NextResponse.json({
      providers: sanitizedProviders,
      health_checks: data.health_checks.slice(-50), // Last 50 health checks
      settings: data.settings
    })

  } catch (error) {
    console.error('Error loading AI providers:', error)
    return NextResponse.json({ error: 'Failed to load AI providers' }, { status: 500 })
  }
}

// POST - Create or update AI provider
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, provider } = body

    const data = loadProvidersData()

    switch (action) {
      case 'create':
        const newProvider: AIProvider = {
          id: `${provider.provider_type}-${Date.now()}`,
          name: provider.name,
          provider_type: provider.provider_type,
          api_key: provider.api_key || '',
          endpoint: provider.endpoint,
          model: provider.model,
          priority: provider.priority || 999,
          enabled: provider.enabled !== undefined ? provider.enabled : true,
          max_tokens: provider.max_tokens || 1500,
          timeout_seconds: provider.timeout_seconds || 30,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        data.providers.push(newProvider)
        data.providers.sort((a, b) => a.priority - b.priority)
        saveProvidersData(data)

        return NextResponse.json({
          success: true,
          message: 'AI provider created successfully',
          provider: { ...newProvider, api_key: newProvider.api_key ? '***configured***' : '' }
        })

      case 'update':
        const providerIndex = data.providers.findIndex(p => p.id === provider.id)
        if (providerIndex === -1) {
          return NextResponse.json({ error: 'AI provider not found' }, { status: 404 })
        }

        data.providers[providerIndex] = {
          ...data.providers[providerIndex],
          ...provider,
          updated_at: new Date().toISOString()
        }

        data.providers.sort((a, b) => a.priority - b.priority)
        saveProvidersData(data)

        return NextResponse.json({
          success: true,
          message: 'AI provider updated successfully'
        })

      case 'delete':
        const deleteIndex = data.providers.findIndex(p => p.id === provider.id)
        if (deleteIndex === -1) {
          return NextResponse.json({ error: 'AI provider not found' }, { status: 404 })
        }

        data.providers.splice(deleteIndex, 1)
        saveProvidersData(data)

        return NextResponse.json({
          success: true,
          message: 'AI provider deleted successfully'
        })

      case 'test_connection':
        // Get the full provider details for testing
        const fullProvider = data.providers.find(p => p.id === provider.id)
        if (!fullProvider) {
          return NextResponse.json({ error: 'Provider not found for testing' }, { status: 404 })
        }

        // Test the API connection
        const testResult = await testProviderConnection(fullProvider)

        // Record health check
        const healthCheck: HealthCheck = {
          id: `test-${Date.now()}`,
          provider_id: provider.id,
          status: testResult.success ? 'healthy' : 'down',
          response_time_ms: testResult.response_time,
          error_message: testResult.error,
          checked_at: new Date().toISOString()
        }

        data.health_checks.push(healthCheck)
        data.health_checks = data.health_checks.slice(-100) // Keep last 100 checks
        saveProvidersData(data)

        return NextResponse.json({
          success: testResult.success,
          message: testResult.success ? 'Connection successful' : 'Connection failed',
          test_result: testResult,
          health_check: healthCheck
        })

      case 'update_settings':
        data.settings = { ...data.settings, ...provider }
        saveProvidersData(data)

        return NextResponse.json({
          success: true,
          message: 'Settings updated successfully'
        })

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

  } catch (error) {
    console.error('Error managing AI providers:', error)
    return NextResponse.json({
      error: 'Failed to manage AI provider',
      details: error.message
    }, { status: 500 })
  }
}

async function testProviderConnection(provider: AIProvider): Promise<{
  success: boolean
  response_time?: number
  error?: string
  response?: string
}> {
  const startTime = Date.now()

  try {
    console.log('Testing provider:', provider.name, 'Type:', provider.provider_type)

    const testMessage = "Hello, this is a connection test."
    let response: Response

    switch (provider.provider_type) {
      case 'anthropic':
        response = await fetch(provider.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': provider.api_key,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model: provider.model,
            max_tokens: 50,
            messages: [{ role: 'user', content: testMessage }]
          }),
          signal: AbortSignal.timeout(provider.timeout_seconds * 1000)
        })
        break

      case 'openai':
        response = await fetch(provider.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${provider.api_key}`
          },
          body: JSON.stringify({
            model: provider.model,
            max_tokens: 50,
            messages: [{ role: 'user', content: testMessage }]
          }),
          signal: AbortSignal.timeout(provider.timeout_seconds * 1000)
        })
        break

      default:
        throw new Error(`Unsupported provider type: ${provider.provider_type}`)
    }

    const responseTime = Date.now() - startTime

    if (!response.ok) {
      const errorText = await response.text()
      return {
        success: false,
        response_time: responseTime,
        error: `HTTP ${response.status}: ${errorText}`
      }
    }

    return {
      success: true,
      response_time: responseTime,
      response: 'Connection successful'
    }

  } catch (error) {
    const responseTime = Date.now() - startTime
    return {
      success: false,
      response_time: responseTime,
      error: error?.message || error?.toString() || 'Unknown error'
    }
  }
}