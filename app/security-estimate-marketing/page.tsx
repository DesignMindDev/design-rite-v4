"use client"

import { useRouter } from 'next/navigation'
import UnifiedNavigation from '@/app/components/UnifiedNavigation'
import Footer from '@/app/components/Footer'
import { Bot, MessageSquare, Sparkles, RefreshCw, Upload, CheckCircle, Zap, FileText } from 'lucide-react'

export default function AIRefinementMarketingPage() {
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
          <div className="w-16 h-16 bg-gradient-to-br from-violet-600 to-purple-600 rounded-xl flex items-center justify-center">
            <Bot className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
          Refine Any Assessment with <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">AI Conversation</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Natural language refinement for security proposals. Upload existing estimates or start from scratch.
          Just chat to improve.
        </p>
        <button
          onClick={handleTryPlatform}
          className="bg-gradient-to-r from-violet-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-violet-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg text-lg"
        >
          🚀 Take the Design Rite Challenge
        </button>
      </section>

      {/* How It Works */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Conversation-Driven Refinement</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-xl font-bold mb-3">Upload or Start Fresh</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Upload existing proposals (PDF, DOC, TXT)</li>
              <li>• Continue from Quick Estimate or AI Discovery</li>
              <li>• Start from scratch with natural language</li>
              <li>• Up to 10MB file uploads supported</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">💬</div>
            <h3 className="text-xl font-bold mb-3">Chat to Refine</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• "Add more cameras to parking area"</li>
              <li>• "Reduce budget by 20%"</li>
              <li>• "Include HIPAA compliance"</li>
              <li>• "Switch to premium access control"</li>
            </ul>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3">Instant Updates</h3>
            <ul className="text-gray-300 space-y-2 text-sm">
              <li>• Real-time pricing updates</li>
              <li>• Equipment recommendations adjusted</li>
              <li>• Professional proposal regenerated</li>
              <li>• Download updated PDF/BOM instantly</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Perfect For */}
      <section className="max-w-6xl mx-auto px-8 py-16 bg-white/5 rounded-3xl my-16">
        <h2 className="text-3xl font-bold text-center mb-12">Perfect For</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-4">
            <Sparkles className="w-6 h-6 text-violet-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-2">Refining Existing Proposals</h3>
              <p className="text-gray-400 text-sm">Upload previous estimates and enhance them with AI-powered conversation. Perfect for iterative improvements.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <RefreshCw className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-2">Client-Requested Changes</h3>
              <p className="text-gray-400 text-sm">"Can you add access control?" or "Budget needs to be lower" - just tell the AI what changed.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <MessageSquare className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-2">Natural Language Improvements</h3>
              <p className="text-gray-400 text-sm">No forms to fill out. Just describe what you want in plain English and watch the proposal update.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Upload className="w-6 h-6 text-purple-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold mb-2">Upgrading Quick Estimates</h3>
              <p className="text-gray-400 text-sm">Start with 5-minute estimate, then refine with AI conversation to add detail and customization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Conversation Examples */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Real Conversation Examples</h2>
        <div className="space-y-6">
          {/* Example 1 */}
          <div className="bg-gradient-to-r from-violet-900/30 to-purple-900/30 rounded-2xl p-6 border border-violet-500/30">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-violet-600 rounded-lg p-2">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-gray-300 italic">"Add 4 more cameras to the parking lot area"</p>
              </div>
            </div>
            <div className="flex items-start gap-4 ml-12">
              <div className="bg-gray-700 rounded-lg p-2">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-gray-200">Great! I've updated your surveillance system recommendations:</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  <li>• Added 4x outdoor bullet cameras (2MP/4MP options)</li>
                  <li>• Upgraded storage to accommodate extra streams</li>
                  <li>• Enhanced analytics package for motion detection</li>
                  <li>• <strong className="text-violet-400">Previous: $28,500 → New: $31,200</strong> (+$2,700)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Example 2 */}
          <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 rounded-2xl p-6 border border-blue-500/30">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-blue-600 rounded-lg p-2">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-gray-300 italic">"Budget needs to be under $25K - what can we optimize?"</p>
              </div>
            </div>
            <div className="flex items-start gap-4 ml-12">
              <div className="bg-gray-700 rounded-lg p-2">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-gray-200">I'll help optimize your budget!</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  <li>• Switch to 1080p cameras in low-priority areas (-$3,200)</li>
                  <li>• Use hybrid wired/wireless access points (-$1,800)</li>
                  <li>• Standard analytics vs. premium package (-$2,400)</li>
                  <li>• <strong className="text-green-400">Current: $31,200 → Optimized: $23,800</strong> (-24% savings)</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Example 3 */}
          <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-start gap-4 mb-4">
              <div className="bg-green-600 rounded-lg p-2">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-gray-300 italic">"We need this to be HIPAA compliant for the medical office"</p>
              </div>
            </div>
            <div className="flex items-start gap-4 ml-12">
              <div className="bg-gray-700 rounded-lg p-2">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <p className="text-gray-200">Perfect! I've added HIPAA compliance requirements:</p>
                <ul className="mt-2 space-y-1 text-sm text-gray-300">
                  <li>• Encrypted video storage and transmission</li>
                  <li>• Access control with audit trail logging</li>
                  <li>• NDAA-compliant camera equipment</li>
                  <li>• Business Associate Agreement (BAA) coverage</li>
                  <li>• <strong className="text-green-400">Compliance cost: +$4,200</strong></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">What You'll Export</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <FileText className="w-12 h-12 text-violet-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">Updated Proposal</h3>
            <p className="text-gray-300">Professional proposal documents with all your conversational refinements applied</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">Detailed BOM</h3>
            <p className="text-gray-300">Complete bill of materials with real pricing updated in real-time</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <CheckCircle className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-3">Implementation Plan</h3>
            <p className="text-gray-300">Timeline and phasing recommendations based on conversation context</p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="max-w-6xl mx-auto px-8 py-16 bg-white/5 rounded-3xl my-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why Sales Engineers Love It</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-3">10x Faster Revisions</h3>
            <p className="text-gray-300">Client change requests that used to take hours now take minutes with natural language</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-3">No Learning Curve</h3>
            <p className="text-gray-300">Just describe what you want - no forms, dropdowns, or complicated UI to learn</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
            <div className="text-4xl mb-4">🔄</div>
            <h3 className="text-xl font-bold mb-3">Iterative Improvement</h3>
            <p className="text-gray-300">Keep refining until perfect - every conversation makes the proposal better</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center max-w-4xl mx-auto px-8 py-16">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Refine with AI?
        </h2>
        <p className="text-xl text-gray-400 mb-8">
          Join sales engineers using natural language to perfect security proposals in minutes, not hours.
        </p>
        <button
          onClick={handleTryPlatform}
          className="bg-white text-violet-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all text-lg"
        >
          Take the Challenge - 7 Days Free
        </button>
        <p className="text-sm text-gray-400 mt-4">
          No credit card required • Full access to all features • Upload existing proposals instantly
        </p>
      </section>

      <Footer redirectToApp={handleTryPlatform} />
    </div>
  )
}
