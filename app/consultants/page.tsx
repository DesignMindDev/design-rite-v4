"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import UnifiedNavigation from '../components/UnifiedNavigation'

export default function ConsultantsPage() {
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
            Security Consultants
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Expert-Level Assessments Powered by AI
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Leverage AI to enhance your consulting expertise. Deliver comprehensive assessments, 
            detailed risk analyses, and strategic security recommendations faster than ever before.
          </p>
        </section>

        {/* Key Benefits */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-4">🧠</div>
              <h3 className="text-xl font-bold mb-4">Enhanced Expertise</h3>
              <p className="text-gray-400">AI amplifies your professional knowledge with comprehensive threat databases, latest compliance standards, and industry best practices.</p>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-4">Comprehensive Reports</h3>
              <p className="text-gray-400">Generate executive-level security assessments with detailed risk matrices, compliance gaps, and strategic recommendations.</p>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-4">Accelerated Delivery</h3>
              <p className="text-gray-400">Complete thorough assessments in hours instead of weeks. Take on more clients while maintaining the highest quality standards.</p>
            </div>
          </div>
        </section>

        {/* Consultant-Specific Features */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Built for Security Consulting Excellence</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🔍</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Advanced Risk Assessment</h3>
                  <p className="text-gray-400">Multi-layered threat analysis incorporating physical, cyber, and operational security vectors with quantified risk scoring.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">📋</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Executive Reporting</h3>
                  <p className="text-gray-400">Board-ready reports with executive summaries, ROI justifications, and strategic security roadmaps tailored for C-suite audiences.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🏛️</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Regulatory Compliance</h3>
                  <p className="text-gray-400">Comprehensive compliance analysis for CJIS, SOX, FERPA, HIPAA, and industry-specific regulations with gap assessments.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">📈</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Strategic Planning</h3>
                  <p className="text-gray-400">Long-term security strategies with phased implementation plans, budget forecasting, and performance metrics.</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Sample: Corporate Campus Assessment</h3>
              <div className="space-y-4 text-sm">
                <div className="bg-red-600/20 p-3 rounded-lg border border-red-600/30">
                  <div className="font-semibold text-red-300">Critical Vulnerabilities</div>
                  <div className="text-gray-300">12 high-risk areas identified</div>
                </div>
                <div className="bg-yellow-600/20 p-3 rounded-lg border border-yellow-600/30">
                  <div className="font-semibold text-yellow-300">Compliance Gaps</div>
                  <div className="text-gray-300">CJIS Level 3 requirements not met</div>
                </div>
                <div className="bg-green-600/20 p-3 rounded-lg border border-green-600/30">
                  <div className="font-semibold text-green-300">Strategic Recommendations</div>
                  <div className="text-gray-300">3-phase security enhancement plan</div>
                </div>
                <div className="bg-blue-600/20 p-3 rounded-lg border border-blue-600/30">
                  <div className="font-semibold text-blue-300">ROI Analysis</div>
                  <div className="text-gray-300">18-month payback period</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Consultant Use Cases */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Consultant-Specific Applications</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <h3 className="text-xl font-bold mb-4">🏢 Enterprise Security Audits</h3>
              <p className="text-gray-400 mb-4">
                Comprehensive security posture assessments for large corporations including multi-site analysis, 
                policy reviews, and strategic security planning.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Executive-level risk assessments</li>
                <li>• Compliance gap analysis</li>
                <li>• Security ROI justifications</li>
                <li>• Strategic roadmap development</li>
              </ul>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <h3 className="text-xl font-bold mb-4">⚖️ Legal & Insurance Support</h3>
              <p className="text-gray-400 mb-4">
                Expert witness services, litigation support, and insurance claim analysis with 
                detailed forensic security assessments and professional testimony preparation.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Forensic security analysis</li>
                <li>• Expert witness reports</li>
                <li>• Insurance claim support</li>
                <li>• Litigation documentation</li>
              </ul>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <h3 className="text-xl font-bold mb-4">🏛️ Government & Critical Infrastructure</h3>
              <p className="text-gray-400 mb-4">
                Specialized assessments for government facilities, critical infrastructure, 
                and high-security environments with advanced threat modeling and countermeasures.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• CJIS compliance validation</li>
                <li>• Critical infrastructure protection</li>
                <li>• Threat modeling & analysis</li>
                <li>• Security clearance documentation</li>
              </ul>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <h3 className="text-xl font-bold mb-4">📚 Training & Education</h3>
              <p className="text-gray-400 mb-4">
                Educational institution security assessments, security awareness training development, 
                and specialized programs for educational environments.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Campus security assessments</li>
                <li>• FERPA compliance reviews</li>
                <li>• Emergency response planning</li>
                <li>• Security training curricula</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Professional Value Proposition */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-3xl p-12 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
            <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Why Top Consultants Choose Design-Rite</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  🎓 Professional Credibility
                </h3>
                <p className="text-gray-400 mb-4">
                  AI-powered assessments backed by industry expertise enhance your professional reputation 
                  and provide unmatched depth of analysis that clients expect from top-tier consultants.
                </p>
                <ul className="text-gray-300 space-y-2">
                  <li>• Industry-leading methodologies</li>
                  <li>• Comprehensive documentation</li>
                  <li>• Professional presentation quality</li>
                  <li>• Defensible recommendations</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  📈 Business Growth
                </h3>
                <p className="text-gray-400 mb-4">
                  Deliver more comprehensive assessments in less time, allowing you to take on more clients 
                  while maintaining the highest standards of professional excellence.
                </p>
                <ul className="text-gray-300 space-y-2">
                  <li>• 5x faster assessment delivery</li>
                  <li>• Higher client satisfaction rates</li>
                  <li>• Premium pricing justification</li>
                  <li>• Expanded service capabilities</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Trusted by Security Professionals</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-4">"</div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                "Design-Rite's AI platform has elevated the quality of my security assessments significantly. 
                My clients are impressed with the depth of analysis and professional presentation. 
                It's like having a team of experts at my fingertips."
              </p>
              <div className="font-semibold text-purple-300">Senior Security Consultant</div>
              <div className="text-gray-400 text-sm">20+ years experience, Fortune 500 clients</div>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-4">"</div>
              <p className="text-gray-300 mb-6 leading-relaxed">
                "The compliance analysis features have been invaluable for my government contracting work. 
                Design-Rite ensures I never miss a regulatory requirement and helps me deliver 
                assessments that exceed client expectations."
              </p>
              <div className="font-semibold text-purple-300">Government Security Specialist</div>
              <div className="text-gray-400 text-sm">CJIS certified, federal contracting</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600/10 to-purple-700/10 backdrop-blur-xl border border-purple-600/20 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Elevate Your Consulting Practice</h2>
            <p className="text-xl text-gray-400 mb-10">
              Join the select group of security consultants leveraging AI to deliver unparalleled 
              expertise and accelerated results for their most demanding clients.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={redirectToApp} 
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all"
              >
                Start Professional Trial
              </button>
              <Link 
                href="/contact" 
                className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all"
              >
                Schedule Consultation
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
