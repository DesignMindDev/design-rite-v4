import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Initialize Stripe only when needed (not at build time)
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
  });
};

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userEmail, returnUrl } = await req.json();

    // Get customer from Supabase profile or subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', session.user.id)
      .single();

    let customerId = profile?.stripe_customer_id;

    // If no customer ID in profile, try to find from subscription
    if (!customerId) {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('stripe_customer_id')
        .eq('user_id', session.user.id)
        .single();

      customerId = subscription?.stripe_customer_id;
    }

    // If still no customer ID, create a new customer
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userEmail || session.user.email,
        metadata: {
          supabase_user_id: session.user.id
        }
      });
      customerId = customer.id;

      // Update profile with customer ID
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', session.user.id);
    }

    // Create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/account`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error) {
    console.error('Error creating portal session:', error);
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }
}
