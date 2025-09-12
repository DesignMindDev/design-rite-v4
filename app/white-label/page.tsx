"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function WhiteLabelPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 text-center text-sm font-semibold relative z-[1001]">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-4">
          <span className="text-base">🏢</span>
          <span className="flex-1 text-center">
            White-Label AI Platform - Launch your own branded security design solution in weeks, not years
          </span>
          <Link 
            href="/subscribe"
            className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-white/30 transition-all border border-white/30"
          >
            Partner With Us
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="bg-black/10 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50 py-5">
        <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-bold text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-black text-sm">
              DR
            </div>
            Design-Rite
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            <li><Link href="/integrators" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Security Integrators</Link></li>
            <li><Link href="/enterprise" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Enterprise</Link></li>
            <li><Link href="/education" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Education</Link></li>
            <li><Link href="/white-label" className="text-white bg-white/10 px-4 py-2 rounded-lg font-medium">White Label</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Contact</Link></li>
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="text-white border-2 border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Sign In
            </Link>
            <button 
              onClick={() => router.push('/contact')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
            >
              Become Partner
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/20 backdrop-blur-sm border-t border-white/10">
            <div className="px-6 py-4 space-y-4">
              <Link href="/integrators" className="block text-white/80 hover:text-white transition-colors py-2">Security Integrators</Link>
              <Link href="/enterprise" className="block text-white/80 hover:text-white transition-colors py-2">Enterprise</Link>
              <Link href="/education" className="block text-white/80 hover:text-white transition-colors py-2">Education</Link>
              <Link href="/white-label" className="block text-white bg-white/10 px-4 py-2 rounded-lg">White Label</Link>
              <Link href="/contact" className="block text-white/80 hover:text-white transition-colors py-2">Contact</Link>
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link href="/login" className="block text-center text-white border-2 border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
                  Sign In
                </Link>
                <button 
                  onClick={() => router.push('/contact')}
                  className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
                >
                  Become Partner
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-8 pt-20 pb-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-full px-6 py-3 text-sm font-medium mb-8">
              <span className="text-2xl">🚀</span>
              <span>Partnership Opportunity</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              Launch Your Own <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">AI Platform</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform your business with our white-label AI security platform. Complete branding customization, dedicated support, and proven technology that's already helping hundreds of integrators worldwide. Launch in weeks, not years.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/contact')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Become a Partner
              </button>
              <Link 
                href="/watch-demo"
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                See Platform Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Value Proposition */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Why White-Label Design-Rite?</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 text-center">
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold mb-4">Complete Ownership</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Your brand, your customers, your pricing. We provide the technology engine while you maintain complete control over your business relationships and revenue streams.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 text-center">
              <div className="text-4xl mb-6">🚀</div>
              <h3 className="text-2xl font-bold mb-4">Rapid Deployment</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Launch your AI-powered platform in 2-4 weeks with complete branding, custom domains, and integrated payment processing. Skip years of development and go to market immediately.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 text-center">
              <div className="text-4xl mb-6">💰</div>
              <h3 className="text-2xl font-bold mb-4">Proven Revenue Model</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Join partners already generating 6-figure monthly recurring revenue. Our platform is proven, scalable, and continuously improved based on real-world usage.
              </p>
            </div>
          </div>
        </section>

        {/* Customization Options */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Complete Branding Control</h2>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  🎨
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Visual Branding</h3>
                  <p className="text-white/80">Complete customization of logos, colors, fonts, and styling to match your brand identity perfectly. Your customers see only your brand, never ours.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  🌐
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Custom Domain</h3>
                  <p className="text-white/80">Host the platform on your own domain with SSL certificates, custom email addresses, and complete URL control for seamless brand integration.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  📝
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Content Customization</h3>
                  <p className="text-white/80">Modify all text, messaging, and documentation to reflect your expertise, specializations, and unique value proposition in the market.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  💳
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Payment Integration</h3>
                  <p className="text-white/80">Integrated Stripe processing with your merchant account. All payments go directly to you with transparent revenue sharing and detailed analytics.</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-2xl p-8 border border-purple-500/30">
              <h3 className="text-2xl font-bold mb-6 text-center">Partner Success Example</h3>
              <div className="space-y-6">
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">SecureFlow Systems</span>
                    <span className="text-green-400 font-bold">$47K/month</span>
                  </div>
                  <div className="text-white/70 text-sm">8 months as partner • 340+ clients</div>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Guardian Solutions</span>
                    <span className="text-blue-400 font-bold">$23K/month</span>
                  </div>
                  <div className="text-white/70 text-sm">4 months as partner • 180+ clients</div>
                </div>
                
                <div className="bg-white/10 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">TechSecure Pro</span>
                    <span className="text-purple-400 font-bold">$31K/month</span>
                  </div>
                  <div className="text-white/70 text-sm">6 months as partner • 250+ clients</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Tiers */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Partnership Options</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-white mb-2">Startup Partner</div>
                <div className="text-4xl font-bold text-purple-400 mb-4">30%</div>
                <div className="text-white/70">Revenue Share</div>
              </div>
              <ul className="space-y-3 text-white/80">
                <li>• Complete platform branding</li>
                <li>• Custom domain setup</li>
                <li>• Basic support package</li>
                <li>• Marketing materials</li>
                <li>• 2-week launch timeline</li>
              </ul>
              <button 
                onClick={() => router.push('/contact')}
                className="w-full bg-purple-600/20 text-purple-300 px-6 py-3 rounded-xl font-semibold border border-purple-600/30 hover:bg-purple-600/30 transition-all mt-6"
              >
                Get Started
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-1 rounded-full text-xs font-bold">
                  MOST POPULAR
                </div>
              </div>
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-white mb-2">Growth Partner</div>
                <div className="text-4xl font-bold text-purple-400 mb-4">40%</div>
                <div className="text-white/70">Revenue Share</div>
              </div>
              <ul className="space-y-3 text-white/80">
                <li>• Everything in Startup</li>
                <li>• Priority support & training</li>
                <li>• Custom feature requests</li>
                <li>• Advanced analytics dashboard</li>
                <li>• Dedicated account manager</li>
              </ul>
              <button 
                onClick={() => router.push('/contact')}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all mt-6"
              >
                Become Partner
              </button>
            </div>
            
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="text-center mb-6">
                <div className="text-2xl font-bold text-white mb-2">Enterprise Partner</div>
                <div className="text-4xl font-bold text-purple-400 mb-4">50%</div>
                <div className="text-white/70">Revenue Share</div>
              </div>
              <ul className="space-y-3 text-white/80">
                <li>• Everything in Growth</li>
                <li>• White-label mobile app</li>
                <li>• API access & integrations</li>
                <li>• Co-marketing opportunities</li>
                <li>• Exclusive territory rights</li>
              </ul>
              <button 
                onClick={() => router.push('/contact')}
                className="w-full bg-purple-600/20 text-purple-300 px-6 py-3 rounded-xl font-semibold border border-purple-600/30 hover:bg-purple-600/30 transition-all mt-6"
              >
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* Implementation Process */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Simple Implementation Process</h2>
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold mb-4">Partner Agreement</h3>
              <p className="text-white/80">Review partnership terms, revenue sharing structure, and territory agreements. Sign contracts and begin onboarding process.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold mb-4">Brand Customization</h3>
              <p className="text-white/80">Our team implements your complete branding including logo, colors, domain, and custom messaging throughout the platform.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold mb-4">Training & Launch</h3>
              <p className="text-white/80">Comprehensive platform training for your team, marketing material creation, and coordinated launch with ongoing support.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">4</div>
              <h3 className="text-xl font-bold mb-4">Growth & Scale</h3>
              <p className="text-white/80">Continuous platform improvements, feature updates, and marketing support to help you scale your business rapidly.</p>
            </div>
          </div>
        </section>

        {/* Success Stories */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Partner Success Stories</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white">SF</div>
                <div>
                  <div className="font-bold">Sarah Foster</div>
                  <div className="text-white/70 text-sm">CEO, SecureFlow Systems</div>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed mb-4">
                "The white-label platform transformed our business completely. We went from struggling with manual assessments to generating $47K monthly recurring revenue. The AI does the heavy lifting while we focus on client relationships."
              </p>
              <div className="text-purple-400 font-semibold">340+ clients • $47K MRR • 8 months</div>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center font-bold text-white">MR</div>
                <div>
                  <div className="font-bold">Mike Rodriguez</div>
                  <div className="text-white/70 text-sm">Founder, Guardian Solutions</div>
                </div>
              </div>
              <p className="text-white/80 leading-relaxed mb-4">
                "Design-Rite's platform gave us enterprise-level capabilities without the development costs. Our clients love the professional assessments and we love the predictable revenue stream."
              </p>
              <div className="text-purple-400 font-semibold">180+ clients • $23K MRR • 4 months</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-8 py-20">
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-2xl p-12 text-center border border-purple-500/30">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-3xl font-bold mb-6">Ready to Launch Your AI Platform?</h2>
            <p className="text-xl text-white/80 mb-8">
              Join successful partners who've transformed their businesses with our white-label AI platform. Launch in weeks, scale in months, succeed for years.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/contact')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Start Partnership Process
              </button>
              <Link 
                href="/watch-demo"
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                See Platform Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black/20 mt-20">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 text-white font-bold text-2xl mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-black text-sm">
                  DR
                </div>
                Design-Rite
              </Link>
              <p className="text-white/70 text-lg leading-relaxed max-w-md">
                Revolutionary AI-powered platform transforming security system design through intelligent automation and expert-level analysis.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Partnership</h4>
              <ul className="space-y-3">
                <li><Link href="/white-label" className="text-purple-400 hover:text-purple-300 transition-colors">White-Label Solutions</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors">Become a Partner</Link></li>
                <li><Link href="/affiliates" className="text-white/70 hover:text-white transition-colors">Affiliate Program</Link></li>
                <li><Link href="/referrals" className="text-white/70 hover:text-white transition-colors">Referral Rewards</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-white/70 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="text-white/70 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-white/70 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/60">
              © 2025 Design-Rite™. All rights reserved. | Revolutionary AI-Powered Security Solutions
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}