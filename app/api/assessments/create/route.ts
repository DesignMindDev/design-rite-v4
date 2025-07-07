import { type NextRequest, NextResponse } from "next/server"
import { createServerSupabase } from "@/lib/supabase"
import { generateSecurityAssessment, generateTechnicalSpecs } from "@/lib/ai"
import { z } from "zod"

const AssessmentSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  facilityType: z.string().min(1, "Facility type is required"),
  squareFootage: z.number().positive("Square footage must be positive"),
  currentSecurity: z.string().optional(),
  securityConcerns: z.string().min(1, "Security concerns are required"),
  budget: z.string().min(1, "Budget range is required"),
  timeline: z.string().min(1, "Timeline is required"),
  contactInfo: z.object({
    name: z.string().min(1, "Contact name is required"),
    phone: z.string().min(1, "Phone number is required"),
    email: z.string().email("Valid email is required"),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerSupabase()

    // Get current user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 })
    }

    // Validate request body
    const body = await request.json()
    const validatedData = AssessmentSchema.parse(body)

    // Check user's trial status
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("subscription_tier, trial_assessments_remaining")
      .eq("id", user.id)
      .single()

    if (userError) {
      return NextResponse.json({ error: "User data not found" }, { status: 404 })
    }

    // Check if user can create assessment
    if (userData.subscription_tier === "trial" && userData.trial_assessments_remaining <= 0) {
      return NextResponse.json({ error: "Trial assessments exhausted. Please upgrade to continue." }, { status: 403 })
    }

    // Create assessment record
    const { data: assessment, error: insertError } = await supabase
      .from("assessments")
      .insert([
        {
          user_id: user.id,
          company_name: validatedData.companyName,
          facility_type: validatedData.facilityType,
          status: "processing",
        },
      ])
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: "Failed to create assessment" }, { status: 500 })
    }

    // Generate AI assessment
    const aiResult = await generateSecurityAssessment(validatedData)

    if (!aiResult.success) {
      // Update assessment status to failed
      await supabase.from("assessments").update({ status: "failed" }).eq("id", assessment.id)

      return NextResponse.json({ error: aiResult.error }, { status: 500 })
    }

    // Generate technical specifications
    const techSpecs = await generateTechnicalSpecs(aiResult.assessment!)

    // Update assessment with results
    const { error: updateError } = await supabase
      .from("assessments")
      .update({
        assessment_content: aiResult.assessment,
        technical_specifications: techSpecs.specifications,
        status: "completed",
        updated_at: new Date().toISOString(),
      })
      .eq("id", assessment.id)

    if (updateError) {
      return NextResponse.json({ error: "Failed to save assessment results" }, { status: 500 })
    }

    // Update user's trial count if applicable
    if (userData.subscription_tier === "trial") {
      await supabase
        .from("users")
        .update({
          trial_assessments_remaining: userData.trial_assessments_remaining - 1,
        })
        .eq("id", user.id)
    }

    return NextResponse.json({
      success: true,
      assessmentId: assessment.id,
      assessment: aiResult.assessment,
      technicalSpecs: techSpecs.specifications,
      remainingTrialAssessments:
        userData.subscription_tier === "trial" ? userData.trial_assessments_remaining - 1 : null,
    })
  } catch (error) {
    console.error("Assessment creation error:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data", details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
