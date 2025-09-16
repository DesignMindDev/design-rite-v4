'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ApplicationFormProps {
  position: string
  isOpen: boolean
  onClose: () => void
}

function ApplicationForm({ position, isOpen, onClose }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedinUrl: '',
    portfolioUrl: '',
    yearsExperience: '',
    currentCompany: '',
    currentJobTitle: '',
    coverLetter: '',
    salaryExpectations: '',
    availableStartDate: '',
    referralSource: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          positionApplied: position
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit application')
      }

      setSubmitted(true)
    } catch (err: any) {
      setError(err.message || 'Failed to submit application. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gray-900 rounded-2xl p-8 max-w-md w-full">
          <div className="text-center">
            <div className="text-4xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-white mb-4">Application Submitted!</h3>
            <p className="text-gray-400 mb-6">
              Thank you for your interest in the {position} position. We'll review your application and get back to you soon.
            </p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-gray-900 rounded-2xl p-8 max-w-2xl w-full my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Apply for {position}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                required
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Last Name *</label>
              <input
                type="text"
                name="lastName"
                required
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">Email *</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">LinkedIn URL</label>
              <input
                type="url"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Years of Experience</label>
              <select
                name="yearsExperience"
                value={formData.yearsExperience}
                onChange={handleInputChange}
                className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              >
                <option value="">Select experience level</option>
                <option value="0-1">0-1 years</option>
                <option value="2-3">2-3 years</option>
                <option value="4-5">4-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-white font-semibold mb-2">Cover Letter</label>
            <textarea
              name="coverLetter"
              value={formData.coverLetter}
              onChange={handleInputChange}
              rows={4}
              className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
              placeholder="Tell us why you're interested in this position and what makes you a great fit..."
            />
          </div>

          {error && (
            <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-600 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Main Careers Page Component
export default function CareersPage() {
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [showApplicationForm, setShowApplicationForm] = useState(false)

  const openApplicationForm = (position: string) => {
    setSelectedPosition(position)
    setShowApplicationForm(true)
  }

  const closeApplicationForm = () => {
    setShowApplicationForm(false)
    setSelectedPosition(null)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-900 to-black py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Join Our Team
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Shape the future of AI security with us. We're building the next generation of cybersecurity solutions.
          </p>
        </div>
      </div>

      {/* Open Positions */}
      <div className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Open Positions</h2>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* AI Security Engineer */}
            <div className="bg-gray-900 rounded-2xl p-8 hover:bg-gray-800 transition-all">
              <h3 className="text-2xl font-bold mb-4">AI Security Engineer</h3>
              <p className="text-gray-400 mb-6">
                Build and deploy advanced AI-powered security systems. Work with cutting-edge machine learning models.
              </p>
              <div className="space-y-2 mb-6">
                <span className="inline-block bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">Remote</span>
                <span className="inline-block bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm ml-2">Full-time</span>
              </div>
              <button
                onClick={() => openApplicationForm('AI Security Engineer')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Apply Now
              </button>
            </div>

            {/* Cybersecurity Analyst */}
            <div className="bg-gray-900 rounded-2xl p-8 hover:bg-gray-800 transition-all">
              <h3 className="text-2xl font-bold mb-4">Cybersecurity Analyst</h3>
              <p className="text-gray-400 mb-6">
                Analyze threats, investigate incidents, and develop security protocols for enterprise clients.
              </p>
              <div className="space-y-2 mb-6">
                <span className="inline-block bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">Hybrid</span>
                <span className="inline-block bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm ml-2">Full-time</span>
              </div>
              <button
                onClick={() => openApplicationForm('Cybersecurity Analyst')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Apply Now
              </button>
            </div>

            {/* Sales Engineer */}
            <div className="bg-gray-900 rounded-2xl p-8 hover:bg-gray-800 transition-all">
              <h3 className="text-2xl font-bold mb-4">Technical Sales Engineer</h3>
              <p className="text-gray-400 mb-6">
                Bridge the gap between our technical solutions and enterprise client needs. Combine technical expertise with sales acumen.
              </p>
              <div className="space-y-2 mb-6">
                <span className="inline-block bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">Remote</span>
                <span className="inline-block bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm ml-2">Full-time</span>
              </div>
              <button
                onClick={() => openApplicationForm('Technical Sales Engineer')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Apply Now
              </button>
            </div>

            {/* Product Manager */}
            <div className="bg-gray-900 rounded-2xl p-8 hover:bg-gray-800 transition-all">
              <h3 className="text-2xl font-bold mb-4">Product Manager - Security Solutions</h3>
              <p className="text-gray-400 mb-6">
                Define product strategy and roadmap for our AI security platform. Work directly with engineering and design teams.
              </p>
              <div className="space-y-2 mb-6">
                <span className="inline-block bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full text-sm">Hybrid</span>
                <span className="inline-block bg-green-600/20 text-green-400 px-3 py-1 rounded-full text-sm ml-2">Full-time</span>
              </div>
              <button
                onClick={() => openApplicationForm('Product Manager - Security Solutions')}
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Benefits */}
      <div className="py-20 bg-gray-900/50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12">Why Work With Us?</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-4">Innovation First</h3>
              <p className="text-gray-400">Work on cutting-edge AI security technology that's shaping the future of cybersecurity.</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-bold mb-4">Flexible Work</h3>
              <p className="text-gray-400">Remote-first culture with flexible hours and the option to work from our modern offices.</p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-4">Competitive Package</h3>
              <p className="text-gray-400">Top-tier compensation, equity options, and comprehensive health benefits.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Contact */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8">Don't See Your Role?</h2>
          <p className="text-gray-400 text-lg mb-8">
            We're always looking for exceptional talent. Send us your resume and let's start a conversation.
          </p>
          
          <div className="flex justify-center items-center gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-2">General Inquiries</h3>
              <a href="mailto:careers@design-rite.com" className="text-purple-400 hover:text-purple-300">
                careers@design-rite.com
              </a>
            </div>
            
            <div className="flex gap-4 mt-4 md:mt-0">
              <a href="mailto:careers@design-rite.com" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">📧</a>
              <Link href="/linkedin" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">💼</Link>
              <Link href="/twitter" className="text-gray-400 hover:text-purple-600 text-xl transition-colors">🐦</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Application Form Modal */}
      {showApplicationForm && selectedPosition && (
        <ApplicationForm
          position={selectedPosition}
          isOpen={showApplicationForm}
          onClose={closeApplicationForm}
        />
      )}
    </div>
  )
}