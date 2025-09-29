import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default stripePromise;

// Stripe configuration - Updated for local API routes
export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
};

// Payment helpers - Updated to use local Next.js API routes
export const createCheckoutSession = async (planId: 'professional' | 'enterprise', userEmail: string) => {
  const response = await fetch('/api/stripe/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      planId,
      userEmail,
      successUrl: `${window.location.origin}/dashboard?payment=success`,
      cancelUrl: `${window.location.origin}/upgrade?payment=canceled`,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create checkout session');
  }

  return response.json();
};

// Legacy function kept for compatibility - redirects to Stripe Checkout
export const createPaymentIntent = async (amount: number, currency = 'usd') => {
  // For subscriptions, redirect to createCheckoutSession instead
  throw new Error('Use createCheckoutSession for subscription payments');
};

export const createSubscription = async (email: string, name: string, planType: 'professional' | 'enterprise') => {
  // Use the new checkout session approach
  return createCheckoutSession(planType, email);
};

// Plan configurations
export const stripePlans = {
  professional: {
    name: 'Professional',
    price: 99,
    currency: 'usd',
    interval: 'month',
    features: [
      'Unlimited AI assessments',
      'PDF proposal generation',
      'File upload support',
      'Email support',
    ],
  },
  enterprise: {
    name: 'Enterprise',
    price: 299,
    currency: 'usd',
    interval: 'month',
    features: [
      'Everything in Professional',
      'API access',
      'White-label branding',
      'Priority support',
      'Custom integrations',
    ],
  },
};