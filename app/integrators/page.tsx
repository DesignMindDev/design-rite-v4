// File: app/integrators/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SecurityIntegratorsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const redirectToApp = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      window.location.href = '/login-trial.html'
    } else {
      window.location.href = '/login-trial.html'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
      {/* Top Contact Bar */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 py-2">
        <div className="max-w-6xl mx-auto px-8 flex justify-between items-center text-sm">
          <div className="text-white/80">
            🚀 <strong>Ready to transform your design process?</strong> Start your free trial today!
          </div>
          <div className="flex gap-6">
            <Link href="/support" className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2">
              <span>❓</span> Help Center
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2">
              <span>📧</span> Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 left-0 right-0 z-[1000] bg-black/95 backdrop-blur-xl border-b border-purple-600/20 py-4">
        <nav className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-black text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg">
              DR
            </div>
            Design-Rite
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-10">
            <li className="relative group">
              <Link href="#platform" className="text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full">
                Platform
              </Link>
            </li>
            <li className="relative group">
              <Link href="#solutions" className="text-purple-600 font-medium transition-all relative py-2 block text-sm after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700">
                Solutions
              </Link>
              <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">
                <Link href="/integrators" className="flex items-center gap-4 p-3 rounded-lg text-purple-600 bg-purple-600/10 transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/30 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🔧
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-purple-300 mb-1">Security Integrators</div>
                    <div className="text-xs text-purple-400 leading-tight">Design & proposal automation</div>
                  </div>
                </Link>
                <Link href="/enterprise" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🏢
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Enterprise Security</div>
                    <div className="text-xs text-gray-400 leading-tight">In-house team solutions</div>
                  </div>
                </Link>
                <Link href="/education" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🎓
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Education & Healthcare</div>
                    <div className="text-xs text-gray-400 leading-tight">Specialized compliance tools</div>
                  </div>
                </Link>
                <Link href="/consultants" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    💼
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Security Consultants</div>
                    <div className="text-xs text-gray-400 leading-tight">Expert advisory services</div>
                  </div>
                </Link>
              </div>
            </li>
            <li>
              <Link href="/partners" className="text-gray-300 hover:text-purple-600 font-medium transition-all text-sm">
                Partners
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-300 hover:text-purple-600 font-medium transition-all text-sm">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-300 hover:text-purple-600 font-medium transition-all text-sm">
                Contact
              </Link>
            </li>
          </ul>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <button 
              onClick={redirectToApp}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all btn-hover-lift"
            >
              Try Platform
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white text-2xl p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/20 backdrop-blur-sm border-t border-white/10">
            <div className="px-6 py-4 space-y-4">
              <Link href="/integrators" className="block text-purple-600 font-medium py-2">Security Integrators</Link>
              <Link href="/enterprise" className="block text-white/80 hover:text-white py-2">Enterprise Security</Link>
              <Link href="/education" className="block text-white/80 hover:text-white py-2">Education & Healthcare</Link>
              <Link href="/consultants" className="block text-white/80 hover:text-white py-2">Security Consultants</Link>
              <div className="pt-4 border-t border-white/10">
                <Link href="/login" className="block text-white/80 hover:text-white py-2">Sign In</Link>
                <button onClick={redirectToApp} className="block w-full text-left bg-purple-600 text-white px-4 py-2 rounded-lg mt-2">
                  Try Platform
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Security Integrators
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Transform Your Design Process with AI
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-8">
            Deliver professional security assessments and proposals in minutes, not days. 
            Increase efficiency, reduce costs, and win more projects with AI-powered automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={redirectToApp}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all btn-hover-lift text-lg"
            >
              🚀 Start Free Trial
            </button>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all text-lg"
            >
              📞 Schedule Demo
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
          <div className="glass rounded-2xl p-8 text-center hover:-translate-y-2 transition-all">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-4">AI Site Assessment</h3>
            <p className="text-gray-300">
              Upload floor plans or photos and get comprehensive threat analysis with 
              equipment recommendations in minutes.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 text-center hover:-translate-y-2 transition-all">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-4">Automated Proposals</h3>
            <p className="text-gray-300">
              Generate professional BOMs, installation diagrams, and pricing 
              automatically based on assessment results.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 text-center hover:-translate-y-2 transition-all">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-white mb-4">Custom Pricing</h3>
            <p className="text-gray-300">
              Set your markup rates, labor costs, and profit margins for 
              accurate pricing that fits your business model.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 text-center hover:-translate-y-2 transition-all">
            <div className="text-4xl mb-4">🏷️</div>
            <h3 className="text-xl font-bold text-white mb-4">White-Label Ready</h3>
            <p className="text-gray-300">
              Brand the platform with your logo, colors, and company information 
              for seamless client presentations.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 text-center hover:-translate-y-2 transition-all">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-4">Project Management</h3>
            <p className="text-gray-300">
              Track projects, manage client communications, and monitor 
              installation progress from one dashboard.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 text-center hover:-translate-y-2 transition-all">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-4">10x Faster</h3>
            <p className="text-gray-300">
              Complete assessments that used to take days in under 30 minutes. 
              More projects, higher profits, happier clients.
            </p>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 mb-20 max-w-4xl mx-auto border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Calculate Your ROI with Design-Rite
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Without Design-Rite:</h3>
              <ul className="space-y-3 text-gray-300">
                <li>⏱️ 8-16 hours per assessment</li>
                <li>📋 Manual proposal creation</li>
                <li>❌ Higher error rates</li>
                <li>💸 Lost opportunities due to slow turnaround</li>
                <li>😤 Client frustration with delays</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">With Design-Rite:</h3>
              <ul className="space-y-3 text-green-400">
                <li>⚡ 30 minutes per assessment</li>
                <li>🤖 Automated proposal generation</li>
                <li>✅ AI-verified accuracy</li>
                <li>🚀 Same-day proposal delivery</li>
                <li>😊 Impressed clients, more referrals</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8">
            <div className="text-2xl font-bold text-white mb-4">
              💡 Potential Savings: <span className="text-green-400">$50,000+</span> per year
            </div>
            <p className="text-gray-300 mb-6">
              Based on completing 2x more projects with 90% less time investment
            </p>
            <button 
              onClick={redirectToApp}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold transition-all btn-hover-lift"
            >
              Start Saving Today
            </button>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What Security Integrators Are Saying
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 mb-4">
                "Design-Rite cut our assessment time from 2 days to 30 minutes. 
                We're now completing 3x more projects and our clients love the fast turnaround."
              </p>
              <div className="text-white font-bold">- Mike Rodriguez, SecureMax Solutions</div>
            </div>

            <div className="glass rounded-2xl p-8">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 mb-4">
                "The AI recommendations are spot-on and the automated proposals look incredibly professional. 
                Our close rate has increased by 40%."
              </p>
              <div className="text-white font-bold">- Sarah Chen, Guardian Tech Systems</div>
            </div>

            <div className="glass rounded-2xl p-8">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 mb-4">
                "White-labeling was seamless. Our clients think we built this amazing tool in-house. 
                It's given us a huge competitive advantage."
              </p>
              <div className="text-white font-bold">- David Park, Elite Security Integration</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join hundreds of security integrators who have revolutionized their design process with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={redirectToApp}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all btn-hover-lift text-lg"
            >
              🚀 Start Free Trial - No Credit Card Required
            </button>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all text-lg"
            >
              📞 Talk to Our Team
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-purple-600/20 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-3 text-white font-black text-xl mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-sm">
                  DR
                </div>
                Design-Rite
              </Link>
              <p className="text-gray-400 text-sm">
                Professional assessments, automated proposals, and comprehensive documentation for the modern security industry.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-purple-600 text-sm transition-colors">AI Assessment</button></li>
                <li><Link href="/proposals" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Proposal Generator</Link></li>
                <li><Link href="/white-label" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">White-Label</Link></li>
                <li><Link href="/api" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">API Access</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Solutions</h3>
              <ul className="space-y-2">
                <li><Link href="/integrators" className="text-purple-600 font-medium text-sm transition-colors">Security Integrators</Link></li>
                <li><Link href="/enterprise" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Enterprise</Link></li>
                <li><Link href="/education" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Education & Healthcare</Link></li>
                <li><Link href="/consultants" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Consultants</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Contact</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600/30 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <div>© 2025 Design-Rite. All rights reserved.</div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <Link href="/privacy" className="hover:text-purple-600 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-purple-600 transition-colors">Terms of Service</Link>
              <Link href="/security" className="hover:text-purple-600 transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}