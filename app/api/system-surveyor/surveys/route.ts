/**
 * Design-Rite Professional - Proprietary & Confidential
 * Copyright (c) 2025 Design-Rite Professional. All Rights Reserved.
 *
 * NOTICE: This code contains proprietary business logic and trade secrets.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 *
 * Last Modified: October 01, 2025
 */

import { NextRequest, NextResponse } from 'next/server';
import { getSurveys } from '@/lib/system-surveyor-api';
import { requireAuth } from '@/lib/api-auth';

/**
 * GET /api/system-surveyor/surveys?siteId={siteId}
 * Fetches surveys for a specific site
 */
export async function GET(request: NextRequest) {
  // Require authentication
  const auth = await requireAuth();
  if (auth.error) {
    return auth.error;
  }

  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const { searchParams } = new URL(request.url);
    const siteId = searchParams.get('siteId');

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    if (!siteId) {
      return NextResponse.json(
        { error: 'siteId parameter required' },
        { status: 400 }
      );
    }

    const surveys = await getSurveys(token, siteId);

    return NextResponse.json({
      success: true,
      surveys,
      count: surveys.length
    });

  } catch (error: any) {
    console.error('Surveys fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch surveys',
        details: error.message
      },
      { status: 500 }
    );
  }
}