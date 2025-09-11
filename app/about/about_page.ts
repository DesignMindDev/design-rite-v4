"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
            <li><Link href="/about" className="text-white bg-white/10 px-4 py-2 rounded-lg font-medium">About</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Contact</Link></li>
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
              <Link href="/about" className="block text-white font-medium py-2">About</Link>
              <Link href="/contact" className="block text-white/80 hover:text-white py-2">Contact</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
            About Design-Rite
          </h1>
          <p className="text-xl text-white/80 leading-relaxed">
            We're revolutionizing security system design with AI-powered intelligence, 
            making professional-grade assessments accessible to everyone in the industry.
          </p>
        </section>

        {/* Mission Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold mb-6 flex items-center gap-4">
              <span className="text-3xl">🎯</span> Our Mission
            </h2>
            <div className="text-lg text-white/90 leading-relaxed space-y-6">
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
                We believe that every building deserves a well-designed security system, but the traditional process 
                is too slow, expensive, and dependent on scarce expertise. Our AI bridges this gap, making professional 
                security design accessible to everyone.
              </p>
            </div>
          </div>
        </section>

        {/* Vision Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold mb-6 flex items-center gap-4">
              <span className="text-3xl">🚀</span> Our Vision
            </h2>
            <div className="text-lg text-white/90 leading-relaxed space-y-6">
              <p>
                We're creating the Design as a Service (DaaS™) category - a new industry standard where 
                AI-powered design becomes the foundation of security system implementation.
              </p>
              <p>
                By 2026, we envision a world where every security professional has access to PhD-level design 
                expertise through our platform, enabling faster project delivery, better compliance, and more 
                effective security outcomes.
              </p>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 flex items-center justify-center gap-4">
              <span className="text-3xl">👥</span> Our Team
            </h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              We're a team of security industry veterans, AI engineers, and design experts united by a vision 
              to transform the security industry through intelligent automation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Team Member 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">
                DK
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Dan Kozich</h3>
              <p className="text-purple-300 font-semibold mb-4">Founder & CEO</p>
              <p className="text-white/80 text-sm leading-relaxed">
                Security industry veteran with 15+ years building enterprise solutions. 
                Leading the AI revolution in security design.
              </p>
            </div>

            {/* AI Team */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">
                AI
              </div>
              <h3 className="text-xl font-bold text-white mb-2">AI Design Team</h3>
              <p className="text-purple-300 font-semibold mb-4">Core Platform</p>
              <p className="text-white/80 text-sm leading-relaxed">
                Advanced AI models trained on thousands of security designs, compliance standards, 
                and industry best practices.
              </p>
            </div>

            {/* Join Us */}
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">
                +
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Join Our Team</h3>
              <p className="text-purple-300 font-semibold mb-4">We're Hiring</p>
              <p className="text-white/80 text-sm leading-relaxed mb-4">
                Help us build the future of security design. We're looking for passionate 
                engineers and industry experts.
              </p>
              <Link 
                href="/careers"
                className="inline-block bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm"
              >
                View Careers
              </Link>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Our Values</h2>
            <p className="text-lg text-white/80 max-w-3xl mx-auto">
              These principles guide everything we do, from product development to customer relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "⚡",
                title: "Speed & Efficiency",
                description: "Transform weeks of work into minutes. We obsess over making security design faster without sacrificing quality."
              },
              {
                icon: "🎯",
                title: "Precision & Accuracy", 
                description: "Our AI delivers professional-grade results with 95%+ accuracy, backed by industry expertise and compliance knowledge."
              },
              {
                icon: "🤝",
                title: "Partnership & Trust",
                description: "We succeed when our customers succeed. We build long-term partnerships, not just software transactions."
              },
              {
                icon: "🔒",
                title: "Security First",
                description: "We protect your data and your clients' information with enterprise-grade security and privacy controls."
              },
              {
                icon: "📈",
                title: "Continuous Innovation",
                description: "We constantly improve our AI models and platform based on real-world feedback and industry evolution."
              },
              {
                icon: "🌍",
                title: "Accessibility",
                description: "Professional security design expertise should be available to everyone, regardless of company size or budget."
              }
            ].map((value, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="text-3xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{value.title}</h3>
                <p className="text-white/80 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Technology Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold mb-6 flex items-center gap-4">
              <span className="text-3xl">🧠</span> Our Technology
            </h2>
            <div className="text-lg text-white/90 leading-relaxed space-y-6">
              <p>
                Design-Rite leverages cutting-edge artificial intelligence, including large language models 
                and computer vision, trained specifically on security industry data, compliance requirements, 
                and design best practices.
              </p>
              <p>
                Our platform combines multiple AI technologies to analyze facility layouts, assess security 
                risks, recommend optimal device placement, and generate comprehensive documentation that 
                meets industry standards.
              </p>
              <p>
                The system continuously learns and improves, ensuring recommendations meet industry standards 
                and best practices.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold mb-6">Ready to Join the Revolution?</h2>
            <p className="text-xl text-white/80 mb-10">
              Experience the future of security design today. Start your free trial and see 
              how AI can transform your workflow.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/app"
                className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all"
              >
                Start Free Trial
              </Link>
              <Link 
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/10 transition-all"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}