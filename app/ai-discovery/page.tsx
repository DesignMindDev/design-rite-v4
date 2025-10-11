"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import UnifiedNavigation from '../components/UnifiedNavigation'
import Footer from '../components/Footer'
import { CheckCircle, Clock, FileText, Shield, Zap, MessageSquare, Building2, Users, TrendingUp, Award } from 'lucide-react'

export default function AIDiscoveryMarketingPage() {
  const router = useRouter()

  const handleTryPlatform = () => {
    router.push('/pricing')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      <UnifiedNavigation />

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-8 pt-20 pb-16 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-full px-6 py-3 text-sm font-medium mb-8">
            <span className="text-2xl">🤖</span>
            <span>AI Discovery Assistant - Comprehensive Security Assessment</span>
          </div>
        </div>

        <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
          Transform <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">15-20 Minutes</span> Into a Professional Security Proposal
        </h1>

        <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
          Our AI Discovery Assistant guides you through a comprehensive, conversation-driven security assessment. Get detailed proposals with compliance mapping, risk analysis, and implementation timelines—all in less time than a coffee break.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleTryPlatform}
            className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg text-lg"
          >
            🚀 Start 14-Day Free Trial
          </button>
          <a
            href="/estimate-options"
            className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20 text-lg"
          >
            See All Assessment Options
          </a>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="max-w-6xl mx-auto px-8 py-20 bg-white/5 backdrop-blur-sm">
        <h2 className="text-4xl font-bold text-center mb-16">What You'll Get in 15-20 Minutes</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Professional Proposal Documents</h3>
                <p className="text-white/80">Comprehensive proposals with detailed specifications, equipment recommendations, and full compliance documentation ready to present to clients.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">AI-Guided Discovery Conversation</h3>
                <p className="text-white/80">Intelligent questioning adapts to your facility type, identifying security gaps and compliance requirements you might have missed.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Complete Compliance Framework</h3>
                <p className="text-white/80">Automatic mapping to HIPAA, FERPA, CJIS, SOC 2, and industry-specific regulations with documentation ready for audits.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Implementation Timeline & Phasing</h3>
                <p className="text-white/80">Detailed project timelines with milestone tracking, phased rollout strategies, and resource allocation recommendations.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Risk Assessment & Mitigation</h3>
                <p className="text-white/80">Comprehensive threat analysis with prioritized mitigation strategies based on your facility's unique vulnerabilities.</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Real Product Recommendations</h3>
                <p className="text-white/80">Specific equipment recommendations with accurate pricing from our database of 3,000+ security products and verified vendor pricing.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Perfect For Complex Security Projects</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4">Large or Multi-Site Facilities</h3>
            <p className="text-white/80">Hospitals, universities, corporate campuses, and enterprise installations requiring comprehensive security architecture.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4">Compliance & Regulatory Needs</h3>
            <p className="text-white/80">Healthcare (HIPAA), education (FERPA), government (CJIS), financial (SOX), and other regulated industries.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-4">Custom Requirements</h3>
            <p className="text-white/80">Specialized security needs, integration with existing systems, or unique facility challenges requiring detailed analysis.</p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="max-w-6xl mx-auto px-8 py-20 bg-white/5 backdrop-blur-sm">
        <h2 className="text-4xl font-bold text-center mb-16">How the AI Discovery Assistant Works</h2>
        <div className="space-y-8">
          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 text-xl">
              1
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Quick Start with Smart Scenarios</h3>
              <p className="text-white/80 text-lg">Choose from pre-built industry scenarios (office, retail, healthcare, education) to accelerate your assessment by 60-70%. Or start from scratch for fully custom projects.</p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 text-xl">
              2
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Comprehensive Discovery Conversation</h3>
              <p className="text-white/80 text-lg">Answer intelligent questions about your facility, security concerns, compliance requirements, and implementation preferences. The AI adapts based on your responses.</p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 text-xl">
              3
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">AI Generates Your Proposal</h3>
              <p className="text-white/80 text-lg">Our AI analyzes your requirements, maps compliance frameworks, recommends specific products, calculates accurate pricing, and generates a complete professional proposal package.</p>
            </div>
          </div>

          <div className="flex items-start gap-6">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0 text-xl">
              4
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3">Refine with AI Assistant (Optional)</h3>
              <p className="text-white/80 text-lg">Use our AI Assistant Refinement tool to make conversational adjustments: "Add more cameras to parking lot" → Instant proposal updates with real-time pricing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="max-w-6xl mx-auto px-8 py-20">
        <h2 className="text-4xl font-bold text-center mb-16">Why Choose AI Discovery Over Quick Estimate?</h2>
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              AI Discovery Assistant
            </h3>
            <ul className="space-y-4 text-white/80">
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold text-lg mt-0.5">✓</span>
                <span><strong>15-20 minutes</strong> comprehensive assessment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold text-lg mt-0.5">✓</span>
                <span><strong>Detailed compliance</strong> framework mapping</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold text-lg mt-0.5">✓</span>
                <span><strong>Risk assessment</strong> and mitigation strategies</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold text-lg mt-0.5">✓</span>
                <span><strong>Implementation timeline</strong> and phasing plan</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold text-lg mt-0.5">✓</span>
                <span><strong>Professional proposal</strong> package ready to present</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-500 font-bold text-lg mt-0.5">✓</span>
                <span><strong>Complex projects</strong> with custom requirements</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 opacity-60">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Award className="w-8 h-8 text-purple-500" />
              Quick Security Estimate
            </h3>
            <ul className="space-y-4 text-white/80">
              <li className="flex items-start gap-3">
                <span className="text-purple-500 font-bold text-lg mt-0.5">•</span>
                <span><strong>5 minutes</strong> basic assessment</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 font-bold text-lg mt-0.5">•</span>
                <span><strong>No compliance</strong> documentation</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 font-bold text-lg mt-0.5">•</span>
                <span><strong>No risk assessment</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 font-bold text-lg mt-0.5">•</span>
                <span><strong>No timeline</strong> or implementation plan</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 font-bold text-lg mt-0.5">•</span>
                <span><strong>PDF summary</strong> only</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-purple-500 font-bold text-lg mt-0.5">•</span>
                <span><strong>Standard projects</strong> under 100k sqft</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-8 py-20">
        <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-2xl p-12 text-center border border-purple-500/30">
          <div className="text-5xl mb-6">🚀</div>
          <h2 className="text-3xl font-bold mb-6">Ready to Create Professional Proposals in Minutes?</h2>
          <p className="text-xl text-white/80 mb-8">
            Start your 14-day free trial and get full access to AI Discovery Assistant, AI Assistant Refinement, and all premium features. No credit card required for trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleTryPlatform}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg text-lg"
            >
              Start 14-Day Free Trial
            </button>
            <a
              href="/watch-demo"
              className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20 text-lg"
            >
              Watch Demo Video
            </a>
          </div>
        </div>
      </section>

      <Footer redirectToApp={handleTryPlatform} />
    </div>
  )
}
