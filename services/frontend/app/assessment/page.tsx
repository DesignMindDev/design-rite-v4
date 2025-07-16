"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, Building2, Shield, DollarSign, MapPin } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface AssessmentData {
  // Company Information
  companyName: string
  contactName: string
  email: string
  phone: string
  jobTitle: string

  // Facility Information
  facilityType: string
  squareFootage: string
  address: string
  operatingHours: string
  employeeCount: string

  // Current Security
  currentSecurity: string[]
  securityBudget: string
  hasSecurityStaff: boolean
  currentVendor: string

  // Security Concerns
  primaryConcerns: string[]
  specificIncidents: string
  complianceRequirements: string[]

  // Project Details
  timeline: string
  budget: string
  decisionMakers: string
  additionalNotes: string
}

const facilityTypes = [
  "Office Building",
  "Retail Store",
  "Warehouse/Distribution",
  "Manufacturing Plant",
  "Healthcare Facility",
  "Educational Institution",
  "Government Building",
  "Multi-tenant Building",
  "Data Center",
  "Other",
]

const securityConcerns = [
  "Theft Prevention",
  "Access Control",
  "Employee Safety",
  "Vandalism",
  "Compliance Requirements",
  "After-hours Security",
  "Visitor Management",
  "Perimeter Security",
  "Internal Monitoring",
  "Emergency Response",
]

const currentSecurityOptions = [
  "Basic Alarm System",
  "CCTV Cameras",
  "Access Control Cards",
  "Security Guards",
  "Motion Detectors",
  "Door/Window Sensors",
  "Fire Alarm System",
  "Intercom System",
  "None",
  "Other",
]

const complianceOptions = [
  "HIPAA (Healthcare)",
  "PCI DSS (Payment)",
  "SOX (Financial)",
  "FERPA (Educational)",
  "Government/Military",
  "Insurance Requirements",
  "Industry Specific",
  "None Required",
]

export default function AssessmentPage() {
  const [formData, setFormData] = useState<AssessmentData>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    jobTitle: "",
    facilityType: "",
    squareFootage: "",
    address: "",
    operatingHours: "",
    employeeCount: "",
    currentSecurity: [],
    securityBudget: "",
    hasSecurityStaff: false,
    currentVendor: "",
    primaryConcerns: [],
    specificIncidents: "",
    complianceRequirements: [],
    timeline: "",
    budget: "",
    decisionMakers: "",
    additionalNotes: "",
  })

  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [assessmentResult, setAssessmentResult] = useState(null)

  const totalSteps = 4

  const handleInputChange = (field: keyof AssessmentData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleArrayChange = (field: keyof AssessmentData, value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field] as string[]), value]
        : (prev[field] as string[]).filter((item) => item !== value),
    }))
  }

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.companyName && formData.contactName && formData.email && formData.phone)
      case 2:
        return !!(formData.facilityType && formData.squareFootage)
      case 3:
        return formData.primaryConcerns.length > 0
      case 4:
        return !!(formData.timeline && formData.budget)
      default:
        return true
    }
  }

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submitAssessment = async () => {
    setIsSubmitting(true)
    setSubmitError("")

    try {
      const response = await fetch("/api/assessments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: formData.companyName,
          facilityType: formData.facilityType,
          squareFootage: formData.squareFootage,
          currentSecurity: formData.currentSecurity.join(", "),
          securityConcerns: formData.primaryConcerns.join(", "),
          budget: formData.budget,
          timeline: formData.timeline,
          contactInfo: {
            name: formData.contactName,
            email: formData.email,
            phone: formData.phone,
            jobTitle: formData.jobTitle,
            address: formData.address,
          },
          additionalDetails: {
            operatingHours: formData.operatingHours,
            employeeCount: formData.employeeCount,
            hasSecurityStaff: formData.hasSecurityStaff,
            currentVendor: formData.currentVendor,
            specificIncidents: formData.specificIncidents,
            complianceRequirements: formData.complianceRequirements.join(", "),
            decisionMakers: formData.decisionMakers,
            additionalNotes: formData.additionalNotes,
          },
        }),
      })

      if (!response.ok) {
        throw new Error("Assessment submission failed")
      }

      const result = await response.json()
      setAssessmentResult(result)
    } catch (error) {
      setSubmitError("Failed to submit assessment. Please try again.")
      console.error("Assessment submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (assessmentResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center bg-green-50">
              <CardTitle className="text-2xl text-green-800">Assessment Complete!</CardTitle>
              <CardDescription>Your security assessment has been generated</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="text-center">
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                    Lead Score: {assessmentResult.assessment?.leadScore || "N/A"}/100
                  </Badge>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">Next Steps:</h3>
                  <p className="text-blue-800">
                    Our security experts will review your assessment and contact you within 24 hours to discuss your
                    customized security solution.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Assessment ID</h4>
                    <p className="text-sm text-gray-600">{assessmentResult.assessment?.id}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Company</h4>
                    <p className="text-sm text-gray-600">{assessmentResult.assessment?.companyName}</p>
                  </div>
                </div>

                <div className="text-center">
                  <Button onClick={() => window.location.reload()} className="mr-4">
                    New Assessment
                  </Button>
                  <Button variant="outline" onClick={() => window.print()}>
                    Print Results
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Security Assessment</h1>
          <p className="text-gray-600">Get your personalized security evaluation in minutes</p>

          {/* Progress Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>
                Step {currentStep} of {totalSteps}
              </span>
              <span>{Math.round((currentStep / totalSteps) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {currentStep === 1 && (
                <>
                  <Building2 className="h-5 w-5" /> Company Information
                </>
              )}
              {currentStep === 2 && (
                <>
                  <MapPin className="h-5 w-5" /> Facility Details
                </>
              )}
              {currentStep === 3 && (
                <>
                  <Shield className="h-5 w-5" /> Security Requirements
                </>
              )}
              {currentStep === 4 && (
                <>
                  <DollarSign className="h-5 w-5" /> Project Details
                </>
              )}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {submitError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{submitError}</AlertDescription>
              </Alert>
            )}

            {/* Step 1: Company Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => handleInputChange("companyName", e.target.value)}
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      value={formData.contactName}
                      onChange={(e) => handleInputChange("contactName", e.target.value)}
                      placeholder="Your Full Name"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@company.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="(555) 123-4567"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="jobTitle">Job Title</Label>
                    <Input
                      id="jobTitle"
                      value={formData.jobTitle}
                      onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                      placeholder="Your Job Title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address">Facility Address</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder="Street Address, City, State"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Facility Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="facilityType">Facility Type *</Label>
                    <Select
                      value={formData.facilityType}
                      onValueChange={(value) => handleInputChange("facilityType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select facility type" />
                      </SelectTrigger>
                      <SelectContent>
                        {facilityTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="squareFootage">Square Footage *</Label>
                    <Input
                      id="squareFootage"
                      value={formData.squareFootage}
                      onChange={(e) => handleInputChange("squareFootage", e.target.value)}
                      placeholder="e.g., 10,000"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="operatingHours">Operating Hours</Label>
                    <Input
                      id="operatingHours"
                      value={formData.operatingHours}
                      onChange={(e) => handleInputChange("operatingHours", e.target.value)}
                      placeholder="e.g., 8 AM - 6 PM, Mon-Fri"
                    />
                  </div>
                  <div>
                    <Label htmlFor="employeeCount">Number of Employees</Label>
                    <Input
                      id="employeeCount"
                      value={formData.employeeCount}
                      onChange={(e) => handleInputChange("employeeCount", e.target.value)}
                      placeholder="e.g., 50"
                    />
                  </div>
                </div>

                <div>
                  <Label>Current Security Systems</Label>
                  <div className="grid md:grid-cols-2 gap-2 mt-2">
                    {currentSecurityOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={option}
                          checked={formData.currentSecurity.includes(option)}
                          onCheckedChange={(checked) =>
                            handleArrayChange("currentSecurity", option, checked as boolean)
                          }
                        />
                        <Label htmlFor={option} className="text-sm">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="hasSecurityStaff"
                      checked={formData.hasSecurityStaff}
                      onCheckedChange={(checked) => handleInputChange("hasSecurityStaff", checked)}
                    />
                    <Label htmlFor="hasSecurityStaff">We have security staff</Label>
                  </div>
                  <div>
                    <Label htmlFor="currentVendor">Current Security Vendor</Label>
                    <Input
                      id="currentVendor"
                      value={formData.currentVendor}
                      onChange={(e) => handleInputChange("currentVendor", e.target.value)}
                      placeholder="Current vendor name (if any)"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Security Requirements */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div>
                  <Label>Primary Security Concerns *</Label>
                  <p className="text-sm text-gray-600 mb-3">Select all that apply</p>
                  <div className="grid md:grid-cols-2 gap-2">
                    {securityConcerns.map((concern) => (
                      <div key={concern} className="flex items-center space-x-2">
                        <Checkbox
                          id={concern}
                          checked={formData.primaryConcerns.includes(concern)}
                          onCheckedChange={(checked) =>
                            handleArrayChange("primaryConcerns", concern, checked as boolean)
                          }
                        />
                        <Label htmlFor={concern} className="text-sm">
                          {concern}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="specificIncidents">Specific Security Incidents or Concerns</Label>
                  <Textarea
                    id="specificIncidents"
                    value={formData.specificIncidents}
                    onChange={(e) => handleInputChange("specificIncidents", e.target.value)}
                    placeholder="Describe any recent incidents or specific areas of concern..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Compliance Requirements</Label>
                  <div className="grid md:grid-cols-2 gap-2 mt-2">
                    {complianceOptions.map((compliance) => (
                      <div key={compliance} className="flex items-center space-x-2">
                        <Checkbox
                          id={compliance}
                          checked={formData.complianceRequirements.includes(compliance)}
                          onCheckedChange={(checked) =>
                            handleArrayChange("complianceRequirements", compliance, checked as boolean)
                          }
                        />
                        <Label htmlFor={compliance} className="text-sm">
                          {compliance}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Project Details */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="timeline">Implementation Timeline *</Label>
                    <Select value={formData.timeline} onValueChange={(value) => handleInputChange("timeline", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asap">ASAP (Within 30 days)</SelectItem>
                        <SelectItem value="1-3months">1-3 months</SelectItem>
                        <SelectItem value="3-6months">3-6 months</SelectItem>
                        <SelectItem value="6-12months">6-12 months</SelectItem>
                        <SelectItem value="planning">Just planning/researching</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="budget">Budget Range *</Label>
                    <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-10k">Under $10,000</SelectItem>
                        <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                        <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                        <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                        <SelectItem value="100k-250k">$100,000 - $250,000</SelectItem>
                        <SelectItem value="over-250k">Over $250,000</SelectItem>
                        <SelectItem value="tbd">To be determined</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="decisionMakers">Decision Makers</Label>
                  <Input
                    id="decisionMakers"
                    value={formData.decisionMakers}
                    onChange={(e) => handleInputChange("decisionMakers", e.target.value)}
                    placeholder="Who else is involved in the decision process?"
                  />
                </div>

                <div>
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={(e) => handleInputChange("additionalNotes", e.target.value)}
                    placeholder="Any additional information that would help us provide a better assessment..."
                    rows={4}
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t">
              <Button variant="outline" onClick={prevStep} disabled={currentStep === 1}>
                Previous
              </Button>

              {currentStep < totalSteps ? (
                <Button onClick={nextStep} disabled={!validateStep(currentStep)}>
                  Next Step
                </Button>
              ) : (
                <Button
                  onClick={submitAssessment}
                  disabled={!validateStep(currentStep) || isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Generating Assessment...
                    </>
                  ) : (
                    "Generate Assessment"
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
