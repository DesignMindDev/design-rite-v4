import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Only create admin client if service key is available (server-side)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey)
  : null

// Auth helper functions for Design-Rite
export const authHelpers = {
  // Sign up with email/password and company info
  async signUp(email: string, password: string, company: string) {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company,
          plan: 'trial',
          trial_expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        }
      }
    })
  },

  // Sign in with email/password
  async signIn(email: string, password: string) {
    return await supabase.auth.signInWithPassword({
      email,
      password
    })
  },

  // Sign in with magic link (email only) - perfect for your current flow
  async signInWithMagicLink(email: string, company: string) {
    // Simple approach: Let Supabase use its configured Site URL
    const getRedirectUrl = () => {
      // Use production URL directly - let Supabase dashboard config handle the rest
      return 'https://design-rite-v3.onrender.com/estimate-options'
    }

    const redirectUrl = getRedirectUrl()

    console.log('[Auth Debug] Magic link redirect URL:', redirectUrl)

    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            company,
            plan: 'trial',
            trial_expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        }
      })

      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('[Auth Error]:', error)
      return { data: null, error }
    }
  },

  // Sign in with OAuth providers
  async signInWithProvider(provider: 'google' | 'github' | 'linkedin') {
    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/estimate-options`
      }
    })
  },

  // Sign out
  async signOut() {
    return await supabase.auth.signOut()
  },

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
