# Stripe Webhook Diagnostic Guide

**Created:** October 18, 2025
**Issue:** No webhook events received on Oct 18, last events were Oct 17
**Environment:** Production (design-rite-v3-zk5r.onrender.com)

---

## 🔑 Current Configuration

### Render Environment Variables (Verified)
```bash
STRIPE_WEBHOOK_SECRET=whsec_Vh8ERs6CgFysvS2pkb5xvHHiKAldULIG
STRIPE_SECRET_KEY=sk_test_51Rdsn800jf1eOeXQ... (redacted - check Render dashboard)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Rdsn800jf1eOeXQ... (redacted - check Render dashboard)
```

### Known Webhook Endpoints
Your application has **TWO** webhook routes:
1. `/api/stripe/webhook` (Older route)
2. `/api/webhooks/stripe` (Newer route)

**Possible webhook URLs:**
- `https://design-rite-v3-zk5r.onrender.com/api/stripe/webhook`
- `https://design-rite-v3-zk5r.onrender.com/api/webhooks/stripe`
- `https://design-rite.com/api/stripe/webhook`
- `https://design-rite.com/api/webhooks/stripe`

---

## 🔍 Step-by-Step Diagnostic

### Step 1: Check Stripe Dashboard Webhook Configuration

1. **Go to Stripe Dashboard**
   - URL: https://dashboard.stripe.com/test/webhooks (for test mode)
   - URL: https://dashboard.stripe.com/webhooks (for live mode)
   - **Note:** You're using TEST keys (`sk_test_*` and `pk_test_*`), so check TEST webhooks first

2. **Verify Webhook Exists**
   - Look for a webhook endpoint pointing to `design-rite.com` or `design-rite-v3-zk5r.onrender.com`
   - Check if the endpoint is **ENABLED** (not disabled or deleted)

3. **Check Endpoint URL**
   - What URL is configured?
   - Does it match one of the possible URLs above?
   - Is it using HTTPS (not HTTP)?

4. **Check Webhook Signing Secret**
   - Click on the webhook endpoint
   - Click "Reveal" next to "Signing secret"
   - **Does it match:** `whsec_Vh8ERs6CgFysvS2pkb5xvHHiKAldULIG`?
   - If NOT, you need to either:
     - Update Render env var to match Stripe's secret, OR
     - Delete and recreate the webhook in Stripe

5. **Check Events Configured**
   - Webhook should be listening for these events:
     - ✅ `checkout.session.completed`
     - ✅ `customer.subscription.created`
     - ✅ `customer.subscription.updated`
     - ✅ `customer.subscription.deleted`
     - ✅ `invoice.payment_succeeded`
     - ✅ `invoice.payment_failed`

---

### Step 2: Test Webhook Manually in Stripe

1. **Go to Stripe Dashboard → Webhooks**
2. **Click on your webhook endpoint**
3. **Click "Send test webhook" button**
4. **Select event type:** `checkout.session.completed`
5. **Add test data:**
   ```json
   {
     "object": {
       "customer_email": "test@example.com",
       "metadata": {
         "fullName": "Test User",
         "company": "Test Company"
       }
     }
   }
   ```
6. **Click "Send test webhook"**
7. **Check response:**
   - ✅ Green checkmark = Webhook received successfully (200 response)
   - ❌ Red X = Webhook failed (check error message)

---

### Step 3: Check Render Logs for Webhook Activity

1. **Go to Render Dashboard**
   - URL: https://dashboard.render.com/web/srv-d35mk4bipnbc739je85g/logs

2. **Search for webhook logs:**
   - Search for: `[Webhook]` or `stripe/webhook` or `/api/webhooks/stripe`
   - Look for any recent activity (last 24 hours)

3. **What to look for:**
   - ✅ `[Webhook] Received Stripe event: checkout.session.completed`
   - ✅ `[Webhook] Processing event: evt_xxx`
   - ❌ `[Webhook] Error: Invalid signature` → Signing secret mismatch
   - ❌ `404 Not Found` → Webhook URL is wrong
   - ❌ `500 Internal Server Error` → Application error (check full logs)

---

### Step 4: Verify Application Routes

Let's verify both webhook routes are deployed and responding:

#### Test Webhook Endpoints (via Bash)

Run these commands to test if the endpoints exist:

```bash
# Test primary webhook endpoint
curl -I https://design-rite-v3-zk5r.onrender.com/api/stripe/webhook

# Test newer webhook endpoint
curl -I https://design-rite-v3-zk5r.onrender.com/api/webhooks/stripe
```

**Expected Response:**
- `405 Method Not Allowed` = Endpoint exists (POST required)
- `404 Not Found` = Endpoint doesn't exist (wrong URL or route deleted)
- `200 OK` = Endpoint exists and responds

---

## 🚨 Common Issues & Solutions

### Issue 1: Webhook Signing Secret Mismatch

**Symptom:** Stripe sends events but Render logs show "Invalid signature" errors

**Solution:**
1. Get signing secret from Stripe webhook page (click "Reveal")
2. Update Render environment variable:
   ```bash
   curl -X PUT -H "Authorization: Bearer rnd_6o7BYWraBuvow4iZbDpJov4y7gJQ" \
     -H "Content-Type: application/json" \
     -d '{"key":"STRIPE_WEBHOOK_SECRET","value":"whsec_NEW_SECRET_FROM_STRIPE"}' \
     "https://api.render.com/v1/services/srv-d35mk4bipnbc739je85g/env-vars/STRIPE_WEBHOOK_SECRET"
   ```
3. Restart Render service to apply new env var

---

### Issue 2: Webhook URL Changed (Render Redeployment)

**Symptom:** Webhook was working yesterday (Oct 17) but stopped today (Oct 18)

**Possible Cause:** Render may have changed the service URL during a deployment or maintenance

**Solution:**
1. Check current production URL in Render dashboard
2. Update Stripe webhook endpoint URL if it changed
3. Or create a new webhook with correct URL (see below)

---

### Issue 3: Webhook Deleted or Disabled

**Symptom:** No webhook endpoint found in Stripe dashboard

**Solution:** Create a new webhook (see Step 5 below)

---

### Issue 4: Wrong Webhook Route

**Symptom:** Webhook shows 404 errors in Stripe dashboard

**Solution:**
1. Check which route exists in your code:
   - `/api/stripe/webhook` (older)
   - `/api/webhooks/stripe` (newer)
2. Update Stripe webhook URL to match
3. Or deploy missing route if it was deleted

---

## 🔧 Step 5: Create New Webhook (If Needed)

If you need to create a new webhook from scratch:

1. **Go to Stripe Dashboard → Webhooks**
2. **Click "+ Add endpoint"**
3. **Enter Endpoint URL:**
   - Try: `https://design-rite-v3-zk5r.onrender.com/api/stripe/webhook`
   - Or: `https://design-rite.com/api/stripe/webhook`
4. **Select events to listen to:**
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. **Click "Add endpoint"**
6. **Copy the signing secret** (click "Reveal")
7. **Update Render environment variable:**
   ```bash
   # Update STRIPE_WEBHOOK_SECRET with the new signing secret
   # Go to: https://dashboard.render.com/web/srv-d35mk4bipnbc739je85g/env
   # Or use Render API to update
   ```
8. **Test webhook** using "Send test webhook" button in Stripe

---

## 📊 Expected Webhook Flow

### When a User Completes Stripe Checkout:

1. **User clicks "20% discount" on `/create-account`**
   - Frontend calls `/api/leads/create-account`
   - API returns `{ redirectToStripe: true }`
   - Frontend redirects to Stripe checkout

2. **User completes payment in Stripe checkout**
   - Stripe processes payment
   - Stripe sends `checkout.session.completed` event to webhook URL

3. **Your webhook receives event**
   - Endpoint: `/api/stripe/webhook` or `/api/webhooks/stripe`
   - Verifies webhook signature using `STRIPE_WEBHOOK_SECRET`
   - Logs: `[Webhook] Received Stripe event: checkout.session.completed`

4. **Webhook creates user account**
   - Checks if user exists in Supabase Auth
   - If not, creates user with email/password reset link
   - Creates subscription record in `subscriptions` table
   - Sends "Create Your Password" email via Supabase Auth

5. **User receives email**
   - Subject: "Welcome to Design-Rite! Create Your Password"
   - Contains password creation link
   - Redirects to portal reset-password page

---

## 🧪 Quick Test Checklist

Use this checklist to diagnose the issue:

- [ ] **Stripe webhook exists** in dashboard (not deleted)
- [ ] **Webhook is enabled** (not disabled)
- [ ] **Webhook URL matches** your production URL
- [ ] **Signing secret matches** Render env var
- [ ] **All required events** are configured
- [ ] **Test webhook succeeds** (green checkmark in Stripe)
- [ ] **Render logs show webhook received** when test sent
- [ ] **Both routes respond** (405 or 200, not 404)
- [ ] **Application code deployed** to production (no pending changes)

---

## 📞 What to Report Back

After running through this diagnostic, report:

1. **Webhook URL in Stripe:** (what URL is configured?)
2. **Webhook Status:** (enabled/disabled/doesn't exist?)
3. **Signing Secret Match:** (does it match `whsec_Vh8ERs6CgFysvS2pkb5xvHHiKAldULIG`?)
4. **Test Webhook Result:** (success/failure/error message?)
5. **Render Logs:** (any webhook activity in last 24 hours?)
6. **Route Test Results:** (do endpoints respond with 405/200/404?)

---

## 🎯 Most Likely Cause

Based on the timing (worked yesterday, stopped today), **most likely causes are:**

1. **Webhook signing secret changed** (if you recreated webhook recently)
2. **Webhook was accidentally deleted** (if you were cleaning up Stripe dashboard)
3. **Render service URL changed** (during deployment or maintenance)

**Least likely causes:**
- Code error (no code changes since yesterday)
- Stripe API outage (would be publicized)
- Environment variable missing (would have failed earlier)

---

## 🚀 Quick Fix Command

If webhook doesn't exist, run this to test endpoint availability:

```bash
# Test both webhook routes
curl -X POST -H "Content-Type: application/json" \
  -d '{"type":"checkout.session.completed"}' \
  https://design-rite-v3-zk5r.onrender.com/api/stripe/webhook

curl -X POST -H "Content-Type: application/json" \
  -d '{"type":"checkout.session.completed"}' \
  https://design-rite-v3-zk5r.onrender.com/api/webhooks/stripe
```

**Expected:** 401 Unauthorized or 400 Bad Request (signature verification fails)
**Problem:** 404 Not Found (route doesn't exist)

---

**Next Step:** Go through Steps 1-4 above and report back what you find. I'll help you fix the specific issue once we identify the root cause.
