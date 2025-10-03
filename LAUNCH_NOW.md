# 🚀 LAUNCH NOW - Quick Start Guide

**Goal:** Accept your first paying customer in under 1 hour

---

## ⚡ **30-MINUTE SETUP**

### **Step 1: Create Stripe Products** (10 min)

1. Go to https://dashboard.stripe.com/products
2. Click "+ Add product" and create:

**Product 1: Design-Rite Starter**
- Monthly: $49 → Copy Price ID
- Annual: $490 → Copy Price ID

**Product 2: Design-Rite Professional**
- Monthly: $199 → Copy Price ID
- Annual: $1,990 → Copy Price ID

**Product 3: Design-Rite Enterprise**
- Monthly: $499 → Copy Price ID
- Annual: $4,990 → Copy Price ID

### **Step 2: Get API Keys** (5 min)

1. Go to https://dashboard.stripe.com/apikeys
2. Copy **Publishable key** (pk_test_...)
3. Copy **Secret key** (sk_test_...)

### **Step 3: Setup Webhook** (5 min)

1. Go to https://dashboard.stripe.com/webhooks
2. Click "+ Add endpoint"
3. URL: `http://localhost:3000/api/webhooks/stripe` (for testing)
4. Select events:
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
5. Copy **Signing secret** (whsec_...)

### **Step 4: Update Environment Variables** (5 min)

Open `.env.local` and add:

```bash
# Stripe API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_YOUR_KEY
STRIPE_SECRET_KEY=sk_test_YOUR_KEY
STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET

# Stripe Price IDs - Monthly
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_YOUR_STARTER_MONTHLY
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL=price_YOUR_PRO_MONTHLY
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE=price_YOUR_ENT_MONTHLY

# Stripe Price IDs - Annual
NEXT_PUBLIC_STRIPE_PRICE_STARTER_ANNUAL=price_YOUR_STARTER_ANNUAL
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL_ANNUAL=price_YOUR_PRO_ANNUAL
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE_ANNUAL=price_YOUR_ENT_ANNUAL
```

### **Step 5: Restart Server** (1 min)

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 🧪 **15-MINUTE TESTING**

### **Test Subscription Flow**

1. Open http://localhost:3000/subscribe
2. Login or create account
3. Click "Start 30-Day Free Trial" on any tier
4. Use Stripe test card: `4242 4242 4242 4242`
5. Expiry: Any future date | CVC: Any 3 digits
6. Complete checkout
7. Verify redirect to dashboard
8. Check subscription tier shown correctly

### **Verify in Stripe Dashboard**

1. Go to https://dashboard.stripe.com/subscriptions
2. See your test subscription listed
3. Check webhook fired: https://dashboard.stripe.com/webhooks

### **Verify in Supabase**

1. Go to https://app.supabase.com
2. Navigate to Table Editor → `subscriptions`
3. See new subscription record with correct tier

---

## 🚀 **10-MINUTE PRODUCTION LAUNCH**

### **Switch to Live Mode**

1. Toggle to **Live Mode** in Stripe Dashboard (top right)
2. Create products again (same prices)
3. Get live API keys (pk_live_..., sk_live_...)
4. Create webhook with production URL: `https://your-domain.com/api/webhooks/stripe`
5. Update production environment variables (in Render.com or your host)
6. Deploy to production

### **Test with Real Card**

1. Go to `https://your-domain.com/subscribe`
2. Complete checkout with your own credit card
3. Verify subscription created
4. Go to Stripe Dashboard → Cancel subscription & issue refund

---

## ✅ **YOU'RE LIVE!**

Your platform can now accept paying customers!

**Customer Flow:**
1. User clicks "Pricing" in nav
2. Selects tier → Clicks "Start Free Trial"
3. Completes Stripe Checkout
4. Gets immediate access to platform
5. 14 days later, automatically charged

**You Monitor:**
- Revenue: `/admin/subscriptions`
- Customers: Stripe Dashboard
- Usage: User dashboard

---

## 📞 **NEED HELP?**

**Detailed guides:**
- `SUBSCRIPTION_LAUNCH_GUIDE.md` - Complete documentation
- `STRIPE_PRODUCT_SETUP.md` - Step-by-step Stripe setup
- `STRIPE_SETUP_GUIDE.md` - Integration details

**Support:**
- Stripe: https://support.stripe.com
- Supabase: https://supabase.com/support

---

**Time to first customer: ~1 hour** ⏱️

**Let's go! 🚀**
