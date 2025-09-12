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
    // Check if announcement was previously closed
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('announcement_closed') === 'true') {
        setIsAnnouncementVisible(false)
      }
    }
    
    // Security console logs (production only)
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      console.log('%c🛡️ DESIGN-RITE PROPRIETARY SOFTWARE', 'color: #8B5CF6; font-size: 16px; font-weight: bold;')
      console.log('%c© 2025 Design-Rite. All rights reserved.', 'color: #666; font-size: 12px;')
    }
  }, [])

  // UPDATED: All platform access now redirects to waitlist
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
    
    // Waitlist/trial related responses
    if (msg.includes('waitlist') || msg.includes('join') || msg.includes('early access')) {
      return '🎯 **Join Our Waitlist!**\n\nGreat news! You can join our exclusive Q4 2025 launch waitlist right now.\n\n✅ **Early Access Benefits:**\n• First access to the platform\n• Up to 50% off first year\n• Priority support\n• Direct feedback channel\n\n👆 Click "Join Waitlist" to get started!'
    }
    
    if (msg.includes('trial') || msg.includes('free')) {
      return '🚀 **Q4 2025 Launch!**\n\nOur AI security platform is launching in Q4 2025. Right now, you can:\n\n• Join our exclusive waitlist\n• Get early access notifications\n• Secure special launch pricing\n\nClick "Join Waitlist" above to reserve your spot!'
    }
    
    // Pricing related
    if (msg.includes('pricing') || msg.includes('cost') || msg.includes('price')) {
      return '💰 **Pricing Plans (Q4 2025):**\n\n🆓 **Starter:** 3 assessments/month\n💼 **Professional:** $197/month\n🏢 **Enterprise:** Custom pricing\n🏷️ **White-Label:** Custom partnership\n\n**Waitlist members get up to 50% off first year!**\n\nJoin the waitlist to lock in early pricing.'
    }
    
    // Features
    if (msg.includes('feature') || msg.includes('what') || msg.includes('platform')) {
      return '🧠 **AI Platform Features:**\n\n• **AI Security Assessments** - Automated threat analysis\n• **Smart Recommendations** - Equipment & placement suggestions  \n• **Professional Proposals** - Instant BOMs & pricing\n• **Compliance Tools** - CJIS, HIPAA, FERPA ready\n• **Multi-Site Management** - Enterprise dashboards\n• **White-Label Options** - Brand it as your own\n\nLaunching Q4 2025! Join waitlist for early access.'
    }
    
    // White label
    if (msg.includes('white') || msg.includes('label') || msg.includes('brand')) {
      return '🏷️ **White-Label Program:**\n\n• Complete platform customization\n• Your logo, colors, and branding\n• Custom domain (yourcompany.com)\n• Revenue sharing opportunities\n• Priority technical support\n\n**Perfect for:** Security integrators, consultants, and enterprise teams\n\nInterested? Join our waitlist and mention "white-label"!'
    }
    
    // Contact/support
    if (msg.includes('contact') || msg.includes('support') || msg.includes('help')) {
      return '📧 **Get in Touch:**\n\n• **General:** hello@design-rite.com\n• **Sales:** sales@design-rite.com  \n• **Support:** support@design-rite.com\n\n📞 **Schedule a Call:**\nWe offer personalized demos for qualified prospects.\n\n💬 **Immediate Help:**\nI can answer most questions right here in chat!'
    }
    
    // Default response
    return '🤔 **I can help you with:**\n\n• Joining the Q4 2025 waitlist\n• Platform features & capabilities\n• Pricing information\n• White-label opportunities\n• Contact information\n• Getting started\n\n**Try asking:**\n"How do I join the waitlist?"\n"What are the pricing plans?"\n"Tell me about white-label options"'
  }

  const sendMessage = () => {
    if (!currentMessage.trim()) return
    
    // Add user message
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      content: currentMessage,
      timestamp: new Date()
    }
    
    setChatMessages(prev => [...prev, userMessage])
    setCurrentMessage('')
    setIsTyping(true)
    
    // Generate and add bot response after delay
    setTimeout(() => {
      const botResponse = {
        id: Date.now() + 1,
        sender: 'bot', 
        content: generateBotResponse(currentMessage),
        timestamp: new Date()
      }
      
      setChatMessages(prev => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // Random delay between 1-2 seconds
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage()
    }
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

      {/* Main Header - keeping existing navigation */}
      <header className="sticky top-0 left-0 right-0 z-[1000] bg-black/95 backdrop-blur-xl border-b border-purple-600/20 py-4">
        {/* Navigation content stays the same as your original */}
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
      </header>

      {/* Rest of your page content stays the same... */}
      {/* Hero Section, Features, CTA, Footer all stay the same */}

      {/* FIXED Chat Widget */}
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
                      {message.content.split('**').map((part, index) => 
                        index % 2 === 0 ? part : <strong key={index}>{part}</strong>
                      )}
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