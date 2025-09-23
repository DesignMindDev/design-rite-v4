"use client"

import { useState } from 'react'
import Link from 'next/link'

export default function APIAccessPage() {
  const [selectedTab, setSelectedTab] = useState('overview')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white">
      {/* Header */}
      <header className="bg-black/10 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50 py-5">
        <nav className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3 text-white font-bold text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-lg flex items-center justify-center font-black text-lg">
              DR
            </div>
            Design-Rite
          </Link>

          <ul className="hidden lg:flex items-center gap-8">
            <li><Link href="/platform" className="text-white bg-white/10 px-4 py-2 rounded-lg font-medium">Platform</Link></li>
            <li><Link href="/solutions" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Solutions</Link></li>
            <li><Link href="/partners" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Partners</Link></li>
            <li><Link href="/about" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">About</Link></li>
            <li><Link href="/contact" className="text-white/80 hover:text-white transition-colors px-4 py-2 rounded-lg">Contact</Link></li>
          </ul>

          <div className="hidden lg:flex items-center gap-3">
            <Link href="/login" className="text-white border-2 border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition-all">
              Sign In
            </Link>
            <Link href="/app" className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-xl transition-all">
              Try Platform
            </Link>
          </div>

          <button className="lg:hidden text-white text-2xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>☰</button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="text-center mb-20 max-w-4xl mx-auto">
          <div className="text-purple-300 text-base font-semibold uppercase tracking-wider mb-4">
            API Integration Platform
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6">
            Build with Our AI
          </h1>
          <p className="text-xl text-white/80 leading-relaxed mb-8">
            Integrate Design-Rite's powerful AI security assessment engine directly into your applications. 
            RESTful API, webhooks, and comprehensive SDKs for seamless integration.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="#get-started"
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-purple-600/40 transition-all"
            >
              Get API Key
            </a>
            <a 
              href="#documentation"
              className="bg-white/10 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 hover:border-white/50 transition-all"
            >
              View Documentation
            </a>
          </div>
        </section>

        {/* API Stats */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-black text-purple-400 mb-2">99.9%</div>
              <div className="text-white/80 text-sm">API Uptime</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-black text-purple-400 mb-2">&lt;200ms</div>
              <div className="text-white/80 text-sm">Average Response</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-black text-purple-400 mb-2">10M+</div>
              <div className="text-white/80 text-sm">API Calls/Month</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 text-center">
              <div className="text-3xl font-black text-purple-400 mb-2">24/7</div>
              <div className="text-white/80 text-sm">Support</div>
            </div>
          </div>
        </section>

        {/* API Features Tabs */}
        <section className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center mb-12">API Capabilities</h2>
          
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'assessment', label: 'AI Assessment' },
              { id: 'proposals', label: 'Proposals' },
              { id: 'webhooks', label: 'Webhooks' },
              { id: 'sdks', label: 'SDKs' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all ${
                  selectedTab === tab.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8">
            {selectedTab === 'overview' && (
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-2xl font-bold mb-4">RESTful API</h3>
                  <p className="text-white/80 mb-6">
                    Our REST API provides programmatic access to all Design-Rite features. 
                    Generate security assessments, create proposals, and manage projects through simple HTTP requests.
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white/80">OpenAPI 3.0 specification</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white/80">JSON request/response format</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white/80">API key authentication</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-white/80">Rate limiting & usage analytics</span>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-900/80 rounded-xl p-6">
                  <h4 className="text-lg font-bold mb-4 text-purple-400">Quick Example</h4>
                  <pre className="text-sm text-green-400 overflow-x-auto">
{`curl -X POST \\
  https://api.design-rite.com/v1/assessments \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "facility_type": "office_building",
    "square_footage": 15000,
    "floors": 3,
    "compliance_requirements": ["CJIS"]
  }'`}
                  </pre>
                </div>
              </div>
            )}

            {selectedTab === 'assessment' && (
              <div>
                <h3 className="text-2xl font-bold mb-6">AI Security Assessment API</h3>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Assessment Endpoints</h4>
                    <div className="space-y-4">
                      <div className="bg-gray-900/60 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">POST</span>
                          <span className="font-mono text-sm">/v1/assessments</span>
                        </div>
                        <p className="text-white/70 text-sm">Create a new security assessment</p>
                      </div>
                      <div className="bg-gray-900/60 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">GET</span>
                          <span className="font-mono text-sm">/v1/assessments/{id}</span>
                        </div>
                        <p className="text-white/70 text-sm">Retrieve assessment results</p>
                      </div>
                      <div className="bg-gray-900/60 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="bg-purple-600 text-white px-2 py-1 rounded text-xs font-bold">GET</span>
                          <span className="font-mono text-sm">/v1/assessments/{id}/report</span>
                        </div>
                        <p className="text-white/70 text-sm">Download PDF report</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Response Format</h4>
                    <div className="bg-gray-900/80 rounded-xl p-4">
                      <pre className="text-sm text-green-400 overflow-x-auto">
{`{
  "assessment_id": "ast_abc123",
  "status": "completed",
  "facility": {
    "type": "office_building",
    "square_footage": 15000,
    "floors": 3
  },
  "recommendations": {
    "cameras": 47,
    "access_points": 12,
    "sensors": 23
  },
  "compliance_score": 98.5,
  "estimated_cost": 187500
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'proposals' && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Proposal Generation API</h3>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Generate Professional Proposals</h4>
                    <p className="text-white/80 mb-6">
                      Convert assessment results into client-ready proposals with detailed BOMs, 
                      pricing, and implementation timelines.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-white/80">Automated bill of materials</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-white/80">Dynamic pricing calculations</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-white/80">Custom branding options</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span className="text-white/80">PDF and HTML formats</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900/80 rounded-xl p-4">
                    <h4 className="text-lg font-bold mb-4 text-purple-400">Proposal Request</h4>
                    <pre className="text-sm text-green-400 overflow-x-auto">
{`POST /v1/proposals
{
  "assessment_id": "ast_abc123",
  "client_info": {
    "name": "Acme Corp",
    "contact": "John Smith"
  },
  "branding": {
    "logo_url": "https://...",
    "primary_color": "#8B5CF6"
  },
  "pricing_tier": "premium"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'webhooks' && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Real-time Webhooks</h3>
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold mb-4">Event Notifications</h4>
                    <p className="text-white/80 mb-6">
                      Receive real-time notifications when assessments complete, proposals are generated, 
                      or any other important events occur in your account.
                    </p>
                    <div className="space-y-4">
                      <div className="bg-gray-900/60 rounded-lg p-4">
                        <h5 className="font-semibold text-purple-400 mb-2">assessment.completed</h5>
                        <p className="text-white/70 text-sm">Triggered when AI assessment finishes processing</p>
                      </div>
                      <div className="bg-gray-900/60 rounded-lg p-4">
                        <h5 className="font-semibold text-purple-400 mb-2">proposal.generated</h5>
                        <p className="text-white/70 text-sm">Triggered when proposal PDF is ready for download</p>
                      </div>
                      <div className="bg-gray-900/60 rounded-lg p-4">
                        <h5 className="font-semibold text-purple-400 mb-2">project.status_changed</h5>
                        <p className="text-white/70 text-sm">Triggered when project status updates</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-900/80 rounded-xl p-4">
                    <h4 className="text-lg font-bold mb-4 text-purple-400">Webhook Payload</h4>
                    <pre className="text-sm text-green-400 overflow-x-auto">
{`{
  "event": "assessment.completed",
  "timestamp": "2025-09-11T19:43:47Z",
  "data": {
    "assessment_id": "ast_abc123",
    "status": "completed",
    "completion_time": "2025-09-11T19:43:47Z",
    "download_url": "https://api.design-rite.com/v1/assessments/ast_abc123/download"
  },
  "signature": "sha256=..."
}`}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {selectedTab === 'sdks' && (
              <div>
                <h3 className="text-2xl font-bold mb-6">Official SDKs</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gray-900/60 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-yellow-600 rounded-lg flex items-center justify-center text-xl">⚡</div>
                      <h4 className="text-lg font-bold">JavaScript/TypeScript</h4>
                    </div>
                    <p className="text-white/70 text-sm mb-4">Node.js and browser support</p>
                    <pre className="text-xs text-green-400 mb-4">npm install @design-rite/sdk</pre>
                    <a href="#" className="text-purple-400 hover:text-purple-300 text-sm font-medium">View Documentation →</a>
                  </div>
                  
                  <div className="bg-gray-900/60 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-xl">🐍</div>
                      <h4 className="text-lg font-bold">Python</h4>
                    </div>
                    <p className="text-white/70 text-sm mb-4">Python 3.8+ compatible</p>
                    <pre className="text-xs text-green-400 mb-4">pip install design-rite</pre>
                    <a href="#" className="text-purple-400 hover:text-purple-300 text-sm font-medium">View Documentation →</a>
                  </div>
                  
                  <div className="bg-gray-900/60 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-xl">📱</div>
                      <h4 className="text-lg font-bold">Go</h4>
                    </div>
                    <p className="text-white/70 text-sm mb-4">Go 1.19+ compatible</p>
                    <pre className="text-xs text-green-400 mb-4">go get github.com/design-rite/go-sdk</pre>
                    <a href="#" className="text-purple-400 hover:text-purple-300 text-sm font-medium">View Documentation →</a>
                  </div>
                  
                  <div className="bg-gray-900/60 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-xl">💎</div>
                      <h4 className="text-lg font-bold">Ruby</h4>
                    </div>
                    <p className="text-white/70 text-sm mb-4">Ruby 2.7+ compatible</p>
                    <pre className="text-xs text-green-400 mb-4">gem install design_rite</pre>
                    <a href="#" className="text-purple-400 hover:text-purple-300 text-sm font-medium">View Documentation →</a>
                  </div>
                  
                  <div className="bg-gray-900/60 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-xl">☕</div>
                      <h4 className="text-lg font-bold">Java</h4>
                    </div>
                    <p className="text-white/70 text-sm mb-4">Java 11+ compatible</p>
                    <pre className="text-xs text-green-400 mb-4">Coming Soon</pre>
                    <a href="#" className="text-purple-400 hover:text-purple-300 text-sm font-medium">Join Waitlist →</a>
                  </div>
                  
                  <div className="bg-gray-900/60 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-blue-700 rounded-lg flex items-center justify-center text-xl">📘</div>
                      <h4 className="text-lg font-bold">C# / .NET</h4>
                    </div>
                    <p className="text-white/70 text-sm mb-4">.NET 6+ compatible</p>
                    <pre className="text-xs text-green-400 mb-4">Coming Soon</pre>
                    <a href="#" className="text-purple-400 hover:text-purple-300 text-sm font-medium">Join Waitlist →</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Pricing */}
        <section className="max-w-4xl mx-auto mb-20" id="get-started">
          <h2 className="text-4xl font-bold text-center mb-12">API Pricing</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-2">Developer</h3>
              <div className="text-3xl font-black text-purple-400 mb-4">Free</div>
              <p className="text-white/70 text-sm mb-6">Perfect for testing and development</p>
              <ul className="space-y-2 text-sm text-white/80 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  1,000 API calls/month
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  Basic assessments
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  Community support
                </li>
              </ul>
              <button className="w-full bg-purple-600/20 text-purple-300 border border-purple-600/30 py-3 rounded-lg font-semibold hover:bg-purple-600/30 transition-all">
                Get Started
              </button>
            </div>
            
            <div className="bg-gradient-to-br from-purple-600/20 to-purple-700/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-600/50 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Professional</h3>
              <div className="text-3xl font-black text-purple-400 mb-4">$299/mo</div>
              <p className="text-white/70 text-sm mb-6">For production applications</p>
              <ul className="space-y-2 text-sm text-white/80 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  50,000 API calls/month
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  All assessment features
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  Proposal generation
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  Priority support
                </li>
              </ul>
              <button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-lg font-semibold hover:shadow-xl transition-all">
                Start Free Trial
              </button>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold mb-2">Enterprise</h3>
              <div className="text-3xl font-black text-purple-400 mb-4">Custom</div>
              <p className="text-white/70 text-sm mb-6">For high-volume applications</p>
              <ul className="space-y-2 text-sm text-white/80 mb-6">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  Unlimited API calls
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  Custom AI models
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  Dedicated support
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                  SLA guarantees
                </li>
              </ul>
              <button className="w-full bg-white/10 border border-white/30 text-white py-3 rounded-lg font-semibold hover:bg-white/20 transition-all">
                Contact Sales
              </button>
            </div>
          </div>
        </section>

        {/* Documentation Links */}
        <section className="max-w-6xl mx-auto mb-20" id="documentation">
          <h2 className="text-4xl font-bold text-center mb-12">Developer Resources</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a href="#" className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-600/50 hover:bg-white/15 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-xl group-hover:bg-purple-600/30 transition-all">📖</div>
                <h3 className="text-lg font-bold">API Reference</h3>
              </div>
              <p className="text-white/70 text-sm">Complete API documentation with interactive examples and response schemas.</p>
            </a>
            
            <a href="#" className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-600/50 hover:bg-white/15 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-xl group-hover:bg-purple-600/30 transition-all">🚀</div>
                <h3 className="text-lg font-bold">Quick Start Guide</h3>
              </div>
              <p className="text-white/70 text-sm">Get up and running with your first API call in under 5 minutes.</p>
            </a>
            
            <a href="#" className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-600/50 hover:bg-white/15 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-xl group-hover:bg-purple-600/30 transition-all">🔧</div>
                <h3 className="text-lg font-bold">Code Examples</h3>
              </div>
              <p className="text-white/70 text-sm">Sample code and integration patterns for common use cases.</p>
            </a>
            
            <a href="#" className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-600/50 hover:bg-white/15 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-xl group-hover:bg-purple-600/30 transition-all">🔒</div>
                <h3 className="text-lg font-bold">Authentication</h3>
              </div>
              <p className="text-white/70 text-sm">Learn about API keys, rate limiting, and security best practices.</p>
            </a>
            
            <a href="#" className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-600/50 hover:bg-white/15 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-xl group-hover:bg-purple-600/30 transition-all">💬</div>
                <h3 className="text-lg font-bold">Developer Community</h3>
              </div>
              <p className="text-white/70 text-sm">Join our Discord community to connect with other developers.</p>
            </a>
            
            <a href="#" className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:border-purple-600/50 hover:bg-white/15 transition-all group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center text-xl group-hover:bg-purple-600/30 transition-all">📊</div>
                <h3 className="text-lg font-bold">Status Page</h3>
              </div>
              <p className="text-white/70 text-sm">Real-time API status, uptime monitoring, and incident reports.</p>
            </a>
          </div>
        </section>

        {/* CTA Section */}
        <section className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-600/20 to-purple-700/20 backdrop-blur-sm rounded-3xl p-12 border border-purple-600/30">
            <h2 className="text-4xl font-bold mb-6">Ready to Build?</h2>
            <p className="text-xl text-white/80 mb-8">
              Start integrating Design-Rite's AI capabilities into your applications today. 
              Free tier includes 1,000 API calls to get you started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:api@design-rite.com?subject=API%20Access%20Request"
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl hover:shadow-purple-600/40 transition-all"
              >
                Get API Key
              </a>
              <a 
                href="#documentation"
                className="bg-white/10 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 hover:border-white/50 transition-all"
              >
                View Documentation
              </a>
            </div>
          </div>
        </section>

        {/* Quick Start Section */}
        <section className="max-w-6xl mx-auto mt-20 mb-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-white/90">
            Try these quick options to get started with Design-Rite
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={handleTryPlatformClick}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 hover:-translate-y-1 transition-all w-full"
            >
              <div className="text-2xl mb-3">🆓</div>
              <div className="font-semibold text-white">Start Free Trial</div>
            </button>
            <a 
              href="mailto:api@design-rite.com?subject=API%20Pricing%20Information"
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 hover:-translate-y-1 transition-all"
            >
              <div className="text-2xl mb-3">💰</div>
              <div className="font-semibold text-white">Get API Pricing</div>
            </a>
            <a 
              href="mailto:partnerships@design-rite.com?subject=API%20Partnership"
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center hover:bg-white/15 hover:-translate-y-1 transition-all"
            >
              <div className="text-2xl mb-3">🤝</div>
              <div className="font-semibold text-white">Partner with Us</div>
            </a>
            <a 
              href="mailto:support@design-rite.com?subject=API%20Technical%20Support"
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
            <Link href="/contact" className="text-white/70 hover:text-purple-600 text-sm transition-colors">Contact</Link>
            <button onClick={handleTryPlatformClick} className="text-white/70 hover:text-purple-600 text-sm transition-colors text-left">Try Platform</button>
          </div>
          <p className="text-sm text-white/60 mt-4">
            🔒 Your API keys and data are secure with enterprise-grade encryption.
          </p>
        </div>
      </footer>

      {/* Email Gate Modal */}
      <EmailGate
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onSuccess={handleEmailGateSuccess}
      />
    </div>
  )
}


