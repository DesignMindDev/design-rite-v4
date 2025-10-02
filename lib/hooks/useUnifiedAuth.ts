/**
 * Unified Auth Hook
 * Combines Next-Auth session with Design-Rite permission checking
 * Replaces Document AI's useAuth hook with unified schema support
 */

import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export interface UnifiedAuthUser {
  id: string;
  email: string;
  name: string | null;
  role: 'super_admin' | 'admin' | 'manager' | 'user' | 'guest';
  subscriptionTier: 'base' | 'pro' | 'enterprise';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'past_due';
  company?: string;
  stripeCustomerId?: string;
}

export interface UnifiedAuthState {
  user: UnifiedAuthUser | null;
  session: any | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Role checks
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isManager: boolean;
  isUser: boolean;
  isGuest: boolean;

  // Subscription checks
  hasSubscription: boolean;
  isPro: boolean;
  isEnterprise: boolean;
  isSubscriptionActive: boolean;

  // Convenience methods
  hasRole: (role: 'super_admin' | 'admin' | 'manager' | 'user' | 'guest') => boolean;
  hasTier: (tier: 'base' | 'pro' | 'enterprise') => boolean;
}

/**
 * Unified Auth Hook
 *
 * Usage:
 * ```typescript
 * const auth = useUnifiedAuth();
 *
 * if (auth.isLoading) return <Spinner />;
 * if (!auth.isAuthenticated) return <LoginPage />;
 *
 * if (auth.isPro) {
 *   // Show pro features
 * }
 *
 * if (auth.hasRole('admin')) {
 *   // Show admin panel
 * }
 * ```
 */
export function useUnifiedAuth(): UnifiedAuthState {
  const { data: session, status } = useSession();

  return useMemo(() => {
    const isLoading = status === 'loading';
    const isAuthenticated = status === 'authenticated' && !!session?.user;

    // Not authenticated - return empty state
    if (!isAuthenticated || !session?.user) {
      return {
        user: null,
        session: null,
        isAuthenticated: false,
        isLoading,
        isSuperAdmin: false,
        isAdmin: false,
        isManager: false,
        isUser: false,
        isGuest: false,
        hasSubscription: false,
        isPro: false,
        isEnterprise: false,
        isSubscriptionActive: false,
        hasRole: () => false,
        hasTier: () => false
      };
    }

    // Extract user data from session
    const sessionUser = session.user as any;
    const role = (sessionUser.role || 'guest') as UnifiedAuthUser['role'];
    const subscriptionTier = (sessionUser.subscriptionTier || 'base') as UnifiedAuthUser['tier'];
    const subscriptionStatus = (sessionUser.subscriptionStatus || 'inactive') as UnifiedAuthUser['subscriptionStatus'];

    const user: UnifiedAuthUser = {
      id: sessionUser.id,
      email: sessionUser.email!,
      name: sessionUser.name,
      role,
      subscriptionTier,
      subscriptionStatus,
      company: sessionUser.company,
      stripeCustomerId: sessionUser.stripeCustomerId
    };

    // Role hierarchy
    const roleHierarchy = {
      super_admin: 5,
      admin: 4,
      manager: 3,
      user: 2,
      guest: 1
    };

    const userRoleLevel = roleHierarchy[role];

    // Tier hierarchy
    const tierHierarchy = {
      enterprise: 3,
      pro: 2,
      base: 1
    };

    const userTierLevel = tierHierarchy[subscriptionTier];

    // Role checks
    const isSuperAdmin = role === 'super_admin';
    const isAdmin = userRoleLevel >= roleHierarchy.admin;
    const isManager = userRoleLevel >= roleHierarchy.manager;
    const isUser = userRoleLevel >= roleHierarchy.user;
    const isGuest = role === 'guest';

    // Subscription checks
    const isSubscriptionActive = subscriptionStatus === 'active' || isSuperAdmin || isAdmin;
    const hasSubscription = subscriptionTier !== 'base' || isSuperAdmin || isAdmin;
    const isPro = userTierLevel >= tierHierarchy.pro || isSuperAdmin || isAdmin;
    const isEnterprise = subscriptionTier === 'enterprise' || isSuperAdmin;

    // Helper functions
    const hasRole = (requiredRole: UnifiedAuthUser['role']): boolean => {
      return userRoleLevel >= roleHierarchy[requiredRole];
    };

    const hasTier = (requiredTier: UnifiedAuthUser['tier']): boolean => {
      if (isSuperAdmin || isAdmin) return true; // Admins have all tiers
      return userTierLevel >= tierHierarchy[requiredTier];
    };

    return {
      user,
      session,
      isAuthenticated: true,
      isLoading: false,
      isSuperAdmin,
      isAdmin,
      isManager,
      isUser,
      isGuest,
      hasSubscription,
      isPro,
      isEnterprise,
      isSubscriptionActive,
      hasRole,
      hasTier
    };
  }, [session, status]);
}

/**
 * Migration Guide from Document AI useAuth
 *
 * BEFORE (Document AI):
 * ```typescript
 * import { useAuth } from '@/hooks/useAuth';
 * const { user, session, loading, signIn, signUp, signOut } = useAuth();
 * ```
 *
 * AFTER (Unified):
 * ```typescript
 * import { useUnifiedAuth } from '@/lib/hooks/useUnifiedAuth';
 * import { signIn, signOut } from 'next-auth/react';
 *
 * const auth = useUnifiedAuth();
 * const { user, session, isLoading } = auth;
 *
 * // Sign in/out handled by Next-Auth
 * await signIn('credentials', { email, password });
 * await signOut();
 * ```
 *
 * Property Mapping:
 * - `loading` → `isLoading`
 * - `user.id` → `user.id` (same)
 * - `user.email` → `user.email` (same)
 * - NEW: `user.role` - User's role (super_admin, admin, manager, user, guest)
 * - NEW: `user.subscriptionTier` - Subscription tier (base, pro, enterprise)
 * - NEW: `isPro`, `isEnterprise`, `hasSubscription` - Subscription checks
 * - `signIn()` → `import { signIn } from 'next-auth/react'`
 * - `signOut()` → `import { signOut } from 'next-auth/react'`
 */
