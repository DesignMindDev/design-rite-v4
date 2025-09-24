/**
 * Shared authentication utilities for admin pages
 */

// Admin password from environment variables
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ProcessM@ker2025'

// Local storage key for authentication state
const AUTH_KEY = 'design-rite-admin-auth'

// Authentication state interface
export interface AuthState {
  isAuthenticated: boolean
  authenticatedAt: number
  expiresAt: number
}

// Session duration (24 hours)
const SESSION_DURATION = 24 * 60 * 60 * 1000

/**
 * Check if user is currently authenticated
 */
export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const authData = localStorage.getItem(AUTH_KEY)
    if (!authData) return false

    const auth: AuthState = JSON.parse(authData)

    // Check if session has expired
    if (Date.now() > auth.expiresAt) {
      localStorage.removeItem(AUTH_KEY)
      return false
    }

    return auth.isAuthenticated
  } catch {
    return false
  }
}

/**
 * Authenticate user with password
 */
export function authenticate(password: string): boolean {
  if (password === ADMIN_PASSWORD) {
    const authState: AuthState = {
      isAuthenticated: true,
      authenticatedAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_KEY, JSON.stringify(authState))
    }

    return true
  }

  return false
}

/**
 * Logout user
 */
export function logout(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY)
  }
}

/**
 * Get authentication state
 */
export function getAuthState(): AuthState | null {
  if (typeof window === 'undefined') return null

  try {
    const authData = localStorage.getItem(AUTH_KEY)
    if (!authData) return null

    const auth: AuthState = JSON.parse(authData)

    // Check if session has expired
    if (Date.now() > auth.expiresAt) {
      localStorage.removeItem(AUTH_KEY)
      return null
    }

    return auth
  } catch {
    return null
  }
}

/**
 * Extend session (refresh expiration)
 */
export function extendSession(): void {
  if (typeof window === 'undefined') return

  try {
    const authData = localStorage.getItem(AUTH_KEY)
    if (!authData) return

    const auth: AuthState = JSON.parse(authData)

    if (auth.isAuthenticated && Date.now() < auth.expiresAt) {
      auth.expiresAt = Date.now() + SESSION_DURATION
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth))
    }
  } catch {
    // Ignore errors
  }
}