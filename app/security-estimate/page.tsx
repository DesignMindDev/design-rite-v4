"use client"

import { useRouter } from 'next/navigation'
import UnifiedNavigation from '@/app/components/UnifiedNavigation'
import Footer from '@/app/components/Footer'
import { Calculator, Clock, Zap, FileText, Users, CheckCircle, DollarSign, TrendingUp } from 'lucide-react'

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
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
            <Calculator className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
          <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">5-Minute</span> Security System Estimate
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Get instant professional estimates with real pricing from 3,000+ security products.
          Self-guided, accurate, and ready in minutes.
        </p>
        <button
          onClick={handleTryPlatform}
          className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg text-lg"
        >
          🚀 Start 14-Day Free Trial
        </button>
      </section>

      {/* What You'll Get */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">What You'll Get</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3">Instant Results</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Complete estimate in 5 minutes</li>
              <li>• Real-time pricing calculations</li>
              <li>• Equipment cost breakdowns</li>
              <li>• Installation labor estimates</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-3">Accurate Pricing</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• 3,000+ security products database</li>
              <li>• Real market pricing data</li>
              <li>• System-specific costs</li>
              <li>• Professional-grade accuracy</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">📄</div>
            <h3 className="text-xl font-bold mb-3">Professional Output</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• PDF estimate summary</li>
              <li>• Detailed cost breakdown</li>
              <li>• System recommendations</li>
              <li>• Option to enhance with AI</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Perfect For */}
      <section className="max-w-6xl mx-auto px-8 py-16 bg-white/5 rounded-3xl my-16">
        <h2 className="text-3xl font-bold text-center mb-12">Perfect For</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <Clock className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-2">Quick Budget Planning</h3>
              <p className="text-gray-400 text-sm">Need a ballpark estimate fast? Get accurate numbers in 5 minutes for initial client conversations.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FileText className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-2">Standard Security Systems</h3>
              <p className="text-gray-400 text-sm">Surveillance, access control, intrusion detection, and fire systems with straightforward requirements.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Users className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-2">Small to Mid-Size Facilities</h3>
              <p className="text-gray-400 text-sm">Perfect for facilities under 100,000 sq ft with typical security needs.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-2">Self-Guided Simplicity</h3>
              <p className="text-gray-400 text-sm">No complicated forms. Just check the systems you need, enter quantities, and get your estimate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Simple 4-Step Process</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
            <h3 className="font-bold mb-2">Select Systems</h3>
            <p className="text-gray-400 text-sm">Check boxes for surveillance, access control, intrusion, fire</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
            <h3 className="font-bold mb-2">Enter Quantities</h3>
            <p className="text-gray-400 text-sm">Cameras, doors, zones - basic counts for each system</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-600 to-green-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
            <h3 className="font-bold mb-2">Get Instant Estimate</h3>
            <p className="text-gray-400 text-sm">AI calculates costs with real pricing data instantly</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
            <h3 className="font-bold mb-2">Download or Enhance</h3>
            <p className="text-gray-400 text-sm">Export PDF or upgrade to AI Discovery for details</p>
          </div>
        </div>
      </section>

      {/* Real Example */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Real-World Example</h2>
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">Office Building Project</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>16 IP cameras (mix of indoor/outdoor)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>4 doors with card reader access control</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>8 detection zones for intrusion system</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>Complete estimate in 5 minutes</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">Instant Cost Breakdown</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Surveillance: $19,200 (cameras, NVR, storage)</span>
                </li>
                <li className="flex items-start gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Access Control: $8,400 (readers, controllers)</span>
                </li>
                <li className="flex items-start gap-2">
                  <DollarSign className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Intrusion: $4,800 (sensors, panel, monitoring)</span>
                </li>
                <li className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span><strong>Total: $32,400</strong> with full breakdown</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Sales Engineers Love It</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">5 Minutes vs 2 Hours</h3>
            <p className="text-gray-300">Get initial estimates 95% faster than manual calculation with spreadsheets</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <FileText className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">Real Pricing Data</h3>
            <p className="text-gray-300">3,000+ products with accurate market pricing - not guesswork</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">Upgrade Anytime</h3>
            <p className="text-gray-300">Start with quick estimate, enhance with AI Discovery when client is serious</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center max-w-4xl mx-auto px-8 py-16">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Accelerate Your Estimates?
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Join sales engineers who've cut estimate time from hours to minutes with accurate, professional results.
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
