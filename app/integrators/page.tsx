"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import UnifiedNavigation from '../components/UnifiedNavigation'

export default function IntegratorsPage() {
  const router = useRouter()

  const redirectToApp = () => {
    router.push('/app')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      <UnifiedNavigation activeSection="solutions" />

      {/* Main Content */}
      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Solutions for Security Integrators
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Transform Your Design Process
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            AI-powered security design tools built specifically for professional integrators. 
            Deliver faster assessments, more accurate proposals, and higher profit margins.
          </p>
        </section>

        {/* Key Benefits */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-4">10x Faster Assessments</h3>
              <p className="text-gray-400">Complete comprehensive security assessments in minutes instead of hours. Upload floor plans, answer guided questions, get professional results.</p>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-4">Higher Profit Margins</h3>
              <p className="text-gray-400">Reduce design time costs while delivering premium results. Take on more projects with the same team and increase your competitive advantage.</p>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-4">Professional Results</h3>
              <p className="text-gray-400">AI-generated proposals with detailed BOMs, compliance documentation, and professional formatting that impresses clients.</p>
            </div>
          </div>
        </section>

        {/* Features for Integrators */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Built for Professional Integrators</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🔍</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Intelligent Site Analysis</h3>
                  <p className="text-gray-400">Upload floor plans or site photos. Our AI identifies vulnerabilities, recommends device placement, and ensures optimal coverage.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">📋</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Automated Proposal Generation</h3>
                  <p className="text-gray-400">Generate client-ready proposals with detailed equipment lists, labor estimates, and implementation timelines.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">💼</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Custom Pricing Controls</h3>
                  <p className="text-gray-400">Set your markup rates, preferred vendors, and pricing models. Maintain full control over your business margins.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">📊</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Compliance Documentation</h3>
                  <p className="text-gray-400">Automatic compliance checking for CJIS, local codes, and industry standards. Never miss a requirement again.</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Example: Retail Store Assessment</h3>
              <div className="space-y-4 text-sm">
                <div className="bg-purple-600/20 p-3 rounded-lg border border-purple-600/30">
                  <div className="font-semibold text-purple-300">Site Analysis Complete</div>
                  <div className="text-gray-300">12,000 sq ft retail space analyzed</div>
                </div>
                <div className="bg-green-600/20 p-3 rounded-lg border border-green-600/30">
                  <div className="font-semibold text-green-300">Recommendations Generated</div>
                  <div className="text-gray-300">47 devices recommended across 8 zones</div>
                </div>
                <div className="bg-blue-600/20 p-3 rounded-lg border border-blue-600/30">
                  <div className="font-semibold text-blue-300">Proposal Ready</div>
                  <div className="text-gray-300">$89,500 project value, 23% margin</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-3xl p-12 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Calculate Your ROI</h2>
            <p className="text-gray-400 mb-10">See how much time and money you could save with Design-Rite</p>
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <div>
                <div className="text-3xl font-black text-purple-300 mb-2">15 hours</div>
                <div className="text-gray-400">Average time saved per project</div>
              </div>
              <div>
                <div className="text-3xl font-black text-purple-300 mb-2">$3,750</div>
                <div className="text-gray-400">Labor cost savings per project</div>
              </div>
              <div>
                <div className="text-3xl font-black text-purple-300 mb-2">40%</div>
                <div className="text-gray-400">Increase in project capacity</div>
              </div>
            </div>
            <button 
              onClick={redirectToApp} 
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all"
            >
              Start Your Free Trial
            </button>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">What Integrators Are Saying</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-4">"</div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                "Design-Rite has completely transformed our proposal process. What used to take us 2-3 days now takes 30 minutes. 
                Our win rate has increased 40% because we can respond to RFPs faster with more detailed proposals."
              </p>
              <div className="font-semibold text-purple-300">Regional Security Integrator</div>
              <div className="text-gray-400 text-sm">150+ projects completed</div>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-4">"</div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                "The AI catches things we might miss and ensures every proposal meets compliance requirements. 
                Our clients love the detailed documentation and professional presentation."
              </p>
              <div className="font-semibold text-purple-300">Commercial Security Solutions</div>
              <div className="text-gray-400 text-sm">500+ assessments completed</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600/10 to-purple-700/10 backdrop-blur-xl border border-purple-600/20 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Ready to Transform Your Business?</h2>
            <p className="text-xl text-gray-400 mb-10">
              Join hundreds of integrators who are already delivering faster, more accurate results with AI-powered design tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={redirectToApp} 
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all"
              >
                Start Free Trial
              </button>
              <Link 
                href="/contact" 
                className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all"
              >
                Schedule Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-purple-600/20 py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
            <div>
              <div className="flex items-center gap-3 text-white font-black text-2xl mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg">
                  DR
                </div>
                Design-Rite
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Transforming security system design with AI-powered intelligence. Professional assessments, 
                automated proposals, and comprehensive documentation for the modern security industry.
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
                <li><Link href="/integrators" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Security Integrators</Link></li>
                <li><Link href="/enterprise" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Enterprise</Link></li>
                <li><Link href="/education" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Education</Link></li>
                <li><Link href="/healthcare" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Healthcare</Link></li>
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
            <div className="flex gap-4 mt-4 md:mt-0">
              <Link href="mailto:hello@design-rite.com" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">📧</Link>
              <Link href="/linkedin" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">💼</Link>
              <Link href="/twitter" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">🐦</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
