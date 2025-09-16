'use client'

import { useState } from 'react'
import Link from 'next/link'
import CareerApplicationForm from '../../components/CareerApplicationForm'

export default function CareersPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState('')
  const [isApplicationOpen, setIsApplicationOpen] = useState(false)

  const openApplicationModal = (position: string) => {
    setSelectedPosition(position)
    setIsApplicationOpen(true)
  }

  const positions = [
    {
      title: 'Senior Security Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Lead the development of our AI-powered security assessment platform.',
      requirements: [
        '5+ years security systems experience',
        'Strong knowledge of CCTV, access control, and intrusion detection',
        'Experience with AI/ML applications in security',
        'Leadership and mentoring skills'
      ]
    },
    {
      title: 'AI/ML Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Develop and optimize machine learning models for security system design.',
      requirements: [
        '3+ years ML engineering experience',
        'Proficiency in Python, TensorFlow/PyTorch',
        'Experience with computer vision',
        'Strong problem-solving skills'
      ]
    },
    {
      title: 'Product Designer',
      department: 'Design',
      location: 'Hybrid - San Francisco',
      type: 'Full-time',
      description: 'Design intuitive interfaces for our security design platform.',
      requirements: [
        '4+ years product design experience',
        'Expertise in Figma and design systems',
        'Understanding of B2B SaaS products',
        'Portfolio demonstrating complex UI/UX work'
      ]
    },
    {
      title: 'Sales Executive - Security Industry',
      department: 'Sales',
      location: 'Remote - US',
      type: 'Full-time',
      description: 'Drive sales growth in the security integrator market.',
      requirements: [
        '5+ years B2B sales experience',
        'Security industry background preferred',
        'Track record of exceeding quotas',
        'Strong presentation skills'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#1A1A2E] to-[#16213E] text-white overflow-x-hidden">
      {/* Header navigation would go here - using the unified navigation template */}
      
      {/* Hero Section */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-8 text-center">
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent font-bold text-base tracking-widest uppercase mb-4">
            Join Our Team
          </div>
          <h1 className="text-5xl lg:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Build the Future of Security Design
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-3xl mx-auto">
            Join a team of passionate innovators transforming how security systems are designed. 
            We're looking for talented individuals who want to make a real impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#openings" className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl transition-all">
              View Open Positions
            </a>
            <Link href="#culture" className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all">
              Learn About Our Culture
            </Link>
          </div>
        </div>
      </section>

      {/* Why Design-Rite Section */}
      <section className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Why Design-Rite?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-lg font-bold text-white mb-2">Innovation First</h3>
              <p className="text-gray-400 text-sm">
                Work with cutting-edge AI technology in the security industry
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl mb-4">🌍</div>
              <h3 className="text-lg font-bold text-white mb-2">Remote-First</h3>
              <p className="text-gray-400 text-sm">
                Work from anywhere with flexible hours and async collaboration
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl mb-4">📈</div>
              <h3 className="text-lg font-bold text-white mb-2">Growth & Learning</h3>
              <p className="text-gray-400 text-sm">
                Continuous learning budget and career development opportunities
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-lg font-bold text-white mb-2">Competitive Package</h3>
              <p className="text-gray-400 text-sm">
                Top-tier compensation, equity, and comprehensive benefits
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions Section */}
      <section id="openings" className="py-20 px-8 bg-black/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">Open Positions</h2>
          <p className="text-gray-400 text-center mb-12">
            Join us in revolutionizing the security industry
          </p>
          
          <div className="space-y-6">
            {positions.map((position, index) => (
              <div key={index} className="bg-gradient-to-r from-purple-600/10 to-purple-700/10 border border-purple-600/30 rounded-2xl p-8 hover:border-purple-600/50 transition-all">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-3 text-sm">
                      <span className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full">
                        {position.department}
                      </span>
                      <span className="bg-blue-600/20 text-blue-300 px-3 py-1 rounded-full">
                        {position.location}
                      </span>
                      <span className="bg-green-600/20 text-green-300 px-3 py-1 rounded-full">
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => openApplicationModal(position.title)}
                    className="mt-4 lg:mt-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center gap-2"
                  >
                    Apply Now
                    <span className="text-xl">→</span>
                  </button>
                </div>
                
                <p className="text-gray-300 mb-4">{position.description}</p>
                
                <div>
                  <h4 className="text-white font-semibold mb-2">Requirements:</h4>
                  <ul className="space-y-1">
                    {position.requirements.map((req, idx) => (
                      <li key={idx} className="text-gray-400 flex items-start gap-2">
                        <span className="text-green-400 mt-1">✓</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Don't see a fit section */}
          <div className="mt-12 bg-white/5 rounded-2xl p-8 text-center border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-4">Don't See the Right Fit?</h3>
            <p className="text-gray-400 mb-6">
              We're always looking for exceptional talent. Send us your resume and tell us how you can contribute to our mission.
            </p>
            <button
              onClick={() => openApplicationModal('General Application')}
              className="bg-white/10 text-white px-8 py-3 rounded-lg font-semibold border border-purple-600/30 hover:bg-purple-600/10 transition-all"
            >
              Submit General Application
            </button>
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section id="culture" className="py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">Our Culture & Benefits</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-2xl">🏥</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Health & Wellness</h3>
                  <p className="text-gray-400 text-sm">100% covered health, dental, and vision insurance</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">🏖️</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Unlimited PTO</h3>
                  <p className="text-gray-400 text-sm">Take the time you need to recharge and stay productive</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">💻</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Equipment Budget</h3>
                  <p className="text-gray-400 text-sm">$3,000 for your home office setup</p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="text-2xl">📚</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Learning Budget</h3>
                  <p className="text-gray-400 text-sm">$2,000 annual budget for courses and conferences</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">💵</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">401(k) Matching</h3>
                  <p className="text-gray-400 text-sm">6% company match on retirement contributions</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="text-2xl">👶</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">Parental Leave</h3>
                  <p className="text-gray-400 text-sm">16 weeks paid leave for all new parents</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-8 bg-gradient-to-r from-purple-600/10 to-purple-700/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Join Our Mission?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Be part of the team that's transforming the security industry with AI.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#openings" className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-4 rounded-xl text-lg font-bold hover:shadow-xl transition-all">
              View Open Positions
            </a>
            <Link href="/about" className="bg-white/10 text-white px-8 py-4 rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 transition-all">
              Learn More About Us
            </Link>
          </div>
        </div>
      </section>

      {/* Application Modal */}
      <CareerApplicationForm 
        position={selectedPosition}
        isOpen={isApplicationOpen}
        onClose={() => setIsApplicationOpen(false)}
      />
    </div>
  )
}
