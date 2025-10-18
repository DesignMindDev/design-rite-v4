import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('session_id')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Missing session_id parameter' },
        { status: 400 }
      )
    }

    console.log('[Stripe Session API] Fetching session:', sessionId)

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    console.log('[Stripe Session API] Session retrieved:', {
      email: session.customer_email,
      status: session.status,
      payment_status: session.payment_status
    })

    return NextResponse.json({
      email: session.customer_email,
      status: session.status,
      payment_status: session.payment_status
    })

  } catch (error: any) {
    console.error('[Stripe Session API] Error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve session' },
      { status: 500 }
    )
  }
}
