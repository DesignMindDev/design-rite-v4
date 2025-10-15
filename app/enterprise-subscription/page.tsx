'use client'

import { useState } from 'react'
import Link from 'next/link'
import UnifiedNavigation from '../components/UnifiedNavigation'
import Footer from '../components/Footer'
import { Check, Building2, Users, Shield, Zap, Globe, HeadphonesIcon, Clock, Award, ArrowRight } from 'lucide-react'

export default function EnterpriseSubscriptionPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    company: '',
    phone: '',
    employees: '',
    locations: '',
    timeline: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    // TODO: Send to your CRM or email service
    console.log('Enterprise inquiry:', formData)

    // Simulate submission
    setTimeout(() => {
      alert('Thank you! Our enterprise team will contact you within 24 hours.')
      setSubmitting(false)
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white">
      <UnifiedNavigation />

      <main className="py-20 px-6">
        {/* Hero Section */}
        <section className="max-w-6xl mx-auto text-center mb-20">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-600/20 to-purple-700/20 rounded-full text-purple-400 font-semibold text-sm mb-6 border border-purple-500/30">
            Enterprise Solutions
          </div>
          <h1 className="text-5xl lg:text-7xl font-black leading-tight mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
            Built for Large Organizations
          </h1>
          <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed mb-8 max-w-4xl mx-auto">
            Multi-site management, dedicated support, and custom integrations for organizations with 50+ employees or multiple facilities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#request-demo"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-800 transition-all text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Request Enterprise Demo
            </a>
            <a
              href="#pricing"
              className="px-8 py-4 border-2 border-purple-500 text-white rounded-xl font-bold hover:bg-purple-500/10 transition-all text-lg"
            >
              View Pricing Details
            </a>
          </div>
        </section>

        {/* Trust Logos */}
        <section className="max-w-6xl mx-auto mb-20 text-center">
          <p className="text-gray-400 text-sm mb-6 uppercase tracking-wider">Trusted by Enterprise Organizations</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-50">
            {/* Placeholder for customer logos */}
            <div className="text-2xl font-bold text-gray-500">Fortune 500</div>
            <div className="text-2xl font-bold text-gray-500">Healthcare</div>
            <div className="text-2xl font-bold text-gray-500">Education</div>
            <div className="text-2xl font-bold text-gray-500">Government</div>
          </div>
        </section>

        {/* Why Enterprise Section */}
        <section className="max-w-7xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Large Organizations Choose Design-Rite Enterprise</h2>
            <p className="text-xl text-gray-400">Scalability, security, and support designed for complex organizations</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Multi-Site Management</h3>
              <p className="text-gray-400 leading-relaxed">
                Centrally manage security proposals across all your facilities. Standardize processes while allowing location-specific customization.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Unlimited Team Members</h3>
              <p className="text-gray-400 leading-relaxed">
                No per-seat pricing. Add your entire security team, facility managers, and vendors with role-based permissions.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-700 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Enterprise Security</h3>
              <p className="text-gray-400 leading-relaxed">
                SOC 2 Type II, HIPAA compliance, SSO/SAML authentication, dedicated infrastructure, and advanced audit logging.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center mb-4">
                <HeadphonesIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Dedicated Support</h3>
              <p className="text-gray-400 leading-relaxed">
                Named account manager, 24/7 phone support, priority bug fixes, quarterly business reviews, and custom training.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Custom Integrations</h3>
              <p className="text-gray-400 leading-relaxed">
                Connect to your ERP, CRM, project management, and procurement systems. Custom API endpoints and webhooks included.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-600 to-yellow-700 rounded-xl flex items-center justify-center mb-4">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-3">SLA Guarantee</h3>
              <p className="text-gray-400 leading-relaxed">
                99.9% uptime SLA with service credits. Priority infrastructure, dedicated database, and custom deployment options.
              </p>
            </div>
          </div>
        </section>

        {/* Data Isolation & Security Section */}
        <section className="max-w-6xl mx-auto mb-20">
          <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 backdrop-blur-sm rounded-3xl p-12 border border-blue-500/30">
            <div className="text-center mb-12">
              <div className="inline-block px-4 py-2 bg-blue-500/20 rounded-full text-blue-400 font-semibold text-sm mb-4">
                Your Data, Your Floor
              </div>
              <h2 className="text-4xl font-bold mb-4">Enterprise-Grade Data Isolation</h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                As security professionals, you understand access control better than anyone.
                We apply the same principles to your data.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-white/5 rounded-2xl p-8 border border-white/10 mb-6">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">Think of it like a highrise building</h3>
                      <p className="text-gray-400 leading-relaxed">
                        Each Enterprise customer has their own dedicated "floor" - completely isolated from other tenants.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 pl-16">
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <strong className="text-white">Your floor, your access card.</strong> Only your team can access your projects, proposals, and client data.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <strong className="text-white">Dedicated database instance.</strong> Your data isn't mixed with other customers - it's physically separated.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <strong className="text-white">No shared infrastructure.</strong> Your proposals, BOMs, and site plans never touch another customer's data.
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-300">
                        <strong className="text-white">Role-based permissions.</strong> You control who on your team accesses what - just like your access control systems.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-900/40 to-red-900/40 rounded-2xl p-6 border border-orange-500/30">
                  <div className="flex items-start gap-3">
                    <Shield className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-white mb-2">Why this matters for security integrators</h4>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        You're handling sensitive client information - facility layouts, camera locations, access control credentials, and proprietary pricing.
                        Your competitive advantage depends on keeping that data isolated and secure.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                  <h4 className="font-bold mb-3 flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                    Multi-Tenant Platforms (Most SaaS)
                  </h4>
                  <p className="text-gray-400 text-sm mb-3">
                    ❌ Shared database with row-level filtering<br />
                    ❌ Your data sits next to competitors' data<br />
                    ❌ Single security breach affects everyone<br />
                    ❌ Limited customization options
                  </p>
                  <div className="text-xs text-gray-500 italic">
                    Like shared office space - everyone uses the same building, separated only by cubicle walls
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-900/40 to-blue-900/40 rounded-xl p-6 border-2 border-green-500/50 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    DESIGN-RITE ENTERPRISE
                  </div>
                  <h4 className="font-bold mb-3 flex items-center gap-2 mt-2">
                    <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold">2</span>
                    </div>
                    Enterprise Data Isolation
                  </h4>
                  <p className="text-gray-300 text-sm mb-3">
                    ✅ Dedicated database instance per customer<br />
                    ✅ Physical data separation<br />
                    ✅ Independent security perimeter<br />
                    ✅ Custom compliance controls (HIPAA, CJIS, etc.)
                  </p>
                  <div className="text-xs text-green-300 italic font-medium">
                    Like your own private floor - complete control, zero neighbors, your own access system
                  </div>
                </div>

                <div className="bg-blue-500/10 rounded-xl p-4 border border-blue-500/30">
                  <p className="text-sm text-blue-200">
                    <strong>Security Pro Tip:</strong> This is the same architecture you recommend for your enterprise clients -
                    dedicated VLANs, isolated VMS servers, and segmented access control. We practice what you preach.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Feature Comparison */}
        <section id="pricing" className="max-w-5xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Enterprise vs. Professional</h2>
            <p className="text-xl text-gray-400">See what makes Enterprise the right choice for large organizations</p>
          </div>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="text-left p-6 font-bold text-lg">Feature</th>
                  <th className="text-center p-6 font-bold text-lg">Professional<br/><span className="text-sm font-normal text-gray-400">$199/mo</span></th>
                  <th className="text-center p-6 font-bold text-lg bg-gradient-to-r from-purple-600/20 to-purple-700/20">Enterprise<br/><span className="text-sm font-normal text-purple-300">Custom</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr>
                  <td className="p-6">Assessments per month</td>
                  <td className="p-6 text-center text-gray-400">Unlimited</td>
                  <td className="p-6 text-center text-white font-semibold">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-6">Team members</td>
                  <td className="p-6 text-center text-gray-400">5 users</td>
                  <td className="p-6 text-center text-white font-semibold">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-6">Multi-site management</td>
                  <td className="p-6 text-center text-gray-400">—</td>
                  <td className="p-6 text-center"><Check className="w-6 h-6 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-6">Custom integrations</td>
                  <td className="p-6 text-center text-gray-400">Basic API</td>
                  <td className="p-6 text-center"><Check className="w-6 h-6 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-6">Dedicated account manager</td>
                  <td className="p-6 text-center text-gray-400">—</td>
                  <td className="p-6 text-center"><Check className="w-6 h-6 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-6">Support</td>
                  <td className="p-6 text-center text-gray-400">Email & Chat</td>
                  <td className="p-6 text-center text-white font-semibold">24/7 Phone + Email</td>
                </tr>
                <tr>
                  <td className="p-6">SLA guarantee</td>
                  <td className="p-6 text-center text-gray-400">—</td>
                  <td className="p-6 text-center text-white font-semibold">99.9% uptime</td>
                </tr>
                <tr>
                  <td className="p-6">SSO/SAML authentication</td>
                  <td className="p-6 text-center text-gray-400">—</td>
                  <td className="p-6 text-center"><Check className="w-6 h-6 text-green-500 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-6">Custom deployment options</td>
                  <td className="p-6 text-center text-gray-400">—</td>
                  <td className="p-6 text-center"><Check className="w-6 h-6 text-green-500 mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Request Demo Form */}
        <section id="request-demo" className="max-w-4xl mx-auto mb-20">
          <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 backdrop-blur-sm rounded-3xl p-12 border border-purple-500/30 shadow-2xl">
            <div className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-4">Request Your Enterprise Demo</h2>
              <p className="text-xl text-gray-300">Our enterprise team will contact you within 24 hours to schedule a personalized demo</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none transition-colors text-white placeholder-gray-400"
                    placeholder="John Smith"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Work Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none transition-colors text-white placeholder-gray-400"
                    placeholder="john@company.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Company Name *</label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none transition-colors text-white placeholder-gray-400"
                    placeholder="Acme Corporation"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none transition-colors text-white placeholder-gray-400"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Number of Employees</label>
                  <select
                    name="employees"
                    value={formData.employees}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none transition-colors text-white"
                  >
                    <option value="">Select range</option>
                    <option value="50-100">50-100</option>
                    <option value="100-250">100-250</option>
                    <option value="250-500">250-500</option>
                    <option value="500-1000">500-1,000</option>
                    <option value="1000+">1,000+</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Number of Locations</label>
                  <select
                    name="locations"
                    value={formData.locations}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none transition-colors text-white"
                  >
                    <option value="">Select range</option>
                    <option value="1-5">1-5</option>
                    <option value="6-10">6-10</option>
                    <option value="11-25">11-25</option>
                    <option value="26-50">26-50</option>
                    <option value="50+">50+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Implementation Timeline</label>
                <select
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none transition-colors text-white"
                >
                  <option value="">Select timeline</option>
                  <option value="immediate">Immediate (Within 30 days)</option>
                  <option value="1-3-months">1-3 months</option>
                  <option value="3-6-months">3-6 months</option>
                  <option value="6-12-months">6-12 months</option>
                  <option value="exploring">Just exploring</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Tell us about your needs (optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 focus:border-purple-500 focus:outline-none transition-colors text-white placeholder-gray-400 resize-none"
                  placeholder="What challenges are you facing? What features are most important to you?"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl font-bold hover:from-purple-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {submitting ? 'Submitting...' : 'Request Enterprise Demo'}
              </button>

              <p className="text-center text-sm text-gray-400">
                By submitting this form, you agree to our <Link href="/terms" className="text-purple-400 hover:underline">Terms of Service</Link> and{' '}
                <Link href="/privacy" className="text-purple-400 hover:underline">Privacy Policy</Link>
              </p>
            </form>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="max-w-4xl mx-auto mb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Enterprise FAQ</h2>
            <p className="text-xl text-gray-400">Common questions from enterprise customers</p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold mb-3">What is Enterprise pricing?</h3>
              <p className="text-gray-400 leading-relaxed">
                Enterprise pricing starts at $499/month for organizations with 50+ employees or 5+ locations. Contact us for a custom quote based on your specific needs, number of users, and required integrations.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold mb-3">Can we try before committing?</h3>
              <p className="text-gray-400 leading-relaxed">
                Yes! We offer a 30-day pilot program for enterprise customers. We'll set up a dedicated instance, train your team, and help you evaluate the platform with real projects.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold mb-3">Do you support on-premise deployment?</h3>
              <p className="text-gray-400 leading-relaxed">
                Yes, we offer both cloud-hosted and on-premise deployment options for Enterprise customers. We also support hybrid deployments and private cloud instances.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold mb-3">What kind of training is included?</h3>
              <p className="text-gray-400 leading-relaxed">
                Enterprise plans include custom onboarding for your team, admin training, end-user training sessions, recorded training materials, and ongoing quarterly training as needed.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
              <h3 className="text-xl font-bold mb-3">How long does implementation take?</h3>
              <p className="text-gray-400 leading-relaxed">
                Typical implementation takes 2-4 weeks, including setup, integration, training, and pilot testing. Rush implementations can be completed in as little as 1 week.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-900/60 to-blue-900/60 backdrop-blur-sm rounded-3xl p-12 border border-purple-500/30">
            <h2 className="text-4xl font-bold mb-6">Ready to Scale Your Security Operations?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Join enterprise organizations already saving 100+ hours per month with Design-Rite
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#request-demo"
                className="px-8 py-4 bg-white text-purple-600 rounded-xl font-bold hover:bg-gray-100 transition-all text-lg inline-flex items-center justify-center gap-2"
              >
                Schedule Demo <ArrowRight className="w-5 h-5" />
              </a>
              <Link
                href="/contact"
                className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold hover:bg-white/10 transition-all text-lg"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer redirectToApp={() => {}} />
    </div>
  )
}
