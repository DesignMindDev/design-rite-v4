# Stripe Integration Setup Guide
**Design-Rite v3 - Document AI Subscription System**

---

## 🎯 Overview

This guide walks you through setting up Stripe for the Document AI subscription system with three tiers:
- **Starter**: $49/month ($490/year) - 25 assessments/month
- **Professional**: $149/month ($1,490/year) - Unlimited assessments
- **Enterprise**: $499/month ($4,990/year) - Full platform access

---

## 📋 Prerequisites

- Stripe account (create at https://stripe.com)
- Access to Stripe Dashboard
- Stripe CLI installed (for local webhook testing)

---

## 🏗️ Step 1: Create Products in Stripe Dashboard

### 1.1 Navigate to Products
1. Go to https://dashboard.stripe.com/products
2. Click **"+ Add product"**

### 1.2 Create Starter Product
```
Product name: Document AI - Starter
Description: Up to 25 AI-powered security assessments per month with basic proposal generation
```

**Pricing (Monthly)**:
- Price: $49.00 USD
- Billing period: Monthly
- Click **"Add pricing"**
- Copy the **Price ID** (starts with `price_...`)

**Pricing (Annual - Optional)**:
- Click **"Add another price"**
- Price: $490.00 USD
- Billing period: Yearly
- Copy the **Price ID**

### 1.3 Create Professional Product
```
Product name: Document AI - Professional
Description: Unlimited AI assessments with advanced features, white-label branding, and priority support
```

**Pricing (Monthly)**:
- Price: $149.00 USD
- Billing period: Monthly
- Copy the **Price ID**

**Pricing (Annual - Optional)**:
- Price: $1,490.00 USD
- Billing period: Yearly
- Copy the **Price ID**

### 1.4 Create Enterprise Product
```
Product name: Document AI - Enterprise
Description: Everything in Professional plus multi-site management, API access, and dedicated account manager
```

**Pricing (Monthly)**:
- Price: $499.00 USD
- Billing period: Monthly
- Copy the **Price ID**

**Pricing (Annual - Optional)**:
- Price: $4,990.00 USD
- Billing period: Yearly
- Copy the **Price ID**

---

## 🔑 Step 2: Get API Keys

### 2.1 Get Publishable Key
1. Go to https://dashboard.stripe.com/apikeys
2. Copy **"Publishable key"** (starts with `pk_test_...` for test mode)

### 2.2 Get Secret Key
1. On the same page, reveal and copy **"Secret key"** (starts with `sk_test_...`)
2. ⚠️ **NEVER commit this to git or share publicly**

---

## 🪝 Step 3: Configure Webhooks

### 3.1 Create Webhook Endpoint

1. Go to https://dashboard.stripe.com/webhooks
2. Click **"+ Add endpoint"**
3. **Endpoint URL**:
   - **Local dev**: Use Stripe CLI (see Step 4)
   - **Production**: `https://your-domain.com/api/webhooks/stripe`

### 3.2 Select Events

Select these events:
```
✅ checkout.session.completed
✅ customer.subscription.created
✅ customer.subscription.updated
✅ customer.subscription.deleted
✅ customer.subscription.trial_will_end
✅ invoice.payment_succeeded
✅ invoice.payment_failed
```

### 3.3 Copy Webhook Secret
- After creating the endpoint, reveal and copy **"Signing secret"** (starts with `whsec_...`)

---

## ⚙️ Step 4: Update Environment Variables

### 4.1 Update `.env.local`

Replace placeholder values with your actual Stripe keys:

```bash
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_SECRET_HERE

# Stripe Price IDs - Monthly
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_YOUR_STARTER_MONTHLY_ID
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL=price_YOUR_PROFESSIONAL_MONTHLY_ID
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE=price_YOUR_ENTERPRISE_MONTHLY_ID

# Stripe Price IDs - Annual (optional)
NEXT_PUBLIC_STRIPE_PRICE_STARTER_ANNUAL=price_YOUR_STARTER_ANNUAL_ID
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_YOUR_PROFESSIONAL_ANNUAL_ID
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL=price_YOUR_ENTERPRISE_ANNUAL_ID
```

### 4.2 Restart Development Server
```bash
npm run dev
```

---

## 🧪 Step 5: Test Locally with Stripe CLI

### 5.1 Install Stripe CLI
- **Mac**: `brew install stripe/stripe-cli/stripe`
- **Windows**: Download from https://github.com/stripe/stripe-cli/releases
- **Linux**: `sudo apt install stripe`

### 5.2 Login to Stripe
```bash
stripe login
```

### 5.3 Forward Webhooks to Local Server
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This will output a webhook signing secret starting with `whsec_...`
Update your `.env.local` with this secret for local testing.

### 5.4 Test Checkout Flow

1. Navigate to http://localhost:3000/doc-ai/subscription
2. Click **"Upgrade Now"** on any tier
3. Use Stripe test card: `4242 4242 4242 4242`
4. Any future expiry date, any CVC
5. Check your terminal for webhook events

---

## 🗄️ Step 6: Database Setup

### 6.1 Run Migration

If not already done, run the subscription tables migration:

```bash
# In Supabase SQL Editor, run:
supabase/migrations/002_subscription_ecommerce_tables.sql
```

### 6.2 Verify Tables Created

Check that these tables exist:
- `subscriptions` - Subscription records
- `payments` - Payment history
- `subscription_history` - Audit trail

---

## ✅ Step 7: Test End-to-End Flow

### Test Checklist:

**Happy Path**:
- [ ] User can click "Upgrade Now" → Redirects to Stripe Checkout
- [ ] User completes payment with test card
- [ ] Webhook fires `checkout.session.completed`
- [ ] Subscription record created in `subscriptions` table
- [ ] User profile updated with tier and status
- [ ] User redirected to `/doc-ai/documents`
- [ ] Subscription page shows new tier

**Failed Payment**:
- [ ] Use test card `4000 0000 0000 0341` (requires authentication)
- [ ] Complete authentication
- [ ] Check `payments` table for failed payment record
- [ ] User status set to `past_due`

**Trial**:
- [ ] In Stripe dashboard, set product to have 30-day trial
- [ ] Complete checkout
- [ ] User status should be `trialing`
- [ ] Check `trial_end` date is 30 days from now

---

## 🚀 Step 8: Production Deployment

### 8.1 Switch to Live Mode

1. In Stripe Dashboard, toggle to **"Live mode"** (top right)
2. Repeat Steps 1-3 with live mode keys
3. Update production environment variables:
   - Update keys from `pk_test_...` to `pk_live_...`
   - Update keys from `sk_test_...` to `sk_live_...`

### 8.2 Update Webhook URL

Create a new webhook endpoint pointing to your production domain:
```
https://your-production-domain.com/api/webhooks/stripe
```

### 8.3 Production Environment Variables

Set these in your hosting platform (Render, Vercel, etc.):
```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (from production webhook)
```

---

## 🔍 Troubleshooting

### Issue: Webhook not firing locally

**Solution**: Make sure Stripe CLI is running:
```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

### Issue: Invalid price ID error

**Solution**: Double-check price IDs in `.env.local` match exactly what's in Stripe Dashboard

### Issue: Subscription not updating in database

**Solution**:
1. Check webhook logs in Stripe Dashboard
2. Check Next.js terminal for error logs
3. Verify Supabase connection is working
4. Check RLS policies on `subscriptions` table

### Issue: 401 Unauthorized on checkout

**Solution**: User must be logged in with Supabase Auth before accessing subscription pages

---

## 📊 Monitoring

### Stripe Dashboard
- Monitor subscriptions: https://dashboard.stripe.com/subscriptions
- View payments: https://dashboard.stripe.com/payments
- Check webhook logs: https://dashboard.stripe.com/webhooks

### Database Queries

**Active subscriptions**:
```sql
SELECT * FROM subscriptions WHERE status = 'active' ORDER BY created_at DESC;
```

**Failed payments**:
```sql
SELECT * FROM payments WHERE status = 'failed' ORDER BY created_at DESC;
```

**Subscription history**:
```sql
SELECT * FROM subscription_history ORDER BY created_at DESC LIMIT 50;
```

---

## 📚 Additional Resources

- **Stripe API Docs**: https://stripe.com/docs/api
- **Stripe Testing**: https://stripe.com/docs/testing
- **Stripe Webhooks**: https://stripe.com/docs/webhooks
- **Stripe CLI**: https://stripe.com/docs/stripe-cli

---

## ✨ Implementation Details

### Checkout Flow
1. User clicks "Upgrade Now" → POST to `/api/doc-ai/create-checkout`
2. API creates/retrieves Stripe customer
3. API creates checkout session with price ID
4. User redirected to Stripe Checkout
5. User completes payment
6. Stripe webhook fires → POST to `/api/webhooks/stripe`
7. Webhook creates subscription record
8. Webhook updates user profile
9. User redirected back to app

### Database Schema
```
profiles
├── stripe_customer_id (TEXT)
├── stripe_subscription_id (TEXT)
├── subscription_tier ('starter' | 'professional' | 'enterprise')
└── subscription_status ('active' | 'trialing' | 'past_due' | 'cancelled')

subscriptions
├── user_id (UUID FK)
├── stripe_subscription_id (TEXT UNIQUE)
├── tier, status, billing_period
├── amount (INTEGER in cents)
├── trial_start, trial_end
├── current_period_start, current_period_end
└── next_billing_date

payments
├── user_id (UUID FK)
├── subscription_id (UUID FK)
├── stripe_payment_intent_id (TEXT UNIQUE)
├── amount, currency, status
├── receipt_url, invoice_pdf
└── failure_code, failure_message
```

---

**Last Updated**: 2025-10-02
**Author**: Claude + Design-Rite Team
