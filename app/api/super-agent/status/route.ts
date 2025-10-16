import { NextRequest, NextResponse } from 'next/server';

/**
 * Super Agent Status API
 * Returns detailed status of all microservices
 */

const SERVICES = [
  { name: 'Super Agent', url: process.env.SUPER_AGENT_URL || 'http://localhost:9500', healthPath: '/health' },
  { name: 'Spatial Studio', url: 'http://localhost:3020', healthPath: '/health' },
  { name: 'Creative Studio', url: 'http://localhost:3030', healthPath: '/health' },
  { name: 'MCP Server', url: 'http://localhost:8000', healthPath: '/health' },
  { name: 'Portal V2', url: 'http://localhost:3001', healthPath: '/api/health' },
];

async function checkService(service: { name: string; url: string; healthPath: string }) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const startTime = Date.now();
    const response = await fetch(`${service.url}${service.healthPath}`, {
      method: 'GET',
      signal: controller.signal,
    });
    const responseTime = Date.now() - startTime;

    clearTimeout(timeoutId);

    const isHealthy = response.ok;
    let details = null;

    try {
      details = await response.json();
    } catch {
      // If response is not JSON, just use status
      details = { status: response.statusText };
    }

    return {
      name: service.name,
      url: service.url,
      status: isHealthy ? 'healthy' : 'unhealthy',
      responseTime: `${responseTime}ms`,
      details,
    };
  } catch (error) {
    return {
      name: service.name,
      url: service.url,
      status: 'offline',
      error: error instanceof Error ? error.message : 'Connection failed',
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log('[Super Agent Status] Checking all services...');

    // Check all services in parallel
    const statusChecks = await Promise.all(
      SERVICES.map(service => checkService(service))
    );

    const allHealthy = statusChecks.every(s => s.status === 'healthy');
    const onlineCount = statusChecks.filter(s => s.status === 'healthy').length;
    const totalCount = statusChecks.length;

    const response = {
      timestamp: new Date().toISOString(),
      overall: allHealthy ? 'healthy' : 'degraded',
      summary: `${onlineCount}/${totalCount} services online`,
      services: statusChecks,
    };

    console.log('[Super Agent Status] Check complete:', response.summary);

    return NextResponse.json(response);
  } catch (error) {
    console.error('[Super Agent Status] Error checking services:', error);

    return NextResponse.json(
      {
        timestamp: new Date().toISOString(),
        overall: 'error',
        error: 'Failed to check service status',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
