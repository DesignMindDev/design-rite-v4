/**
 * Design-Rite Professional - Proprietary & Confidential
 * Copyright (c) 2025 Design-Rite Professional. All Rights Reserved.
 *
 * NOTICE: This code contains proprietary business logic and trade secrets.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * Patent Pending - Quote generation algorithms and pricing systems.
 *
 * Last Modified: October 01, 2025
 */

import { NextRequest, NextResponse } from 'next/server';
import { QuoteGenerator } from '@/lib/quote-generator';
import { quoteGenerationLimiter, getClientIp, createRateLimitResponse } from '@/lib/rate-limiter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * POST /api/generate-quote
 *
 * Generates security system quote with proprietary pricing algorithms
 * PROPRIETARY: All pricing calculations happen server-side
 * RATE LIMITED: 10 requests per minute per IP to protect business logic
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting protection for proprietary quote generation
    const clientIp = getClientIp(request);
    const rateLimitResult = quoteGenerationLimiter.check(10, clientIp); // 10 requests per minute

    if (!rateLimitResult.success) {
      console.warn(`[Quote Generator] Rate limit exceeded for IP: ${clientIp}`);
      return createRateLimitResponse(rateLimitResult);
    }

    const body = await request.json();
    const { discoveryData, selectedScenario } = body;

    if (!discoveryData) {
      return NextResponse.json(
        { error: 'Discovery data is required' },
        { status: 400 }
      );
    }

    // PROPRIETARY QUOTE GENERATION LOGIC
    // All pricing algorithms and business rules executed server-side
    const quoteGenerator = new QuoteGenerator();
    const quote = quoteGenerator.generateQuote(discoveryData, selectedScenario);

    // Log for monitoring (don't expose sensitive pricing formulas)
    console.log(`[Quote Generator] Generated quote for facility type: ${discoveryData.facilityType || 'Unknown'}`);

    // Include rate limit headers in successful response
    const response = NextResponse.json({
      success: true,
      quote,
      generatedAt: new Date().toISOString()
    });

    response.headers.set('X-RateLimit-Limit', rateLimitResult.limit.toString());
    response.headers.set('X-RateLimit-Remaining', rateLimitResult.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(rateLimitResult.reset).toISOString());

    return response;

  } catch (error) {
    console.error('[Quote Generator] Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to generate quote',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
