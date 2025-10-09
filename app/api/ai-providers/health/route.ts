import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface ProviderHealth {
  provider: string
  status: 'online' | 'offline' | 'degraded' | 'testing'
  responseTime?: number
  error?: string
  lastChecked: string
  quotaRemaining?: string
}

async function testOpenAI(): Promise<ProviderHealth> {
  const start = Date.now()
  try {
    const response = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      signal: AbortSignal.timeout(5000)
    })

    const responseTime = Date.now() - start

    if (response.ok) {
      const data = await response.json()
      return {
        provider: 'OpenAI',
        status: 'online',
        responseTime,
        lastChecked: new Date().toISOString(),
        quotaRemaining: response.headers.get('x-ratelimit-remaining-tokens') || 'N/A'
      }
    }

    return {
      provider: 'OpenAI',
      status: 'degraded',
      responseTime,
      error: `HTTP ${response.status}`,
      lastChecked: new Date().toISOString()
    }
  } catch (error: any) {
    return {
      provider: 'OpenAI',
      status: 'offline',
      error: error.message || 'Connection failed',
      lastChecked: new Date().toISOString()
    }
  }
}

async function testClaude(): Promise<ProviderHealth> {
  const start = Date.now()
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        messages: [{ role: 'user', content: 'test' }]
      }),
      signal: AbortSignal.timeout(5000)
    })

    const responseTime = Date.now() - start

    if (response.ok || response.status === 400) {
      // 400 is OK for health check (means API is responding)
      return {
        provider: 'Claude (Anthropic)',
        status: 'online',
        responseTime,
        lastChecked: new Date().toISOString(),
        quotaRemaining: response.headers.get('anthropic-ratelimit-tokens-remaining') || 'N/A'
      }
    }

    return {
      provider: 'Claude (Anthropic)',
      status: 'degraded',
      responseTime,
      error: `HTTP ${response.status}`,
      lastChecked: new Date().toISOString()
    }
  } catch (error: any) {
    return {
      provider: 'Claude (Anthropic)',
      status: 'offline',
      error: error.message || 'Connection failed',
      lastChecked: new Date().toISOString()
    }
  }
}

async function testGemini(): Promise<ProviderHealth> {
  const start = Date.now()
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return {
        provider: 'Gemini',
        status: 'offline',
        error: 'API key not configured',
        lastChecked: new Date().toISOString()
      }
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`,
      {
        signal: AbortSignal.timeout(5000)
      }
    )

    const responseTime = Date.now() - start

    if (response.ok) {
      return {
        provider: 'Gemini',
        status: 'online',
        responseTime,
        lastChecked: new Date().toISOString()
      }
    }

    return {
      provider: 'Gemini',
      status: 'degraded',
      responseTime,
      error: `HTTP ${response.status}`,
      lastChecked: new Date().toISOString()
    }
  } catch (error: any) {
    return {
      provider: 'Gemini',
      status: 'offline',
      error: error.message || 'Connection failed',
      lastChecked: new Date().toISOString()
    }
  }
}

export async function GET() {
  try {
    // Test all providers in parallel
    const [openai, claude, gemini] = await Promise.all([
      testOpenAI(),
      testClaude(),
      testGemini()
    ])

    const providers = [openai, claude, gemini]
    const onlineCount = providers.filter(p => p.status === 'online').length
    const offlineCount = providers.filter(p => p.status === 'offline').length
    const degradedCount = providers.filter(p => p.status === 'degraded').length

    // Determine overall system status
    let systemStatus: 'healthy' | 'degraded' | 'critical' = 'healthy'
    if (offlineCount >= 2) {
      systemStatus = 'critical'
    } else if (offlineCount >= 1 || degradedCount >= 1) {
      systemStatus = 'degraded'
    }

    // Determine failover chain health
    const failoverChain = ['OpenAI', 'Claude (Anthropic)', 'Gemini']
    const firstAvailable = providers.find(p => p.status === 'online')

    return NextResponse.json({
      systemStatus,
      providers,
      summary: {
        total: providers.length,
        online: onlineCount,
        offline: offlineCount,
        degraded: degradedCount
      },
      failover: {
        chain: failoverChain,
        activeProvider: firstAvailable?.provider || 'None available',
        fallbacksAvailable: onlineCount - 1,
        allDown: onlineCount === 0
      },
      lastChecked: new Date().toISOString()
    })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Health check failed' },
      { status: 500 }
    )
  }
}
