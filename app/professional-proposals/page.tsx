"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import UnifiedNavigation from '../components/UnifiedNavigation'
import Footer from '../components/Footer'
import { useAuthCache } from '../hooks/useAuthCache'

export default function ProfessionalProposalsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { isAuthenticated, extendSession } = useAuthCache()

  const redirectToWaitlist = () => {
    router.push('/waitlist');
  };

  const handleTryDemoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      extendSession();
      router.push('/ai-assessment');
    } else {
      // Redirect to portal for authentication
      window.location.href = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001/auth'
        : 'https://portal.design-rite.com/auth';
    }
  }

  const handleGenerateProposalClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      extendSession();
      router.push('/ai-assessment');
    } else {
      // Redirect to portal for authentication
      window.location.href = process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001/auth'
        : 'https://portal.design-rite.com/auth';
    }
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
              <span className="text-2xl">📊</span>
              <span>Automated Proposal Generation</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Professional Proposals</span> That Win
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform AI security assessments into compelling, client-ready proposals in minutes. Generate comprehensive BOMs, pricing, technical specifications, and implementation timelines that close deals and impress clients.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGenerateProposalClick}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Generate Sample Proposal
              </button>
              <Link 
                href="/watch-demo"
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Watch Demo Video
              </Link>
            </div>
          </div>
        </section>

        {/* Proposal Components */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Complete Proposal Package</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 text-center">
              <div className="text-4xl mb-6">📋</div>
              <h3 className="text-2xl font-bold mb-4">Executive Summary</h3>
              <ul className="text-white/80 text-left space-y-2">
                <li>• Project overview & objectives</li>
                <li>• Security risk assessment</li>
                <li>• Recommended solutions</li>
                <li>• Budget & timeline summary</li>
                <li>• Expected ROI & benefits</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 text-center">
              <div className="text-4xl mb-6">🔧</div>
              <h3 className="text-2xl font-bold mb-4">Technical Specifications</h3>
              <ul className="text-white/80 text-left space-y-2">
                <li>• Detailed equipment lists</li>
                <li>• Installation diagrams</li>
                <li>• Network architecture</li>
                <li>• Compliance documentation</li>
                <li>• Performance specifications</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 text-center">
              <div className="text-4xl mb-6">💰</div>
              <h3 className="text-2xl font-bold mb-4">Financial Breakdown</h3>
              <ul className="text-white/80 text-left space-y-2">
                <li>• Itemized BOM with pricing</li>
                <li>• Labor & installation costs</li>
                <li>• Financing options</li>
                <li>• Maintenance agreements</li>
                <li>• Total project investment</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Proposal Preview */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Sample Proposal Preview</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-2xl p-8 border border-purple-500/30">
              <h3 className="text-2xl font-bold mb-6">Enterprise Security Proposal</h3>
              <div className="space-y-4">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Project Overview</span>
                    <span className="text-purple-400 text-sm">Section 1</span>
                  </div>
                  <div className="text-white/70 text-sm">Comprehensive security upgrade for 50,000 sq ft facility including 64 IP cameras, access control, and intrusion detection.</div>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Equipment & Labor</span>
                    <span className="text-green-400 font-bold">$187,450</span>
                  </div>
                  <div className="text-white/70 text-sm">64× IP cameras, NVR system, access control panels, installation & configuration</div>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Project Timeline</span>
                    <span className="text-blue-400 font-bold">6 weeks</span>
                  </div>
                  <div className="text-white/70 text-sm">Design approval, equipment procurement, installation, testing & commissioning</div>
                </div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-2xl p-8 border border-purple-500/30">
              <h3 className="text-2xl font-bold mb-6">Proposal Features</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                  <div>
                    <div className="font-semibold">Professional Branding</div>
                    <div className="text-white/70 text-sm">Your logo and company colors throughout</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                  <div>
                    <div className="font-semibold">Interactive Elements</div>
                    <div className="text-white/70 text-sm">Clickable diagrams and expandable sections</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                  <div>
                    <div className="font-semibold">Multiple Formats</div>
                    <div className="text-white/70 text-sm">PDF, web presentation, and PowerPoint</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">✓</div>
                  <div>
                    <div className="font-semibold">Digital Signatures</div>
                    <div className="text-white/70 text-sm">Built-in e-signature capability</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* AI-Generated Content */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">AI-Powered Content Generation</h2>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  🧠
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Intelligent BOM Generation</h3>
                  <p className="text-white/80">AI analyzes facility requirements and automatically generates accurate bills of materials with current pricing from vendor databases.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  📊
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Dynamic Pricing Models</h3>
                  <p className="text-white/80">Real-time pricing updates from distributor feeds ensure accurate quotes with appropriate markup calculations and competitive positioning.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  📝
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Professional Copywriting</h3>
                  <p className="text-white/80">AI generates compelling proposal copy that highlights benefits, addresses concerns, and positions your solution as the clear choice.</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-2xl p-8 border border-purple-500/30 text-center">
              <div className="text-5xl mb-6">⚡</div>
              <h3 className="text-2xl font-bold mb-6">Generation Speed</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Proposal Draft:</span>
                  <span className="text-green-400 font-bold">&lt; 2 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Technical Review:</span>
                  <span className="text-blue-400 font-bold">&lt; 5 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Final Delivery:</span>
                  <span className="text-purple-400 font-bold">&lt; 10 minutes</span>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <div className="text-orange-400 font-bold text-lg">vs 2-5 days manual</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customization Options */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Proposal Customization</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-4">Brand Integration</h3>
              <p className="text-white/80">Seamlessly integrate your company logo, colors, fonts, and messaging across all proposal elements for consistent brand presentation.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-4">Template Library</h3>
              <p className="text-white/80">Choose from industry-specific templates or create custom layouts that match your established proposal format and client expectations.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold mb-4">Content Control</h3>
              <p className="text-white/80">Edit, enhance, or override any AI-generated content while maintaining professional formatting and technical accuracy throughout.</p>
            </div>
          </div>
        </section>

        {/* Success Metrics */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Proposal Performance Results</h2>
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">87%</div>
              <div className="text-white/80">Win Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">94%</div>
              <div className="text-white/80">Client Satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">15x</div>
              <div className="text-white/80">Faster Creation</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-400 mb-2">23%</div>
              <div className="text-white/80">Higher Close Rate</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-8 py-20">
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-2xl p-12 text-center border border-purple-500/30">
            <div className="text-5xl mb-6">📋</div>
            <h2 className="text-3xl font-bold mb-6">Create Winning Proposals in Minutes</h2>
            <p className="text-xl text-white/80 mb-8">
              Transform your proposal process with AI-powered generation. Impress clients, win more deals, and reduce time-to-quote from days to minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleGenerateProposalClick}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Generate Sample Proposal
              </button>
              <Link 
                href="/subscribe"
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Get Early Access
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


