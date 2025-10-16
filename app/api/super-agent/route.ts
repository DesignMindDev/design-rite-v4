import { NextRequest, NextResponse } from 'next/server';

/**
 * Super Agent Orchestration API
 * Proxies requests to the Super Agent service (Port 9500)
 *
 * The Super Agent is a Claude 3.5 Sonnet orchestrator that manages:
 * - 12 specialized tools across 5 microservices
 * - Spatial Studio (Port 3020) - Floor plan analysis
 * - Creative Studio (Port 3030) - Content generation
 * - MCP Server (Port 8000) - Product intelligence
 * - Portal V2 (Port 3001) - Authentication
 * - Main Platform V4 (Port 3000) - This application
 */

const SUPER_AGENT_URL = process.env.SUPER_AGENT_URL || 'http://localhost:9500';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { task, context, tools } = body;

    // Validate required fields
    if (!task) {
      return NextResponse.json(
        { error: 'Task description is required' },
        { status: 400 }
      );
    }

    console.log('[Super Agent] Orchestrating task:', task);

    // Forward request to Super Agent service
    const response = await fetch(`${SUPER_AGENT_URL}/api/orchestrate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        task,
        context: context || {},
        tools: tools || [], // Specific tools to use, or empty for auto-selection
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Super Agent] Error response:', errorText);

      return NextResponse.json(
        {
          error: 'Super Agent service unavailable',
          details: errorText,
          status: response.status
        },
        { status: 502 }
      );
    }

    const result = await response.json();

    console.log('[Super Agent] Task completed:', result.status);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[Super Agent] Orchestration error:', error);

    // Check if Super Agent service is running
    if (error instanceof Error && error.message.includes('ECONNREFUSED')) {
      return NextResponse.json(
        {
          error: 'Super Agent service not running',
          message: 'Please start the Super Agent service on port 9500',
          details: 'Run: cd "C:\\Users\\dkozi\\Design-Rite Corp\\super-agent" && npm start'
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        error: 'Orchestration failed',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Health check endpoint
    const response = await fetch(`${SUPER_AGENT_URL}/health`, {
      method: 'GET',
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          status: 'unhealthy',
          message: 'Super Agent service not responding',
          superAgentUrl: SUPER_AGENT_URL
        },
        { status: 502 }
      );
    }

    const health = await response.json();

    return NextResponse.json({
      status: 'healthy',
      superAgent: health,
      services: {
        spatialStudio: 'http://localhost:3020',
        creativeStudio: 'http://localhost:3030',
        mcpServer: 'http://localhost:8000',
        portalV2: 'http://localhost:3001',
        mainPlatform: 'http://localhost:3000',
      }
    });
  } catch (error) {
    console.error('[Super Agent] Health check error:', error);

    return NextResponse.json(
      {
        status: 'unhealthy',
        error: 'Cannot connect to Super Agent service',
        message: 'Please ensure Super Agent is running on port 9500',
        superAgentUrl: SUPER_AGENT_URL
      },
      { status: 503 }
    );
  }
}
