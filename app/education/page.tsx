?"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import UnifiedNavigation from '../components/UnifiedNavigation';

export default function EducationHealthcarePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const redirectToApp = () => {
    router.push('/app')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 text-center text-sm font-semibold relative z-[1001]">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-4">
          <span className="text-base">??</span>
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
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Education & Healthcare Security
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Specialized Security for Critical Environments
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            FERPA and HIPAA-compliant security solutions designed for educational institutions and healthcare facilities. 
            Protect students, patients, and sensitive data with specialized AI-powered design.
          </p>
        </section>

        {/* Split: Education & Healthcare */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Education Section */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-3xl p-12 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-5xl mb-6 text-center">??</div>
              <h2 className="text-3xl font-bold text-center mb-8">Educational Institutions</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3">Student Safety First</h3>
                  <p className="text-gray-400">Comprehensive security solutions for K-12 schools, universities, and educational facilities with specialized protocols for student protection and emergency response.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">FERPA Compliance</h3>
                  <p className="text-gray-400">Automated compliance validation ensures all security measures meet Family Educational Rights and Privacy Act requirements for student data protection.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">Budget-Conscious Solutions</h3>
                  <p className="text-gray-400">Cost-effective recommendations optimized for educational budgets, with grant application support documentation and phased implementation plans.</p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-blue-600/20 rounded-xl border border-blue-600/30">
                <h4 className="font-bold mb-3">Key Features for Schools:</h4>
                <ul className="space-y-2 text-gray-300">
                  <li>• Visitor management integration</li>
                  <li>• Emergency lockdown protocols</li>
                  <li>• Campus-wide communication systems</li>
                  <li>• Student privacy protection</li>
                  <li>• Grant funding documentation</li>
                </ul>
              </div>
            </div>

            {/* Healthcare Section */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-3xl p-12 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-5xl mb-6 text-center">??</div>
              <h2 className="text-3xl font-bold text-center mb-8">Healthcare Facilities</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-3">Patient Privacy Protection</h3>
                  <p className="text-gray-400">HIPAA-compliant security designs that protect patient information while maintaining operational efficiency and emergency access requirements.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">Medical Equipment Security</h3>
                  <p className="text-gray-400">Specialized protection for valuable medical equipment, pharmaceutical storage, and controlled substance areas with appropriate access controls.</p>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-3">Emergency Department Protocols</h3>
                  <p className="text-gray-400">Unique security requirements for high-stress environments with rapid patient turnover and potential violence prevention.</p>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-green-600/20 rounded-xl border border-green-600/30">
                <h4 className="font-bold mb-3">Key Features for Healthcare:</h4>
                <ul className="space-y-2 text-gray-300">
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
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Regulatory Compliance Built-In</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-blue-600/20 rounded-2xl p-8 text-center border border-blue-600/30 hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-4">??</div>
              <h3 className="text-xl font-bold mb-4">FERPA Compliance</h3>
              <p className="text-gray-400">Automated validation of Family Educational Rights and Privacy Act requirements for educational institutions.</p>
            </div>
            <div className="bg-green-600/20 rounded-2xl p-8 text-center border border-green-600/30 hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-4">??</div>
              <h3 className="text-xl font-bold mb-4">HIPAA Compliance</h3>
              <p className="text-gray-400">Health Insurance Portability and Accountability Act compliance for healthcare facility security requirements.</p>
            </div>
            <div className="bg-purple-600/20 rounded-2xl p-8 text-center border border-purple-600/30 hover:-translate-y-1 transition-all">
              <div className="text-4xl mb-4">???</div>
              <h3 className="text-xl font-bold mb-4">Local Codes</h3>
              <p className="text-gray-400">Integration with local building codes, fire safety requirements, and emergency response protocols.</p>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Common Implementation Scenarios</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                ?? K-12 School District
              </h3>
              <p className="text-gray-400 mb-4">
                Comprehensive security upgrade for a 15-school district including elementary, middle, and high schools. 
                Standardized security protocols with age-appropriate considerations.
              </p>
              <div className="bg-blue-600/20 p-4 rounded-lg border border-blue-600/30">
                <div className="text-sm font-semibold text-blue-300 mb-2">Implementation Highlights:</div>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Visitor management at all entry points</li>
                  <li>• Campus-wide emergency communication</li>
                  <li>• Playground and athletic facility monitoring</li>
                  <li>• Bus loading zone security</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
                ?? Regional Medical Center
              </h3>
              <p className="text-gray-400 mb-4">
                Multi-building hospital campus with emergency department, surgical suites, and outpatient facilities. 
                Balanced security with patient care accessibility.
              </p>
              <div className="bg-green-600/20 p-4 rounded-lg border border-green-600/30">
                <div className="text-sm font-semibold text-green-300 mb-2">Implementation Highlights:</div>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Emergency department violence prevention</li>
                  <li>• Pharmaceutical storage security</li>
                  <li>• Patient room privacy protection</li>
                  <li>• Medical equipment asset tracking</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600/10 to-purple-700/10 backdrop-blur-xl border border-purple-600/20 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Protect Your Students and Patients</h2>
            <p className="text-xl text-gray-400 mb-10">
              Specialized security solutions that understand the unique requirements of educational and healthcare environments. 
              Start with a compliant assessment today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={redirectToApp} 
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all"
              >
                Start Compliant Assessment
              </button>
              <Link 
                href="/contact" 
                className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all"
              >
                Speak with Specialist
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
                <li><Link href="/education" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Education & Healthcare</Link></li>
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
              <Link href="mailto:hello@design-rite.com" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">??</Link>
              <Link href="/linkedin" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">??</Link>
              <Link href="/twitter" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">??</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}



