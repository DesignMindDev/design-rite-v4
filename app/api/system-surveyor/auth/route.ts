// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

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
import { validateToken } from '@/lib/system-surveyor-api';

/**
 * POST /api/system-surveyor/auth
 * Validates System Surveyor API token
 */
export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token || typeof token !== 'string') {
      return NextResponse.json(
        { error: 'API token is required' },
        { status: 400 }
      );
    }

    // Validate token with System Surveyor API
    const isValid = await validateToken(token);

    if (!isValid) {
      return NextResponse.json(
        {
          error: 'Invalid API token. Please check your token and try again.',
          details: 'Token validation failed with System Surveyor API'
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'API token validated successfully'
    });

  } catch (error: any) {
    console.error('Auth error:', error);
    return NextResponse.json(
      {
        error: 'Failed to validate token',
        details: error.message
      },
      { status: 500 }
    );
  }
}