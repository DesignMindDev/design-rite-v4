"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function SecurityConsultantsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 text-center text-sm font-semibold relative z-[1001]">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-4">
          <span className="text-base">🎓</span>
          <span className="flex-1 text-center">Design-Rite's Revolutionary AI is launching Q4 2025 - Join the waitlist for early access to security design mastery</span>
          <Link className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-white/30 transition-all border border-white/30" href="/subscribe">Join Waitlist</Link>
          <button className="text-white text-lg opacity-70 hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center">×</button>
        </div>
      </div>

      {/* Secondary Header */}
      <div className="bg-black/90 border-b border-purple-600/10 py-2 text-xs">
        <div className="max-w-6xl mx-auto px-8 flex justify-end items-center gap-8">
          <Link className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2" href="/login">
            <span>👤</span> Login
          </Link>
          <Link className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2" href="/pricing">
            <span>💰</span> Plans & Pricing
          </Link>
          <Link className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2" href="/help">
            <span>❓</span> Help Center
          </Link>
          <Link className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2" href="/contact">
            <span>📧</span> Contact Us
          </Link>
        </div>
      </div>

      {/* Main Header with Dropdowns */}
      <header className="sticky top-0 left-0 right-0 z-[1000] bg-black/95 backdrop-blur-xl border-b border-purple-600/20 py-4">
        <nav className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <Link className="flex items-center gap-3 text-white font-black text-2xl" href="/">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg">DR</div>
            Design-Rite
          </Link>

          {/* Desktop Navigation with Dropdowns */}
          <ul className="hidden lg:flex items-center gap-10">
            {/* Platform Dropdown */}
            <li className="relative group">
              <a className="text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full" href="#platform">Platform</a>
              <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">
                <Link className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2" href="/app">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 transition-all group-hover:bg-purple-600/30 group-hover:scale-110">🔍</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">AI Assessment</div>
                    <div className="text-xs text-gray-400 leading-tight">Intelligent security analysis</div>
                  </div>
                </Link>
                <Link className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2" href="/proposal">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 transition-all group-hover:bg-purple-600/30 group-hover:scale-110">📋</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Proposal Generator</div>
                    <div className="text-xs text-gray-400 leading-tight">Professional BOMs & pricing</div>
                  </div>
                </Link>
                <Link className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2" href="/white-label">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 transition-all group-hover:bg-purple-600/30 group-hover:scale-110">🏢</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">White-Label Solutions</div>
                    <div className="text-xs text-gray-400 leading-tight">Branded platforms for partners</div>
                  </div>
                </Link>
                <Link className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1" href="/api">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 transition-all group-hover:bg-purple-600/30 group-hover:scale-110">⚡</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">API Access</div>
                    <div className="text-xs text-gray-400 leading-tight">Integrate with your systems</div>
                  </div>
                </Link>
              </div>
            </li>

            {/* Solutions Dropdown */}
            <li className="relative group">
              <a className="text-purple-600 font-medium transition-all relative py-2 block text-sm after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700" href="#solutions">Solutions</a>
              <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">
                <Link className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2" href="/integrators">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🔧</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Security Integrators</div>
                    <div className="text-xs text-gray-400 leading-tight">Design & proposal automation</div>
                  </div>
                </Link>
                <Link className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2" href="/enterprise">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🏢</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Enterprise Security</div>
                    <div className="text-xs text-gray-400 leading-tight">In-house team solutions</div>
                  </div>
                </Link>
                <Link className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2" href="/education">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🎓</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Education & Healthcare</div>
                    <div className="text-xs text-gray-400 leading-tight">Specialized compliance tools</div>
                  </div>
                </Link>
                <Link className="flex items-center gap-4 p-3 rounded-lg text-purple-600 bg-purple-600/10 transition-all hover:translate-x-1" href="/consultants">
                  <div className="w-10 h-10 bg-purple-600/30 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">💼</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Security Consultants</div>
                    <div className="text-xs text-gray-400 leading-tight">Expert-level assessments</div>
                  </div>
                </Link>
              </div>
            </li>

            {/* Partners Dropdown */}
            <li className="relative group">
              <a className="text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full" href="#partners">Partners</a>
              <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">
                <Link className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2" href="/white-label-program">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🏷️</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">White-Label Program</div>
                    <div className="text-xs text-gray-400 leading-tight">Brand our platform as your own</div>
                  </div>
                </Link>
                <Link className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2" href="/integration">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🔗</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Technology Partners</div>
                    <div className="text-xs text-gray-400 leading-tight">Integration ecosystem</div>
                  </div>
                </Link>
                <Link className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1" href="/referral">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">💰</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Referral Program</div>
                    <div className="text-xs text-gray-400 leading-tight">Earn commission for referrals</div>
                  </div>
                </Link>
              </div>
            </li>

            {/* About Dropdown */}
            <li className="relative group">
              <a className="text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full" href="#about">About</a>
              <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">
                <Link className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2" href="/about">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🏢</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Company</div>
                    <div className="text-xs text-gray-400 leading-tight">Our mission and vision</div>
                  </div>
                </Link>
                <Link className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2" href="/team">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">👥</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Team</div>
                    <div className="text-xs text-gray-400 leading-tight">Meet the founders</div>
                  </div>
                </Link>
                <Link className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2" href="/careers">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">💼</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Careers</div>
                    <div className="text-xs text-gray-400 leading-tight">Join our growing team</div>
                  </div>
                </Link>
                <Link className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1" href="/academy">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🎓</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Design-Rite Academy</div>
                    <div className="text-xs text-gray-400 leading-tight">Security design education</div>
                  </div>
                </Link>
              </div>
            </li>
          </ul>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link className="bg-purple-600/20 text-purple-600 border border-purple-600/30 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-600/30 hover:border-purple-600 transition-all" href="/subscribe">Subscribe</Link>
            <div className="flex items-center gap-4">
              <Link className="bg-purple-600/10 text-purple-600 border border-purple-600/30 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-purple-600/20 hover:border-purple-600 transition-all" href="/demo">Watch Demo</Link>
              <Link href="/app" className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-purple-600/30 transition-all">Try It Free</Link>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-white text-2xl p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/20 backdrop-blur-sm border-t border-white/10">
            <div className="px-8 py-4 space-y-4">
              <Link href="/platform" className="block text-white/80 hover:text-white py-2">Platform</Link>
              <Link href="/solutions" className="block text-purple-600 font-medium py-2">Solutions</Link>
              <Link href="/partners" className="block text-white/80 hover:text-white py-2">Partners</Link>
              <Link href="/about" className="block text-white/80 hover:text-white py-2">About</Link>
              <Link href="/contact" className="block text-white/80 hover:text-white py-2">Contact</Link>
              <div className="pt-4 space-y-3">
                <Link href="/subscribe" className="block bg-purple-600/20 text-purple-600 px-4 py-2 rounded-lg text-center">Subscribe</Link>
                <Link href="/app" className="block bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg text-center">Try Platform</Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto px-8 relative">
          <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent"></div>
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4 relative z-10">
            Security Consultants
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent relative z-10">
            Expert-Level Security Assessments
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-10 relative z-10">
            Advanced AI tools designed for security consultants who demand precision, depth, 
            and professional-grade analysis for complex security projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link href="/app" className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all">
              Start Expert Assessment
            </Link>
            <Link href="/contact" className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all">
              Discuss Custom Solution
            </Link>
          </div>
        </section>

        {/* Key Features */}
        <section className="max-w-6xl mx-auto px-8 mb-24">
          <h2 className="text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent text-center">
            Built for Security Experts
          </h2>
          <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto text-center">
            Advanced features and capabilities designed specifically for experienced security professionals and consultants.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="w-15 h-15 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mb-6">
                🧠
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Advanced Threat Modeling</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Sophisticated AI analysis that considers complex threat scenarios, attack vectors, and security vulnerabilities across multi-layered environments.
              </p>
              <Link className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors" href="/threat-modeling">
                Learn More →
              </Link>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="w-15 h-15 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mb-6">
                📊
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Risk Assessment Matrix</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Comprehensive risk scoring with customizable matrices, probability calculations, and impact assessments for informed decision-making.
              </p>
              <Link className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors" href="/risk-assessment">
                Learn More →
              </Link>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="w-15 h-15 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mb-6">
                🔍
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Vulnerability Analysis</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Deep-dive security gap analysis with remediation prioritization, compliance mapping, and detailed technical recommendations.
              </p>
              <Link className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors" href="/vulnerability-analysis">
                Learn More →
              </Link>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="w-15 h-15 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mb-6">
                📋
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Executive Reporting</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Professional executive summaries with ROI analysis, strategic recommendations, and board-ready presentation materials.
              </p>
              <Link className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors" href="/executive-reporting">
                Learn More →
              </Link>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="w-15 h-15 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mb-6">
                🛡️
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Compliance Frameworks</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Advanced compliance mapping for complex frameworks including SOC 2, ISO 27001, NIST, and industry-specific regulations.
              </p>
              <Link className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors" href="/compliance">
                Learn More →
              </Link>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="w-15 h-15 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mb-6">
                ⚡
              </div>
              <h3 className="text-xl font-bold text-white mb-4">Custom Integrations</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                API access and custom integrations with existing security tools, SIEM platforms, and enterprise management systems.
              </p>
              <Link className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors" href="/api">
                Learn More →
              </Link>
            </div>
          </div>
        </section>

        {/* Professional Workflow */}
        <section className="max-w-6xl mx-auto px-8 mb-24">
          <h2 className="text-4xl font-bold text-center mb-16">Professional Consulting Workflow</h2>
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">1</div>
              <h3 className="text-xl font-bold mb-4">Discovery & Planning</h3>
              <p className="text-gray-400">Comprehensive client requirements gathering with advanced questionnaires and site assessment protocols.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">2</div>
              <h3 className="text-xl font-bold mb-4">AI-Powered Analysis</h3>
              <p className="text-gray-400">Expert-level threat modeling and vulnerability assessment using advanced AI algorithms and security frameworks.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">3</div>
              <h3 className="text-xl font-bold mb-4">Strategic Design</h3>
              <p className="text-gray-400">Multi-layered security architecture with detailed technical specifications and implementation roadmaps.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex-center text-2xl font-black mx-auto mb-6">4</div>
              <h3 className="text-xl font-bold mb-4">Executive Delivery</h3>
              <p className="text-gray-400">Professional reports with executive summaries, ROI analysis, and strategic security recommendations.</p>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="max-w-6xl mx-auto px-8 mb-24">
          <h2 className="text-4xl font-bold text-center mb-16">Consultant Use Cases</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-purple-600/50 hover:bg-white/15 transition-all">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold mb-4">Enterprise Security Audits</h3>
              <p className="text-gray-400">Comprehensive security assessments for large organizations with complex infrastructure and compliance requirements.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-purple-600/50 hover:bg-white/15 transition-all">
              <div className="text-4xl mb-4">🏛️</div>
              <h3 className="text-xl font-bold mb-4">Government & Defense</h3>
              <p className="text-gray-400">High-security assessments for government facilities, defense contractors, and critical infrastructure projects.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-purple-600/50 hover:bg-white/15 transition-all">
              <div className="text-4xl mb-4">🏭</div>
              <h3 className="text-xl font-bold mb-4">Critical Infrastructure</h3>
              <p className="text-gray-400">Specialized security designs for utilities, transportation, and other critical infrastructure facilities.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-purple-600/50 hover:bg-white/15 transition-all">
              <div className="text-4xl mb-4">🏦</div>
              <h3 className="text-xl font-bold mb-4">Financial Services</h3>
              <p className="text-gray-400">High-security assessments for banks, data centers, and financial institutions with strict regulatory requirements.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-purple-600/50 hover:bg-white/15 transition-all">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-4">Risk Assessments</h3>
              <p className="text-gray-400">Detailed risk analysis and mitigation strategies for organizations facing specific security challenges.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-purple-600/50 hover:bg-white/15 transition-all">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold mb-4">Strategic Planning</h3>
              <p className="text-gray-400">Long-term security strategy development with budget planning and phased implementation roadmaps.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-8">
          <div className="bg-gradient-to-r from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-3xl p-12 border border-purple-600/30 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Enhance Your Practice?</h2>
            <p className="text-xl text-gray-400 mb-10">
              Join leading security consultants who are using AI to deliver more comprehensive, 
              accurate, and profitable consulting services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/app" className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-purple-600/40 transition-all">
                Start Expert Trial
              </Link>
              <Link href="/contact" className="bg-white/10 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 hover:border-white/50 transition-all">
                Schedule Consultation
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-purple-600/20 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
            <div>
              <div className="flex items-center gap-3 text-white font-black text-2xl mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg">DR</div>
                Design-Rite
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Transforming security system design with AI-powered intelligence. Professional assessments, 
                automated proposals, and comprehensive documentation for the modern security industry.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/app" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">AI Assessment</Link></li>
                <li><Link href="/proposals" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Proposal Generator</Link></li>
                <li><Link href="/white-label" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">White-Label</Link></li>
                <li><Link href="/api" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">API Access</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Solutions</h3>
              <ul className="space-y-2">
                <li><Link href="/integrators" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Security Integrators</Link></li>
                <li><Link href="/enterprise" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Enterprise</Link></li>
                <li><Link href="/education" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Education</Link></li>
                <li><Link href="/consultants" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Consultants</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Contact</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600/30 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <div>© 2025 Design-Rite. All rights reserved.</div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="mailto:hello@design-rite.com" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">📧</a>
              <Link className="text-gray-400 hover:text-purple-600 text-xl transition-colors" href="/linkedin">💼</Link>
              <Link className="text-gray-400 hover:text-purple-600 text-xl transition-colors" href="/twitter">🐦</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}