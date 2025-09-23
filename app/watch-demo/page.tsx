"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import UnifiedNavigation from '../components/UnifiedNavigation'
import Footer from '../components/Footer'

interface SiteSettings {
  logoPath: string
  footerLogoPath: string
  demoVideoUrl: string
}

function getYouTubeEmbedUrl(url: string): string | null {
  if (!url) return null

  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
  const match = url.match(regex)
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

export default function WatchDemoPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [settings, setSettings] = useState<SiteSettings>({ logoPath: '', footerLogoPath: '', demoVideoUrl: '' })
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data)
      }
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const redirectToApp = () => {
    window.location.href = '/waitlist'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      <UnifiedNavigation />

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-8 pt-20 pb-16 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-full px-6 py-3 text-sm font-medium mb-8">
              <span className="text-2xl">📹</span>
              <span>Product Demo - See AI in Action</span>
            </div>
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
            Watch Design-Rite <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Transform</span> Security Design
          </h1>
          
          <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
            See how our AI-powered platform analyzes facilities, generates comprehensive assessments, and produces professional proposals in minutes instead of days.
          </p>
        </section>

        {/* Video Section */}
        <section className="max-w-4xl mx-auto px-8 mb-20">
          {loading ? (
            <div className="relative bg-black/50 rounded-2xl border border-purple-500/30 overflow-hidden aspect-video flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-xl text-white/80">Loading demo video...</p>
              </div>
            </div>
          ) : settings.demoVideoUrl ? (
            <div className="relative bg-black/50 rounded-2xl border border-purple-500/30 overflow-hidden aspect-video">
              <iframe
                src={getYouTubeEmbedUrl(settings.demoVideoUrl) || ''}
                title="Design-Rite Demo Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="relative bg-black/50 rounded-2xl border border-purple-500/30 overflow-hidden aspect-video">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-purple-700/20 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-6">🎬</div>
                  <h3 className="text-3xl font-bold mb-4">Demo Video Coming Soon</h3>
                  <p className="text-xl text-white/80 mb-8">We're creating an incredible demo showcasing our AI platform in action.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={redirectToApp}
                      className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg"
                    >
                      Try Live Demo Instead
                    </button>
                    <Link
                      href="/subscribe"
                      className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
                    >
                      Notify Me When Ready
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* What You'll See Section */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">What You'll See in Our Demo</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">AI Facility Analysis</h3>
                  <p className="text-white/80">Watch our AI analyze facility layouts, identify security vulnerabilities, and recommend optimal camera and sensor placement in real-time.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Automated Assessment</h3>
                  <p className="text-white/80">See how comprehensive security assessments are generated automatically, including threat analysis, compliance requirements, and detailed recommendations.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Professional Proposals</h3>
                  <p className="text-white/80">Watch as detailed proposals with equipment lists, pricing, and installation plans are generated in minutes, ready to present to clients.</p>
                </div>
              </div>
            </div>
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Compliance Integration</h3>
                  <p className="text-white/80">See how the platform automatically ensures compliance with industry standards like NIST, SOC 2, and sector-specific regulations.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Cost Analysis</h3>
                  <p className="text-white/80">Observe real-time cost calculations, ROI projections, and budget optimization suggestions based on facility size and security requirements.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  6
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Client Presentations</h3>
                  <p className="text-white/80">See how the platform generates client-ready presentations with 3D visualizations, technical specifications, and executive summaries.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Try Now Section */}
        <section className="max-w-4xl mx-auto px-8 py-20">
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-2xl p-12 text-center border border-purple-500/30">
            <div className="text-5xl mb-6">⚡</div>
            <h2 className="text-3xl font-bold mb-6">Can't Wait for the Video?</h2>
            <p className="text-xl text-white/80 mb-8">
              Experience our AI security assessment platform right now with our interactive demo. No signup required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={redirectToApp}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Try Interactive Demo
              </button>
              <Link 
                href="/integrators"
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Learn More About Solutions
              </Link>
            </div>
          </div>
        </section>

        {/* Benefits for Different Users */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Perfect for Every Security Professional</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-4xl mb-4">🔧</div>
              <h3 className="text-xl font-bold mb-4">Security Integrators</h3>
              <p className="text-white/80">Accelerate project delivery and increase profit margins with AI-powered design automation and professional proposal generation.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold mb-4">Enterprise Security</h3>
              <p className="text-white/80">Ensure comprehensive coverage and compliance while optimizing security budgets with data-driven recommendations.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center">
              <div className="text-4xl mb-4">🎓</div>
              <h3 className="text-xl font-bold mb-4">Education & Healthcare</h3>
              <p className="text-white/80">Meet strict compliance requirements while maintaining safety and privacy standards with specialized assessment protocols.</p>
            </div>
          </div>
        </section>
      </main>

      <Footer redirectToApp={redirectToApp} />

      {/* Chat Button */}
      <div className="fixed bottom-5 right-5 z-[999999]">
        <button className="w-15 h-15 bg-purple-600 rounded-full cursor-pointer flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all">
          <div className="text-white text-2xl font-bold">💬</div>
        </button>
      </div>
    </div>
  )
}


