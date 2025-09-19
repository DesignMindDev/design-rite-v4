"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function AIPoweredAnalystPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white py-2.5 text-center text-sm font-semibold relative z-[1001]">
        <div className="max-w-6xl mx-auto px-8 flex items-center justify-center gap-4">
          <span className="text-base">🤖</span>
          <span className="flex-1 text-center">
            AI-Powered Security Analysis - Transform complex assessments into actionable intelligence
          </span>
          <Link 
            href="/subscribe"
            className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-white/30 transition-all border border-white/30"
          >
            Get Early Access
          </Link>
        </div>
      </div>

      {/* Header */}
      <header className="bg-black/10 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50 py-5">
        <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-bold text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-black text-sm">
              DR
            </div>
            Design-Rite
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-8">
            <li><Link href="/integrators" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Security Integrators</Link></li>
            <li><Link href="/enterprise" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Enterprise</Link></li>
            <li><Link href="/education" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Education</Link></li>
            <li><Link href="/solutions" className="text-white bg-white/10 px-4 py-2 rounded-lg font-medium">AI Solutions</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Contact</Link></li>
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="text-white border-2 border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Sign In
            </Link>
            <button 
              onClick={() => router.push('/app')}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
            >
              Try AI Demo
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
              <Link href="/integrators" className="block text-white/80 hover:text-white transition-colors py-2">Security Integrators</Link>
              <Link href="/enterprise" className="block text-white/80 hover:text-white transition-colors py-2">Enterprise</Link>
              <Link href="/education" className="block text-white/80 hover:text-white transition-colors py-2">Education</Link>
              <Link href="/solutions" className="block text-white bg-white/10 px-4 py-2 rounded-lg">AI Solutions</Link>
              <Link href="/contact" className="block text-white/80 hover:text-white transition-colors py-2">Contact</Link>
              <div className="pt-4 border-t border-white/10 space-y-3">
                <Link href="/login" className="block text-center text-white border-2 border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
                  Sign In
                </Link>
                <button 
                  onClick={() => router.push('/app')}
                  className="block w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all"
                >
                  Try AI Demo
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto px-8 pt-20 pb-16">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600/20 to-purple-700/20 border border-purple-500/30 rounded-full px-6 py-3 text-sm font-medium mb-8">
              <span className="text-2xl">🧠</span>
              <span>Advanced AI Security Intelligence</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-8 leading-tight">
              AI-Powered <span className="bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">Security Analyst</span>
            </h1>
            
            <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-4xl mx-auto leading-relaxed">
              Transform complex security data into actionable intelligence. Our AI analyst processes vast amounts of information to deliver expert-level insights, threat assessments, and strategic recommendations in real-time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/app')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Experience AI Analysis
              </button>
              <Link 
                href="/watch-demo"
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Watch Demo Video
              </Link>
            </div>
          </div>
        </section>

        {/* AI Capabilities */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">AI Analyst Capabilities</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <div className="text-4xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold mb-4">Threat Assessment</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Advanced machine learning algorithms analyze facility vulnerabilities, threat landscapes, and risk factors to provide comprehensive security assessments with precision accuracy.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <div className="text-4xl mb-6">📊</div>
              <h3 className="text-2xl font-bold mb-4">Data Intelligence</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Process and correlate massive datasets from industry databases, threat intelligence feeds, and compliance frameworks to deliver insights impossible with manual analysis.
              </p>
            </div>
            <div className="bg-gradient-to-br from-purple-600/10 to-purple-700/10 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/30">
              <div className="text-4xl mb-6">⚡</div>
              <h3 className="text-2xl font-bold mb-4">Real-Time Analysis</h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Generate comprehensive security analyses in minutes, not days. Our AI processes complex facility data and delivers actionable recommendations instantly.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">How Our AI Analyst Works</h2>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Data Ingestion</h3>
                  <p className="text-white/80">AI processes facility layouts, existing security infrastructure, compliance requirements, and threat intelligence data.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Pattern Analysis</h3>
                  <p className="text-white/80">Advanced algorithms identify security gaps, vulnerability patterns, and optimization opportunities across all facility areas.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Expert Recommendations</h3>
                  <p className="text-white/80">Generate detailed security recommendations with implementation priorities, cost analysis, and ROI projections.</p>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-3">Continuous Learning</h3>
                  <p className="text-white/80">AI continuously updates its knowledge base with new threat intelligence and industry best practices for evolving analysis.</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 rounded-2xl p-8 border border-purple-500/30 text-center">
              <div className="text-6xl mb-6">🧠</div>
              <h3 className="text-2xl font-bold mb-4">AI Processing Power</h3>
              <div className="space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Data Points Analyzed:</span>
                  <span className="text-purple-400 font-bold">10,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Analysis Time:</span>
                  <span className="text-purple-400 font-bold">&lt; 2 minutes</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Accuracy Rate:</span>
                  <span className="text-purple-400 font-bold">99.7%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/80">Threat Databases:</span>
                  <span className="text-purple-400 font-bold">500+</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="max-w-6xl mx-auto px-8 py-20">
          <h2 className="text-4xl font-bold text-center mb-16">Why Choose AI-Powered Analysis?</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl">📈</div>
                <h3 className="text-xl font-bold">Increased Accuracy</h3>
              </div>
              <p className="text-white/80">AI analysis eliminates human error and bias, providing consistently accurate security assessments based on comprehensive data analysis.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl">⚡</div>
                <h3 className="text-xl font-bold">10x Faster Results</h3>
              </div>
              <p className="text-white/80">Complete comprehensive security analyses in minutes instead of days, dramatically accelerating project timelines and client delivery.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl">💰</div>
                <h3 className="text-xl font-bold">Cost Optimization</h3>
              </div>
              <p className="text-white/80">AI identifies the most cost-effective security solutions while maximizing coverage, helping optimize budgets and improve ROI.</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-3xl">🔄</div>
                <h3 className="text-xl font-bold">Scalable Intelligence</h3>
              </div>
              <p className="text-white/80">Handle multiple projects simultaneously with consistent quality, scaling your analysis capabilities without additional staffing.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto px-8 py-20">
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-2xl p-12 text-center border border-purple-500/30">
            <div className="text-5xl mb-6">🚀</div>
            <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Security Analysis?</h2>
            <p className="text-xl text-white/80 mb-8">
              Experience the power of AI-driven security intelligence. See how our AI analyst can revolutionize your approach to security design and threat assessment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => router.push('/app')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-purple-800 transition-all transform hover:scale-[1.02] shadow-lg"
              >
                Try AI Analyst Demo
              </button>
              <Link 
                href="/subscribe"
                className="bg-white/10 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                Get Early Access
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-purple-600/20 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-8 py-12">
          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            <div className="lg:col-span-2">
              <Link href="/" className="flex items-center gap-3 text-white font-bold text-2xl mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-white font-black text-sm">
                  DR
                </div>
                Design-Rite
              </Link>
              <p className="text-white/70 text-lg leading-relaxed max-w-md">
                Revolutionary AI-powered platform transforming security system design through intelligent automation and expert-level analysis.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">AI Solutions</h4>
              <ul className="space-y-3">
                <li><Link href="/ai-powered-analyst" className="text-purple-400 hover:text-purple-300 transition-colors">AI Security Analyst</Link></li>
                <li><Link href="/compliance-analyst" className="text-white/70 hover:text-white transition-colors">Compliance Analyst</Link></li>
                <li><Link href="/project-management" className="text-white/70 hover:text-white transition-colors">Project Management</Link></li>
                <li><Link href="/solutions" className="text-white/70 hover:text-white transition-colors">All Solutions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">Company</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-white/70 hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/contact" className="text-white/70 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/privacy" className="text-white/70 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-white/70 hover:text-white transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-white/60">
              © 2025 Design-Rite™. All rights reserved. | Revolutionary AI-Powered Security Solutions
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}


