'use client';

import { useState } from 'react';
import { X, Building, Mail, AlertCircle, CheckCircle } from 'lucide-react';

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

  // Business email validation
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
    setError('');
    setIsLoading(true);

    // Validate required fields
    if (!email || !company) {
      setError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    // Validate business email
    if (!validateBusinessEmail(email)) {
      setError('Please use a business email address (not personal email like Gmail, Yahoo, etc.)');
      setIsLoading(false);
      return;
    }

    try {
      // Log to Supabase
      const response = await fetch('/api/log-lead', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          company,
          source: 'ai_assistant_gate',
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process request');
      }

      // Success - proceed to AI Assessment
      onSuccess();
    } catch (error) {
      console.error('Error submitting lead:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white text-2xl mx-auto mb-4">
            🧠
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access AI Security Assessment</h2>
          <p className="text-gray-600 text-sm">
            Enter your business details to experience our powerful AI-driven security assessment platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Business Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="john@yourcompany.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Please use your company email (not Gmail, Yahoo, etc.)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building className="w-4 h-4 inline mr-2" />
              Company Name *
            </label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="Your Company Name"
              required
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-start gap-2 text-purple-700 text-sm">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">What you'll get:</p>
                <ul className="text-xs space-y-1 text-purple-600">
                  <li>• Interactive AI security assessment demo</li>
                  <li>• Professional document generation preview</li>
                  <li>• Compliance analysis tools</li>
                  <li>• Industry-specific scenarios</li>
                </ul>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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