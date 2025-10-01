/**
 * Next.js Middleware for route protection and authentication
 * Protects admin routes and enforces role-based access control
 */

import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow access to login page
    if (path.startsWith('/admin/login')) {
      return NextResponse.next();
    }

    // Protect all /admin routes
    if (path.startsWith('/admin')) {
      if (!token) {
        // Redirect to login if not authenticated
        const loginUrl = new URL('/admin/login', req.url);
        loginUrl.searchParams.set('callbackUrl', path);
        return NextResponse.redirect(loginUrl);
      }

      // Role-based access control for specific admin pages
      const role = token.role as string;

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
      if (!token) {
        return new NextResponse(
          JSON.stringify({ error: 'Unauthorized', message: 'Authentication required' }),
          { status: 401, headers: { 'content-type': 'application/json' } }
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Allow all requests - we handle authorization in the middleware function
        return true;
      },
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

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
