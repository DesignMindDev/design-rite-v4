import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    storageKey: 'design-rite-auth',
    flowType: 'pkce'
  },
  global: {
    headers: {
      'X-Client-Info': 'design-rite-web'
    }
  }
})

// Only create admin client if service key is available (server-side)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// Auth helper functions for Design-Rite V4
// V4 does NOT handle authentication - portal.design-rite.com handles all auth
// V4 only reads sessions transferred from portal
export const authHelpers = {
  // Get current user
  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  // Get current session
  async getCurrentSession() {
    const { data: { session } } = await supabase.auth.getSession()
    return session
  },

  // Set session from tokens passed via URL hash (from portal)
  async setSessionFromHash() {
    if (typeof window === 'undefined') return false

    const hash = window.location.hash
    if (!hash.startsWith('#auth=')) return false

    try {
      const authDataEncoded = hash.substring(6) // Remove '#auth='
      const authData = JSON.parse(decodeURIComponent(authDataEncoded))

      console.log('[V4 Auth] Setting session from portal tokens')

      const { data, error } = await supabase.auth.setSession({
        access_token: authData.access_token,
        refresh_token: authData.refresh_token
      })

      if (error) {
        console.error('[V4 Auth] Failed to set session:', error)
        return false
      }

      if (data.session) {
        console.log('[V4 Auth] Session established successfully')
        // Clean up URL hash
        window.history.replaceState(null, '', window.location.pathname)
        return true
      }

      return false
    } catch (e) {
      console.error('[V4 Auth] Error parsing auth data from hash:', e)
      return false
    }
  },

  // Sign out and redirect to portal
  async signOut() {
    await supabase.auth.signOut()

    // Redirect to portal after sign out
    const portalUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001/auth'
      : 'https://portal.design-rite.com/auth'

    if (typeof window !== 'undefined') {
      window.location.href = portalUrl
    }
  },

  // Check if user is on trial
  isOnTrial(user: any) {
    if (!user?.user_metadata?.trial_expires) return false
    return new Date(user.user_metadata.trial_expires) > new Date()
  },

  // Get user's plan
  getUserPlan(user: any) {
    return user?.user_metadata?.plan || 'trial'
  }
}
