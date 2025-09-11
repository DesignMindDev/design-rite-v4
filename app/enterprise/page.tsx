"use client"

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import UnifiedNavigation from '../components/UnifiedNavigation'

export default function EnterprisePage() {
  const router = useRouter()

  const redirectToApp = () => {
    router.push('/app')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      <UnifiedNavigation activeSection="solutions" />

      {/* Main Content */}
      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Enterprise Security Solutions
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            AI-Powered Security for Enterprise Teams
          </h1>
          <p className="text-xl text-gray-400 leading-relaxed">
            Empower your internal security teams with enterprise-grade AI tools for multi-site facility management, 
            vendor evaluation, and strategic security planning.
          </p>
        </section>

        {/* Enterprise Benefits */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold mb-4">Multi-Site Management</h3>
              <p className="text-gray-400">Standardize security assessments across all corporate locations. Maintain consistent security posture and compliance requirements.</p>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-4">Vendor Evaluation</h3>
              <p className="text-gray-400">Compare integrator proposals objectively. AI-powered analysis helps you make data-driven vendor selection decisions.</p>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-4">Budget Optimization</h3>
              <p className="text-gray-400">ROI analysis and budget planning tools help justify security investments and optimize spending across locations.</p>
            </div>
          </div>
        </section>

        {/* Enterprise Features */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Built for Enterprise Scale</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🌐</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Centralized Dashboard</h3>
                  <p className="text-gray-400">Monitor security posture across all facilities from a single dashboard. Track compliance, incidents, and improvement opportunities.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">👥</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
                  <p className="text-gray-400">Role-based access controls, approval workflows, and collaborative planning tools for distributed security teams.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">📋</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Compliance Reporting</h3>
                  <p className="text-gray-400">Automated compliance documentation for corporate audits, insurance requirements, and regulatory standards.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center text-xl flex-shrink-0">🔗</div>
                <div>
                  <h3 className="text-xl font-bold mb-2">System Integration</h3>
                  <p className="text-gray-400">API connectivity with existing enterprise systems, HRMS, facility management, and security platforms.</p>
                </div>
              </div>
            </div>
            <div className="bg-gray-800/80 backdrop-blur-xl border border-purple-600/30 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Enterprise Dashboard Overview</h3>
              <div className="space-y-4">
                <div className="bg-green-600/20 p-4 rounded-lg border border-green-600/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-green-300">Headquarters - Chicago</span>
                    <span className="text-green-300 text-sm">98% Compliant</span>
                  </div>
                  <div className="bg-green-600 h-2 rounded-full w-full"></div>
                </div>
                <div className="bg-yellow-600/20 p-4 rounded-lg border border-yellow-600/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-yellow-300">Regional Office - Dallas</span>
                    <span className="text-yellow-300 text-sm">85% Compliant</span>
                  </div>
                  <div className="bg-yellow-600 h-2 rounded-full w-4/5"></div>
                </div>
                <div className="bg-blue-600/20 p-4 rounded-lg border border-blue-600/30">
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
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Common Enterprise Use Cases</h2>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <h3 className="text-xl font-bold mb-4">🔍 Multi-Location Standardization</h3>
              <p className="text-gray-400 mb-4">
                Ensure consistent security standards across all corporate facilities. AI-powered assessments help maintain 
                uniform security posture regardless of location size or complexity.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Standardized assessment protocols</li>
                <li>• Consistent equipment specifications</li>
                <li>• Unified compliance documentation</li>
              </ul>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <h3 className="text-xl font-bold mb-4">📄 Vendor Proposal Analysis</h3>
              <p className="text-gray-400 mb-4">
                Objectively evaluate security integrator proposals using AI analysis. Compare costs, coverage, 
                and compliance across multiple vendors.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Automated proposal comparison</li>
                <li>• Cost-benefit analysis</li>
                <li>• Compliance gap identification</li>
              </ul>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <h3 className="text-xl font-bold mb-4">📊 Budget Planning & ROI</h3>
              <p className="text-gray-400 mb-4">
                Strategic security investment planning with ROI calculations. Prioritize security improvements 
                based on risk assessment and budget constraints.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Multi-year security roadmaps</li>
                <li>• Risk-based prioritization</li>
                <li>• Executive reporting dashboards</li>
              </ul>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <h3 className="text-xl font-bold mb-4">🛡️ Incident Response Planning</h3>
              <p className="text-gray-400 mb-4">
                AI-assisted emergency response planning based on facility layout and threat analysis. 
                Develop comprehensive incident response protocols.
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>• Evacuation route optimization</li>
                <li>• Emergency communication plans</li>
                <li>• First responder coordination</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Pricing for Enterprise */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-3xl p-12 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Enterprise Pricing</h2>
            <p className="text-gray-400 mb-10">Custom solutions designed for your organization's specific needs</p>
            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <div className="bg-purple-600/20 p-6 rounded-xl border border-purple-600/30">
                <h3 className="text-xl font-bold mb-4">Enterprise Standard</h3>
                <div className="text-3xl font-black text-purple-300 mb-2">$7,188/year</div>
                <div className="text-gray-400 mb-4">Up to 10 locations</div>
                <ul className="text-left space-y-2 text-gray-300">
                  <li>• Multi-site dashboard</li>
                  <li>• Team collaboration tools</li>
                  <li>• Compliance reporting</li>
                  <li>• API integrations</li>
                  <li>• Priority support</li>
                </ul>
              </div>
              <div className="bg-yellow-600/20 p-6 rounded-xl border-2 border-yellow-500/50">
                <div className="text-yellow-400 text-sm font-bold mb-2">MOST POPULAR</div>
                <h3 className="text-xl font-bold mb-4">Enterprise Plus</h3>
                <div className="text-3xl font-black text-yellow-300 mb-2">Custom</div>
                <div className="text-gray-400 mb-4">Unlimited locations</div>
                <ul className="text-left space-y-2 text-gray-300">
                  <li>• Everything in Standard</li>
                  <li>• Dedicated customer success</li>
                  <li>• Custom integrations</li>
                  <li>• Advanced analytics</li>
                  <li>• White-label options</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={redirectToApp} 
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all"
              >
                Start Enterprise Trial
              </button>
              <Link 
                href="/contact" 
                className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all"
              >
                Contact Enterprise Sales
              </Link>
            </div>
          </div>
        </section>

        {/* Security & Compliance */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Enterprise Security & Compliance</h2>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-4">SOC 2 Type II</h3>
              <p className="text-gray-400">Comprehensive security controls and annual third-party audits ensure enterprise-grade data protection.</p>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-4">SSO Integration</h3>
              <p className="text-gray-400">SAML 2.0 and OAuth 2.0 support for seamless integration with your existing identity management systems.</p>
            </div>
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-xl font-bold mb-4">Private Cloud</h3>
              <p className="text-gray-400">Dedicated cloud infrastructure and VPC deployment options for maximum security and performance.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600/10 to-purple-700/10 backdrop-blur-xl border border-purple-600/20 rounded-3xl p-12">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">Ready to Scale Your Security Operations?</h2>
            <p className="text-xl text-gray-400 mb-10">
              Join enterprise organizations who are transforming their security operations with AI-powered design intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={redirectToApp} 
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all"
              >
                Start Enterprise Trial
              </button>
              <Link 
                href="/contact" 
                className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all"
              >
                Schedule Enterprise Demo
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0A0A0A] border-t border-purple-600/20 py-12">
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
                Transforming security system design with AI-powered intelligence. Professional assessments, 
                automated proposals, and comprehensive documentation for the modern security industry.
              </p>
            </div>
            <div>
              <h3 className="text-white font-bold mb-4">Platform</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-purple-600 text-sm transition-colors">AI Assessment</button></li>
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
              <Link href="mailto:hello@design-rite.com" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">📧</Link>
              <Link href="/linkedin" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">💼</Link>
              <Link href="/twitter" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">🐦</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
