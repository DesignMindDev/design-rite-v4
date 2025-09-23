'use client'

import { useState } from 'react'
import Link from 'next/link'
import UnifiedNavigation from '../components/UnifiedNavigation';;


export default function SecurityIntegratorsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const redirectToApp = () => {
    window.location.href = '/waitlist'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
<UnifiedNavigation />


      {/* Main Content */}
      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Security Integrators
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Transform Your Design Process with AI
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-8">
            Deliver professional security assessments and proposals in minutes, not days. 
            Increase efficiency, reduce costs, and win more projects with AI-powered automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={redirectToApp}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all text-lg"
            >
              ?? Start Free Trial
            </button>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all text-lg inline-block"
            >
              ?? Schedule Demo
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">??</div>
            <h3 className="text-xl font-bold text-white mb-4">AI Site Assessment</h3>
            <p className="text-gray-300">
              Upload floor plans or photos and get comprehensive threat analysis with 
              equipment recommendations in minutes.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">??</div>
            <h3 className="text-xl font-bold text-white mb-4">Automated Proposals</h3>
            <p className="text-gray-300">
              Generate professional BOMs, installation diagrams, and pricing 
              automatically based on assessment results.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">??</div>
            <h3 className="text-xl font-bold text-white mb-4">Custom Pricing</h3>
            <p className="text-gray-300">
              Set your markup rates, labor costs, and profit margins for 
              accurate pricing that fits your business model.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">???</div>
            <h3 className="text-xl font-bold text-white mb-4">White-Label Ready</h3>
            <p className="text-gray-300">
              Brand the platform with your logo, colors, and company information 
              for seamless client presentations.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">??</div>
            <h3 className="text-xl font-bold text-white mb-4">Project Management</h3>
            <p className="text-gray-300">
              Track projects, manage client communications, and monitor 
              installation progress from one dashboard.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center hover:-translate-y-2 transition-all border border-white/20">
            <div className="text-4xl mb-4">?</div>
            <h3 className="text-xl font-bold text-white mb-4">10x Faster</h3>
            <p className="text-gray-300">
              Complete assessments that used to take days in under 30 minutes. 
              More projects, higher profits, happier clients.
            </p>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 mb-20 max-w-4xl mx-auto border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Calculate Your ROI with Design-Rite
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">Without Design-Rite:</h3>
              <ul className="space-y-3 text-gray-300">
                <li>?? 8-16 hours per assessment</li>
                <li>?? Manual proposal creation</li>
                <li>? Higher error rates</li>
                <li>?? Lost opportunities due to slow turnaround</li>
                <li>?? Client frustration with delays</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">With Design-Rite:</h3>
              <ul className="space-y-3 text-green-400">
                <li>? 30 minutes per assessment</li>
                <li>?? Automated proposal generation</li>
                <li>? AI-verified accuracy</li>
                <li>?? Same-day proposal delivery</li>
                <li>?? Impressed clients, more referrals</li>
              </ul>
            </div>
          </div>
          <div className="text-center mt-8">
            <div className="text-2xl font-bold text-white mb-4">
              ?? Potential Savings: <span className="text-green-400">$50,000+</span> per year
            </div>
            <p className="text-gray-300 mb-6">
              Based on completing 2x more projects with 90% less time investment
            </p>
            <button 
              onClick={redirectToApp}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold transition-all"
            >
              Start Saving Today
            </button>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What Security Integrators Are Saying
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-yellow-400 text-2xl mb-4">?????</div>
              <p className="text-gray-300 mb-4">
                "Design-Rite cut our assessment time from 2 days to 30 minutes. 
                We're now completing 3x more projects and our clients love the fast turnaround."
              </p>
              <div className="text-white font-bold">- Mike Rodriguez, SecureMax Solutions</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-yellow-400 text-2xl mb-4">?????</div>
              <p className="text-gray-300 mb-4">
                "The AI recommendations are spot-on and the automated proposals look incredibly professional. 
                Our close rate has increased by 40%."
              </p>
              <div className="text-white font-bold">- Sarah Chen, Guardian Tech Systems</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-yellow-400 text-2xl mb-4">?????</div>
              <p className="text-gray-300 mb-4">
                "White-labeling was seamless. Our clients think we built this amazing tool in-house. 
                It's given us a huge competitive advantage."
              </p>
              <div className="text-white font-bold">- David Park, Elite Security Integration</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join hundreds of security integrators who have revolutionized their design process with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={redirectToApp}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all text-lg"
            >
              ?? Start Free Trial - No Credit Card Required
            </button>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all text-lg inline-block"
            >
              ?? Talk to Our Team
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



