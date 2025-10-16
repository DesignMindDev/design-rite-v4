"use client"

import { useRouter } from 'next/navigation'
import UnifiedNavigation from '@/app/components/UnifiedNavigation'
import Footer from '@/app/components/Footer'
import { FileSpreadsheet, Zap, Upload, CheckCircle, Clock, Users, Building2 } from 'lucide-react'

export default function SystemSurveyorMarketingPage() {
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
            <FileSpreadsheet className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
          Transform <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Field Surveys</span> Into Professional Proposals
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Upload System Surveyor Excel exports and get AI-powered security proposals in minutes.
          No API setup required.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleTryPlatform}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg text-lg"
          >
            🚀 Take the Design Rite Challenge
          </button>
        </div>
      </section>

      {/* What You Get */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">What Gets Imported</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-3">Site Information</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Site name and address</li>
              <li>• Survey descriptions</li>
              <li>• Technician details</li>
              <li>• Export timestamps</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">📹</div>
            <h3 className="text-xl font-bold mb-3">Equipment Data</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Cameras with locations</li>
              <li>• Network infrastructure</li>
              <li>• Access control devices</li>
              <li>• Cable runs and mounting</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold mb-3">Labor & Costing</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Installation hour estimates</li>
              <li>• Labor cost calculations</li>
              <li>• Equipment quantities</li>
              <li>• Real-time pricing</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-8 py-16 bg-white/5 rounded-3xl my-16">
        <h2 className="text-3xl font-bold text-center mb-12">Simple 4-Step Process</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
            <h3 className="font-bold mb-2">Export from System Surveyor</h3>
            <p className="text-gray-400 text-sm">Save your field survey as Excel (.xlsx)</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
            <h3 className="font-bold mb-2">Upload to Design-Rite</h3>
            <p className="text-gray-400 text-sm">Drag & drop your Excel file</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
            <h3 className="font-bold mb-2">AI Processing</h3>
            <p className="text-gray-400 text-sm">Equipment categorized & mapped automatically</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-red-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">4</div>
            <h3 className="font-bold mb-2">Professional Proposal</h3>
            <p className="text-gray-400 text-sm">Complete BOM with pricing ready to send</p>
          </div>
        </div>
      </section>

      {/* Real Example */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Real-World Example: Patriot Auto</h2>
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-2xl p-8 border border-purple-500/30">
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">Site: 12100 Lorain Ave, Cleveland OH</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>14 cameras with surveyed locations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>3 network devices auto-configured</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>47 cable runs → 115 installation hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span>$9,775 labor cost calculated automatically</span>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-purple-400">Intelligent AI Mapping</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Indoor vs Outdoor detection from location keywords</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Camera type recommendations (Bullet/Turret/Dome)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>Network switch sizing based on device count</span>
                </li>
                <li className="flex items-start gap-2">
                  <Zap className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span>PoE requirement analysis</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why System Surveyor Users Love It</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <Clock className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">90% Faster</h3>
            <p className="text-gray-300">20+ hours of manual proposal work → 45 minutes with AI</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <Upload className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">No API Setup</h3>
            <p className="text-gray-300">Upload Excel exports directly - works offline instantly</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <Users className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">Field-Verified Data</h3>
            <p className="text-gray-300">Real measurements eliminate site revisits and guesswork</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center max-w-4xl mx-auto px-8 py-16">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Transform Your Workflow?
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Join System Surveyor users who've revolutionized their proposal process with Design-Rite.
        </p>
        <button
          onClick={handleTryPlatform}
          className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all text-lg"
        >
          Take the Challenge - 7 Days Free
        </button>
        <p className="text-sm text-gray-400 mt-4">
          No credit card required • Full access to all features
        </p>
      </section>

      <Footer redirectToApp={handleTryPlatform} />
    </div>
  )
}
