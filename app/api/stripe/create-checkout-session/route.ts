import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

// Initialize Supabase admin client
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function GET(request: NextRequest) {
  try {
    // Validate Stripe configuration
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('[Stripe Checkout] STRIPE_SECRET_KEY not configured')
      return NextResponse.json(
        { error: 'Payment system not configured. Please contact support.' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const leadId = searchParams.get('leadId')
    const userId = searchParams.get('userId') // NEW: Supabase user ID
    const email = searchParams.get('email')
    const fullName = searchParams.get('fullName')
    const company = searchParams.get('company')
    const offerChoice = searchParams.get('offerChoice') // '7day-trial' or '20percent-discount'

    if (!leadId || !userId || !email || !offerChoice) {
      return NextResponse.json(
        { error: 'Missing required parameters: leadId, userId, email, offerChoice' },
        { status: 400 }
      )
    }

    // Check if user already exists in Supabase Auth (duplicate detection)
    console.log('[Stripe Checkout] Checking for existing user:', email)
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const existingUser = existingUsers?.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

    if (existingUser) {
      console.log('[Stripe Checkout] User already exists:', email)

      // Check if they already have an active subscription
      const { data: existingSubscription } = await supabaseAdmin
        .from('subscriptions')
        .select('status, tier')
        .eq('user_id', existingUser.id)
        .eq('status', 'active')
        .single()

      if (existingSubscription) {
        console.log('[Stripe Checkout] User already has active subscription - redirecting to existing-user page')
        const existingUserUrl = process.env.NODE_ENV === 'development'
          ? `http://localhost:3000/create-account/existing-user?email=${encodeURIComponent(email)}`
          : `https://design-rite.com/create-account/existing-user?email=${encodeURIComponent(email)}`

        return NextResponse.redirect(existingUserUrl)
      }

      // User exists but no active subscription - allow them to proceed
      console.log('[Stripe Checkout] User exists but no active subscription - allowing checkout')
    }

    console.log('[Stripe Checkout] Creating session for:', email)
    console.log('[Stripe Checkout] Offer choice:', offerChoice)
    console.log('[Stripe Checkout] User ID:', userId)

    // Get pricing from environment variables or use defaults
    const STARTER_PRICE_ID = process.env.STRIPE_STARTER_PRICE_ID || 'price_starter'
    const PROFESSIONAL_PRICE_ID = process.env.STRIPE_PROFESSIONAL_PRICE_ID || 'price_professional'

    console.log('[Stripe Checkout] Using price IDs:', {
      starter: STARTER_PRICE_ID,
      professional: PROFESSIONAL_PRICE_ID
    })

    // Validate price IDs
    if (!STARTER_PRICE_ID.startsWith('price_')) {
      console.error('[Stripe Checkout] Invalid STARTER_PRICE_ID:', STARTER_PRICE_ID)
      return NextResponse.json(
        { error: 'Invalid pricing configuration. Please contact support.' },
        { status: 500 }
      )
    }

    // Determine if this is a trial or paid subscription
    const isTrial = offerChoice === '7day-trial'
    const is20PercentDiscount = offerChoice === '20percent-discount'

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,

      // Line items - Starter plan (can upgrade later)
      line_items: [
        {
          price: STARTER_PRICE_ID,
          quantity: 1,
        }
      ],

      // Subscription configuration
      subscription_data: {
        // ⭐ TRIAL: 7 days with payment info collected
        ...(isTrial ? {
          trial_period_days: 7,
          trial_settings: {
            end_behavior: {
              missing_payment_method: 'cancel' // Cancel if no payment method at trial end
            }
          }
        } : {}),

        metadata: {
          leadId,
          userId, // ⭐ CRITICAL: Supabase user ID for webhook
          fullName: fullName || '',
          company: company || '',
          offerChoice,
          source: 'design_rite_challenge'
        }
      },

      // Apply 20% discount for paid plan
      ...(is20PercentDiscount ? {
        discounts: [
          {
            coupon: await getOrCreate20PercentCoupon()
          }
        ]
      } : {}),

      // Payment method collection
      // Trial: Collect card but don't charge until trial ends
      // Paid: Collect and charge immediately
      payment_method_collection: isTrial ? 'if_required' : 'always',

      // Metadata for webhook processing
      metadata: {
        leadId,
        userId, // ⭐ CRITICAL: For subscription record creation
        fullName: fullName || '',
        company: company || '',
        email,
        offerChoice,
        source: 'design_rite_challenge'
      },

      // Success/Cancel URLs
      // ✅ NEW: Redirect to custom "Check Email" page instead of auth callback
      success_url: process.env.NODE_ENV === 'development'
        ? `http://localhost:3000/challenge/check-email?session_id={CHECKOUT_SESSION_ID}`
        : `https://design-rite.com/challenge/check-email?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: process.env.NODE_ENV === 'development'
        ? `http://localhost:3000/create-account?cancelled=true`
        : `https://design-rite.com/create-account?cancelled=true`,

      // Additional options
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true
      },

      // Custom text for trial
      ...(isTrial ? {
        consent_collection: {
          terms_of_service: 'required'
        },
        custom_text: {
          submit: {
            message: 'Start your 7-day free trial. Your card will be charged after the trial ends unless you cancel.'
          }
        }
      } : {})
    })

    console.log('[Stripe Checkout] Session created:', session.id)

    // Redirect to Stripe checkout
    return NextResponse.redirect(session.url!)

  } catch (error: any) {
    console.error('[Stripe Checkout] Error:', error)
    console.error('[Stripe Checkout] Error details:', {
      message: error.message,
      type: error.type,
      code: error.code,
      param: error.param,
      stack: error.stack
    })

    return NextResponse.json(
      {
        error: error.message || 'Failed to create checkout session',
        details: error.type || error.code || 'unknown_error'
      },
      { status: 500 }
    )
  }
}

// Helper function to get or create 20% off first year coupon
async function getOrCreate20PercentCoupon(): Promise<string> {
  const couponId = 'DESIGN_RITE_CHALLENGE_20'

  try {
    // Try to retrieve existing coupon
    const coupon = await stripe.coupons.retrieve(couponId)
    console.log('[Stripe Checkout] Using existing coupon:', couponId)
    return coupon.id
  } catch (error: any) {
    console.log('[Stripe Checkout] Coupon not found, attempting to create:', error.code)

    if (error.code === 'resource_missing') {
      try {
        // Create new coupon if it doesn't exist
        console.log('[Stripe Checkout] Creating new coupon:', couponId)
        const newCoupon = await stripe.coupons.create({
          id: couponId,
          name: '20% Off First Year - DR Challenge',
          percent_off: 20,
          duration: 'repeating',
          duration_in_months: 12,
          metadata: {
            campaign: 'design_rite_challenge',
            description: '20% discount for first 12 months'
          }
        })
        console.log('[Stripe Checkout] Successfully created coupon:', newCoupon.id)
        return newCoupon.id
      } catch (createError: any) {
        console.error('[Stripe Checkout] Failed to create coupon:', createError)
        throw new Error(`Failed to create discount coupon: ${createError.message}`)
      }
    }

    console.error('[Stripe Checkout] Unexpected error retrieving coupon:', error)
    throw error
  }
}
