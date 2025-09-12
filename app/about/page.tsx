'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const redirectToApp = () => {
    window.location.href = '/login-trial.html'
  }

  const scheduleDemo = () => {
    window.location.href = '/demo.html'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 text-center text-sm font-semibold relative z-[1001]">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-4">
          <span className="text-base">🎓</span>
          <span className="flex-1 text-center">Design-Rite's Revolutionary AI is launching Q4 2025 - Join the waitlist for early access to security design mastery</span>
          <Link className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-white/30 transition-all border border-white/30" href="/subscribe">
            Join Waitlist
          </Link>
          <button className="text-white text-lg opacity-70 hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center">×</button>
        </div>
      </div>

      {/* Top Contact Bar */}
      <div className="bg-black/90 border-b border-purple-600/10 py-2 text-xs">
        <div className="max-w-6xl mx-auto px-8 flex justify-end items-center gap-8">
          <Link href="/login" className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2">
            <span>👤</span> Login
          </Link>
          <Link href="/pricing" className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2">
            <span>💰</span> Plans & Pricing
          </Link>
          <Link href="/help" className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2">
            <span>❓</span> Help Center
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2">
            <span>📧</span> Contact Us
          </Link>
        </div>
      </div>

      {/* Main Navigation Header with Dropdowns */}
      <header className="sticky top-0 left-0 right-0 z-[1000] bg-black/95 backdrop-blur-xl border-b border-purple-600/20 py-4">
        <nav className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-black text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg">
              DR
            </div>
            Design-Rite
          </Link>

          {/* Desktop Navigation with Dropdowns */}
          <ul className="hidden lg:flex items-center gap-10">
            {/* Platform Dropdown */}
            <li className="relative group">
              <Link href="#platform" className="text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full">
                Platform
              </Link>
              <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">
                <button onClick={redirectToApp} className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2 w-full text-left">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🔍</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">AI Assessment</div>
                    <div className="text-xs text-gray-400">Intelligent security analysis</div>
                  </div>
                </button>
                <Link href="/proposal" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">📋</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Proposal Generator</div>
                    <div className="text-xs text-gray-400">Professional BOMs & pricing</div>
                  </div>
                </Link>
                <Link href="/white-label" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🏢</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">White-Label Solutions</div>
                    <div className="text-xs text-gray-400">Branded platforms for partners</div>
                  </div>
                </Link>
                <Link href="/api" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">⚡</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">API Access</div>
                    <div className="text-xs text-gray-400">Integrate with your systems</div>
                  </div>
                </Link>
              </div>
            </li>

            {/* Solutions Dropdown */}
            <li className="relative group">
              <Link href="#solutions" className="text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full">
                Solutions
              </Link>
              <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">
                <Link href="/integrators" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🔧</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Security Integrators</div>
                    <div className="text-xs text-gray-400">Design & proposal automation</div>
                  </div>
                </Link>
                <Link href="/enterprise" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🏢</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Enterprise Security</div>
                    <div className="text-xs text-gray-400">In-house team solutions</div>
                  </div>
                </Link>
                <Link href="/education" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🎓</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Education & Healthcare</div>
                    <div className="text-xs text-gray-400">Specialized compliance tools</div>
                  </div>
                </Link>
                <Link href="/consultants" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">💼</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Security Consultants</div>
                    <div className="text-xs text-gray-400">Expert-level assessments</div>
                  </div>
                </Link>
              </div>
            </li>

            {/* Company Dropdown */}
            <li className="relative group">
              <Link href="#company" className="text-purple-600 font-medium transition-all relative py-2 block text-sm after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700">
                Company
              </Link>
              <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">
                <Link href="/about" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2 bg-purple-600/10 text-white">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🏢</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">About Us</div>
                    <div className="text-xs text-gray-400">Our mission and vision</div>
                  </div>
                </Link>
                <Link href="/team" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">👥</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Team</div>
                    <div className="text-xs text-gray-400">Meet the founders</div>
                  </div>
                </Link>
                <Link href="/careers" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">💼</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Careers</div>
                    <div className="text-xs text-gray-400">Join our growing team</div>
                  </div>
                </Link>
                <Link href="/academy" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">🎓</div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Design-Rite Academy</div>
                    <div className="text-xs text-gray-400">Security design education</div>
                  </div>
                </Link>
              </div>
            </li>
          </ul>

          {/* Right Side Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <Link className="bg-purple-600/20 text-purple-600 border border-purple-600/30 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-600/30 hover:border-purple-600 transition-all" href="/subscribe">
              Subscribe
            </Link>
            <div className="flex items-center gap-4">
              <button onClick={scheduleDemo} className="bg-purple-600/10 text-purple-600 border border-purple-600/30 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-purple-600/20 hover:border-purple-600 transition-all">
                Watch Demo
              </button>
              <button onClick={redirectToApp} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-purple-600/30 transition-all">
                Join Waitlist
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white text-2xl p-2 hover:bg-white/10 rounded transition-colors" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            ☰
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/95 backdrop-blur-xl border-t border-purple-600/30 py-4">
            <div className="max-w-6xl mx-auto px-8">
              <div className="space-y-4">
                <button onClick={redirectToApp} className="block w-full text-left text-white hover:text-purple-600 py-2">
                  Platform
                </button>
                <Link href="/integrators" className="block text-white hover:text-purple-600 py-2">
                  Solutions
                </Link>
                <Link href="/about" className="block text-purple-600 font-medium py-2">
                  Company
                </Link>
                <div className="pt-4 border-t border-purple-600/30 space-y-2">
                  <Link href="/subscribe" className="block bg-purple-600/20 text-purple-600 px-4 py-2 rounded-lg font-medium text-center">
                    Subscribe
                  </Link>
                  <button onClick={scheduleDemo} className="block w-full bg-purple-600/10 text-purple-600 border border-purple-600/30 px-4 py-2 rounded-lg font-medium">
                    Watch Demo
                  </button>
                  <button onClick={redirectToApp} className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-2 rounded-lg font-medium">
                    Join Waitlist
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent"></div>
        <div className="max-w-6xl mx-auto px-8 text-center relative z-10">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            About Design-Rite
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Revolutionizing Security Design
          </h1>
          <p className="text-xl text-gray-400 mb-16 leading-relaxed max-w-4xl mx-auto">
            We're transforming security system design with AI-powered intelligence, making professional-grade 
            assessments accessible to everyone in the industry.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-black/50">
        <div className="max-w-4xl mx-auto px-8">
          <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-12">
            <h2 className="text-4xl font-black mb-8 flex items-center gap-4 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
              <span className="text-3xl">🎯</span> Our Mission
            </h2>
            <div className="text-lg text-gray-300 leading-relaxed space-y-6">
              <p>
                Design-Rite exists to democratize professional security design expertise through artificial intelligence. 
                We believe that every building deserves a well-designed security system, but the traditional process 
                is too slow, expensive, and dependent on scarce expertise.
              </p>
              <p>
                Our AI platform empowers security integrators, consultants, and designers to deliver professional-grade 
                assessments and proposals in minutes instead of days. We bridge the expertise gap, making professional 
                security design accessible to everyone.
              </p>
              <p>
                By combining cutting-edge AI with deep industry knowledge, we're not just improving existing processes—we're 
                creating an entirely new way to approach security design that's faster, more accurate, and more accessible 
                than ever before.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Industry veterans and AI experts working together to revolutionize security design.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Founder */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">
                DK
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dan Koziol</h3>
              <p className="text-purple-600 font-semibold mb-4">Founder & CEO</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Visionary leader with 15+ years in security technology and AI development. 
                Leading the revolution in automated security design.
              </p>
            </div>

            {/* CTO */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">
                💻
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Engineering Team</h3>
              <p className="text-purple-600 font-semibold mb-4">Technical Leadership</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                World-class AI engineers and security experts building the most advanced 
                platform in the industry.
              </p>
            </div>

            {/* AI Team */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">
                🧠
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Research Team</h3>
              <p className="text-purple-600 font-semibold mb-4">Core Intelligence</p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Advanced AI models trained on thousands of security designs, compliance standards, 
                and industry best practices.
              </p>
            </div>

            {/* Join Us */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">
                +
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Join Our Team</h3>
              <p className="text-purple-600 font-semibold mb-4">We're Hiring</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Help us build the future of security design. We're looking for passionate 
                engineers and industry experts.
              </p>
              <Link 
                href="/careers"
                className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all text-sm"
              >
                View Careers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-black/50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
              Our Values
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              These principles guide everything we do, from product development to customer relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-4">Speed & Efficiency</h3>
              <p className="text-gray-400 leading-relaxed">
                Transform weeks of work into minutes. We obsess over making security design faster without 
                sacrificing quality or accuracy.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-4">Precision & Accuracy</h3>
              <p className="text-gray-400 leading-relaxed">
                Our AI delivers professional-grade results with 95%+ accuracy, backed by industry expertise 
                and compliance knowledge.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="text-xl font-bold text-white mb-4">Accessibility</h3>
              <p className="text-gray-400 leading-relaxed">
                Making professional security design expertise accessible to integrators and consultants 
                of all sizes.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-white mb-4">Security First</h3>
              <p className="text-gray-400 leading-relaxed">
                Every recommendation prioritizes security effectiveness, compliance requirements, 
                and industry best practices.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-white mb-4">Innovation</h3>
              <p className="text-gray-400 leading-relaxed">
                Constantly pushing the boundaries of what's possible with AI and machine learning 
                in security design.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-white mb-4">Partnership</h3>
              <p className="text-gray-400 leading-relaxed">
                Building lasting relationships with integrators, consultants, and security professionals 
                who trust our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-12">
            <h2 className="text-4xl font-black mb-8 flex items-center gap-4 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
              <span className="text-3xl">🧠</span> Our Technology
            </h2>
            <div className="text-lg text-gray-300 leading-relaxed space-y-6">
              <p>
                At the heart of Design-Rite is a sophisticated AI engine trained on thousands of real-world security 
                installations, compliance requirements, and industry standards. Our machine learning models understand 
                the nuanced relationships between facility types, threat vectors, and optimal security solutions.
              </p>
              <p>
                Our platform combines multiple AI technologies to analyze facility layouts, assess security 
                risks, recommend optimal device placement, and generate comprehensive documentation that 
                meets industry standards including CJIS, FERPA, and HIPAA compliance.
              </p>
              <p>
                The system continuously learns and improves, ensuring recommendations stay current with evolving 
                threats, new technologies, and changing compliance requirements. This creates a platform that gets 
                smarter with every assessment generated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600/10 to-purple-700/10">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Ready to Join the Revolution?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Experience the future of security design today. Join our waitlist for early access to the most 
            advanced AI-powered security design platform launching Q4 2025.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={redirectToApp} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all">
              Join Waitlist - Free Early Access
            </button>
            <Link href="/contact" className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-purple-600/20 py-12">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
            <div>
              <div className="flex items-center gap-3 text-white font-black text-2xl mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg">
                  DR
                </div>
                Design-Rite
              </div>
              <p className="text-gray-400 leading-relaxed mb-6">
                Transforming security system design with AI-powered intelligence. Professional assessments, automated 
                proposals, and comprehensive documentation for the modern security industry.
              </p>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><button onClick={redirectToApp} className="text-gray-400 hover:text-purple-600 text-sm transition-colors">AI Assessment</button></li>
                <li><Link href="/professional-proposals" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Proposal Generator</Link></li>
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
                <li><Link href="/healthcare" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Healthcare</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-purple-600 font-medium text-sm">About Us</Link></li>
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
              <Link href="/linkedin" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">💼</Link>
              <Link href="/twitter" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">🐦</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Chat Button */}
      <div className="fixed bottom-5 right-5 z-[999999]">
        <button className="w-15 h-15 bg-purple-600 rounded-full cursor-pointer flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all">
          <div className="text-white text-2xl font-bold">💬</div>
        </button>
      </div>
    </div>
  )
}