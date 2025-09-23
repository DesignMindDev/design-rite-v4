"use client"

import { useState } from 'react'
import Link from 'next/link'
import UnifiedNavigation from './components/UnifiedNavigation';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const redirectToWaitlist = () => {
    window.location.href = '/waitlist'
  }

  const scheduleDemo = () => {
    window.location.href = '/watch-demo'
  }

  return (
    <div className="min-h-screen dr-bg-charcoal dr-text-pearl overflow-x-hidden">
      {/* Main Navigation Header */}
      <UnifiedNavigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="max-w-2xl">
            <div className="dr-text-violet dr-ui font-bold tracking-widest uppercase mb-4">
              AI-Powered Security Design
            </div>
            <h1 className="dr-heading-xl dr-text-pearl leading-tight mb-8 pb-2">
              Design right, with AI insight
            </h1>
            <p className="dr-body text-gray-300 mb-10 leading-relaxed">
              Revolutionary AI platform that transforms security system design. Generate comprehensive assessments, detailed proposals, and professional documentation in minutes, not days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={redirectToWaitlist}
                className="dr-bg-violet dr-text-pearl px-8 py-4 rounded-xl dr-ui font-bold hover:shadow-xl transition-all"
              >
                Join Waitlist - Free Early Access
              </button>
              <button
                onClick={scheduleDemo}
                className="bg-white/10 dr-text-pearl px-8 py-4 rounded-xl dr-ui font-semibold border border-white/20 hover:bg-white/20 transition-all"
              >
                Watch Demo
              </button>
            </div>
            <div className="flex gap-12">
              <div>
                <span className="text-3xl font-black dr-text-violet block">10x</span>
                <span className="text-gray-400 dr-ui font-medium">Faster Design</span>
              </div>
              <div>
                <span className="text-3xl font-black dr-text-violet block">95%</span>
                <span className="text-gray-400 dr-ui font-medium">Accuracy Rate</span>
              </div>
              <div>
                <span className="text-3xl font-black dr-text-violet block">500+</span>
                <span className="text-gray-400 dr-ui font-medium">Integrators</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/80 backdrop-blur-xl dr-border-violet rounded-3xl p-8 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="dr-subheading font-bold dr-text-pearl">Security Assessment Dashboard</h3>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                Coming Q4 2025
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-violet-600/10 p-4 rounded-xl dr-border-violet">
                <span className="text-2xl font-black dr-text-violet block">147</span>
                <span className="text-gray-400 dr-ui">Devices Analyzed</span>
              </div>
              <div className="bg-violet-600/10 p-4 rounded-xl dr-border-violet">
                <span className="text-2xl font-black dr-text-violet block">$187K</span>
                <span className="text-gray-400 dr-ui">Project Value</span>
              </div>
              <div className="bg-violet-600/10 p-4 rounded-xl dr-border-violet">
                <span className="text-2xl font-black dr-text-violet block">98.2%</span>
                <span className="text-gray-400 dr-ui">Coverage Score</span>
              </div>
              <div className="bg-violet-600/10 p-4 rounded-xl dr-border-violet">
                <span className="text-2xl font-black dr-text-violet block">12</span>
                <span className="text-gray-400 dr-ui">Zones Secured</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black/50">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2 className="dr-heading-lg font-black mb-6 pb-2 dr-text-pearl">
            Intelligent Security Design Platform
          </h2>
          <p className="dr-body text-gray-300 mb-16 max-w-2xl mx-auto">
            Powered by advanced AI algorithms trained on thousands of security installations.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-8 text-left hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 dr-bg-violet rounded-xl flex items-center justify-center text-2xl mb-6">
                🧠
              </div>
              <h3 className="dr-subheading font-bold dr-text-pearl mb-4">AI-Powered Analysis</h3>
              <p className="dr-body text-gray-300 mb-6 leading-relaxed">
                Advanced AI analyzes facility requirements and generates comprehensive security assessments.
              </p>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-8 text-left hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 dr-bg-violet rounded-xl flex items-center justify-center text-2xl mb-6">
                📋
              </div>
              <h3 className="dr-subheading font-bold dr-text-pearl mb-4">Professional Proposals</h3>
              <p className="dr-body text-gray-300 mb-6 leading-relaxed">
                Generate client-ready proposals with detailed BOMs and compliance documentation.
              </p>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl dr-border-violet rounded-2xl p-8 text-left hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 dr-bg-violet rounded-xl flex items-center justify-center text-2xl mb-6">
                🏢
              </div>
              <h3 className="dr-subheading font-bold dr-text-pearl mb-4">White-Label Solutions</h3>
              <p className="dr-body text-gray-300 mb-6 leading-relaxed">
                Brand our platform as your own with complete customization options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-violet-600/10 to-violet-700/10">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="dr-heading-lg font-black dr-text-pearl mb-4">
            Ready to Transform Your Design Process?
          </h2>
          <p className="dr-body text-gray-300 mb-10">
            Join hundreds of security integrators on our waitlist for early access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={redirectToWaitlist}
              className="dr-bg-violet dr-text-pearl px-8 py-4 rounded-xl dr-ui font-bold hover:shadow-xl transition-all"
            >
              Join Waitlist - Free Early Access
            </button>
            <Link className="bg-white/10 dr-text-pearl px-8 py-4 rounded-xl dr-ui font-semibold border border-white/20 hover:bg-white/20 transition-all inline-block text-center" href="/contact">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="dr-bg-charcoal border-t dr-border-violet py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
            <div>
              <div className="flex items-center gap-3 dr-text-pearl font-black text-2xl mb-4">
                <div className="w-10 h-10 dr-bg-violet rounded-lg flex items-center justify-center font-black text-lg">
                  DR
                </div>
                Design-Rite
              </div>
              <p className="dr-body text-gray-300 leading-relaxed">
                Transforming security system design with AI-powered intelligence.
              </p>
            </div>
            <div>
              <h3 className="dr-text-pearl dr-ui font-bold mb-4">Solutions</h3>
              <ul className="space-y-2">
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/integrators">Security Integrators</Link></li>
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/enterprise">Enterprise</Link></li>
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/education">Education</Link></li>
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/consultants">Consultants</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="dr-text-pearl dr-ui font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/about">About Us</Link></li>
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/contact">Contact</Link></li>
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/careers">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="dr-text-pearl dr-ui font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/pricing">Pricing</Link></li>
                <li><Link className="text-gray-300 hover:dr-text-violet dr-ui transition-colors" href="/waitlist">Join Waitlist</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600/30 pt-8 text-center text-gray-400 dr-ui">
            <div className="dr-ui">© 2025 Design-Rite. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}