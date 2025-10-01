import { NextRequest, NextResponse } from 'next/server';
import { getUserPermissions } from '@/lib/permission-checker';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId parameter' },
        { status: 400 }
      );
    }

    const permissions = await getUserPermissions(userId);

    if (!permissions) {
      return NextResponse.json(
        { error: 'User not found or permissions unavailable' },
        { status: 404 }
      );
    }

    return NextResponse.json({ permissions });
  } catch (error) {
    console.error('Get permissions error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
}
