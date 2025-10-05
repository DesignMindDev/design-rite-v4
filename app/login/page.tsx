'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');
  const supabase = createClientComponentClient();

  // Check if already logged in
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Get user role to determine redirect
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', session.user.id)
          .single();

        const role = roleData?.role || 'user';

        // Redirect based on role or callback URL
        if (callbackUrl) {
          router.push(callbackUrl);
        } else if (role === 'super_admin' || role === 'admin' || role === 'manager') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      }
    };
    checkSession();
  }, [supabase, router, callbackUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (signInError) {
        setError(signInError.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        setError('Login failed. Please try again.');
        setLoading(false);
        return;
      }

      // Get user role to determine redirect
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      const role = roleData?.role || 'user';

      // Redirect based on role or callback URL
      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (role === 'super_admin' || role === 'admin' || role === 'manager') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }

      router.refresh();
    } catch (err) {
      console.error('Login error:', err);
      setError('An unexpected error occurred. Please try again.');
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
        redirectTo: `${window.location.origin}/login`,
      });

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setResetSent(true);
      setLoading(false);
    } catch (err) {
      console.error('Password reset error:', err);
      setError('Failed to send reset email. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] to-purple-900/20">
      <div className="bg-[#1A1A1A] p-8 rounded-lg shadow-xl border border-purple-600/30 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-black text-xl mx-auto mb-4">
            DR
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Design-Rite v3</h1>
          <p className="text-gray-400">Sign In to Continue</p>
        </div>

        {/* Login or Reset Form */}
        {!showResetForm ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="you@company.com"
                required
                disabled={loading}
                autoComplete="email"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-gray-300 mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-3 pr-12 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing In...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePasswordReset} className="space-y-6">
            {/* Success Message */}
            {resetSent && (
              <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded">
                Password reset email sent! Check your inbox at {email}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="reset-email" className="block text-gray-300 mb-2 font-medium">
                Email Address
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0A0A0A] border border-purple-600/30 rounded px-4 py-3 text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                placeholder="you@company.com"
                required
                disabled={loading || resetSent}
                autoComplete="email"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || resetSent}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : resetSent ? 'Email Sent!' : 'Send Reset Email'}
            </button>

            {/* Back to Login */}
            <button
              type="button"
              onClick={() => {
                setShowResetForm(false);
                setResetSent(false);
                setError('');
              }}
              className="w-full text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Back to Sign In
            </button>
          </form>
        )}

        {/* Footer Links */}
        <div className="mt-6 text-center space-y-3">
          {!showResetForm && (
            <>
              <div className="text-gray-400 text-sm">
                <button
                  onClick={() => {
                    setShowResetForm(true);
                    setError('');
                  }}
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link
                  href="/signup"
                  className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
                >
                  Create Account
                </Link>
              </div>
            </>
          )}
          <div className="pt-4 border-t border-purple-600/20">
            <Link
              href="/"
              className="text-gray-400 hover:text-white transition-colors text-sm flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Return to Platform
            </Link>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 bg-purple-900/20 border border-purple-600/30 rounded p-3">
          <div className="flex items-start gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="text-xs text-gray-400">
                <strong className="text-purple-400">Unified Platform Access</strong><br />
                One login for Admin Panel and Document AI. Redirects based on your role.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A0A0A] to-purple-900/20">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
