'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User, CreditCard, Package, Settings, ArrowLeft, ExternalLink,
  Check, AlertCircle, Calendar, DollarSign, TrendingUp
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface SubscriptionData {
  tier: string;
  status: string;
  billing_period: string;
  current_period_end: string;
  next_billing_date: string;
  stripe_subscription_id: string;
  amount: number;
}

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    const loadAccountData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push('/login?redirect=/account');
          return;
        }

        setUser(session.user);

        // Load profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setProfile(profileData);

        // Load subscription
        const { data: subData } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', session.user.id)
          .in('status', ['active', 'trialing'])
          .single();

        setSubscription(subData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading account data:', error);
        setLoading(false);
      }
    };

    loadAccountData();
  }, []);

  const openCustomerPortal = async () => {
    setPortalLoading(true);
    try {
      const response = await fetch('/api/stripe/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          returnUrl: `${window.location.origin}/account`
        })
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Failed to open customer portal:', error);
      alert('Failed to open billing portal. Please try again.');
      setPortalLoading(false);
    }
  };

  const getPlanFeatures = (tier: string) => {
    const features = {
      trial: [
        '3 security assessments',
        'Basic PDF exports',
        'Email support',
        '7-day trial period'
      ],
      starter: [
        '25 assessments per month',
        'Quick Estimate + AI Discovery',
        'Professional PDF exports',
        'Email support',
        '1 user'
      ],
      professional: [
        'Unlimited assessments',
        'All AI tools',
        'Priority support',
        'Advanced analytics',
        '3 users',
        'API access'
      ],
      enterprise: [
        'Everything in Professional',
        'Unlimited users',
        'White-label options',
        'Dedicated account manager',
        'SSO/SAML',
        'Custom integrations'
      ]
    };
    return features[tier as keyof typeof features] || features.trial;
  };

  const getPlanColor = (tier: string) => {
    const colors = {
      trial: 'blue',
      starter: 'green',
      professional: 'purple',
      enterprise: 'orange'
    };
    return colors[tier as keyof typeof colors] || 'gray';
  };

  if (loading) {
    return (
      <div className="min-h-screen dr-bg-charcoal dr-text-pearl flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading account...</p>
        </div>
      </div>
    );
  }

  const color = subscription ? getPlanColor(subscription.tier) : 'gray';

  return (
    <div className="min-h-screen dr-bg-charcoal dr-text-pearl">
      {/* Header */}
      <div className="bg-gray-800/40 border-b border-gray-700">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <User className="w-8 h-8 text-purple-400" />
            Account Settings
          </h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            <button className="w-full text-left px-4 py-3 rounded-lg bg-purple-600/20 text-purple-300 font-medium">
              <User className="w-4 h-4 inline mr-2" />
              Profile
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/30 transition-colors">
              <CreditCard className="w-4 h-4 inline mr-2" />
              Billing
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/30 transition-colors">
              <Package className="w-4 h-4 inline mr-2" />
              Plan & Usage
            </button>
            <button className="w-full text-left px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-700/30 transition-colors">
              <Settings className="w-4 h-4 inline mr-2" />
              Preferences
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Section */}
            <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/30">
              <h2 className="text-xl font-bold text-white mb-6">Profile Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                  <div className="text-white">{user?.email}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
                  <div className="text-white">{profile?.full_name || 'Not set'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
                  <div className="text-white">{profile?.company || 'Not set'}</div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  <div className="text-white">{profile?.phone || 'Not set'}</div>
                </div>
              </div>
            </div>

            {/* Subscription Section */}
            {subscription ? (
              <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/30">
                <h2 className="text-xl font-bold text-white mb-6">Current Subscription</h2>

                {/* Plan Badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-${color}-500/20 border border-${color}-500/30 mb-6`}>
                  <Package className={`w-5 h-5 text-${color}-400`} />
                  <span className={`text-lg font-bold text-${color}-300 capitalize`}>
                    {subscription.tier} Plan
                  </span>
                  {subscription.status === 'trialing' && (
                    <span className="text-xs bg-blue-500/30 text-blue-300 px-2 py-1 rounded">Trial</span>
                  )}
                </div>

                {/* Subscription Details */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <DollarSign className="w-4 h-4" />
                      <span>Billing Amount</span>
                    </div>
                    <div className="text-2xl font-bold text-white">
                      ${(subscription.amount / 100).toFixed(2)}
                      <span className="text-sm text-gray-400 ml-1">/ {subscription.billing_period}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>Next Billing Date</span>
                    </div>
                    <div className="text-lg font-semibold text-white">
                      {new Date(subscription.next_billing_date).toLocaleDateString()}
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>Status</span>
                    </div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                      <Check className="w-4 h-4" />
                      <span className="capitalize font-medium">{subscription.status}</span>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm mb-1">
                      <Package className="w-4 h-4" />
                      <span>Billing Period</span>
                    </div>
                    <div className="text-lg font-semibold text-white capitalize">
                      {subscription.billing_period}
                    </div>
                  </div>
                </div>

                {/* Plan Features */}
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-400 mb-3">Plan Features</h3>
                  <ul className="space-y-2">
                    {getPlanFeatures(subscription.tier).map((feature, index) => (
                      <li key={index} className="flex items-center gap-2 text-gray-300">
                        <Check className="w-4 h-4 text-green-400" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Manage Billing Button */}
                <button
                  onClick={openCustomerPortal}
                  disabled={portalLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-600/50 text-white font-semibold py-3 px-6 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  {portalLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Opening Billing Portal...</span>
                    </>
                  ) : (
                    <>
                      <ExternalLink className="w-4 h-4" />
                      <span>Manage Billing & Payment Methods</span>
                    </>
                  )}
                </button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  Opens Stripe customer portal to manage subscriptions, invoices, and payment methods
                </p>
              </div>
            ) : (
              // No subscription - trial or free
              <div className="bg-gray-800/60 rounded-2xl p-6 border border-gray-700/30">
                <div className="text-center py-8">
                  <AlertCircle className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Trial Account</h3>
                  <p className="text-gray-400 mb-6">
                    You're currently on the free trial with 3 assessments. Upgrade for unlimited access!
                  </p>
                  <Link
                    href="/upgrade"
                    className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-all"
                  >
                    <TrendingUp className="w-5 h-5" />
                    Upgrade Now
                  </Link>
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="bg-red-900/20 rounded-2xl p-6 border border-red-500/30">
              <h2 className="text-xl font-bold text-red-300 mb-4">Danger Zone</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-medium">Cancel Subscription</h3>
                    <p className="text-gray-400 text-sm">Permanently cancel your subscription</p>
                  </div>
                  <button
                    onClick={openCustomerPortal}
                    className="bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Manage
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
