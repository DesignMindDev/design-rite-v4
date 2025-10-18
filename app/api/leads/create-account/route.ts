import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const {
      email,
      fullName,
      company,
      phone,
      jobTitle,
      companySize,
      painPoint,
      offerChoice,
      consentMarketing,
      source = 'design_rite_challenge',
      campaignName = 'Take the Design Rite Challenge'
    } = body

    // Validate required fields
    if (!email || !fullName || !company || !phone || !jobTitle || !companySize || !painPoint || !offerChoice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate business email (reject free providers)
    const freeEmailProviders = [
      'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com',
      'icloud.com', 'live.com', 'msn.com', 'ymail.com', 'protonmail.com'
    ]
    const domain = email.split('@')[1]?.toLowerCase()
    if (!domain || freeEmailProviders.includes(domain)) {
      return NextResponse.json(
        { error: 'Please use a business email address' },
        { status: 400 }
      )
    }

    console.log('[Create Account API] Saving lead to Supabase...')

    // Create Supabase client with service key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Save lead data to challenge_leads table
    const { data: leadData, error: leadError } = await supabase
      .from('challenge_leads')
      .insert({
        email: email.toLowerCase(),
        full_name: fullName,
        company,
        phone,
        job_title: jobTitle,
        company_size: companySize,
        pain_point: painPoint,
        offer_choice: offerChoice,
        consent_marketing: consentMarketing || false,
        source,
        campaign_name: campaignName
      })
      .select()
      .single()

    if (leadError) {
      // Check if email already exists
      if (leadError.code === '23505') {
        console.log('[Create Account API] Email already exists:', email)
        return NextResponse.json(
          { error: 'An account with this email already exists. Please check your email for the verification link.' },
          { status: 409 }
        )
      }

      console.error('[Create Account API] Error saving lead:', leadError)
      return NextResponse.json(
        { error: 'Failed to save lead data' },
        { status: 500 }
      )
    }

    console.log('[Create Account API] Lead saved successfully:', leadData.id)

    // Route based on offer choice
    if (offerChoice === '20percent-discount') {
      // Option A: Payment First - Redirect to Stripe checkout
      console.log('[Create Account API] Routing to Stripe checkout with 20% discount')

      return NextResponse.json({
        success: true,
        redirectToStripe: true,
        leadId: leadData.id,
        message: 'Redirecting to payment...'
      })
    }

    // For 7-day trial: Send magic link for email verification
    console.log('[Create Account API] Sending magic link to:', email)

    const { data: authData, error: authError } = await supabase.auth.signInWithOtp({
      email: email.toLowerCase(),
      options: {
        emailRedirectTo: process.env.NODE_ENV === 'development'
          ? 'http://localhost:3001/auth/callback'
          : 'https://portal.design-rite.com/auth/callback',
        data: {
          full_name: fullName,
          company,
          phone,
          job_title: jobTitle,
          company_size: companySize,
          pain_point: painPoint,
          offer_choice: offerChoice,
          source,
          campaign_name: campaignName
        }
      }
    })

    if (authError) {
      console.error('[Create Account API] Error sending magic link:', authError)
      // Don't fail the request if magic link fails - lead data is already saved
      // User can request a new magic link later
      return NextResponse.json({
        success: true,
        message: 'Lead saved successfully. Please check your email for verification link.',
        leadId: leadData.id,
        magicLinkSent: false,
        warning: 'Magic link could not be sent. Please contact support.'
      })
    }

    console.log('[Create Account API] Magic link sent successfully')

    // Update lead with magic link sent timestamp
    await supabase
      .from('challenge_leads')
      .update({ magic_link_sent_at: new Date().toISOString() })
      .eq('id', leadData.id)

    return NextResponse.json({
      success: true,
      message: 'Account created successfully! Please check your email to verify and access your account.',
      leadId: leadData.id,
      magicLinkSent: true
    })

  } catch (error: any) {
    console.error('[Create Account API] Unexpected error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}
