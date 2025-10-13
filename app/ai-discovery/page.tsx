"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, CheckCircle, Building2, Users, Shield, MapPin, Clock, DollarSign, FileText, AlertTriangle } from 'lucide-react'

interface DiscoveryData {
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
  { id: 'basics', title: 'Project Basics', icon: Building2 },
  { id: 'facility', title: 'Facility Details', icon: MapPin },
  { id: 'security', title: 'Security Needs', icon: Shield },
  { id: 'compliance', title: 'Compliance', icon: FileText },
  { id: 'implementation', title: 'Implementation', icon: Clock },
  { id: 'summary', title: 'Review & Generate', icon: CheckCircle }
]

export default function AIDiscoveryPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [data, setData] = useState<DiscoveryData>({
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

  // Check for handoff data from security estimate
  useEffect(() => {
    const handoffData = sessionStorage.getItem('estimateHandoff')
    if (handoffData) {
      try {
        const parsedData = JSON.parse(handoffData)
        setData(prev => ({
          ...prev,
          companyName: parsedData.contactInfo?.companyName || '',
          contactName: parsedData.contactInfo?.name || '',
          contactEmail: parsedData.contactInfo?.email || '',
          squareFootage: parsedData.facilitySize || 0,
          facilityType: 'Mixed Use Facility'
        }))
        sessionStorage.removeItem('estimateHandoff')
      } catch (error) {
        console.error('Error parsing handoff data:', error)
      }
    }
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
      case 0: // Project Basics
        if (!data.projectName.trim()) newErrors.projectName = 'Project name is required'
        if (!data.companyName.trim()) newErrors.companyName = 'Company name is required'
        if (!data.contactName.trim()) newErrors.contactName = 'Contact name is required'
        if (!data.contactEmail.trim()) newErrors.contactEmail = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(data.contactEmail)) newErrors.contactEmail = 'Valid email is required'
        break

      case 1: // Facility Information
        if (!data.facilityType) newErrors.facilityType = 'Facility type is required'
        if (!data.squareFootage) newErrors.squareFootage = 'Square footage is required'
        if (!data.operatingHours) newErrors.operatingHours = 'Operating hours are required'
        break

      case 2: // Security Needs
        if (data.securityConcerns.length === 0) newErrors.securityConcerns = 'Select at least one security concern'
        if (!data.budgetRange) newErrors.budgetRange = 'Budget range is required'
        if (!data.timeline) newErrors.timeline = 'Timeline is required'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0))
  }

  const generateAssessment = async () => {
    // Validate final step before submission
    if (!data.projectName || !data.companyName || !data.contactEmail) {
      alert('Please ensure all required fields are completed.')
      return
    }

    try {
      // Store discovery data for results page
      sessionStorage.setItem('discoveryAssessmentData', JSON.stringify(data))

      const response = await fetch('/api/ai-assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_discovery_assessment',
          discoveryData: data
        })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          // Store results and redirect
          sessionStorage.setItem('assessmentResults', JSON.stringify(result))
          window.location.href = '/ai-discovery-results'
        } else {
          throw new Error(result.error || 'Assessment generation failed')
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Failed to generate assessment:', error)
      alert(`Assessment generation failed: ${error.message}`)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Project Basics
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

      case 1: // Facility Information
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
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors ${
                    errors.facilityType ? 'border-red-400' : 'border-white/30'
                  }`}
                >
                  <option value="">Select facility type...</option>
                  <option value="office">Office Building</option>
                  <option value="warehouse">Warehouse/Distribution</option>
                  <option value="retail">Retail Store</option>
                  <option value="healthcare">Healthcare Facility</option>
                  <option value="education">Educational Institution</option>
                  <option value="government">Government Building</option>
                  <option value="manufacturing">Manufacturing Plant</option>
                  <option value="mixed">Mixed Use Facility</option>
                  <option value="other">Other</option>
                </select>
                {errors.facilityType && <p className="text-red-400 text-sm mt-1">{errors.facilityType}</p>}
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Total Square Footage *</label>
                <input
                  type="number"
                  value={data.squareFootage || ''}
                  onChange={(e) => updateData('squareFootage', parseInt(e.target.value) || 0)}
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
                  type="number"
                  value={data.buildingCount}
                  onChange={(e) => updateData('buildingCount', parseInt(e.target.value) || 1)}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Number of Floors</label>
                <input
                  type="number"
                  value={data.floorCount}
                  onChange={(e) => updateData('floorCount', parseInt(e.target.value) || 1)}
                  placeholder="1"
                  min="1"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Peak Occupancy</label>
                <input
                  type="number"
                  value={data.occupancy || ''}
                  onChange={(e) => updateData('occupancy', parseInt(e.target.value) || 0)}
                  placeholder="e.g., 150"
                  className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-white/90 font-medium mb-2">Operating Hours *</label>
                <select
                  value={data.operatingHours}
                  onChange={(e) => updateData('operatingHours', e.target.value)}
                  className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors ${
                    errors.operatingHours ? 'border-red-400' : 'border-white/30'
                  }`}
                >
                  <option value="">Select operating hours...</option>
                  <option value="business">Business Hours (8 AM - 6 PM)</option>
                  <option value="extended">Extended Hours (6 AM - 10 PM)</option>
                  <option value="24-7">24/7 Operations</option>
                  <option value="variable">Variable/Seasonal Hours</option>
                </select>
                {errors.operatingHours && <p className="text-red-400 text-sm mt-1">{errors.operatingHours}</p>}
              </div>
            </div>
          </div>
        )

      case 2: // Security Needs
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
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors ${
                      errors.budgetRange ? 'border-red-400' : 'border-white/30'
                    }`}
                  >
                    <option value="">Select budget range...</option>
                    <option value="under-50k">Under $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="100k-250k">$100,000 - $250,000</option>
                    <option value="250k-500k">$250,000 - $500,000</option>
                    <option value="500k-1m">$500,000 - $1,000,000</option>
                    <option value="over-1m">Over $1,000,000</option>
                  </select>
                  {errors.budgetRange && <p className="text-red-400 text-sm mt-1">{errors.budgetRange}</p>}
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Implementation Timeline *</label>
                  <select
                    value={data.timeline}
                    onChange={(e) => updateData('timeline', e.target.value)}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors ${
                      errors.timeline ? 'border-red-400' : 'border-white/30'
                    }`}
                  >
                    <option value="">Select timeline...</option>
                    <option value="immediate">Immediate (ASAP)</option>
                    <option value="30-days">Within 30 days</option>
                    <option value="90-days">Within 90 days</option>
                    <option value="6-months">Within 6 months</option>
                    <option value="planning">Still in planning phase</option>
                  </select>
                  {errors.timeline && <p className="text-red-400 text-sm mt-1">{errors.timeline}</p>}
                </div>
              </div>
            </div>
          </div>
        )

      case 3: // Compliance
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

      case 4: // Implementation
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
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
                  >
                    <option value="">Select preference...</option>
                    <option value="in-house">In-House Maintenance</option>
                    <option value="vendor-contract">Vendor Service Contract</option>
                    <option value="hybrid">Hybrid Approach</option>
                    <option value="as-needed">As-Needed Service</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Monitoring Needs</label>
                  <select
                    value={data.monitoringNeeds}
                    onChange={(e) => updateData('monitoringNeeds', e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg text-white focus:outline-none focus:border-purple-400 transition-colors"
                  >
                    <option value="">Select monitoring...</option>
                    <option value="self-monitored">Self-Monitored</option>
                    <option value="central-station">Central Station Monitoring</option>
                    <option value="guard-service">Guard Service Integration</option>
                    <option value="hybrid-monitoring">Hybrid Monitoring</option>
                    <option value="no-monitoring">No External Monitoring</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )

      case 5: // Summary
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