/**
 * Admin API: Extend Trial Period
 * Allows admins to manually extend a customer's trial period
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(req: NextRequest) {
  try {
    const { subscription_id, days } = await req.json();

    if (!subscription_id || !days) {
      return NextResponse.json(
        { error: 'Missing subscription_id or days' },
        { status: 400 }
      );
    }

    // Get subscription from database
    const { data: sub, error: subError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('stripe_subscription_id', subscription_id)
      .single();

    if (subError || !sub) {
      return NextResponse.json(
        { error: 'Subscription not found' },
        { status: 404 }
      );
    }

    // Check if subscription is in trial
    if (sub.status !== 'trialing') {
      return NextResponse.json(
        { error: 'Subscription is not in trial period' },
        { status: 400 }
      );
    }

    // Get current Stripe subscription
    const stripeSubscription = await stripe.subscriptions.retrieve(subscription_id);

    if (!stripeSubscription.trial_end) {
      return NextResponse.json(
        { error: 'No trial period found' },
        { status: 400 }
      );
    }

    // Calculate new trial end date
    const currentTrialEnd = new Date(stripeSubscription.trial_end * 1000);
    const newTrialEnd = new Date(currentTrialEnd);
    newTrialEnd.setDate(newTrialEnd.getDate() + days);

    // Update subscription in Stripe
    const updatedSubscription = await stripe.subscriptions.update(subscription_id, {
      trial_end: Math.floor(newTrialEnd.getTime() / 1000),
    });

    // Update database
    await supabase
      .from('subscriptions')
      .update({
        trial_end: newTrialEnd.toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_subscription_id', subscription_id);

    // Log history
    await supabase
      .from('subscription_history')
      .insert({
        user_id: sub.user_id,
        subscription_id: sub.id,
        action: 'trial_extended',
        reason: `Trial extended by ${days} days (Admin)`,
        is_automatic: false,
      });

    return NextResponse.json({
      success: true,
      subscription: updatedSubscription,
      new_trial_end: newTrialEnd.toISOString()
    });
  } catch (error) {
    console.error('[Admin] Error extending trial:', error);
    return NextResponse.json(
      { error: 'Failed to extend trial' },
      { status: 500 }
    );
  }
}
