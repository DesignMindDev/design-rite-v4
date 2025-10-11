"use client"

import { useRouter } from 'next/navigation'
import UnifiedNavigation from '@/app/components/UnifiedNavigation'
import Footer from '@/app/components/Footer'
import { Calculator, Clock, Zap, FileText, Users, CheckCircle, ArrowRight, DollarSign, Shield } from 'lucide-react'

export default function SecurityEstimateMarketingPage() {
  const router = useRouter()

  const handleTryPlatform = () => {
    router.push('/pricing')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      <UnifiedNavigation />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center">
            <Calculator className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
          Get <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Instant Security Estimates</span> in 5 Minutes
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Quick, professional security system cost estimates with real-time pricing from 3,000+ products.
          Perfect for budget planning and client presentations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleTryPlatform}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg text-lg"
          >
            🚀 Start 14-Day Free Trial
          </button>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Perfect For Quick Budget Planning</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Clock className="w-12 h-12 text-purple-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">5 Minutes</h3>
            <p className="text-gray-300 text-sm">
              Quick budget planning with instant professional estimates
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Zap className="w-12 h-12 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">High-Level Costs</h3>
            <p className="text-gray-300 text-sm">
              Equipment and installation cost breakdowns
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <FileText className="w-12 h-12 text-green-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">Standard Systems</h3>
            <p className="text-gray-300 text-sm">
              Video surveillance, access control, intrusion, and fire detection
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <Users className="w-12 h-12 text-blue-400 mb-4" />
            <h3 className="text-xl font-bold mb-3">SMB Focus</h3>
            <p className="text-gray-300 text-sm">
              Ideal for facilities under 100,000 sq ft
            </p>
          </div>
        </div>
      </section>

      {/* What You'll Get */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">What You'll Get</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <DollarSign className="w-8 h-8 text-green-400" />
              Cost Breakdown
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Equipment and installation cost breakdown by system</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Real-time pricing from 3,000+ security products</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Professional PDF estimate summary</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <span>Total project investment calculation</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              System Options
            </h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>📹 Video Surveillance (1080p to 4K + AI Analytics)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>🔐 Access Control (Card readers to biometric)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>🚨 Intrusion Detection (Zones, sensors, monitoring)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                <span>🔥 Fire Detection & Life Safety</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Upgrade Path */}
      <section className="max-w-6xl mx-auto px-8 py-16 bg-white/5 rounded-3xl my-16">
        <h2 className="text-3xl font-bold text-center mb-8">Perfect Starting Point</h2>
        <p className="text-xl text-gray-300 text-center max-w-3xl mx-auto mb-12">
          Start with a quick estimate and enhance later with our AI-powered tools for comprehensive assessments
        </p>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-2xl p-6 border border-purple-500/30">
            <h3 className="text-xl font-bold mb-3 text-purple-300">Upgrade to AI Discovery</h3>
            <p className="text-gray-300 text-sm mb-4">
              15-20 minute comprehensive AI-guided assessment with detailed compliance analysis and professional proposal package
            </p>
            <div className="flex items-center gap-2 text-purple-400 text-sm font-medium">
              <ArrowRight className="w-4 h-4" />
              <span>Full compliance framework mapping</span>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-500/30">
            <h3 className="text-xl font-bold mb-3 text-green-300">Refine with AI Assistant</h3>
            <p className="text-gray-300 text-sm mb-4">
              5-10 minute AI-powered chat to refine any assessment with natural language adjustments and real-time pricing updates
            </p>
            <div className="flex items-center gap-2 text-green-400 text-sm font-medium">
              <ArrowRight className="w-4 h-4" />
              <span>Conversational improvements</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Security Professionals Love It</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
            <p className="text-gray-300">Complete professional estimates in just 5 minutes - no more hours of manual calculations</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-3">Real Pricing</h3>
            <p className="text-gray-300">3,000+ security products with live pricing data - always accurate, always current</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3">Professional Output</h3>
            <p className="text-gray-300">Client-ready PDF estimates with detailed breakdowns and investment summaries</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center max-w-4xl mx-auto px-8 py-16">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Streamline Your Estimation Process?
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Join hundreds of security professionals who've revolutionized their workflow with Design-Rite.
        </p>
        <button
          onClick={handleTryPlatform}
          className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all text-lg"
        >
          Start 14-Day Free Trial
        </button>
        <p className="text-sm text-gray-400 mt-4">
          No credit card required • Full access to all features
        </p>
      </section>

      <Footer redirectToApp={handleTryPlatform} />
    </div>
  )
}
