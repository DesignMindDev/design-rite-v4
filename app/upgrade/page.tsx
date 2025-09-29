'use client';

import { useState } from 'react';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';
import { stripePlans, createCheckoutSession } from '../../lib/stripe';

export default function UpgradePage() {
  const { user, userCompany } = useSupabaseAuth();
  const [selectedPlan, setSelectedPlan] = useState<'professional' | 'enterprise'>('professional');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpgrade = async () => {
    if (!user) {
      setError('Please sign in to upgrade your plan');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Create checkout session using our local API
      const response = await createCheckoutSession(selectedPlan, user.email!);

      if (response.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      setError(err instanceof Error ? err.message : 'Upgrade failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Upgrade Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose the perfect plan for your security assessment needs
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Professional Plan */}
            <div className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all ${
              selectedPlan === 'professional' ? 'border-purple-500 shadow-purple-200' : 'border-gray-200'
            }`}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Professional</h3>
                  <input
                    type="radio"
                    name="plan"
                    value="professional"
                    checked={selectedPlan === 'professional'}
                    onChange={(e) => setSelectedPlan(e.target.value as 'professional')}
                    className="w-4 h-4 text-purple-600"
                  />
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${stripePlans.professional.price}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>

                <div className="space-y-4 mb-8">
                  {stripePlans.professional.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700 font-medium">Perfect for individual integrators and small teams</p>
                </div>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all ${
              selectedPlan === 'enterprise' ? 'border-purple-500 shadow-purple-200' : 'border-gray-200'
            }`}>
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Enterprise</h3>
                  <input
                    type="radio"
                    name="plan"
                    value="enterprise"
                    checked={selectedPlan === 'enterprise'}
                    onChange={(e) => setSelectedPlan(e.target.value as 'enterprise')}
                    className="w-4 h-4 text-purple-600"
                  />
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${stripePlans.enterprise.price}</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>

                <div className="space-y-4 mb-8">
                  {stripePlans.enterprise.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-700 font-medium">Ideal for large integrators and enterprise teams</p>
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade Button */}
          <div className="text-center mt-12">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-purple-700 hover:to-purple-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Processing...' : `Upgrade to ${stripePlans[selectedPlan].name}`}
            </button>

            <p className="text-sm text-gray-500 mt-4">
              7-day free trial • Cancel anytime • Secure payment with Stripe
            </p>

            {user && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <strong>Account:</strong> {user.email} ({userCompany})
                </p>
              </div>
            )}
          </div>

          {/* Features Comparison */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
              Why Upgrade from Free Trial?
            </h2>

            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⚠️</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Free Trial Limits</h3>
                  <p className="text-gray-600 text-sm">
                    • Only 3 assessments<br/>
                    • Basic proposals<br/>
                    • Limited support
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Professional Benefits</h3>
                  <p className="text-gray-600 text-sm">
                    • Unlimited assessments<br/>
                    • Professional PDFs<br/>
                    • Priority support
                  </p>
                </div>

                <div className="text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">⭐</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Enterprise Power</h3>
                  <p className="text-gray-600 text-sm">
                    • API integrations<br/>
                    • White-label branding<br/>
                    • Custom solutions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}