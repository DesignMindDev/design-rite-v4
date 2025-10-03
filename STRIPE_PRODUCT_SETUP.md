# 🚀 Stripe Product Setup - Design-Rite v3 Subscription Launch

**Objective:** Create 3 subscription products in Stripe to enable customer subscriptions

**Estimated Time:** 30 minutes

---

## 📋 Step-by-Step Setup

### 1. Login to Stripe Dashboard

Go to: https://dashboard.stripe.com

**Choose Mode:**
- **Test Mode** (recommended first): Use for testing with test cards
- **Live Mode**: Use when ready to accept real payments

---

### 2. Create Product #1: Starter

**Navigate:** Products → "+ Add product"

**Product Details:**
```
Name: Design-Rite Starter
Description: Perfect for small integrators getting started with AI-powered security design
```

**Pricing - Monthly:**
```
Price: $49.00 USD
Billing period: Monthly
Currency: USD
```

Click **"Add pricing"** → Copy the Price ID (starts with `price_...`)

**Example:** `price_1234ABCDstarter_monthly`

**Pricing - Annual (Optional):**
```
Click "Add another price"
Price: $490.00 USD (2 months free!)
Billing period: Yearly
Currency: USD
```

Click **"Add pricing"** → Copy the Price ID

**Example:** `price_5678EFGHstarter_annual`

---

### 3. Create Product #2: Professional

**Navigate:** Products → "+ Add product"

**Product Details:**
```
Name: Design-Rite Professional
Description: For established integrators scaling their business with unlimited assessments
```

**Pricing - Monthly:**
```
Price: $199.00 USD
Billing period: Monthly
Currency: USD
```

Click **"Add pricing"** → Copy the Price ID

**Example:** `price_9012IJKLpro_monthly`

**Pricing - Annual (Optional):**
```
Click "Add another price"
Price: $1,990.00 USD (2 months free!)
Billing period: Yearly
Currency: USD
```

Click **"Add pricing"** → Copy the Price ID

**Example:** `price_3456MNOPpro_annual`

---

### 4. Create Product #3: Enterprise

**Navigate:** Products → "+ Add product"

**Product Details:**
```
Name: Design-Rite Enterprise
Description: For large organizations with multiple facilities and advanced integration needs
```

**Pricing - Monthly:**
```
Price: $499.00 USD
Billing period: Monthly
Currency: USD
```

Click **"Add pricing"** → Copy the Price ID

**Example:** `price_7890QRSTenterprise_monthly`

**Pricing - Annual (Optional):**
```
Click "Add another price"
Price: $4,990.00 USD (2 months free!)
Billing period: Yearly
Currency: USD
```

Click **"Add pricing"** → Copy the Price ID

**Example:** `price_1234UVWXenterprise_annual`

---

## 🔑 Step 5: Get API Keys

### Publishable Key

**Navigate:** Developers → API keys

Copy **"Publishable key"** (starts with `pk_test_...` in test mode)

**Example:** `pk_test_51ABCxyz123456789`

### Secret Key

**On same page**, reveal and copy **"Secret key"** (starts with `sk_test_...`)

⚠️ **IMPORTANT:** Never commit this to git or share publicly!

**Example:** `sk_test_51DEFabc987654321`

---

## 🪝 Step 6: Setup Webhook Endpoint

### Create Webhook

**Navigate:** Developers → Webhooks → "+ Add endpoint"

**Endpoint URL:**
```
Test Mode: http://localhost:3000/api/webhooks/stripe (use Stripe CLI - see below)
Production: https://your-domain.com/api/webhooks/stripe
```

### Select Events

Check these events:
```
✅ checkout.session.completed
✅ customer.subscription.created
✅ customer.subscription.updated
✅ customer.subscription.deleted
✅ customer.subscription.trial_will_end
✅ invoice.payment_succeeded
✅ invoice.payment_failed
```

Click **"Add endpoint"**

### Get Webhook Secret

After creating, reveal and copy **"Signing secret"** (starts with `whsec_...`)

**Example:** `whsec_abc123xyz789`

---

## ⚙️ Step 7: Update Environment Variables

Open your `.env.local` file and add/update these variables:

```bash
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_ACTUAL_KEY_HERE
STRIPE_SECRET_KEY=sk_test_YOUR_ACTUAL_SECRET_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_ACTUAL_WEBHOOK_SECRET_HERE

# Stripe Price IDs - Monthly
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_YOUR_STARTER_MONTHLY_ID
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL=price_YOUR_PROFESSIONAL_MONTHLY_ID
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE=price_YOUR_ENTERPRISE_MONTHLY_ID

# Stripe Price IDs - Annual (optional)
NEXT_PUBLIC_STRIPE_PRICE_STARTER_ANNUAL=price_YOUR_STARTER_ANNUAL_ID
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_YOUR_PROFESSIONAL_ANNUAL_ID
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL=price_YOUR_ENTERPRISE_ANNUAL_ID
```

### Example (filled in):

```bash
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51ABCxyz123456789
STRIPE_SECRET_KEY=sk_test_51DEFabc987654321
STRIPE_WEBHOOK_SECRET=whsec_abc123xyz789

# Stripe Price IDs - Monthly
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_1234ABCDstarter_monthly
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL=price_9012IJKLpro_monthly
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE=price_7890QRSTenterprise_monthly

# Stripe Price IDs - Annual
NEXT_PUBLIC_STRIPE_PRICE_STARTER_ANNUAL=price_5678EFGHstarter_annual
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_3456MNOPpro_annual
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL=price_1234UVWXenterprise_annual
```

---

## 🧪 Step 8: Test with Stripe CLI (Local Development)

### Install Stripe CLI

**Mac:** `brew install stripe/stripe-cli/stripe`
**Windows:** Download from https://github.com/stripe/stripe-cli/releases
**Linux:** `sudo apt install stripe`

### Login

```bash
stripe login
```

### Forward Webhooks to Local Server

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

This outputs a webhook signing secret - copy it to `.env.local` as `STRIPE_WEBHOOK_SECRET`

### Test Payment

```bash
# In another terminal, start your dev server
npm run dev

# Use Stripe test card in checkout
# Card: 4242 4242 4242 4242
# Expiry: Any future date
# CVC: Any 3 digits
```

---

## ✅ Verification Checklist

Before going live, verify:

- [ ] All 3 products created in Stripe Dashboard
- [ ] Monthly prices set correctly ($49, $199, $499)
- [ ] Annual prices set correctly (optional)
- [ ] Publishable key copied to `.env.local`
- [ ] Secret key copied to `.env.local`
- [ ] Webhook endpoint created
- [ ] All 7 webhook events selected
- [ ] Webhook secret copied to `.env.local`
- [ ] All 6 Price IDs copied to `.env.local`
- [ ] Stripe CLI installed and tested (for local dev)
- [ ] Dev server restarted after env changes

---

## 🚀 Going to Production

When ready to accept real payments:

1. **Switch to Live Mode** in Stripe Dashboard (top right toggle)
2. **Repeat steps 2-7** with live mode (creates separate live products/keys)
3. **Update production environment variables** with live keys (starts with `pk_live_...` and `sk_live_...`)
4. **Update webhook URL** to production domain
5. **Test with real credit card** (yours) before announcing
6. **Monitor Dashboard** for first real subscription

---

## 🎉 You're Ready!

Once environment variables are set and server is restarted, your subscription system will be live!

**Next Steps:**
1. Complete this Stripe setup
2. Test subscribe page at `/subscribe`
3. Verify dashboard shows subscription status
4. Launch! 🚀

---

**Last Updated:** 2025-10-03
**Status:** Ready for setup
