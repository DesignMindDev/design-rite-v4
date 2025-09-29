'use client';

import { useState, useEffect } from 'react';
import { authHelpers, supabase } from '../../lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

export const useSupabaseAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    authHelpers.getCurrentSession().then((session) => {
      setSession(session);
      setUser(session?.user || null);
      setLoading(false);
    });

    // Get initial user
    authHelpers.getCurrentUser().then((user) => {
      setUser(user);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signInWithMagicLink = async (email: string, company: string) => {
    setLoading(true);
    try {
      const result = await authHelpers.signInWithMagicLink(email, company);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signInWithProvider = async (provider: 'google' | 'github' | 'linkedin') => {
    setLoading(true);
    try {
      const result = await authHelpers.signInWithProvider(provider);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const result = await authHelpers.signOut();
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user,
    isOnTrial: user ? authHelpers.isOnTrial(user) : false,
    userPlan: user ? authHelpers.getUserPlan(user) : 'trial',
    userCompany: user?.user_metadata?.company || '',
    signInWithMagicLink,
    signInWithProvider,
    signOut
  };
};