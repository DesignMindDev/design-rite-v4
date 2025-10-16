import { NextRequest, NextResponse } from 'next/server';

/**
 * Super Agent Tools API
 * Returns list of available tools across all microservices
 */

const SUPER_AGENT_URL = process.env.SUPER_AGENT_URL || 'http://localhost:9500';

export async function GET(request: NextRequest) {
  try {
    console.log('[Super Agent Tools] Fetching available tools...');

    // Fetch tools from Super Agent service
    const response = await fetch(`${SUPER_AGENT_URL}/api/tools`, {
      method: 'GET',
    });

    if (!response.ok) {
      // Return hardcoded tools if Super Agent is offline
      console.warn('[Super Agent Tools] Service offline, returning static list');

      return NextResponse.json({
        status: 'static',
        message: 'Super Agent offline - showing static tool list',
        tools: [
          {
            name: 'spatial_analysis',
            description: 'Analyze floor plans and generate camera placement recommendations',
            service: 'Spatial Studio',
            port: 3020,
          },
          {
            name: 'creative_generation',
            description: 'Generate marketing content, proposals, and creative assets',
            service: 'Creative Studio',
            port: 3030,
          },
          {
            name: 'product_search',
            description: 'Search security product database and get pricing',
            service: 'MCP Server',
            port: 8000,
          },
          {
            name: 'harvester',
            description: 'Scrape and harvest product data from manufacturer websites',
            service: 'MCP Server',
            port: 8000,
          },
          {
            name: 'pricing_intelligence',
            description: 'Get competitive pricing analysis and recommendations',
            service: 'MCP Server',
            port: 8000,
          },
          {
            name: 'compliance_check',
            description: 'Verify compliance with FERPA, HIPAA, CJIS regulations',
            service: 'Main Platform',
            port: 3000,
          },
          {
            name: 'quote_generation',
            description: 'Generate professional quotes and BOMs',
            service: 'Main Platform',
            port: 3000,
          },
          {
            name: 'proposal_creation',
            description: 'Create comprehensive security proposals',
            service: 'Main Platform',
            port: 3000,
          },
          {
            name: 'ai_discovery',
            description: 'Conduct AI-powered security assessment discovery',
            service: 'Main Platform',
            port: 3000,
          },
          {
            name: 'system_surveyor_import',
            description: 'Import and process System Surveyor field data',
            service: 'Main Platform',
            port: 3000,
          },
          {
            name: 'user_management',
            description: 'Manage user accounts and authentication',
            service: 'Portal V2',
            port: 3001,
          },
          {
            name: 'subscription_management',
            description: 'Handle subscription and billing operations',
            service: 'Portal V2',
            port: 3001,
          },
        ],
      });
    }

    const tools = await response.json();

    console.log('[Super Agent Tools] Retrieved tools:', tools.length || tools.tools?.length);

    return NextResponse.json(tools);
  } catch (error) {
    console.error('[Super Agent Tools] Error fetching tools:', error);

    // Return static tool list on error
    return NextResponse.json(
      {
        status: 'error',
        message: 'Cannot connect to Super Agent service',
        error: error instanceof Error ? error.message : 'Unknown error',
        tools: [], // Empty tools list to indicate service unavailable
      },
      { status: 503 }
    );
  }
}
