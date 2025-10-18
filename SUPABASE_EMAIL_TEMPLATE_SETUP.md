# Supabase Email Template Customization

**Created:** October 18, 2025
**Purpose:** Guide for customizing Supabase authentication email templates

---

## Issue

When new users sign up via Stripe, they receive a "Reset Password" email from Supabase instead of a welcoming "Create Your Password" email. This is because we're using `resetPasswordForEmail()` API which sends Supabase's default reset password template.

---

## Solution: Customize Email Template in Supabase Dashboard

### Step 1: Access Email Templates

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/YOUR_PROJECT_ID
2. Navigate to **Authentication** → **Email Templates**
3. Select **"Reset Password"** template

### Step 2: Customize the Template

Replace the default template with this welcoming version:

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

### Step 3: Customize the Subject Line

Change the subject from:
```
Reset Your Password
```

To:
```
Welcome to Design-Rite! Create Your Password 🚀
```

### Step 4: Save and Test

1. Click **Save** in the Supabase dashboard
2. Test by creating a new account
3. Check your email inbox to verify the new template

---

## Alternative: Custom Email Service (Future Enhancement)

If you need more control over email content, consider:

1. **SendGrid** - Transactional email service
2. **Postmark** - Developer-friendly email API
3. **Resend** - Modern email API with React templates

### Implementation Example (SendGrid):

```typescript
import sgMail from '@sendgrid/mail'

sgMail.setApiKey(process.env.SENDGRID_API_KEY!)

async function sendWelcomeEmail(email: string, resetLink: string) {
  await sgMail.send({
    to: email,
    from: 'noreply@design-rite.com',
    subject: 'Welcome to Design-Rite! Create Your Password 🚀',
    templateId: 'd-your-template-id',
    dynamicTemplateData: {
      resetLink,
      userName: email.split('@')[0]
    }
  })
}
```

Then replace the Supabase email call in webhook:

```typescript
// Instead of:
await supabaseAdmin.auth.resetPasswordForEmail(customerEmail, {
  redirectTo: `${portalUrl}/reset-password`
})

// Use:
const { data: resetData } = await supabaseAdmin.auth.admin.generateLink({
  type: 'recovery',
  email: customerEmail,
  options: {
    redirectTo: `${portalUrl}/reset-password`
  }
})

// Send custom email with the link
await sendWelcomeEmail(customerEmail, resetData.properties.action_link)
```

---

## Email Template Variables

Available in Supabase email templates:

- `{{ .Email }}` - User's email address
- `{{ .Token }}` - Verification token
- `{{ .TokenHash }}` - Hashed token
- `{{ .SiteURL }}` - Your site URL (from Supabase settings)
- `{{ .ConfirmationURL }}` - Full confirmation link with token
- `{{ .EmailChangeTokenNew }}` - For email change confirmations
- `{{ .EmailChangeTokenCurrent }}` - For email change confirmations

---

## Testing Checklist

After updating the template:

- [ ] Test new user signup via Stripe checkout
- [ ] Verify email arrives within 1-2 minutes
- [ ] Check subject line shows "Welcome to Design-Rite!"
- [ ] Confirm email body shows welcoming message
- [ ] Test that password creation link works
- [ ] Verify redirect goes to correct portal URL
- [ ] Test link expiration (should expire in 24 hours)
- [ ] Test with multiple email clients (Gmail, Outlook, Apple Mail)

---

## Current Email Flow

```
User Completes Stripe Checkout
         ↓
Webhook: checkout.session.completed
         ↓
Create User in Supabase Auth
         ↓
Call: resetPasswordForEmail()
         ↓
Supabase sends "Reset Password" email (using template)
         ↓
User clicks link → Redirected to portal/reset-password
         ↓
User creates password
         ↓
User can access portal
```

---

## Environment Variables

Make sure these are set in Render:

```bash
# Portal URL for email redirects
NODE_ENV=production  # or 'development'

# Portal URLs (used in webhook.ts line 207-209)
# Development: http://localhost:3005
# Production: https://portal.design-rite.com
```

---

## Troubleshooting

### Email not arriving?

1. Check Supabase logs: **Authentication** → **Logs**
2. Check spam/junk folder
3. Verify email is confirmed in Supabase: **Authentication** → **Users**
4. Check webhook logs in Render: **Logs** tab

### Wrong template showing?

1. Clear browser cache
2. Wait 1-2 minutes for Supabase to propagate changes
3. Test with a new email address
4. Check template was saved correctly in Supabase dashboard

### Link not working?

1. Verify `redirectTo` URL is in Supabase **Authentication** → **URL Configuration** → **Redirect URLs**
2. Add both development and production URLs:
   - http://localhost:3005/reset-password
   - https://portal.design-rite.com/reset-password
3. Check link hasn't expired (24 hour limit)

---

## Related Files

- **Webhook Handler:** `app/api/stripe/webhook/route.ts` (line 212-214)
- **Portal Reset Password Page:** `design-rite-portal-v2/src/pages/ResetPassword.tsx`
- **Supabase Config:** Supabase Dashboard → Authentication → Email Templates

---

## Future Enhancements

1. **Custom Email Service** - SendGrid/Postmark for full control
2. **Email Tracking** - Track open rates and click-through rates
3. **Personalization** - Include user's name, company in email
4. **Multi-language Support** - Templates for different languages
5. **Branded HTML Templates** - Professional design with company colors
6. **Follow-up Emails** - Welcome series, onboarding tips

---

**Last Updated:** October 18, 2025
**Maintained By:** Design-Rite Development Team
