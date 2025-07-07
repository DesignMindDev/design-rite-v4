const express = require("express")
const { createClient } = require("@supabase/supabase-js")
const { Anthropic } = require("@anthropic-ai/sdk")
const OpenAI = require("openai")
const { verifyToken } = require("./auth")
const router = express.Router()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY)

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Create new assessment
router.post("/create", verifyToken, async (req, res) => {
  try {
    const {
      companyName,
      facilityType,
      squareFootage,
      currentSecurity,
      securityConcerns,
      budget,
      timeline,
      contactInfo,
    } = req.body

    // Get user to check trial status
    const { data: user } = await supabase
      .from("users")
      .select("subscription_tier, trial_assessments_remaining")
      .eq("id", req.user.userId)
      .single()

    // Check if user can create assessment
    if (user.subscription_tier === "trial" && user.trial_assessments_remaining <= 0) {
      return res.status(403).json({
        error: "Trial assessments exhausted. Please upgrade to continue.",
      })
    }

    // Generate assessment with Claude
    const assessmentPrompt = `
You are a professional security consultant. Create a comprehensive security assessment for:

Company: ${companyName}
Facility Type: ${facilityType}
Square Footage: ${squareFootage}
Current Security: ${currentSecurity}
Security Concerns: ${securityConcerns}
Budget: ${budget}
Timeline: ${timeline}

Provide a detailed assessment including:
1. Executive Summary
2. Current Security Analysis
3. Recommended Solutions
4. Equipment Specifications
5. Implementation Timeline
6. Investment Summary
7. Next Steps

Format as professional business proposal.
`

    const claudeResponse = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: assessmentPrompt,
        },
      ],
    })

    const assessmentContent = claudeResponse.content[0].text

    // Generate technical specifications with OpenAI
    const techSpecsPrompt = `
Based on this security assessment, provide detailed technical specifications:

${assessmentContent.substring(0, 1000)}...

Include specific:
- Camera models and quantities
- Access control hardware
- Network infrastructure requirements
- Installation specifications
- Compliance requirements
`

    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "user",
          content: techSpecsPrompt,
        },
      ],
      max_tokens: 2000,
    })

    const technicalSpecs = openaiResponse.choices[0].message.content

    // Save assessment to database
    const { data: assessment, error } = await supabase
      .from("assessments")
      .insert([
        {
          user_id: req.user.userId,
          company_name: companyName,
          facility_type: facilityType,
          square_footage: squareFootage,
          current_security: currentSecurity,
          security_concerns: securityConcerns,
          budget,
          timeline,
          contact_info: contactInfo,
          assessment_content: assessmentContent,
          technical_specifications: technicalSpecs,
          status: "completed",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return res.status(500).json({ error: "Failed to save assessment" })
    }

    // Update trial count if applicable
    if (user.subscription_tier === "trial") {
      await supabase
        .from("users")
        .update({
          trial_assessments_remaining: user.trial_assessments_remaining - 1,
        })
        .eq("id", req.user.userId)
    }

    // Trigger n8n workflow if configured
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        const axios = require("axios")
        await axios.post(`${process.env.N8N_WEBHOOK_URL}/webhook/assessment-complete`, {
          assessmentId: assessment.id,
          userId: req.user.userId,
          companyName,
          contactInfo,
          assessmentContent,
          technicalSpecs,
        })
      } catch (webhookError) {
        console.error("Webhook error:", webhookError)
        // Don't fail the request if webhook fails
      }
    }

    res.status(201).json({
      message: "Assessment created successfully",
      assessment: {
        id: assessment.id,
        companyName: assessment.company_name,
        status: assessment.status,
        content: assessmentContent,
        technicalSpecs,
        createdAt: assessment.created_at,
      },
      remainingTrialAssessments: user.subscription_tier === "trial" ? user.trial_assessments_remaining - 1 : null,
    })
  } catch (error) {
    console.error("Assessment creation error:", error)
    res.status(500).json({ error: "Failed to create assessment" })
  }
})

// Get user's assessments
router.get("/list", verifyToken, async (req, res) => {
  try {
    const { data: assessments, error } = await supabase
      .from("assessments")
      .select("id, company_name, facility_type, status, created_at")
      .eq("user_id", req.user.userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return res.status(500).json({ error: "Failed to fetch assessments" })
    }

    res.json({ assessments })
  } catch (error) {
    console.error("List assessments error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// Get specific assessment
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { data: assessment, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", req.params.id)
      .eq("user_id", req.user.userId)
      .single()

    if (error || !assessment) {
      return res.status(404).json({ error: "Assessment not found" })
    }

    res.json({ assessment })
  } catch (error) {
    console.error("Get assessment error:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

module.exports = router
