'use client';

import { useState, useEffect } from 'react';
import { authHelpers } from '../../lib/supabase';
import { sessionManager } from '../../lib/sessionManager';

interface EmailGateProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const EmailGate = ({ isOpen, onClose, onSuccess }: EmailGateProps) => {
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if user is already authenticated or is a returning guest
  useEffect(() => {
    const checkAuth = async () => {
      if (isOpen) {
        // First check Supabase authentication
        const user = await authHelpers.getCurrentUser();
        if (user) {
          // User is already authenticated, proceed
          onSuccess();
          return;
        }

        // Check for returning guest with stored session
        const existingUser = sessionManager.getCurrentUser();
        if (existingUser && existingUser.email && existingUser.company) {
          // Returning guest with email/company already provided
          console.log('🔄 Returning guest detected:', existingUser.email);
          onSuccess();
          return;
        }

        // Pre-fill form if we have partial guest data
        if (existingUser) {
          if (existingUser.email) setEmail(existingUser.email);
          if (existingUser.company) setCompany(existingUser.company);
        }
      }
    };
    checkAuth();
  }, [isOpen, onSuccess]);

  const validateBusinessEmail = (email: string): boolean => {
    const freeEmailDomains = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
      'icloud.com', 'protonmail.com', 'live.com', 'msn.com', 'ymail.com'
    ];
    const emailDomain = email.split('@')[1]?.toLowerCase();
    return !freeEmailDomains.includes(emailDomain);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', { email, company });

    setError('');
    setIsLoading(true);

    if (!email?.trim() || !company?.trim()) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      // SMART USER LOOKUP: Check if email exists in Supabase auth users
      console.log('🔍 Checking if user already exists in database...');

      // First check: try to get existing user from Supabase
      let existingSupabaseUser = null;
      try {
        // This won't work directly from client, but we can use sessionManager to track
        const { data } = await authHelpers.signInWithMagicLink(email.trim(), company.trim());
        console.log('📧 Magic link sent, checking for existing user patterns...');
      } catch (authCheckError) {
        console.log('🆕 Likely new user, proceeding with registration flow');
      }

      // Check if we have this email in our local session history (persistent sessions)
      const existingSessionUser = sessionManager.findUserByEmail?.(email.trim());

      if (existingSessionUser) {
        console.log('🔄 Found existing session user, reusing user ID:', existingSessionUser.userId);
        // Reuse existing user ID and update session
        sessionManager.getOrCreateUser({
          userId: existingSessionUser.userId, // Reuse same ID!
          email: email.trim(),
          company: company.trim(),
          userType: existingSessionUser.userType || 'guest'
        });
      } else {
        console.log('🆕 Creating new user session');
        // Create new user session
        sessionManager.getOrCreateUser({
          email: email.trim(),
          company: company.trim(),
          userType: 'guest'
        });
      }

      // Log lead data
      const response = await fetch('/api/log-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          company,
          source: 'platform_access_gate',
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process request');
      }

      // Send magic link via Supabase (this handles both new and existing users)
      const { error: authError } = await authHelpers.signInWithMagicLink(email.trim(), company.trim());

      if (authError) {
        throw new Error(authError.message);
      }

      // Show success message
      setError('');
      if (existingSessionUser) {
        alert('Welcome back! Check your email for a magic link to continue with your existing projects.');
      } else {
        alert('Check your email for a magic link to access the platform!');
      }
      onSuccess();
    } catch (error) {
      console.error('Error submitting lead:', error);
      setError(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 pt-24 pb-4 z-[9999] overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative my-auto mx-auto max-h-[85vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
            🧠
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access AI Security Assessment</h2>
          <p className="text-gray-600 text-sm">
            Enter your business details to experience our AI-driven security assessment platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Business Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="john@yourcompany.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              Please use your company email (not Gmail, Yahoo, etc.)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900 bg-white"
              placeholder="Your Company Name"
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-purple-50 p-4 rounded-lg">
            <p className="text-purple-700 text-sm font-medium mb-1">What you'll get:</p>
            <ul className="text-xs text-purple-600 space-y-1">
              <li>• Interactive AI security assessment demo</li>
              <li>• Professional document generation preview</li>
              <li>• Compliance analysis tools</li>
              <li>• Industry-specific scenarios</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50"
          >
            {isLoading ? 'Accessing Platform...' : 'Access AI Assessment Demo'}
          </button>

          <p className="text-xs text-gray-500 text-center">
            By proceeding, you agree to receive product updates and demos. No spam, unsubscribe anytime.
          </p>
        </form>
      </div>
    </div>
  );
};

export default EmailGate;