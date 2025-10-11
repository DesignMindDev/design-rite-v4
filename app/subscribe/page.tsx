'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import UnifiedNavigation from '../components/UnifiedNavigation'
import Footer from '../components/Footer'
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth'
import { Check, Loader2, CreditCard, Shield, Zap } from 'lucide-react'

export default function SubscribePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useSupabaseAuth()
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  // Don't redirect - let guests browse pricing
  // Only require login when they click subscribe button

  const plans = {
    starter: {
      name: 'Starter',
      description: 'Perfect for small integrators getting started',
      monthlyPrice: 49,
      annualPrice: 490,
      features: [
        'Up to 10 assessments per month',
        'AI-powered site analysis',
        'Basic proposal generation',
        'Standard equipment database',
        'Email support',
        'Mobile app access',
        '14-day free trial'
      ],
      limits: {
        assessments: 10,
        projects: 50,
        storage: '5GB'
      },
      popular: false
    },
    professional: {
      name: 'Professional',
      description: 'For established integrators scaling their business',
      monthlyPrice: 199,
      annualPrice: 1990,
      features: [
        'Unlimited assessments',
        'Advanced AI recommendations',
        'Custom proposal templates',
        'Premium equipment database',
        'Priority phone & email support',
        'Client portal access',
        'Project management tools',
        'Custom pricing rules'
      ],
      limits: {
        assessments: 'Unlimited',
        projects: 'Unlimited',
        storage: '100GB'
      },
      popular: true
    },
    enterprise: {
      name: 'Enterprise',
      description: 'For large organizations with multiple facilities',
      monthlyPrice: 499,
      annualPrice: 4990,
      features: [
        'Everything in Professional',
        'Multi-site management',
        'Vendor comparison tools',
        'Custom compliance reporting',
        'API access & integrations',
        'Dedicated account manager',
        'Advanced analytics dashboard',
        'Custom training & onboarding',
        'SLA guarantee',
        'Priority feature requests'
      ],
      limits: {
        assessments: 'Unlimited',
        projects: 'Unlimited',
        storage: 'Unlimited',
        users: 'Unlimited'
      },
      popular: false
    }
  }

  const getPrice = (plan: typeof plans.starter) => {
    return billingPeriod === 'monthly' ? plan.monthlyPrice : Math.floor(plan.annualPrice / 12)
  }

  const getSavings = (plan: typeof plans.starter) => {
    const monthlyCost = plan.monthlyPrice * 12
    const annualCost = plan.annualPrice
    return monthlyCost - annualCost
  }

  const handleSubscribe = async (tier: 'starter' | 'professional' | 'enterprise') => {
    if (!user) {
      router.push('/login?redirect=/subscribe')
      return
    }

    setLoading(true)
    setSelectedPlan(tier)

    try {
      // Call Stripe checkout API
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: tier,
          userEmail: user.email,
          successUrl: `https://portal.design-rite.com/welcome?payment=success&plan=${tier}`,
          cancelUrl: `${window.location.origin}/subscribe?payment=canceled`,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { url } = await response.json()

      // Redirect to Stripe Checkout
      window.location.href = url
    } catch (error) {
      console.error('Error creating checkout session:', error)
      alert('Failed to start checkout. Please try again.')
      setLoading(false)
      setSelectedPlan(null)
    }
  }

  // Don't block guests with loading screen - show pricing immediately
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      <UnifiedNavigation />

      {/* Main Content */}
      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Start Your Free Trial
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-8">
            Start with a 14-day free trial. Your card won't be charged until day 15. Cancel anytime.
          </p>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className="flex items-center gap-2 text-gray-300">
              <Shield className="w-5 h-5 text-green-500" />
              <span className="text-sm">Secure Payment</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <CreditCard className="w-5 h-5 text-purple-500" />
              <span className="text-sm">Powered by Stripe</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Zap className="w-5 h-5 text-blue-500" />
              <span className="text-sm">Instant Access</span>
            </div>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`px-6 py-2 rounded-md font-semibold transition-all ${
                  billingPeriod === 'monthly'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`px-6 py-2 rounded-md font-semibold transition-all ${
                  billingPeriod === 'annual'
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Annual
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">Save 20%</span>
              </button>
            </div>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="max-w-7xl mx-auto mb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(plans).map(([key, plan]) => (
              <div
                key={key}
                className={`bg-white/10 backdrop-blur-sm rounded-3xl p-8 border transition-all hover:-translate-y-2 relative ${
                  plan.popular
                    ? 'border-purple-500 ring-2 ring-purple-500/20'
                    : 'border-white/20 hover:border-purple-500/30'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  <div className="mb-4">
                    <span className="text-5xl font-black text-white">${getPrice(plan)}</span>
                    <span className="text-gray-400 ml-2">/month</span>
                  </div>

                  {billingPeriod === 'annual' && (
                    <div className="text-green-400 text-sm font-semibold mb-4">
                      Save ${getSavings(plan)} per year
                    </div>
                  )}

                  <div className="text-sm text-gray-400">
                    Billed {billingPeriod === 'monthly' ? 'monthly' : 'annually'}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  <button
                    onClick={() => handleSubscribe(key as 'starter' | 'professional' | 'enterprise')}
                    disabled={loading && selectedPlan === key}
                    className={`w-full py-4 px-6 rounded-xl font-bold transition-all text-lg flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-white text-purple-600 hover:bg-gray-100'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {loading && selectedPlan === key ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>Start 14-Day Free Trial</>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-3">Is the free trial really free?</h3>
              <p className="text-gray-300">
                Yes! Start with a 14-day free trial with full access to all features in your chosen plan.
                We require a valid payment method to prevent abuse, but you won't be charged until day 15.
                Cancel anytime before then at no cost.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-3">Can I switch plans anytime?</h3>
              <p className="text-gray-300">
                Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately,
                and we'll prorate the billing accordingly.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-300">
                We accept all major credit cards (Visa, Mastercard, American Express, Discover) via Stripe.
                Enterprise customers can arrange ACH transfers or invoicing.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-3">Can I cancel my subscription?</h3>
              <p className="text-gray-300">
                Yes, you can cancel your subscription at any time from your account dashboard.
                You'll continue to have access until the end of your current billing period.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Security Design Process?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join thousands of security professionals who have revolutionized their workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/pricing"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all text-lg inline-block"
            >
              Compare Plans
            </Link>
            <Link
              href="/contact"
              className="border-2 border-purple-600 text-purple-400 px-8 py-4 rounded-xl font-bold hover:bg-purple-600 hover:text-white transition-all text-lg inline-block"
            >
              Talk to Sales
            </Link>
          </div>
        </section>
      </main>


      {/* Footer */}
      <Footer redirectToApp={() => router.push('/subscribe')} />
    </div>
  )
}


