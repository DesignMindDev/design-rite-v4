"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function IntegratorsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const redirectToApp = () => {
    window.location.href = '/app'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white">
      {/* Header */}
      <header className="bg-black/10 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50 py-5">
        <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-bold text-2xl">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-purple-600 font-black text-sm">
              DR
            </div>
            Design-Rite
          </Link>

          <ul className="hidden lg:flex items-center gap-8">
            <li><Link href="/platform" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Platform</Link></li>
            <li><Link href="/solutions" className="text-white bg-white/10 px-4 py-2 rounded-lg font-medium">Solutions</Link></li>
            <li><Link href="/partners" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Partners</Link></li>
            <li><Link href="/about" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">About</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Contact</Link></li>
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="text-white border-2 border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Sign In
            </Link>
            <button onClick={redirectToApp} className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all">
              Try Platform
            </button>
          </div>

          <button className="lg:hidden text-white text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto">
          <div className="text-purple-300 text-base font-semibold uppercase tracking-wider mb-4">
            Solutions for Security Integrators
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
            Transform Your Design Process
          </h1>
          <p className="text-xl text-white/80 leading-relaxed">
            AI-powered security design tools built specifically for professional integrators. 
            Deliver faster assessments, more accurate proposals, and higher profit margins.
          </p>
        </section>

        {/* Key Benefits */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-4">10x Faster Assessments</h3>
              <p className="text-white/80">Complete comprehensive security assessments in minutes instead of hours. Upload floor plans, answer guided questions, get professional results.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-4">Higher Profit Margins</h3>
              <p className="text-white/80">Reduce design time costs while delivering premium results. Take on more projects with the same team and increase your competitive advantage.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-4">Professional Results</h3>
              <p className="text-white/80">AI-generated proposals with detailed BOMs, compliance documentation, and professional formatting that impresses clients.</p>
            </div>
          </div>
        </section>

        {/* Features for Integrators */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16">Built for Professional Integrators</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🔍</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Intelligent Site Analysis</h3>
                  <p className="text-white/80">Upload floor plans or site photos. Our AI identifies vulnerabilities, recommends device placement, and ensures optimal coverage.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">📋</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Automated Proposal Generation</h3>
                  <p className="text-white/80">Generate client-ready proposals with detailed equipment lists, labor estimates, and implementation timelines.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">💼</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Custom Pricing Controls</h3>
                  <p className="text-white/80">Set your markup rates, preferred vendors, and pricing models. Maintain full control over your business margins.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">📊</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Compliance Documentation</h3>
                  <p className="text-white/80">Automatic compliance checking for CJIS, local codes, and industry standards. Never miss a requirement again.</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Example: Retail Store Assessment</h3>
              <div className="space-y-4 text-sm">
                <div className="bg-purple-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-purple-300">Site Analysis Complete</div>
                  <div className="text-white/80">12,000 sq ft retail space analyzed</div>
                </div>
                <div className="bg-green-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-green-300">Recommendations Generated</div>
                  <div className="text-white/80">47 devices recommended across 8 zones</div>
                </div>
                <div className="bg-blue-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-blue-300">Proposal Ready</div>
                  <div className="text-white/80">$89,500 project value, 23% margin</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 text-center">
            <h2 className="text-4xl font-bold mb-6">Calculate Your ROI</h2>
            <p className="text-white/80 mb-10">See how much time and money you could save with Design-Rite</p>
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <div>
                <div className="text-3xl font-black text-purple-300 mb-2">15 hours</div>
                <div className="text-white/80">Average time saved per project</div>
              </div>
              <div>
                <div className="text-3xl font-black text-purple-300 mb-2">$3,750</div>
                <div className="text-white/80">Labor cost savings per project</div>
              </div>
              <div>
                <div className="text-3xl font-black text-purple-300 mb-2">40%</div>
                <div className="text-white/80">Increase in project capacity</div>
              </div>
            </div>
            <button onClick={redirectToApp} className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all">
              Start Your Free Trial
            </button>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16">What Integrators Are Saying</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">"</div>
              <p className="text-white/90 mb-6 leading-relaxed">
                "Design-Rite has completely transformed our proposal process. What used to take us 2-3 days now takes 30 minutes. 
                Our win rate has increased 40% because we can respond to RFPs faster with more detailed proposals."
              </p>
              <div className="font-semibold text-purple-300">Regional Security Integrator</div>
              <div className="text-white/60 text-sm">150+ projects completed</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">"</div>
              <p className="text-white/90 mb-6 leading-relaxed">
                "The AI catches things we might miss and ensures every proposal meets compliance requirements. 
                Our clients love the detailed documentation and professional presentation."
              </p>
              <div className="font-semibold text-purple-300">Commercial Security Solutions</div>
              <div className="text-white/60 text-sm">500+ assessments completed</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Business?</h2>
            <p className="text-xl text-white/80 mb-10">
              Join hundreds of integrators who are already delivering faster, more accurate results with AI-powered design tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={redirectToApp} className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all">
                Start Free Trial
              </button>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/10 transition-all">
                Schedule Demo
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}