// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

/**
 * Stripe Webhook Handler
 * Processes Stripe subscription events
 * Design-Rite v3 - Phase 5
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Lazy Stripe initialization (only when route is called)
function getStripe() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-12-18.acacia',
  });
}

// Supabase admin client (bypasses RLS)
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const supabase = getSupabase();
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      console.error('[Stripe Webhook] STRIPE_WEBHOOK_SECRET not configured');
      return NextResponse.json(
        { error: 'Webhook secret not configured' },
        { status: 500 }
      );
    }

    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      console.error('[Stripe Webhook] Missing stripe-signature header');
      return NextResponse.json(
        { error: 'Missing stripe-signature header' },
        { status: 400 }
      );
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('[Stripe Webhook] Signature verification failed:', err);
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      );
    }

    console.log(`[Stripe Webhook] Processing event: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session, stripe, supabase);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription, stripe, supabase);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription, stripe, supabase);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription, stripe, supabase);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice, stripe, supabase);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice, stripe, supabase);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription, stripe, supabase);
        break;

      default:
        console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('[Stripe Webhook] Error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

// ==============================================
// EVENT HANDLERS
// ==============================================

/**
 * Handle checkout.session.completed
 * Creates subscription record + sends magic link for Challenge flow
 */
async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>
) {
  console.log('[Stripe Webhook] Checkout completed:', session.id);
  console.log('[Stripe Webhook] Metadata:', session.metadata);

  const userId = session.metadata?.userId; // Changed from user_id to userId (matches our API)
  const leadId = session.metadata?.leadId;
  const email = session.metadata?.email;
  const offerChoice = session.metadata?.offerChoice;
  const subscriptionId = session.subscription as string;

  if (!userId || !subscriptionId || !email) {
    console.error('[Stripe Webhook] Missing required metadata:', { userId, subscriptionId, email });
    return;
  }

  console.log('[Stripe Webhook] Processing subscription for user:', userId);

  // Fetch full subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const isTrial = subscription.status === 'trialing';
  const priceId = subscription.items.data[0].price.id;
  const planId = getPlanFromPrice(priceId); // 'starter' or 'professional'

  console.log('[Stripe Webhook] Subscription details:', {
    status: subscription.status,
    isTrial,
    planId,
    priceId
  });

  // ==============================================
  // STEP 1: Create subscription record
  // ==============================================
  const { error: subError } = await supabase.from('subscriptions').insert({
    user_id: userId,
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    status: subscription.status, // 'trialing' or 'active'
    plan_id: planId,

    // Trial information
    trial_started_at: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
    trial_ends_at: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,

    // Billing period
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),

    // Pricing
    amount_cents: subscription.items.data[0].price.unit_amount || 0,
    currency: subscription.currency || 'usd',
    interval: subscription.items.data[0].price.recurring?.interval || 'month',

    // Discount/Coupon (if 20% discount was applied)
    coupon_code: subscription.discount?.coupon.id || null,
    discount_percent: subscription.discount?.coupon.percent_off || null,

    // Metadata
    source: 'design_rite_challenge',
    campaign_name: session.metadata?.campaignName || 'Take the Design Rite Challenge',

    // Payment method info (if available)
    payment_method_last4: null, // Will be populated on first payment
    payment_method_brand: null,
  });

  if (subError) {
    console.error('[Stripe Webhook] Error creating subscription:', subError);
    return;
  }

  console.log('[Stripe Webhook] Subscription record created successfully');

  // ==============================================
  // STEP 2: Create subscription event log
  // ==============================================
  await supabase.from('subscription_events').insert({
    user_id: userId,
    event_type: isTrial ? 'trial_started' : 'subscription_created',
    stripe_event_id: session.id,
    new_status: subscription.status,
    amount_cents: subscription.items.data[0].price.unit_amount || 0,
    metadata: {
      offer_choice: offerChoice,
      plan_id: planId,
      trial_days: isTrial ? 7 : 0
    }
  });

  // ==============================================
  // STEP 3: Update challenge_leads table
  // ==============================================
  if (leadId) {
    await supabase
      .from('challenge_leads')
      .update({
        account_created: true,
        stripe_customer_id: subscription.customer as string,
        subscription_status: subscription.status
      })
      .eq('id', leadId);

    console.log('[Stripe Webhook] Updated challenge lead:', leadId);
  }

  // ==============================================
  // STEP 4: Send magic link for authentication ⭐
  // ==============================================
  console.log('[Stripe Webhook] Sending magic link to:', email);

  const { error: magicLinkError } = await supabase.auth.signInWithOtp({
    email: email.toLowerCase(),
    options: {
      emailRedirectTo: process.env.NODE_ENV === 'development'
        ? 'http://localhost:3001/auth/callback'
        : 'https://portal.design-rite.com/auth/callback',
      data: {
        from_stripe_checkout: true,
        offer_choice: offerChoice,
        subscription_status: subscription.status,
        plan_id: planId
      }
    }
  });

  if (magicLinkError) {
    console.error('[Stripe Webhook] Error sending magic link:', magicLinkError);
    // Don't fail webhook - subscription is already created
    // User can request new magic link from login page
  } else {
    console.log('[Stripe Webhook] Magic link sent successfully');
  }

  console.log(`[Stripe Webhook] ✅ Complete! User ${userId} can now sign in and set password`);
}

/**
 * Handle customer.subscription.created
 */
async function handleSubscriptionCreated(
  subscription: Stripe.Subscription,
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>
) {
  console.log('[Stripe] Subscription created:', subscription.id);
  // Usually handled by checkout.session.completed, but keeping for direct subscriptions
}

/**
 * Handle customer.subscription.updated
 * Handles plan changes, status updates, etc.
 */
async function handleSubscriptionUpdated(
  subscription: Stripe.Subscription,
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>
) {
  console.log('[Stripe] Subscription updated:', subscription.id);

  const tier = getTierFromPrice(subscription.items.data[0].price.id);
  const status = mapStripeStatus(subscription.status);

  // Get current subscription
  const { data: currentSub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (!currentSub) {
    console.error('[Stripe] Subscription not found:', subscription.id);
    return;
  }

  // Update subscription
  const { error } = await supabase.from('subscriptions').update({
    tier,
    status,
    amount: subscription.items.data[0].price.unit_amount || 0,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    next_billing_date: new Date(subscription.current_period_end * 1000).toISOString(),
    cancel_at: subscription.cancel_at ? new Date(subscription.cancel_at * 1000).toISOString() : null,
    cancel_at_period_end: subscription.cancel_at_period_end,
    updated_at: new Date().toISOString(),
  }).eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('[Stripe] Error updating subscription:', error);
    return;
  }

  // Update user profile
  await supabase.from('profiles').update({
    subscription_tier: tier,
    subscription_status: status,
  }).eq('id', currentSub.user_id);

  // Log history if tier or status changed
  if (currentSub.tier !== tier || currentSub.status !== status) {
    const action = currentSub.tier !== tier
      ? (currentSub.tier < tier ? 'upgraded' : 'downgraded')
      : 'payment_succeeded';

    await supabase.from('subscription_history').insert({
      user_id: currentSub.user_id,
      subscription_id: currentSub.id,
      action,
      old_tier: currentSub.tier,
      new_tier: tier,
      old_status: currentSub.status,
      new_status: status,
      is_automatic: true,
    });
  }

  console.log(`[Stripe] Subscription updated: ${subscription.id}, tier: ${tier}, status: ${status}`);
}

/**
 * Handle customer.subscription.deleted
 */
async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>
) {
  console.log('[Stripe] Subscription deleted:', subscription.id);

  const { data: currentSub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (!currentSub) return;

  // Update subscription status
  await supabase.from('subscriptions').update({
    status: 'cancelled',
    cancelled_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('stripe_subscription_id', subscription.id);

  // Update user profile
  await supabase.from('profiles').update({
    subscription_status: 'cancelled',
  }).eq('id', currentSub.user_id);

  // Log history
  await supabase.from('subscription_history').insert({
    user_id: currentSub.user_id,
    subscription_id: currentSub.id,
    action: 'cancelled',
    old_status: currentSub.status,
    new_status: 'cancelled',
    is_automatic: true,
  });

  console.log(`[Stripe] Subscription cancelled: ${subscription.id}`);
}

/**
 * Handle invoice.payment_succeeded
 * Records successful payments
 */
async function handlePaymentSucceeded(
  invoice: Stripe.Invoice,
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>
) {
  console.log('[Stripe] Payment succeeded:', invoice.id);

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', invoice.subscription as string)
    .single();

  if (!sub) return;

  // Record payment
  await supabase.from('payments').insert({
    user_id: sub.user_id,
    subscription_id: sub.id,
    stripe_payment_intent_id: invoice.payment_intent as string,
    stripe_charge_id: invoice.charge as string,
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_paid,
    currency: invoice.currency,
    status: 'succeeded',
    description: invoice.lines.data[0]?.description || 'Subscription payment',
    receipt_url: invoice.hosted_invoice_url,
    invoice_pdf: invoice.invoice_pdf,
  });

  // Update subscription next billing date
  if (invoice.subscription) {
    const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
    await supabase.from('subscriptions').update({
      next_billing_date: new Date(subscription.current_period_end * 1000).toISOString(),
      status: 'active', // Ensure status is active after successful payment
      updated_at: new Date().toISOString(),
    }).eq('stripe_subscription_id', subscription.id);
  }

  // Log history
  await supabase.from('subscription_history').insert({
    user_id: sub.user_id,
    subscription_id: sub.id,
    action: 'payment_succeeded',
    is_automatic: true,
  });

  console.log(`[Stripe] Payment recorded for user ${sub.user_id}`);
}

/**
 * Handle invoice.payment_failed
 * Records failed payments and updates status
 */
async function handlePaymentFailed(
  invoice: Stripe.Invoice,
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>
) {
  console.log('[Stripe] Payment failed:', invoice.id);

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', invoice.subscription as string)
    .single();

  if (!sub) return;

  // Record failed payment
  await supabase.from('payments').insert({
    user_id: sub.user_id,
    subscription_id: sub.id,
    stripe_payment_intent_id: invoice.payment_intent as string,
    stripe_invoice_id: invoice.id,
    amount: invoice.amount_due,
    currency: invoice.currency,
    status: 'failed',
    description: invoice.lines.data[0]?.description || 'Subscription payment',
    failure_code: invoice.last_finalization_error?.code || 'unknown',
    failure_message: invoice.last_finalization_error?.message || 'Payment failed',
  });

  // Update subscription status to past_due
  await supabase.from('subscriptions').update({
    status: 'past_due',
    updated_at: new Date().toISOString(),
  }).eq('stripe_subscription_id', invoice.subscription as string);

  // Update user profile
  await supabase.from('profiles').update({
    subscription_status: 'past_due',
  }).eq('id', sub.user_id);

  // Log history
  await supabase.from('subscription_history').insert({
    user_id: sub.user_id,
    subscription_id: sub.id,
    action: 'payment_failed',
    old_status: sub.status,
    new_status: 'past_due',
    reason: invoice.last_finalization_error?.message,
    is_automatic: true,
  });

  console.log(`[Stripe] Payment failed for user ${sub.user_id}`);

  // TODO: Send dunning email to user
}

/**
 * Handle customer.subscription.trial_will_end
 * 3 days before trial ends
 */
async function handleTrialWillEnd(
  subscription: Stripe.Subscription,
  stripe: Stripe,
  supabase: ReturnType<typeof createClient>
) {
  console.log('[Stripe] Trial will end:', subscription.id);

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (!sub) return;

  // Log history
  await supabase.from('subscription_history').insert({
    user_id: sub.user_id,
    subscription_id: sub.id,
    action: 'trial_will_end',
    is_automatic: true,
  });

  console.log(`[Stripe] Trial ending soon for user ${sub.user_id}`);

  // TODO: Send trial ending reminder email
}

// ==============================================
// HELPER FUNCTIONS
// ==============================================

/**
 * Map Stripe price ID to subscription tier (Challenge flow)
 */
function getTierFromPrice(priceId: string): 'starter' | 'professional' | 'enterprise' {
  // Map your actual Stripe Price IDs here
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER) return 'starter';
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL) return 'professional';
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE) return 'enterprise';

  // Check for annual prices
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER_ANNUAL) return 'starter';
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_ANNUAL) return 'professional';
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL) return 'enterprise';

  // Default to starter if unknown
  console.warn(`[Stripe] Unknown price ID: ${priceId}, defaulting to starter`);
  return 'starter';
}

/**
 * Get plan ID from price (simplified for Challenge)
 */
function getPlanFromPrice(priceId: string): string {
  const STARTER_PRICE_ID = process.env.STRIPE_STARTER_PRICE_ID;
  const PROFESSIONAL_PRICE_ID = process.env.STRIPE_PROFESSIONAL_PRICE_ID;

  if (priceId === STARTER_PRICE_ID) return 'starter';
  if (priceId === PROFESSIONAL_PRICE_ID) return 'professional';

  // Default to starter
  console.warn(`[Stripe Webhook] Unknown price ID: ${priceId}, defaulting to starter`);
  return 'starter';
}

/**
 * Map Stripe subscription status to our internal status
 */
function mapStripeStatus(stripeStatus: Stripe.Subscription.Status): 'active' | 'trialing' | 'past_due' | 'cancelled' | 'paused' {
  switch (stripeStatus) {
    case 'active':
      return 'active';
    case 'trialing':
      return 'trialing';
    case 'past_due':
      return 'past_due';
    case 'canceled':
      return 'cancelled';
    case 'paused':
      return 'paused';
    case 'incomplete':
    case 'incomplete_expired':
    case 'unpaid':
    default:
      return 'cancelled';
  }
}
