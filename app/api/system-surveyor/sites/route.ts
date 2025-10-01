import { NextRequest, NextResponse } from 'next/server';
import { getSites } from '@/lib/system-surveyor-api';

/**
 * GET /api/system-surveyor/sites
 * Fetches all sites for authenticated user
 */
export async function GET(request: NextRequest) {
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