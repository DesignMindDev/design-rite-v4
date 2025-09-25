"use client"

import { useState } from 'react'
import Link from 'next/link'
import EmailGate from '../components/EmailGate'
import { useAuthCache } from '../hooks/useAuthCache'

export default function SolutionsPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const { isAuthenticated, extendSession } = useAuthCache()

  const handleTryPlatformClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      extendSession();
      window.location.href = '/estimate-options';
    } else {
      setShowEmailGate(true);
    }
  };

  const handleEmailGateSuccess = () => {
    setShowEmailGate(false);
    window.location.href = '/ai-assessment';
  };

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
            <li><Link href="/solutions" className="text-white bg-white/10 px-4 py-2 rounded-lg font-medium">Solutions</Link></li>
            <li><Link href="/partners" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Partners</Link></li>
            <li><Link href="/about" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">About</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Contact</Link></li>
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="text-white border-2 border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Sign In
            </Link>
            <button
              onClick={handleTryPlatformClick}
              className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              Try Platform
            </button>
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
              <Link href="/solutions" className="block text-white font-medium py-2">Solutions</Link>
              <Link href="/partners" className="block text-white/80 hover:text-white py-2">Partners</Link>
              <Link href="/about" className="block text-white/80 hover:text-white py-2">About</Link>
              <Link href="/contact" className="block text-white/80 hover:text-white py-2">Contact</Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="py-20 px-6 max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center mb-25">
          <div className="text-white/80 text-base font-semibold uppercase tracking-wider mb-4">
            Industry Solutions
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
            Tailored for Your Industry
          </h1>
          <p className="text-xl text-white/80 leading-relaxed max-w-3xl mx-auto">
            Design-Rite's AI platform adapts to the unique requirements of your industry, 
            ensuring compliance, efficiency, and professional results every time.
          </p>
        </section>

        {/* Solutions Grid */}
        <section className="grid lg:grid-cols-2 gap-10 mb-25">
          {/* Security Integrators */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl transition-all relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
            <span className="text-5xl block mb-6">🔧</span>
            <h3 className="text-3xl font-bold text-white mb-4">Security Integrators</h3>
            <p className="text-white/70 text-lg font-medium mb-6">
              Professional Design & Installation Services
            </p>
            <p className="text-white/80 leading-relaxed mb-8">
              Transform your design process with AI-powered assessments and automated proposal generation. 
              Deliver professional results faster while reducing costs and increasing client satisfaction.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Automated site assessments and threat analysis",
                "Professional proposal generation with BOMs",
                "Custom pricing and markup controls",
                "Project management and client communication",
                "White-label branding options"
              ].map((feature, index) => (
                <li key={index} className="text-white/90 font-medium pl-6 relative">
                  <span className="absolute left-0 text-green-500 font-bold">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link 
              href="/contact"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all inline-block"
            >
              Get Started →
            </Link>
          </div>

          {/* Enterprise */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl transition-all relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
            <span className="text-5xl block mb-6">🏢</span>
            <h3 className="text-3xl font-bold text-white mb-4">Enterprise Security</h3>
            <p className="text-white/70 text-lg font-medium mb-6">
              In-House Security Teams & Corporate Facilities
            </p>
            <p className="text-white/80 leading-relaxed mb-8">
              Empower your internal security teams with enterprise-grade AI tools for facility assessments, 
              vendor management, and security strategy development across multiple locations.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "Multi-site facility management",
                "Vendor proposal evaluation and comparison",
                "Enterprise compliance reporting",
                "Budget planning and ROI analysis",
                "Team collaboration and approval workflows"
              ].map((feature, index) => (
                <li key={index} className="text-white/90 font-medium pl-6 relative">
                  <span className="absolute left-0 text-green-500 font-bold">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link 
              href="/contact"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all inline-block"
            >
              Schedule Demo →
            </Link>
          </div>

          {/* Education */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl transition-all relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
            <span className="text-5xl block mb-6">🎓</span>
            <h3 className="text-3xl font-bold text-white mb-4">Education Sector</h3>
            <p className="text-white/70 text-lg font-medium mb-6">
              Schools, Universities & Educational Facilities
            </p>
            <p className="text-white/80 leading-relaxed mb-8">
              Specialized security solutions for educational environments with FERPA compliance, 
              student safety protocols, and budget-conscious recommendations tailored for schools.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "FERPA compliance validation",
                "Student safety and visitor management",
                "Emergency response planning",
                "Budget-optimized recommendations",
                "Grant application support documentation"
              ].map((feature, index) => (
                <li key={index} className="text-white/90 font-medium pl-6 relative">
                  <span className="absolute left-0 text-green-500 font-bold">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link 
              href="/contact"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all inline-block"
            >
              Learn More →
            </Link>
          </div>

          {/* Healthcare */}
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 hover:-translate-y-2 hover:bg-white/15 hover:shadow-2xl transition-all relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-green-600"></div>
            <span className="text-5xl block mb-6">🏥</span>
            <h3 className="text-3xl font-bold text-white mb-4">Healthcare</h3>
            <p className="text-white/70 text-lg font-medium mb-6">
              Hospitals, Clinics & Medical Facilities
            </p>
            <p className="text-white/80 leading-relaxed mb-8">
              HIPAA-compliant security solutions designed for healthcare environments, with patient privacy 
              protection, access control, and specialized medical facility security requirements.
            </p>
            <ul className="space-y-3 mb-8">
              {[
                "HIPAA compliance and patient privacy",
                "Medical equipment and pharmaceutical security",
                "Patient and visitor access control",
                "Emergency department security protocols",
                "Integration with medical facility systems"
              ].map((feature, index) => (
                <li key={index} className="text-white/90 font-medium pl-6 relative">
                  <span className="absolute left-0 text-green-500 font-bold">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            <Link 
              href="/contact"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all inline-block"
            >
              Contact Sales →
            </Link>
          </div>
        </section>

        {/* Use Cases Section */}
        <section className="mb-25">
          <h2 className="text-4xl lg:text-5xl font-black text-center mb-16">Common Use Cases</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "🏗️",
                title: "New Construction Projects",
                description: "Design security systems for new buildings from the ground up, integrating with architectural plans and construction timelines."
              },
              {
                icon: "🔄",
                title: "System Upgrades", 
                description: "Modernize existing security infrastructure with AI-powered assessments of current systems and upgrade recommendations."
              },
              {
                icon: "🔍",
                title: "Security Assessments",
                description: "Comprehensive facility evaluations identifying vulnerabilities and providing detailed security improvement recommendations."
              },
              {
                icon: "📋",
                title: "Compliance Audits",
                description: "Automated compliance checking against industry standards including CJIS, FERPA, HIPAA, and local building codes."
              },
              {
                icon: "💼",
                title: "RFP Responses",
                description: "Generate detailed responses to security RFPs with accurate specifications, timelines, and competitive pricing."
              },
              {
                icon: "🎯",
                title: "Threat Analysis",
                description: "AI-powered threat modeling and risk assessment based on facility type, location, and operational requirements."
              }
            ].map((useCase, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:-translate-y-1 hover:bg-white/15 transition-all text-center">
                <div className="text-4xl mb-4">{useCase.icon}</div>
                <h3 className="text-xl font-bold text-white mb-4">{useCase.title}</h3>
                <p className="text-white/80 leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white/10 backdrop-blur-sm rounded-3xl p-16 border border-white/20 text-center">
          <h2 className="text-4xl lg:text-5xl font-black mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto">
            Transform your security design process today. Join hundreds of professionals who are already 
            delivering faster, more accurate results with Design-Rite's AI platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleTryPlatformClick}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all"
            >
              Start Free Trial
            </button>
            <Link 
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/10 transition-all"
            >
              Schedule Demo
            </Link>
          </div>
        </section>
      </main>

      {/* Email Gate Modal */}
      <EmailGate
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onSuccess={handleEmailGateSuccess}
      />
    </div>
  )
}


