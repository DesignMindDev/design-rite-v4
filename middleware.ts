/**
 * Next.js Middleware for route protection and authentication
 * Protects admin routes and enforces role-based access control
 * ROLE-BASED AUTH SYSTEM - Updated 2025-10-14
 * - Pure role-based access (no domain restrictions)
 * - Super admin controls all access via Supabase user_roles
 * - Supports employees, contractors, and partners
 */

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const path = req.nextUrl.pathname;

  // Allow access to login page and session sync endpoint
  if (path.startsWith('/login') || path.startsWith('/api/admin/session-sync')) {
    return res;
  }

  // Protect all /admin routes
  if (path.startsWith('/admin')) {
    // CRITICAL: Check for session transfer flag in query params
    // Portal adds ?transfer=true when sending session via URL hash
    const isSessionTransfer = req.nextUrl.searchParams.get('transfer') === 'true';

    // If session transfer in progress, skip auth check and let page handle it
    if (isSessionTransfer) {
      console.log('[Middleware] Session transfer detected, allowing page load');
      return res;
    }

    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }

    // Get user role from Supabase
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    const role = roleData?.role || 'guest';

    // =========================================
    // ROLE-BASED ACCESS CONTROL
    // =========================================
    // Access granted based on role assigned by super admin
    // No domain restrictions - super admin controls all access

    // Super admin routes (only super_admin)
    if (path.startsWith('/admin/super') && role !== 'super_admin') {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // Team admin routes (super_admin or admin)
    if (path.startsWith('/admin/team') && !['super_admin', 'admin'].includes(role)) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }

    // User management (super_admin or admin)
    if (path.startsWith('/admin/users') && !['super_admin', 'admin'].includes(role)) {
      return NextResponse.redirect(new URL('/admin', req.url));
    }
  }

  // Protect API routes that require authentication (except session-sync)
  if (path.startsWith('/api/admin') && !path.startsWith('/api/admin/session-sync')) {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return new NextResponse(
        JSON.stringify({ error: 'Unauthorized', message: 'Authentication required' }),
        { status: 401, headers: { 'content-type': 'application/json' } }
      );
    }
  }

  return res;
}

// Configure which routes should be protected
export const config = {
  matcher: [
    // Admin pages
    '/admin/:path*',
    // Admin API routes
    '/api/admin/:path*',
    // Exclude static files and API auth routes
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
