'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail, Building, User, Phone, Loader2, Shield, CheckCircle, AlertCircle, Zap, Clock, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'

export default function CreateAccountPage() {
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [accountCreated, setAccountCreated] = useState(false)

  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    company: '',
    phone: '',
    jobTitle: '',
    companySize: '',
    painPoint: '',
    offerChoice: '7day-trial', // '7day-trial' or '20percent-discount'
    consentMarketing: false
  })

  // Business email validation - reject common free providers
  const freeEmailProviders = [
    'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
    'icloud.com', 'live.com', 'msn.com', 'ymail.com', 'protonmail.com'
  ]

  const isBusinessEmail = (email: string) => {
    const domain = email.split('@')[1]?.toLowerCase()
    if (!domain) return false
    return !freeEmailProviders.includes(domain)
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault()

    // Step 1: Email + Name validation
    if (step === 1) {
      if (!formData.email || !formData.fullName) {
        toast.error('Please enter your email and name')
        return
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.email)) {
        toast.error('Please enter a valid email address')
        return
      }

      // Business email validation
      if (!isBusinessEmail(formData.email)) {
        toast.error('Please use a business email address. Personal emails (Gmail, Yahoo, etc.) are not accepted.')
        return
      }

      setStep(2)
      return
    }

    // Step 2: Company details validation
    if (step === 2) {
      if (!formData.company || !formData.phone || !formData.jobTitle || !formData.companySize) {
        toast.error('Please fill in all required fields')
        return
      }
      const phoneRegex = /^[\d\s\-\(\)\+]+$/
      if (!phoneRegex.test(formData.phone)) {
        toast.error('Please enter a valid phone number')
        return
      }
      setStep(3)
      return
    }

    // Step 3: Challenge & consent validation
    if (step === 3) {
      if (!formData.painPoint) {
        toast.error('Please tell us your biggest challenge')
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
      console.log('[Create Account] Saving lead data...')

      // Save lead data to Supabase
      const response = await fetch('/api/leads/create-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          source: 'design_rite_challenge',
          campaignName: 'Take the Design Rite Challenge'
        })
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle existing user error
        if (response.status === 409 && data.existingUser) {
          toast.error(data.error, { duration: 6000 })
          setTimeout(() => {
            const loginUrl = process.env.NODE_ENV === 'development'
              ? 'http://localhost:3001/auth'
              : 'https://portal.design-rite.com/auth'
            window.location.href = loginUrl
          }, 2000)
          return
        }

        throw new Error(data.error || 'Failed to create account')
      }

      console.log('[Create Account] Lead saved successfully')

      // Check if we need to redirect to Stripe (for 20% discount path)
      if (data.redirectToStripe) {
        console.log('[Create Account] Redirecting to Stripe checkout...')
        toast.success('Redirecting to payment...')

        // Redirect to Stripe checkout with lead data
        const stripeParams = new URLSearchParams({
          leadId: data.leadId,
          userId: data.userId || '', // Include userId for Stripe metadata
          email: formData.email,
          fullName: formData.fullName,
          company: formData.company,
          offerChoice: formData.offerChoice // Include offer choice
        })

        // Redirect - the API will either redirect to Stripe or return error JSON
        window.location.href = `/api/stripe/create-checkout-session?${stripeParams.toString()}`
        return
      }

      // For 7-day trial: Redirect to "Check Email" page
      console.log('[Create Account] Redirecting to check-email page...')
      toast.success('Welcome to the Design Rite Challenge!')
      window.location.href = `/challenge/check-email?email=${encodeURIComponent(formData.email)}`
      return

    } catch (error: any) {
      console.error('[Create Account] Error:', error)
      toast.error(error.message || 'Failed to create account. Please try again.')
      setLoading(false)
    }
  }

  // Success screen - account created
  if (accountCreated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
            {/* Success Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>

              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to the Design Rite Challenge! 🎉
              </h1>

              <p className="text-lg text-gray-600 mb-6">
                {formData.fullName.split(' ')[0]}, your journey to reclaiming your time starts now.
              </p>
            </div>

            {/* Offer Selected */}
            <div className="bg-gradient-to-r from-primary to-purple-600 text-white rounded-xl p-6 mb-8">
              <div className="text-center">
                {formData.offerChoice === '7day-trial' ? (
                  <>
                    <Zap className="w-12 h-12 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold mb-2">Your 7-Day Free Trial is Ready!</h3>
                    <p className="text-white/90 mb-4">
                      Experience unlimited automation for 7 days. Try 3 free AI assessments on us.
                    </p>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-12 h-12 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold mb-2">20% Discount Locked In!</h3>
                    <p className="text-white/90 mb-4">
                      Subscribe today and save 20% on your first year. Unlock instant access.
                    </p>
                  </>
                )}
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 inline-block">
                  <p className="font-semibold">Check your email: {formData.email}</p>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="space-y-4 mb-8">
              <h3 className="text-xl font-bold text-gray-900">What happens next:</h3>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Check Your Email</p>
                  <p className="text-sm text-gray-600">We've sent you a verification link to activate your account</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Activate Your Account</p>
                  <p className="text-sm text-gray-600">Click the link to verify your email and set your password</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Start Your First Automation</p>
                  <p className="text-sm text-gray-600">We'll guide you through automating your biggest pain point: "{formData.painPoint}"</p>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-4">
              <a
                href={process.env.NODE_ENV === 'development' ? 'http://localhost:3005/auth' : 'https://portal.design-rite.com/auth'}
                className="flex-1 bg-gradient-to-r from-primary to-purple-600 text-white py-4 px-6 rounded-xl font-bold text-center hover:from-primary/90 hover:to-purple-600/90 transition-all shadow-lg"
              >
                Go to Dashboard
              </a>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/platform-access" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left Column - Marketing Content */}
          <div className="lg:sticky lg:top-8">
            <div className="bg-gradient-to-br from-primary to-purple-600 text-white rounded-2xl p-8 shadow-2xl">
              <div className="mb-6">
                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                  <span className="font-semibold">⚡ Limited Time Challenge</span>
                </div>
                <h1 className="text-4xl font-black mb-4 leading-tight">
                  Take the Design Rite Challenge
                </h1>
                <div className="bg-red-500 text-white px-4 py-3 rounded-lg mb-6 font-bold text-center">
                  ⚠️ WARNING: OUR FIRST FREE AUTOMATION IS ADDICTIVE
                </div>
                <p className="text-xl text-white/90 mb-6">
                  Try one process, watch your sanity return.
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <Clock className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold mb-1">Get 2+ Hours Back Daily</p>
                    <p className="text-white/80 text-sm">That tedious task you dread? Gone. Automated. Done.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Zap className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold mb-1">Try Everything Free for 7 Days</p>
                    <p className="text-white/80 text-sm">3 AI assessments included. Full platform access. Cancel anytime.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <TrendingUp className="w-6 h-6 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold mb-1">Watch What Happens Next</p>
                    <p className="text-white/80 text-sm">Bet you can't automate just one. Once you see the results...</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                <p className="text-lg font-semibold mb-3">The Psychology:</p>
                <p className="text-white/90 italic">
                  "Just like you can't eat just one chip, you can't experience just one automation without wanting more. That first taste of freedom is all it takes."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Progress Header */}
              <div className="bg-gradient-to-r from-primary to-purple-600 text-white p-6">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                        step >= s ? 'bg-white text-primary' : 'bg-white/30 text-white/60'
                      }`}>
                        {s}
                      </div>
                      {s < 3 && <div className={`h-1 w-12 mx-2 transition-all ${step > s ? 'bg-white' : 'bg-white/30'}`} />}
                    </div>
                  ))}
                </div>
                <h3 className="text-xl font-bold text-center">
                  {step === 1 && 'Tell Us About Yourself'}
                  {step === 2 && 'Your Company Details'}
                  {step === 3 && 'Choose Your Challenge Path'}
                </h3>
              </div>

              {/* Form */}
              <form onSubmit={handleNextStep} className="p-8 space-y-6">

                {/* Step 1: Email + Name */}
                {step === 1 && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="John Smith"
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Business Email Address *
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@yourcompany.com"
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                      <p className="text-xs text-gray-500 mt-2">
                        ⚠️ Personal emails (Gmail, Yahoo, Hotmail, etc.) not accepted
                      </p>
                    </div>
                  </>
                )}

                {/* Step 2: Company Details */}
                {step === 2 && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Acme Security Solutions"
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Job Title *
                      </label>
                      <input
                        type="text"
                        value={formData.jobTitle}
                        onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                        placeholder="Sales Engineer"
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Company Size *
                      </label>
                      <select
                        value={formData.companySize}
                        onChange={(e) => setFormData({ ...formData, companySize: e.target.value })}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="">Select size...</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="201-1000">201-1,000 employees</option>
                        <option value="1000+">1,000+ employees</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="(555) 123-4567"
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </>
                )}

                {/* Step 3: Challenge & Offer */}
                {step === 3 && (
                  <>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        What's Your Biggest Time-Wasting Process? *
                      </label>
                      <textarea
                        value={formData.painPoint}
                        onChange={(e) => setFormData({ ...formData, painPoint: e.target.value })}
                        placeholder="Example: Manual proposal creation takes 3-4 hours, endless BOM revisions, chasing pricing updates..."
                        required
                        disabled={loading}
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Choose Your Challenge Path *
                      </label>
                      <div className="space-y-3">
                        <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.offerChoice === '7day-trial' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
                        }`}>
                          <input
                            type="radio"
                            name="offer"
                            value="7day-trial"
                            checked={formData.offerChoice === '7day-trial'}
                            onChange={(e) => setFormData({ ...formData, offerChoice: e.target.value })}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Zap className="w-5 h-5 text-primary" />
                              <span className="font-bold text-gray-900">7-Day Free Trial</span>
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">POPULAR</span>
                            </div>
                            <p className="text-sm text-gray-600">Try everything free for 7 days. 3 AI assessments included. Cancel anytime.</p>
                          </div>
                        </label>

                        <label className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.offerChoice === '20percent-discount' ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'
                        }`}>
                          <input
                            type="radio"
                            name="offer"
                            value="20percent-discount"
                            checked={formData.offerChoice === '20percent-discount'}
                            onChange={(e) => setFormData({ ...formData, offerChoice: e.target.value })}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <TrendingUp className="w-5 h-5 text-primary" />
                              <span className="font-bold text-gray-900">Subscribe Now - 20% Off First Year</span>
                            </div>
                            <p className="text-sm text-gray-600">Skip the trial. Lock in 20% savings today and get instant unlimited access.</p>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div className="pt-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.consentMarketing}
                          onChange={(e) => setFormData({ ...formData, consentMarketing: e.target.checked })}
                          className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span className="text-sm text-gray-700">
                          I agree to be contacted about the Design Rite Challenge and receive automation tips. *
                        </span>
                      </label>

                      <p className="text-xs text-gray-500 mt-4 italic">
                        * Plans and promotional offers are subject to change. Discount applies to first year only.
                      </p>
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
                        Processing...
                      </>
                    ) : (
                      <>
                        {step < 3 ? 'Continue' : 'Accept the Challenge →'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
