"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function EnterprisePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const redirectToApp = () => {
    window.location.href = '/app'
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
            <button onClick={redirectToApp} className="bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-all">
              Try Platform
            </button>
          </div>

          <button className="lg:hidden text-white text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto">
          <div className="text-purple-300 text-base font-semibold uppercase tracking-wider mb-4">
            Enterprise Security Solutions
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
            AI-Powered Security for Enterprise Teams
          </h1>
          <p className="text-xl text-white/80 leading-relaxed">
            Empower your internal security teams with enterprise-grade AI tools for multi-site facility management, 
            vendor evaluation, and strategic security planning.
          </p>
        </section>

        {/* Enterprise Benefits */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold mb-4">Multi-Site Management</h3>
              <p className="text-white/80">Standardize security assessments across all corporate locations. Maintain consistent security posture and compliance requirements.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-4">Vendor Evaluation</h3>
              <p className="text-white/80">Compare integrator proposals objectively. AI-powered analysis helps you make data-driven vendor selection decisions.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-4">Budget Optimization</h3>
              <p className="text-white/80">ROI analysis and budget planning tools help justify security investments and optimize spending across locations.</p>
            </div>
          </div>
        </section>

        {/* Enterprise Features */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16">Built for Enterprise Scale</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🌐</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Centralized Dashboard</h3>
                  <p className="text-white/80">Monitor security posture across all facilities from a single dashboard. Track compliance, incidents, and improvement opportunities.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">👥</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
                  <p className="text-white/80">Role-based access controls, approval workflows, and collaborative planning tools for distributed security teams.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">📋</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Compliance Reporting</h3>
                  <p className="text-white/80">Automated compliance documentation for corporate audits, insurance requirements, and regulatory standards.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🔗</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">System Integration</h3>
                  <p className="text-white/80">API connectivity with existing enterprise systems, HRMS, facility management, and security platforms.</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Enterprise Dashboard Overview</h3>
              <div className="space-y-4">
                <div className="bg-green-600/20 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-green-300">Headquarters - Chicago</span>
                    <span className="text-green-300 text-sm">98% Compliant</span>
                  </div>
                  <div className="bg-green-600 h-2 rounded-full w-full"></div>
                </div>
                <div className="bg-yellow-600/20 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-yellow-300">Regional Office - Dallas</span>
                    <span className="text-yellow-300 text-sm">85% Compliant</span>
                  </div>
                  <div className="bg-yellow-600 h-2 rounded-full w-4/5"></div>
                </div>
                <div className="bg-blue-600/20 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-blue-300">Manufacturing - Phoenix</span>
                    <span className="text-blue-300 text-sm">Assessment Pending</span>
                  </div>
                  <div className="bg-blue-600 h-2 rounded-full w-1/3"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16">Common Enterprise Use Cases</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold mb-4">📍 Multi-Location Standardization</h3>
              <p className="text-white/80 mb-4">
                Ensure consistent security standards across all corporate facilities. AI-powered assessments help maintain 
                uniform security posture regardless of location size or complexity.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>• Standardized assessment protocols</li>
                <li>• Consistent equipment specifications</li>
                <li>• Unified compliance documentation</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold mb-4">🔍 Vendor Proposal Analysis</h3>
              <p className="text-white/80 mb-4">
                Objectively evaluate security integrator proposals using AI analysis. Compare costs, coverage, 
                and compliance across multiple vendors.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>• Automated proposal comparison</li>
                <li>• Cost-benefit analysis</li>
                <li>• Compliance gap identification</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold mb-4">📊 Budget Planning & ROI</h3>
              <p className="text-white/80 mb-4">
                Strategic security investment planning with ROI calculations. Prioritize security improvements 
                based on risk assessment and budget constraints.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>• Multi-year security roadmaps</li>
                <li>• Risk-based prioritization</li>
                <li>• Executive reporting dashboards</li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h3 className="text-xl font-bold mb-4">🛡️ Incident Response Planning</h3>
              <p className="text-white/80 mb-4">
                AI-assisted emergency response planning based on facility layout and threat analysis. 
                Develop comprehensive incident response protocols.
              </p>
              <ul className="space-y-2 text-white/70">
                <li>• Evacuation route optimization</li>
                <li>• Emergency communication plans</li>
                <li>• First responder coordination</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing for Enterprise */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20 text-center">
            <h2 className="text-4xl font-bold mb-6">Enterprise Pricing</h2>
            <p className="text-white/80 mb-10">Custom solutions designed for your organization's specific needs</p>
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-purple-600/20 p-6 rounded-xl">
                <h3 className="text-xl font-bold mb-4">Enterprise Standard</h3>
                <div className="text-3xl font-black text-purple-300 mb-2">$7,188/year</div>
                <div className="text-white/70 mb-4">Up to 10 locations</div>
                <ul className="text-left space-y-2 text-white/80">
                  <li>• Multi-site dashboard</li>
                  <li>• Team collaboration tools</li>
                  <li>• Compliance reporting</li>
                  <li>• API integrations</li>
                  <li>• Priority support</li>
                </ul>
              </div>
              <div className="bg-gold-600/20 p-6 rounded-xl border-2 border-yellow-500/50">
                <div className="text-yellow-400 text-sm font-bold mb-2">MOST POPULAR</div>
                <h3 className="text-xl font-bold mb-4">Enterprise Plus</h3>
                <div className="text-3xl font-black text-yellow-300 mb-2">Custom</div>
                <div className="text-white/70 mb-4">Unlimited locations</div>
                <ul className="text-left space-y-2 text-white/80">
                  <li>• Everything in Standard</li>
                  <li>• Dedicated customer success</li>
                  <li>• Custom integrations</li>
                  <li>• Advanced analytics</li>
                  <li>• White-label options</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={redirectToApp} className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all">
                Start Enterprise Trial
              </button>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/10 transition-all">
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        </section>

        {/* Security & Compliance */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16">Enterprise Security & Compliance</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-4">SOC 2 Type II</h3>
              <p className="text-white/80">Comprehensive security controls and annual third-party audits ensure enterprise-grade data protection.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-4">SSO Integration</h3>
              <p className="text-white/80">SAML 2.0 and OAuth 2.0 support for seamless integration with your existing identity management systems.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 text-center">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold mb-4">Private Cloud</h3>
              <p className="text-white/80">Dedicated cloud infrastructure and VPC deployment options for maximum security and performance.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-12 border border-white/20">
            <h2 className="text-4xl font-bold mb-6">Ready to Scale Your Security Operations?</h2>
            <p className="text-xl text-white/80 mb-10">
              Join enterprise organizations who are transforming their security operations with AI-powered design intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={redirectToApp} className="bg-white text-purple-600 px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-100 transition-all">
                Start Enterprise Trial
              </button>
              <Link href="/contact" className="border-2 border-white text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white/10 transition-all">
                Schedule Enterprise Demo
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}