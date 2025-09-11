"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function WhiteLabelPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800 text-white">
      {/* Header */}
      <header className="bg-black/10 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50 py-5">
        <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-bold text-2xl">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-purple-600 font-black text-sm">
              DR
            </div>
            Design-Rite
          </Link>

          <ul className="hidden lg:flex items-center gap-8">
            <li><Link href="/platform" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Platform</Link></li>
            <li><Link href="/solutions" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Solutions</Link></li>
            <li><Link href="/partners" className="text-white bg-white/10 px-4 py-2 rounded-lg font-medium">Partners</Link></li>
            <li><Link href="/about" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">About</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Contact</Link></li>
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="text-white border-2 border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Sign In
            </Link>
            <Link href="/app" className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all">
              Try Platform
            </Link>
          </div>

          <button className="lg:hidden text-white text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto">
          <div className="text-purple-300 text-base font-semibold uppercase tracking-wider mb-4">
            White-Label Partnership Program
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
            Your Brand, Our AI
          </h1>
          <p className="text-xl text-white/80 leading-relaxed">
            Transform our cutting-edge AI security platform into your own branded solution. 
            Complete customization, revenue sharing, and dedicated support to grow your business.
          </p>
        </section>

        {/* Value Proposition */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-4">Revenue Opportunity</h3>
              <p className="text-white/80">Generate recurring revenue with subscription-based AI services under your brand. No development costs, instant market entry.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-4">Complete Customization</h3>
              <p className="text-white/80">Full branding control including logo, colors, domain, and messaging. Your customers see only your brand, never ours.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-4">Instant Launch</h3>
              <p className="text-white/80">Go to market in weeks, not years. Skip the AI development and focus on what you do best - serving customers.</p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16">How White-Label Works</h2>
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold mb-4">Partner Agreement</h3>
              <p className="text-white/80">Sign partnership agreement and define revenue sharing structure, territory, and customization requirements.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold mb-4">Brand Customization</h3>
              <p className="text-white/80">Our team implements your complete branding including logo, colors, domain, and custom messaging throughout the platform.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold mb-4">Training & Launch</h3>
              <p className="text-white/80">Comprehensive training for your team on platform features, sales process, and customer support procedures.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">4</div>
              <h3 className="text-xl font-bold mb-4">Ongoing Support</h3>
              <p className="text-white/80">Dedicated partner success manager, marketing resources, and technical support to ensure your success.</p>
            </div>
          </div>
        </section>

        {/* Customization Examples */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16">Complete Brand Control</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Visual Branding</h3>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Custom logo and brand colors throughout
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Personalized domain (yourcompany.com)
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Custom email templates and notifications
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Branded PDF reports and proposals
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4">Content Customization</h3>
                <ul className="space-y-3 text-white/80">
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Company-specific messaging and positioning
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Your team members and contact information
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Custom pricing and service packages
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Industry-specific case studies and examples
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-800/80 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-6">White-Label Platform Example</h3>
              <div className="space-y-4">
                <div className="bg-blue-600/20 p-4 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-xs font-bold">YC</div>
                    <span className="font-semibold text-blue-300">YourCompany Security AI</span>
                  </div>
                  <div className="text-white/80 text-sm">Powered by your brand, trusted by your customers</div>
                </div>
                
                <div className="bg-green-600/20 p-3 rounded-lg">
                  <div className="text-green-300 font-semibold text-sm">Custom Domain</div>
                  <div className="text-white/80 text-xs">security.yourcompany.com</div>
                </div>
                
                <div className="bg-yellow-600/20 p-3 rounded-lg">
                  <div className="text-yellow-300 font-semibold text-sm">Your Pricing</div>
                  <div className="text-white/80 text-xs">Set your own markup and packages</div>
                </div>
                
                <div className="bg-purple-600/20 p-3 rounded-lg">
                  <div className="text-purple-300 font-semibold text-sm">Your Support</div>
                  <div className="text-white/80 text-xs">Customer sees only your contact info</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/*