/**
 * Document AI - Create Stripe Checkout Session
 * Migrated from Supabase Edge Function to Next.js API Route
 * Creates checkout sessions for Pro/Enterprise subscriptions
 * Original: Designalmostright/supabase/functions/create-checkout-session
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
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
  tier?: 'pro' | 'enterprise'; // Or tier name
}

export async function POST(req: NextRequest) {
  try {
    // ============================================
    // AUTHENTICATION - Next-Auth Session
    // ============================================
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Authentication required' },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const userEmail = session.user.email;

    console.log('[Doc AI Checkout] Creating session for user:', userId);

    // ============================================
    // PARSE REQUEST BODY
    // ============================================
    const body: CheckoutRequest = await req.json();
    let { priceId, tier } = body;

    // If tier provided instead of priceId, look up priceId from admin_settings
    if (!priceId && tier) {
      const { data: adminSettings } = await supabase
        .from('admin_settings')
        .select('stripe_price_id_pro, stripe_price_id_enterprise')
        .limit(1)
        .single();

      if (tier === 'pro') {
        priceId = adminSettings?.stripe_price_id_pro || process.env.STRIPE_PRICE_PRO;
      } else if (tier === 'enterprise') {
        priceId = adminSettings?.stripe_price_id_enterprise || process.env.STRIPE_PRICE_ENTERPRISE;
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
    const { data: user } = await supabase
      .from('users')
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

      // Save customer ID to users table
      await supabase
        .from('users')
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
          userId: userId
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
