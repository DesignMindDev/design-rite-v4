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

  // Sign in with magic link with smart redirect handling
  async signInWithMagicLink(email: string, company: string, redirectTo?: string) {
    // Smart redirect URL determination with comprehensive URL support
    const getRedirectUrl = (targetPath?: string) => {
      // Use configured app URL or fallback to production
      const baseDomain = process.env.NEXT_PUBLIC_APP_URL || 'https://www.design-rite.com'

      // Default to estimate-options if no specific redirect requested
      const defaultPath = '/estimate-options'
      const finalPath = targetPath || defaultPath

      // Ensure path starts with /
      const cleanPath = finalPath.startsWith('/') ? finalPath : `/${finalPath}`

      // Comprehensive allowed paths for all Design-Rite pages
      const allowedPaths = [
        // Core Authentication & Platform
        '/estimate-options',
        '/platform-access',
        '/dashboard',
        '/login',
        '/auth/error',

        // AI Platform & Assessment
        '/security-estimate',
        '/ai-assessment',
        '/ai-assistant',
        '/ai-discovery',
        '/ai-discovery-results',
        '/ai-security-assessment',
        '/ai-powered-analyst',

        // Subscription & Business
        '/pricing',
        '/upgrade',
        '/subscribe',
        '/waitlist',
        '/solutions',

        // Industry & Solutions
        '/integrators',
        '/enterprise',
        '/education',
        '/healthcare',
        '/consultants',

        // Compliance & Tools
        '/compliance',
        '/compliance/ferpa',
        '/compliance/hipaa',
        '/compliance/general-security',
        '/compliance-check',
        '/compliance-analyst',
        '/compliance-analysis',

        // Admin & Management
        '/admin',
        '/admin/ai-providers',
        '/admin/assessments',
        '/admin/user-activity',
        '/admin/session-debug',
        '/admin/ai-assistant',
        '/admin/chatbot',
        '/admin/careers',
        '/admin/harvester',
        '/admin/creative-studio',
        '/auth-debug',

        // Content & Support
        '/about',
        '/blog',
        '/careers',
        '/contact',
        '/docs',
        '/support',
        '/api',
        '/partners',
        '/watch-demo',

        // Additional Platform Features
        '/cost-estimator',
        '/enterprise-roi',
        '/pricing-intelligence',
        '/professional-proposals',
        '/project-management',
        '/white-label',
        '/nda'
      ]

      // Use allowed path or default for security
      const safePath = allowedPaths.includes(cleanPath) ? cleanPath : defaultPath

      return `${baseDomain}${safePath}`
    }

    const redirectUrl = getRedirectUrl(redirectTo)

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

  // Sign in with OAuth providers with smart redirect handling
  async signInWithProvider(provider: 'google' | 'github' | 'linkedin', redirectTo?: string) {
    // Use the same smart redirect logic for OAuth
    const getRedirectUrl = (targetPath?: string) => {
      // Use configured app URL or fallback to current origin
      const baseDomain = typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_APP_URL || 'https://www.design-rite.com')
      const defaultPath = '/estimate-options'
      const finalPath = targetPath || defaultPath
      const cleanPath = finalPath.startsWith('/') ? finalPath : `/${finalPath}`

      // Use same allowed paths as magic link for consistency
      const allowedPaths = [
        '/estimate-options', '/platform-access', '/dashboard', '/login', '/auth/error',
        '/security-estimate', '/ai-assessment', '/ai-assistant', '/ai-discovery', '/ai-discovery-results',
        '/pricing', '/upgrade', '/subscribe', '/solutions', '/integrators', '/enterprise',
        '/education', '/healthcare', '/compliance', '/admin', '/admin/ai-providers'
      ]

      const safePath = allowedPaths.includes(cleanPath) ? cleanPath : defaultPath
      return `${baseDomain}${safePath}`
    }

    return await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getRedirectUrl(redirectTo)
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
  },

  // Check if user exists in Supabase (server-side only)
  async checkUserExists(email: string) {
    try {
      const response = await fetch('/api/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      if (!response.ok) {
        throw new Error('Failed to check user')
      }

      return await response.json()
    } catch (error) {
      console.error('Error checking user existence:', error)
      return { exists: false, error: error.message }
    }
  },

  // Create a session-like experience for returning users
  async createGuestSession(email: string, company: string, userData?: any) {
    // This creates a "session-like" experience by storing user data locally
    // and updating their session without requiring email verification
    return {
      user: {
        id: userData?.id || `guest_${Date.now()}`,
        email,
        user_metadata: {
          company,
          plan: userData?.plan || 'trial',
          ...userData
        }
      },
      session: {
        access_token: 'guest_session',
        user: {
          id: userData?.id || `guest_${Date.now()}`,
          email,
          user_metadata: { company, ...userData }
        }
      }
    }
  }
}
