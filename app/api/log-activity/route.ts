import { NextRequest, NextResponse } from 'next/server'

// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

import { logActivity } from '@/lib/activity-logger'

/**
 * API endpoint for logging user activities
 * POST /api/log-activity
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      user_id,
      action,
      resource_type,
      resource_id,
      details,
      success,
      error_message
    } = body

    // Validate required fields
    if (!action || typeof success !== 'boolean') {
      return NextResponse.json(
        { error: 'Missing required fields: action, success' },
        { status: 400 }
      )
    }

    // Extract IP and user agent from request
    const ip_address = request.headers.get('x-forwarded-for') ||
                       request.headers.get('x-real-ip') ||
                       request.ip ||
                       'unknown'

    const user_agent = request.headers.get('user-agent') || 'unknown'

    // Log the activity
    await logActivity({
      user_id: user_id || undefined,
      action,
      resource_type: resource_type || undefined,
      resource_id: resource_id || undefined,
      ip_address,
      user_agent,
      details: details || undefined,
      success,
      error_message: error_message || undefined
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in log-activity API:', error)
    return NextResponse.json(
      { error: 'Failed to log activity' },
      { status: 500 }
    )
  }
}
