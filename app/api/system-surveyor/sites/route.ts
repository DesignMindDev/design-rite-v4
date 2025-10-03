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
import { getSites } from '@/lib/system-surveyor-api';
import { requireAuth } from '@/lib/api-auth';

/**
 * GET /api/system-surveyor/sites
 * Fetches all sites for authenticated user
 */
export async function GET(request: NextRequest) {
  // Require authentication
  const auth = await requireAuth();
  if (auth.error) {
    return auth.error;
  }

  try {
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'Authorization token required' },
        { status: 401 }
      );
    }

    const sites = await getSites(token);

    return NextResponse.json({
      success: true,
      sites,
      count: sites.length
    });

  } catch (error: any) {
    console.error('Sites fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch sites',
        details: error.message
      },
      { status: 500 }
    );
  }
}