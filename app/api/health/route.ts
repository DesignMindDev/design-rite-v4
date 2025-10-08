import { NextResponse } from 'next/server'

// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';


// Health check endpoint for Render deployment monitoring
export async function GET() {
  try {
    const healthData = {
      status: 'operational',
      timestamp: new Date().toISOString(),
      service: 'design-rite-v3',
      version: '3.1.0',
      features: {
        authentication: 'supabase',
        payments: 'stripe',
        database: 'supabase',
        ai: 'anthropic'
      },
      uptime: process.uptime(),
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
      },
      environment: {
        node: process.version,
        platform: process.platform
      }
    }

    return NextResponse.json(healthData, {
      status: 200,
      headers: {
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Health check failed:', error)

    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      },
      { status: 500 }
    )
  }
}
