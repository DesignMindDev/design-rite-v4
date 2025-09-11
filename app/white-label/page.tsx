"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function WhiteLabelProgramPage() {
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

        {/* Key Benefits */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose White-Label?</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-4">Faster Time to Market</h3>
              <p className="text-white/80">Launch your AI-powered security platform in weeks, not years. Skip development costs and focus on customers.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-xl font-bold mb-4">Complete Brand Control</h3>
              <p className="text-white/80">Your customers see only your brand, never ours. Full customization of logos, colors, domain, and messaging.</p>
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
            
            <div className="bg-gray-800/80 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-transparent rounded-2xl"></div>
              <h3 className="text-xl font-bold mb-6 relative z-10">Example: "SecureAI Pro" Platform</h3>
              <div className="relative z-10 space-y-4">
                <div className="bg-white/10 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-xs font-bold">SA</div>
                    <span className="font-semibold">SecureAI Pro</span>
                  </div>
                  <div className="text-sm text-white/70">Custom branding example</div>
                </div>
                <div className="text-sm text-white/80">
                  ✅ Custom domain: secureai-pro.com<br/>
                  ✅ Blue/white color scheme<br/>
                  ✅ Partner's contact information<br/>
                  ✅ Custom pricing tiers
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Revenue Model */}
        <section className="max-w-4xl mx-auto mb-20 text-center">
          <h2 className="text-4xl font-bold mb-8">Revenue Sharing Model</h2>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-black text-purple-300 mb-2">70%</div>
                <div className="text-lg font-semibold mb-2">Partner Revenue</div>
                <div className="text-white/70 text-sm">You keep 70% of all subscription revenue from your customers</div>
              </div>
              <div>
                <div className="text-3xl font-black text-purple-300 mb-2">30%</div>
                <div className="text-lg font-semibold mb-2">Platform Fee</div>
                <div className="text-white/70 text-sm">We handle infrastructure, AI models, and platform updates</div>
              </div>
              <div>
                <div className="text-3xl font-black text-purple-300 mb-2">100%</div>
                <div className="text-lg font-semibold mb-2">Your Brand</div>
                <div className="text-white/70 text-sm">Complete white-label solution with zero Design-Rite branding</div>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="max-w-4xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">Partnership Requirements</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4">Minimum Requirements</h3>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Established security business (2+ years)
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Minimum 50 potential customers
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Dedicated sales and support team
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Marketing budget for platform promotion
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-4">What We Provide</h3>
              <ul className="space-y-2 text-white/80">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Complete platform customization
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Training and onboarding support
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Marketing materials and resources
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  Ongoing technical support
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 backdrop-blur-sm rounded-3xl p-12 border border-purple-600/30">
            <h2 className="text-4xl font-bold mb-6">Ready to Partner with Us?</h2>
            <p className="text-xl text-white/80 mb-8">
              Join our growing network of white-label partners and start offering AI-powered security design solutions under your brand.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:partnerships@design-rite.com?subject=White-Label%20Partnership%20Inquiry"
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-purple-600/40 transition-all"
              >
                Contact Partnerships Team
              </a>
              <Link 
                href="/contact"
                className="bg-white/10 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 hover:border-white/50 transition-all"
              >
                Schedule a Demo
              </Link>
            </div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section className="max-w-6xl mx-auto mt-20 mb-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-white/90">
            Try these quick options to get started with Design-Rite
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link 
              href="/app"
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 hover:-translate-y-1 transition-all"
            >
              <div className="text-2xl mb-3">🆓</div>
              <div className="font-semibold text-white">Start Free Trial</div>
            </Link>
            <a 
              href="mailto:info@design-rite.com?subject=Pricing%20Information"
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 hover:-translate-y-1 transition-all"
            >
              <div className="text-2xl mb-3">💰</div>
              <div className="font-semibold text-white">Get Pricing</div>
            </a>
            <a 
              href="mailto:partnerships@design-rite.com?subject=White-Label%20Partnership"
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 hover:-translate-y-1 transition-all"
            >
              <div className="text-2xl mb-3">🏷️</div>
              <div className="font-semibold text-white">Partner Program</div>
            </a>
            <a 
              href="mailto:info@design-rite.com?subject=Technical%20Support"
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 hover:-translate-y-1 transition-all"
            >
              <div className="text-2xl mb-3">🛠️</div>
              <div className="font-semibold text-white">Technical Support</div>
            </a>
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
            <Link href="/app" className="text-white/70 hover:text-purple-600 text-sm transition-colors">Try Platform</Link>
          </div>
          <p className="text-sm text-white/60 mt-4">
            🔒 Your privacy is important to us. We'll never share your information.
          </p>
        </div>
      </footer>
    </div>
  )
}