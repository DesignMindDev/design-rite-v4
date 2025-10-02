/**
 * Document AI Stripe Webhook Handlers
 * Extends existing Stripe webhook to handle Document AI subscriptions
 * Updates unified users table with subscription data
 */

import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

/**
 * Map Stripe price ID to subscription tier
 */
async function getTierFromPriceId(priceId: string): Promise<'base' | 'pro' | 'enterprise'> {
  // First check admin_settings table
  const { data: adminSettings } = await supabase
    .from('admin_settings')
    .select('stripe_price_id_base, stripe_price_id_pro, stripe_price_id_enterprise')
    .limit(1)
    .single();

  if (adminSettings) {
    if (priceId === adminSettings.stripe_price_id_pro) return 'pro';
    if (priceId === adminSettings.stripe_price_id_enterprise) return 'enterprise';
    if (priceId === adminSettings.stripe_price_id_base) return 'base';
  }

  // Fallback to environment variables
  if (priceId === process.env.STRIPE_PRICE_PRO) return 'pro';
  if (priceId === process.env.STRIPE_PRICE_ENTERPRISE) return 'enterprise';
  if (priceId === process.env.STRIPE_PRICE_BASE) return 'base';

  // Default to base if unknown
  console.warn('[Doc AI Stripe] Unknown price ID:', priceId);
  return 'base';
}

/**
 * Map Stripe subscription status to our status enum
 */
function mapSubscriptionStatus(
  stripeStatus: Stripe.Subscription.Status
): 'active' | 'inactive' | 'cancelled' | 'past_due' {
  const statusMap: Record<Stripe.Subscription.Status, 'active' | 'inactive' | 'cancelled' | 'past_due'> = {
    active: 'active',
    trialing: 'active',
    incomplete: 'inactive',
    incomplete_expired: 'inactive',
    past_due: 'past_due',
    canceled: 'cancelled',
    unpaid: 'past_due',
    paused: 'inactive'
  };

  return statusMap[stripeStatus] || 'inactive';
}

/**
 * Handle checkout.session.completed event
 * Called when a user successfully completes a checkout
 */
export async function handleDocAICheckoutCompleted(session: Stripe.Checkout.Session) {
  try {
    console.log('[Doc AI Stripe] Checkout completed:', session.id);

    const customerId = session.customer as string;
    const subscriptionId = session.subscription as string;

    if (!subscriptionId) {
      console.error('[Doc AI Stripe] No subscription ID in checkout session');
      return;
    }

    // Get subscription details
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2024-09-30.acacia'
    });

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const priceId = subscription.items.data[0]?.price.id;

    if (!priceId) {
      console.error('[Doc AI Stripe] No price ID in subscription');
      return;
    }

    // Determine tier
    const tier = await getTierFromPriceId(priceId);
    const status = mapSubscriptionStatus(subscription.status);

    console.log('[Doc AI Stripe] Tier:', tier, 'Status:', status);

    // Find user by Stripe customer ID
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('stripe_customer_id', customerId)
      .single();

    if (userError || !user) {
      console.error('[Doc AI Stripe] User not found for customer:', customerId);
      return;
    }

    // Update user with subscription info
    const { error: updateError } = await supabase
      .from('users')
      .update({
        stripe_subscription_id: subscriptionId,
        subscription_tier: tier,
        subscription_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[Doc AI Stripe] Error updating user subscription:', updateError);
    } else {
      console.log(`[Doc AI Stripe] ✅ Activated ${tier} subscription for ${user.email}`);
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'subscription_activated',
      success: true,
      details: {
        tier,
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        price_id: priceId
      }
    });

  } catch (error) {
    console.error('[Doc AI Stripe] Error in handleCheckoutCompleted:', error);
  }
}

/**
 * Handle customer.subscription.updated event
 * Called when subscription changes (upgrade, downgrade, renewal)
 */
export async function handleDocAISubscriptionUpdated(subscription: Stripe.Subscription) {
  try {
    console.log('[Doc AI Stripe] Subscription updated:', subscription.id);

    const customerId = subscription.customer as string;
    const priceId = subscription.items.data[0]?.price.id;

    if (!priceId) {
      console.error('[Doc AI Stripe] No price ID in subscription');
      return;
    }

    const tier = await getTierFromPriceId(priceId);
    const status = mapSubscriptionStatus(subscription.status);

    // Find user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('stripe_customer_id', customerId)
      .single();

    if (userError || !user) {
      console.error('[Doc AI Stripe] User not found for customer:', customerId);
      return;
    }

    // Update subscription
    const { error: updateError } = await supabase
      .from('users')
      .update({
        stripe_subscription_id: subscription.id,
        subscription_tier: tier,
        subscription_status: status,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[Doc AI Stripe] Error updating subscription:', updateError);
    } else {
      console.log(`[Doc AI Stripe] ✅ Updated subscription for ${user.email} to ${tier} (${status})`);
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'subscription_updated',
      success: true,
      details: {
        tier,
        status,
        price_id: priceId
      }
    });

  } catch (error) {
    console.error('[Doc AI Stripe] Error in handleSubscriptionUpdated:', error);
  }
}

/**
 * Handle customer.subscription.deleted event
 * Called when subscription is cancelled or expires
 */
export async function handleDocAISubscriptionDeleted(subscription: Stripe.Subscription) {
  try {
    console.log('[Doc AI Stripe] Subscription deleted:', subscription.id);

    const customerId = subscription.customer as string;

    // Find user
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('stripe_customer_id', customerId)
      .single();

    if (userError || !user) {
      console.error('[Doc AI Stripe] User not found for customer:', customerId);
      return;
    }

    // Downgrade to base tier
    const { error: updateError } = await supabase
      .from('users')
      .update({
        subscription_tier: 'base',
        subscription_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    if (updateError) {
      console.error('[Doc AI Stripe] Error cancelling subscription:', updateError);
    } else {
      console.log(`[Doc AI Stripe] ❌ Cancelled subscription for ${user.email}`);
    }

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'subscription_cancelled',
      success: true,
      details: {
        previous_tier: subscription.items.data[0]?.price.id,
        cancelled_at: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('[Doc AI Stripe] Error in handleSubscriptionDeleted:', error);
  }
}

/**
 * Handle invoice.payment_succeeded event
 * Called when a payment is successful (renewal, etc.)
 */
export async function handleDocAIPaymentSucceeded(invoice: Stripe.Invoice) {
  try {
    console.log('[Doc AI Stripe] Payment succeeded:', invoice.id);

    const customerId = invoice.customer as string;

    // Find user
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!user) {
      console.error('[Doc AI Stripe] User not found for customer:', customerId);
      return;
    }

    // Ensure subscription is active
    await supabase
      .from('users')
      .update({
        subscription_status: 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    console.log('[Doc AI Stripe] ✅ Payment succeeded for user:', user.id);

  } catch (error) {
    console.error('[Doc AI Stripe] Error in handlePaymentSucceeded:', error);
  }
}

/**
 * Handle invoice.payment_failed event
 * Called when a payment fails
 */
export async function handleDocAIPaymentFailed(invoice: Stripe.Invoice) {
  try {
    console.log('[Doc AI Stripe] Payment failed:', invoice.id);

    const customerId = invoice.customer as string;

    // Find user
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single();

    if (!user) {
      console.error('[Doc AI Stripe] User not found for customer:', customerId);
      return;
    }

    // Mark subscription as past_due
    await supabase
      .from('users')
      .update({
        subscription_status: 'past_due',
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id);

    console.log('[Doc AI Stripe] ⚠️ Payment failed for user:', user.id);

    // Log activity
    await supabase.from('activity_logs').insert({
      user_id: user.id,
      action: 'payment_failed',
      success: false,
      details: {
        invoice_id: invoice.id,
        amount_due: invoice.amount_due
      }
    });

  } catch (error) {
    console.error('[Doc AI Stripe] Error in handlePaymentFailed:', error);
  }
}
