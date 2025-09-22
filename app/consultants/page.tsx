'use client'

import { useState } from 'react'
import Link from 'next/link'
import UnifiedNavigation from '../components/UnifiedNavigation';

export default function ConsultantsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const redirectToWaitlist = () => {
    window.location.href = '/waitlist'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 text-center text-sm font-semibold relative z-[1001]">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-4">
          <span className="text-base">🤝</span>
          <span className="flex-1 text-center">
            Security Consultants: Elevate your advisory services with AI-powered tools
          </span>
          <Link
            href="/contact"
            className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-white/30 transition-all border border-white/30"
          >
            Partner With Us
          </Link>
          <button className="text-white text-lg opacity-70 hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center">
            ×
          </button>
        </div>
      </div>


      {/* Main Navigation Header */}
<UnifiedNavigation />

      {/* Main Content */}
      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Security Consultants
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Elevate Your Advisory Services
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-8">
            Empower your consulting practice with AI-driven security assessments, compliance tools, 
            and white-label solutions that position you as the industry expert.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/waitlist"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all text-lg inline-block text-center"
            >
              🤝 Partner With Design-Rite
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all text-lg inline-block text-center"
            >
              📅 Schedule Consultation
            </Link>
          </div>
        </section>

        {/* Consultant Benefits Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-white mb-4">Expert Assessments</h3>
            <p className="text-gray-300">
              Generate comprehensive security assessments backed by AI analysis and 
              industry best practices in minutes.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-white mb-4">White-Label Platform</h3>
            <p className="text-gray-300">
              Brand our entire platform as your own, offering clients cutting-edge 
              technology under your company name.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-bold text-white mb-4">Compliance Reports</h3>
            <p className="text-gray-300">
              Automatically generate compliance documentation for various standards 
              including SOC 2, ISO 27001, and HIPAA.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-xl font-bold text-white mb-4">Strategic Insights</h3>
            <p className="text-gray-300">
              Leverage AI-powered analytics to provide data-driven recommendations 
              and strategic security roadmaps.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-white mb-4">Scale Your Practice</h3>
            <p className="text-gray-300">
              Handle more clients efficiently with automated workflows and 
              AI-assisted documentation generation.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">🎆</div>
            <h3 className="text-xl font-bold text-white mb-4">Partner Support</h3>
            <p className="text-gray-300">
              Dedicated consultant success team, training resources, and 
              co-marketing opportunities to grow your business.
            </p>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 mb-20 max-w-4xl mx-auto border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Why Top Consultants Choose Design-Rite
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">5x</div>
              <div className="text-white font-bold mb-2">Faster Delivery</div>
              <div className="text-gray-300 text-sm">
                Complete assessments in hours instead of weeks
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">3x</div>
              <div className="text-white font-bold mb-2">More Clients</div>
              <div className="text-gray-300 text-sm">
                Handle more engagements with automated workflows
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">50%</div>
              <div className="text-white font-bold mb-2">Higher Margins</div>
              <div className="text-gray-300 text-sm">
                Reduce operational costs while increasing value
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-300 mb-6">
              Join our exclusive consultant partner program and transform your practice
            </p>
            <Link
              href="/waitlist"
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold transition-all inline-block"
            >
              Apply for Partnership
            </Link>
          </div>
        </section>

        {/* Service Offerings */}
        <section className="mb-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Consultant Service Offerings
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-2xl p-8 border border-purple-600/30">
              <h3 className="text-2xl font-bold text-white mb-4">Security Assessments</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">?</span>
                  <span>Physical security audits with AI-powered analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">?</span>
                  <span>Vulnerability assessments and risk scoring</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">?</span>
                  <span>Compliance gap analysis and remediation plans</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">?</span>
                  <span>Executive-ready reports and presentations</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-2xl p-8 border border-purple-600/30">
              <h3 className="text-2xl font-bold text-white mb-4">Strategic Advisory</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">?</span>
                  <span>Security program development and maturity modeling</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">?</span>
                  <span>Technology stack recommendations and roadmaps</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">?</span>
                  <span>Budget optimization and ROI analysis</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">?</span>
                  <span>Vendor evaluation and selection support</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Consulting Practice?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join leading security consultants who deliver exceptional value with Design-Rite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/waitlist"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all text-lg inline-block text-center"
            >
              🤝 Apply for Partnership
            </Link>
            <Link
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all text-lg inline-block text-center"
            >
              📅 Schedule Consultation
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-purple-600/20 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <p className="text-white/70">© 2025 Design-Rite. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/" className="text-white/70 hover:text-purple-600 text-sm transition-colors">Home</Link>
            <Link href="/about" className="text-white/70 hover:text-purple-600 text-sm transition-colors">About</Link>
            <Link href="/careers" className="text-white/70 hover:text-purple-600 text-sm transition-colors">Careers</Link>
            <Link href="/contact" className="text-white/70 hover:text-purple-600 text-sm transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}



