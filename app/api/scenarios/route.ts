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

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET /api/scenarios
 *
 * Returns security scenarios (metadata only, not full business logic)
 * Full scenario processing happens server-side only
 */
export async function GET(request: NextRequest) {
  try {
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

      return NextResponse.json({
        success: true,
        scenario
      });
    }

    // Return all scenarios (metadata only)
    return NextResponse.json({
      success: true,
      scenarios: securityScenarios
    });

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
