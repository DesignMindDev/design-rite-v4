import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-09-30.acacia',
})

// Webhook endpoint secret from Stripe dashboard
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    console.error('No Stripe signature found')
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  try {
    // Get customer details from Stripe
    const customer = await stripe.customers.retrieve(customerId) as Stripe.Customer

    if (!customer.email) {
      console.error('No email found for customer:', customerId)
      return
    }

    // Update user subscription in Supabase
    const { error } = await supabase
      .from('user_profiles')
      .upsert({
        email: customer.email,
        stripe_customer_id: customerId,
        subscription_id: subscription.id,
        subscription_status: subscription.status,
        plan_name: getPlanNameFromSubscription(subscription),
        subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error updating subscription in Supabase:', error)
    } else {
      console.log('Subscription updated for:', customer.email)
    }
  } catch (error) {
    console.error('Error handling subscription change:', error)
  }
}

async function handleSubscriptionCanceled(subscription: Stripe.Subscription) {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        subscription_status: 'canceled',
        subscription_canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('subscription_id', subscription.id)

    if (error) {
      console.error('Error canceling subscription in Supabase:', error)
    } else {
      console.log('Subscription canceled:', subscription.id)
    }
  } catch (error) {
    console.error('Error handling subscription cancellation:', error)
  }
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('Payment succeeded for invoice:', invoice.id)

  // Log successful payment for analytics
  try {
    const { error } = await supabase
      .from('payment_events')
      .insert({
        event_type: 'payment_succeeded',
        stripe_invoice_id: invoice.id,
        customer_id: invoice.customer as string,
        amount: invoice.amount_paid,
        currency: invoice.currency,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error logging payment success:', error)
    }
  } catch (error) {
    console.error('Error in handlePaymentSucceeded:', error)
  }
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Payment failed for invoice:', invoice.id)

  // Log failed payment for monitoring
  try {
    const { error } = await supabase
      .from('payment_events')
      .insert({
        event_type: 'payment_failed',
        stripe_invoice_id: invoice.id,
        customer_id: invoice.customer as string,
        amount: invoice.amount_due,
        currency: invoice.currency,
        created_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error logging payment failure:', error)
    }
  } catch (error) {
    console.error('Error in handlePaymentFailed:', error)
  }
}

function getPlanNameFromSubscription(subscription: Stripe.Subscription): string {
  const priceId = subscription.items.data[0]?.price.id

  // Match against your Stripe price IDs (update these with actual values)
  if (priceId?.includes('professional')) return 'professional'
  if (priceId?.includes('enterprise')) return 'enterprise'

  return 'unknown'
}