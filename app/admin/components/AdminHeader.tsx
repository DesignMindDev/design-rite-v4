'use client';

import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth';
import Link from 'next/link';
import { useState } from 'react';

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonUrl?: string;
}

/**
 * Reusable header component for admin pages
 * Shows user info, role badge, and logout button
 */
export default function AdminHeader({
  title,
  subtitle,
  showBackButton = true,
  backButtonUrl = '/admin'
}: AdminHeaderProps) {
  const auth = useSupabaseAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = '/admin/login';
  };

  const getRoleBadgeColor = (role?: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'admin':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'manager':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'user':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getRoleDisplayName = (role?: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin';
      case 'admin':
        return 'Admin';
      case 'manager':
        return 'Manager';
      case 'user':
        return 'User';
      default:
        return 'Guest';
    }
  };

  return (
    <div className="bg-[#1A1A1A] border-b border-purple-600/20 px-6 py-4">
      <div className="flex justify-between items-center">
        {/* Left side: Title and subtitle */}
        <div className="flex items-center gap-4">
          {showBackButton && (
            <Link
              href={backButtonUrl}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
          )}
          <div>
            <h1 className="text-2xl font-bold text-white">{title}</h1>
            {subtitle && <p className="text-gray-400 text-sm mt-1">{subtitle}</p>}
          </div>
        </div>

        {/* Right side: User info and logout */}
        <div className="flex items-center gap-4">
          {/* User menu dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 bg-[#0A0A0A] border border-purple-600/30 rounded-lg px-4 py-2 hover:border-purple-500/50 transition-colors"
            >
              {/* User avatar */}
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {auth.user?.fullName?.charAt(0).toUpperCase() || auth.user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>

              {/* User info */}
              <div className="text-left hidden md:block">
                <div className="text-white font-medium text-sm">
                  {auth.user?.fullName || auth.user?.email}
                </div>
                <div className={`text-xs px-2 py-0.5 rounded inline-block border ${getRoleBadgeColor(auth.user?.role)}`}>
                  {getRoleDisplayName(auth.user?.role)}
                </div>
              </div>

              {/* Dropdown arrow */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#1A1A1A] border border-purple-600/30 rounded-lg shadow-xl z-50">
                <div className="p-4 border-b border-purple-600/20">
                  <div className="text-white font-medium">{auth.user?.fullName}</div>
                  <div className="text-gray-400 text-sm">{auth.user?.email}</div>
                  {auth.user?.company && (
                    <div className="text-gray-500 text-xs mt-1">
                      Company: {auth.user.company}
                    </div>
                  )}
                </div>
                <div className="p-2">
                  <Link
                    href="/admin"
                    className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-purple-600/20 rounded transition-colors"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Admin Dashboard
                    </div>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      Logout
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
