// Enhanced with NDAA-compliant BOM - Updated 07/16/2025 11:49:15
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

// Create new assessment with detailed BOM
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

    console.log(`?? Generating AI assessment for: ${companyName} (${facilityType})`)

    // For demo/testing - use a simpler prompt if no user data
    const userSubscriptionTier = "professional" // Default for testing

    // ?? Enhanced AI Security Expert Prompt with NDAA-Compliant BOM
    const assessmentPrompt = `You are a world-class security consultant with 20+ years of experience designing NDAA-compliant security systems for Fortune 500 companies.

CLIENT INFORMATION:
- Company: ${companyName}
- Facility Type: ${facilityType}
- Square Footage: ${squareFootage || "Not specified"}
- Current Security: ${currentSecurity || "Minimal/None"}
- Primary Concerns: ${securityConcerns}
- Budget Range: ${budget || "To be determined"}
- Timeline: ${timeline || "Flexible"}

IMPORTANT REQUIREMENTS:
- All equipment must be NDAA Section 889 compliant (no Hikvision, Dahua, Hytera, ZTE, or Huawei)
- Use only professional-grade, enterprise security equipment
- Provide specific model numbers and realistic 2024 market pricing
- Calculate quantities based on facility size and type

APPROVED EQUIPMENT BRANDS:
- IP Cameras: Axis Communications, Hanwha Vision, Avigilon, Pelco, Bosch Security, Vicon
- VMS: Genetec Security Center, Milestone XProtect, Avigilon Control Center
- Access Control: Lenel S2 (OnGuard/NetBox), Software House C-CURE, HID SAFE, Genetec Synergis
- Locks: ASSA ABLOY (Yale, Corbin Russwin, Sargent), Cook & Boardman Group, Allegion (Schlage)
- Intercom: Commend, Aiphone, 2N
- AI Analytics: Oosto (facial recognition), Scylla (weapon detection), BriefCam
- Fire: Notifier by Honeywell, Edwards, Siemens
- Intrusion: ADEMCO/Honeywell, DMP (Digital Monitoring Products), Bosch

Create a comprehensive security assessment with detailed bill of materials in this EXACT JSON format:

{
  "executiveSummary": "Brief executive overview highlighting key risks and our value proposition",
  "currentAnalysis": {
    "strengths": ["List current security strengths if any"],
    "vulnerabilities": ["List critical vulnerabilities identified"],
    "riskLevel": "High/Medium/Low",
    "complianceGaps": ["NDAA compliance issues", "Insurance requirements", "Industry standards"]
  },
  "recommendedSolutions": {
    "videoSurveillance": {
      "overview": "Comprehensive IP camera system design details",
      "cameraCount": 0,
      "coverage": "Percentage of critical areas covered",
      "retention": "Days of video storage"
    },
    "accessControl": {
      "overview": "Electronic access control strategy",
      "doorCount": 0,
      "credentialType": "Card/Mobile/Biometric",
      "integration": "Integration with other systems"
    },
    "intrusionDetection": {
      "overview": "Alarm system design philosophy",
      "zoneCount": 0,
      "detectorTypes": "Motion, glass break, door contacts",
      "monitoring": "24/7 central station details"
    },
    "fireAlarm": {
      "overview": "Fire detection and notification strategy",
      "deviceCount": 0,
      "coverage": "Full facility code compliance"
    }
  },
  "billOfMaterials": {
    "videoSurveillance": [
      {
        "category": "IP Cameras - Exterior",
        "manufacturer": "Select from: Axis, Hanwha Vision, Avigilon, Vicon",
        "model": "Specific model number",
        "description": "Full specifications",
        "quantity": 0,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      },
      {
        "category": "IP Cameras - Interior",
        "manufacturer": "Select from approved brands",
        "model": "Specific model",
        "description": "Specifications",
        "quantity": 0,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      },
      {
        "category": "VMS Software",
        "manufacturer": "Genetec or Milestone",
        "model": "Specific version/edition",
        "description": "License type and features",
        "quantity": 0,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      },
      {
        "category": "Network Video Recorder",
        "manufacturer": "Dell, HPE, or approved server",
        "model": "Server model",
        "description": "Specifications and storage",
        "quantity": 1,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      }
    ],
    "accessControl": [
      {
        "category": "Access Control Software",
        "manufacturer": "Lenel S2 or approved",
        "model": "Software edition",
        "description": "Server and client licenses",
        "quantity": 1,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      },
      {
        "category": "Card Readers",
        "manufacturer": "HID or approved",
        "model": "Reader model",
        "description": "Technology and features",
        "quantity": 0,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      },
      {
        "category": "Door Controllers",
        "manufacturer": "Match software brand",
        "model": "Controller model",
        "description": "Doors per controller",
        "quantity": 0,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      },
      {
        "category": "Electric Locks",
        "manufacturer": "ASSA ABLOY or Cook & Boardman",
        "model": "Lock model",
        "description": "Grade and function",
        "quantity": 0,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      }
    ],
    "intrusionDetection": [
      {
        "category": "Alarm Panel",
        "manufacturer": "DMP or ADEMCO",
        "model": "Panel model",
        "description": "Zone capacity and features",
        "quantity": 1,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      },
      {
        "category": "Motion Detectors",
        "manufacturer": "Bosch or Honeywell",
        "model": "Detector model",
        "description": "Technology and coverage",
        "quantity": 0,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      },
      {
        "category": "Glass Break Detectors",
        "manufacturer": "Bosch or Honeywell",
        "model": "Detector model",
        "description": "Coverage pattern",
        "quantity": 0,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      }
    ],
    "fireAlarm": [
      {
        "category": "Fire Alarm Control Panel",
        "manufacturer": "Notifier",
        "model": "FACP model",
        "description": "Addressable loops and capacity",
        "quantity": 1,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      },
      {
        "category": "Smoke Detectors",
        "manufacturer": "Notifier",
        "model": "Detector model",
        "description": "Photoelectric/Ion type",
        "quantity": 0,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      },
      {
        "category": "Pull Stations",
        "manufacturer": "Notifier",
        "model": "Station model",
        "description": "Dual action type",
        "quantity": 0,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      }
    ],
    "networking": [
      {
        "category": "PoE++ Switches",
        "manufacturer": "Cisco or Juniper",
        "model": "Switch model",
        "description": "Ports and PoE budget",
        "quantity": 0,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      },
      {
        "category": "UPS Battery Backup",
        "manufacturer": "APC or Eaton",
        "model": "UPS model",
        "description": "Runtime and capacity",
        "quantity": 0,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      }
    ],
    "intercom": [
      {
        "category": "Intercom Master Station",
        "manufacturer": "Commend",
        "model": "Station model",
        "description": "Features and capacity",
        "quantity": 0,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      },
      {
        "category": "Door Stations",
        "manufacturer": "Commend",
        "model": "Station model",
        "description": "Video/audio capabilities",
        "quantity": 0,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      }
    ],
    "aiAnalytics": [
      {
        "category": "Facial Recognition",
        "manufacturer": "Oosto",
        "model": "OnWatch or OnAccess",
        "description": "Watchlist capacity and features",
        "quantity": 0,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      },
      {
        "category": "Weapon Detection",
        "manufacturer": "Scylla",
        "model": "Scylla AI",
        "description": "Camera licenses for AI",
        "quantity": 0,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      }
    ],
    "installation": [
      {
        "category": "Installation Labor",
        "manufacturer": "N/A",
        "model": "Certified Technicians",
        "description": "Professional installation services",
        "quantity": 1,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      },
      {
        "category": "Programming & Commissioning",
        "manufacturer": "N/A",
        "model": "System Integration",
        "description": "Configuration and testing",
        "quantity": 1,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      },
      {
        "category": "Training",
        "manufacturer": "N/A",
        "model": "End User Training",
        "description": "Administrator and operator training",
        "quantity": 1,
        "unitPrice": "$0",
        "extendedPrice": "$0"
      }
    ]
  },
  "investmentSummary": {
    "equipmentSubtotal": "$0",
    "installationSubtotal": "$0",
    "projectTotal": "$0",
    "monthlyServices": "$0",
    "annualMaintenance": "$0",
    "fiveYearTCO": "$0",
    "roi": "Describe security ROI, risk reduction, insurance savings",
    "warranty": "3-year manufacturer warranty, 1-year installation warranty",
    "financing": "Available through preferred partners"
  },
  "implementation": {
    "phase1": {
      "description": "Critical security - perimeter and access control",
      "duration": "3-4 weeks",
      "investment": "$0",
      "components": ["List key components installed"]
    },
    "phase2": {
      "description": "Enhanced coverage - interior cameras and integration",
      "duration": "3-4 weeks",
      "investment": "$0",
      "components": ["List additional components"]
    },
    "phase3": {
      "description": "Advanced features - AI analytics and optimization",
      "duration": "2-3 weeks",
      "investment": "$0",
      "components": ["List final components"]
    }
  },
  "compliance": {
    "ndaaSection889": "All equipment certified NDAA compliant",
    "cyberSecurity": "ONVIF Profile S, encrypted communications",
    "certifications": ["UL Listed", "FCC Part 15", "CE Mark", "RoHS"],
    "insurance": "Meets or exceeds insurance carrier requirements"
  },
  "leadScore": 0,
  "nextSteps": [
    "Schedule on-site security assessment",
    "Review equipment specifications with stakeholders",
    "Finalize project timeline and phasing",
    "Prepare formal contract and SOW"
  ],
  "competitiveAdvantages": [
    "100% NDAA compliant solution",
    "Enterprise-grade equipment only",
    "Certified installation team",
    "24/7 support and monitoring",
    "Comprehensive warranty coverage"
  ]
}

CRITICAL INSTRUCTIONS:
1. Calculate realistic quantities based on facility square footage:
   - Exterior cameras: 1 per 2,500-3,000 sq ft of perimeter
   - Interior cameras: 1 per 1,500-2,000 sq ft
   - Access control doors: All exterior doors + critical interior doors
   - Fire/smoke detectors: Per NFPA 72 code (roughly 1 per 900 sq ft)
2. Use current 2024 market pricing
3. All unit prices should be realistic (no zeros except where noted)
4. Extended price MUST equal quantity � unit price
5. Never use banned manufacturers (Hikvision, Dahua, etc.)
6. Lead score 1-100 based on budget match, urgency, and facility size
7. Provide specific model numbers that actually exist

The response must be valid JSON that can be parsed. Be specific and professional.`

    const openaiResponse = await openai.chat.completions.create({
      model: "gpt-4", // Using GPT-4 for better BOM generation
      messages: [
        {
          role: "system",
          content: "You are a professional security consultant specializing in NDAA-compliant enterprise security systems. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: assessmentPrompt,
        },
      ],
      max_tokens: 4000, // Increased for detailed BOM
      temperature: 0.3,
    })

    let assessmentData
    try {
      assessmentData = JSON.parse(openaiResponse.choices[0].message.content)
    } catch (parseError) {
      // Fallback if JSON parsing fails
      console.error("JSON parse error:", parseError)
      assessmentData = {
        executiveSummary: "Assessment generation encountered an error. Please try again.",
        leadScore: 75,
        nextSteps: ["Schedule consultation", "Provide detailed proposal"],
        currentAnalysis: {
          strengths: [],
          vulnerabilities: ["Unable to complete full analysis"],
          riskLevel: "Medium"
        }
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
              ai_model_used: "gpt-4",
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

    console.log(`? Assessment with BOM generated successfully for ${companyName} - Lead Score: ${leadScore}`)

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

// Generate BOM PDF endpoint (future enhancement)
router.get("/:id/bom", verifyToken, async (req, res) => {
  try {
    // Fetch the assessment
    const { data: assessment, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", req.params.id)
      .eq("user_id", req.user.userId)
      .single()

    if (error || !assessment) {
      return res.status(404).json({ error: "Assessment not found" })
    }

    const assessmentData = JSON.parse(assessment.assessment_content)

    // For now, return the BOM data
    // In the future, this could generate a PDF
    res.json({
      success: true,
      companyName: assessment.company_name,
      facilityType: assessment.facility_type,
      billOfMaterials: assessmentData.billOfMaterials || {},
      investmentSummary: assessmentData.investmentSummary || {},
      generatedAt: new Date().toISOString()
    })

  } catch (error) {
    console.error("BOM generation error:", error)
    res.status(500).json({ error: "Failed to generate BOM" })
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
  const budgetStr = (data.budget || "").toLowerCase()
  if (budgetStr.includes("500k") || budgetStr.includes("1m")) score += 30
  else if (budgetStr.includes("250k") || budgetStr.includes("300k")) score += 25
  else if (budgetStr.includes("100k") || budgetStr.includes("150k")) score += 20
  else if (budgetStr.includes("50k") || budgetStr.includes("75k")) score += 15
  else score += 10

  // Urgency scoring
  const timelineStr = (data.timeline || "").toLowerCase()
  if (timelineStr.includes("immediate") || timelineStr.includes("asap")) score += 25
  else if (timelineStr.includes("30 days") || timelineStr.includes("1 month")) score += 20
  else if (timelineStr.includes("quarter") || timelineStr.includes("90 days")) score += 15
  else score += 10

  // Security concern complexity
  const concerns = data.securityConcerns.toLowerCase()
  if (concerns.includes("compliance") || concerns.includes("regulatory")) score += 20
  if (concerns.includes("theft") || concerns.includes("shrink")) score += 15
  if (concerns.includes("workplace violence") || concerns.includes("active threat")) score += 15
  if (concerns.includes("access control") || concerns.includes("intrusion")) score += 10
  if (concerns.includes("camera") || concerns.includes("surveillance")) score += 10

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
