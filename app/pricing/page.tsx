'use client'

import { useState } from 'react'
import Link from 'next/link'
import UnifiedNavigation from '../components/UnifiedNavigation';
import Footer from '../components/Footer';

export default function PricingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState('monthly') // 'monthly' or 'annual'

  const handleStartTrial = (plan: string) => {
    // Redirect to subscribe page with plan and billing period
    const subscribeUrl = `/subscribe?plan=${plan.toLowerCase()}&billing=${billingPeriod}`;
    window.location.href = subscribeUrl;
  }

  const plans = {
    starter: {
      name: 'Starter',
      description: 'Perfect for small integrators getting started',
      monthlyPrice: 49,
      annualPrice: 490, // 2 months free
      features: [
        '7-day free trial (3 assessments)',
        'Up to 10 assessments per month',
        'AI-powered site analysis',
        'Basic proposal generation',
        'Standard equipment database',
        'Email support',
        'Mobile app access'
      ],
      cta: 'Start Free Trial',
      popular: false
    },
    professional: {
      name: 'Professional',
      description: 'For established integrators scaling their business',
      monthlyPrice: 199,
      annualPrice: 1990, // 2 months free
      features: [
        'Everything in Starter',
        'Up to 40 assessments per month',
        'Advanced AI recommendations',
        'Custom proposal templates',
        'Private secure data storage',
        'Priority phone & email support',
        'Client portal access',
        'Project management tools',
        'Custom pricing rules'
      ],
      cta: 'Start Free Trial',
      popular: true
    },
    enterprise: {
      name: 'Enterprise',
      description: 'For large organizations with multiple facilities',
      monthlyPrice: 499,
      annualPrice: 4990, // 2 months free
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
      cta: 'Explore Enterprise',
      popular: false
    }
  }

  const getPrice = (plan) => {
    return billingPeriod === 'monthly' ? plan.monthlyPrice : Math.floor(plan.annualPrice / 12)
  }

  const getSavings = (plan) => {
    const monthlyCost = plan.monthlyPrice * 12
    const annualCost = plan.annualPrice
    return monthlyCost - annualCost
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Main Navigation Header */}
      <UnifiedNavigation />

      {/* Main Content */}
      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-16 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Pricing Plans
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-8">
            Start with a free trial. Scale as you grow. No hidden fees, cancel anytime.
          </p>

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
            {Object.values(plans).map((plan, index) => (
              <div 
                key={plan.name}
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
                    <span className="text-gray-400 ml-2">/{billingPeriod === 'monthly' ? 'month' : 'month'}</span>
                  </div>

                  {billingPeriod === 'annual' && (
                    <div className="text-green-400 text-sm font-semibold">
                      Save ${getSavings(plan)} per year
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3 text-gray-300">
                      <span className="text-green-500 font-bold text-lg flex-shrink-0 mt-0.5">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="text-center">
                  {plan.name === 'Enterprise' ? (
                    <Link
                      href="/enterprise-subscription"
                      className={`block w-full py-4 px-6 rounded-xl font-bold transition-all text-lg ${
                        plan.popular
                          ? 'bg-white text-purple-600 hover:bg-gray-100'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {plan.cta}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleStartTrial(plan.name)}
                      className={`w-full py-4 px-6 rounded-xl font-bold transition-all text-lg ${
                        plan.popular
                          ? 'bg-white text-purple-600 hover:bg-gray-100'
                          : 'bg-purple-600 text-white hover:bg-purple-700'
                      }`}
                    >
                      {plan.cta}
                    </button>
                  )}
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
              <h3 className="text-xl font-bold text-white mb-3">Can I switch plans anytime?</h3>
              <p className="text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately, 
                and we'll prorate the billing accordingly.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-3">What's included in the free trial?</h3>
              <p className="text-gray-300">
                All plans include a 7-day free trial with 3 AI assessments. Credit card required to prevent abuse,
                but you won't be charged until day 8. Cancel anytime before then at no cost. Most integrators see value after 2 assessments.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-3">Do you offer custom enterprise solutions?</h3>
              <p className="text-gray-300">
                Yes, we work with large organizations to create custom solutions including API integrations, 
                dedicated infrastructure, and tailored compliance requirements.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-3">What payment methods do you accept?</h3>
              <p className="text-gray-300">
                We accept all major credit cards, PayPal, and can arrange ACH transfers for enterprise accounts. 
                Annual plans can be invoiced if needed.
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
            Join thousands of security professionals who have revolutionized their workflow with Design-Rite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => handleStartTrial('Professional')}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all text-lg"
            >
              Start 7-Day Free Trial
            </button>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all text-lg inline-block"
            >
              Talk to Sales
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer redirectToApp={() => handleStartTrial('Starter')} />
    </div>
  )
}


