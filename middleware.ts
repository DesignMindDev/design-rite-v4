/**
 * Next.js Middleware for route protection and authentication
 * Protects admin routes and enforces role-based access control
 * MIGRATED TO SUPABASE AUTH - 2025-10-03
 */

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const path = req.nextUrl.pathname;

  // Allow access to login page
  if (path.startsWith('/admin/login')) {
    return res;
  }

  // Protect all /admin routes
  if (path.startsWith('/admin')) {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      // Redirect to login if not authenticated
      const loginUrl = new URL('/admin/login', req.url);
      loginUrl.searchParams.set('callbackUrl', path);
      return NextResponse.redirect(loginUrl);
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', session.user.id)
      .single();

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', session.user.id)
      .single();

    const role = roleData?.role || 'guest';

    // Role-based access control for specific admin pages
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

  // Protect API routes that require authentication
  if (path.startsWith('/api/admin')) {
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
