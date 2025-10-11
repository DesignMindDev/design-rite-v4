"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import UnifiedNavigation from '../components/UnifiedNavigation'
import Footer from '../components/Footer'
import EmailGate from '../components/EmailGate'
import { useAuthCache } from '../hooks/useAuthCache'

export default function ComplianceAnalystPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const router = useRouter()
  const { isAuthenticated, extendSession } = useAuthCache()

  const handleTryComplianceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      extendSession();
      router.push('/ai-assessment');
    } else {
      setShowEmailGate(true);
    }
  };

  const handleEmailGateSuccess = () => {
    setShowEmailGate(false);
    router.push('/ai-assessment');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      <UnifiedNavigation />


      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-8 pt-20 pb-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-full px-6 py-3 text-sm font-medium mb-8">
              <span className="text-2xl">🛡️</span>
              <span>Advanced Compliance Intelligence</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              AI-Powered <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Compliance Analyst</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Ensure 100% regulatory compliance across all security installations. Our AI compliance analyst automatically verifies adherence to industry standards, local codes, and federal regulations while identifying potential violations before they become costly problems.
            </p>

            <div className="flex justify-center">
              <button
                onClick={handleTryComplianceClick}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Try Compliance Check
              </button>
            </div>
          </div>
        </section>

        {/* Compliance Standards */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Supported Compliance Standards</h2>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
            {[
              { standard: "CJIS", description: "Criminal Justice Information Services", industry: "Law Enforcement" },
              { standard: "FERPA", description: "Family Educational Rights & Privacy", industry: "Education" },
              { standard: "HIPAA", description: "Health Insurance Portability", industry: "Healthcare" },
              { standard: "SOC 2", description: "Service Organization Control", industry: "Enterprise" },
              { standard: "NIST", description: "Cybersecurity Framework", industry: "Federal" },
              { standard: "PCI DSS", description: "Payment Card Industry", industry: "Financial" },
              { standard: "GDPR", description: "General Data Protection", industry: "International" },
              { standard: "FedRAMP", description: "Federal Risk Authorization", industry: "Government" }
            ].map((item, index) => (
              <div key={index} className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30 text-center">
                <div className="text-2xl font-bold text-purple-400 mb-2">{item.standard}</div>
                <div className="text-sm text-white/80 mb-2">{item.description}</div>
                <div className="text-xs text-purple-300 bg-purple-600/20 px-2 py-1 rounded-full">{item.industry}</div>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Automated Compliance Verification</h2>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Regulatory Database Sync</h3>
                  <p className="text-white/80">AI continuously monitors and updates compliance requirements from federal, state, and local regulatory bodies in real-time.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Project Analysis</h3>
                  <p className="text-white/80">Every security design is automatically cross-referenced against applicable standards based on facility type, location, and industry.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Violation Detection</h3>
                  <p className="text-white/80">Advanced algorithms identify potential compliance violations and generate detailed reports with remediation recommendations.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Documentation Generation</h3>
                  <p className="text-white/80">Automatically generate compliance documentation, audit trails, and certification reports for regulatory review.</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-2xl p-8 border border-purple-500/30">
              <h3 className="text-2xl font-bold mb-6 text-center">Compliance Dashboard</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
                  <span className="text-green-400 font-semibold">CJIS Compliance</span>
                  <span className="text-green-400 font-bold">✓ PASS</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-600/20 border border-green-500/30 rounded-lg">
                  <span className="text-green-400 font-semibold">NIST Framework</span>
                  <span className="text-green-400 font-bold">✓ PASS</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-orange-600/20 border border-orange-500/30 rounded-lg">
                  <span className="text-orange-400 font-semibold">Local Building Code</span>
                  <span className="text-orange-400 font-bold">⚠ REVIEW</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-600/20 border border-red-500/30 rounded-lg">
                  <span className="text-red-400 font-semibold">Fire Safety Code</span>
                  <span className="text-red-400 font-bold">✗ VIOLATION</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-white/10">
                <div className="text-center">
                  <span className="text-2xl font-bold text-purple-400">87%</span>
                  <div className="text-white/80 text-sm">Overall Compliance Score</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Why Automated Compliance Matters</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-4xl mb-4">⚖️</div>
              <h3 className="text-xl font-bold mb-4">Legal Protection</h3>
              <p className="text-white/80">Protect your business from costly fines, legal challenges, and project delays caused by compliance violations.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-4">Cost Savings</h3>
              <p className="text-white/80">Avoid expensive redesigns and retrofits by ensuring compliance from the initial design phase.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold mb-4">Competitive Advantage</h3>
              <p className="text-white/80">Win more contracts by demonstrating proven compliance expertise and reducing client risk.</p>
            </div>
          </div>
        </section>

        {/* Industry Applications */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Industry-Specific Compliance</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <div className="text-3xl mb-4">🏫</div>
              <h3 className="text-xl font-bold mb-4">Education & Healthcare</h3>
              <ul className="space-y-2 text-white/80">
                <li>• FERPA privacy requirements</li>
                <li>• HIPAA security standards</li>
                <li>• Campus safety regulations</li>
                <li>• Patient privacy protection</li>
                <li>• Emergency response protocols</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <div className="text-3xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold mb-4">Government & Law Enforcement</h3>
              <ul className="space-y-2 text-white/80">
                <li>• CJIS security requirements</li>
                <li>• Federal facility standards</li>
                <li>• Chain of custody protocols</li>
                <li>• Evidence management systems</li>
                <li>• Access control mandates</li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-8 py-20">
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-2xl p-12 text-center border border-purple-500/30">
            <div className="text-5xl mb-6">🛡️</div>
            <h2 className="text-3xl font-bold mb-6">Never Miss Another Compliance Requirement</h2>
            <p className="text-xl text-white/80 mb-8">
              Join security integrators who trust AI-powered compliance analysis to protect their projects and reputation.
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleTryComplianceClick}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Try Compliance Demo
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer redirectToApp={handleEmailGateSuccess} />

      {/* Email Gate Modal */}
      <EmailGate
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onSuccess={handleEmailGateSuccess}
      />
    </div>
  )
}


