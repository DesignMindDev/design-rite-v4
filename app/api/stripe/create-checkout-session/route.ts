import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

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
    const email = searchParams.get('email')
    const fullName = searchParams.get('fullName')
    const company = searchParams.get('company')
    const discount = searchParams.get('discount') // '20percent-first-year'

    if (!leadId || !email) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    console.log('[Stripe Checkout] Creating session for:', email, 'with discount:', discount)

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

    // Create Stripe checkout session with both plan options
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer_email: email,

      // Line items - both Starter and Professional options
      line_items: [
        {
          price: STARTER_PRICE_ID,
          quantity: 1,
        }
      ],

      // Allow plan selection in checkout
      subscription_data: {
        metadata: {
          leadId,
          fullName: fullName || '',
          company: company || '',
          offerChoice: '20percent-discount',
          source: 'design_rite_challenge'
        }
      },

      // Apply 20% discount for first year (if specified)
      ...(discount === '20percent-first-year' ? {
        discounts: [
          {
            coupon: await getOrCreate20PercentCoupon()
          }
        ]
      } : {}),

      // Metadata for webhook processing
      metadata: {
        leadId,
        fullName: fullName || '',
        company: company || '',
        email,
        offerChoice: '20percent-discount',
        source: 'design_rite_challenge'
      },

      // Success/Cancel URLs
      success_url: process.env.NODE_ENV === 'development'
        ? `http://localhost:3001/welcome?session_id={CHECKOUT_SESSION_ID}`
        : `https://portal.design-rite.com/welcome?session_id={CHECKOUT_SESSION_ID}`,

      cancel_url: process.env.NODE_ENV === 'development'
        ? `http://localhost:3000/create-account?cancelled=true`
        : `https://design-rite.com/create-account?cancelled=true`,

      // Additional options
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true
      },
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
