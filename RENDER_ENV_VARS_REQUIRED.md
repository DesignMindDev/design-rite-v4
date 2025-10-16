# Required Render Environment Variables

## Stripe Configuration (MISSING - CAUSING 500 ERROR)

Add these to Render dashboard for design-rite-v4:

```bash
# Stripe Price IDs for Design Rite Challenge
STRIPE_STARTER_PRICE_ID=price_1SIYlfP3RpKr1IEKBT3Rm9wq
STRIPE_PROFESSIONAL_PRICE_ID=price_1SIYlfP3RpKr1IEK4WtX1VE5

# Stripe Annual Price IDs (optional)
STRIPE_STARTER_ANNUAL_PRICE_ID=price_1SIYlfP3RpKr1IEK9Mnnmqrh
STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID=price_1SIYlfP3RpKr1IEKQbfatKt5
```

## Already Configured (Verify These Exist)

```bash
# Stripe Keys
STRIPE_SECRET_KEY=sk_test_51RdsmyP3RpKr1IEK...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51RdsmyP3RpKr1IEK...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://aeorianxnxpxveoxzhov.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# OpenAI
OPENAI_API_KEY=sk-proj-eNFCtLC6t8N9CdLV...
```

## How to Add on Render:

1. Go to https://dashboard.render.com
2. Select your `design-rite-v4` service
3. Go to **Environment** tab
4. Click **Add Environment Variable**
5. Add each variable with key/value
6. Click **Save Changes**
7. Render will automatically redeploy

## Error This Fixes:

```
Error: "No such price: 'price_starter'"
Details: StripeInvalidRequestError
```

The code was falling back to default placeholder value `'price_starter'` which doesn't exist in Stripe.

## Verification:

After adding variables, test with:
```bash
curl https://www.design-rite.com/api/stripe/create-checkout-session?leadId=test&email=test@example.com&fullName=Test&company=Test&discount=20percent-first-year
```

Should return a 307 redirect to Stripe checkout instead of 500 error.
