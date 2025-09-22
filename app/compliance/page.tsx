"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import UnifiedNavigation from '../components/UnifiedNavigation';
import EmailGate from '../components/EmailGate';
import { useAuthCache } from '../hooks/useAuthCache';

export default function CompliancePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const router = useRouter()
  const { isAuthenticated, extendSession } = useAuthCache()

  const handleStartAssessment = () => {
    if (isAuthenticated) {
      extendSession()
      router.push('/ai-assessment')
    } else {
      setShowEmailGate(true)
    }
  }

  const handleEmailGateSuccess = () => {
    setShowEmailGate(false)
    router.push('/ai-assessment')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 text-center text-sm font-semibold relative z-[1001]">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-4">
          <span className="text-base">🚀</span>
          <span className="flex-1 text-center">
            Design-Rite's Revolutionary AI is launching Q4 2025 - Join the waitlist for early access to security design mastery
          </span>
          <Link
            href="/subscribe"
            className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-white/30 transition-all border border-white/30"
          >
            Join Waitlist
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
          <div className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Regulatory Compliance Hub
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Security Compliance Made Simple
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Navigate complex regulatory requirements with AI-powered compliance validation.
            Ensure your security systems meet industry standards and regulatory mandates across all sectors.
          </p>
        </section>

        {/* Compliance Overview Stats */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-green-600/20 rounded-2xl p-6 text-center hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-3">📋</div>
              <div className="text-2xl font-bold text-green-400 mb-2">15+</div>
              <div className="text-gray-400 text-sm">Regulatory Frameworks</div>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-blue-600/20 rounded-2xl p-6 text-center hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-3">🔍</div>
              <div className="text-2xl font-bold text-blue-400 mb-2">500+</div>
              <div className="text-gray-400 text-sm">Compliance Checkpoints</div>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6 text-center hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-3">⚡</div>
              <div className="text-2xl font-bold text-purple-400 mb-2">90%</div>
              <div className="text-gray-400 text-sm">Faster Compliance</div>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-red-600/20 rounded-2xl p-6 text-center hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-3">🛡️</div>
              <div className="text-2xl font-bold text-red-400 mb-2">100%</div>
              <div className="text-gray-400 text-sm">Audit Ready</div>
            </div>
          </div>
        </section>

        {/* Major Compliance Categories */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-green-600 bg-clip-text text-transparent">
            Comprehensive Compliance Coverage
          </h2>
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Education Compliance */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-blue-600/20 rounded-3xl p-8 hover:-translate-y-1 hover:border-blue-600/50 hover:shadow-xl hover:shadow-blue-600/15 transition-all">
              <div className="text-4xl mb-6 text-center">🎓</div>
              <h3 className="text-2xl font-bold mb-4 text-center">Education Compliance</h3>
              <p className="text-gray-400 mb-6">
                FERPA, COPPA, and state education privacy laws. Protect student data while maintaining educational accessibility.
              </p>
              <div className="space-y-3 mb-6">
                <div className="bg-blue-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-blue-300 mb-1">FERPA (Family Educational Rights and Privacy Act)</div>
                  <div className="text-gray-300 text-sm">Student record privacy and parent access rights</div>
                </div>
                <div className="bg-blue-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-blue-300 mb-1">COPPA (Children's Online Privacy Protection)</div>
                  <div className="text-gray-300 text-sm">Under-13 student online privacy protection</div>
                </div>
              </div>
              <Link href="/compliance/ferpa" className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-3 rounded-lg font-semibold transition-all">
                FERPA Compliance Guide
              </Link>
            </div>

            {/* Healthcare Compliance */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-green-600/20 rounded-3xl p-8 hover:-translate-y-1 hover:border-green-600/50 hover:shadow-xl hover:shadow-green-600/15 transition-all">
              <div className="text-4xl mb-6 text-center">🏥</div>
              <h3 className="text-2xl font-bold mb-4 text-center">Healthcare Compliance</h3>
              <p className="text-gray-400 mb-6">
                HIPAA, HITECH, DEA, and FDA regulations. Secure patient data and controlled substances with confidence.
              </p>
              <div className="space-y-3 mb-6">
                <div className="bg-green-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-green-300 mb-1">HIPAA (Health Insurance Portability)</div>
                  <div className="text-gray-300 text-sm">Patient health information privacy and security</div>
                </div>
                <div className="bg-green-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-green-300 mb-1">DEA (Drug Enforcement Administration)</div>
                  <div className="text-gray-300 text-sm">Controlled substance security requirements</div>
                </div>
              </div>
              <Link href="/compliance/hipaa" className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-3 rounded-lg font-semibold transition-all">
                HIPAA Compliance Guide
              </Link>
            </div>

            {/* General Security Standards */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-3xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-6 text-center">🔒</div>
              <h3 className="text-2xl font-bold mb-4 text-center">Security Standards</h3>
              <p className="text-gray-400 mb-6">
                SOC 2, ISO 27001, NIST frameworks, and industry best practices. Build security that meets enterprise standards.
              </p>
              <div className="space-y-3 mb-6">
                <div className="bg-purple-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-purple-300 mb-1">NIST Cybersecurity Framework</div>
                  <div className="text-gray-300 text-sm">Federal cybersecurity standards and controls</div>
                </div>
                <div className="bg-purple-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-purple-300 mb-1">SOC 2 Type II</div>
                  <div className="text-gray-300 text-sm">Service organization security controls</div>
                </div>
              </div>
              <Link href="/compliance/general-security" className="block w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-3 rounded-lg font-semibold transition-all">
                Security Standards Guide
              </Link>
            </div>
          </div>
        </section>

        {/* Industry-Specific Compliance */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-green-600 bg-clip-text text-transparent">
            Industry-Specific Requirements
          </h2>
          <div className="grid lg:grid-cols-2 gap-8">

            {/* Financial Services */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-yellow-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-yellow-600/50 hover:shadow-xl hover:shadow-yellow-600/15 transition-all">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                🏦 Financial Services
              </h3>
              <p className="text-gray-400 mb-4">
                PCI DSS, SOX, GLBA, and banking regulations for financial institution security.
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-yellow-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-yellow-300 text-sm mb-1">PCI DSS</div>
                  <div className="text-gray-300 text-xs">Payment card security</div>
                </div>
                <div className="bg-yellow-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-yellow-300 text-sm mb-1">SOX</div>
                  <div className="text-gray-300 text-xs">Financial reporting controls</div>
                </div>
              </div>
            </div>

            {/* Government & Defense */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-red-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-red-600/50 hover:shadow-xl hover:shadow-red-600/15 transition-all">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                🏛️ Government & Defense
              </h3>
              <p className="text-gray-400 mb-4">
                FedRAMP, FISMA, CMMC, and government security clearance requirements.
              </p>
              <div className="grid md:grid-cols-2 gap-3">
                <div className="bg-red-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-red-300 text-sm mb-1">FedRAMP</div>
                  <div className="text-gray-300 text-xs">Federal cloud security</div>
                </div>
                <div className="bg-red-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-red-300 text-sm mb-1">CMMC</div>
                  <div className="text-gray-300 text-xs">Defense contractor security</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI-Powered Compliance Features */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-green-600 bg-clip-text text-transparent">
            AI-Powered Compliance Automation
          </h2>
          <div className="bg-gray-800/60 backdrop-blur-xl border border-green-600/20 rounded-3xl p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-green-300">Automated Compliance Validation</h3>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">✓</span>
                    <div>
                      <div className="font-semibold">Real-time Compliance Checking</div>
                      <div className="text-gray-400 text-sm">Instant validation against 500+ regulatory requirements</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">✓</span>
                    <div>
                      <div className="font-semibold">Automated Documentation</div>
                      <div className="text-gray-400 text-sm">Generate compliance reports and audit documentation</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">✓</span>
                    <div>
                      <div className="font-semibold">Gap Analysis & Remediation</div>
                      <div className="text-gray-400 text-sm">Identify compliance gaps and receive actionable recommendations</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl flex-shrink-0 mt-0.5">✓</span>
                    <div>
                      <div className="font-semibold">Continuous Monitoring</div>
                      <div className="text-gray-400 text-sm">Ongoing compliance tracking and alerting</div>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6 text-blue-300">Expert Compliance Support</h3>
                <ul className="space-y-4 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl flex-shrink-0 mt-0.5">🎯</span>
                    <div>
                      <div className="font-semibold">Industry-Specific Guidance</div>
                      <div className="text-gray-400 text-sm">Tailored compliance strategies for your sector</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl flex-shrink-0 mt-0.5">📚</span>
                    <div>
                      <div className="font-semibold">Regulatory Updates</div>
                      <div className="text-gray-400 text-sm">Stay current with evolving compliance requirements</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl flex-shrink-0 mt-0.5">👨‍💼</span>
                    <div>
                      <div className="font-semibold">Compliance Consulting</div>
                      <div className="text-gray-400 text-sm">Expert guidance from certified compliance professionals</div>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl flex-shrink-0 mt-0.5">🔄</span>
                    <div>
                      <div className="font-semibold">Audit Preparation</div>
                      <div className="text-gray-400 text-sm">Comprehensive audit readiness and support</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-600/10 to-green-700/10 backdrop-blur-xl border border-green-600/20 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-green-600 bg-clip-text text-transparent">
              Start Your Compliance Journey
            </h2>
            <p className="text-xl text-gray-400 mb-10">
              Let AI guide you through complex regulatory requirements.
              Get compliant faster with automated validation and expert guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleStartAssessment}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-green-600/40 transition-all"
              >
                Start Compliance Assessment
              </button>
              <Link
                href="/contact"
                className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all"
              >
                Speak with Compliance Expert
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-purple-600/20 py-12 mt-20">
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
                <li><Link href="/ai-assessment" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">AI Assessment</Link></li>
                <li><Link href="/professional-proposals" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Proposal Generator</Link></li>
                <li><Link href="/white-label" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">White-Label</Link></li>
                <li><Link href="/compliance-analyst" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Compliance Tools</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Solutions</h3>
              <ul className="space-y-2">
                <li><Link href="/integrators" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Security Integrators</Link></li>
                <li><Link href="/enterprise" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Enterprise</Link></li>
                <li><Link href="/education" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Education</Link></li>
                <li><Link href="/healthcare" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Healthcare</Link></li>
                <li><Link href="/consultants" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Consultants</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Compliance</h3>
              <ul className="space-y-2">
                <li><Link href="/compliance" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Overview</Link></li>
                <li><Link href="/compliance/ferpa" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">FERPA</Link></li>
                <li><Link href="/compliance/hipaa" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">HIPAA</Link></li>
                <li><Link href="/compliance/general-security" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Security Standards</Link></li>
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

      <EmailGate
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onSuccess={handleEmailGateSuccess}
      />
    </div>
  )
}