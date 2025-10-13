'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Lock, Users } from 'lucide-react';

export default function TestAuthPage() {
  const handleSignInClick = () => {
    // Redirect to portal auth page (sign in or try free)
    const portalUrl = process.env.NODE_ENV === 'development'
      ? 'http://localhost:3001/auth?redirect=dashboard'
      : 'https://portal.design-rite.com/auth?redirect=dashboard';

    window.location.href = portalUrl;
  };

  return (
    <div className="min-h-screen dr-bg-charcoal dr-text-pearl">
      {/* Header */}
      <div className="bg-gray-800/40 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-white">Design-Rite</h1>
              <p className="text-gray-400 text-sm">Authentication Flow Test Page</p>
            </div>
            <Link
              href="/"
              className="text-purple-400 hover:text-purple-300 text-sm"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Test Authentication Flow
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            This page simulates the main marketing site's "Sign In / Try It Free" button
          </p>
          <p className="text-gray-400">
            Click the button below to be redirected to the portal authentication page
          </p>
        </div>

        {/* Test Authentication Button */}
        <div className="bg-gradient-to-br from-purple-900/40 via-blue-900/30 to-purple-900/40 rounded-2xl p-10 border border-purple-500/40 shadow-2xl mb-12">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-purple-600 mb-6">
              <Lock className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Get Started?
            </h3>
            <p className="text-gray-300 mb-8">
              Sign in to your account or start your free trial
            </p>
            <button
              onClick={handleSignInClick}
              className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-lg"
            >
              <Zap className="w-6 h-6" />
              Sign In / Try It Free
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Flow Explanation */}
        <div className="bg-gray-800/40 rounded-xl p-8 border border-gray-700/30">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            Authentication Flow
          </h3>
          <ol className="space-y-4 text-gray-300">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">1</span>
              <div>
                <strong className="text-white">Click "Sign In / Try It Free"</strong>
                <p className="text-sm text-gray-400">Button redirects to portal authentication page</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">2</span>
              <div>
                <strong className="text-white">Portal Authentication</strong>
                <p className="text-sm text-gray-400">User signs in or creates new account with trial</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">3</span>
              <div>
                <strong className="text-white">Redirect to Portal Dashboard</strong>
                <p className="text-sm text-gray-400">After auth, user lands on portal dashboard</p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-sm">4</span>
              <div>
                <strong className="text-white">Access Workspace</strong>
                <p className="text-sm text-gray-400">From portal dashboard, user can access workspace and tools</p>
              </div>
            </li>
          </ol>
        </div>

        {/* Environment Info */}
        <div className="mt-8 p-6 bg-blue-900/20 border border-blue-500/30 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-300 mb-2">Current Environment</h4>
          <div className="text-sm text-gray-300 space-y-1">
            <p><strong>Mode:</strong> {process.env.NODE_ENV === 'development' ? 'Development' : 'Production'}</p>
            <p><strong>Portal URL:</strong> {process.env.NODE_ENV === 'development' ? 'http://localhost:3001' : 'https://portal.design-rite.com'}</p>
            <p><strong>V4 Platform:</strong> {typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3002'}</p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <Link
            href="/workspace"
            className="p-4 bg-gray-800/60 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors text-center"
          >
            <p className="text-white font-semibold mb-1">View Workspace</p>
            <p className="text-gray-400 text-sm">See workspace page (no auth required)</p>
          </Link>
          <a
            href={process.env.NODE_ENV === 'development' ? 'http://localhost:3001/dashboard' : 'https://portal.design-rite.com/dashboard'}
            className="p-4 bg-gray-800/60 hover:bg-gray-800 border border-gray-700 rounded-lg transition-colors text-center"
          >
            <p className="text-white font-semibold mb-1">Portal Dashboard</p>
            <p className="text-gray-400 text-sm">Go directly to portal (requires auth)</p>
          </a>
        </div>
      </div>
    </div>
  );
}
