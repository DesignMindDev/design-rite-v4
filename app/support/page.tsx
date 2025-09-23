'use client'

import { useState } from 'react'
import Link from 'next/link'
import UnifiedNavigation from '../components/UnifiedNavigation';

export default function SupportPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')

  const redirectToApp = () => {
    window.location.href = '/waitlist'
  }

  const scheduleDemo = () => {
    window.location.href = '/demo.html'
  }

  const contactSupport = () => {
    window.location.href = 'mailto:support@design-rite.com?subject=Support Request - Design-Rite Platform'
  }

  const faqItems = [
    {
      category: 'getting-started',
      question: 'How do I get started with Design-Rite?',
      answer: 'Simply visit our platform and create a free trial account. You can immediately start generating AI-powered security assessments by entering your facility details and requirements.'
    },
    {
      category: 'getting-started',
      question: 'What information do I need to provide for an assessment?',
      answer: 'You\'ll need basic facility information including building type, square footage, security concerns, compliance requirements, and any specific equipment preferences. Our AI guides you through the process step-by-step.'
    },
    {
      category: 'platform',
      question: 'How accurate are the AI-generated assessments?',
      answer: 'Our AI delivers 95%+ accuracy based on thousands of real-world security installations. All recommendations are validated against industry standards and compliance requirements like CJIS, FERPA, and HIPAA.'
    },
    {
      category: 'platform',
      question: 'Can I customize the generated proposals?',
      answer: 'Absolutely! While our AI provides a comprehensive starting point, you can edit all recommendations, add custom notes, adjust pricing, and modify device specifications to match your specific requirements.'
    },
    {
      category: 'billing',
      question: 'What are your pricing plans?',
      answer: 'We offer flexible pricing including a free trial, pay-per-assessment options, and monthly/annual subscriptions. Visit our pricing page or contact sales for detailed information about enterprise plans.'
    },
    {
      category: 'billing',
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. You\'ll continue to have access until the end of your current billing period, and all your generated assessments remain accessible.'
    },
    {
      category: 'technical',
      question: 'Do you offer API integration?',
      answer: 'Yes! We provide a comprehensive REST API that allows you to integrate Design-Rite\'s AI capabilities into your existing workflows, CRM systems, or custom applications. Documentation is available for developers.'
    },
    {
      category: 'technical',
      question: 'Is there a mobile app available?',
      answer: 'Currently, Design-Rite is optimized as a responsive web application that works great on mobile devices. A dedicated mobile app is planned for future release.'
    },
    {
      category: 'compliance',
      question: 'Which compliance standards does Design-Rite support?',
      answer: 'We support major compliance frameworks including CJIS, FERPA, HIPAA, and local building codes. Our AI automatically includes relevant compliance considerations in all assessments.'
    },
    {
      category: 'compliance',
      question: 'How do you ensure data security?',
      answer: 'We use enterprise-grade security including end-to-end encryption, secure data centers, regular security audits, and compliance with industry standards. Your data is never shared with third parties.'
    }
  ]

  const filteredFAQs = faqItems.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Main Navigation Header with Dropdowns */}
<UnifiedNavigation />
      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent"></div>
        <div className="max-w-6xl mx-auto px-8 text-center relative z-10">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Help & Support Center
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            We're Here to Help
          </h1>
          <p className="text-xl text-gray-400 mb-16 leading-relaxed max-w-4xl mx-auto">
            Find answers to common questions, learn how to get the most out of Design-Rite's AI platform, 
            or contact our support team directly.
          </p>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="py-16 bg-black/50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">💬</div>
              <h3 className="text-lg font-bold text-white mb-2">Live Chat</h3>
              <p className="text-gray-400 text-sm mb-4">Get instant help from our support team</p>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                Start Chat
              </button>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">📧</div>
              <h3 className="text-lg font-bold text-white mb-2">Email Support</h3>
              <p className="text-gray-400 text-sm mb-4">Send us a detailed message</p>
              <button onClick={contactSupport} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                Contact Us
              </button>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">📖</div>
              <h3 className="text-lg font-bold text-white mb-2">Documentation</h3>
              <p className="text-gray-400 text-sm mb-4">Comprehensive guides and tutorials</p>
              <Link href="/docs" className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors inline-block">
                View Docs
              </Link>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-6 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">🎥</div>
              <h3 className="text-lg font-bold text-white mb-2">Video Tutorials</h3>
              <p className="text-gray-400 text-sm mb-4">Learn with step-by-step videos</p>
              <button onClick={scheduleDemo} className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Find quick answers to the most common questions about Design-Rite.
            </p>
          </div>

          {/* Search and Filter */}
          <div className="mb-8">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-800/60 border border-purple-600/20 rounded-lg py-3 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-600/50"
              />
              <div className="absolute right-3 top-3 text-gray-400">
                🔍
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === 'all' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveCategory('getting-started')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === 'getting-started' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-white'
                }`}
              >
                Getting Started
              </button>
              <button
                onClick={() => setActiveCategory('platform')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === 'platform' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-white'
                }`}
              >
                Platform
              </button>
              <button
                onClick={() => setActiveCategory('billing')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === 'billing' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-white'
                }`}
              >
                Billing
              </button>
              <button
                onClick={() => setActiveCategory('technical')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === 'technical' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-white'
                }`}
              >
                Technical
              </button>
              <button
                onClick={() => setActiveCategory('compliance')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeCategory === 'compliance' 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/60 hover:text-white'
                }`}
              >
                Compliance
              </button>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((item, index) => (
              <details key={index} className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl overflow-hidden group">
                <summary className="p-6 cursor-pointer hover:bg-gray-700/40 transition-colors flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-white pr-4">{item.question}</h3>
                  <div className="text-purple-600 text-xl group-open:rotate-180 transition-transform">▼</div>
                </summary>
                <div className="px-6 pb-6 text-gray-300 leading-relaxed border-t border-purple-600/10 pt-4">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>

          {filteredFAQs.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
              <p className="text-gray-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-black/50">
        <div className="max-w-4xl mx-auto px-8">
          <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-black mb-4 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
              Still Need Help?
            </h2>
            <p className="text-lg text-gray-300 mb-8">
              Our support team is standing by to help you get the most out of Design-Rite's AI platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={contactSupport} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all">
                Contact Support
              </button>
              <button onClick={scheduleDemo} className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all">
                Schedule Demo
              </button>
            </div>
            <div className="mt-8 text-sm text-gray-400">
              💬 Average response time: Under 2 hours
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-purple-600/20 py-12 mt-20">
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
                <li><Link href="/careers" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Contact</Link></li>
                <li><Link href="/support" className="text-purple-600 font-medium text-sm">Support</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-600/30 pt-8 flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
            <div>© 2025 Design-Rite. All rights reserved.</div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="mailto:support@design-rite.com" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">📧</a>
              <a href="https://linkedin.com/company/design-rite" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">💼</a>
              <a href="https://twitter.com/designrite" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">🐦</a>
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


