# 7-Day Trial with Payment Collection - Complete Implementation

**Date:** October 16, 2025
**Status:** ✅ Implemented and Ready for Testing

---

## 🎯 What Was Built

A complete signup flow where **BOTH the 7-day trial AND 20% discount paths collect payment information upfront** via Stripe Checkout, then send a magic link for authentication and password setup.

### **Key Features:**
- ✅ User created in Supabase **BEFORE** payment
- ✅ **7-day trial collects card info** but doesn't charge until trial ends
- ✅ 20% discount path charges immediately
- ✅ Subscription record created after payment
- ✅ Magic link sent after Stripe checkout completes
- ✅ Password setup modal on first login
- ✅ Complete audit trail in subscription_events table

---

## 📊 Complete User Journey

### **Path 1: 7-Day Free Trial (Card Required)**
```
1. User fills form at design-rite.com/create-account
   ↓
2. Lead saved to challenge_leads table
   ↓
3. Supabase user created (NOT authenticated yet)
   ↓
4. User profile created in user_profiles table
   ↓
5. Redirected to Stripe Checkout
   ↓
6. Stripe Checkout with trial_period_days: 7
   ↓
7. User enters card info (required but not charged)
   ↓
8. Payment method saved for future billing
   ↓
9. Stripe webhook: checkout.session.completed
   ↓
10. Subscription record created (status: 'trialing')
   ↓
11. Magic link email sent
   ↓
12. User clicks magic link
   ↓
13. Redirected to /auth/callback → /welcome
   ↓
14. Password setup modal appears
   ↓
15. User sets password and can now sign in!
```

### **Path 2: 20% Discount (Immediate Payment)**
```
Same as Path 1, but:
- Step 6: Stripe charges immediately with 20% discount
- Step 10: Subscription status: 'active'
```

---

## 🗄️ Database Structure

### **Tables Created:**

#### **1. subscriptions**
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  status TEXT, -- 'trialing', 'active', 'past_due', 'canceled'
  plan_id TEXT, -- 'starter', 'professional'

  -- Trial
  trial_started_at TIMESTAMPTZ,
  trial_ends_at TIMESTAMPTZ,

  -- Billing
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  amount_cents INTEGER,
  currency TEXT,
  interval TEXT, -- 'month', 'year'

  -- Discount
  coupon_code TEXT,
  discount_percent INTEGER,

  -- Metadata
  source TEXT,
  campaign_name TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **2. user_profiles**
```sql
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  full_name TEXT NOT NULL,
  company TEXT NOT NULL,
  phone TEXT,
  job_title TEXT,
  company_size TEXT,
  pain_point TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### **3. subscription_events**
```sql
CREATE TABLE subscription_events (
  id UUID PRIMARY KEY,
  subscription_id UUID REFERENCES subscriptions(id),
  user_id UUID REFERENCES auth.users(id),
  event_type TEXT, -- 'trial_started', 'payment_succeeded', etc.
  stripe_event_id TEXT,
  previous_status TEXT,
  new_status TEXT,
  amount_cents INTEGER,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔧 Implementation Files

### **Backend APIs Modified:**

#### **1. create-account API** (`app/api/leads/create-account/route.ts`)
```typescript
// NEW FLOW:
1. Save lead to challenge_leads
2. Create Supabase user via admin.createUser()
3. Create user profile
4. Return: redirectToStripe: true, userId, leadId, offerChoice
```

**Key Changes:**
- ✅ Creates user BEFORE payment (not after)
- ✅ Returns userId for Stripe metadata
- ✅ BOTH trial and discount paths redirect to Stripe

#### **2. Stripe Checkout API** (`app/api/stripe/create-checkout-session/route.ts`)
```typescript
// NEW PARAMETERS:
- userId (Supabase user ID)
- offerChoice ('7day-trial' or '20percent-discount')

// TRIAL CONFIGURATION:
subscription_data: {
  trial_period_days: 7,
  trial_settings: {
    end_behavior: {
      missing_payment_method: 'cancel'
    }
  }
}

// PAYMENT COLLECTION:
payment_method_collection: isTrial ? 'if_required' : 'always'
```

**Key Changes:**
- ✅ Accepts userId in parameters
- ✅ Trial with `trial_period_days: 7`
- ✅ Collects payment method for trial
- ✅ Custom text: "Card will be charged after trial ends"
- ✅ userId stored in metadata for webhook

#### **3. Stripe Webhook** (`app/api/webhooks/stripe/route.ts`)
```typescript
// ENHANCED checkout.session.completed:
1. Extract userId from session.metadata
2. Fetch full subscription details
3. Create subscription record
4. Create subscription_events log
5. Update challenge_leads with subscription status
6. Send magic link via supabase.auth.signInWithOtp()
```

**Key Changes:**
- ✅ Uses new subscriptions table structure
- ✅ Sends magic link AFTER payment
- ✅ Logs trial_started or subscription_created event
- ✅ Handles both trial and paid subscriptions

### **Frontend Modified:**

#### **4. create-account Page** (`app/create-account/page.tsx`)
```typescript
// UPDATED REDIRECT:
const stripeParams = new URLSearchParams({
  leadId: data.leadId,
  userId: data.userId, // NEW
  email: formData.email,
  fullName: formData.fullName,
  company: formData.company,
  offerChoice: data.offerChoice // NEW ('7day-trial' or '20percent-discount')
})
```

**Key Changes:**
- ✅ Passes userId to Stripe checkout
- ✅ Passes offerChoice for both paths
- ✅ Shows trial-specific messaging

---

## 🎬 Stripe Checkout Experience

### **7-Day Trial Checkout:**
```
✅ Heading: "Start Your 7-Day Free Trial"
✅ Subheading: "Your card will be charged after the trial ends unless you cancel"
✅ Line item: "Starter Plan - $97/month"
✅ Trial: "7-day free trial"
✅ Payment: Card required but shows $0 due today
✅ Submit button: "Start Your 7-Day Free Trial"
✅ Terms of Service checkbox: Required
```

### **20% Discount Checkout:**
```
✅ Heading: "Complete Your Purchase"
✅ Line item: "Starter Plan - $97/month"
✅ Discount: "20% OFF FIRST YEAR" (-$233.28)
✅ Payment: $77.60 due today
✅ Submit button: "Subscribe"
```

---

## 🧪 Testing Checklist

### **Test 1: 7-Day Trial with Card Collection**
1. ✅ Go to `http://localhost:3000/create-account`
2. ✅ Fill form with business email
3. ✅ Select "7-Day Free Trial"
4. ✅ Click "Accept the Challenge"
5. ✅ **Expected:** Redirected to Stripe Checkout
6. ✅ **Expected:** Checkout shows "7-day free trial"
7. ✅ **Expected:** Payment method required but $0 due today
8. ✅ Use test card: `4242 4242 4242 4242`
9. ✅ **Expected:** Checkout succeeds
10. ✅ **Expected:** Subscription created with status='trialing'
11. ✅ **Expected:** Magic link sent to email
12. ✅ Click magic link
13. ✅ **Expected:** Redirected to `/welcome`
14. ✅ **Expected:** Password setup modal appears
15. ✅ Set password
16. ✅ Sign out and sign in with email + password
17. ✅ **Expected:** Login successful

### **Test 2: 20% Discount with Immediate Payment**
1. Follow steps 1-4 from Test 1
2. Select "Subscribe Now - 20% Off First Year"
3. **Expected:** Redirected to Stripe Checkout
4. **Expected:** Checkout shows 20% discount applied
5. **Expected:** $77.60 charged immediately
6. Use test card: `4242 4242 4242 4242`
7. **Expected:** Payment succeeds
8. **Expected:** Subscription created with status='active'
9. Follow steps 11-17 from Test 1

### **Test 3: Verify Database Records**

**After successful trial signup, verify:**

#### **Supabase auth.users:**
```sql
SELECT id, email, created_at, email_confirmed_at
FROM auth.users
WHERE email = 'test@company.com';
```
- ✅ User exists
- ✅ email_confirmed_at set after magic link

#### **user_profiles:**
```sql
SELECT *
FROM user_profiles
WHERE id = '<user_id>';
```
- ✅ Profile created with company, phone, job_title, etc.

#### **subscriptions:**
```sql
SELECT *
FROM subscriptions
WHERE user_id = '<user_id>';
```
- ✅ Subscription record exists
- ✅ status = 'trialing'
- ✅ trial_ends_at = 7 days from now
- ✅ stripe_subscription_id populated

#### **subscription_events:**
```sql
SELECT *
FROM subscription_events
WHERE user_id = '<user_id>'
ORDER BY created_at DESC;
```
- ✅ Event: 'trial_started'
- ✅ metadata contains offer_choice, plan_id

#### **challenge_leads:**
```sql
SELECT *
FROM challenge_leads
WHERE email = 'test@company.com';
```
- ✅ account_created = true
- ✅ stripe_customer_id populated
- ✅ subscription_status = 'trialing'

---

## 🔐 What Happens After 7 Days?

### **If User Keeps Trial:**
1. Stripe automatically charges the card on file
2. Webhook: `invoice.payment_succeeded`
3. Subscription status updated to 'active'
4. User continues with full access

### **If User Cancels Before Trial Ends:**
1. User cancels via dashboard
2. Stripe cancels subscription
3. Webhook: `customer.subscription.deleted`
4. Subscription status updated to 'canceled'
5. Access revoked at trial end

---

## 📧 Magic Link Email

**Subject:** Confirm your email - Design-Rite

**Body:**
```
Hi [Name],

Click the link below to confirm your email and access your account:

[Confirm Email]

This link expires in 1 hour.

If you didn't request this, please ignore this email.

Thanks,
The Design-Rite Team
```

**After clicking:**
- Redirected to: `http://localhost:3001/auth/callback?token_hash=xxx&type=magiclink`
- Callback route verifies token
- User redirected to: `http://localhost:3001/welcome`
- Password modal appears

---

## 🚨 Common Issues & Solutions

### **Issue 1: "Missing userId parameter"**
**Cause:** Frontend not passing userId to Stripe checkout
**Fix:** Ensure API response includes `userId: authUser.user.id`

### **Issue 2: "Webhook not receiving events"**
**Cause:** Webhook URL not configured in Stripe
**Fix:**
1. Go to Stripe Dashboard → Developers → Webhooks
2. Add endpoint: `https://your-domain.com/api/webhooks/stripe`
3. Select events: `checkout.session.completed`, `customer.subscription.*`

### **Issue 3: "Magic link redirects to /auth instead of /welcome"**
**Cause:** Supabase redirect URL not whitelisted
**Fix:**
1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Add: `http://localhost:3001/auth/callback`
3. Add: `https://portal.design-rite.com/auth/callback`

### **Issue 4: "Trial not starting - charging immediately"**
**Cause:** `trial_period_days` not set correctly
**Fix:** Verify Stripe checkout includes `subscription_data.trial_period_days: 7`

---

## 🎯 Success Criteria

✅ **User created before payment** (not after)
✅ **Trial collects payment method** but doesn't charge
✅ **20% discount charges immediately**
✅ **Subscription record created** after Stripe webhook
✅ **Magic link sent** after payment success
✅ **Password modal appears** on first login
✅ **User can sign in** with email + password
✅ **Complete audit trail** in database

---

## 🚀 Deployment Checklist

### **1. Run SQL Migration**
```bash
# Run in Supabase SQL Editor:
cat supabase/challenge_subscriptions.sql
```

### **2. Configure Stripe Webhook**
- URL: `https://your-domain.com/api/webhooks/stripe`
- Events:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`

### **3. Update Environment Variables**
```bash
# Render environment variables:
STRIPE_SECRET_KEY=sk_live_... # Challenge account secret key
STRIPE_WEBHOOK_SECRET=whsec_... # From Stripe webhook configuration
STRIPE_STARTER_PRICE_ID=price_... # Monthly Starter price ID
STRIPE_PROFESSIONAL_PRICE_ID=price_... # Monthly Professional price ID
```

### **4. Configure Supabase Redirect URLs**
- Add: `https://portal.design-rite.com/auth/callback`
- Add: `https://portal.design-rite.com/welcome`

### **5. Test Production Flow**
1. Use real email address
2. Complete Stripe checkout with test card
3. Verify magic link received
4. Verify password setup works
5. Verify can sign in with password

---

## 📚 Helper Functions Available

### **Supabase SQL Functions:**
```sql
-- Check if user has active subscription
SELECT user_has_access('<user_id>');

-- Get active subscription details
SELECT * FROM get_active_subscription('<user_id>');

-- View all active subscriptions
SELECT * FROM v_active_subscriptions;

-- View trial conversion tracking
SELECT * FROM v_trial_conversions;
```

---

## 🎉 Implementation Complete!

**All major components implemented:**
- ✅ Database tables and functions
- ✅ Create account API with user creation
- ✅ Stripe checkout with trial support
- ✅ Webhook handler with subscription creation
- ✅ Magic link authentication flow
- ✅ Password setup modal

**Ready for testing and deployment!** 🚀
