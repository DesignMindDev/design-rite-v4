# Design Rite Challenge - Complete End-to-End Testing Flow

**Date:** October 16, 2025
**Purpose:** Test the complete user journey from main page to password setup
**Status:** Ready for Testing

---

## 🎯 Complete User Journey

### **Path 1: Free Trial (Magic Link Only)**
```
design-rite.com → Try Platform → Fill Form → Select Free Trial → Check Email →
Click Magic Link → Welcome Page → Set Password Modal → Dashboard
```

### **Path 2: 20% Discount (Payment + Magic Link)**
```
design-rite.com → Try Platform → Fill Form → Select 20% Discount →
Stripe Checkout → Complete Payment → Check Email → Click Magic Link →
Welcome Page → Set Password Modal → Dashboard
```

---

## 🧪 Testing Checklist

### **Pre-Test Setup**

- [ ] V4 platform running: `http://localhost:3000`
- [ ] Portal running: `http://localhost:3001`
- [ ] Supabase Auth configured (magic link emails enabled)
- [ ] Stripe configured with correct price IDs
- [ ] Test email address ready (use real email to receive magic links)

---

## ✅ Test 1: Free Trial Flow (Complete Journey)

### **Step 1: Access Create Account Page**
1. Open browser: `http://localhost:3000`
2. Click any "Try Platform" button
3. **Expected:** Redirected to `/create-account` page
4. **Verify:** 3-step form visible with Design Rite Challenge branding

### **Step 2: Fill Out Form**
1. **Step 1 - Personal Info:**
   - Email: `your-test-email@yourdomain.com` (must be business email, not Gmail/Yahoo)
   - Full Name: `Test User`
   - Phone: `555-123-4567`
   - Click "Next"

2. **Step 2 - Company Info:**
   - Company: `Test Security Inc`
   - Role: `Sales Engineer`
   - Click "Next"

3. **Step 3 - Choose Offer:**
   - Select: **"7-Day Free Trial"**
   - Click: **"Accept the Challenge"**

### **Step 3: Success Screen**
- **Expected:** "Check Your Email" screen appears
- **Message:** "We've sent a magic link to your-test-email@yourdomain.com"
- **Verify:** Lead saved to Supabase `challenge_leads` table

### **Step 4: Check Email**
1. Open email inbox
2. Look for email from Supabase (subject: "Confirm your email" or similar)
3. Click the magic link in email
4. **Expected:** Redirected to `http://localhost:3001/welcome`

### **Step 5: Welcome Page + Password Modal**
1. **Expected:** Welcome page loads with your name
2. **Expected:** Password setup modal appears automatically
3. **Verify Modal Content:**
   - Title: "Set Your Password"
   - Info message: "Welcome! Set a password to sign in easily next time."
   - Password field with show/hide toggle
   - Confirm password field
   - Password requirements checklist
   - "Skip for Now" button
   - "Set Password" button

### **Step 6: Set Password**
1. Enter password: `TestPassword123!`
2. Confirm password: `TestPassword123!`
3. **Verify:** All requirement checkmarks turn green
4. Click "Set Password"
5. **Expected:**
   - Toast notification: "Password set successfully!"
   - Modal closes
   - Welcome page visible with user info

### **Step 7: Explore Welcome Page**
1. **Verify User Info:**
   - Name displays correctly
   - Email displays correctly
   - Trial badge: "7-Day Free Trial Active (3 Assessments)"
2. Click "My Portal" button
3. **Expected:** Dashboard opens

### **Step 8: Sign Out**
1. Find sign out button (navigation or profile menu)
2. Click "Sign Out"
3. **Expected:** Redirected to `/auth` login page

### **Step 9: Sign In with Password**
1. At `/auth` page, enter:
   - Email: `your-test-email@yourdomain.com`
   - Password: `TestPassword123!`
2. Click "Sign In"
3. **Expected:** Successfully authenticated → Redirected to dashboard
4. **Verify:** Password login works! ✅

### **Step 10: Verify No Duplicate Modal**
1. Navigate to `/welcome` page
2. **Expected:** Password modal does NOT appear (already set)

---

## ✅ Test 2: Skip Password Flow

### **Repeat Steps 1-5** from Test 1

### **Step 6: Skip Password Setup**
1. When password modal appears, click **"Skip for Now"**
2. **Expected:**
   - Toast: "You can set a password later from your account settings"
   - Modal closes
   - Welcome page visible

### **Step 7: Sign Out and Try Password Login**
1. Sign out
2. Go to `/auth`
3. Try signing in with email + password
4. **Expected:** Login fails (no password set)

### **Step 8: Sign In with Magic Link**
1. At `/auth` page, request new magic link
2. Check email, click link
3. **Expected:** Successfully authenticated

---

## ✅ Test 3: 20% Discount Flow (Payment Path)

### **Step 1-2: Same as Test 1**

### **Step 3: Choose Discount Offer**
1. At Step 3, select: **"Subscribe Now - 20% Off First Year"**
2. Click: **"Accept the Challenge"**

### **Step 4: Stripe Checkout**
1. **Expected:** Redirected to Stripe Checkout page
2. **Verify Stripe Page Shows:**
   - Email pre-filled: `your-test-email@yourdomain.com`
   - Plan: Starter ($97/mo) or Professional ($297/mo)
   - Discount applied: 20% off
   - Discounted price: $77.60 (Starter) or $237.60 (Professional)
   - Coupon: `DESIGN_RITE_CHALLENGE_20`

### **Step 5: Complete Test Payment**
1. Use Stripe test card: `4242 4242 4242 4242`
2. Expiry: Any future date (e.g., `12/26`)
3. CVC: Any 3 digits (e.g., `123`)
4. ZIP: Any 5 digits (e.g., `12345`)
5. Click "Subscribe"
6. **Expected:** Payment succeeds

### **Step 6: Webhook Triggers Magic Link**
1. Check console logs in V4 terminal
2. **Expected:** Webhook received: `checkout.session.completed`
3. **Expected:** Magic link sent to user email

### **Step 7: Check Email & Continue**
1. Open email inbox
2. Look for magic link email
3. Click magic link
4. **Expected:** Redirected to `/welcome` with password modal

### **Step 8: Complete Password Setup**
1. Follow Step 6-9 from Test 1

### **Step 9: Verify Subscription Active**
1. Go to dashboard
2. Check subscription status
3. **Expected:** Active subscription with 20% discount

---

## ❌ Error Scenarios to Test

### **Test 4: Invalid Email (Free Email Provider)**
1. Start signup flow
2. Enter email: `test@gmail.com`
3. **Expected:** Error: "Please use a business email address"

### **Test 5: Duplicate Email**
1. Complete signup once
2. Try signing up again with same email
3. **Expected:** Error: "An account with this email already exists"

### **Test 6: Weak Password**
1. Get to password modal
2. Enter: `abc123`
3. **Expected:** Requirements show red, button disabled
4. Enter: `TestPassword123!`
5. **Expected:** Requirements turn green, button enabled

### **Test 7: Password Mismatch**
1. Get to password modal
2. Password: `TestPassword123!`
3. Confirm: `DifferentPassword123!`
4. **Expected:** "Passwords match" requirement shows red

### **Test 8: Stripe Payment Decline**
1. Start 20% discount flow
2. At Stripe checkout, use declined card: `4000 0000 0000 0002`
3. **Expected:** Stripe shows error, user can retry
4. **Verify:** Lead saved but `account_created = false`

---

## 🔍 What to Monitor

### **Console Logs (V4 - Port 3000)**
```
[Create Account API] Saving lead to Supabase...
[Create Account API] Lead saved successfully: <uuid>
[Create Account API] Routing to Stripe checkout with 20% discount
[Stripe Checkout] Creating session for: <email> with discount: 20percent-first-year
[Stripe Checkout] Using price IDs: { starter: 'price_...', professional: 'price_...' }
[Stripe Checkout] Using existing coupon: DESIGN_RITE_CHALLENGE_20
[Stripe Checkout] Session created: <session_id>
```

### **Console Logs (Portal - Port 3001)**
```
[Welcome] First login detected, showing password setup modal
[Set Password] Password updated successfully
[Welcome] User metadata updated: password_set: true
```

### **Supabase Database**
1. **Table: `challenge_leads`**
   - New row created with email, name, company
   - `offer_choice`: '7day-trial' or '20percent-discount'
   - `created_at`: Current timestamp
   - `magic_link_sent_at`: Populated after email sent

2. **Table: `auth.users`**
   - User created via magic link
   - `user_metadata.password_set`: `true` after password setup
   - `last_sign_in_at`: Updated on each login

### **Stripe Dashboard**
1. Checkout session created
2. Subscription created (for discount path)
3. Coupon applied correctly
4. Webhook fired: `checkout.session.completed`

---

## 📊 Success Criteria

### **Functional Requirements:**
✅ User can sign up via free trial
✅ User can sign up via 20% discount (payment)
✅ Magic link email sent and received
✅ Magic link redirects to portal `/welcome`
✅ Password modal appears on first login
✅ Password setup works with validation
✅ User can skip password setup
✅ User can sign in with email + password after setup
✅ User can still use magic links
✅ Modal doesn't appear on subsequent logins

### **Data Integrity:**
✅ Lead saved to `challenge_leads` table
✅ User created in Supabase Auth
✅ User metadata updated with `password_set` flag
✅ Stripe subscription created (discount path)
✅ No duplicate accounts created

### **User Experience:**
✅ Clear error messages
✅ Smooth form progression
✅ Professional UI/UX
✅ No broken links or 404s
✅ Fast page loads
✅ Mobile-responsive (bonus test)

---

## 🐛 Known Issues to Check

1. **Stripe Price IDs:**
   - ✅ Verified correct price IDs in Render env vars
   - ✅ Verified correct secret key for Challenge account

2. **Magic Link Redirect:**
   - Ensure redirects to portal, not V4
   - Check for CORS errors

3. **Password Modal Detection:**
   - 5-minute window for first login detection
   - Check if timing logic works correctly

4. **Email Delivery:**
   - Supabase SMTP configured
   - Check spam folder if email not received

---

## 📝 Testing Notes Template

Use this template to record your test results:

```
Date: ______________
Tester: ______________
Environment: Local / Production

Test 1: Free Trial Flow
- [ ] Signup form works
- [ ] Magic link received: __________
- [ ] Password modal appeared: Yes / No
- [ ] Password setup successful: Yes / No
- [ ] Sign in with password works: Yes / No
- Issues: _________________________________

Test 2: Skip Password
- [ ] Skip button works
- [ ] Toast notification shown
- [ ] Password login fails as expected
- Issues: _________________________________

Test 3: 20% Discount Flow
- [ ] Stripe checkout loaded
- [ ] Discount applied correctly
- [ ] Payment succeeded
- [ ] Magic link received
- [ ] Subscription active
- Issues: _________________________________

Error Scenarios:
- [ ] Invalid email rejected
- [ ] Duplicate email rejected
- [ ] Weak password rejected
- [ ] Password mismatch detected
- Issues: _________________________________
```

---

## 🚀 Ready to Test!

**Start with Test 1** and work through systematically. Let me know if you encounter any issues!
