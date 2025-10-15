// Force dynamic rendering (don't pre-render at build time)
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

// Initialize Stripe only if secret key is available
const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not configured')
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-09-30.acacia',
  })
}

// Webhook endpoint secret from Stripe dashboard
const getWebhookSecret = () => {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    throw new Error('STRIPE_WEBHOOK_SECRET is not configured')
  }
  return process.env.STRIPE_WEBHOOK_SECRET
}

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
    // Get Stripe instance and webhook secret
    const stripe = getStripe()
    const endpointSecret = getWebhookSecret()

    // Verify the webhook signature
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret)
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session)
        break

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

async function handleCheckoutComplete(session: Stripe.Checkout.Session) {
  console.log('[Webhook] Checkout completed for session:', session.id)
  console.log('[Webhook] Customer email:', session.customer_email)
  console.log('[Webhook] Metadata:', session.metadata)

  const { leadId, email, fullName, company } = session.metadata || {}

  if (!leadId || !email) {
    console.error('[Webhook] Missing leadId or email in metadata')
    return
  }

  try {
    // Import Supabase client with service key
    const { createClient } = require('@supabase/supabase-js')
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Update lead record with payment status
    const { error: updateError } = await supabaseAdmin
      .from('challenge_leads')
      .update({
        account_created: true,
        email_verified: true,
        email_verified_at: new Date().toISOString()
      })
      .eq('id', leadId)

    if (updateError) {
      console.error('[Webhook] Error updating lead:', updateError)
    } else {
      console.log('[Webhook] Lead updated successfully')
    }

    // Create auth user account first (if doesn't exist)
    console.log('[Webhook] Creating auth account for:', email)

    const { data: signUpData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      email_confirm: true, // Auto-confirm email since they paid
      user_metadata: {
        full_name: fullName || '',
        company: company || '',
        stripe_customer_id: session.customer as string,
        stripe_subscription_id: session.subscription as string,
        offer_choice: '20percent-discount',
        source: 'design_rite_challenge',
        payment_completed: true
      }
    })

    if (signUpError) {
      // User might already exist - that's okay
      if (signUpError.message.includes('already registered')) {
        console.log('[Webhook] User already exists, updating metadata')

        // Update existing user's metadata
        const { data: users } = await supabaseAdmin.auth.admin.listUsers()
        const existingUser = users?.users.find(u => u.email?.toLowerCase() === email.toLowerCase())

        if (existingUser) {
          await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
            user_metadata: {
              full_name: fullName || '',
              company: company || '',
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              offer_choice: '20percent-discount',
              source: 'design_rite_challenge',
              payment_completed: true
            }
          })
        }
      } else {
        console.error('[Webhook] Error creating user:', signUpError)
        return
      }
    } else {
      console.log('[Webhook] Auth account created successfully:', signUpData.user.id)
    }

    // Now send magic link for immediate access
    console.log('[Webhook] Sending magic link to:', email)

    const { data: authData, error: authError } = await supabaseAdmin.auth.signInWithOtp({
      email: email.toLowerCase(),
      options: {
        emailRedirectTo: process.env.NODE_ENV === 'development'
          ? 'http://localhost:3001/welcome'
          : 'https://portal.design-rite.com/welcome'
      }
    })

    if (authError) {
      console.error('[Webhook] Error sending magic link:', authError)
    } else {
      console.log('[Webhook] Magic link sent successfully')

      // Update lead with magic link sent timestamp
      await supabaseAdmin
        .from('challenge_leads')
        .update({ magic_link_sent_at: new Date().toISOString() })
        .eq('id', leadId)
    }
  } catch (error) {
    console.error('[Webhook] Error in handleCheckoutComplete:', error)
  }
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string

  try {
    // Get Stripe instance and customer details
    const stripe = getStripe()
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