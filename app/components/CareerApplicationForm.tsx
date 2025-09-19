'use client'

import { useState } from 'react'

interface ApplicationFormProps {
  position: string
  isOpen: boolean
  onClose: () => void
}

export default function CareerApplicationForm({ position, isOpen, onClose }: ApplicationFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    currentCompany: '',
    currentRole: '',
    experience: '',
    coverLetter: '',
    salary: '',
    startDate: '',
    referralSource: '',
    location: 'Remote'
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/careers/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          position: position,
          department: position.includes('Engineer') ? 'Engineering' : 
                     position.includes('Design') ? 'Design' : 
                     position.includes('Sales') ? 'Sales' : 'General'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setSubmitStatus('success')
        setTimeout(() => {
          onClose()
          setSubmitStatus('idle')
          setFormData({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            linkedin: '',
            portfolio: '',
            currentCompany: '',
            currentRole: '',
            experience: '',
            coverLetter: '',
            salary: '',
            startDate: '',
            referralSource: '',
            location: 'Remote'
          })
        }, 3000)
      } else {
        setSubmitStatus('error')
      }
    } catch (error) {
      console.error('Error submitting application:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        
        {/* Modal */}
        <div className="relative bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-600/30 shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 p-6 rounded-t-2xl">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/80 hover:text-white text-2xl"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-white">Apply for Position</h2>
            <p className="text-purple-100 mt-1">{position}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {submitStatus === 'success' ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">✅</div>
                <h3 className="text-2xl font-bold text-white mb-2">Application Submitted!</h3>
                <p className="text-gray-400">We'll review your application and get back to you soon.</p>
              </div>
            ) : (
              <>
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Personal Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Professional Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Current Company
                      </label>
                      <input
                        type="text"
                        value={formData.currentCompany}
                        onChange={(e) => setFormData({...formData, currentCompany: e.target.value})}
                        className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Current Role
                      </label>
                      <input
                        type="text"
                        value={formData.currentRole}
                        onChange={(e) => setFormData({...formData, currentRole: e.target.value})}
                        className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Years of Experience
                      </label>
                      <select
                        value={formData.experience}
                        onChange={(e) => setFormData({...formData, experience: e.target.value})}
                        className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      >
                        <option value="">Select...</option>
                        <option value="0-2">0-2 years</option>
                        <option value="3-5">3-5 years</option>
                        <option value="6-10">6-10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Location Preference
                      </label>
                      <select
                        value={formData.location}
                        onChange={(e) => setFormData({...formData, location: e.target.value})}
                        className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      >
                        <option value="Remote">Remote</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="On-site">On-site</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Links */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Links & Portfolio</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        LinkedIn Profile
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                        placeholder="https://linkedin.com/in/..."
                        className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Portfolio/Website
                      </label>
                      <input
                        type="url"
                        value={formData.portfolio}
                        onChange={(e) => setFormData({...formData, portfolio: e.target.value})}
                        placeholder="https://..."
                        className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Additional Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Cover Letter / Why Design-Rite?
                      </label>
                      <textarea
                        rows={4}
                        value={formData.coverLetter}
                        onChange={(e) => setFormData({...formData, coverLetter: e.target.value})}
                        placeholder="Tell us why you're interested in joining Design-Rite..."
                        className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Salary Expectations
                        </label>
                        <input
                          type="text"
                          value={formData.salary}
                          onChange={(e) => setFormData({...formData, salary: e.target.value})}
                          placeholder="e.g., $80,000 - $100,000"
                          className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                          Available Start Date
                        </label>
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                          className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        How did you hear about us?
                      </label>
                      <select
                        value={formData.referralSource}
                        onChange={(e) => setFormData({...formData, referralSource: e.target.value})}
                        className="w-full px-4 py-2 bg-black/50 border border-purple-600/30 rounded-lg text-white focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      >
                        <option value="">Select...</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Indeed">Indeed</option>
                        <option value="Company Website">Company Website</option>
                        <option value="Employee Referral">Employee Referral</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {submitStatus === 'error' && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400">Failed to submit application. Please try again.</p>
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-8 py-3 border border-purple-600/30 text-white rounded-lg font-semibold hover:bg-purple-600/10 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}


