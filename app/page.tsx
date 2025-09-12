"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function DesignRiteLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isAnnouncementVisible, setIsAnnouncementVisible] = useState(true)
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      content: '👋 Hi! I\'m here to help with Design-Rite\'s AI security platform!\n\nI can help you with:\n• Joining the Q4 2025 waitlist\n• Platform features & capabilities\n• Pricing & subscription plans\n• White-label opportunities\n• Getting started\n\nWhat would you like to know?',
      timestamp: new Date()
    }
  ])
  const [currentMessage, setCurrentMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('announcement_closed') === 'true') {
        setIsAnnouncementVisible(false)
      }
    }
    
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      console.log('%c🛡️ DESIGN-RITE PROPRIETARY SOFTWARE', 'color: #8B5CF6; font-size: 16px; font-weight: bold;')
      console.log('%c© 2025 Design-Rite. All rights reserved.', 'color: #666; font-size: 12px;')
    }
  }, [])

  const redirectToWaitlist = () => {
    window.location.href = '/subscribe'
  }

  const closeAnnouncement = () => {
    setIsAnnouncementVisible(false)
    if (typeof window !== 'undefined') {
      localStorage.setItem('announcement_closed', 'true')
    }
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  const generateBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase()
    
    if (msg.includes('waitlist') || msg.includes('join')) {
      return '🎯 Join Our Waitlist!\n\nYou can join our exclusive Q4 2025 launch waitlist right now.\n\n✅ Early Access Benefits:\n• First access to the platform\n• Up to 50% off first year\n• Priority support\n\n👆 Click "Join Waitlist" to get started!'
    }
    
    if (msg.includes('pricing') || msg.includes('cost')) {
      return '💰 Pricing Plans (Q4 2025):\n\n🆓 Starter: 3 assessments/month\n💼 Professional: $197/month\n🏢 Enterprise: Custom pricing\n\nWaitlist members get up to 50% off first year!'
    }
    
    if (msg.includes('feature') || msg.includes('platform')) {
      return '🧠 AI Platform Features:\n\n• AI Security Assessments\n• Smart Recommendations\n• Professional Proposals\n• Compliance Tools\n• Multi-Site Management\n• White-Label Options\n\nLaunching Q4 2025!'
    }
    
    return '🤔 I can help you with:\n\n• Joining the Q4 2025 waitlist\n• Platform features & capabilities\n• Pricing information\n• White-label opportunities\n\nTry asking: "How do I join the waitlist?"'
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
  }

  const sendMessage = () => {
    if (!currentMessage.trim()) return
    
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: currentMessage,
      timestamp: new Date()
    }
    
    setChatMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsTyping(true)
    
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot', 
        content: generateBotResponse(currentMessage),
        timestamp: new Date()
      }
      
      setChatMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Announcement Bar */}
      {isAnnouncementVisible && (
        <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 text-center text-sm font-semibold relative z-[1001]">
          <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-4">
            <span className="text-base">🎓</span>
            <span className="flex-1 text-center">
              Design-Rite's Revolutionary AI is launching Q4 2025 - Join the waitlist for early access to security design mastery
            </span>
            <Link href="/subscribe" className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-white/30 transition-all border border-white/30">
              Join Waitlist
            </Link>
            <button onClick={closeAnnouncement} className="text-white text-lg opacity-70 hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Utility Bar */}
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

      {/* Main Header */}
      <header className="sticky top-0 left-0 right-0 z-[1000] bg-black/95 backdrop-blur-xl border-b border-purple-600/20 py-4">
        <nav className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-black text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg">
              DR
            </div>
            Design-Rite
          </Link>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/subscribe" className="bg-purple-600/20 text-purple-600 border border-purple-600/30 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-purple-600/30 hover:border-purple-600 transition-all">
              Subscribe
            </Link>
            <div className="flex items-center gap-4">
              <Link href="/demo" className="bg-purple-600/10 text-purple-600 border border-purple-600/30 px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-purple-600/20 hover:border-purple-600 transition-all">
                Watch Demo
              </Link>
              <button onClick={redirectToWaitlist} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-purple-600/30 transition-all">
                Join Waitlist
              </button>
            </div>
          </div>

          <button 
            className="lg:hidden text-white text-2xl p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/20 backdrop-blur-xl border-t border-purple-600/10">
            <div className="px-8 py-4 space-y-4">
              <Link href="/platform" className="block text-gray-300 hover:text-white">Platform</Link>
              <Link href="/solutions" className="block text-gray-300 hover:text-white">Solutions</Link>
              <Link href="/partners" className="block text-gray-300 hover:text-white">Partners</Link>
              <Link href="/about" className="block text-gray-300 hover:text-white">About</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent"></div>
        
        <div className="max-w-6xl mx-auto px-8 grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div className="max-w-2xl">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
              AI-Powered Security Design
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Design right, with AI insight
            </h1>
            
            <p className="text-xl text-gray-400 mb-10 leading-relaxed">
              Revolutionary AI platform that transforms security system design. 
              Generate comprehensive assessments, detailed proposals, and professional 
              documentation in minutes, not days.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button 
                onClick={redirectToWaitlist}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all"
              >
                Join Waitlist - Q4 2025
              </button>
              <Link 
                href="/demo"
                className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all text-center"
              >
                Watch Demo
              </Link>
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
          
          <div className="bg-gray-800/80 backdrop-blur-xl border border-purple-600/30 rounded-3xl p-8 relative overflow-hidden animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-transparent rounded-3xl"></div>
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Security Assessment Dashboard</h3>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold animate-pulse">
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
            
            <div className="bg-gray-600/30 h-2 rounded-full overflow-hidden mb-2">
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 h-full w-3/4 rounded-full"></div>
            </div>
            <div className="text-gray-400 text-xs">Platform Development: 78% Complete</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-black/50">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
            Intelligent Security Design Platform
          </h2>
          <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto">
            Powered by advanced AI algorithms trained on thousands of security installations, 
            our platform delivers professional-grade assessments and proposals.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🧠",
                title: "AI-Powered Analysis",
                description: "Our advanced AI analyzes your facility requirements and generates comprehensive security assessments with detailed device specifications and placement recommendations.",
                link: "/ai-analysis"
              },
              {
                icon: "📋",
                title: "Professional Proposals",
                description: "Generate client-ready proposals with detailed BOMs, pricing, compliance documentation, and implementation timelines in minutes.",
                link: "/proposals"
              },
              {
                icon: "🏢",
                title: "White-Label Solutions",
                description: "Brand our platform as your own. Complete customization with your logo, colors, and pricing to seamlessly integrate with your business.",
                link: "/white-label"
              },
              {
                icon: "📊",
                title: "Compliance Analytics",
                description: "Ensure full compliance with industry standards including CJIS, FERPA, HIPAA, and local building codes with automated verification.",
                link: "/compliance"
              },
              {
                icon: "⚡",
                title: "API Integration",
                description: "Seamlessly integrate our AI capabilities into your existing workflows with our comprehensive REST API and webhooks.",
                link: "/api"
              },
              {
                icon: "📈",
                title: "Project Management",
                description: "Track project progress, manage client communications, and maintain detailed documentation throughout the entire installation lifecycle.",
                link: "/projects"
              }
            ].map((feature, index) => (
              <div key={index} className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-left hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
                <div className="w-15 h-15 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                <p className="text-gray-400 mb-6 leading-relaxed">{feature.description}</p>
                <Link href={feature.link} className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors">
                  Learn More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600/10 to-purple-700/10">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Ready to Transform Your Design Process?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join hundreds of security integrators who are already on our waitlist for early access 
            to the most advanced AI-powered security design platform launching Q4 2025.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={redirectToWaitlist}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all"
            >
              Join Waitlist - Free Early Access
            </button>
            <Link 
              href="/contact"
              className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all"
            >
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
              <p className="text-gray-400 leading-relaxed mb-6">
                Transforming security system design with AI-powered intelligence. 
                Professional assessments, automated proposals, and comprehensive 
                documentation for the modern security industry.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><button onClick={redirectToWaitlist} className="text-gray-400 hover:text-purple-600 text-sm transition-colors">AI Assessment</button></li>
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
                <li><Link href="/healthcare" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Healthcare</Link></li>
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
              <Link href="/linkedin" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">💼</Link>
              <Link href="/twitter" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">🐦</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Working Chat Widget */}
      <div className="fixed bottom-5 right-5 z-[999999]">
        <button
          onClick={toggleChat}
          className="w-15 h-15 bg-purple-600 rounded-full cursor-pointer flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all"
        >
          <div className="text-white text-2xl font-bold">💬</div>
        </button>
        
        {isChatOpen && (
          <div className="absolute bottom-16 right-0 w-[380px] h-[500px] bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col">
            <div className="bg-purple-600 text-white p-4 font-semibold flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span>Design-Rite Assistant</span>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <button onClick={toggleChat} className="text-white text-lg hover:bg-white/20 rounded w-6 h-6 flex items-center justify-center">×</button>
            </div>
            
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50" style={{maxHeight: '380px'}}>
              {chatMessages.map((message) => (
                <div key={message.id} className={`mb-4 ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block max-w-[80%] p-3 rounded-xl text-sm ${
                      message.sender === 'user'
                        ? 'bg-purple-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line">
                      {message.content}
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="text-left mb-4">
                  <div className="inline-block bg-white border border-gray-200 rounded-xl rounded-bl-none p-3 text-sm text-gray-800">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-200 flex gap-2">
              <input 
                type="text" 
                placeholder="Ask me anything..."
                value={currentMessage}
                onChange={(e) => setCurrentMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-600 text-gray-800"
                maxLength={200}
                disabled={isTyping}
              />
              <button 
                onClick={sendMessage}
                disabled={!currentMessage.trim() || isTyping}
                className="bg-purple-600 text-white rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-700 transition-colors"
              >
                →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}