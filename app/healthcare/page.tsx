"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import UnifiedNavigation from '../components/UnifiedNavigation';
import Footer from '../components/Footer';
import { useAuthCache } from '../hooks/useAuthCache';

export default function HealthcarePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { isAuthenticated, extendSession } = useAuthCache()

  const handleStartAssessment = () => {
    if (isAuthenticated) {
      extendSession()
      router.push('/ai-assessment')
    } else {
      // Redirect to portal for authentication
      window.location.href = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001/auth'
        : 'https://portal.design-rite.com/auth';
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Main Navigation Header */}
      <UnifiedNavigation />

      {/* Main Content */}
      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Healthcare Security Solutions
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            HIPAA-Compliant Security for Healthcare Facilities
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Specialized security solutions for hospitals, clinics, and healthcare facilities.
            Protect patients, staff, and sensitive medical data while maintaining operational efficiency.
          </p>
        </section>

        {/* Key Features Section */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-green-600/20 rounded-3xl p-8 hover:-translate-y-1 hover:border-green-600/50 hover:shadow-xl hover:shadow-green-600/15 transition-all">
              <div className="text-4xl mb-6 text-center">🏥</div>
              <h3 className="text-xl font-bold mb-4 text-center">Patient Privacy Protection</h3>
              <p className="text-gray-400 mb-6">
                HIPAA-compliant security designs that protect patient information while maintaining operational efficiency and emergency access requirements.
              </p>
              <div className="bg-green-600/20 p-4 rounded-lg border border-green-600/30">
                <h4 className="font-bold mb-2 text-green-300">Features:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Patient room privacy zones</li>
                  <li>• Visitor access controls</li>
                  <li>• Staff identification systems</li>
                  <li>• Emergency override protocols</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-blue-600/20 rounded-3xl p-8 hover:-translate-y-1 hover:border-blue-600/50 hover:shadow-xl hover:shadow-blue-600/15 transition-all">
              <div className="text-4xl mb-6 text-center">💊</div>
              <h3 className="text-xl font-bold mb-4 text-center">Pharmaceutical Security</h3>
              <p className="text-gray-400 mb-6">
                Specialized protection for controlled substances, medication storage areas, and pharmacy operations with strict access controls and audit trails.
              </p>
              <div className="bg-blue-600/20 p-4 rounded-lg border border-blue-600/30">
                <h4 className="font-bold mb-2 text-blue-300">Features:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Controlled substance monitoring</li>
                  <li>• Pharmacy vault security</li>
                  <li>• Medication cart tracking</li>
                  <li>• DEA compliance validation</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-red-600/20 rounded-3xl p-8 hover:-translate-y-1 hover:border-red-600/50 hover:shadow-xl hover:shadow-red-600/15 transition-all">
              <div className="text-4xl mb-6 text-center">🚨</div>
              <h3 className="text-xl font-bold mb-4 text-center">Emergency Department Security</h3>
              <p className="text-gray-400 mb-6">
                Specialized protocols for high-stress environments with rapid patient turnover, violence prevention, and crisis management capabilities.
              </p>
              <div className="bg-red-600/20 p-4 rounded-lg border border-red-600/30">
                <h4 className="font-bold mb-2 text-red-300">Features:</h4>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Violence detection systems</li>
                  <li>• Staff duress alarms</li>
                  <li>• Waiting area monitoring</li>
                  <li>• Crisis response protocols</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Healthcare Types Section */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-green-600 bg-clip-text text-transparent">Healthcare Facility Types</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                🏥 Hospitals & Medical Centers
              </h3>
              <p className="text-gray-400 mb-4">
                Comprehensive security for multi-building hospital campuses including emergency departments, surgical suites, patient floors, and administrative areas.
              </p>
              <div className="space-y-3">
                <div className="bg-green-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-green-300 mb-1">Critical Areas:</div>
                  <div className="text-gray-300 text-sm">Operating rooms, ICU, emergency department, pharmacy, medical equipment storage</div>
                </div>
                <div className="bg-blue-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-blue-300 mb-1">Access Control:</div>
                  <div className="text-gray-300 text-sm">Role-based permissions, visitor management, staff identification systems</div>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                🏢 Outpatient Clinics
              </h3>
              <p className="text-gray-400 mb-4">
                Specialized security for outpatient facilities, diagnostic centers, surgical centers, and specialty clinics with focus on patient flow and privacy.
              </p>
              <div className="space-y-3">
                <div className="bg-purple-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-purple-300 mb-1">Patient Privacy:</div>
                  <div className="text-gray-300 text-sm">Consultation room monitoring, patient record protection, HIPAA compliance</div>
                </div>
                <div className="bg-yellow-600/20 p-3 rounded-lg">
                  <div className="font-semibold text-yellow-300 mb-1">Operational Efficiency:</div>
                  <div className="text-gray-300 text-sm">Patient flow tracking, appointment verification, staff workflow optimization</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Standards */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-green-600 bg-clip-text text-transparent">Regulatory Compliance</h2>
          <div className="grid lg:grid-cols-4 gap-6">
            <div className="bg-green-600/20 rounded-2xl p-6 text-center border border-green-600/30 hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-3">📋</div>
              <h3 className="text-lg font-bold mb-3">HIPAA</h3>
              <p className="text-gray-400 text-sm">Health Insurance Portability and Accountability Act compliance</p>
            </div>
            <div className="bg-blue-600/20 rounded-2xl p-6 text-center border border-blue-600/30 hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-3">💊</div>
              <h3 className="text-lg font-bold mb-3">DEA</h3>
              <p className="text-gray-400 text-sm">Drug Enforcement Administration controlled substance regulations</p>
            </div>
            <div className="bg-purple-600/20 rounded-2xl p-6 text-center border border-purple-600/30 hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-bold mb-3">HITECH</h3>
              <p className="text-gray-400 text-sm">Health Information Technology for Economic and Clinical Health Act</p>
            </div>
            <div className="bg-red-600/20 rounded-2xl p-6 text-center border border-red-600/30 hover:-translate-y-1 transition-all">
              <div className="text-3xl mb-3">🚨</div>
              <h3 className="text-lg font-bold mb-3">Joint Commission</h3>
              <p className="text-gray-400 text-sm">Healthcare accreditation and patient safety standards</p>
            </div>
          </div>
        </section>

        {/* Use Case */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-green-600 bg-clip-text text-transparent">Real-World Implementation</h2>
          <div className="bg-gray-800/60 backdrop-blur-xl border border-green-600/20 rounded-3xl p-12">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              🏥 Regional Medical Center Case Study
            </h3>
            <p className="text-gray-400 mb-8">
              500-bed regional medical center with emergency department, surgical suites, maternity ward, and outpatient facilities.
              Design-Rite's AI system created a comprehensive security plan balancing patient privacy with operational accessibility.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-bold mb-4 text-green-300">Security Challenges Addressed:</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span>Patient privacy in 200+ patient rooms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span>Controlled substance security in pharmacy</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span>Emergency department violence prevention</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <span>Medical equipment asset protection</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-bold mb-4 text-blue-300">Implementation Results:</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">📊</span>
                    <span>45% reduction in security incidents</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">⚡</span>
                    <span>60% faster emergency response times</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">🔒</span>
                    <span>100% HIPAA compliance maintained</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 text-xl">💰</span>
                    <span>30% reduction in security costs</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-green-600/10 to-green-700/10 backdrop-blur-xl border border-green-600/20 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-green-600 bg-clip-text text-transparent">Protect Your Patients and Staff</h2>
            <p className="text-xl text-gray-400 mb-10">
              HIPAA-compliant security solutions designed specifically for healthcare environments.
              Start with a comprehensive assessment tailored to your facility type.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleStartAssessment}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-green-600/40 transition-all"
              >
                Start Healthcare Assessment
              </button>
              <Link
                href="/contact"
                className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all"
              >
                Speak with Healthcare Specialist
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}