import { anthropic } from "@ai-sdk/anthropic"
import { openai } from "@ai-sdk/openai"
import { generateText, streamText } from "ai"

// AI Configuration
const CLAUDE_MODEL = "claude-3-5-sonnet-20241022"
const OPENAI_MODEL = "gpt-4-turbo-preview"

export interface AssessmentInput {
  companyName: string
  facilityType: string
  squareFootage: number
  currentSecurity: string
  securityConcerns: string
  budget: string
  timeline: string
  contactInfo: {
    name: string
    phone: string
    email: string
  }
}

export async function generateSecurityAssessment(input: AssessmentInput) {
  const prompt = `
You are a professional security consultant with 20+ years of experience. Create a comprehensive security assessment for:

Company: ${input.companyName}
Facility Type: ${input.facilityType}
Square Footage: ${input.squareFootage}
Current Security: ${input.currentSecurity}
Security Concerns: ${input.securityConcerns}
Budget: ${input.budget}
Timeline: ${input.timeline}

Provide a detailed assessment including:

# Executive Summary
Brief overview of findings and recommendations

# Current Security Analysis
- Strengths of existing systems
- Identified vulnerabilities
- Risk assessment

# Recommended Solutions
- Specific equipment recommendations
- Technology specifications
- Integration requirements

# Implementation Plan
- Phase-by-phase rollout
- Timeline and milestones
- Resource requirements

# Investment Analysis
- Equipment costs (itemized)
- Installation costs
- Ongoing maintenance
- ROI projections

# Next Steps
- Immediate actions
- Long-term strategy
- Contact information for follow-up

Format as a professional business proposal with clear sections and actionable recommendations.
`

  try {
    const { text } = await generateText({
      model: anthropic(CLAUDE_MODEL),
      prompt,
      maxTokens: 4000,
    })

    return {
      success: true,
      assessment: text,
      model: CLAUDE_MODEL,
    }
  } catch (error) {
    console.error("AI Assessment Error:", error)
    return {
      success: false,
      error: "Failed to generate assessment",
      assessment: null,
    }
  }
}

export async function generateTechnicalSpecs(assessmentSummary: string) {
  const prompt = `
Based on this security assessment summary, provide detailed technical specifications:

${assessmentSummary}

Include specific:
- Camera models, quantities, and placement
- Access control hardware specifications
- Network infrastructure requirements
- Storage and backup solutions
- Installation and configuration details
- Compliance and certification requirements
- Maintenance and support recommendations

Format as a technical specification document.
`

  try {
    const { text } = await generateText({
      model: openai(OPENAI_MODEL),
      prompt,
      maxTokens: 2000,
    })

    return {
      success: true,
      specifications: text,
      model: OPENAI_MODEL,
    }
  } catch (error) {
    console.error("Technical Specs Error:", error)
    return {
      success: false,
      error: "Failed to generate technical specifications",
      specifications: null,
    }
  }
}

// Streaming assessment for real-time updates
export async function streamSecurityAssessment(input: AssessmentInput) {
  const prompt = `Generate a comprehensive security assessment for ${input.companyName}...`

  return streamText({
    model: anthropic(CLAUDE_MODEL),
    prompt,
    maxTokens: 4000,
  })
}
