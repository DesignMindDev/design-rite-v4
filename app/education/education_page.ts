"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function EducationPage() {
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
            Education & Healthcare Security
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
            Specialized Security for Critical Environments
          </h1>
          <p className="text-xl text-white/80 leading-relaxed">
            FERPA and HIPAA-compliant security solutions designed for educational institutions and healthcare facilities. 
            Protect students, patients, and sensitive data with specialized AI-powered design.
          </p>
        </section>

        {/* Split: Education & Healthcare */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Education Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
              <div className="text-5xl mb-6 text-center">🎓</div>
              <h2 className="text-3xl font-bold text-center mb-8">Educational Institutions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3">Student Safety First</h3>
                  <p className="text-white/80">Comprehensive security solutions for K-12 schools, universities, and educational facilities with specialized protocols for student protection and emergency response.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">FERPA Compliance</h3>
                  <p className="text-white/80">Automated compliance validation ensures all security measures meet Family Educational Rights and Privacy Act requirements for student data protection.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">Budget-Conscious Solutions</h3>
                  <p className="text-white/80">Cost-effective recommendations optimized for educational budgets, with grant application support documentation and phased implementation plans.</p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-blue-600/20 rounded-xl">
                <h4 className="font-bold mb-3">Key Features for Schools:</h4>
                <ul className="space-y-2 text-white/90">
                  <li>• Visitor management integration</li>
                  <li>• Emergency lockdown protocols</li>
                  <li>• Campus-wide communication systems</li>
                  <li>• Student privacy protection</li>
                  <li>• Grant funding documentation</li>
                </ul>
              </div>
            </div>

            {/* Healthcare Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
              <div className="text-5xl mb-6 text-center">🏥</div>
              <h2 className="text-3xl font-bold text-center mb-8">Healthcare Facilities</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3">Patient Privacy Protection</h3>
                  <p className="text-white/80">HIPAA-compliant security designs that protect patient information while maintaining operational efficiency and emergency access requirements.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">Medical Equipment Security</h3>
                  <p className="text-white/80">Specialized protection for valuable medical equipment, pharmaceutical storage, and controlled substance areas with appropriate access controls.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">Emergency Department Protocols</h3>
                  <p className="text-white/80">Unique security requirements for high-stress environments with rapid patient turnover and potential violence prevention.</p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-green-600/20 rounded-xl">
                <h4 className="font-bold mb-3">Key Features for Healthcare:</h4>
                <ul className="space-y-2 text-white/90">
                  <li>• HIPAA compliance validation</li>
                  <li>• Pharmaceutical security zones</li>
                  <li>• Patient flow monitoring</li>
                  <li>• Staff duress systems</li>
                  <li>• Medical equipment tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Standards */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16">Regulatory Compliance Built-In</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-blue-600/20 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">📚</div>
              <h3 className="text-xl font-bold mb-4">FERPA Compliance</h3>
              <p className="text-white/80">Automated validation of Family Educational Rights and Privacy Act requirements for educational institutions.</p>
            </div>
            <div className="bg-green-600/20 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🏥</div>
              <h3 className="text-xl font-bold mb-4">HIPAA Compliance</h3>
              <p className="text-white/80">Health Insurance Portability and Accountability Act compliance for healthcare facility security requirements.</p>
            </div>
            <div className="bg-purple-600/20 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold mb-4">Local Codes</h3>
              <p className="text-white/80">Integration with local building codes, fire safety requirements, and emergency response protocols.</p>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16">Common Implementation Scenarios</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                🏫 K-12 School District
              </h3>
              <p className="text-white/80 mb-4">
                Comprehensive security upgrade for a 15-school district including elementary, middle, and high schools. 
                Standardized security protocols with age-appropriate considerations.
              </p>
              <div className="bg-blue-600/20 p-4 rounded-lg">
                <div className="text-sm font-semibold text-blue-300 mb-2">Implementation Highlights:</div>
                <ul className="text-white/80 text-sm space-y-1">
                  <li>• Visitor management at all entry points</li>
                  <li>• Campus-wide emergency communication</li>
                  <li>• Playground and athletic facility monitoring</li>
                  <li>• Bus loading zone security</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                🏥 Regional Medical Center
              </h3>
              <p className="text-white/80 mb-4">
                Multi-building hospital campus with emergency department, surgical suites, and outpatient facilities. 
                Balanced security with patient care accessibility.
              </p>
              <div className="bg-green-600/20 p-4 rounded-lg">
                <div className="text-sm font-semibold text-green-300 mb-2">Implementation Highlights:</div>
                <ul className="text-white/80 text-sm space-y-1">
                  <li>• Emergency department violence prevention</li>
                  <li>• Pharmaceutical storage security</li>
                  <li>• Patient room privacy protection</li>
                  <li>• Medical equipment asset tracking</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                🎓 University Campus
              </h3>
              <p className="text-white/80 mb-4">
                Large university campus with dormitories, academic buildings, research facilities, and public spaces. 
                Open campus design with controlled access zones.
              </p>
              <div className="bg-purple-600/20 p-4 rounded-lg">
                <div className="text-sm font-semibold text-purple-300 mb-2">Implementation Highlights:</div>
                <ul className="text-white/80 text-sm space-y-1">
                  <li>• Research facility access control</li>
                  <li>• Dormitory security systems</li>
                  <li>• Library and study area monitoring</li>
                  <li>• Athletic facility management</li>
                </ul>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                🏥 Outpatient Clinic Network
              </h3>
              <p className="text-white/80 mb-4">
                Multi-location outpatient clinic network with specialized practices including mental health, 
                pediatrics, and urgent care facilities.
              </p>
              <div className="bg-yellow-600/20 p-4 rounded-lg">
                <div className="text-sm font-semibold text-yellow-300 mb-2">Implementation Highlights:</div>
                <ul className="text-white/80 text-sm space-y-1">
                  <li>• Patient check-in security</li>
                  <li>• Medical record protection</li>
                  <li>• Staff safety protocols</li>
                  <li>• After-hours facility protection</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Special Considerations */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold mb-8 text-center">Special Considerations</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  💰 Grant Funding Support
                </h3>
                <p className="text-white/80 mb-4">
                  Comprehensive documentation packages designed to support federal and state grant applications 
                  for security improvements in educational and healthcare facilities.
                </p>
                <ul className="text-white/70 space-y-2">
                  <li>• Grant-specific documentation formats</li>
                  <li>• Cost-benefit analysis reports</li>
                  <li>• Compliance certification letters</li>
                  <li>• Phased implementation timelines</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                  🚨 Emergency Integration
                </h3>
                <p className="text-white/80 mb-4">
                  Seamless integration with existing emergency response systems, fire safety protocols, 
                  and local first responder communication networks.
                </p>
                <ul className="text-white/70 space-y-2">
                  <li>• Fire system integration</li>
                  <li>• Police department connectivity</li>
                  <li>• Mass notification systems</li>
                  <li>• Evacuation route optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold mb-6">Protect Your Students and Patients</h2>
            <p className="text-xl text-white/80 mb-10">
              Specialized security solutions that understand the unique requirements of educational and healthcare environments. 
              Start with a compliant assessment today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={redirectToApp} className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all">
                Start Compliant Assessment
              </button>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/10 transition-all">
                Speak with Specialist
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}