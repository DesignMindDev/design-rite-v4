'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, CreditCard, Shield, Zap, Check, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

function SubscribeContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)

  // Form data
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    company: '',
    phone: '',
    consentMarketing: false,
    consentSurveys: false
  })

  // Get plan details from URL params
  const planName = searchParams.get('plan') || 'starter'
  const billingPeriod = searchParams.get('billing') || 'monthly'

  // Stripe Price IDs - these will be set in .env
  const stripePriceIds = {
    starter: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_STARTER_MONTHLY_PRICE_ID,
      annual: process.env.NEXT_PUBLIC_STRIPE_STARTER_ANNUAL_PRICE_ID
    },
    professional: {
      monthly: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID,
      annual: process.env.NEXT_PUBLIC_STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID
    }
  }

  const planDetails = {
    starter: {
      name: 'Starter',
      monthlyPrice: 49,
      annualPrice: 490,
      features: [
        '7-day free trial (3 assessments)',
        'Up to 10 assessments per month',
        'AI-powered site analysis',
        'Basic proposal generation',
        'Standard equipment database',
        'Email support',
        'Mobile app access'
      ]
    },
    professional: {
      name: 'Professional',
      monthlyPrice: 199,
      annualPrice: 1990,
      features: [
        'Everything in Starter',
        'Up to 40 assessments per month',
        'Advanced AI recommendations',
        'Custom proposal templates',
        'Private secure data storage',
        'Priority phone & email support',
        'Client portal access',
        'Project management tools'
      ]
    }
  }

  const currentPlan = planDetails[planName as keyof typeof planDetails] || planDetails.starter
  const price = billingPeriod === 'annual'
    ? Math.floor(currentPlan.annualPrice / 12)
    : currentPlan.monthlyPrice

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()

    // Step 1: Email validation
    if (step === 1) {
      if (!formData.email) {
        toast.error('Please enter your email address')
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address')
        return
      }
      setStep(2)
      return
    }

    // Step 2: Company details validation
    if (step === 2) {
      if (!formData.fullName || !formData.company) {
        toast.error('Please fill in all required fields')
        return
      }
      setStep(3)
      return
    }

    // Step 3: Phone & consent validation
    if (step === 3) {
      if (!formData.phone) {
        toast.error('Please enter your phone number')
        return
      }
      const phoneRegex = /^[\d\s\-\(\)\+]+$/
      if (!phoneRegex.test(formData.phone)) {
        toast.error('Please enter a valid phone number')
        return
      }
      if (!formData.consentMarketing) {
        toast.error('Please agree to be contacted to continue')
        return
      }
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      console.log('[Subscribe] Saving lead data and creating checkout session...')

      // Get the correct Stripe price ID
      const priceId = stripePriceIds[planName as keyof typeof stripePriceIds]?.[billingPeriod as 'monthly' | 'annual']

      if (!priceId) {
        throw new Error('Stripe Price ID not configured. Please contact support.')
      }

      // Save lead data to Supabase (optional - you can create this endpoint)
      try {
        await fetch('/api/leads/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            plan: planName,
            billingPeriod,
            source: 'subscribe_page'
          })
        })
      } catch (err) {
        console.warn('[Subscribe] Failed to save lead data, continuing to checkout:', err)
      }

      // Create Stripe checkout session
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: priceId,
          userEmail: formData.email,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }

      console.log('[Subscribe] Checkout session created, redirecting to Stripe...')

      // Redirect to Stripe Checkout
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned from Stripe')
      }

    } catch (error: any) {
      console.error('[Subscribe] Error:', error)
      toast.error(error.message || 'Failed to start checkout. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Pricing
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Subscribe to {currentPlan.name}
          </h1>
          <p className="text-xl text-gray-600">
            Start your 7-day free trial. No commitment required.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Plan Summary Header */}
          <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-8 text-center">
            <div className="text-6xl font-bold mb-2">
              ${price}
              <span className="text-2xl font-normal opacity-90">/month</span>
            </div>
            {billingPeriod === 'annual' && (
              <div className="text-green-300 font-semibold text-lg">
                Save ${currentPlan.monthlyPrice * 12 - currentPlan.annualPrice}/year
              </div>
            )}
            <div className="mt-4 inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Zap className="w-5 h-5" />
              <span className="font-semibold">7-Day Free Trial • 3 AI Assessments</span>
            </div>
          </div>

          {/* Features & Form */}
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Features List */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">What's included:</h3>
              <ul className="space-y-3">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Multi-Step Form */}
            <div>
              {/* Step Progress Indicator */}
              <div className="flex items-center justify-center mb-8">
                <div className="flex items-center gap-2">
                  {/* Step 1 */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    step >= 1 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    1
                  </div>
                  <div className={`h-1 w-16 transition-all ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`} />

                  {/* Step 2 */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    step >= 2 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    2
                  </div>
                  <div className={`h-1 w-16 transition-all ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`} />

                  {/* Step 3 */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    step >= 3 ? 'bg-primary text-white' : 'bg-gray-200 text-gray-500'
                  }`}>
                    3
                  </div>
                </div>
              </div>

              {/* Step Labels */}
              <div className="text-center mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  {step === 1 && 'Your Email Address'}
                  {step === 2 && 'Company Information'}
                  {step === 3 && 'Contact & Consent'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {step === 1 && 'We\'ll use this to create your account'}
                  {step === 2 && 'Tell us about your business'}
                  {step === 3 && 'Final step before checkout'}
                </p>
              </div>

              <form onSubmit={handleNextStep} className="space-y-4">
                {/* Step 1: Email */}
                {step === 1 && (
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="you@company.com"
                      required
                      disabled={loading}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                )}

                {/* Step 2: Company Details */}
                {step === 2 && (
                  <>
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        id="fullName"
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Doe"
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Acme Security Solutions"
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      />
                    </div>
                  </>
                )}

                {/* Step 3: Phone & Consent */}
                {step === 3 && (
                  <>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      />
                    </div>

                    {/* Consent Checkboxes */}
                    <div className="space-y-3 pt-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.consentMarketing}
                          onChange={(e) => setFormData({ ...formData, consentMarketing: e.target.checked })}
                          className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">
                          I agree to be contacted by Design-Rite about my subscription and account. *
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.consentSurveys}
                          onChange={(e) => setFormData({ ...formData, consentSurveys: e.target.checked })}
                          className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">
                          I'm interested in participating in product surveys and feedback sessions (optional)
                        </span>
                      </label>
                    </div>
                  </>
                )}

                {/* Navigation Buttons */}
                <div className="flex gap-3 pt-4">
                  {step > 1 && (
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      disabled={loading}
                      className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                      Back
                    </button>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed px-8 py-4 rounded-lg font-bold text-lg text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Redirecting to Stripe...
                      </>
                    ) : (
                      <>
                        {step < 3 ? (
                          'Continue'
                        ) : (
                          <>
                            <CreditCard className="w-6 h-6" />
                            Continue to Secure Checkout
                          </>
                        )}
                      </>
                    )}
                  </button>
                </div>

                {/* Trust Badges */}
                {step === 3 && (
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-500 pt-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      Secure Payment
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-green-600" />
                      Cancel Anytime
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              By subscribing, you'll be charged <strong>${billingPeriod === 'annual' ? currentPlan.annualPrice : currentPlan.monthlyPrice}</strong> after your 7-day free trial ends.
              You can cancel anytime before day 8 at no cost. Most integrators see value after 2 assessments.
            </p>
          </div>
        </div>

        {/* Additional Trust Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 text-center">
          <div className="p-6">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">No Commitment</h3>
            <p className="text-sm text-gray-600">Cancel anytime during your trial at no charge</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Secure Billing</h3>
            <p className="text-sm text-gray-600">Powered by Stripe - industry-leading payment security</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Instant Access</h3>
            <p className="text-sm text-gray-600">Start using Design-Rite immediately after checkout</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SubscribePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    }>
      <SubscribeContent />
    </Suspense>
  )
}
