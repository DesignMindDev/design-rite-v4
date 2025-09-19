"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function SubscribePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const router = useRouter()

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        source: 'subscribe-page'
      })
    })

    const data = await response.json()
    
    if (response.ok || data.success) {
      setIsSubmitted(true)
      console.log('✅ Subscriber added:', email)
    } else {
      alert(data.error || 'Something went wrong. Please try again.')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Failed to subscribe. Please try again.')
  }
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Header */}
      <header className="bg-black/10 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50 py-5">
        <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-bold text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-black text-sm">
              DR
            </div>
            Design-Rite
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            <li><Link href="/integrators" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Security Integrators</Link></li>
            <li><Link href="/enterprise" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Enterprise</Link></li>
            <li><Link href="/education" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Education</Link></li>
            <li><Link href="/solutions" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Solutions</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Contact</Link></li>
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="text-white border-2 border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Sign In
            </Link>
            <button 
              onClick={() => router.push('/app')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
            >
              Try Platform
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/20 backdrop-blur-sm border-t border-white/10">
            <div className="px-6 py-4 space-y-4">
              <Link href="/integrators" className="block text-white/80 hover:text-white transition-colors py-2">Security Integrators</Link>
              <Link href="/enterprise" className="block text-white/80 hover:text-white transition-colors py-2">Enterprise</Link>
              <Link href="/education" className="block text-white/80 hover:text-white transition-colors py-2">Education</Link>
              <Link href="/solutions" className="block text-white/80 hover:text-white transition-colors py-2">Solutions</Link>
              <Link href="/contact" className="block text-white/80 hover:text-white transition-colors py-2">Contact</Link>
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link href="/login" className="block text-center text-white border-2 border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
                  Sign In
                </Link>
                <button 
                  onClick={() => router.push('/app')}
                  className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
                >
                  Try Platform
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-8 pt-20 pb-16 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-full px-6 py-3 text-sm font-medium mb-8">
              <span className="text-2xl">🚀</span>
              <span>Early Access Launch - Q4 2025</span>
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Join the <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">AI Revolution</span> in Security Design
          </h1>
          
          <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            Be among the first to experience Design-Rite's revolutionary AI platform. Transform security system design from days to minutes with intelligent assessments and automated proposals.
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                  className="flex-1 px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-purple-500/25"
                >
                  Join Waitlist
                </button>
              </div>
              <p className="text-sm text-white/60">
                🔒 Your information is secure and will never be shared. Unsubscribe anytime.
              </p>
            </form>
          ) : (
            <div className="max-w-lg mx-auto">
              <div className="bg-gradient-to-r from-green-600/20 to-green-700/20 border border-green-500/30 rounded-xl p-8 text-center">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-2xl font-bold mb-4 text-green-400">Welcome to the Future!</h3>
                <p className="text-white/80 mb-6">
                  You're now on the Design-Rite early access list. We'll notify you as soon as the platform launches in Q4 2025.
                </p>
                <Link 
                  href="/"
                  className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
                >
                  Return to Home
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Benefits Section */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Why Join Early Access?</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-4xl mb-4">🥇</div>
              <h3 className="text-xl font-bold mb-4">First Access</h3>
              <p className="text-white/80">Be among the first to experience revolutionary AI-powered security design before general release.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-4">Special Pricing</h3>
              <p className="text-white/80">Lock in exclusive early-bird pricing with significant savings on all subscription tiers.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-4">Expert Training</h3>
              <p className="text-white/80">Receive personalized onboarding and training to maximize your success with the platform.</p>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="max-w-4xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Launch Timeline</h2>
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                Q2
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Platform Development Complete</h3>
                <p className="text-white/80">AI algorithms finalized, user interface perfected, and initial testing completed.</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                Q3
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Beta Testing Program</h3>
                <p className="text-white/80">Selected early access members begin private beta testing and provide feedback.</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-700 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                Q4
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2 text-green-400">Public Launch</h3>
                <p className="text-white/80">Full platform launch with all features available to early access members first.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-purple-600/20 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 text-white font-bold text-2xl mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-black text-sm">
                  DR
                </div>
                Design-Rite
              </Link>
              <p className="text-white/70 text-lg leading-relaxed max-w-md">
                Revolutionary AI-powered platform transforming security system design through intelligent automation and expert-level analysis.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Solutions</h4>
              <ul className="space-y-3">
                <li><Link href="/integrators" className="text-white/70 hover:text-white transition-colors">Security Integrators</Link></li>
                <li><Link href="/enterprise" className="text-white/70 hover:text-white transition-colors">Enterprise Security</Link></li>
                <li><Link href="/education" className="text-white/70 hover:text-white transition-colors">Education & Healthcare</Link></li>
                <li><Link href="/consultants" className="text-white/70 hover:text-white transition-colors">Security Consultants</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-white/70 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="text-white/70 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-white/70 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/60">
              © 2025 Design-Rite™. All rights reserved. | Revolutionary AI-Powered Security Solutions
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}


