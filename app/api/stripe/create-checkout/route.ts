import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

// Initialize Stripe only if secret key is available
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-09-30.acacia',
  })
}

export async function POST(request: NextRequest) {
  try {
    const { planId, userEmail, successUrl, cancelUrl } = await request.json()

    if (!planId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, userEmail' },
        { status: 400 }
      )
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
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      )
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

  } catch (error: any) {
    console.error('Error creating checkout session:', error)

    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
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