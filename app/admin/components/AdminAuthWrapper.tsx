'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';

interface AdminAuthWrapperProps {
  children: ReactNode;
  requiredRole?: 'super_admin' | 'admin' | 'manager' | 'user';
  loadingMessage?: string;
}

/**
 * Wrapper component for admin pages requiring authentication
 * Redirects to login if not authenticated or insufficient role
 */
export default function AdminAuthWrapper({
  children,
  requiredRole,
  loadingMessage = 'Loading...'
}: AdminAuthWrapperProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    // Not authenticated - redirect to login
    if (status === 'unauthenticated') {
      const currentPath = window.location.pathname;
      router.push(`/admin/login?callbackUrl=${encodeURIComponent(currentPath)}`);
      return;
    }

    // Check role requirement if specified
    if (requiredRole && session?.user?.role) {
      const roleHierarchy: Record<string, number> = {
        super_admin: 5,
        admin: 4,
        manager: 3,
        user: 2,
        guest: 1
      };

      const userRoleLevel = roleHierarchy[session.user.role] || 0;
      const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

      if (userRoleLevel < requiredRoleLevel) {
        // Insufficient permission - redirect to main admin
        router.push('/admin');
        return;
      }
    }
  }, [status, session, requiredRole, router]);

  // Show loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <div className="text-white text-lg">{loadingMessage}</div>
        </div>
      </div>
    );
  }

  // Not authenticated or insufficient role - show nothing (redirecting)
  if (status === 'unauthenticated') {
    return null;
  }

  // Check role requirement
  if (requiredRole && session?.user?.role) {
    const roleHierarchy: Record<string, number> = {
      super_admin: 5,
      admin: 4,
      manager: 3,
      user: 2,
      guest: 1
    };

    const userRoleLevel = roleHierarchy[session.user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return null; // Redirecting
    }
  }

  // Authenticated and authorized - render children
  return <>{children}</>;
}
