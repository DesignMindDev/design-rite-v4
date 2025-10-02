/**
 * Supabase Auth Hook for Document AI
 * Replaces Next-Auth based useUnifiedAuth
 * Uses Supabase Auth with unified profiles schema
 *
 * Migration Date: 2025-10-02
 * Based on: Dev team's Supabase Auth migration
 */

import { useEffect, useState, useMemo } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Session, User } from '@supabase/supabase-js';

export interface SupabaseAuthUser {
  id: string;
  email: string;
  fullName: string | null;
  company: string | null;
  role: 'super_admin' | 'admin' | 'manager' | 'user' | 'guest';
  subscriptionTier: 'starter' | 'professional' | 'enterprise';
  subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'past_due' | 'trialing';
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface SupabaseAuthState {
  user: SupabaseAuthUser | null;
  session: Session | null;
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
  isStarter: boolean;
  isProfessional: boolean;
  isEnterprise: boolean;
  isSubscriptionActive: boolean;
  isOnTrial: boolean;

  // Methods
  hasRole: (role: SupabaseAuthUser['role']) => boolean;
  hasTier: (tier: SupabaseAuthUser['subscriptionTier']) => boolean;
  signOut: () => Promise<void>;
}

/**
 * Supabase Auth Hook
 *
 * Usage:
 * ```typescript
 * import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth';
 *
 * const auth = useSupabaseAuth();
 *
 * if (auth.isLoading) return <Spinner />;
 * if (!auth.isAuthenticated) return <LoginRequired />;
 *
 * // Check subscription
 * if (auth.isProfessional) {
 *   // Show pro features
 * }
 *
 * // Check role
 * if (auth.hasRole('admin')) {
 *   // Show admin panel
 * }
 *
 * // Sign out
 * await auth.signOut();
 * ```
 */
export function useSupabaseAuth(): SupabaseAuthState {
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
          avatar_url,
          stripe_customer_id,
          subscription_tier,
          subscription_status,
          stripe_subscription_id
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
        subscription_tier: 'starter',
        subscription_status: 'inactive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
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
        isStarter: false,
        isProfessional: false,
        isEnterprise: false,
        isSubscriptionActive: false,
        isOnTrial: false,
        hasRole: () => false,
        hasTier: () => false,
        signOut
      };
    }

    // Extract user data
    const role = (profile.role || 'user') as SupabaseAuthUser['role'];
    const subscriptionTier = (profile.subscription_tier || 'starter') as SupabaseAuthUser['subscriptionTier'];
    const subscriptionStatus = (profile.subscription_status || 'inactive') as SupabaseAuthUser['subscriptionStatus'];

    const user: SupabaseAuthUser = {
      id: session.user.id,
      email: session.user.email!,
      fullName: profile.full_name,
      company: profile.company,
      role,
      subscriptionTier,
      subscriptionStatus,
      stripeCustomerId: profile.stripe_customer_id,
      stripeSubscriptionId: profile.stripe_subscription_id,
      phone: profile.phone,
      avatarUrl: profile.avatar_url
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

    // Tier hierarchy (matches published pricing: Starter $49, Professional $149, Enterprise $499)
    const tierHierarchy = {
      enterprise: 3,
      professional: 2,
      starter: 1,
      // Legacy tier names for backward compatibility
      pro: 2,
      base: 1
    } as Record<string, number>;

    const userTierLevel = tierHierarchy[subscriptionTier];

    // Role checks
    const isSuperAdmin = role === 'super_admin';
    const isAdmin = userRoleLevel >= roleHierarchy.admin;
    const isManager = userRoleLevel >= roleHierarchy.manager;
    const isUser = userRoleLevel >= roleHierarchy.user;
    const isGuest = role === 'guest';

    // Subscription checks
    const isSubscriptionActive =
      subscriptionStatus === 'active' ||
      subscriptionStatus === 'trialing' ||
      isSuperAdmin ||
      isAdmin;

    const hasSubscription = subscriptionTier !== 'starter' || isSuperAdmin || isAdmin;
    const isOnTrial = subscriptionStatus === 'trialing';
    const isStarter = subscriptionTier === 'starter' && !isSuperAdmin && !isAdmin;
    const isProfessional = userTierLevel >= tierHierarchy.professional || isSuperAdmin || isAdmin;
    const isEnterprise = subscriptionTier === 'enterprise' || isSuperAdmin;

    // Helper functions
    const hasRole = (requiredRole: SupabaseAuthUser['role']): boolean => {
      return userRoleLevel >= roleHierarchy[requiredRole];
    };

    const hasTier = (requiredTier: SupabaseAuthUser['subscriptionTier']): boolean => {
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
      isStarter,
      isProfessional,
      isEnterprise,
      isSubscriptionActive,
      isOnTrial,
      hasRole,
      hasTier,
      signOut
    };
  }, [session, profile, isLoading]);
}

/**
 * Migration Guide from useUnifiedAuth (Next-Auth) to useSupabaseAuth
 *
 * CHANGES:
 *
 * 1. Import Change:
 *    OLD: import { useUnifiedAuth } from '@/lib/hooks/useUnifiedAuth';
 *    NEW: import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth';
 *
 * 2. Hook Usage:
 *    OLD: const auth = useUnifiedAuth();
 *    NEW: const auth = useSupabaseAuth();
 *
 * 3. User Properties:
 *    - user.name → user.fullName
 *    - NEW: user.avatarUrl (profile picture)
 *    - NEW: user.phone (phone number)
 *
 * 4. Subscription Tiers Renamed:
 *    OLD: 'base', 'pro', 'enterprise'
 *    NEW: 'starter', 'professional', 'enterprise'
 *
 * 5. Subscription Checks:
 *    OLD: auth.isPro
 *    NEW: auth.isProfessional
 *    NEW: auth.isStarter (replaces checking for 'base')
 *    NEW: auth.isOnTrial (checks if trialing)
 *
 * 6. Sign Out:
 *    OLD: import { signOut } from 'next-auth/react'; signOut();
 *    NEW: await auth.signOut();
 *
 * 7. Database Schema:
 *    - Uses 'profiles' table (not 'users')
 *    - Role stored in 'user_roles' table
 *    - Subscription fields in 'profiles'
 *
 * Example Migration:
 *
 * BEFORE:
 * ```typescript
 * import { useUnifiedAuth } from '@/lib/hooks/useUnifiedAuth';
 * import { signOut } from 'next-auth/react';
 *
 * const auth = useUnifiedAuth();
 * if (auth.isPro) {
 *   // Show pro features
 * }
 * await signOut();
 * ```
 *
 * AFTER:
 * ```typescript
 * import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth';
 *
 * const auth = useSupabaseAuth();
 * if (auth.isProfessional) {
 *   // Show pro features
 * }
 * await auth.signOut();
 * ```
 */
