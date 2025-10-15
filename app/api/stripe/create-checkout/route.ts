import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

export async function POST(request: Request) {
  console.log('🚀 Stripe create-checkout API called');

  try {
    // Get the data from the request
    const data = await request.json();
    console.log('📦 Received data:', data);

    const { planId, userEmail, successUrl, cancelUrl } = data;

    // Validate required fields
    if (!planId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: planId and userEmail are required' },
        { status: 400 }
      );
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: userEmail,
      payment_method_types: ['card'],
      line_items: [
        {
          price: planId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || (process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001/dashboard?success=true'
        : 'https://portal.design-rite.com/dashboard?success=true'),
      cancel_url: cancelUrl || (process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001/subscription?canceled=true'
        : 'https://portal.design-rite.com/subscription?canceled=true'),
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      subscription_data: {
        trial_period_days: 7, // 7-day free trial with 3 assessments
      },
    });

    console.log('✅ Checkout session created:', session.id);

    return NextResponse.json(
      {
        url: session.url,
        sessionId: session.id
      },
      {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        }
      }
    );

  } catch (error: any) {
    console.error('💥 Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
