'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function CareersPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const redirectToApp = () => {
    window.location.href = '/login-trial.html'
  }

  const scheduleDemo = () => {
    window.location.href = '/demo.html'
  }

  const applyForPosition = (position: string) => {
    const subject = encodeURIComponent(`Application for ${position} Position`)
    const body = encodeURIComponent(`Hi Design-Rite Team,

I'm interested in applying for the ${position} position at Design-Rite.

Please find my resume attached and let me know the next steps in the application process.

Looking forward to hearing from you!

Best regards,
[Your Name]`)
    
    window.location.href = `mailto:careers@design-rite.com?subject=${subject}&body=${body}`
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
                <Link href="/professional-proposals" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
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
                <Link href="/about" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
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
                <Link href="/careers" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2 bg-purple-600/10 text-white">
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
                <Link href="/careers" className="block text-purple-600 font-medium py-2">
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
            Join Our Team
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Build the Future of Security Design
          </h1>
          <p className="text-xl text-gray-400 mb-16 leading-relaxed max-w-4xl mx-auto">
            Join a revolutionary team that's transforming the security industry with AI. We're looking for passionate 
            engineers, designers, and industry experts to help shape the future of security design.
          </p>
        </div>
      </section>

      {/* Company Culture Section */}
      <section className="py-16 bg-black/50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
              Why Work at Design-Rite?
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Be part of a team that's revolutionizing an entire industry with cutting-edge AI technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-white mb-4">Cutting-Edge Technology</h3>
              <p className="text-gray-400 leading-relaxed">
                Work with the latest AI/ML technologies, building systems that transform how security professionals work.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-white mb-4">Growth Opportunities</h3>
              <p className="text-gray-400 leading-relaxed">
                Join a rapidly growing startup where your impact is visible and your career growth is accelerated.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">🏠</div>
              <h3 className="text-xl font-bold text-white mb-4">Remote-First Culture</h3>
              <p className="text-gray-400 leading-relaxed">
                Work from anywhere while collaborating with a distributed team of talented professionals.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-4">Meaningful Impact</h3>
              <p className="text-gray-400 leading-relaxed">
                Your work directly helps security professionals deliver better solutions and protect more people.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-white mb-4">Competitive Benefits</h3>
              <p className="text-gray-400 leading-relaxed">
                Equity participation, comprehensive health benefits, and generous PTO in a fast-growing company.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-white mb-4">Collaborative Team</h3>
              <p className="text-gray-400 leading-relaxed">
                Work with industry experts, AI researchers, and passionate builders who share your vision for innovation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
              Open Positions
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              We're actively hiring for these key positions. Don't see a perfect fit? We'd still love to hear from you!
            </p>
          </div>

          <div className="space-y-6">
            {/* Senior AI/ML Engineer */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:border-purple-600/50 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Senior AI/ML Engineer</h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="bg-purple-600/20 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">Full-Time</span>
                    <span className="bg-green-600/20 text-green-600 px-3 py-1 rounded-full text-sm font-medium">Remote</span>
                    <span className="bg-blue-600/20 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">$120k - $180k</span>
                  </div>
                </div>
                <div className="text-3xl">🧠</div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Lead the development of our core AI models that power security system design recommendations. 
                Work with large language models, computer vision, and specialized domain knowledge to create 
                intelligent assessment capabilities.
              </p>
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Key Requirements:</h4>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• 5+ years experience with Python, TensorFlow/PyTorch</li>
                  <li>• Experience with LLMs, RAG systems, and vector databases</li>
                  <li>• Strong background in machine learning and deep learning</li>
                  <li>• Experience with cloud platforms (AWS/GCP preferred)</li>
                </ul>
              </div>
              <button 
                onClick={() => applyForPosition('Senior AI/ML Engineer')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all"
              >
                Apply Now
              </button>
            </div>

            {/* Full-Stack Developer */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:border-purple-600/50 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Full-Stack Developer</h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="bg-purple-600/20 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">Full-Time</span>
                    <span className="bg-green-600/20 text-green-600 px-3 py-1 rounded-full text-sm font-medium">Remote</span>
                    <span className="bg-blue-600/20 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">$90k - $140k</span>
                  </div>
                </div>
                <div className="text-3xl">💻</div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Build and maintain our web platform that delivers AI-powered security assessments to thousands of users. 
                Create intuitive interfaces for complex AI-generated content and robust APIs for integration partners.
              </p>
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Key Requirements:</h4>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• 4+ years experience with React, Next.js, TypeScript</li>
                  <li>• Strong backend skills with Node.js, Python, or similar</li>
                  <li>• Experience with databases (PostgreSQL, MongoDB)</li>
                  <li>• API design and integration experience</li>
                </ul>
              </div>
              <button 
                onClick={() => applyForPosition('Full-Stack Developer')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all"
              >
                Apply Now
              </button>
            </div>

            {/* Security Industry Expert */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:border-purple-600/50 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Security Industry Expert</h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="bg-purple-600/20 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">Full-Time</span>
                    <span className="bg-green-600/20 text-green-600 px-3 py-1 rounded-full text-sm font-medium">Remote</span>
                    <span className="bg-blue-600/20 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">$80k - $120k</span>
                  </div>
                </div>
                <div className="text-3xl">🔒</div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Shape our AI training data and validation processes with deep industry knowledge. Work closely 
                with engineering to ensure our AI recommendations meet real-world security requirements and 
                compliance standards.
              </p>
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Key Requirements:</h4>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• 7+ years in security system design or integration</li>
                  <li>• Deep knowledge of CJIS, FERPA, HIPAA compliance</li>
                  <li>• Experience with major security vendors (Axis, Milestone, etc.)</li>
                  <li>• Strong technical writing and documentation skills</li>
                </ul>
              </div>
              <button 
                onClick={() => applyForPosition('Security Industry Expert')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all"
              >
                Apply Now
              </button>
            </div>

            {/* Sales & Customer Success */}
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:border-purple-600/50 transition-all">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">Sales & Customer Success Manager</h3>
                  <div className="flex flex-wrap gap-3 mb-4">
                    <span className="bg-purple-600/20 text-purple-600 px-3 py-1 rounded-full text-sm font-medium">Full-Time</span>
                    <span className="bg-green-600/20 text-green-600 px-3 py-1 rounded-full text-sm font-medium">Remote</span>
                    <span className="bg-blue-600/20 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">$70k - $110k + Commission</span>
                  </div>
                </div>
                <div className="text-3xl">📈</div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Drive growth by building relationships with security integrators, consultants, and enterprise customers. 
                Help customers maximize value from our AI platform while gathering feedback to improve our product.
              </p>
              <div className="mb-6">
                <h4 className="text-white font-semibold mb-3">Key Requirements:</h4>
                <ul className="text-gray-400 space-y-1 text-sm">
                  <li>• 3+ years in B2B sales or customer success</li>
                  <li>• Experience in security industry preferred</li>
                  <li>• Strong communication and relationship-building skills</li>
                  <li>• SaaS platform experience a plus</li>
                </ul>
              </div>
              <button 
                onClick={() => applyForPosition('Sales & Customer Success Manager')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600/10 to-purple-700/10">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Ready to Join Us?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Don't see a position that matches your skills? We're always looking for exceptional talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => applyForPosition('General Application')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all"
            >
              Send General Application
            </button>
            <Link href="/contact" className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all">
              Contact HR Team
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
                <li><Link href="/about" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="text-purple-600 font-medium text-sm">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Contact</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-600/30 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <div>© 2025 Design-Rite. All rights reserved.</div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="mailto:careers@design-rite.com" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">📧</a>
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