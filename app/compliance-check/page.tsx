"use client"

import { useState } from 'react'
import Link from 'next/link'
import EmailGate from '../components/EmailGate'
import { useAuthCache } from '../hooks/useAuthCache'

interface ComplianceFormData {
  facilityType: string
  industryType: string
  dataTypes: string[]
  currentControls: string[]
  concerns: string[]
}

export default function ComplianceCheckPage() {
  const [formData, setFormData] = useState<ComplianceFormData>({
    facilityType: '',
    industryType: '',
    dataTypes: [],
    currentControls: [],
    concerns: []
  })
  const [showResults, setShowResults] = useState(false)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const { isAuthenticated } = useAuthCache()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      setShowEmailGate(true)
      return
    }

    setShowResults(true)
  }

  const handleEmailGateSuccess = () => {
    setShowEmailGate(false)
    setShowResults(true)
  }

  const handleCheckboxChange = (category: keyof Pick<ComplianceFormData, 'dataTypes' | 'currentControls' | 'concerns'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }))
  }

  const getComplianceScore = (): number => {
    let score = 50 // Base score

    // Industry type scoring
    if (formData.industryType === 'healthcare') score += 20
    if (formData.industryType === 'education') score += 15
    if (formData.industryType === 'government') score += 25

    // Data types risk
    if (formData.dataTypes.includes('pii')) score -= 10
    if (formData.dataTypes.includes('phi')) score -= 15
    if (formData.dataTypes.includes('financial')) score -= 10

    // Current controls boost
    score += formData.currentControls.length * 5

    // Concerns penalty
    score -= formData.concerns.length * 3

    return Math.max(20, Math.min(95, score))
  }

  const getRecommendations = (): string[] => {
    const recs = []

    if (formData.industryType === 'healthcare') {
      recs.push('HIPAA compliance assessment required')
      recs.push('Patient privacy controls need evaluation')
    }

    if (formData.industryType === 'education') {
      recs.push('FERPA compliance review recommended')
      recs.push('Student data protection audit needed')
    }

    if (formData.dataTypes.includes('pii')) {
      recs.push('Personal data encryption protocols needed')
    }

    if (formData.concerns.includes('data-breach')) {
      recs.push('Incident response plan requires updating')
    }

    if (formData.currentControls.length < 3) {
      recs.push('Additional security controls recommended')
    }

    return recs.length > 0 ? recs : ['General security review recommended']
  }

  if (showResults) {
    const score = getComplianceScore()
    const recommendations = getRecommendations()

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
        <div className="max-w-4xl mx-auto px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-black mb-6">
              🔍 Your Compliance Assessment
            </h1>
            <p className="text-xl text-gray-300">
              Based on your responses, here's your preliminary compliance overview
            </p>
          </div>

          {/* Score Display */}
          <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 mb-8">
            <div className="text-center">
              <div className={`text-6xl font-black mb-4 ${score >= 80 ? 'text-green-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                {score}%
              </div>
              <h2 className="text-2xl font-bold mb-2">Compliance Readiness Score</h2>
              <p className="text-gray-400">
                {score >= 80 ? 'Strong compliance posture' :
                 score >= 60 ? 'Good foundation, some gaps exist' :
                 'Significant compliance gaps identified'}
              </p>
            </div>
          </div>

          {/* Key Findings */}
          <div className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6">🎯 Key Recommendations</h3>
            <ul className="space-y-3">
              {recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-yellow-400 font-bold">⚠️</span>
                  <span className="text-gray-300">{rec}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Teaser for Full Assessment */}
          <div className="bg-gradient-to-r from-violet-800/30 to-purple-800/30 border border-violet-500/30 rounded-2xl p-8 mb-8">
            <h3 className="text-2xl font-bold mb-4">📋 Want Your Full Compliance Report?</h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              This quick check identified {recommendations.length} priority areas. Our comprehensive AI assessment
              provides detailed compliance gap analysis, specific remediation steps, and regulatory template downloads.
            </p>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <h4 className="font-semibold text-violet-400">✅ Full Assessment Includes:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Detailed HIPAA/FERPA gap analysis</li>
                  <li>• Specific remediation timeline</li>
                  <li>• Compliance template downloads</li>
                  <li>• Risk priority matrix</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-violet-400">🎯 Plus Security Design:</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• Compliant system recommendations</li>
                  <li>• Professional BOMs & pricing</li>
                  <li>• Implementation roadmap</li>
                  <li>• Ongoing compliance monitoring</li>
                </ul>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/ai-assessment"
                className="bg-violet-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-violet-700 transition-all text-center"
              >
                🚀 Get Full Assessment
              </Link>
              <button
                onClick={handleTryDemo}
                className="border-2 border-violet-400 text-violet-300 px-8 py-4 rounded-xl font-bold hover:bg-violet-800/30 transition-all text-center"
              >
                📊 Security Estimate Only
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-sm text-gray-500">
            <p>* This is a preliminary assessment based on general indicators. Full compliance requires detailed regulatory analysis.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 text-white">
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-black mb-6">
            🔍 Quick Compliance Check
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Get an instant compliance readiness score for HIPAA, FERPA, and general security frameworks.
            Takes 2 minutes - identifies your biggest risk areas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-800/60 backdrop-blur-xl border border-purple-600/20 rounded-2xl p-8">

          {/* Facility Type */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">🏢 Facility Type</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { value: 'single-location', label: 'Single Location' },
                { value: 'multi-location', label: 'Multiple Locations' },
                { value: 'campus', label: 'Campus/Complex' },
                { value: 'remote-sites', label: 'Remote Sites' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <input
                    type="radio"
                    name="facilityType"
                    value={option.value}
                    checked={formData.facilityType === option.value}
                    onChange={(e) => setFormData({...formData, facilityType: e.target.value})}
                    className="w-4 h-4 text-violet-600"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Industry Type */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">🏥 Industry Sector</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { value: 'healthcare', label: '🏥 Healthcare' },
                { value: 'education', label: '🎓 Education' },
                { value: 'government', label: '🏛️ Government' },
                { value: 'financial', label: '🏦 Financial' },
                { value: 'retail', label: '🏪 Retail' },
                { value: 'other', label: '🏢 Other' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <input
                    type="radio"
                    name="industryType"
                    value={option.value}
                    checked={formData.industryType === option.value}
                    onChange={(e) => setFormData({...formData, industryType: e.target.value})}
                    className="w-4 h-4 text-violet-600"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Data Types */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">📊 Data Types You Handle</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { value: 'pii', label: 'Personal Identifiable Information (PII)' },
                { value: 'phi', label: 'Protected Health Information (PHI)' },
                { value: 'financial', label: 'Financial/Payment Data' },
                { value: 'student', label: 'Student Records' },
                { value: 'employee', label: 'Employee Data' },
                { value: 'none', label: 'None of the above' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.dataTypes.includes(option.value)}
                    onChange={() => handleCheckboxChange('dataTypes', option.value)}
                    className="w-4 h-4 text-violet-600"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Current Controls */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">🔒 Current Security Controls</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { value: 'access-control', label: 'Access Control Systems' },
                { value: 'cameras', label: 'Security Cameras' },
                { value: 'alarms', label: 'Intrusion Alarms' },
                { value: 'visitor-management', label: 'Visitor Management' },
                { value: 'data-encryption', label: 'Data Encryption' },
                { value: 'staff-training', label: 'Staff Security Training' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.currentControls.includes(option.value)}
                    onChange={() => handleCheckboxChange('currentControls', option.value)}
                    className="w-4 h-4 text-violet-600"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Compliance Concerns */}
          <div className="mb-8">
            <h3 className="text-xl font-bold mb-4">⚠️ Top Compliance Concerns</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { value: 'data-breach', label: 'Data Breach Risk' },
                { value: 'audit-readiness', label: 'Audit Readiness' },
                { value: 'staff-compliance', label: 'Staff Compliance Training' },
                { value: 'documentation', label: 'Policy Documentation' },
                { value: 'incident-response', label: 'Incident Response Plans' },
                { value: 'vendor-management', label: 'Vendor Risk Management' }
              ].map((option) => (
                <label key={option.value} className="flex items-center gap-3 p-4 bg-gray-700/30 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.concerns.includes(option.value)}
                    onChange={() => handleCheckboxChange('concerns', option.value)}
                    className="w-4 h-4 text-violet-600"
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-violet-600/30 transition-all"
          >
            🔍 Check My Compliance Score
          </button>
        </form>

        {/* Trust Indicators */}
        <div className="mt-12 text-center">
          <div className="flex justify-center items-center gap-8 text-sm text-gray-400">
            <span>✅ Free Assessment</span>
            <span>⚡ 2-Minute Results</span>
            <span>🔒 Confidential</span>
          </div>
        </div>
      </div>

      {/* Email Gate Modal */}
      <EmailGate
        isOpen={showEmailGate}
        onClose={() => setShowEmailGate(false)}
        onSuccess={handleEmailGateSuccess}
      />
    </div>
  )
}