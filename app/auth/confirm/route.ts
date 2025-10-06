import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null
  const next = searchParams.get('next')

  if (token_hash && type) {
    try {
      const { error, data } = await supabase.auth.verifyOtp({
        type,
        token_hash,
      })

      if (!error && data.user) {
        // Get user role to determine redirect
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .single()

        const role = roleData?.role || 'user'

        // Determine redirect based on role
        let redirectPath = next || '/dashboard'

        if (role === 'super_admin' || role === 'admin' || role === 'manager') {
          redirectPath = '/admin'
        } else {
          redirectPath = '/dashboard'
        }

        // Validate redirect destination
        const validRedirects = [
          '/estimate-options',
          '/dashboard',
          '/admin',
          '/app',
          '/account',
          '/'
        ]

        // Use custom redirect if valid, otherwise use role-based redirect
        if (next && validRedirects.includes(next)) {
          redirectPath = next
        }

        // Determine base URL
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
                       process.env.NEXT_PUBLIC_PRODUCTION_URL ||
                       origin

        // Handle production vs development
        const redirectUrl = baseUrl.includes('localhost')
          ? `${origin}${redirectPath}`
          : `${baseUrl}${redirectPath}`

        console.log('[Auth Success] User role:', role, '- Redirecting to:', redirectUrl)
        return NextResponse.redirect(redirectUrl)
      }

      console.error('[Auth Error] OTP verification failed:', error)
    } catch (err) {
      console.error('[Auth Error] Exception during verification:', err)
    }
  }

  // Redirect to error page on failure
  const errorUrl = `${origin}/auth/error?message=Invalid or expired link`
  return NextResponse.redirect(errorUrl)
}