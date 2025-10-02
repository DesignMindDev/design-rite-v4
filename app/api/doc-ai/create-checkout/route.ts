/**
 * Document AI - Create Stripe Checkout Session
 * Migrated from Supabase Edge Function to Next.js API Route
 * Creates checkout sessions for Starter/Professional/Enterprise subscriptions
 * Auth: Supabase Auth (migrated from Next-Auth 2025-10-02)
 * Original: Designalmostright/supabase/functions/create-checkout-session
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import Stripe from 'stripe';

// Supabase admin client for database operations (bypasses RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Stripe client
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-09-30.acacia'
  });
};

interface CheckoutRequest {
  priceId?: string; // Stripe price ID
  tier?: 'starter' | 'professional' | 'enterprise'; // Tier name
}

export async function POST(req: NextRequest) {
  try {
    // ============================================
    // AUTHENTICATION - Supabase Auth
    // ============================================
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userEmail = session.user.email!;

    console.log('[Doc AI Checkout] Creating session for user:', userId);

    // ============================================
    // PARSE REQUEST BODY
    // ============================================
    const body: CheckoutRequest = await req.json();
    let { priceId, tier } = body;

    // If tier provided instead of priceId, use environment variables
    if (!priceId && tier) {
      if (tier === 'starter') {
        priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER;
      } else if (tier === 'professional') {
        priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL;
      } else if (tier === 'enterprise') {
        priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE;
      }
    }

    if (!priceId) {
      return NextResponse.json(
        { error: 'Missing required field: priceId or tier' },
        { status: 400 }
      );
    }

    console.log('[Doc AI Checkout] Using price ID:', priceId);

    // ============================================
    // GET OR CREATE STRIPE CUSTOMER
    // ============================================
    const stripe = getStripe();

    // Check if user already has a Stripe customer ID
    const { data: user } = await supabaseAdmin
      .from('profiles')
      .select('stripe_customer_id, full_name')
      .eq('id', userId)
      .single();

    let customerId = user?.stripe_customer_id;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      console.log('[Doc AI Checkout] Creating new Stripe customer');

      const customer = await stripe.customers.create({
        email: userEmail,
        name: user?.full_name || undefined,
        metadata: {
          userId: userId,
          source: 'doc-ai-platform'
        }
      });

      customerId = customer.id;

      // Save customer ID to profiles table
      await supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);

      console.log('[Doc AI Checkout] Stripe customer created:', customerId);
    }

    // ============================================
    // CREATE CHECKOUT SESSION
    // ============================================
    const siteUrl = process.env.NEXTAUTH_URL || 'http://localhost:3010';

    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${siteUrl}/doc-ai/documents?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/doc-ai/subscription?cancelled=true`,
      metadata: {
        userId: userId,
        tier: tier || 'unknown'
      },
      subscription_data: {
        metadata: {
          user_id: userId  // Changed to user_id for webhook handler
        }
      }
    });

    console.log('[Doc AI Checkout] Session created:', checkoutSession.id);

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url
    });

  } catch (error) {
    console.error('[Doc AI Checkout] Error:', error);

    return NextResponse.json(
      {
        error: (error as Error).message || 'Failed to create checkout session',
        details: error instanceof Stripe.errors.StripeError ? error.type : undefined
      },
      { status: 500 }
    );
  }
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
    }
  });
}
