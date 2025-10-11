"use client"

import { useState } from 'react'
import Link from 'next/link'
import EmailGate from '../components/EmailGate'
import Footer from '../components/Footer'
import UnifiedNavigation from '../components/UnifiedNavigation'

export default function ContactPage() {
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
    window.location.href = '/estimate-options';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Main Navigation Header */}
      <UnifiedNavigation />

      {/* Main Content */}
      <main className="py-20 px-6">
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
      <Footer redirectToApp={handleEmailGateSuccess} />

      <EmailGate
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onSuccess={handleEmailGateSuccess}
      />
    </div>
  )
}


