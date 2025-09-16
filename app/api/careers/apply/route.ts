import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '../../../../lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.positionApplied) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const applicationData = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email.toLowerCase(),
      phone: formData.phone || null,
      linkedin_url: formData.linkedinUrl || null,
      portfolio_url: formData.portfolioUrl || null,
      years_experience: formData.yearsExperience || null,
      current_company: formData.currentCompany || null,
      current_job_title: formData.currentJobTitle || null,
      cover_letter: formData.coverLetter || null,
      salary_expectations: formData.salaryExpectations || null,
      available_start_date: formData.availableStartDate || null,
      referral_source: formData.referralSource || null,
      position_applied: formData.positionApplied,
      application_status: 'pending'
    }

    const { data, error } = await supabaseAdmin
      .from('job_applications')
      .insert([applicationData])
      .select()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { error: 'Failed to save application' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { message: 'Application submitted successfully' },
      { status: 201 }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
