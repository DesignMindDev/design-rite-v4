/**
 * Design-Rite Professional - Proprietary & Confidential
 * Copyright (c) 2025 Design-Rite Professional. All Rights Reserved.
 *
 * NOTICE: This code contains proprietary business logic and trade secrets.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * Patent Pending - Security scenario algorithms and assessment systems.
 *
 * Last Modified: October 01, 2025
 */

import { NextRequest, NextResponse } from 'next/server';
import { securityScenarios, getScenarioById } from '@/lib/scenario-library';
import { scenarioApiLimiter, getClientIp, createRateLimitResponse } from '@/lib/rate-limiter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/scenarios
 *
 * Returns security scenarios (metadata only, not full business logic)
 * Full scenario processing happens server-side only
 * RATE LIMITED: 30 requests per minute per IP (read-only, more permissive)
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting protection (more permissive for read-only data)
    const clientIp = getClientIp(request);
    const rateLimitResult = scenarioApiLimiter.check(30, clientIp); // 30 requests per minute

    if (!rateLimitResult.success) {
      console.warn(`[Scenarios API] Rate limit exceeded for IP: ${clientIp}`);
      return createRateLimitResponse(rateLimitResult);
    }

    const { searchParams } = new URL(request.url);
    const scenarioId = searchParams.get('id');

    if (scenarioId) {
      // Return specific scenario
      const scenario = getScenarioById(scenarioId);

      if (!scenario) {
        return NextResponse.json(
          { error: 'Scenario not found' },
          { status: 404 }
        );
      }

      const response = NextResponse.json({
        success: true,
        scenario
      });

      // Include rate limit headers
      response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
      response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
      response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.reset).toISOString());

      return response;
    }

    // Return all scenarios (metadata only)
    const response = NextResponse.json({
      success: true,
      scenarios: securityScenarios
    });

    // Include rate limit headers
    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.reset).toISOString());

    return response;

  } catch (error) {
    console.error('[Scenarios API] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch scenarios',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
