# Urgent Fixes Needed - October 18, 2025

## ✅ Issue 1: Duplicate User Detection - FIXED IN CODE

**Problem:** Existing subscribers could still go through Stripe checkout and get stuck.

**Solution:** Added duplicate detection in `/api/leads/create-account`
- Checks Supabase Auth for existing users
- Checks if user has active subscription
- Returns 409 error with friendly message
- Frontend redirects to login automatically

**Status:** Code committed - needs deployment

---

## ⚠️ Issue 2: Supabase Email Template - MANUAL FIX REQUIRED

**Problem:** Email says "Reset Password" instead of "Create Your Password"

**Solution:** You MUST update the Supabase email template in the dashboard

### Step-by-Step Instructions:

1. **Go to Supabase Dashboard**
   - URL: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov
   - Navigate to: **Authentication** → **Email Templates**

2. **Select "Reset Password" Template**

3. **Update Subject Line:**
   ```
   Welcome to Design-Rite! Create Your Password 🚀
   ```

4. **Replace Template Body with:**
   ```html
   <h2>Welcome to Design-Rite! 🎉</h2>

   <p>Hi there,</p>

   <p>Welcome to the Design-Rite family! We're thrilled to have you join thousands of security and low-voltage professionals who are transforming how they create proposals.</p>

   <h3>Create Your Password</h3>

   <p>To get started, click the button below to create your secure password:</p>

   <p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #7C3AED; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Create My Password</a></p>

   <p>Or copy and paste this link into your browser:<br/>
   {{ .ConfirmationURL }}</p>

   <h3>What's Next?</h3>

   <ul>
     <li><strong>Access Your Dashboard</strong> - View all your projects and proposals in one place</li>
     <li><strong>Try AI Assessment</strong> - Get professional proposals in minutes, not hours</li>
     <li><strong>Join the Community</strong> - Connect with other sales engineers and share tips</li>
   </ul>

   <h3>Need Help?</h3>

   <p>Our support team is here for you:</p>
   <ul>
     <li>📧 Email: support@design-rite.com</li>
     <li>📚 Help Center: https://design-rite.com/help</li>
     <li>💬 Live Chat: Available in your dashboard</li>
   </ul>

   <p>This link expires in 24 hours for security purposes. If it expires, you can request a new one anytime.</p>

   <p>Excited to see what you'll build with Design-Rite!</p>

   <p>Best regards,<br/>
   The Design-Rite Team</p>

   <hr style="border: 1px solid #e5e7eb; margin: 24px 0;"/>

   <p style="font-size: 12px; color: #6b7280;">
     If you didn't sign up for Design-Rite, you can safely ignore this email. Someone may have entered your email address by mistake.
   </p>
   ```

5. **Click "Save"**

6. **Test:**
   - Create a new test account
   - Check email - should now say "Welcome to Design-Rite! Create Your Password"

---

## 🔴 Issue 3: Stripe Webhooks Not Working - CRITICAL

**Problem:** No webhook events received today (Oct 18), last events were Oct 17

**Possible Causes:**
1. Webhook endpoint URL changed
2. Webhook signing secret changed/invalid
3. Render deployment URL changed
4. Webhook was deleted/disabled in Stripe

### Diagnosis Steps:

1. **Check Stripe Webhook Configuration**
   - Go to: https://dashboard.stripe.com/webhooks
   - Find webhook endpoint for design-rite.com
   - Check if it's enabled
   - Check endpoint URL (should be: `https://design-rite-v3-zk5r.onrender.com/api/stripe/webhook` or `https://design-rite.com/api/webhooks/stripe`)

2. **Check Webhook Events Listened:**
   Should include:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`

3. **Test Webhook Manually:**
   - In Stripe Dashboard → Webhooks
   - Click on your webhook endpoint
   - Click "Send test webhook"
   - Select `checkout.session.completed`
   - Check if event appears in Render logs

4. **Check Webhook Secret:**
   - In Stripe Dashboard → Webhooks → Click endpoint
   - Click "Reveal" next to "Signing secret"
   - Compare with environment variable in Render:
     - Go to: https://dashboard.render.com/web/srv-d35mk4bipnbc739je85g/env
     - Find `STRIPE_WEBHOOK_SECRET`
     - Update if they don't match

### Quick Fix if Webhook Doesn't Exist:

Create new webhook in Stripe:
- **Endpoint URL:** `https://design-rite-v3-zk5r.onrender.com/api/stripe/webhook`
- **Events:**
  - checkout.session.completed
  - customer.subscription.created
  - customer.subscription.updated
  - customer.subscription.deleted
  - invoice.payment_succeeded
  - invoice.payment_failed
- **Copy signing secret** and add to Render environment variables as `STRIPE_WEBHOOK_SECRET`

### Alternative: Check Correct Webhook Route

We have TWO webhook routes:
1. `/api/stripe/webhook` - Older route
2. `/api/webhooks/stripe` - Newer route

Check which one is configured in Stripe and ensure it matches.

---

## 🧪 Testing Checklist After Fixes

### Test 1: New User Signup (7-day trial)
- [ ] Go to /create-account
- [ ] Fill in form with new email
- [ ] Choose "7-day trial"
- [ ] Submit form
- [ ] Should receive magic link email (check subject and body)
- [ ] Click magic link
- [ ] Should go to portal auth callback
- [ ] Should be logged in

### Test 2: Existing User Signup Prevention
- [ ] Go to /create-account
- [ ] Fill in form with EXISTING subscriber email (dkozich2021@gmail.com)
- [ ] Choose either option
- [ ] Submit form
- [ ] Should see error: "You already have an active Design-Rite account!"
- [ ] Should auto-redirect to login after 2 seconds
- [ ] Should NOT create duplicate lead
- [ ] Should NOT send email

### Test 3: Stripe Webhook Test
- [ ] Go to Stripe Dashboard → Webhooks
- [ ] Click your webhook endpoint
- [ ] Click "Send test webhook"
- [ ] Select `checkout.session.completed` event
- [ ] Add test data (email, metadata)
- [ ] Send webhook
- [ ] Check Render logs for webhook received message
- [ ] Verify user created in Supabase (if test email was new)

### Test 4: Full Paid Signup Flow
- [ ] Go to /create-account
- [ ] Fill in form with NEW email
- [ ] Choose "20% discount"
- [ ] Submit form
- [ ] Should redirect to Stripe checkout
- [ ] Complete payment
- [ ] Should receive "Create Your Password" email (NOT "Reset Password")
- [ ] Click link in email
- [ ] Should go to portal reset-password page
- [ ] Create password
- [ ] Should be logged into portal

---

## 📋 Deployment Checklist

- [ ] Commit code changes (duplicate detection fix)
- [ ] Push to main branch
- [ ] Verify production deployment succeeds
- [ ] Update Supabase email template (MANUAL - see above)
- [ ] Fix Stripe webhook configuration (MANUAL - see above)
- [ ] Run all tests above
- [ ] Monitor Stripe webhook events for next signup
- [ ] Monitor Render logs for webhook processing

---

## 🔧 Environment Variables to Verify

In Render (https://dashboard.render.com/web/srv-d35mk4bipnbc739je85g/env):

```bash
# Stripe
STRIPE_SECRET_KEY=sk_live_... (or sk_test_... for testing)
STRIPE_WEBHOOK_SECRET=whsec_... (must match Stripe dashboard)
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_...
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL=price_...
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE=price_...

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://aeorianxnxpxveoxzhov.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# URLs
NODE_ENV=production
```

---

## 📝 Files Modified in This Fix

1. `app/api/leads/create-account/route.ts` - Added duplicate user check
2. `app/create-account/page.tsx` - Handle 409 error and redirect to login
3. `URGENT_FIXES_NEEDED.md` - This file (instructions)

---

**Last Updated:** October 18, 2025 12:40 PM
**Next Steps:** Deploy code, update Supabase template, fix Stripe webhooks
