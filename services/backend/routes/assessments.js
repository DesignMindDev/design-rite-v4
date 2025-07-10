const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const OpenAI = require("openai");
const { verifyToken } = require("./auth");
const router = express.Router();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Health check
router.get("/health", (req, res) => {
  res.json({ status: "AI Assessment Agent ready" });
});

// 🤖 AI ASSESSMENT AGENT - Main Intelligence Engine
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
    } = req.body;

    // Validate required fields
    if (!companyName || !facilityType || !securityConcerns) {
      return res.status(400).json({
        error: "Company name, facility type, and security concerns are required",
      });
    }

    // Get user subscription status
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("subscription_tier, trial_assessments_remaining")
      .eq("id", req.user.userId)
      .single();

    if (userError || !user) {
      return res.status(403).json({ error: "User not found" });
    }

    // Check assessment limits
    if (user.subscription_tier === "trial" && user.trial_assessments_remaining <= 0) {
      return res.status(403).json({
        error: "Trial assessments exhausted. Upgrade to continue.",
        upgrade_url: "/upgrade",
      });
    }

    // 🧠 AI SECURITY EXPERT PROMPT - Professional Assessment
    const expertPrompt = `You are a world-class security consultant with 20+ years of experience designing security systems for Fortune 500 companies. 

CLIENT INFORMATION:
- Company: ${companyName}
- Facility Type: ${facilityType}
- Square Footage: ${squareFootage || "Not specified"}
- Current Security: ${currentSecurity || "Minimal/None"}
- Primary Concerns: ${securityConcerns}
- Budget Range: ${budget || "To be determined"}
- Timeline: ${timeline || "Flexible"}

TASK: Create a comprehensive security assessment that will position our company as the premium choice. This assessment will be used to qualify this lead and generate a professional proposal.

DELIVERABLE FORMAT:
Provide a detailed JSON response with this structure:

{
  "executiveSummary": "Brief executive overview highlighting key risks and opportunities",
  "riskAssessment": {
    "criticalRisks": ["List of critical security vulnerabilities"],
    "mediumRisks": ["List of medium-priority risks"],
    "complianceIssues": ["Any regulatory compliance concerns"]
  },
  "recommendedSolutions": {
    "immediate": ["Actions needed within 30 days"],
    "shortTerm": ["Improvements for 1-6 months"],
    "longTerm": ["Strategic enhancements 6+ months"]
  },
  "equipmentSpecifications": {
    "cameras": {"type": "IP cameras", "quantity": "estimated number", "coverage": "areas"},
    "accessControl": {"type": "card/biometric system", "points": "number of doors"},
    "alarms": {"type": "intrusion detection", "zones": "coverage areas"},
    "networking": {"requirements": "infrastructure needs"}
  },
  "investmentSummary": {
    "estimatedRange": "Cost range based on requirements",
    "roi": "Security ROI and risk mitigation value",
    "phasing": "Implementation phases and costs"
  },
  "leadScore": "A numeric score 1-100 based on budget, urgency, facility size, and security needs",
  "nextSteps": ["Specific actions to move this prospect forward"],
  "proposalRecommendations": ["Key points to emphasize in proposal"]
}

Be specific, professional, and focus on value. This assessment will be used to create a winning proposal.`;

    console.log("🤖 Generating AI assessment for:", companyName);

    // Generate AI assessment
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a professional security consultant. Always respond with valid JSON only.",
        },
        {
          role: "user",
          content: expertPrompt,
        },
      ],
      max_tokens: 3000,
      temperature: 0.3,
    });

    let assessmentData;
    try {
      assessmentData = JSON.parse(aiResponse.choices[0].message.content);
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      // Fallback if JSON parsing fails
      assessmentData = {
        executiveSummary: aiResponse.choices[0].message.content,
        leadScore: 75,
        nextSteps: ["Schedule consultation call", "Provide detailed proposal"],
      };
    }

    // Calculate lead score if not provided
    const leadScore = assessmentData.leadScore || calculateLeadScore({
      facilityType,
      squareFootage,
      budget,
      timeline,
      securityConcerns,
    });

    // Save assessment to database
    const { data: assessment, error: dbError } = await supabase
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
          assessment_content: JSON.stringify(assessmentData),
          lead_score: leadScore,
          status: "completed",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return res.status(500).json({ error: "Failed to save assessment" });
    }

    // Update trial count if applicable
    if (user.subscription_tier === "trial") {
      await supabase
        .from("users")
        .update({
          trial_assessments_remaining: user.trial_assessments_remaining - 1,
        })
        .eq("id", req.user.userId);
    }

    // Log analytics
    console.log(`✅ Assessment completed for ${companyName} - Lead Score: ${leadScore}`);

    // Return comprehensive response
    res.status(201).json({
      success: true,
      message: "AI security assessment completed",
      assessment: {
        id: assessment.id,
        companyName: assessment.company_name,
        leadScore: leadScore,
        assessmentData: assessmentData,
        status: assessment.status,
        createdAt: assessment.created_at,
      },
      userStatus: {
        subscriptionTier: user.subscription_tier,
        remainingTrialAssessments: user.subscription_tier === "trial" 
          ? user.trial_assessments_remaining - 1 
          : null,
      },
      nextActions: {
        generateProposal: `/api/proposals/generate/${assessment.id}`,
        scheduleCall: leadScore >= 70 ? "High priority - schedule immediately" : "Standard follow-up",
        upgradeRequired: user.subscription_tier === "trial" && user.trial_assessments_remaining <= 1,
      },
    });
  } catch (error) {
    console.error("Assessment error:", error);
    res.status(500).json({
      success: false,
      error: "AI assessment failed",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// 📊 LEAD SCORING ALGORITHM
function calculateLeadScore(data) {
  let score = 0;

  // Facility size scoring
  const sqft = parseInt(data.squareFootage) || 0;
  if (sqft > 50000) score += 30;
  else if (sqft > 20000) score += 20;
  else if (sqft > 5000) score += 15;
  else score += 10;

  // Budget indicators
  if (data.budget && data.budget.toLowerCase().includes("100k")) score += 25;
  else if (data.budget && data.budget.toLowerCase().includes("50k")) score += 20;
  else if (data.budget && data.budget.toLowerCase().includes("25k")) score += 15;
  else score += 10;

  // Urgency scoring
  if (data.timeline && data.timeline.toLowerCase().includes("asap")) score += 20;
  else if (data.timeline && data.timeline.toLowerCase().includes("month")) score += 15;
  else score += 10;

  // Security concern complexity
  const concerns = data.securityConcerns.toLowerCase();
  if (concerns.includes("compliance") || concerns.includes("theft")) score += 15;
  if (concerns.includes("access control") || concerns.includes("camera")) score += 10;

  return Math.min(100, score);
}

// Get all assessments for user
router.get("/", verifyToken, async (req, res) => {
  try {
    const { data: assessments, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("user_id", req.user.userId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ error: "Failed to fetch assessments" });
    }

    res.json({
      success: true,
      assessments: assessments.map(assessment => ({
        id: assessment.id,
        companyName: assessment.company_name,
        facilityType: assessment.facility_type,
        leadScore: assessment.lead_score,
        status: assessment.status,
        createdAt: assessment.created_at,
      })),
    });
  } catch (error) {
    console.error("Fetch assessments error:", error);
    res.status(500).json({ error: "Failed to fetch assessments" });
  }
});

// Get specific assessment
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const { data: assessment, error } = await supabase
      .from("assessments")
      .select("*")
      .eq("id", req.params.id)
      .eq("user_id", req.user.userId)
      .single();

    if (error || !assessment) {
      return res.status(404).json({ error: "Assessment not found" });
    }

    res.json({
      success: true,
      assessment: {
        ...assessment,
        assessment_data: JSON.parse(assessment.assessment_content),
      },
    });
  } catch (error) {
    console.error("Get assessment error:", error);
    res.status(500).json({ error: "Failed to fetch assessment" });
  }
});

module.exports = router;