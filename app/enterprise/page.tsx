// File: app/enterprise/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function EnterpriseSecurityPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const redirectToApp = () => {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      window.location.href = '/login-trial.html'
    } else {
      window.location.href = '/login-trial.html'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-800">
      {/* Top Contact Bar */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 py-2">
        <div className="max-w-6xl mx-auto px-8 flex justify-between items-center text-sm">
          <div className="text-white/80">
            🏢 <strong>Enterprise Security Teams:</strong> Streamline multi-site security management
          </div>
          <div className="flex gap-6">
            <Link href="/support" className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2">
              <span>❓</span> Help Center
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-purple-600 transition-colors flex items-center gap-2">
              <span>📧</span> Contact Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 left-0 right-0 z-[1000] bg-black/95 backdrop-blur-xl border-b border-purple-600/20 py-4">
        <nav className="max-w-6xl mx-auto px-8 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-black text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg">
              DR
            </div>
            Design-Rite
          </Link>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center gap-10">
            <li className="relative group">
              <Link href="#platform" className="text-gray-300 hover:text-purple-600 font-medium transition-all relative py-2 block text-sm after:absolute after:bottom-[-5px] after:left-0 after:w-0 after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700 after:transition-all hover:after:w-full">
                Platform
              </Link>
            </li>
            <li className="relative group">
              <Link href="#solutions" className="text-purple-600 font-medium transition-all relative py-2 block text-sm after:absolute after:bottom-[-5px] after:left-0 after:w-full after:h-0.5 after:bg-gradient-to-r after:from-purple-600 after:to-purple-700">
                Solutions
              </Link>
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
                <Link href="/enterprise" className="flex items-center gap-4 p-3 rounded-lg text-purple-600 bg-purple-600/10 transition-all hover:translate-x-1 mb-2">
                  <div className="w-10 h-10 bg-purple-600/30 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
                    🏢
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-purple-300 mb-1">Enterprise Security</div>
                    <div className="text-xs text-purple-400 leading-tight">In-house team solutions</div>
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
            <li>
              <Link href="/partners" className="text-gray-300 hover:text-purple-600 font-medium transition-all text-sm">
                Partners
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-300 hover:text-purple-600 font-medium transition-all text-sm">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-gray-300 hover:text-purple-600 font-medium transition-all text-sm">
                Contact
              </Link>
            </li>
          </ul>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
              Sign In
            </Link>
            <button 
              onClick={redirectToApp}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all btn-hover-lift"
            >
              Try Platform
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-white text-2xl p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            ☰
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-black/20 backdrop-blur-sm border-t border-white/10">
            <div className="px-6 py-4 space-y-4">
              <Link href="/integrators" className="block text-white/80 hover:text-white py-2">Security Integrators</Link>
              <Link href="/enterprise" className="block text-purple-600 font-medium py-2">Enterprise Security</Link>
              <Link href="/education" className="block text-white/80 hover:text-white py-2">Education & Healthcare</Link>
              <Link href="/consultants" className="block text-white/80 hover:text-white py-2">Security Consultants</Link>
              <div className="pt-4 border-t border-white/10">
                <Link href="/login" className="block text-white/80 hover:text-white py-2">Sign In</Link>
                <button onClick={redirectToApp} className="block w-full text-left bg-purple-600 text-white px-4 py-2 rounded-lg mt-2">
                  Try Platform
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Enterprise Security
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Empower Your In-House Security Teams
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed mb-8">
            Streamline facility assessments, vendor management, and security strategy development 
            across multiple locations with enterprise-grade AI tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={redirectToApp}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all btn-hover-lift text-lg"
            >
              🚀 Start Enterprise Trial
            </button>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all text-lg"
            >
              📞 Schedule Enterprise Demo
            </Link>
          </div>
        </section>

        {/* Enterprise Features Grid */}
        <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 max-w-6xl mx-auto">
          <div className="glass rounded-2xl p-8 text-center hover:-translate-y-2 transition-all">
            <div className="text-4xl mb-4">🏢</div>
            <h3 className="text-xl font-bold text-white mb-4">Multi-Site Management</h3>
            <p className="text-gray-300">
              Centrally manage security assessments across all your facilities with 
              unified reporting and standardized protocols.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 text-center hover:-translate-y-2 transition-all">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-white mb-4">Vendor Comparison</h3>
            <p className="text-gray-300">
              Evaluate and compare proposals from multiple security vendors with 
              AI-powered analysis and standardized scoring.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 text-center hover:-translate-y-2 transition-all">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-xl font-bold text-white mb-4">Compliance Reporting</h3>
            <p className="text-gray-300">
              Generate comprehensive compliance reports for regulatory requirements, 
              board presentations, and audit documentation.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 text-center hover:-translate-y-2 transition-all">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-white mb-4">Budget Planning</h3>
            <p className="text-gray-300">
              Plan security budgets with accurate cost projections, ROI analysis, 
              and multi-year financial planning tools.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 text-center hover:-translate-y-2 transition-all">
            <div className="text-4xl mb-4">👥</div>
            <h3 className="text-xl font-bold text-white mb-4">Team Collaboration</h3>
            <p className="text-gray-300">
              Enable seamless collaboration between security teams, facilities management, 
              and executive leadership with role-based access.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 text-center hover:-translate-y-2 transition-all">
            <div className="text-4xl mb-4">🔐</div>
            <h3 className="text-xl font-bold text-white mb-4">Enterprise Security</h3>
            <p className="text-gray-300">
              SOC 2 compliant platform with enterprise-grade security, data encryption, 
              and dedicated support for large organizations.
            </p>
          </div>
        </section>

        {/* Enterprise Use Cases */}
        <section className="mb-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Perfect for Enterprise Security Teams
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass rounded-2xl p-8">
              <div className="text-3xl mb-4">🏪</div>
              <h3 className="text-2xl font-bold text-white mb-4">Retail Chains</h3>
              <p className="text-gray-300 mb-4">
                Standardize security assessments across hundreds of store locations. 
                Compare vendor proposals, manage installation schedules, and ensure 
                consistent security standards company-wide.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• Store-by-store threat assessments</li>
                <li>• Standardized security protocols</li>
                <li>• Regional vendor management</li>
                <li>• Loss prevention analytics</li>
              </ul>
            </div>

            <div className="glass rounded-2xl p-8">
              <div className="text-3xl mb-4">🏭</div>
              <h3 className="text-2xl font-bold text-white mb-4">Manufacturing</h3>
              <p className="text-gray-300 mb-4">
                Protect manufacturing facilities, warehouses, and distribution centers 
                with comprehensive security planning tailored to industrial environments.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• Industrial facility assessments</li>
                <li>• Critical asset protection</li>
                <li>• Supply chain security</li>
                <li>• Regulatory compliance tracking</li>
              </ul>
            </div>

            <div className="glass rounded-2xl p-8">
              <div className="text-3xl mb-4">🏦</div>
              <h3 className="text-2xl font-bold text-white mb-4">Financial Services</h3>
              <p className="text-gray-300 mb-4">
                Meet strict regulatory requirements for financial institutions with 
                comprehensive security documentation and audit-ready reporting.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• Bank branch security assessments</li>
                <li>• Regulatory compliance reporting</li>
                <li>• Risk assessment documentation</li>
                <li>• Audit preparation tools</li>
              </ul>
            </div>

            <div className="glass rounded-2xl p-8">
              <div className="text-3xl mb-4">🏢</div>
              <h3 className="text-2xl font-bold text-white mb-4">Corporate Offices</h3>
              <p className="text-gray-300 mb-4">
                Secure corporate headquarters, regional offices, and remote facilities 
                with centralized security management and employee safety protocols.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• Multi-building campus security</li>
                <li>• Employee access control</li>
                <li>• Visitor management systems</li>
                <li>• Emergency response planning</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Enterprise ROI */}
        <section className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 mb-20 max-w-4xl mx-auto border border-white/20">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            Enterprise ROI Calculator
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">70%</div>
              <div className="text-white font-bold mb-2">Time Savings</div>
              <div className="text-gray-300 text-sm">
                Reduce assessment time from weeks to days across multiple facilities
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">45%</div>
              <div className="text-white font-bold mb-2">Cost Reduction</div>
              <div className="text-gray-300 text-sm">
                Better vendor negotiations and standardized pricing across locations
              </div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-400 mb-2">3x</div>
              <div className="text-white font-bold mb-2">Faster Deployment</div>
              <div className="text-gray-300 text-sm">
                Accelerated security rollouts with streamlined vendor management
              </div>
            </div>
          </div>
          <div className="text-center mt-8">
            <div className="text-2xl font-bold text-white mb-4">
              💡 Estimated Annual Savings: <span className="text-green-400">$500,000+</span>
            </div>
            <p className="text-gray-300 mb-6">
              Based on 50+ facility locations with standardized security processes
            </p>
            <button 
              onClick={redirectToApp}
              className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-bold transition-all btn-hover-lift"
            >
              Calculate Your Enterprise Savings
            </button>
          </div>
        </section>

        {/* Enterprise Features Comparison */}
        <section className="mb-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Enterprise vs. Standard Features
          </h2>
          <div className="glass rounded-2xl p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-green-500">✓</span> Enterprise Exclusive Features
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Unlimited facility assessments and users</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Advanced vendor comparison and scoring tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Custom compliance reporting and templates</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Multi-level approval workflows</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span>Dedicated customer success manager</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span>API access for enterprise integrations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-1">•</span>
                    <span>SOC 2 compliance and data governance</span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="text-purple-500">⚡</span> All Standard Features Included
                </h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-start gap-3">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>AI-powered facility assessments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Automated proposal generation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Professional reporting and documentation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Equipment recommendations and BOMs</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Project management tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>Client communication portal</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-purple-500 mt-1">•</span>
                    <span>24/7 technical support</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-20 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What Enterprise Security Teams Are Saying
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 mb-4">
                "Design-Rite helped us standardize security across 200+ retail locations. 
                The vendor comparison tool alone saved us $2M in our last procurement cycle."
              </p>
              <div className="text-white font-bold">- Jennifer Walsh, VP Security</div>
              <div className="text-gray-400 text-sm">Fortune 500 Retail Chain</div>
            </div>

            <div className="glass rounded-2xl p-8">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 mb-4">
                "The compliance reporting features are exceptional. We passed our regulatory audit 
                with flying colors thanks to Design-Rite's documentation."
              </p>
              <div className="text-white font-bold">- Marcus Thompson, CISO</div>
              <div className="text-gray-400 text-sm">Regional Banking Group</div>
            </div>

            <div className="glass rounded-2xl p-8">
              <div className="text-yellow-400 text-2xl mb-4">⭐⭐⭐⭐⭐</div>
              <p className="text-gray-300 mb-4">
                "Managing security across our manufacturing facilities has never been easier. 
                The ROI was clear within the first quarter."
              </p>
              <div className="text-white font-bold">- Amanda Rodriguez, Director of Security</div>
              <div className="text-gray-400 text-sm">Global Manufacturing Corp</div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Scale Your Security Operations?
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Join enterprise security teams who have transformed their operations with Design-Rite's AI platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={redirectToApp}
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition-all btn-hover-lift text-lg"
            >
              🚀 Start Enterprise Trial
            </button>
            <Link 
              href="/contact" 
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold hover:bg-white hover:text-purple-600 transition-all text-lg"
            >
              📞 Schedule Enterprise Demo
            </Link>
          </div>
          <p className="text-gray-400 text-sm mt-4">
            🔒 Enterprise trials include dedicated onboarding and technical support
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-purple-600/20 py-12 mt-20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <Link href="/" className="flex items-center gap-3 text-white font-black text-xl mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-sm">
                  DR
                </div>
                Design-Rite
              </Link>
              <p className="text-gray-400 text-sm">
                Enterprise-grade security assessment platform for multi-site organizations and in-house security teams.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-purple-600 text-sm transition-colors">AI Assessment</button></li>
                <li><Link href="/vendor-comparison" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Vendor Comparison</Link></li>
                <li><Link href="/compliance" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Compliance Reporting</Link></li>
                <li><Link href="/api" className="text-gray-400 hover:text-purple-600 text-sm transition-colors">Enterprise API</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Solutions</h3