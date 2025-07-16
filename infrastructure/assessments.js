const express = require("express")
const { createClient } = require("@supabase/supabase-js")
const OpenAI = require("openai")
const router = express.Router()

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

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

// Simple middleware function for now (we'll add proper auth later)
const simpleAuth = (req, res, next) => {
  // For testing, just set a dummy user ID
  req.user = { userId: "test-user-123" }
  next()
}

// Test AI functionality
router.post("/test-ai", (req, res) => {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        error: "OpenAI API key not configured",
      })
    }

    // Simple test without actual API call for now
    res.json({
      success: true,
      message: "AI Assessment Agent is ready",
      services: {
        openai: "configured",
        supabase: process.env.SUPABASE_URL ? "connected" : "not configured",
      },
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

// Create new assessment (simplified for testing)
router.post("/create", simpleAuth, async (req, res) => {
  try {
    const {
      companyName,
      facilityType,
      securityConcerns,
    } = req.body

    // Validate required fields
    if (!companyName || !facilityType || !securityConcerns) {
      return res.status(400).json({
        error: "Company name, facility type, and security concerns are required",
      })
    }

    // Generate assessment with OpenAI
    console.log("Generating AI assessment for:", companyName)
    
    const assessmentPrompt = `Create a professional security assessment for:
Company: ${companyName}
Facility Type: ${facilityType}
Security Concerns: ${securityConcerns}

Provide a brief assessment with recommendations.`

    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional security consultant.",
        },
        {
          role: "user",
          content: assessmentPrompt,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    })

    const assessmentContent = openaiResponse.choices[0].message.content

    console.log("✅ Assessment generated successfully")

    res.status(201).json({
      message: "Assessment created successfully",
      assessment: {
        id: "test-" + Date.now(),
        companyName,
        facilityType,
        content: assessmentContent,
        createdAt: new Date().toISOString(),
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

// Get assessments list (simplified)
router.get("/list", simpleAuth, (req, res) => {
  res.json({
    assessments: [
      {
        id: "demo-1",
        company_name: "Demo Company",
        facility_type: "Office Building",
        status: "completed",
        created_at: new Date().toISOString(),
      }
    ]
  })
})

module.exports = router
