"use client"

import { useState } from 'react'
import Link from 'next/link'
import EmailGate from '../components/EmailGate'

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    inquiry: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create mailto link with form data
    const subject = encodeURIComponent(`Design-Rite Contact: ${formData.inquiry || 'General Inquiry'}`)
    const body = encodeURIComponent(`
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Company: ${formData.company || 'Not specified'}
Inquiry Type: ${formData.inquiry}

Message:
${formData.message}

---
Sent from Design-Rite Contact Form
    `.trim())

    const mailtoLink = `mailto:info@design-rite.com?subject=${subject}&body=${body}`

    // Simulate processing delay
    setTimeout(() => {
      window.location.href = mailtoLink
      
      setTimeout(() => {
        setIsSubmitting(false)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          company: '',
          inquiry: '',
          message: ''
        })
        alert('📧 Thank you! Your email client should open with your message pre-filled. Please send the email to complete your inquiry.')
      }, 1000)
    }, 1000)
  }

  const scheduleDemo = () => {
    // In a real implementation, this would open Calendly
    alert('📅 Demo scheduling would open here. For now, please use the contact form or email info@design-rite.com')
  }

  const handleTryItFreeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowEmailGate(true);
  };

  const handleEmailGateSuccess = () => {
    setShowEmailGate(false);
    window.location.href = '/ai-assessment';
  };

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

{/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-10">
            
            {/* Platform Dropdown */}
            <li className="relative group">
              <span className="text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm cursor-pointer after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full">
                Platform
              </span>
              <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[240px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">
                <Link href="/ai-assessment" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🧠
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">AI Assessment</div>
                    <div className="text-xs text-gray-400 leading-tight">Intelligent security analysis</div>
                  </div>
                </Link>
                <Link href="/compliance-analyst" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    ✅
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Compliance Tools</div>
                    <div className="text-xs text-gray-400 leading-tight">Regulatory compliance</div>
                  </div>
                </Link>
                <Link href="/white-label" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🏷️
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">White Label</div>
                    <div className="text-xs text-gray-400 leading-tight">Custom branding solutions</div>
                  </div>
                </Link>
                <Link href="/enterprise-roi" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    💰
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">ROI Calculator</div>
                    <div className="text-xs text-gray-400 leading-tight">Calculate your savings</div>
                  </div>
                </Link>
              </div>
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

            {/* Partners - Simple Link */}
            <li>
              <Link href="/partners" className="text-gray-300 hover:text-purple-600 font-medium transition-all text-sm">
                Partners
              </Link>
            </li>

            {/* Company Dropdown */}
            <li className="relative group">
              <span className="text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm cursor-pointer after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full">
                Company
              </span>
              <div className="absolute top-full left-0 mt-4 bg-black/95 backdrop-blur-xl border border-purple-600/30 rounded-xl p-4 min-w-[220px] opacity-0 invisible transform -translate-y-2 transition-all group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 shadow-2xl">
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
                <Link href="/contact" className="flex items-center gap-4 p-3 rounded-lg text-gray-300 hover:bg-purple-600/10 hover:text-white transition-all hover:translate-x-1">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    📧
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">Contact</div>
                    <div className="text-xs text-gray-400 leading-tight">Get in touch</div>
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
              <button onClick={handleTryItFreeClick} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg hover:shadow-purple-600/30 transition-all">Try It Free</button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden text-white text-2xl p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
        </nav>

{/* Mobile Menu */}
{isMenuOpen && (
  <div className="lg:hidden bg-black/20 backdrop-blur-sm border-t border-white/10">
    <div className="px-6 py-4 space-y-4">
      
      {/* Platform Section */}
      <div>
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Platform</div>
        <Link href="/ai-assessment" className="block text-white/80 hover:text-white py-2 pl-4">AI Assessment</Link>
        <Link href="/compliance-analyst" className="block text-white/80 hover:text-white py-2 pl-4">Compliance Tools</Link>
        <Link href="/white-label" className="block text-white/80 hover:text-white py-2 pl-4">White Label</Link>
        <Link href="/enterprise-roi" className="block text-white/80 hover:text-white py-2 pl-4">ROI Calculator</Link>
      </div>
      
      {/* Solutions Section */}
      <div className="border-t border-white/10 pt-2">
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Solutions</div>
        <Link href="/integrators" className="block text-white/80 hover:text-white py-2 pl-4">Security Integrators</Link>
        <Link href="/enterprise" className="block text-white/80 hover:text-white py-2 pl-4">Enterprise Security</Link>
        <Link href="/education" className="block text-white/80 hover:text-white py-2 pl-4">Education & Healthcare</Link>
        <Link href="/consultants" className="block text-white/80 hover:text-white py-2 pl-4">Security Consultants</Link>
      </div>
      
      {/* Partners Link */}
      <Link href="/partners" className="block text-white/80 hover:text-white py-2 border-t border-white/10 pt-2">Partners</Link>
      
      {/* Company Section */}
      <div className="border-t border-white/10 pt-2">
        <div className="text-gray-400 text-xs uppercase tracking-wider mb-2">Company</div>
        <Link href="/about" className="block text-white/80 hover:text-white py-2 pl-4">About Us</Link>
        <Link href="/team" className="block text-white/80 hover:text-white py-2 pl-4">Team</Link>
        <Link href="/careers" className="block text-white/80 hover:text-white py-2 pl-4">Careers</Link>
        <Link href="/contact" className="block text-white/80 hover:text-white py-2 pl-4">Contact</Link>
      </div>
      
      {/* Sign In and CTA */}
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

      {/* Main Content */}
      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto px-8">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Contact Design-Rite
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-10">
            Ready to transform your security design process? We're here to help you get started 
            with Design-Rite's AI-powered platform.
          </p>
        </section>

        {/* Contact Options */}
        <section className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20 px-8">
          {/* Email Contact */}
          <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
            <div className="w-15 h-15 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mb-6 mx-auto">
              📧
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Email Us Directly</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Send us a message and we'll respond within 24 hours. Perfect for detailed questions, 
              custom requirements, or general inquiries.
            </p>
            <a 
              href="mailto:info@design-rite.com"
              className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors inline-block mb-4"
            >
              📧 info@design-rite.com →
            </a>
            <div className="text-sm text-gray-400 mt-4">
              Sales, support, partnerships, and technical questions
            </div>
          </div>

          {/* Schedule Demo */}
          <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
            <div className="w-15 h-15 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mb-6 mx-auto">
              📅
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Schedule a Demo</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              See the platform in action and discover how AI can transform your workflow. 
              Perfect for teams ready to get started.
            </p>
            <button 
              onClick={scheduleDemo}
              className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors inline-block mb-4"
            >
              📅 Schedule Demo →
            </button>
            <div className="text-sm text-gray-400 mt-4">
              Sales demos, technical questions, and custom solutions
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="max-w-4xl mx-auto px-8 mb-20">
          <div className="bg-gray-800/80 backdrop-blur-xl border border-purple-600/30 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-transparent rounded-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl font-bold text-white mb-4 text-center bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Send us a Message</h2>
              <p className="text-xl text-gray-400 mb-10 text-center max-w-2xl mx-auto">
                We'll get back to you within 24 hours
              </p>

              <form onSubmit={handleFormSubmit}>
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="firstName" className="block text-white font-semibold mb-2">
                      First Name
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-purple-600/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-purple-600 focus:shadow-lg focus:shadow-purple-600/20 focus:bg-white/15 transition-all"
                      placeholder="Enter your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-white font-semibold mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-purple-600/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-purple-600 focus:shadow-lg focus:shadow-purple-600/20 focus:bg-white/15 transition-all"
                      placeholder="Enter your last name"
                    />
                  </div>
                </div>

                <div className="mb-6">
                  <label htmlFor="email" className="block text-white font-semibold mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-purple-600/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-purple-600 focus:shadow-lg focus:shadow-purple-600/20 focus:bg-white/15 transition-all"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="company" className="block text-white font-semibold mb-2">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-purple-600/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-purple-600 focus:shadow-lg focus:shadow-purple-600/20 focus:bg-white/15 transition-all"
                    placeholder="Your company name"
                  />
                </div>

                <div className="mb-6">
                  <label htmlFor="inquiry" className="block text-white font-semibold mb-2">
                    Type of Inquiry
                  </label>
                  <select
                    id="inquiry"
                    name="inquiry"
                    value={formData.inquiry}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-purple-600/30 rounded-lg bg-white/10 text-white focus:outline-none focus:border-purple-600 focus:shadow-lg focus:shadow-purple-600/20 focus:bg-white/15 transition-all cursor-pointer"
                  >
                    <option value="" className="bg-gray-800 text-white">Select an option</option>
                    <option value="sales" className="bg-gray-800 text-white">Sales & Pricing</option>
                    <option value="demo" className="bg-gray-800 text-white">Schedule Demo</option>
                    <option value="technical" className="bg-gray-800 text-white">Technical Support</option>
                    <option value="partnership" className="bg-gray-800 text-white">Partnership</option>
                    <option value="white-label" className="bg-gray-800 text-white">White-Label Program</option>
                    <option value="api" className="bg-gray-800 text-white">API Integration</option>
                    <option value="other" className="bg-gray-800 text-white">Other</option>
                  </select>
                </div>

                <div className="mb-8">
                  <label htmlFor="message" className="block text-white font-semibold mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border border-purple-600/30 rounded-lg bg-white/10 text-white placeholder-white/50 focus:outline-none focus:border-purple-600 focus:shadow-lg focus:shadow-purple-600/20 focus:bg-white/15 transition-all resize-vertical"
                    placeholder="Tell us about your project, questions, or how we can help..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* Quick Contact Options */}
        <section className="max-w-6xl mx-auto px-8">
          <h2 className="text-4xl lg:text-5xl font-black mb-4 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent text-center">Quick Actions</h2>
          <p className="text-xl text-gray-400 mb-16 max-w-2xl mx-auto text-center">
            Try these quick options to get started with Design-Rite
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Link 
              href="/app"
              className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all"
            >
              <div className="w-15 h-15 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mb-6 mx-auto">🆓</div>
              <h3 className="text-xl font-bold text-white mb-4">Start Free Trial</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">Try our platform with no commitment required.</p>
              <span className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors">Get Started →</span>
            </Link>
            <a 
              href="mailto:info@design-rite.com?subject=Pricing%20Information"
              className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all"
            >
              <div className="w-15 h-15 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mb-6 mx-auto">💰</div>
              <h3 className="text-xl font-bold text-white mb-4">Get Pricing</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">Request custom pricing for your organization.</p>
              <span className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors">Contact Sales →</span>
            </a>
            <a 
              href="mailto:partnerships@design-rite.com?subject=White-Label%20Partnership"
              className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all"
            >
              <div className="w-15 h-15 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mb-6 mx-auto">🏷️</div>
              <h3 className="text-xl font-bold text-white mb-4">Partner Program</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">Explore white-label and partnership opportunities.</p>
              <span className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors">Learn More →</span>
            </a>
            <a 
              href="mailto:support@design-rite.com?subject=Technical%20Support"
              className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all"
            >
              <div className="w-15 h-15 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-2xl mb-6 mx-auto">🛠️</div>
              <h3 className="text-xl font-bold text-white mb-4">Technical Support</h3>
              <p className="text-gray-400 mb-6 leading-relaxed">Get help with integration and technical questions.</p>
              <span className="text-purple-600 font-semibold text-sm hover:text-purple-700 transition-colors">Get Support →</span>
            </a>
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
              <Link className="text-gray-400 hover:text-purple-600 text-xl transition-colors" href="/linkedin">💼</Link>
              <Link className="text-gray-400 hover:text-purple-600 text-xl transition-colors" href="/twitter">🐦</Link>
            </div>
          </div>
        </div>
      </footer>
      <EmailGate
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onSuccess={handleEmailGateSuccess}
      />
    </div>
  )
}


