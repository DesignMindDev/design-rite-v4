const express = require("express")
const { createClient } = require("@supabase/supabase-js")
const OpenAI = require("openai")
const router = express.Router()

// Initialize Supabase with fallback to ANON_KEY if SERVICE_KEY not available
const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY
)

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Simple auth middleware - replace with proper auth later
const verifyToken = (req, res, next) => {
  // For now, just pass through - implement proper JWT verification later
  req.user = { userId: 'demo-user-id' }
  next()
}

// Health check endpoint for assessments
router.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    service: "AI Assessment Agent",
    timestamp: new Date().toISOString(),
    ai_services: {
      openai: process.env.OPENAI_API_KEY ? "configured" : "not configured",
      claude: process.env.CLAUDE_API_KEY ? "configured" : "not configured",
      supabase: process.env.SUPABASE_URL ? "configured" : "not configured",
    },
  })
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

    // Validate required fields
    if (!companyName || !facilityType || !securityConcerns) {
      return res.status(400).json({
        error: "Company name, facility type, and security concerns are required",
      })
    }

    console.log(`🔍 Generating AI assessment for: ${companyName} (${facilityType})`)

    // For demo/testing - use a simpler prompt if no user data
    const userSubscriptionTier = "professional" // Default for testing

    // Generate assessment with OpenAI
    const assessmentPrompt = `
You are a professional security consultant with 20+ years of experience. Create a comprehensive security assessment for:

Company: ${companyName}
Facility Type: ${facilityType}
Square Footage: ${squareFootage || "Not specified"}
Current Security: ${currentSecurity || "Not specified"}
Security Concerns: ${securityConcerns}
Budget: ${budget || "Not specified"}
Timeline: ${timeline || "Not specified"}

Provide a detailed assessment in JSON format with the following structure:
{
  "executiveSummary": "Brief overview of findings and recommendations",
  "currentAnalysis": {
    "strengths": ["List of current security strengths"],
    "vulnerabilities": ["List of identified vulnerabilities"],
    "riskLevel": "High/Medium/Low"
  },
  "recommendations": {
    "cameras": {
      "quantity": "number",
      "type": "IP cameras with specifications",
      "placement": ["Strategic locations"]
    },
    "accessControl": {
      "type": "Card/Biometric/etc",
      "points": ["Entry points to secure"]
    },
    "alarm": {
      "type": "Motion/Glass break/etc",
      "zones": ["Areas to monitor"]
    }
  },
  "implementation": {
    "phase1": "Immediate priorities",
    "phase2": "Core installation",
    "phase3": "Advanced features",
    "timeline": "Estimated completion time"
  },
  "investment": {
    "equipment": "Equipment cost estimate",
    "installation": "Installation cost estimate",
    "monthly": "Monthly monitoring cost",
    "total": "Total project cost"
  },
  "leadScore": 0-100,
  "nextSteps": ["Recommended next actions"]
}`

    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Using 3.5 for cost efficiency
      messages: [
        {
          role: "system",
          content: "You are a professional security consultant. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: assessmentPrompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.3,
    })

    let assessmentData
    try {
      assessmentData = JSON.parse(openaiResponse.choices[0].message.content)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      assessmentData = {
        executiveSummary: openaiResponse.choices[0].message.content,
        leadScore: 75,
        nextSteps: ["Schedule consultation", "Provide detailed proposal"],
      }
    }

    // Calculate lead score if not provided
    const leadScore = assessmentData.leadScore || calculateLeadScore({
      facilityType,
      squareFootage,
      budget,
      timeline,
      securityConcerns,
    })

    // Generate a unique ID for the assessment
    const assessmentId = `assess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Save to database if Supabase is configured
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      try {
        const { data, error } = await supabase
          .from("assessments")
          .insert([
            {
              id: assessmentId,
              user_id: req.user.userId,
              company_name: companyName,
              facility_type: facilityType,
              square_footage: parseInt(squareFootage) || null,
              current_security: currentSecurity,
              security_concerns: securityConcerns,
              budget,
              timeline,
              contact_info: contactInfo,
              assessment_content: JSON.stringify(assessmentData),
              lead_score: leadScore,
              status: "completed",
              ai_model_used: "gpt-3.5-turbo",
              created_at: new Date().toISOString(),
            },
          ])
          .select()
          .single()

        if (error) {
          console.error("Database save error:", error)
          // Continue without saving - don't fail the whole request
        }
      } catch (dbError) {
        console.error("Database connection error:", dbError)
        // Continue without saving
      }
    }

    console.log(`✅ Assessment generated successfully for ${companyName} - Lead Score: ${leadScore}`)

    // Return the assessment
    res.status(201).json({
      success: true,
      message: "Assessment created successfully",
      assessment: {
        id: assessmentId,
        companyName,
        facilityType,
        leadScore,
        assessmentData,
        status: "completed",
        createdAt: new Date().toISOString(),
      },
      userStatus: {
        subscriptionTier: userSubscriptionTier,
        upgradeRequired: false,
      },
    })

  } catch (error) {
    console.error("Assessment creation error:", error)
    res.status(500).json({ 
      error: "Failed to create assessment",
      details: process.env.NODE_ENV === "development" ? error.message : "Internal server error"
    })
  }
})

// Get all assessments for user
router.get("/", verifyToken, async (req, res) => {
  try {
    // If Supabase is configured, fetch from database
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      const { data: assessments, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("user_id", req.user.userId)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Database fetch error:", error)
        // Return demo data as fallback
        return res.json({
          success: true,
          assessments: getDemoAssessments(),
        })
      }

      return res.json({
        success: true,
        assessments: assessments.map(assessment => ({
          id: assessment.id,
          companyName: assessment.company_name,
          facilityType: assessment.facility_type,
          leadScore: assessment.lead_score,
          status: assessment.status,
          createdAt: assessment.created_at,
        })),
      })
    }

    // Return demo data if no database
    res.json({
      success: true,
      assessments: getDemoAssessments(),
    })
  } catch (error) {
    console.error("Fetch assessments error:", error)
    res.status(500).json({ error: "Failed to fetch assessments" })
  }
})

// Get specific assessment
router.get("/:id", verifyToken, async (req, res) => {
  try {
    // If Supabase is configured, fetch from database
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      const { data: assessment, error } = await supabase
        .from("assessments")
        .select("*")
        .eq("id", req.params.id)
        .eq("user_id", req.user.userId)
        .single()

      if (error || !assessment) {
        return res.status(404).json({ error: "Assessment not found" })
      }

      return res.json({
        success: true,
        assessment: {
          ...assessment,
          assessment_data: JSON.parse(assessment.assessment_content),
        },
      })
    }

    // Return demo assessment if no database
    const demoAssessment = getDemoAssessments().find(a => a.id === req.params.id)
    if (!demoAssessment) {
      return res.status(404).json({ error: "Assessment not found" })
    }

    res.json({
      success: true,
      assessment: demoAssessment,
    })
  } catch (error) {
    console.error("Get assessment error:", error)
    res.status(500).json({ error: "Failed to fetch assessment" })
  }
})

// Test AI functionality
router.post("/test", async (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "OpenAI API key not configured",
      })
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Generate a brief security assessment summary for a small office building.",
        },
      ],
      max_tokens: 200,
    })

    res.json({
      success: true,
      message: "AI Assessment Agent is fully operational",
      sample_assessment: response.choices[0].message.content,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("AI test error:", error)
    res.status(500).json({
      success: false,
      error: "AI service test failed",
      details: error.message,
    })
  }
})

// Helper function to calculate lead score
function calculateLeadScore(data) {
  let score = 0

  // Facility size scoring
  const sqft = parseInt(data.squareFootage) || 0
  if (sqft > 50000) score += 30
  else if (sqft > 20000) score += 20
  else if (sqft > 5000) score += 15
  else score += 10

  // Budget indicators
  if (data.budget && data.budget.toLowerCase().includes("100k")) score += 25
  else if (data.budget && data.budget.toLowerCase().includes("50k")) score += 20
  else if (data.budget && data.budget.toLowerCase().includes("25k")) score += 15
  else score += 10

  // Urgency scoring
  if (data.timeline && data.timeline.toLowerCase().includes("asap")) score += 20
  else if (data.timeline && data.timeline.toLowerCase().includes("month")) score += 15
  else score += 10

  // Security concern complexity
  const concerns = data.securityConcerns.toLowerCase()
  if (concerns.includes("compliance") || concerns.includes("theft")) score += 15
  if (concerns.includes("access control") || concerns.includes("camera")) score += 10

  return Math.min(100, score)
}

// Helper function to provide demo assessments
function getDemoAssessments() {
  return [
    {
      id: "demo-1",
      companyName: "Demo Company",
      facilityType: "Office Building",
      leadScore: 85,
      status: "completed",
      createdAt: new Date().toISOString(),
    }
  ]
}

module.exports = router