"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
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

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            <li><Link href="/platform" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Platform</Link></li>
            <li><Link href="/solutions" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Solutions</Link></li>
            <li><Link href="/partners" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Partners</Link></li>
            <li><Link href="/about" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">About</Link></li>
            <li><Link href="/contact" className="text-white bg-white/10 px-4 py-2 rounded-lg font-medium">Contact</Link></li>
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="text-white border-2 border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Sign In
            </Link>
            <Link href="/app" className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all">
              Try Platform
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white text-2xl"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/20 backdrop-blur-sm border-t border-white/10">
            <div className="px-6 py-4 space-y-4">
              <Link href="/platform" className="block text-white/80 hover:text-white py-2">Platform</Link>
              <Link href="/solutions" className="block text-white/80 hover:text-white py-2">Solutions</Link>
              <Link href="/partners" className="block text-white/80 hover:text-white py-2">Partners</Link>
              <Link href="/about" className="block text-white/80 hover:text-white py-2">About</Link>
              <Link href="/contact" className="block text-white font-medium py-2">Contact</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
            Get in Touch
          </h1>
          <p className="text-xl text-white/80 leading-relaxed mb-10">
            Ready to transform your security design process? We're here to help you get started 
            with Design-Rite's AI-powered platform.
          </p>
        </section>

        {/* Contact Options */}
        <section className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto mb-20">
          {/* Email Contact */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-xl">
              📧
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Email Us Directly</h3>
            <p className="text-white/80 mb-8 leading-relaxed">
              Send us a message and we'll respond within 24 hours. Perfect for detailed questions, 
              custom requirements, or general inquiries.
            </p>
            <a 
              href="mailto:info@design-rite.com"
              className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all mb-4"
            >
              📧 info@design-rite.com
            </a>
            <div className="text-sm text-white/60 mt-4">
              Sales, support, partnerships, and technical questions
            </div>
          </div>

          {/* Schedule Demo */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-xl">
              📅
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Schedule a Demo</h3>
            <p className="text-white/80 mb-8 leading-relaxed">
              See the platform in action and discover how AI can transform your workflow. 
              Perfect for teams ready to get started.
            </p>
            <button 
              onClick={scheduleDemo}
              className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all mb-4"
            >
              📅 Schedule Demo
            </button>
            <div className="text-sm text-white/60 mt-4">
              Sales demos, technical questions, and custom solutions
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-gray-800/80 backdrop-blur-xl border border-purple-600/30 rounded-3xl p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-transparent rounded-3xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold text-white mb-2 text-center">Send us a Message</h2>
              <p className="text-white/70 mb-10 text-center">
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
        <section className="max-w-4xl mx-auto mt-20">
          <h3 className="text-3xl font-bold text-center mb-6">🚀 Quick Actions</h3>
          <p className="text-center text-white/80 mb-10">
            Not ready to schedule? Try these quick options to get started with Design-Rite
          </p>
          
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
              href="mailto:info@design-rite.com?subject=White-Label%20Partnership"
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