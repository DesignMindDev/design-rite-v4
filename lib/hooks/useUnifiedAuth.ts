/**
 * Unified Auth Hook
 * Uses Supabase Auth with Design-Rite permission checking
 * Replaces Document AI's useAuth hook with unified schema support
 */

import { useEffect, useState, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session } from '@supabase/supabase-js';

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
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          full_name,
          company,
          phone,
          subscription_tier,
          subscription_status,
          stripe_customer_id
        `)
        .eq('id', userId)
        .single();

      if (error) throw error;

      // Fetch role from user_roles table
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

      setProfile({ ...data, role: roleData?.role || 'user' });
    } catch (error) {
      console.error('Error fetching profile:', error);
      // Set default profile if fetch fails
      setProfile({
        role: 'user',
        subscription_tier: 'base',
        subscription_status: 'inactive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return useMemo(() => {
    const isAuthenticated = !!session?.user && !!profile;

    // Not authenticated - return empty state
    if (!isAuthenticated || !session?.user || !profile) {
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

    // Extract user data
    const role = (profile.role || 'guest') as UnifiedAuthUser['role'];
    const subscriptionTier = (profile.subscription_tier || 'base') as UnifiedAuthUser['subscriptionTier'];
    const subscriptionStatus = (profile.subscription_status || 'inactive') as UnifiedAuthUser['subscriptionStatus'];

    const user: UnifiedAuthUser = {
      id: session.user.id,
      email: session.user.email!,
      name: profile.full_name,
      role,
      subscriptionTier,
      subscriptionStatus,
      company: profile.company,
      stripeCustomerId: profile.stripe_customer_id
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
  }, [session, profile, isLoading]);
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
 * import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
 *
 * const auth = useUnifiedAuth();
 * const { user, session, isLoading } = auth;
 * const supabase = createClientComponentClient();
 *
 * // Sign in/out handled by Supabase
 * await supabase.auth.signInWithPassword({ email, password });
 * await supabase.auth.signOut();
 * ```
 *
 * Property Mapping:
 * - `loading` → `isLoading`
 * - `user.id` → `user.id` (same)
 * - `user.email` → `user.email` (same)
 * - NEW: `user.role` - User's role (super_admin, admin, manager, user, guest)
 * - NEW: `user.subscriptionTier` - Subscription tier (base, pro, enterprise)
 * - NEW: `isPro`, `isEnterprise`, `hasSubscription` - Subscription checks
 * - `signIn()` → `supabase.auth.signInWithPassword()`
 * - `signOut()` → `supabase.auth.signOut()`
 */
