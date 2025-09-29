import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default stripePromise;

// Stripe configuration
export const stripeConfig = {
  publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
  backendUrl: process.env.NEXT_PUBLIC_BACKEND_URL || 'https://design-rite-backend.onrender.com',
};

// Payment helpers
export const createPaymentIntent = async (amount: number, currency = 'usd') => {
  const response = await fetch(`${stripeConfig.backendUrl}/api/billing/create-payment-intent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      currency,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create payment intent');
  }

  return response.json();
};

export const createSubscription = async (email: string, name: string, planType: 'professional' | 'enterprise', paymentMethodId: string) => {
  const response = await fetch(`${stripeConfig.backendUrl}/api/billing/create-premium-subscription`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      name,
      planType,
      paymentMethodId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create subscription');
  }

  return response.json();
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