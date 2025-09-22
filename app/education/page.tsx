"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import UnifiedNavigation from '../components/UnifiedNavigation';
import EmailGate from '../components/EmailGate';
import { useAuthCache } from '../hooks/useAuthCache';

export default function EducationPage() {
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
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Educational Institution Security
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            FERPA-Compliant Security for Schools & Universities
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Specialized security solutions for K-12 schools, universities, and educational facilities.
            Protect students, staff, and sensitive educational data with AI-powered design that prioritizes student safety.
          </p>
        </section>

        {/* Educational Institution Types */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* K-12 Schools */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-blue-600/20 rounded-3xl p-8 hover:-translate-y-1 hover:border-blue-600/50 hover:shadow-xl hover:shadow-blue-600/15 transition-all">
              <div className="text-4xl mb-6 text-center">🏫</div>
              <h3 className="text-xl font-bold mb-4 text-center">K-12 Schools</h3>
              <p className="text-gray-400 mb-6">
                Comprehensive security solutions for elementary, middle, and high schools with age-appropriate safety measures and emergency response protocols.
              </p>
              <div className="bg-blue-600/20 p-4 rounded-lg border border-blue-600/30">
                <h4 className="font-bold mb-2 text-blue-300">Key Features:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Visitor management systems</li>
                  <li>• Emergency lockdown protocols</li>
                  <li>• Playground monitoring</li>
                  <li>• Bus loading zone security</li>
                  <li>• Student privacy protection</li>
                </ul>
              </div>
            </div>

            {/* Universities */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-3xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-6 text-center">🎓</div>
              <h3 className="text-xl font-bold mb-4 text-center">Universities & Colleges</h3>
              <p className="text-gray-400 mb-6">
                Campus-wide security for higher education institutions including dormitories, lecture halls, libraries, research facilities, and student centers.
              </p>
              <div className="bg-purple-600/20 p-4 rounded-lg border border-purple-600/30">
                <h4 className="font-bold mb-2 text-purple-300">Key Features:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Campus-wide monitoring</li>
                  <li>• Dormitory access control</li>
                  <li>• Research facility security</li>
                  <li>• Event venue management</li>
                  <li>• Student activity tracking</li>
                </ul>
              </div>
            </div>

            {/* Specialized Education */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-green-600/20 rounded-3xl p-8 hover:-translate-y-1 hover:border-green-600/50 hover:shadow-xl hover:shadow-green-600/15 transition-all">
              <div className="text-4xl mb-6 text-center">📚</div>
              <h3 className="text-xl font-bold mb-4 text-center">Specialized Facilities</h3>
              <p className="text-gray-400 mb-6">
                Security for vocational schools, training centers, libraries, museums, and other educational facilities with unique requirements.
              </p>
              <div className="bg-green-600/20 p-4 rounded-lg border border-green-600/30">
                <h4 className="font-bold mb-2 text-green-300">Key Features:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Equipment protection</li>
                  <li>• Archive security</li>
                  <li>• Public access control</li>
                  <li>• Special event management</li>
                  <li>• After-hours monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Student Safety Focus */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-blue-600 bg-clip-text text-transparent">Student Safety First</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                🛡️ Threat Prevention & Response
              </h3>
              <p className="text-gray-400 mb-4">
                Advanced threat detection and rapid response systems designed specifically for educational environments with student safety as the top priority.
              </p>
              <div className="space-y-3">
                <div className="bg-red-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-red-300 mb-1">Emergency Response:</div>
                  <div className="text-gray-300 text-sm">Lockdown protocols, emergency communication, law enforcement coordination</div>
                </div>
                <div className="bg-yellow-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-yellow-300 mb-1">Behavioral Analysis:</div>
                  <div className="text-gray-300 text-sm">AI-powered threat assessment, early warning systems, counselor alerts</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                👥 Access Control & Visitor Management
              </h3>
              <p className="text-gray-400 mb-4">
                Comprehensive visitor management and access control systems that balance security with the welcoming nature of educational environments.
              </p>
              <div className="space-y-3">
                <div className="bg-blue-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-blue-300 mb-1">Visitor Screening:</div>
                  <div className="text-gray-300 text-sm">ID verification, background checks, escort requirements, visitor badges</div>
                </div>
                <div className="bg-green-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-green-300 mb-1">Student Flow:</div>
                  <div className="text-gray-300 text-sm">Attendance tracking, zone restrictions, pick-up verification, bus security</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FERPA Compliance */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-blue-600 bg-clip-text text-transparent">FERPA Compliance & Privacy Protection</h2>
          <div className="bg-gray-800/60 backdrop-blur-xl border border-blue-600/20 rounded-3xl p-12">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-blue-300">FERPA Requirements</h3>
                <p className="text-gray-400 mb-6">
                  Automated compliance validation ensures all security measures meet Family Educational Rights and Privacy Act requirements for student data protection.
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">📋</span>
                    <span>Student record privacy protection</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">🔒</span>
                    <span>Access control for educational records</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">👨‍👩‍👧‍👦</span>
                    <span>Parent/guardian notification systems</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">📊</span>
                    <span>Audit trails and compliance reporting</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6 text-green-300">Budget-Conscious Solutions</h3>
                <p className="text-gray-400 mb-6">
                  Cost-effective security recommendations optimized for educational budgets, with grant application support and phased implementation plans.
                </p>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">💰</span>
                    <span>Grant funding documentation and support</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">📈</span>
                    <span>Phased implementation planning</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">🔄</span>
                    <span>Scalable solutions for growing institutions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">🎯</span>
                    <span>ROI analysis and cost-benefit reports</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Use Case Example */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-blue-600 bg-clip-text text-transparent">Real-World Implementation</h2>
          <div className="bg-gray-800/60 backdrop-blur-xl border border-blue-600/20 rounded-3xl p-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              🏫 Metro School District Case Study
            </h3>
            <p className="text-gray-400 mb-8">
              15-school district serving 12,000 students from elementary through high school.
              Design-Rite's AI system created standardized security protocols with age-appropriate considerations for each school level.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold mb-4 text-blue-300">Implementation Highlights:</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">✓</span>
                    <span>Visitor management at all 15 entry points</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">✓</span>
                    <span>Campus-wide emergency communication system</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">✓</span>
                    <span>Playground and athletic facility monitoring</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">✓</span>
                    <span>Bus loading zone security cameras</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">✓</span>
                    <span>FERPA-compliant student tracking</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-4 text-green-300">Results Achieved:</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">📊</span>
                    <span>75% reduction in unauthorized access incidents</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">⚡</span>
                    <span>90% faster emergency response times</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">🔒</span>
                    <span>100% FERPA compliance maintained</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">💰</span>
                    <span>$2.3M in federal grant funding secured</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">👨‍👩‍👧‍👦</span>
                    <span>98% parent satisfaction with safety measures</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-600/10 to-blue-700/10 backdrop-blur-xl border border-blue-600/20 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-blue-600 bg-clip-text text-transparent">Protect Your Students and Staff</h2>
            <p className="text-xl text-gray-400 mb-10">
              FERPA-compliant security solutions designed specifically for educational environments.
              Start with a comprehensive assessment tailored to your institution type.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleStartAssessment}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-blue-600/40 transition-all"
              >
                Start Education Assessment
              </button>
              <Link
                href="/contact"
                className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all"
              >
                Speak with Education Specialist
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

      <EmailGate
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onSuccess={handleEmailGateSuccess}
      />
    </div>
  )
}