"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Download, FileText, Shield, Building2, Users, Calendar, DollarSign, CheckCircle, AlertTriangle, ExternalLink, RefreshCw } from 'lucide-react'

interface AssessmentResults {
  success: boolean
  assessment: string
  recommendations: any[]
  budgetAnalysis: {
    totalEstimate: number
    breakdown: any
    realDataPercentage: number
  }
  projectSummary: {
    projectName: string
    facilityType: string
    squareFootage: number
    timeline: string
    primaryConcerns: string[]
  }
  sessionId: string
  provider: string
}

export default function DiscoveryResultsPage() {
  const [results, setResults] = useState<AssessmentResults | null>(null)
  const [discoveryData, setDiscoveryData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load assessment results from session storage
    const storedResults = sessionStorage.getItem('assessmentResults')
    const storedDiscoveryData = sessionStorage.getItem('discoveryAssessmentData')

    if (storedResults) {
      try {
        setResults(JSON.parse(storedResults))
      } catch (error) {
        console.error('Failed to parse assessment results:', error)
      }
    }

    if (storedDiscoveryData) {
      try {
        setDiscoveryData(JSON.parse(storedDiscoveryData))
      } catch (error) {
        console.error('Failed to parse discovery data:', error)
      }
    }

    setLoading(false)
  }, [])

  const downloadAssessment = () => {
    if (!results?.assessment) return

    const blob = new Blob([results.assessment], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${discoveryData?.projectName || 'Security Assessment'}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-white/70">Loading your assessment results...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Assessment Not Found</h1>
          <p className="text-white/70 mb-6">No assessment results were found. Please complete the discovery form first.</p>
          <Link
            href="/ai-discovery"
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Start New Assessment
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/ai-discovery" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Discovery</span>
          </Link>
          <div className="text-center">
            <span className="font-bold text-lg">✅ ASSESSMENT COMPLETE</span>
            <span className="ml-2">Comprehensive Security Analysis</span>
          </div>
          <button
            onClick={downloadAssessment}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            Download
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Project Summary Header */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                {results.projectSummary?.projectName || 'Security Assessment'}
              </h1>
              <p className="text-white/70 text-lg">
                {discoveryData?.companyName} • {results.projectSummary?.facilityType} •
                {results.projectSummary?.squareFootage?.toLocaleString()} sq ft
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">
                {results.budgetAnalysis?.realDataPercentage || 0}%
              </div>
              <div className="text-white/60 text-sm">Live Market Data</div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-white/70 text-sm">Budget Range</span>
              </div>
              <div className="text-white font-semibold">
                {discoveryData?.budgetRange || 'Contact for pricing'}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                <span className="text-white/70 text-sm">Timeline</span>
              </div>
              <div className="text-white font-semibold">
                {results.projectSummary?.timeline || 'TBD'}
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <span className="text-white/70 text-sm">Components</span>
              </div>
              <div className="text-white font-semibold">
                {results.recommendations?.length || 0} Products
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span className="text-white/70 text-sm">Total Investment</span>
              </div>
              <div className="text-white font-semibold">
                {results.budgetAnalysis?.totalEstimate > 0
                  ? `$${results.budgetAnalysis.totalEstimate.toLocaleString()}`
                  : 'Quote Required'
                }
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Assessment */}
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-white">Comprehensive Assessment</h2>
              </div>

              <div className="prose prose-invert max-w-none">
                <div
                  className="text-white/90 leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: results.assessment
                      .replace(/\n#/g, '\n<h1>')
                      .replace(/\n##/g, '\n<h2>')
                      .replace(/\n###/g, '\n<h3>')
                      .replace(/\n####/g, '\n<h4>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\*(.*?)\*/g, '<em>$1</em>')
                      .replace(/\n- /g, '\n• ')
                      .replace(/\n\n/g, '<br><br>')
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Next Steps
              </h3>
              <div className="space-y-3">
                <button
                  onClick={downloadAssessment}
                  className="w-full bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Full Report
                </button>

                <Link
                  href="/contact"
                  className="w-full bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 justify-center"
                >
                  <ExternalLink className="w-4 h-4" />
                  Schedule Consultation
                </Link>

                <Link
                  href="/ai-discovery"
                  className="w-full border-2 border-white/30 text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2 justify-center"
                >
                  <RefreshCw className="w-4 h-4" />
                  New Assessment
                </Link>
              </div>
            </div>

            {/* Key Recommendations Preview */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-400" />
                Top Recommendations
              </h3>
              <div className="space-y-3">
                {results.recommendations?.slice(0, 3).map((rec, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <div className="font-semibold text-white text-sm mb-1">
                      {rec.name}
                    </div>
                    <div className="text-white/60 text-xs mb-1">
                      {rec.manufacturer || 'TBD'} • {rec.category}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-green-400 text-sm font-medium">
                        {rec.price}
                      </span>
                      {rec.isRealData && (
                        <span className="bg-green-600/20 text-green-300 px-2 py-1 rounded text-xs">
                          Live Price
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Stats */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Assessment Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">Session ID:</span>
                  <span className="text-white font-mono">{results.sessionId?.slice(-8)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Provider:</span>
                  <span className="text-white">{results.provider}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Generated:</span>
                  <span className="text-white">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/60">Contact:</span>
                  <span className="text-white text-xs">{discoveryData?.contactEmail}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}