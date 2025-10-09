/**
 * Session Sync Endpoint
 * Receives session tokens from portal and sets them in the main platform
 * Then redirects to admin page
 */

import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const authDataString = searchParams.get('auth')

  if (!authDataString) {
    console.error('[Session Sync] No auth data provided')
    return NextResponse.redirect(new URL('/login?error=no_auth_data', request.url))
  }

  try {
    const authData = JSON.parse(decodeURIComponent(authDataString))
    const { access_token, refresh_token } = authData

    if (!access_token || !refresh_token) {
      console.error('[Session Sync] Missing tokens in auth data')
      return NextResponse.redirect(new URL('/login?error=invalid_auth_data', request.url))
    }

    // Create supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Set the session
    const { error } = await supabase.auth.setSession({
      access_token,
      refresh_token
    })

    if (error) {
      console.error('[Session Sync] Error setting session:', error)
      return NextResponse.redirect(new URL('/login?error=session_failed', request.url))
    }

    console.log('[Session Sync] Session transferred successfully from portal')

    // Redirect to admin page
    return NextResponse.redirect(new URL('/admin', request.url))
  } catch (error) {
    console.error('[Session Sync] Parse error:', error)
    return NextResponse.redirect(new URL('/login?error=parse_failed', request.url))
  }
}
