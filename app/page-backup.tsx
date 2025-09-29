"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import UnifiedNavigation from './components/UnifiedNavigation';
import EmailGate from './components/EmailGate';
// import { useSupabaseAuth } from './hooks/useSupabaseAuth';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeStormItem, setActiveStormItem] = useState(0)
  const [isCalm, setIsCalm] = useState(false)
  const [showEmailGate, setShowEmailGate] = useState(false)
  // const { isAuthenticated } = useSupabaseAuth()
  const isAuthenticated = false; // Temporarily disabled for testing

  const stormItems = [
    { icon: "☕", text: "Morning coffee, client calls with urgent changes", delay: 0, type: "problem" },
    { icon: "🚀", text: "Design-Rite analyzes imported CAD files and auto-generates complete BOMs", delay: 1, type: "solution" },
    { icon: "📞", text: "SOW edits and BOM revisions pile up", delay: 2, type: "problem" },
    { icon: "⚡", text: "Our AI creates professional proposals in 5 minutes", delay: 3, type: "solution" },
    { icon: "📑", text: "Another RFI, another clarification needed", delay: 4, type: "problem" },
    { icon: "🎯", text: "Smart compliance templates handle CJIS, FERPA, HIPAA", delay: 5, type: "solution" },
    { icon: "📝", text: "Leadership wants it yesterday, client wants it cheaper", delay: 6, type: "problem" },
    { icon: "🏆", text: "Virtual site walks eliminate travel and guesswork", delay: 7, type: "solution" },
    { icon: "🧩", text: "Analyzing incomplete CAD files with missing device counts", delay: 8, type: "problem" },
    { icon: "✨", text: "Real-time pricing from 3,000+ security products", delay: 9, type: "solution" }
  ]

  const solutions = [
    {
      icon: "🚀",
      title: "AI-Powered Assessments",
      description: "Upload CAD files, get complete security assessments with device counts, coverage analysis, and compliance requirements in minutes.",
      href: "/ai-assessment"
    },
    {
      icon: "📊",
      title: "Real-Time Pricing",
      description: "Access live pricing from 3,000+ security products. Generate accurate BOMs with current market rates.",
      href: "/pricing-tools"
    },
    {
      icon: "🎯",
      title: "Compliance Templates",
      description: "Pre-built templates for CJIS, FERPA, HIPAA, and other compliance requirements. No more starting from scratch.",
      href: "/compliance"
    },
    {
      icon: "🏆",
      title: "Professional Proposals",
      description: "Generate polished proposals with timelines, implementation plans, and executive summaries that win deals.",
      href: "/proposals"
    }
  ]

  const testimonials = [
    {
      quote: "Design-Rite increased our close rate by 30% and saved us 40 hours per week on proposals.",
      author: "Marcus Chen",
      title: "Senior Sales Engineer, SecureTech Solutions"
    },
    {
      quote: "Finally, no more weekend proposal marathons. Our team gets their weekends back.",
      author: "Sarah Rodriguez",
      title: "Regional Sales Manager, ProSecurity Systems"
    },
    {
      quote: "The AI catches compliance requirements we used to miss. Our proposals are more thorough than ever.",
      author: "David Kim",
      title: "Security Consultant, TechGuard Enterprise"
    }
  ]

  const handleTryPlatformClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (isAuthenticated) {
      window.location.href = '/estimate-options';
    } else {
      setShowEmailGate(true);
    }
  };

  const handleEmailGateSuccess = () => {
    setShowEmailGate(false);
    window.location.href = '/estimate-options';
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStormItem((prev) => (prev + 1) % stormItems.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [stormItems.length])

  useEffect(() => {
    const calmTimer = setTimeout(() => {
      setIsCalm(true)
    }, 25000)

    return () => clearTimeout(calmTimer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      <UnifiedNavigation isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* Hero Section */}
      <div className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              For Sales Engineers in Security/Low-Voltage
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Caught in the <span className="text-blue-600">daily storm</span>?<br />
            We'll calm the chaos
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Turn incomplete drawings and impossible deadlines into professional proposals in minutes.
            Built by Sales Engineers who understand your Tuesday morning chaos.
          </p>

          {/* Storm Animation */}
          <div className="mb-12 bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {isCalm ? "With Design-Rite: Tuesday Morning Calm ✨" : "Tuesday Morning Storm ⛈️"}
              </h3>
              <p className="text-gray-600">
                {isCalm ? "Professional proposals ready in minutes" : "The chaos every Sales Engineer knows"}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 min-h-[120px] flex items-center justify-center">
              {isCalm ? (
                <div className="text-center">
                  <div className="text-4xl mb-4">🏆</div>
                  <p className="text-lg font-medium text-green-600">
                    Complete security proposal with BOMs, compliance, and implementation timeline
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    5 minutes. Professional. Accurate. Weekend? Still yours.
                  </p>
                </div>
              ) : (
                <div className="text-center">
                  <div className="text-4xl mb-4">
                    {stormItems[activeStormItem].icon}
                  </div>
                  <p className={`text-lg font-medium ${
                    stormItems[activeStormItem].type === 'problem' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {stormItems[activeStormItem].text}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={handleTryPlatformClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🚀 Try Security Estimate
            </button>
            <Link
              href="/waitlist"
              className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200"
            >
              📝 Join Waitlist
            </Link>
          </div>
        </div>
      </div>

      {/* Problem/Solution Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Problems */}
            <div className="bg-red-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-red-800 mb-6">
                ⛈️ Tuesday Morning Problems
              </h3>
              <ul className="space-y-4 text-red-700">
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">📞</span>
                  Incomplete drawings with missing device counts
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">📝</span>
                  Endless BOM revisions and SOW changes
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">⏰</span>
                  "Need it by EOD" impossible deadlines
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">🧩</span>
                  Manual compliance requirement gathering
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-3">💸</span>
                  Pricing that's outdated before you send it
                </li>
              </ul>
            </div>

            {/* Solutions */}
            <div className="bg-blue-50 rounded-xl p-8">
              <h3 className="text-2xl font-bold text-blue-800 mb-6">
                ✨ With Design-Rite
              </h3>
              <ul className="space-y-4 text-blue-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">🚀</span>
                  AI analyzes CAD files and fills missing device counts
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">⚡</span>
                  Real-time pricing from 3,000+ security products
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">🎯</span>
                  Smart compliance templates (CJIS, FERPA, HIPAA)
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">📊</span>
                  Professional proposals in 5 minutes, not 5 hours
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-3">🏆</span>
                  Get your weekends back, keep your sanity
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Solutions Grid */}
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Built by Sales Engineers, for Sales Engineers
            </h2>
            <p className="text-xl text-gray-600">
              We know your pain because we've lived it. Here's how we're solving it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {solutions.map((solution, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-200">
                <div className="text-4xl mb-4">{solution.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{solution.title}</h3>
                <p className="text-gray-600 mb-4">{solution.description}</p>
                <Link
                  href={solution.href}
                  className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                >
                  Learn more →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Real Results from Real Sales Engineers
            </h2>
            <p className="text-xl text-gray-600">
              See how Design-Rite is transforming security sales teams
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-blue-50 rounded-xl p-8">
                <div className="text-blue-600 text-6xl mb-4">"</div>
                <p className="text-gray-700 text-lg mb-6 leading-relaxed">
                  {testimonial.quote}
                </p>
                <div>
                  <p className="font-bold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-600">{testimonial.title}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Calm Your Tuesday Morning Storm?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join hundreds of Sales Engineers who've reclaimed their weekends
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={handleTryPlatformClick}
              className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              🚀 Start Free Trial
            </button>
            <Link
              href="/contact"
              className="border-2 border-white hover:bg-white hover:text-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200"
            >
              💬 Talk to Sales
            </Link>
          </div>

          <p className="text-sm mt-6 opacity-75">
            Calming the chaos for Sales Engineers everywhere
          </p>
        </div>
      </div>

      {/* Email Gate Modal */}
      <EmailGate
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onSuccess={handleEmailGateSuccess}
      />
    </div>
  )
}