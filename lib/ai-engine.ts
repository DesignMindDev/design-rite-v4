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

interface AIResponse {
  success: boolean
  content?: string
  provider_used: string
  response_time_ms: number
  error?: string
}

export class MultiAIEngine {
  private data: AIProvidersData

  constructor() {
    this.loadData()
  }

  private loadData(): void {
    try {
      if (fs.existsSync(AI_PROVIDERS_PATH)) {
        const fileContent = fs.readFileSync(AI_PROVIDERS_PATH, 'utf8')
        this.data = JSON.parse(fileContent)
      } else {
        this.data = {
          providers: [],
          health_checks: [],
          settings: {
            health_check_interval_minutes: 5,
            auto_failover_enabled: true,
            fallback_to_static_responses: true
          }
        }
      }
    } catch (error) {
      console.error('Error loading AI providers data:', error)
      this.data = {
        providers: [],
        health_checks: [],
        settings: {
          health_check_interval_minutes: 5,
          auto_failover_enabled: true,
          fallback_to_static_responses: true
        }
      }
    }
  }

  private hasValidApiKey(provider: AIProvider): boolean {
    if (!provider.api_key) return false
    if (provider.api_key === 'configured_from_env') {
      if (provider.provider_type === 'anthropic') return !!process.env.ANTHROPIC_API_KEY
      if (provider.provider_type === 'openai') return !!process.env.OPENAI_API_KEY
    }
    return true
  }

  private saveHealthCheck(providerId: string, status: 'healthy' | 'degraded' | 'down', responseTime?: number, error?: string): void {
    try {
      const healthCheck: HealthCheck = {
        id: `hc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        provider_id: providerId,
        status,
        response_time_ms: responseTime,
        error_message: error,
        checked_at: new Date().toISOString()
      }

      this.data.health_checks.push(healthCheck)
      this.data.health_checks = this.data.health_checks.slice(-100) // Keep last 100 checks

      fs.writeFileSync(AI_PROVIDERS_PATH, JSON.stringify(this.data, null, 2))
    } catch (error) {
      console.error('Error saving health check:', error)
    }
  }

  private async callAnthropicAPI(provider: AIProvider, message: string): Promise<{ content: string; responseTime: number }> {
    const startTime = Date.now()

    // Use environment variable if configured_from_env placeholder is used
    const apiKey = provider.api_key === 'configured_from_env' ? process.env.ANTHROPIC_API_KEY : provider.api_key

    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey!,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: provider.model,
        max_tokens: provider.max_tokens,
        messages: [{ role: 'user', content: message }]
      }),
      signal: AbortSignal.timeout(provider.timeout_seconds * 1000)
    })

    const responseTime = Date.now() - startTime

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return {
      content: data.content[0].text,
      responseTime
    }
  }

  private async callOpenAIAPI(provider: AIProvider, message: string): Promise<{ content: string; responseTime: number }> {
    const startTime = Date.now()

    // Use environment variable if configured_from_env placeholder is used
    const apiKey = provider.api_key === 'configured_from_env' ? process.env.OPENAI_API_KEY : provider.api_key

    const response = await fetch(provider.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: provider.model,
        max_tokens: provider.max_tokens,
        messages: [{ role: 'user', content: message }]
      }),
      signal: AbortSignal.timeout(provider.timeout_seconds * 1000)
    })

    const responseTime = Date.now() - startTime

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return {
      content: data.choices[0].message.content,
      responseTime
    }
  }

  private async callGoogleAPI(provider: AIProvider, message: string): Promise<{ content: string; responseTime: number }> {
    const startTime = Date.now()

    const response = await fetch(`${provider.endpoint}?key=${provider.api_key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: message }]
        }]
      }),
      signal: AbortSignal.timeout(provider.timeout_seconds * 1000)
    })

    const responseTime = Date.now() - startTime

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return {
      content: data.candidates[0].content.parts[0].text,
      responseTime
    }
  }

  private async callProvider(provider: AIProvider, message: string): Promise<{ content: string; responseTime: number }> {
    switch (provider.provider_type) {
      case 'anthropic':
        return await this.callAnthropicAPI(provider, message)
      case 'openai':
        return await this.callOpenAIAPI(provider, message)
      case 'google':
        return await this.callGoogleAPI(provider, message)
      default:
        throw new Error(`Unsupported provider type: ${provider.provider_type}`)
    }
  }

  public async generateResponse(message: string): Promise<AIResponse> {
    // Reload data to get latest provider configuration
    this.loadData()

    // Get enabled providers sorted by priority
    const enabledProviders = this.data.providers
      .filter(p => p.enabled && this.hasValidApiKey(p))
      .sort((a, b) => a.priority - b.priority)

    console.log('🤖 Multi-AI Engine: Found', enabledProviders.length, 'enabled providers')

    if (enabledProviders.length === 0) {
      console.log('⚠️ No enabled AI providers found, using fallback')
      return {
        success: false,
        provider_used: 'none',
        response_time_ms: 0,
        error: 'No AI providers configured'
      }
    }

    // Try each provider in priority order
    for (const provider of enabledProviders) {
      try {
        console.log(`🚀 Trying provider: ${provider.name} (${provider.provider_type})`)

        const result = await this.callProvider(provider, message)

        // Record successful health check
        this.saveHealthCheck(provider.id, 'healthy', result.responseTime)

        console.log(`✅ Success with ${provider.name} in ${result.responseTime}ms`)

        return {
          success: true,
          content: result.content,
          provider_used: provider.name,
          response_time_ms: result.responseTime
        }

      } catch (error) {
        const errorMessage = error.message || 'Unknown error'
        console.log(`❌ Provider ${provider.name} failed: ${errorMessage}`)

        // Record failed health check
        this.saveHealthCheck(provider.id, 'down', undefined, errorMessage)

        // Continue to next provider if auto-failover is enabled
        if (this.data.settings.auto_failover_enabled) {
          console.log(`🔄 Auto-failover enabled, trying next provider...`)
          continue
        } else {
          // Return failure if auto-failover is disabled
          return {
            success: false,
            provider_used: provider.name,
            response_time_ms: 0,
            error: errorMessage
          }
        }
      }
    }

    // All providers failed
    console.log('💥 All AI providers failed')
    return {
      success: false,
      provider_used: 'all_failed',
      response_time_ms: 0,
      error: 'All AI providers are currently unavailable'
    }
  }

  public getProviderStatus(): { provider: AIProvider; lastHealthCheck?: HealthCheck }[] {
    this.loadData()

    return this.data.providers.map(provider => {
      const lastHealthCheck = this.data.health_checks
        .filter(hc => hc.provider_id === provider.id)
        .sort((a, b) => new Date(b.checked_at).getTime() - new Date(a.checked_at).getTime())[0]

      return { provider, lastHealthCheck }
    })
  }
}

// Export singleton instance
export const aiEngine = new MultiAIEngine()