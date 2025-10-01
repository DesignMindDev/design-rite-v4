"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Building2, Users, Shield, MapPin, Clock, DollarSign, FileText, AlertTriangle, Zap } from 'lucide-react'
import { sessionManager } from '../../lib/sessionManager'
import { type SecurityScenario } from '../../lib/scenario-library'
import { type SecurityQuote } from '../../lib/quote-generator'

interface DiscoveryData {
  // Step 0: Scenario Selection (NEW)
  selectedScenario?: SecurityScenario
  useScenario: boolean

  // Step 1: Project Basics
  projectName: string
  companyName: string
  contactName: string
  contactEmail: string

  // Step 2: Facility Information
  facilityType: string
  squareFootage: number
  buildingCount: number
  floorCount: number
  occupancy: number
  operatingHours: string

  // Step 3: Current Security
  currentSystems: string[]
  securityConcerns: string[]
  budgetRange: string
  timeline: string

  // Step 4: Compliance & Requirements
  complianceRequirements: string[]
  specialRequirements: string[]
  integrationsNeeded: string[]

  // Step 5: Implementation Preferences
  implementationApproach: string
  trainingNeeds: string[]
  maintenancePreference: string
  monitoringNeeds: string
}

const steps = [
  { id: 'scenario', title: 'Quick Start', icon: Zap },
  { id: 'basics', title: 'Project Basics', icon: Building2 },
  { id: 'facility', title: 'Facility Details', icon: MapPin },
  { id: 'security', title: 'Security Needs', icon: Shield },
  { id: 'compliance', title: 'Compliance', icon: FileText },
  { id: 'implementation', title: 'Implementation', icon: Clock },
  { id: 'summary', title: 'Review & Generate', icon: CheckCircle }
]

export default function AIDiscoveryPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [sessionInfo, setSessionInfo] = useState({ userId: '', projectId: '' })
  const [securityScenarios, setSecurityScenarios] = useState<SecurityScenario[]>([])
  const [loadingScenarios, setLoadingScenarios] = useState(true)
  const [data, setData] = useState<DiscoveryData>({
    useScenario: false,
    selectedScenario: undefined,
    projectName: '',
    companyName: '',
    contactName: '',
    contactEmail: '',
    facilityType: '',
    squareFootage: 0,
    buildingCount: 1,
    floorCount: 1,
    occupancy: 0,
    operatingHours: '',
    currentSystems: [],
    securityConcerns: [],
    budgetRange: '',
    timeline: '',
    complianceRequirements: [],
    specialRequirements: [],
    integrationsNeeded: [],
    implementationApproach: '',
    trainingNeeds: [],
    maintenancePreference: '',
    monitoringNeeds: ''
  })

  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [generatedQuote, setGeneratedQuote] = useState<SecurityQuote | null>(null)
  const [isGeneratingQuote, setIsGeneratingQuote] = useState(false)

  // Initialize session tracking and check for handoff data
  // Fetch scenarios from server-side API
  useEffect(() => {
    const fetchScenarios = async () => {
      try {
        const response = await fetch('/api/scenarios');
        if (response.ok) {
          const result = await response.json();
          setSecurityScenarios(result.scenarios || []);
        }
      } catch (error) {
        console.error('Failed to fetch scenarios:', error);
      } finally {
        setLoadingScenarios(false);
      }
    };
    fetchScenarios();
  }, []);

  useEffect(() => {
    const initializeSession = async () => {
      // Create or get user session
      const user = sessionManager.getOrCreateUser()

      // Check for handoff data from security estimate
      const handoffData = sessionStorage.getItem('estimateHandoff')
      let projectData = {
        projectName: 'AI Discovery Assessment',
        facilityType: 'Mixed Use Facility',
        phase: {
          tool: 'ai-discovery',
          data: { currentStep: 0, entry_point: handoffData ? 'security_estimate_handoff' : 'direct_access' }
        }
      }

      if (handoffData) {
        try {
          const parsedData = JSON.parse(handoffData)

          // Update form data with handoff info
          setData(prev => ({
            ...prev,
            companyName: parsedData.contactInfo?.companyName || '',
            contactName: parsedData.contactInfo?.name || '',
            contactEmail: parsedData.contactInfo?.email || '',
            squareFootage: parsedData.facilitySize || 0,
            facilityType: 'Mixed Use Facility',
            projectName: parsedData.contactInfo?.companyName ?
              `${parsedData.contactInfo.companyName} Security Assessment` :
              'Security Assessment Project'
          }))

          // Update project data with handoff context
          projectData = {
            projectName: parsedData.contactInfo?.companyName ?
              `${parsedData.contactInfo.companyName} Security Assessment` :
              'Security Assessment Project',
            facilitySize: parsedData.facilitySize,
            facilityType: 'Mixed Use Facility',
            estimatedCost: parsedData.estimate?.totalCost,
            systems: parsedData.selectedSystems,
            phase: {
              tool: 'ai-discovery',
              data: {
                currentStep: 0,
                entry_point: 'security_estimate_handoff',
                previous_estimate: parsedData.estimate,
                handoff_data: parsedData
              }
            }
          }

          // Update user with contact info
          if (parsedData.contactInfo?.email) {
            sessionManager.getOrCreateUser({
              email: parsedData.contactInfo.email,
              name: parsedData.contactInfo.name,
              company: parsedData.contactInfo.companyName
            })
          }

          sessionStorage.removeItem('estimateHandoff')
          console.log('🔄 Continuing from Security Estimate handoff')
        } catch (error) {
          console.error('Error parsing handoff data:', error)
        }
      }

      // Create or update project
      const project = sessionManager.createOrUpdateProject(projectData)

      setSessionInfo({
        userId: user.userId,
        projectId: project.projectId
      })

      // Track AI Discovery start
      sessionManager.trackActivity({
        action: 'ai_discovery_started',
        tool: 'ai-discovery',
        data: {
          entry_point: handoffData ? 'security_estimate_handoff' : 'direct_access',
          has_previous_estimate: !!handoffData
        }
      })

      console.log('🎯 AI Discovery session initialized:', { userId: user.userId, projectId: project.projectId })
    }

    initializeSession()
  }, [])

  const updateData = (field: keyof DiscoveryData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const toggleArrayItem = (field: keyof DiscoveryData, item: string) => {
    const currentArray = data[field] as string[]
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item]
    updateData(field, newArray)
  }

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: {[key: string]: string} = {}

    switch (stepIndex) {
      case 0: // Scenario Selection - Optional, always valid
        break

      case 1: // Project Basics
        if (!data.projectName.trim()) newErrors.projectName = 'Project name is required'
        if (!data.companyName.trim()) newErrors.companyName = 'Company name is required'
        if (!data.contactName.trim()) newErrors.contactName = 'Contact name is required'
        if (!data.contactEmail.trim()) newErrors.contactEmail = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(data.contactEmail)) newErrors.contactEmail = 'Valid email is required'
        break

      case 2: // Facility Information
        if (!data.facilityType) newErrors.facilityType = 'Facility type is required'
        if (!data.squareFootage) newErrors.squareFootage = 'Square footage is required'
        if (!data.operatingHours) newErrors.operatingHours = 'Operating hours are required'
        break

      case 3: // Security Needs
        if (data.securityConcerns.length === 0) newErrors.securityConcerns = 'Select at least one security concern'
        if (!data.budgetRange) newErrors.budgetRange = 'Budget range is required'
        if (!data.timeline) newErrors.timeline = 'Timeline is required'
        break

      case 4: // Compliance - Optional, always valid
        break

      case 5: // Implementation - Optional, always valid
        break

      case 6: // Summary - Always valid, just review
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      const newStep = Math.min(currentStep + 1, steps.length - 1)
      setCurrentStep(newStep)

      // Track step progression
      sessionManager.trackActivity({
        action: 'step_completed',
        tool: 'ai-discovery',
        data: {
          completed_step: currentStep,
          step_name: steps[currentStep]?.id,
          next_step: newStep,
          progress_percentage: Math.round((newStep / (steps.length - 1)) * 100),
          form_data_snapshot: data
        }
      })

      // Update project with current progress
      sessionManager.createOrUpdateProject({
        phase: {
          tool: 'ai-discovery',
          data: {
            currentStep: newStep,
            progress_percentage: Math.round((newStep / (steps.length - 1)) * 100),
            last_completed_step: steps[currentStep]?.id,
            form_data: data
          }
        }
      })

      console.log(`📈 AI Discovery step completed: ${steps[currentStep]?.id} → ${steps[newStep]?.id}`)
    }
  }

  const prevStep = () => {
    const newStep = Math.max(currentStep - 1, 0)
    setCurrentStep(newStep)

    // Track backward navigation
    sessionManager.trackActivity({
      action: 'step_back',
      tool: 'ai-discovery',
      data: {
        from_step: currentStep,
        to_step: newStep,
        step_name: steps[newStep]?.id
      }
    })
  }

  const generateAssessment = async () => {
    // Validate final step before submission
    if (!data.projectName || !data.companyName || !data.contactEmail) {
      alert('Please ensure all required fields are completed.')
      return
    }

    try {
      // Track assessment generation start
      sessionManager.trackActivity({
        action: 'assessment_generation_started',
        tool: 'ai-discovery',
        data: {
          final_data: data,
          all_steps_completed: true,
          facility_size: data.squareFootage,
          compliance_requirements: data.complianceRequirements,
          budget_range: data.budgetRange
        }
      })

      // Prepare discovery data with session info for results page
      const discoveryDataWithSession = {
        ...data,
        userId: sessionInfo.userId,
        projectId: sessionInfo.projectId,
        sessionTimestamp: new Date().toISOString()
      }

      // Store discovery data for results page
      sessionStorage.setItem('discoveryAssessmentData', JSON.stringify(discoveryDataWithSession))

      const response = await fetch('/api/ai-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_discovery_assessment',
          discoveryData: data,
          sessionInfo: sessionInfo
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Track successful completion
          sessionManager.trackActivity({
            action: 'ai_discovery_completed',
            tool: 'ai-discovery',
            data: {
              assessment_generated: true,
              final_data: data,
              ai_response_size: JSON.stringify(result).length
            }
          })

          // Update project as completed
          sessionManager.createOrUpdateProject({
            status: 'completed',
            phase: {
              tool: 'ai-discovery',
              data: {
                completed: true,
                final_data: data,
                assessment_results: result,
                completion_timestamp: new Date().toISOString()
              }
            }
          })

          // Log AI session completion
          await sessionManager.logAISession({
            tool: 'ai-discovery',
            sessionId: `ai_discovery_${Date.now()}`,
            userId: sessionInfo.userId,
            projectId: sessionInfo.projectId,
            data: {
              action: 'assessment_completed',
              discovery_data: data,
              results: result
            }
          })

          // Store results and redirect
          sessionStorage.setItem('assessmentResults', JSON.stringify(result))

          console.log('🎉 AI Discovery assessment completed successfully')
          window.location.href = '/ai-discovery-results'
        } else {
          throw new Error(result.error || 'Assessment generation failed')
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to generate assessment:', error)

      // Track failure
      sessionManager.trackActivity({
        action: 'assessment_generation_failed',
        tool: 'ai-discovery',
        data: {
          error_message: error.message,
          final_data: data
        }
      })

      alert(`Assessment generation failed: ${error.message}`)
    }
  }

  // Function to handle scenario selection
  const handleScenarioSelect = (scenario: SecurityScenario) => {
    setData(prev => ({
      ...prev,
      selectedScenario: scenario,
      useScenario: true,
      facilityType: scenario.facilityType,
      squareFootage: scenario.sqftRange.typical,
      budgetRange: `$${scenario.budgetRange.min.toLocaleString()} - $${scenario.budgetRange.max.toLocaleString()}`,
      complianceRequirements: scenario.compliance,
      securityConcerns: scenario.securityConcerns
    }))
  }

  // Function to generate preliminary quote
  const handleGenerateQuote = async () => {
    setIsGeneratingQuote(true)

    try {
      // Call server-side quote generation API (proprietary logic stays hidden)
      const response = await fetch('/api/generate-quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          discoveryData: data,
          selectedScenario: data.selectedScenario
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate quote');
      }

      const result = await response.json();
      const quote = result.quote;

      setGeneratedQuote(quote)

      // Track quote generation
      sessionManager.trackActivity('quote_generated', {
        projectId: sessionInfo.projectId,
        quoteId: quote.id,
        confidence: quote.overallConfidence,
        total: quote.total
      })

    } catch (error) {
      console.error('Quote generation error:', error)
      alert('Failed to generate quote. Please try again.')
    } finally {
      setIsGeneratingQuote(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Scenario Selection (NEW)
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">🚀 Quick Start with Scenarios</h2>
              <p className="text-white/70 text-lg">Choose a pre-built scenario to accelerate your assessment, or skip to build from scratch</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {securityScenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  onClick={() => handleScenarioSelect(scenario)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    data.selectedScenario?.id === scenario.id
                      ? 'border-purple-400 bg-purple-500/20'
                      : 'border-white/20 bg-white/5 hover:border-white/40'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">{scenario.icon}</div>
                    <h3 className="text-xl font-bold text-white mb-2">{scenario.name}</h3>
                    <p className="text-white/70 text-sm mb-4">{scenario.description}</p>

                    <div className="space-y-2 text-xs text-white/60">
                      <div>📐 {scenario.sqftRange.min.toLocaleString()}-{scenario.sqftRange.max.toLocaleString()} sqft</div>
                      <div>💰 ${scenario.budgetRange.min.toLocaleString()}-${scenario.budgetRange.max.toLocaleString()}</div>
                      <div>🎯 {scenario.confidenceLevel}% confidence</div>
                    </div>

                    {data.selectedScenario?.id === scenario.id && (
                      <div className="mt-4 text-purple-300 font-medium">✓ Selected</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {data.selectedScenario && (
              <div className="mt-8 p-6 bg-white/10 rounded-lg border border-purple-400/30">
                <h4 className="text-lg font-bold text-white mb-3">Selected: {data.selectedScenario.name}</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="text-white/90 font-medium mb-2">Pre-filled Assumptions:</h5>
                    <ul className="text-white/70 space-y-1">
                      <li>• {data.selectedScenario.assumptions.surveillance.cameras} cameras ({data.selectedScenario.assumptions.surveillance.coverage} coverage)</li>
                      <li>• {data.selectedScenario.assumptions.accessControl.doors} access-controlled doors</li>
                      <li>• {data.selectedScenario.assumptions.intrusion.zones} security zones</li>
                      <li>• {data.selectedScenario.compliance.join(', ')} compliance</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="text-white/90 font-medium mb-2">Typical Security Concerns:</h5>
                    <ul className="text-white/70 space-y-1">
                      {data.selectedScenario.securityConcerns.slice(0, 4).map((concern, idx) => (
                        <li key={idx}>• {concern}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="text-center mt-8">
              <button
                onClick={() => setData(prev => ({ ...prev, useScenario: false, selectedScenario: undefined }))}
                className="text-white/70 hover:text-white transition-colors underline"
              >
                Skip scenarios - I'll build from scratch
              </button>
            </div>
          </div>
        )

      case 1: // Project Basics (moved from case 0)
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Let's Start With Your Project</h2>
              <p className="text-white/70 text-lg">Tell us about your security project and company</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white/90 font-medium mb-2">Project Name *</label>
                <input
                  type="text"
                  value={data.projectName}
                  onChange={(e) => updateData('projectName', e.target.value)}
                  placeholder="e.g., Main Campus Security Upgrade"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors ${
                    errors.projectName ? 'border-red-400' : 'border-white/30'
                  }`}
                />
                {errors.projectName && <p className="text-red-400 text-sm mt-1">{errors.projectName}</p>}
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Company Name *</label>
                <input
                  type="text"
                  value={data.companyName}
                  onChange={(e) => updateData('companyName', e.target.value)}
                  placeholder="Your company name"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors ${
                    errors.companyName ? 'border-red-400' : 'border-white/30'
                  }`}
                />
                {errors.companyName && <p className="text-red-400 text-sm mt-1">{errors.companyName}</p>}
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Primary Contact *</label>
                <input
                  type="text"
                  value={data.contactName}
                  onChange={(e) => updateData('contactName', e.target.value)}
                  placeholder="Your full name"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors ${
                    errors.contactName ? 'border-red-400' : 'border-white/30'
                  }`}
                />
                {errors.contactName && <p className="text-red-400 text-sm mt-1">{errors.contactName}</p>}
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  value={data.contactEmail}
                  onChange={(e) => updateData('contactEmail', e.target.value)}
                  placeholder="your@company.com"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors ${
                    errors.contactEmail ? 'border-red-400' : 'border-white/30'
                  }`}
                />
                {errors.contactEmail && <p className="text-red-400 text-sm mt-1">{errors.contactEmail}</p>}
              </div>
            </div>
          </div>
        )

      case 2: // Facility Information
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Facility Details</h2>
              <p className="text-white/70 text-lg">Help us understand your physical environment</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-white/90 font-medium mb-2">Facility Type *</label>
                <select
                  value={data.facilityType}
                  onChange={(e) => updateData('facilityType', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-800/80 border rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors ${
                    errors.facilityType ? 'border-red-400' : 'border-white/30'
                  }`}
                  style={{
                    colorScheme: 'dark'
                  }}
                >
                  <option value="" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Select facility type...</option>
                  <option value="office" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Office Building</option>
                  <option value="warehouse" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Warehouse/Distribution</option>
                  <option value="retail" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Retail Store</option>
                  <option value="healthcare" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Healthcare Facility</option>
                  <option value="education" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Educational Institution</option>
                  <option value="government" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Government Building</option>
                  <option value="manufacturing" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Manufacturing Plant</option>
                  <option value="mixed" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Mixed Use Facility</option>
                  <option value="other" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Other</option>
                </select>
                {errors.facilityType && <p className="text-red-400 text-sm mt-1">{errors.facilityType}</p>}
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Total Square Footage *</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={data.squareFootage > 0 ? data.squareFootage.toString() : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    updateData('squareFootage', value === '' ? 0 : parseInt(value))
                  }}
                  placeholder="e.g., 25000"
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors ${
                    errors.squareFootage ? 'border-red-400' : 'border-white/30'
                  }`}
                />
                {errors.squareFootage && <p className="text-red-400 text-sm mt-1">{errors.squareFootage}</p>}
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Number of Buildings</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={data.buildingCount > 0 ? data.buildingCount.toString() : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    updateData('buildingCount', value === '' ? 1 : Math.max(1, parseInt(value)))
                  }}
                  placeholder="1"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Number of Floors</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={data.floorCount > 0 ? data.floorCount.toString() : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    updateData('floorCount', value === '' ? 1 : Math.max(1, parseInt(value)))
                  }}
                  placeholder="1"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Peak Occupancy</label>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={data.occupancy > 0 ? data.occupancy.toString() : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    updateData('occupancy', value === '' ? 0 : parseInt(value))
                  }}
                  placeholder="e.g., 150"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/90 font-medium mb-2">Operating Hours *</label>
                <select
                  value={data.operatingHours}
                  onChange={(e) => updateData('operatingHours', e.target.value)}
                  className={`w-full px-4 py-3 bg-gray-800/80 border rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors ${
                    errors.operatingHours ? 'border-red-400' : 'border-white/30'
                  }`}
                  style={{
                    colorScheme: 'dark'
                  }}
                >
                  <option value="" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Select operating hours...</option>
                  <option value="business" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Business Hours (8 AM - 6 PM)</option>
                  <option value="extended" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Extended Hours (6 AM - 10 PM)</option>
                  <option value="24-7" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>24/7 Operations</option>
                  <option value="variable" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Variable/Seasonal Hours</option>
                </select>
                {errors.operatingHours && <p className="text-red-400 text-sm mt-1">{errors.operatingHours}</p>}
              </div>
            </div>
          </div>
        )

      case 3: // Security Needs
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Security Requirements</h2>
              <p className="text-white/70 text-lg">What are your primary security concerns and existing systems?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white/90 font-medium mb-4">Current Security Systems (Select all that apply)</label>
                <div className="grid md:grid-cols-3 gap-3">
                  {[
                    'Access Control System',
                    'Security Cameras',
                    'Intrusion Detection',
                    'Fire Alarm System',
                    'Emergency Notification',
                    'Visitor Management',
                    'Security Guards',
                    'Perimeter Security',
                    'None - New Installation'
                  ].map(system => (
                    <label key={system} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                      <input
                        type="checkbox"
                        checked={data.currentSystems.includes(system)}
                        onChange={() => toggleArrayItem('currentSystems', system)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-white/90 text-sm">{system}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-4">Primary Security Concerns * (Select all that apply)</label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Unauthorized Access',
                    'Theft Prevention',
                    'Workplace Violence',
                    'Asset Protection',
                    'Compliance Requirements',
                    'Emergency Response',
                    'Visitor Safety',
                    'After-Hours Security',
                    'Data Center Protection',
                    'Perimeter Breaches'
                  ].map(concern => (
                    <label key={concern} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                      <input
                        type="checkbox"
                        checked={data.securityConcerns.includes(concern)}
                        onChange={() => toggleArrayItem('securityConcerns', concern)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-white/90 text-sm">{concern}</span>
                    </label>
                  ))}
                </div>
                {errors.securityConcerns && <p className="text-red-400 text-sm mt-1">{errors.securityConcerns}</p>}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/90 font-medium mb-2">Budget Range *</label>
                  <select
                    value={data.budgetRange}
                    onChange={(e) => updateData('budgetRange', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800/80 border rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors ${
                      errors.budgetRange ? 'border-red-400' : 'border-white/30'
                    }`}
                    style={{
                      colorScheme: 'dark'
                    }}
                  >
                    <option value="" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Select budget range...</option>
                    <option value="under-50k" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Under $50,000</option>
                    <option value="50k-100k" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>$50,000 - $100,000</option>
                    <option value="100k-250k" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>$100,000 - $250,000</option>
                    <option value="250k-500k" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>$250,000 - $500,000</option>
                    <option value="500k-1m" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>$500,000 - $1,000,000</option>
                    <option value="over-1m" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Over $1,000,000</option>
                  </select>
                  {errors.budgetRange && <p className="text-red-400 text-sm mt-1">{errors.budgetRange}</p>}
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Implementation Timeline *</label>
                  <select
                    value={data.timeline}
                    onChange={(e) => updateData('timeline', e.target.value)}
                    className={`w-full px-4 py-3 bg-gray-800/80 border rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors ${
                      errors.timeline ? 'border-red-400' : 'border-white/30'
                    }`}
                    style={{
                      colorScheme: 'dark'
                    }}
                  >
                    <option value="" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Select timeline...</option>
                    <option value="immediate" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Immediate (ASAP)</option>
                    <option value="30-days" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Within 30 days</option>
                    <option value="90-days" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Within 90 days</option>
                    <option value="6-months" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Within 6 months</option>
                    <option value="planning" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Still in planning phase</option>
                  </select>
                  {errors.timeline && <p className="text-red-400 text-sm mt-1">{errors.timeline}</p>}
                </div>
              </div>
            </div>
          </div>
        )

      case 4: // Compliance
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Compliance & Integration</h2>
              <p className="text-white/70 text-lg">Regulatory requirements and system integrations</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white/90 font-medium mb-4">Compliance Requirements (Select all that apply)</label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'HIPAA (Healthcare)',
                    'FERPA (Education)',
                    'CJIS (Law Enforcement)',
                    'SOX (Financial)',
                    'FISMA (Government)',
                    'PCI DSS (Payment Processing)',
                    'ISO 27001',
                    'SOC 2',
                    'Local Building Codes',
                    'Fire Department Requirements',
                    'ADA Compliance',
                    'None Required'
                  ].map(requirement => (
                    <label key={requirement} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                      <input
                        type="checkbox"
                        checked={data.complianceRequirements.includes(requirement)}
                        onChange={() => toggleArrayItem('complianceRequirements', requirement)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-white/90 text-sm">{requirement}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-4">Special Requirements</label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'High Security Zones',
                    'Clean Room Access',
                    'Hazardous Material Areas',
                    'Server Room Protection',
                    'Executive Protection',
                    'Parking Garage Security',
                    'Loading Dock Control',
                    'Outdoor Perimeter',
                    'Multi-Tenant Building',
                    'Historic Building Restrictions'
                  ].map(requirement => (
                    <label key={requirement} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                      <input
                        type="checkbox"
                        checked={data.specialRequirements.includes(requirement)}
                        onChange={() => toggleArrayItem('specialRequirements', requirement)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-white/90 text-sm">{requirement}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-4">System Integrations Needed</label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Active Directory/LDAP',
                    'HR System Integration',
                    'Building Management System',
                    'Fire Alarm System',
                    'Elevator Controls',
                    'Lighting Control',
                    'HVAC System',
                    'Emergency Notification',
                    'Video Management System',
                    'Central Station Monitoring',
                    'Mobile App Access',
                    'Third-Party Applications'
                  ].map(integration => (
                    <label key={integration} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                      <input
                        type="checkbox"
                        checked={data.integrationsNeeded.includes(integration)}
                        onChange={() => toggleArrayItem('integrationsNeeded', integration)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-white/90 text-sm">{integration}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 5: // Implementation
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Implementation Preferences</h2>
              <p className="text-white/70 text-lg">How would you like your security system implemented and maintained?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-white/90 font-medium mb-4">Implementation Approach</label>
                <div className="space-y-3">
                  {[
                    { value: 'phased', label: 'Phased Implementation', desc: 'Roll out in stages to minimize disruption' },
                    { value: 'all-at-once', label: 'Complete Installation', desc: 'Install entire system at once' },
                    { value: 'pilot', label: 'Pilot Program First', desc: 'Start with one area, then expand' },
                    { value: 'flexible', label: 'Flexible Approach', desc: 'Adapt based on operational needs' }
                  ].map(approach => (
                    <label key={approach.value} className="flex items-start gap-3 p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                      <input
                        type="radio"
                        name="implementationApproach"
                        value={approach.value}
                        checked={data.implementationApproach === approach.value}
                        onChange={(e) => updateData('implementationApproach', e.target.value)}
                        className="w-4 h-4 text-purple-600 mt-1"
                      />
                      <div>
                        <div className="text-white/90 font-medium">{approach.label}</div>
                        <div className="text-white/60 text-sm">{approach.desc}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-4">Training Needs (Select all that apply)</label>
                <div className="grid md:grid-cols-2 gap-3">
                  {[
                    'Administrator Training',
                    'End User Training',
                    'Security Guard Training',
                    'Maintenance Staff Training',
                    'Emergency Response Training',
                    'System Troubleshooting',
                    'Report Generation',
                    'Mobile App Usage',
                    'Ongoing Support Training',
                    'Train-the-Trainer Program'
                  ].map(training => (
                    <label key={training} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition-colors">
                      <input
                        type="checkbox"
                        checked={data.trainingNeeds.includes(training)}
                        onChange={() => toggleArrayItem('trainingNeeds', training)}
                        className="w-4 h-4 text-purple-600"
                      />
                      <span className="text-white/90 text-sm">{training}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white/90 font-medium mb-2">Maintenance Preference</label>
                  <select
                    value={data.maintenancePreference}
                    onChange={(e) => updateData('maintenancePreference', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/80 border border-white/30 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
                    style={{
                      colorScheme: 'dark'
                    }}
                  >
                    <option value="" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Select preference...</option>
                    <option value="in-house" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>In-House Maintenance</option>
                    <option value="vendor-contract" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Vendor Service Contract</option>
                    <option value="hybrid" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Hybrid Approach</option>
                    <option value="as-needed" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>As-Needed Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Monitoring Needs</label>
                  <select
                    value={data.monitoringNeeds}
                    onChange={(e) => updateData('monitoringNeeds', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800/80 border border-white/30 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
                    style={{
                      colorScheme: 'dark'
                    }}
                  >
                    <option value="" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Select monitoring...</option>
                    <option value="self-monitored" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Self-Monitored</option>
                    <option value="central-station" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Central Station Monitoring</option>
                    <option value="guard-service" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Guard Service Integration</option>
                    <option value="hybrid-monitoring" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>Hybrid Monitoring</option>
                    <option value="no-monitoring" style={{backgroundColor: '#1f2937', color: '#ffffff'}}>No External Monitoring</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 6: // Summary
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-white mb-4">Review & Generate Assessment</h2>
              <p className="text-white/70 text-lg">Review your information and generate your comprehensive security assessment</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-400" />
                    Project Overview
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Project:</span>
                      <span className="text-white">{data.projectName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Company:</span>
                      <span className="text-white">{data.companyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Contact:</span>
                      <span className="text-white">{data.contactName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Email:</span>
                      <span className="text-white">{data.contactEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-purple-400" />
                    Facility Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Type:</span>
                      <span className="text-white">{data.facilityType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Size:</span>
                      <span className="text-white">{data.squareFootage?.toLocaleString()} sq ft</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Buildings:</span>
                      <span className="text-white">{data.buildingCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Occupancy:</span>
                      <span className="text-white">{data.occupancy?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-400" />
                    Security Requirements
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/60">Budget:</span>
                      <span className="text-white">{data.budgetRange}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/60">Timeline:</span>
                      <span className="text-white">{data.timeline}</span>
                    </div>
                    <div className="pt-2">
                      <span className="text-white/60">Security Concerns:</span>
                      <div className="mt-1">
                        {data.securityConcerns.slice(0, 3).map(concern => (
                          <span key={concern} className="inline-block bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs mr-1 mb-1">
                            {concern}
                          </span>
                        ))}
                        {data.securityConcerns.length > 3 && (
                          <span className="text-white/40 text-xs">+{data.securityConcerns.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white/5 rounded-lg p-6">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-400" />
                    Compliance & Integration
                  </h3>
                  <div className="space-y-3">
                    {data.complianceRequirements.length > 0 && (
                      <div>
                        <span className="text-white/60 text-sm">Compliance:</span>
                        <div className="mt-1">
                          {data.complianceRequirements.slice(0, 3).map(req => (
                            <span key={req} className="inline-block bg-green-600/20 text-green-300 px-2 py-1 rounded text-xs mr-1 mb-1">
                              {req}
                            </span>
                          ))}
                          {data.complianceRequirements.length > 3 && (
                            <span className="text-white/40 text-xs">+{data.complianceRequirements.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}

                    {data.integrationsNeeded.length > 0 && (
                      <div>
                        <span className="text-white/60 text-sm">Integrations:</span>
                        <div className="mt-1">
                          {data.integrationsNeeded.slice(0, 3).map(integration => (
                            <span key={integration} className="inline-block bg-blue-600/20 text-blue-300 px-2 py-1 rounded text-xs mr-1 mb-1">
                              {integration}
                            </span>
                          ))}
                          {data.integrationsNeeded.length > 3 && (
                            <span className="text-white/40 text-xs">+{data.integrationsNeeded.length - 3} more</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg p-6">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Ready to Generate
                  </h3>
                  <p className="text-white/70 text-sm mb-4">
                    Your comprehensive security assessment will include:
                  </p>
                  <ul className="text-white/60 text-sm space-y-1 mb-6">
                    <li>• Executive summary & recommendations</li>
                    <li>• Detailed system specifications</li>
                    <li>• 3-tier pricing with live CDW data</li>
                    <li>• Implementation timeline & milestones</li>
                    <li>• Compliance documentation</li>
                    <li>• Professional proposal package</li>
                  </ul>
                  <button
                    onClick={generateAssessment}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:from-purple-700 hover:to-blue-700 transition-all hover:scale-105"
                  >
                    🚀 Generate My Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-3 text-center">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Main</span>
          </Link>
          <div className="flex-1 text-center">
            <span className="font-bold text-lg">🚀 AI DISCOVERY ASSISTANT</span>
            <span className="ml-2">Structured Security Assessment</span>
          </div>
          <div className="text-sm">
            Step {currentStep + 1} of {steps.length}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-8 py-12">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isActive = index === currentStep
              const isCompleted = index < currentStep

              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all ${
                    isActive ? 'bg-purple-600 border-purple-600 text-white' :
                    isCompleted ? 'bg-green-600 border-green-600 text-white' :
                    'border-white/30 text-white/60'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-white/70'}`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${isCompleted ? 'bg-green-600' : 'bg-white/30'}`} />
                  )}
                </div>
              )
            })}
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-8">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/30 text-white rounded-lg hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-5 h-5" />
            Previous
          </button>

          <div className="text-white/60 text-sm">
            {currentStep + 1} of {steps.length} steps completed
          </div>

          {currentStep < steps.length - 1 ? (
            <button
              onClick={nextStep}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all font-semibold"
            >
              Next
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-24" /> // Spacer for layout
          )}
        </div>
      </div>
    </div>
  )
}