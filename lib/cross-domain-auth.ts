/**
 * Cross-Domain Authentication Handler
 * Handles authentication across portal.design-rite.com and www.design-rite.com
 */

import { supabase } from './supabase';

export const crossDomainAuth = {
  /**
   * When redirecting FROM portal.design-rite.com TO www.design-rite.com
   * Include auth token in URL
   */
  async getAuthRedirectUrl(targetPath: string): Promise<string> {
    const session = await supabase.auth.getSession();

    if (!session.data.session) {
      return targetPath;
    }

    const accessToken = session.data.session.access_token;
    const refreshToken = session.data.session.refresh_token;

    // Create URL with auth params
    const url = new URL(targetPath, 'https://www.design-rite.com');
    url.searchParams.set('access_token', accessToken);
    url.searchParams.set('refresh_token', refreshToken);
    url.searchParams.set('auth_source', 'portal');

    return url.toString();
  },

  /**
   * When landing ON www.design-rite.com FROM portal
   * Extract auth tokens from URL and establish session
   */
  async handleAuthRedirect(): Promise<boolean> {
    if (typeof window === 'undefined') return false;

    const params = new URL(window.location.href).searchParams;
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const authSource = params.get('auth_source');

    // Only process if we have tokens from portal
    if (!accessToken || !refreshToken || authSource !== 'portal') {
      return false;
    }

    try {
      // Set the session using the tokens
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      });

      if (error) {
        console.error('[Cross-Domain Auth] Failed to set session:', error);
        return false;
      }

      if (data.session) {
        console.log('[Cross-Domain Auth] Session established from portal');

        // Clean up URL parameters
        const cleanUrl = new URL(window.location.href);
        cleanUrl.searchParams.delete('access_token');
        cleanUrl.searchParams.delete('refresh_token');
        cleanUrl.searchParams.delete('auth_source');

        // Replace URL without reloading
        window.history.replaceState({}, '', cleanUrl.toString());

        return true;
      }

      return false;
    } catch (error) {
      console.error('[Cross-Domain Auth] Error:', error);
      return false;
    }
  },

  /**
   * Check if user has valid session (works on any subdomain)
   */
  async hasValidSession(): Promise<boolean> {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  },

  /**
   * Get current user (works on any subdomain)
   */
  async getCurrentUser() {
    const { data } = await supabase.auth.getUser();
    return data.user;
  }
};
