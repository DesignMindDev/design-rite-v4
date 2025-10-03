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
import { getSurveyDetails, transformToAssessmentData } from '@/lib/system-surveyor-api';
import { requireAuth } from '@/lib/api-auth';

/**
 * POST /api/system-surveyor/import
 * Imports survey data and transforms it for Design-Rite
 */
export async function POST(request: NextRequest) {
  // Require authentication
  const auth = await requireAuth();
  if (auth.error) {
    return auth.error;
  }

  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');
    const { surveyId, site } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    if (!surveyId || !site) {
      return NextResponse.json(
        { error: 'surveyId and site data required' },
        { status: 400 }
      );
    }

    // Fetch complete survey details
    const survey = await getSurveyDetails(token, surveyId);

    // Transform to Design-Rite format
    const assessmentData = transformToAssessmentData(survey, site);

    return NextResponse.json({
      success: true,
      data: assessmentData
    });

  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json(
      {
        error: 'Failed to import survey',
        details: error.message
      },
      { status: 500 }
    );
  }
}