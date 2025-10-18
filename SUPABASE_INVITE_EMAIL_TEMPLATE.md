# Supabase Invite Email Template Setup

**Created:** October 18, 2025
**Purpose:** Custom invite email template for new Design-Rite users

---

## 📧 Setup Instructions

### Step 1: Go to Supabase Dashboard

1. **Navigate to:** https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov
2. **Click:** Authentication (left sidebar)
3. **Click:** Email Templates (top tabs)
4. **Select:** "Invite User" template

### Step 2: Update Subject Line

Replace the subject line with:

```
Welcome to Design-Rite! You've Been Invited 🎉
```

### Step 3: Replace Template Body

Copy and paste this entire HTML template:

```html
<h2>Welcome to Design-Rite! 🎉</h2>

<p>Hi there,</p>

<p>You've been invited to join Design-Rite - the professional proposal platform built specifically for security and low-voltage sales engineers.</p>

<h3>Accept Your Invitation</h3>

<p>Click the button below to accept your invitation and create your password:</p>

<p><a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 12px 24px; background-color: #7C3AED; color: white; text-decoration: none; border-radius: 6px; font-weight: 600;">Accept Invitation & Create Password</a></p>

<p>Or copy and paste this link into your browser:<br/>
{{ .ConfirmationURL }}</p>

<h3>What's Included in Your Account</h3>

<ul>
  <li><strong>AI Assessment</strong> - Professional proposals in minutes, not hours</li>
  <li><strong>Smart Templates</strong> - Pre-built scenarios for faster discovery</li>
  <li><strong>Real Pricing Data</strong> - Live pricing from 3,000+ security products</li>
  <li><strong>Professional BOMs</strong> - Itemized quotes with labor calculations</li>
  <li><strong>PDF Proposals</strong> - Export ready-to-send proposals instantly</li>
</ul>

<h3>Get Started Right Away</h3>

<p>Once you create your password, you'll have immediate access to:</p>
<ul>
  <li>📊 Your personalized dashboard</li>
  <li>🤖 AI Discovery Assistant</li>
  <li>💼 Business tools and calculators</li>
  <li>📈 Usage analytics</li>
</ul>

<h3>Need Help?</h3>

<p>Our team is here to support you:</p>
<ul>
  <li>📧 Email: support@design-rite.com</li>
  <li>📚 Help Center: https://design-rite.com/help</li>
  <li>💬 Live Chat: Available in your dashboard</li>
</ul>

<p>This invitation link expires in 24 hours for security. If it expires, you can request a new one at any time.</p>

<p>We're excited to help you transform your proposal process!</p>

<p>Best regards,<br/>
The Design-Rite Team</p>

<hr style="border: 1px solid #e5e7eb; margin: 24px 0;"/>

<p style="font-size: 12px; color: #6b7280;">
  If you didn't expect this invitation, you can safely ignore this email. Someone may have entered your email address by mistake.
</p>
```

### Step 4: Save Template

1. **Click:** "Save" button at the bottom
2. **Verify:** Template is saved successfully

---

## 🧪 Testing the Invite Email

### Test 1: Send Test Email from Supabase

1. **Go to:** Authentication → Users
2. **Click:** "Invite User" button
3. **Enter:** Your test email address
4. **Click:** "Invite"
5. **Check:** Your email inbox for the new invite template

### Test 2: Test via Application (7-Day Trial)

1. **Go to:** https://design-rite.com/create-account
2. **Fill in:** Form with new test email
3. **Select:** "7-day trial" option
4. **Submit:** Form
5. **Check:** Email inbox for invite email with new template

### Test 3: Test via Stripe Checkout

1. **Go to:** https://design-rite.com/create-account
2. **Fill in:** Form with new test email
3. **Select:** "20% discount" option
4. **Complete:** Stripe checkout (use test card: 4242 4242 4242 4242)
5. **Check:** Email inbox for invite email with new template

---

## 🎯 What Changed in the Code

### Updated Files:

1. **`app/api/stripe/webhook/route.ts`**
   - Changed from `resetPasswordForEmail()` to `inviteUserByEmail()`
   - Updated redirect to `/auth/callback`
   - Added user metadata (full_name, company, tier)

2. **`app/api/leads/create-account/route.ts`**
   - Changed from `signInWithOtp()` (magic link) to `inviteUserByEmail()`
   - Updated redirect to `/auth/callback`
   - Added full user metadata

### Benefits of This Change:

1. ✅ **Better User Experience:** "You've been invited" is more welcoming than "Reset Password"
2. ✅ **Clear Messaging:** Email explains what Design-Rite is and what they get
3. ✅ **Onboarding Context:** Lists features and benefits upfront
4. ✅ **Professional Branding:** Matches Design-Rite's professional tone
5. ✅ **Reduced Confusion:** Users understand they're joining a platform, not resetting a password

---

## 🔄 User Flow After This Change

### 7-Day Trial Flow:
1. User fills out `/create-account` form
2. Selects "7-day trial"
3. Receives **invite email** (not magic link)
4. Clicks "Accept Invitation & Create Password"
5. Redirected to portal `/auth/callback`
6. Creates password and logs in

### Stripe Checkout Flow:
1. User fills out `/create-account` form
2. Selects "20% discount"
3. Completes Stripe checkout
4. Webhook creates user account
5. User receives **invite email** (not reset password)
6. Clicks "Accept Invitation & Create Password"
7. Redirected to portal `/auth/callback`
8. Creates password and logs in

---

## 📋 Variables Available in Template

You can use these Supabase template variables:

- `{{ .ConfirmationURL }}` - The invitation acceptance link (required)
- `{{ .SiteURL }}` - Your Supabase project URL
- `{{ .Token }}` - The confirmation token (if needed manually)
- `{{ .TokenHash }}` - The hashed token (if needed manually)

**Note:** We're using `{{ .ConfirmationURL }}` which handles everything automatically.

---

## 🎨 Optional: Customize Further

### Add Company Logo:
```html
<img src="https://design-rite.com/logo.png" alt="Design-Rite" style="width: 200px; margin-bottom: 20px;">
```

### Add Social Links:
```html
<p>Follow us:</p>
<a href="https://linkedin.com/company/design-rite">LinkedIn</a> |
<a href="https://twitter.com/designrite">Twitter</a>
```

### Add Trial Details (for 7-day trials):
```html
<div style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin: 20px 0;">
  <strong>Your 7-Day Trial Includes:</strong>
  <ul>
    <li>✅ Unlimited AI assessments</li>
    <li>✅ Full access to all features</li>
    <li>✅ No credit card required</li>
    <li>✅ Cancel anytime</li>
  </ul>
</div>
```

---

## 🚨 Important Notes

1. **Template Variables Must Stay:** Keep `{{ .ConfirmationURL }}` exactly as written
2. **Test Before Going Live:** Send test invites to verify formatting
3. **Email Client Compatibility:** Avoid complex CSS (inline styles work best)
4. **Mobile Responsive:** Email will render on mobile devices
5. **Link Expiration:** Invite links expire in 24 hours by default

---

## 📞 Troubleshooting

### Issue: Email not sending
**Solution:** Check Supabase Auth settings → SMTP configuration

### Issue: Link doesn't work
**Solution:** Verify `redirectTo` URL matches your portal domain

### Issue: Template looks broken
**Solution:** Use inline CSS styles, avoid external stylesheets

### Issue: Variables not working
**Solution:** Ensure you're using Go template syntax: `{{ .VariableName }}`

---

## ✅ Deployment Checklist

- [ ] Update Supabase invite email template (manual - see above)
- [ ] Deploy code changes to production (automatic via git push)
- [ ] Test 7-day trial signup with new email template
- [ ] Test Stripe checkout with new email template
- [ ] Monitor Render logs for `[Create Account API] Invite email sent successfully`
- [ ] Monitor Stripe webhook logs for `[Webhook] Invite email sent successfully`
- [ ] Verify users can create passwords and log in successfully

---

**Last Updated:** October 18, 2025
**Next Step:** Update the Supabase invite email template, then test both signup flows
