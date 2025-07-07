"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AssessmentPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [assessment, setAssessment] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate AI processing
    setTimeout(() => {
      setAssessment(`
# Security Assessment Report

## Executive Summary
Based on your facility requirements, we've identified key security vulnerabilities and recommend a comprehensive security solution.

## Recommended Solutions
- **IP Camera System**: 16 high-resolution cameras with night vision
- **Access Control**: Card-based entry system for 8 doors
- **Intrusion Detection**: Motion sensors and glass break detectors
- **Video Management**: Professional NVR with 30-day storage

## Investment Summary
- Equipment Cost: $15,000 - $20,000
- Installation: $5,000 - $7,500
- Total Investment: $20,000 - $27,500

## Next Steps
1. Site survey and detailed design
2. Equipment procurement
3. Professional installation
4. Training and handover
      `)
      setIsLoading(false)
    }, 3000)
  }

  if (assessment) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-purple-600">Your Security Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg">{assessment}</pre>
              </div>
              <div className="mt-6 flex gap-4">
                <Button onClick={() => alert("Downloading PDF... (Demo)")}>Download PDF</Button>
                <Button variant="outline" onClick={() => alert("Sending email... (Demo)")}>
                  Email Report
                </Button>
                <Button variant="outline" onClick={() => setAssessment(null)}>
                  New Assessment
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-purple-600">Security Assessment Form</CardTitle>
            <p className="text-gray-600">Tell us about your facility and security needs</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="facilityType">Facility Type</Label>
                  <Select required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select facility type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="office">Office Building</SelectItem>
                      <SelectItem value="retail">Retail Store</SelectItem>
                      <SelectItem value="warehouse">Warehouse</SelectItem>
                      <SelectItem value="manufacturing">Manufacturing</SelectItem>
                      <SelectItem value="healthcare">Healthcare</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="squareFootage">Square Footage</Label>
                  <Input id="squareFootage" type="number" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="budget">Budget Range</Label>
                  <Select required>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-10k">Under $10,000</SelectItem>
                      <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                      <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                      <SelectItem value="50k-100k">$50,000 - $100,000</SelectItem>
                      <SelectItem value="over-100k">Over $100,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="currentSecurity">Current Security Measures</Label>
                <Textarea
                  id="currentSecurity"
                  placeholder="Describe your current security systems (cameras, alarms, access control, etc.)"
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="securityConcerns">Primary Security Concerns</Label>
                <Textarea
                  id="securityConcerns"
                  placeholder="What are your main security concerns? (theft, vandalism, employee safety, etc.)"
                  className="mt-1"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="timeline">Implementation Timeline</Label>
                <Select required>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="When do you need this implemented?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asap">ASAP</SelectItem>
                    <SelectItem value="1-month">Within 1 month</SelectItem>
                    <SelectItem value="3-months">Within 3 months</SelectItem>
                    <SelectItem value="6-months">Within 6 months</SelectItem>
                    <SelectItem value="planning">Just planning ahead</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Contact Name</Label>
                  <Input id="contactName" required className="mt-1" />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Phone Number</Label>
                  <Input id="contactPhone" type="tel" required className="mt-1" />
                </div>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating Assessment...
                  </>
                ) : (
                  "Generate AI Security Assessment"
                )}
              </Button>
            </form>

            {isLoading && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
                  <div>
                    <p className="font-medium text-blue-900">AI Analysis in Progress</p>
                    <p className="text-sm text-blue-700">
                      Our AI is analyzing your facility requirements and generating a comprehensive security
                      assessment...
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
