import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'
import { withErrorHandling, ValidationErrors, APIError } from '@/lib/api-error-handler'

// Initialize Stripe only if secret key is available
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new APIError(503, 'Payment processing is temporarily unavailable. Please try again later.', 'STRIPE_NOT_CONFIGURED')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-09-30.acacia',
  })
}

export async function POST(request: NextRequest) {
  return withErrorHandling(async () => {
    const { planId, userEmail, successUrl, cancelUrl} = await request.json()

    if (!planId) {
      throw ValidationErrors.MISSING_REQUIRED_FIELD('planId')
    }

    if (!userEmail) {
      throw ValidationErrors.MISSING_REQUIRED_FIELD('userEmail')
    }

    // Get Stripe instance
    const stripe = getStripe()

    // Get or create customer in Stripe
    let customer: Stripe.Customer

    const existingCustomers = await stripe.customers.list({
      email: userEmail,
      limit: 1
    })

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]
    } else {
      customer = await stripe.customers.create({
        email: userEmail,
        metadata: {
          source: 'design-rite-v3'
        }
      })
    }

    // Get price ID based on plan
    const priceId = getPriceIdForPlan(planId)
    if (!priceId) {
      throw new APIError(400, `Invalid plan ID: ${planId}. Must be one of: starter, professional, enterprise`, 'INVALID_PLAN_ID')
    }

    // Create checkout session with 14-day trial
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        trial_period_days: 14, // 14-day free trial
        metadata: {
          planId,
          userEmail
        }
      },
      success_url: successUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard?payment=success`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/upgrade?payment=canceled`,
      metadata: {
        planId,
        userEmail
      }
    })

    // Log checkout session creation
    try {
      await supabase
        .from('payment_events')
        .insert({
          event_type: 'checkout_session_created',
          customer_id: customer.id,
          stripe_session_id: session.id,
          plan_id: planId,
          user_email: userEmail,
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error logging checkout session:', error)
      // Don't fail the request if logging fails
    }

    return NextResponse.json({
      sessionId: session.id,
      url: session.url
    })
  }, 'Stripe Checkout');
}

function getPriceIdForPlan(planId: string): string | null {
  // Update these with your actual Stripe Price IDs from the dashboard
  const priceMap: Record<string, string> = {
    'starter': process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || '',
    'professional': process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL || '',
    'enterprise': process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE || ''
  }

  return priceMap[planId] || null
}