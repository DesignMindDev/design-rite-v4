"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function DesignRiteLandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)

  const redirectToApp = () => {
    window.location.href = '/app'
  }

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
      {/* Header */}
      <header className="bg-black/10 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-bold text-2xl">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-purple-600 font-black text-sm">
              DR
            </div>
            Design-Rite
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            <li><Link href="/platform" className="text-white/80 hover:text-white transition-colors">Platform</Link></li>
            <li><Link href="/solutions" className="text-white/80 hover:text-white transition-colors">Solutions</Link></li>
            <li><Link href="/partners" className="text-white/80 hover:text-white transition-colors">Partners</Link></li>
            <li><Link href="/about" className="text-white/80 hover:text-white transition-colors">About</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors">Contact</Link></li>
          </ul>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-white/80 hover:text-white px-4 py-2 border border-white/20 rounded-lg transition-colors">
              Sign In
            </Link>
            <button 
              onClick={redirectToApp}
              className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Try Platform
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/20 backdrop-blur-sm border-t border-white/10">
            <div className="px-6 py-4 space-y-4">
              <Link href="/platform" className="block text-white/80 hover:text-white">Platform</Link>
              <Link href="/solutions" className="block text-white/80 hover:text-white">Solutions</Link>
              <Link href="/partners" className="block text-white/80 hover:text-white">Partners</Link>
              <Link href="/about" className="block text-white/80 hover:text-white">About</Link>
              <Link href="/contact" className="block text-white/80 hover:text-white">Contact</Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <main className="relative">
        <section className="max-w-7xl mx-auto px-6 py-16 text-center text-white">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              AI-Powered Security Design Platform
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Transform security system design from days to minutes with intelligent 
              assessments, automated proposals, and comprehensive documentation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={redirectToApp}
                className="bg-white text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
              >
                Start Free Assessment
              </button>
              <Link 
                href="/demo"
                className="border-2 border-white text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Watch Demo
              </Link>
            </div>

            <div className="text-white/80 text-sm">
              No Credit Card Required • 5-Minute Setup • Professional Results
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-white/10 backdrop-blur-sm py-16">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
              Everything You Need for Professional Security Design
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/10">
                <div className="text-4xl mb-4">🧠</div>
                <h3 className="text-xl font-bold text-white mb-4">AI Security Assessment</h3>
                <p className="text-white/80">
                  Upload facility plans, answer guided questions, and get intelligent 
                  security recommendations powered by industry expertise.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/10">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-xl font-bold text-white mb-4">Automated Proposals</h3>
                <p className="text-white/80">
                  Generate professional BOMs, pricing, and detailed proposals 
                  automatically based on assessment results.
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/10">
                <div className="text-4xl mb-4">🎯</div>
                <h3 className="text-xl font-bold text-white mb-4">White-Label Ready</h3>
                <p className="text-white/80">
                  Customize the platform with your branding and integrate seamlessly 
                  into your existing business workflow.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-bold text-lg mb-4">Design-Rite</h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Professional assessments, automated proposals, and comprehensive 
                documentation for the modern security industry.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><Link href="/assessment" className="text-white/70 hover:text-white text-sm">AI Assessment</Link></li>
                <li><Link href="/proposals" className="text-white/70 hover:text-white text-sm">Proposal Generator</Link></li>
                <li><Link href="/white-label" className="text-white/70 hover:text-white text-sm">White-Label</Link></li>
                <li><Link href="/api" className="text-white/70 hover:text-white text-sm">API Access</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Solutions</h3>
              <ul className="space-y-2">
                <li><Link href="/integrators" className="text-white/70 hover:text-white text-sm">Security Integrators</Link></li>
                <li><Link href="/enterprise" className="text-white/70 hover:text-white text-sm">Enterprise</Link></li>
                <li><Link href="/education" className="text-white/70 hover:text-white text-sm">Education</Link></li>
                <li><Link href="/healthcare" className="text-white/70 hover:text-white text-sm">Healthcare</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><Link href="/about" className="text-white/70 hover:text-white text-sm">About Us</Link></li>
                <li><Link href="/careers" className="text-white/70 hover:text-white text-sm">Careers</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-white text-sm">Contact</Link></li>
                <li><Link href="/support" className="text-white/70 hover:text-white text-sm">Support</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <div className="text-white/70 text-sm">© 2025 Design-Rite. All rights reserved.</div>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={toggleChat}
          className="bg-purple-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-purple-700 transition-colors flex items-center justify-center text-xl"
        >
          💬
        </button>
        
        {isChatOpen && (
          <div className="absolute bottom-16 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
            <div className="bg-purple-600 text-white p-4 flex justify-between items-center">
              <span className="font-semibold">Design-Rite Assistant</span>
              <button onClick={toggleChat} className="text-xl">×</button>
            </div>
            <div className="p-4 h-64 overflow-y-auto">
              <div className="bg-gray-100 p-3 rounded-lg mb-4">
                Hi! I'm your Design-Rite AI assistant. Ask me about our AI-powered security design platform!
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Ask about Design-Rite..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-600"
                />
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
