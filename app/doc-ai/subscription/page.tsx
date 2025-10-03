'use client';

import { useState, useEffect } from 'react';
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Check, Crown, Zap, Shield, Sparkles, CreditCard, Calendar, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';

interface SubscriptionPlan {
  tier: 'starter' | 'professional' | 'enterprise';
  name: string;
  price: number;
  annualPrice: number;
  priceId?: string;
  features: string[];
  limits: {
    assessments: string;
    support: string;
    features: string[];
  };
}

export default function SubscriptionPage() {
  const auth = useSupabaseAuth();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTier, setSelectedTier] = useState<'professional' | 'enterprise' | null>(null);

  const plans: SubscriptionPlan[] = [
    {
      tier: 'starter',
      name: 'Starter',
      price: 49,
      annualPrice: 490,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER,
      features: [
        'Up to 25 assessments per month',
        'AI-powered site analysis',
        'Basic proposal generation',
        'Standard equipment database',
        'Email support',
        'Mobile app access',
        '30-day free trial'
      ],
      limits: {
        assessments: '25 per month',
        support: 'Email',
        features: ['Basic AI', 'Standard DB', 'Mobile Access']
      }
    },
    {
      tier: 'professional',
      name: 'Professional',
      price: 199,
      annualPrice: 1990,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL,
      features: [
        'Unlimited assessments',
        'Advanced AI recommendations',
        'Custom proposal templates',
        'White-label branding',
        'Premium equipment database',
        'Priority phone & email support',
        'Client portal access',
        'Project management tools',
        'Custom pricing rules'
      ],
      limits: {
        assessments: 'Unlimited',
        support: 'Priority (24hr)',
        features: ['All Starter', 'White-label', 'Client Portal', 'PM Tools']
      }
    },
    {
      tier: 'enterprise',
      name: 'Enterprise',
      price: 499,
      annualPrice: 4990,
      priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE,
      features: [
        'Everything in Professional',
        'Multi-site management',
        'Vendor comparison tools',
        'Custom compliance reporting',
        'API access & integrations',
        'Dedicated account manager',
        'Advanced analytics dashboard',
        'Custom training & onboarding',
        'SLA guarantee'
      ],
      limits: {
        assessments: 'Unlimited',
        support: 'Dedicated manager',
        features: ['All Professional', 'Multi-site', 'API', 'Custom Training']
      }
    }
  ];

  const handleUpgrade = async (tier: 'professional' | 'enterprise') => {
    setIsLoading(true);
    setSelectedTier(tier);

    try {
      const response = await fetch('/api/doc-ai/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        window.location.href = url;
      }
    } catch (err) {
      console.error('Upgrade error:', err);
      alert(err instanceof Error ? err.message : 'Failed to start upgrade process');
    } finally {
      setIsLoading(false);
      setSelectedTier(null);
    }
  };

  const currentPlan = plans.find(p => p.tier === auth.user?.subscriptionTier) || plans[0];

  return (
    <div className="space-y-8">
      {/* Current Plan Status */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-gray-200 rounded-2xl p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Plan</h2>
            <p className="text-gray-600">Manage your subscription and billing</p>
          </div>
          <div className={`
            px-6 py-3 rounded-xl font-bold text-lg shadow-md
            ${currentPlan.tier === 'enterprise'
              ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white'
              : currentPlan.tier === 'pro'
              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
              : 'bg-gray-200 text-gray-700'
            }
          `}>
            {currentPlan.name}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Monthly Cost</p>
                <p className="text-2xl font-bold text-gray-900">${currentPlan.price}</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-lg font-bold text-emerald-600">
                  {auth.user?.subscriptionStatus === 'active' ? 'Active' : 'Inactive'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Assessments</p>
                <p className="text-2xl font-bold text-gray-900">{currentPlan.limits.assessments}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upgrade Plans */}
      {auth.user?.subscriptionTier !== 'enterprise' && (
        <div>
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Upgrade Your Plan</h2>
            <p className="text-gray-600">Unlock premium features and unlimited access</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {plans.map((plan) => {
              const isCurrentPlan = plan.tier === auth.user?.subscriptionTier;
              const canUpgrade = plan.tier !== 'starter' && !isCurrentPlan;
              const tierIcons = {
                starter: Shield,
                professional: Zap,
                enterprise: Crown
              };
              const TierIcon = tierIcons[plan.tier];

              return (
                <div
                  key={plan.tier}
                  className={`
                    relative bg-white rounded-2xl p-8 transition-all
                    ${plan.tier === 'professional'
                      ? 'border-2 border-purple-600 shadow-xl scale-105'
                      : 'border border-gray-200 shadow-md'
                    }
                    ${isCurrentPlan ? 'ring-2 ring-emerald-600' : ''}
                  `}
                >
                  {/* Popular Badge */}
                  {plan.tier === 'professional' && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white text-sm font-bold shadow-md">
                      Most Popular
                    </div>
                  )}

                  {/* Current Plan Badge */}
                  {isCurrentPlan && (
                    <div className="absolute top-6 right-6 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-600 text-xs font-bold">
                      Current Plan
                    </div>
                  )}

                  {/* Plan Icon */}
                  <div className={`
                    w-16 h-16 rounded-2xl flex items-center justify-center mb-6
                    ${plan.tier === 'enterprise'
                      ? 'bg-gradient-to-br from-yellow-600 to-orange-600'
                      : plan.tier === 'professional'
                      ? 'bg-gradient-to-br from-purple-600 to-blue-600'
                      : 'bg-gray-200'
                    }
                  `}>
                    <TierIcon className="w-8 h-8 text-white" />
                  </div>

                  {/* Plan Name & Price */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>

                  {/* Features List */}
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <button
                    onClick={() => canUpgrade && handleUpgrade(plan.tier as 'professional' | 'enterprise')}
                    disabled={!canUpgrade || isLoading}
                    className={`
                      w-full py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2
                      ${canUpgrade
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      }
                    `}
                  >
                    {isLoading && selectedTier === plan.tier ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : canUpgrade ? (
                      <>
                        Upgrade Now
                        <ArrowRight className="w-5 h-5" />
                      </>
                    ) : (
                      'Not Available'
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Enterprise Features */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-gray-200 rounded-2xl p-8">
        <div className="flex items-start gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-600 to-orange-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Need a Custom Solution?</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Contact our sales team for enterprise pricing, custom integrations, and dedicated support tailored to your organization's needs.
            </p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all text-white font-semibold shadow-md"
            >
              Contact Sales
              <ArrowRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
