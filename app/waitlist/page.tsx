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
      <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white flex items-center justify-center px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-4xl font-bold mb-6">Welcome to the Waitlist!</h1>
            <p className="text-xl text-gray-300 mb-8">
              Thank you for joining the Design-Rite early access program. We'll notify you as soon as the platform launches in Q4 2025.
            </p>
            <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-6 mb-8">
              <p className="text-green-300 font-semibold">
                ✅ You're now on the priority list for early access
              </p>
            </div>
            <Link 
              href="/"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl font-bold transition-all inline-block"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Navigation Header */}
      <header className="bg-black/95 backdrop-blur-xl border-b border-purple-600/20 py-4">
        <nav className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-black text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg">
              DR
            </div>
            Design-Rite
          </Link>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
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
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
              Coming Soon
            </div>
            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              The AI Revolution in Security Design
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed mb-8 max-w-3xl mx-auto">
              Design-Rite's AI-powered security assessment platform is launching in Q4 2025. 
              Join our exclusive waitlist to get early access and transform your security design process.
            </p>
          </section>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Waitlist Form */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <h2 className="text-3xl font-bold text-white mb-2">Join the Waitlist</h2>
              <p className="text-gray-300 mb-8">Get priority access when we launch. No spam, just updates.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-semibold mb-2">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    placeholder="you@company.com"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Company Name</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                    placeholder="Your Company"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Your Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="">Select your role</option>
                    <option value="security_integrator">Security Integrator</option>
                    <option value="enterprise_security">Enterprise Security Manager</option>
                    <option value="consultant">Security Consultant</option>
                    <option value="education">Education/Healthcare</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">Number of Facilities</label>
                  <select
                    value={facilities}
                    onChange={(e) => setFacilities(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                  >
                    <option value="">Select range</option>
                    <option value="1-5">1-5 facilities</option>
                    <option value="6-25">6-25 facilities</option>
                    <option value="26-100">26-100 facilities</option>
                    <option value="100+">100+ facilities</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-8 py-4 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Joining Waitlist...' : 'Join the Waitlist'}
                </button>

                <p className="text-sm text-gray-400 text-center">
                  By joining, you agree to receive updates about Design-Rite. Unsubscribe anytime.
                </p>
              </form>
            </div>

            {/* What to Expect */}
            <div className="space-y-8">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">What's Coming</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <div className="text-purple-500 text-lg">🚀</div>
                    <span><strong>Q4 2025 Launch:</strong> Full platform with AI assessment capabilities</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-green-500 text-lg">⚡</div>
                    <span><strong>90% Time Savings:</strong> Complete assessments in minutes, not days</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-blue-500 text-lg">🤖</div>
                    <span><strong>AI-Powered:</strong> Intelligent threat analysis and equipment recommendations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-yellow-500 text-lg">📋</div>
                    <span><strong>Auto Proposals:</strong> Professional BOMs and pricing generated automatically</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <h3 className="text-2xl font-bold text-white mb-4">Early Access Benefits</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <div className="text-green-500">✓</div>
                    <span>First access to the platform before public launch</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-green-500">✓</div>
                    <span>Special launch pricing (up to 50% off first year)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-green-500">✓</div>
                    <span>Direct feedback channel to product development team</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-green-500">✓</div>
                    <span>Priority customer support and onboarding</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="text-green-500">✓</div>
                    <span>Exclusive webinars and training sessions</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-3">Timeline</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-300">Q1 2025: Alpha testing begins</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-300">Q3 2025: Beta program for waitlist members</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span className="text-purple-300">Q4 2025: Full platform launch</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof */}
          <section className="mt-20 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">Trusted by Security Professionals</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-4">500+</div>
                <div className="text-white font-bold">Security Integrators</div>
                <div className="text-gray-400 text-sm">Already on the waitlist</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-4">50+</div>
                <div className="text-white font-bold">Enterprise Teams</div>
                <div className="text-gray-400 text-sm">Ready for early access</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
                <div className="text-4xl mb-4">$2M+</div>
                <div className="text-white font-bold">Projected Savings</div>
                <div className="text-gray-400 text-sm">For current waitlist members</div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-purple-600/20 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p className="text-white/70">© 2025 Design-Rite. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/" className="text-white/70 hover:text-purple-600 text-sm transition-colors">Home</Link>
            <Link href="/integrators" className="text-white/70 hover:text-purple-600 text-sm transition-colors">Solutions</Link>
            <Link href="/contact" className="text-white/70 hover:text-purple-600 text-sm transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}


