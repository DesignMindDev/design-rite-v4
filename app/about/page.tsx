'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import UnifiedNavigation from '../components/UnifiedNavigation';
import TeamMember from '../components/TeamMember';
import Footer from '../components/Footer';

interface TeamMemberData {
  id: string
  name: string
  role: string
  description: string
  imagePath: string
  initials: string
  href?: string
}

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [teamMembers, setTeamMembers] = useState<TeamMemberData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTeamMembers()
  }, [])

  const loadTeamMembers = async () => {
    try {
      const response = await fetch('/api/admin/team')
      if (response.ok) {
        const data = await response.json()
        setTeamMembers(data)
      }
    } catch (error) {
      console.error('Failed to load team members:', error)
    } finally {
      setLoading(false)
    }
  }

  const redirectToApp = () => {
    window.location.href = '/waitlist'
  }

  const scheduleDemo = () => {
    window.location.href = '/demo.html'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Main Navigation Header with Dropdowns */}
      <UnifiedNavigation />

      {/* Hero Section */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent"></div>
        <div className="max-w-6xl mx-auto px-8 text-center relative z-10">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            About Design-Rite
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Revolutionizing Security Design
          </h1>
          <p className="text-xl text-gray-400 mb-16 leading-relaxed max-w-4xl mx-auto">
            We're transforming security system design with AI-powered intelligence, making professional-grade 
            assessments accessible to everyone in the industry.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-black/50">
        <div className="max-w-4xl mx-auto px-8">
          <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-12">
            <h2 className="text-4xl font-black mb-8 flex items-center gap-4 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
              <span className="text-3xl">🎯</span> Our Mission
            </h2>
            <div className="text-lg text-gray-300 leading-relaxed space-y-6">
              <p>
                Design-Rite was founded to solve one of the industry's biggest challenges: the overlooked details that can derail security projects.
                With over two decades of low-voltage design expertise, we've seen how traditional processes leave gaps in compliance,
                optimization, and reliability.
              </p>
              <p>
                Our AI platform transforms complex security requirements into clear, actionable designs. By automating compliance checks
                and optimization processes, we ensure clients never sacrifice safety, efficiency, or reliability. From Fortune 500 companies
                to school districts, hospitals, and critical infrastructure—every project gets the expert-level attention it deserves.
              </p>
              <p>
                We're not just digitizing existing processes—we're revolutionizing how security design is approached. Our platform
                combines deep industry knowledge with cutting-edge AI to deliver solutions that blend innovation with compliance,
                making professional-grade security design accessible to integrators and consultants of all sizes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Industry veterans and AI experts working together to revolutionize security design.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              <div className="col-span-full text-center text-gray-400">
                Loading team members...
              </div>
            ) : (
              <>
                {teamMembers.map((member) => (
                  <TeamMember
                    key={member.id}
                    name={member.name}
                    role={member.role}
                    description={member.description}
                    imagePath={member.imagePath}
                    initials={member.initials}
                    href={member.href}
                  />
                ))}

                {/* Join Us - Special Card */}
                <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 text-center hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-purple-700 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6">
                    +
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Join Our Team</h3>
                  <p className="text-purple-600 font-semibold mb-4">We're Hiring</p>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    Help us build the future of security design. We're looking for passionate
                    engineers and industry experts.
                  </p>
                  <Link
                    href="/careers"
                    className="inline-block bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-600/30 transition-all text-sm"
                  >
                    View Careers
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-black/50">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
              Our Values
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              These principles guide everything we do, from product development to customer relationships.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-white mb-4">Speed & Efficiency</h3>
              <p className="text-gray-400 leading-relaxed">
                Transform weeks of work into minutes. We obsess over making security design faster without 
                sacrificing quality or accuracy.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-4">Precision & Accuracy</h3>
              <p className="text-gray-400 leading-relaxed">
                Our AI delivers professional-grade results with 95%+ accuracy, backed by industry expertise 
                and compliance knowledge.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">🌐</div>
              <h3 className="text-xl font-bold text-white mb-4">Accessibility</h3>
              <p className="text-gray-400 leading-relaxed">
                Making professional security design expertise accessible to integrators and consultants 
                of all sizes.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-white mb-4">Security First</h3>
              <p className="text-gray-400 leading-relaxed">
                Every recommendation prioritizes security effectiveness, compliance requirements, 
                and industry best practices.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-white mb-4">Innovation</h3>
              <p className="text-gray-400 leading-relaxed">
                Constantly pushing the boundaries of what's possible with AI and machine learning 
                in security design.
              </p>
            </div>

            <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 hover:-translate-y-1 hover:border-purple-600/50 hover:shadow-xl hover:shadow-purple-600/15 transition-all">
              <div className="text-3xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-white mb-4">Partnership</h3>
              <p className="text-gray-400 leading-relaxed">
                Building lasting relationships with integrators, consultants, and security professionals 
                who trust our platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-8">
          <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-12">
            <h2 className="text-4xl font-black mb-8 flex items-center gap-4 bg-gradient-to-r from-white to-purple-600 bg-clip-text text-transparent">
              <span className="text-3xl">🧠</span> Our Technology
            </h2>
            <div className="text-lg text-gray-300 leading-relaxed space-y-6">
              <p>
                At the heart of Design-Rite is a sophisticated AI engine trained on thousands of real-world security 
                installations, compliance requirements, and industry standards. Our machine learning models understand 
                the nuanced relationships between facility types, threat vectors, and optimal security solutions.
              </p>
              <p>
                Our platform combines multiple AI technologies to analyze facility layouts, assess security 
                risks, recommend optimal device placement, and generate comprehensive documentation that 
                meets industry standards including CJIS, FERPA, and HIPAA compliance.
              </p>
              <p>
                The system continuously learns and improves, ensuring recommendations stay current with evolving 
                threats, new technologies, and changing compliance requirements. This creates a platform that gets 
                smarter with every assessment generated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 bg-gradient-to-r from-purple-600/10 to-purple-700/10">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
            Ready to Join the Revolution?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Experience the future of security design today. Join our waitlist for early access to the most 
            advanced AI-powered security design platform launching Q4 2025.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={redirectToApp} className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl hover:shadow-purple-600/40 transition-all">
              Join Waitlist - Free Early Access
            </button>
            <Link href="/contact" className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 hover:border-white/40 transition-all">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      <Footer redirectToApp={redirectToApp} />

      {/* Chat Button */}
      <div className="fixed bottom-5 right-5 z-[999999]">
        <button className="w-15 h-15 bg-purple-600 rounded-full cursor-pointer flex items-center justify-center shadow-lg hover:scale-110 hover:shadow-xl transition-all">
          <div className="text-white text-2xl font-bold">💬</div>
        </button>
      </div>
    </div>
  )
}


