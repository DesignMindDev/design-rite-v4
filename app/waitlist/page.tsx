'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function WaitlistPage() {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [facilities, setFacilities] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
  e.preventDefault()
  setIsSubmitting(true)

  try {
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        company,
        role,
        facilities,
        source: 'waitlist-page'
      })
    })

    const data = await response.json()
    console.log('Response:', data) // Debug log

    if (response.ok || data.success) {
      setIsSubmitted(true)
      console.log('✅ Lead captured:', email)
    } else {
      alert(data.error || 'Something went wrong')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Failed to join waitlist. Please try again.')
  } finally {
    setIsSubmitting(false)
  }
}
  if (isSubmitted) {
    return (
      <div className="min-h-screen dr-bg-charcoal dr-text-pearl flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="dr-heading-lg mb-6">Welcome to the Waitlist!</h1>
            <p className="dr-body text-gray-300 mb-8">
              Thank you for joining the Design-Rite early access program. We'll notify you as soon as the platform launches in Q4 2025.
            </p>
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 mb-8">
              <p className="text-green-300 font-semibold">
                ✅ You're now on the priority list for early access
              </p>
            </div>
            <Link
              href="/"
              className="dr-bg-violet hover:bg-purple-700 dr-text-pearl px-8 py-3 rounded-xl font-bold transition-all inline-block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen dr-bg-charcoal dr-text-pearl overflow-x-hidden">
      {/* Navigation Header */}
      <header className="bg-black/95 backdrop-blur-xl dr-border-violet py-4">
        <nav className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 dr-text-pearl font-black text-2xl">
            <div className="w-10 h-10 dr-bg-violet rounded-lg flex items-center justify-center font-black text-lg">
              DR
            </div>
            Design-Rite
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-300 hover:dr-text-pearl transition-colors">
              Back to Home
            </Link>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <section className="text-center mb-12">
            <div className="dr-text-violet dr-ui font-bold tracking-widest uppercase mb-4">
              Coming Soon
            </div>
            <h1 className="dr-heading-xl leading-tight mb-8 pb-2 dr-text-pearl">
              The AI Revolution in Security Design
            </h1>
            <p className="dr-body text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto">
              Design-Rite's AI-powered security assessment platform is launching in Q4 2025.
              Join our exclusive waitlist to get early access and transform your security design process.
            </p>
          </section>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Waitlist Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h2 className="dr-subheading dr-text-pearl mb-2">Join the Waitlist</h2>
              <p className="text-gray-300 dr-body mb-8">Get priority access when we launch. No spam, just updates.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block dr-text-pearl dr-ui font-semibold mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet focus:ring-2 focus:ring-purple-500/20"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="block dr-text-pearl dr-ui font-semibold mb-2">Company Name</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl placeholder-gray-400 focus:outline-none focus:dr-border-violet focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label className="block dr-text-pearl dr-ui font-semibold mb-2">Your Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl focus:outline-none focus:dr-border-violet focus:ring-2 focus:ring-purple-500/20"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>Select your role</option>
                    <option value="security_integrator" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>Security Integrator</option>
                    <option value="enterprise_security" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>Enterprise Security Manager</option>
                    <option value="consultant" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>Security Consultant</option>
                    <option value="education" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>Education/Healthcare</option>
                    <option value="other" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block dr-text-pearl dr-ui font-semibold mb-2">Number of Facilities</label>
                  <select
                    value={facilities}
                    onChange={(e) => setFacilities(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl dr-text-pearl focus:outline-none focus:dr-border-violet focus:ring-2 focus:ring-purple-500/20"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>Select range</option>
                    <option value="1-5" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>1-5 facilities</option>
                    <option value="6-25" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>6-25 facilities</option>
                    <option value="26-100" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>26-100 facilities</option>
                    <option value="100+" style={{ backgroundColor: '#1a1a2e', color: '#ffffff' }}>100+ facilities</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full dr-bg-violet hover:bg-purple-700 dr-text-pearl px-8 py-4 rounded-xl dr-ui font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Joining Waitlist...' : 'Join the Waitlist'}
                </button>

                <p className="dr-ui text-gray-400 text-center">
                  By joining, you agree to receive updates about Design-Rite. Unsubscribe anytime.
                </p>
              </form>
            </div>

            {/* What to Expect */}
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="dr-subheading dr-text-pearl mb-4">What's Coming</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <div className="dr-text-violet text-lg">🚀</div>
                    <span className="dr-body"><strong>Q4 2025 Launch:</strong> Full platform with AI assessment capabilities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-green-500 text-lg">⚡</div>
                    <span className="dr-body"><strong>90% Time Savings:</strong> Complete assessments in minutes, not days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-blue-500 text-lg">🤖</div>
                    <span className="dr-body"><strong>AI-Powered:</strong> Intelligent threat analysis and equipment recommendations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-yellow-500 text-lg">📋</div>
                    <span className="dr-body"><strong>Auto Proposals:</strong> Professional BOMs and pricing generated automatically</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="dr-subheading dr-text-pearl mb-4">Early Access Benefits</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <div className="text-green-500">✓</div>
                    <span className="dr-body">First access to the platform before public launch</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-green-500">✓</div>
                    <span className="dr-body">Special launch pricing (up to 50% off first year)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-green-500">✓</div>
                    <span className="dr-body">Direct feedback channel to product development team</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-green-500">✓</div>
                    <span className="dr-body">Priority customer support and onboarding</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-green-500">✓</div>
                    <span className="dr-body">Exclusive webinars and training sessions</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 dr-border-violet rounded-2xl p-6">
                <h3 className="dr-subheading dr-text-pearl mb-3">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-300 dr-body">Q1 2025: Alpha testing begins</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-300 dr-body">Q3 2025: Beta program for waitlist members</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-purple-300 dr-body">Q4 2025: Full platform launch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <section className="mt-20 text-center">
            <h2 className="dr-subheading dr-text-pearl mb-8">Trusted by Security Professionals</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-4">500+</div>
                <div className="dr-text-pearl dr-ui font-bold">Security Integrators</div>
                <div className="text-gray-400 dr-ui">Already on the waitlist</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-4">50+</div>
                <div className="dr-text-pearl dr-ui font-bold">Enterprise Teams</div>
                <div className="text-gray-400 dr-ui">Ready for early access</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-4">$2M+</div>
                <div className="dr-text-pearl dr-ui font-bold">Projected Savings</div>
                <div className="text-gray-400 dr-ui">For current waitlist members</div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="dr-bg-charcoal dr-border-violet py-12 mt-20">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p className="text-white/70 dr-ui">© 2025 Design-Rite. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/" className="text-white/70 hover:dr-text-violet dr-ui transition-colors">Home</Link>
            <Link href="/integrators" className="text-white/70 hover:dr-text-violet dr-ui transition-colors">Solutions</Link>
            <Link href="/contact" className="text-white/70 hover:dr-text-violet dr-ui transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

