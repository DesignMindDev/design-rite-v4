'use client'

import { useState } from 'react'
import Link from 'next/link'
import UnifiedNavigation from '@/app/components/UnifiedNavigation';

export default function EnterpriseSecurityPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const redirectToApp = () => {
    window.location.href = '/waitlist'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 text-center text-sm font-semibold relative z-[1001]">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-4">
          <span className="text-base">🏢</span>
          <span className="flex-1 text-center">
            Enterprise Security Teams: Streamline multi-site security management with AI
          </span>
          <Link 
            href="/contact"
            className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-white/30 transition-all border border-white/30"
          >
            Get Demo
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
            Enterprise Security
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Empower Your In-House Security Teams
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-8">
            Streamline facility assessments, vendor management, and security strategy development 
            across multiple locations with enterprise-grade AI tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={redirectToApp}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all text-lg"
            >
              🚀 Start Enterprise Trial
            </button>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all text-lg inline-block"
            >
              📞 Schedule Enterprise Demo
            </Link>
          </div>
        </section>

        {/* Enterprise Features Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-bold text-white mb-4">Multi-Site Management</h3>
            <p className="text-gray-300">
              Centrally manage security assessments across all your facilities with 
              unified reporting and standardized protocols.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-4">Vendor Comparison</h3>
            <p className="text-gray-300">
              Evaluate and compare proposals from multiple security vendors with 
              AI-powered analysis and standardized scoring.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-white mb-4">Compliance Reporting</h3>
            <p className="text-gray-300">
              Generate comprehensive compliance reports for regulatory requirements, 
              board presentations, and audit documentation.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-white mb-4">Budget Planning</h3>
            <p className="text-gray-300">
              Plan security budgets with accurate cost projections, ROI analysis, 
              and multi-year financial planning tools.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-white mb-4">Team Collaboration</h3>
            <p className="text-gray-300">
              Enable seamless collaboration between security teams, facilities management, 
              and executive leadership with role-based access.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-white mb-4">Enterprise Security</h3>
            <p className="text-gray-300">
              SOC 2 compliant platform with enterprise-grade security, data encryption, 
              and dedicated support for large organizations.
            </p>
          </div>
        </section>

        {/* Enterprise ROI */}
        <section className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 mb-20 max-w-4xl mx-auto border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Enterprise ROI Calculator
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">70%</div>
              <div className="text-white font-bold mb-2">Time Savings</div>
              <div className="text-gray-300 text-sm">
                Reduce assessment time from weeks to days across multiple facilities
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">45%</div>
              <div className="text-white font-bold mb-2">Cost Reduction</div>
              <div className="text-gray-300 text-sm">
                Better vendor negotiations and standardized pricing across locations
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">3x</div>
              <div className="text-white font-bold mb-2">Faster Deployment</div>
              <div className="text-gray-300 text-sm">
                Accelerated security rollouts with streamlined vendor management
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <div className="text-2xl font-bold text-white mb-4">
              💡 Estimated Annual Savings: <span className="text-green-400">$500,000+</span>
            </div>
            <p className="text-gray-300 mb-6">
              Based on 50+ facility locations with standardized security processes
            </p>
  <Link 
  href="/enterprise-roi"
  className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold transition-all inline-block"
>
  Calculate Your Enterprise Savings
</Link>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Scale Your Security Operations?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join enterprise security teams who have transformed their operations with Design-Rite.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={redirectToApp}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all text-lg"
            >
              🚀 Start Enterprise Trial
            </button>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all text-lg inline-block"
            >
              📞 Schedule Enterprise Demo
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