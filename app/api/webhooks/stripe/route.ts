/**
 * Stripe Webhook Handler
 * Processes Stripe subscription events
 * Design-Rite v3 - Phase 5
 */

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Supabase admin client (bypasses RLS)
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

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  try {
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
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      case 'customer.subscription.trial_will_end':
        await handleTrialWillEnd(event.data.object as Stripe.Subscription);
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
 * Creates initial subscription record
 */
async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('[Stripe] Checkout completed:', session.id);

  const userId = session.metadata?.user_id;
  const subscriptionId = session.subscription as string;

  if (!userId || !subscriptionId) {
    console.error('[Stripe] Missing user_id or subscription_id in metadata');
    return;
  }

  // Fetch full subscription details
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  // Determine tier from price
  const tier = getTierFromPrice(subscription.items.data[0].price.id);

  // Create subscription record
  const { error } = await supabase.from('subscriptions').insert({
    user_id: userId,
    stripe_subscription_id: subscription.id,
    stripe_customer_id: subscription.customer as string,
    tier,
    status: subscription.status === 'trialing' ? 'trialing' : 'active',
    billing_period: subscription.items.data[0].price.recurring?.interval === 'year' ? 'annual' : 'monthly',
    amount: subscription.items.data[0].price.unit_amount || 0,
    trial_start: subscription.trial_start ? new Date(subscription.trial_start * 1000).toISOString() : null,
    trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
    current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
    current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
    next_billing_date: new Date(subscription.current_period_end * 1000).toISOString(),
  });

  if (error) {
    console.error('[Stripe] Error creating subscription:', error);
    return;
  }

  // Update user profile
  await supabase.from('profiles').update({
    subscription_tier: tier,
    subscription_status: subscription.status === 'trialing' ? 'trialing' : 'active',
    stripe_customer_id: subscription.customer as string,
    stripe_subscription_id: subscription.id,
  }).eq('id', userId);

  // Log subscription history
  await supabase.from('subscription_history').insert({
    user_id: userId,
    action: subscription.status === 'trialing' ? 'trial_started' : 'created',
    new_tier: tier,
    new_status: subscription.status,
    is_automatic: true,
  });

  console.log(`[Stripe] Subscription created for user ${userId}, tier: ${tier}`);
}

/**
 * Handle customer.subscription.created
 */
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  console.log('[Stripe] Subscription created:', subscription.id);
  // Usually handled by checkout.session.completed, but keeping for direct subscriptions
}

/**
 * Handle customer.subscription.updated
 * Handles plan changes, status updates, etc.
 */
async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
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
async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
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
async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
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
async function handlePaymentFailed(invoice: Stripe.Invoice) {
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
async function handleTrialWillEnd(subscription: Stripe.Subscription) {
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
 * Map Stripe price ID to subscription tier
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
