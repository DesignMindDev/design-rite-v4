import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabaseUrl = 'https://ickwrbdpuorzqpzqbqpf.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlja3dyYmRwdW9yemRwenFicXBmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDk1MDc4MywiZXhwIjoyMDY2NTI2NzgzfQ.LGGTBZF3ADOZv7cW7rEGzUi_0JluWf59yw2jWLuOJHo';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('career_applications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching applications:', error)
      return NextResponse.json(
        { error: 'Failed to fetch applications' },
        { status: 500 }
      )
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Error fetching applications:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : String(error),
      hint: 'Check Supabase connection and table structure',
      code: error instanceof Error && 'code' in error ? error.code : ''
    })

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    const {
      firstName,
      lastName,
      email,
      phone,
      linkedinUrl,
      portfolioUrl,
      positionApplied,
      department,
      locationPreference,
      yearsExperience,
      currentCompany,
      currentJobTitle,
      coverLetter,
      resumeUrl,
      salaryExpectations,
      availableStartDate,
      referralSource
    } = body

    // Basic validation
    if (!firstName || !lastName || !email || !positionApplied) {
      return NextResponse.json(
        { error: 'Missing required fields: firstName, lastName, email, positionApplied' },
        { status: 400 }
      )
    }

    // Check if application already exists for this email and position
    const { data: existing, error: checkError } = await supabase
      .from('career_applications')
      .select('id')
      .eq('email', email)
      .eq('position_applied', positionApplied)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing application:', checkError)
      return NextResponse.json(
        { error: 'Database error while checking existing application' },
        { status: 500 }
      )
    }

    if (existing) {
      return NextResponse.json(
        { error: 'Application already exists for this position and email' },
        { status: 409 }
      )
    }

    // Insert new application
    const { data: newApplication, error: insertError } = await supabase
      .from('career_applications')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          email,
          phone,
          linkedin_url: linkedinUrl,
          portfolio_url: portfolioUrl,
          position_applied: positionApplied,
          department,
          location_preference: locationPreference,
          years_experience: yearsExperience,
          current_company: currentCompany,
          current_job_title: currentJobTitle,
          cover_letter: coverLetter,
          resume_url: resumeUrl,
          salary_expectations: salaryExpectations,
          available_start_date: availableStartDate,
          referral_source: referralSource,
          application_status: 'new'
        }
      ])
      .select()

    if (insertError) {
      console.error('Error creating application:', insertError)
      return NextResponse.json(
        { error: 'Failed to submit application' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        message: 'Application submitted successfully',
        application: newApplication?.[0]
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error in POST /api/careers/applications:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}