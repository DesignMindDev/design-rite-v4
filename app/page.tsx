'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<Array<{text: string, isBot: boolean}>>([])

  const redirectToApp = () => {
    window.location.href = '/waitlist'
  }

  const scheduleDemo = () => {
    window.location.href = '/contact'
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
    if (!isChatOpen && chatMessages.length === 0) {
      setChatMessages([{
        text: "Hi! I'm the Design-Rite AI Assistant. I can help you with:\n• Platform features\n• Pricing information\n• Free trial details\n• Security design questions\n\nHow can I help you today?",
        isBot: true
      }])
    }
  }

  const sendChatMessage = () => {
    if (!chatMessage.trim()) return
    
    // Add user message
    setChatMessages(prev => [...prev, { text: chatMessage, isBot: false }])
    
    // Simple bot response (you can enhance this later)
    setTimeout(() => {
      setChatMessages(prev => [...prev, { 
        text: "Thanks for your message! Our team will get back to you soon. Meanwhile, you can join our waitlist for early access.",
        isBot: true 
      }])
    }, 1000)
    
    setChatMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 text-center text-sm font-semibold relative z-[1001]">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-4">
          <span className="text-base">🎓</span>
          <span className="flex-1 text-center">Design-Rite's Revolutionary AI is launching Q4 2025 - Join the waitlist for early access</span>
          <Link className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-white/30 transition-all border border-white/30" href="/waitlist">
            Join Waitlist
          </Link>
          <button className="text-white text-lg opacity-70 hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center">
            ×
          </button>
        </div>
      </div>

      {/* Utility Bar */}
      <div className="bg-black/90 border-b border-purple-600/10 py-2 text-xs">
        <div className="max-w-6xl mx-auto px-8 flex justify-end items-center gap-8">
          <Link href="/login" className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2">
            <span>👤</span> Login
          </Link>
          <Link href="/pricing" className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2">
            <span>💰</span> Plans & Pricing
          </Link>
          <Link href="/support" className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2">
            <span>❓</span> Help Center
          </Link>
          <Link href="/contact" className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2">
            <span>📧</span> Contact Us
          </Link>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 left-0 right-0 z-[1000] bg-black/95 backdrop-blur-xl border-b border-purple-600/20 py-4">
        <nav className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-black text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg">
              DR
            </div>
            Design-Rite
          </Link>

{/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-10">
            <li>
              <Link href="/#platform" className="text-gray-300 hover:text-purple-600 font-medium transition-all text-sm">
                Platform
              </Link>
            </li>
            
            {/* Solutions Dropdown */}
            <li className="relative group">
              <span className="text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm cursor-pointer after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full">
                Solutions
              </span>
              <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[280px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">
                <Link href="/integrators" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🔧
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Security Integrators</div>
                    <div className="text-xs text-gray-400 leading-tight">Design & proposal automation</div>
                  </div>
                </Link>
                <Link href="/enterprise" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🏢
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Enterprise Security</div>
                    <div className="text-xs text-gray-400 leading-tight">In-house team solutions</div>
                  </div>
                </Link>
                <Link href="/education" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🎓
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Education & Healthcare</div>
                    <div className="text-xs text-gray-400 leading-tight">Specialized compliance tools</div>
                  </div>
                </Link>
                <Link href="/consultants" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    💼
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Security Consultants</div>
                    <div className="text-xs text-gray-400 leading-tight">Expert advisory services</div>
                  </div>
                </Link>
              </div>
            </li>

            {/* Company Dropdown */}
            <li className="relative group">
              <span className="text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm cursor-pointer after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full">
                Company
              </span>
              <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[240px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">
                <Link href="/about" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    ℹ️
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">About Us</div>
                    <div className="text-xs text-gray-400 leading-tight">Our mission & vision</div>
                  </div>
                </Link>
                <Link href="/team" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    👥
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Team</div>
                    <div className="text-xs text-gray-400 leading-tight">Meet our experts</div>
                  </div>
                </Link>
                <Link href="/careers" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    💼
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Careers</div>
                    <div className="text-xs text-gray-400 leading-tight">Join our team</div>
                  </div>
                </Link>
                <Link href="/academy" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🎓
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Design-Rite Academy</div>
                    <div className="text-xs text-gray-400 leading-tight">Training & certification</div>
                  </div>
                </Link>
                <Link href="/contact" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    📧
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Contact Us</div>
                    <div className="text-xs text-gray-400 leading-tight">Get in touch</div>
                  </div>
                </Link>
              </div>
            </li>

            <li>
              <Link href="/partners" className="text-gray-300 hover:text-purple-600 font-medium transition-all text-sm">
                Partners
              </Link>
            </li>
          </ul>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <button
              onClick={redirectToApp}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all"
            >
              Join Waitlist
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white text-2xl p-2" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </nav>

{/* Mobile Menu */}
{isMenuOpen && (
  <div className="lg:hidden bg-black/20 backdrop-blur-sm border-t border-white/10">
    <div className="px-6 py-4 space-y-4">
      <Link href="/#platform" className="block text-white/80 hover:text-white py-2">Platform</Link>
      
      <div className="border-t border-white/10 pt-2">
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Solutions</div>
        <Link href="/integrators" className="block text-white/80 hover:text-white py-2 pl-4">Security Integrators</Link>
        <Link href="/enterprise" className="block text-white/80 hover:text-white py-2 pl-4">Enterprise Security</Link>
        <Link href="/education" className="block text-white/80 hover:text-white py-2 pl-4">Education</Link>
        <Link href="/consultants" className="block text-white/80 hover:text-white py-2 pl-4">Consultants</Link>
      </div>
      
      <div className="border-t border-white/10 pt-2">
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Company</div>
        <Link href="/about" className="block text-white/80 hover:text-white py-2 pl-4">About Us</Link>
        <Link href="/team" className="block text-white/80 hover:text-white py-2 pl-4">Team</Link>
        <Link href="/careers" className="block text-white/80 hover:text-white py-2 pl-4">Careers</Link>
        <Link href="/academy" className="block text-white/80 hover:text-white py-2 pl-4">Design-Rite Academy</Link>
        <Link href="/contact" className="block text-white/80 hover:text-white py-2 pl-4">Contact Us</Link>
      </div>
      
      <Link href="/partners" className="block text-white/80 hover:text-white py-2">Partners</Link>
      
      <div className="pt-4 border-t border-white/10">
        <Link href="/login" className="block text-white/80 hover:text-white py-2">Sign In</Link>
        <button onClick={redirectToWaitlist} className="block w-full text-left bg-purple-600 text-white px-4 py-2 rounded-lg mt-2">
          Join Waitlist
        </button>
      </div>
    </div>
  </div>
)}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="max-w-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
              AI-Powered Security Design
            </div>
            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Design right, with AI insight
            </h1>
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Revolutionary AI platform that transforms security system design. Generate comprehensive assessments, 
              detailed proposals, and professional documentation in minutes, not days.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button onClick={redirectToApp} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl transition-all">
                Join Waitlist - Q4 2025
              </button>
              <button onClick={scheduleDemo} className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all">
                Watch Demo
              </button>
            </div>
            <div className="flex gap-12">
              <div>
                <span className="text-3xl font-black text-purple-600 block">10x</span>
                <span className="text-gray-400 text-sm font-medium">Faster Design</span>
              </div>
              <div>
                <span className="text-3xl font-black text-purple-600 block">95%</span>
                <span className="text-gray-400 text-sm font-medium">Accuracy Rate</span>
              </div>
              <div>
                <span className="text-3xl font-black text-purple-600 block">500+</span>
                <span className="text-gray-400 text-sm font-medium">Integrators</span>
              </div>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className="bg-gray-800/80 backdrop-blur-xl border border-purple-600/30 rounded-3xl p-8 relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Security Assessment Dashboard</h3>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                Coming Q4 2025
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-purple-600/10 p-4 rounded-xl border border-purple-600/20">
                <span className="text-2xl font-black text-purple-600 block">147</span>
                <span className="text-gray-400 text-xs">Devices Analyzed</span>
              </div>
              <div className="bg-purple-600/10 p-4 rounded-xl border border-purple-600/20">
                <span className="text-2xl font-black text-purple-600 block">$187K</span>
                <span className="text-gray-400 text-xs">Project Value</span>
              </div>
              <div className="bg-purple-600/10 p-4 rounded-xl border border-purple-600/20">
                <span className="text-2xl font-black text-purple-600 block">98.2%</span>
                <span className="text-gray-400 text-xs">Coverage Score</span>
              </div>
              <div className="bg-purple-600/10 p-4 rounded-xl border border-purple-600/20">
                <span className="text-2xl font-black text-purple-600 block">12</span>
                <span className="text-gray-400 text-xs">Zones Secured</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-24 bg-black/50">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
            Intelligent Security Design Platform
          </h2>
          <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto">
            Powered by advanced AI algorithms trained on thousands of security installations.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-left hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mb-6">🧠</div>
              <h3 className="text-xl font-bold text-white mb-4">AI-Powered Analysis</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Advanced AI analyzes facility requirements and generates comprehensive security assessments.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-left hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mb-6">📋</div>
              <h3 className="text-xl font-bold text-white mb-4">Professional Proposals</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Generate client-ready proposals with detailed BOMs and compliance documentation.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-left hover:-translate-y-1 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mb-6">🏢</div>
              <h3 className="text-xl font-bold text-white mb-4">White-Label Solutions</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Brand our platform as your own with complete customization options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600/10 to-purple-700/10">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Ready to Transform Your Design Process?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join hundreds of security integrators on our waitlist for early access.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={redirectToApp} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl transition-all">
              Join Waitlist - Free Early Access
            </button>
            <Link href="/contact" className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all inline-block text-center">
              Contact Sales
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
              <p className="text-gray-400 leading-relaxed">
                Transforming security system design with AI-powered intelligence.
              </p>
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
                <li><Link href="/contact" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Contact</Link></li>
                <li><Link href="/support" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Support</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Careers</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-white font-bold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><Link href="/pricing" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Pricing</Link></li>
                <li><Link href="/waitlist" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Join Waitlist</Link></li>
                <li><Link href="/api/leads" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Lead Dashboard</Link></li>
                <li><Link href="/api/leads/export" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Export Leads</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-600/30 pt-8 text-center text-gray-400 text-sm">
            <div>© 2025 Design-Rite. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* Simple Chat Widget */}
      <div className="fixed bottom-5 right-5 z-[999999]">
        <button
          onClick={toggleChat}
          className="w-16 h-16 bg-gradient-to-r from-purple-600 to-purple-700 rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center"
        >
          {isChatOpen ? (
            <span className="text-white text-2xl">✕</span>
          ) : (
            <span className="text-white text-2xl">💬</span>
          )}
        </button>
        
        {isChatOpen && (
          <div className="absolute bottom-20 right-0 w-[350px] h-[450px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 font-semibold">
              Design-Rite Assistant
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`mb-4 ${msg.isBot ? '' : 'text-right'}`}>
                  <div className={`inline-block max-w-[80%] p-3 rounded-xl ${
                    msg.isBot ? 'bg-white text-gray-800' : 'bg-purple-600 text-white'
                  }`}>
                    <div className="text-sm whitespace-pre-wrap">{msg.text}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                  placeholder="Type your message..."
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-600 text-gray-800"
                />
                <button
                  onClick={sendChatMessage}
                  className="bg-purple-600 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-purple-700"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}