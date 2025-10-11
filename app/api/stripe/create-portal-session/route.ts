import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia',
});

// Supabase client to get customer ID
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://aeorianxnxpxveoxzhov.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(request: Request) {
  console.log('🚀 Stripe create-portal-session API called');

  try {
    // Get the data from the request
    const data = await request.json();
    console.log('📦 Received data:', data);

    const { userEmail, returnUrl } = data;

    // Validate required fields
    if (!userEmail) {
      return NextResponse.json(
        { error: 'Missing required field: userEmail is required' },
        { status: 400 }
      );
    }

    // Get Stripe customer ID from Supabase user_profiles table
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('email', userEmail)
      .single();

    if (profileError || !profile?.stripe_customer_id) {
      console.error('❌ No Stripe customer found for user:', userEmail);
      return NextResponse.json(
        { error: 'No active subscription found. Please subscribe first.' },
        { status: 404 }
      );
    }

    // Create Stripe customer portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/subscription`,
    });

    console.log('✅ Portal session created:', session.id);

    return NextResponse.json(
      {
        url: session.url
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
    console.error('💥 Stripe portal error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create portal session' },
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
