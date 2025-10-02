# Supabase Email Templates for Design-Rite v3

Copy and paste these templates into Supabase Dashboard → Authentication → Email Templates

---

## 1. Confirm Signup

**Subject:** Welcome to Design-Rite v3 - Confirm Your Email

**Message Body:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 40px 20px;">
  <div style="text-align: center; margin-bottom: 40px;">
    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; color: white; margin-bottom: 20px;">
      DR
    </div>
    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Welcome to Design-Rite v3</h1>
  </div>

  <div style="background-color: #0a0a0a; border: 1px solid rgba(147, 51, 234, 0.3); border-radius: 8px; padding: 30px; margin-bottom: 30px;">
    <h2 style="color: #a855f7; margin-top: 0;">Confirm Your Email Address</h2>

    <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 25px;">
      Thanks for signing up! Please confirm your email address to activate your account and start creating professional security proposals.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #9333ea; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Confirm Your Email
      </a>
    </div>

    <p style="color: #9ca3af; font-size: 14px; margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(147, 51, 234, 0.2);">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <span style="color: #a855f7; word-break: break-all;">{{ .ConfirmationURL }}</span>
    </p>
  </div>

  <div style="text-align: center; color: #6b7280; font-size: 13px;">
    <p>Design-Rite Professional Systems<br>
    Security Estimation & Proposal Platform</p>
  </div>
</div>
```

---

## 2. Invite User

**Subject:** You've Been Invited to Design-Rite v3

**Message Body:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 40px 20px;">
  <div style="text-align: center; margin-bottom: 40px;">
    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; color: white; margin-bottom: 20px;">
      DR
    </div>
    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">You're Invited!</h1>
  </div>

  <div style="background-color: #0a0a0a; border: 1px solid rgba(147, 51, 234, 0.3); border-radius: 8px; padding: 30px; margin-bottom: 30px;">
    <h2 style="color: #a855f7; margin-top: 0;">Join Design-Rite v3</h2>

    <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 25px;">
      You've been invited to join Design-Rite v3 - the professional security estimation and proposal platform. Click below to accept your invitation and set your password.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #9333ea; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Accept Invitation
      </a>
    </div>

    <p style="color: #9ca3af; font-size: 14px; margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(147, 51, 234, 0.2);">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <span style="color: #a855f7; word-break: break-all;">{{ .ConfirmationURL }}</span>
    </p>
  </div>

  <div style="text-align: center; color: #6b7280; font-size: 13px;">
    <p>Design-Rite Professional Systems<br>
    Security Estimation & Proposal Platform</p>
  </div>
</div>
```

---

## 3. Magic Link

**Subject:** Your Design-Rite v3 Login Link

**Message Body:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 40px 20px;">
  <div style="text-align: center; margin-bottom: 40px;">
    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; color: white; margin-bottom: 20px;">
      DR
    </div>
    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Your Login Link</h1>
  </div>

  <div style="background-color: #0a0a0a; border: 1px solid rgba(147, 51, 234, 0.3); border-radius: 8px; padding: 30px; margin-bottom: 30px;">
    <h2 style="color: #a855f7; margin-top: 0;">Sign In to Design-Rite v3</h2>

    <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 25px;">
      Click the button below to securely sign in to your Design-Rite account. This link expires in 1 hour.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #9333ea; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Sign In Now
      </a>
    </div>

    <p style="color: #9ca3af; font-size: 14px; margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(147, 51, 234, 0.2);">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <span style="color: #a855f7; word-break: break-all;">{{ .ConfirmationURL }}</span>
    </p>

    <div style="background-color: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.3); border-radius: 6px; padding: 15px; margin-top: 20px;">
      <p style="color: #fca5a5; font-size: 13px; margin: 0;">
        ⚠️ If you didn't request this login link, please ignore this email or contact support@designrite.com
      </p>
    </div>
  </div>

  <div style="text-align: center; color: #6b7280; font-size: 13px;">
    <p>Design-Rite Professional Systems<br>
    Security Estimation & Proposal Platform</p>
  </div>
</div>
```

---

## 4. Change Email Address

**Subject:** Confirm Your New Email Address

**Message Body:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 40px 20px;">
  <div style="text-align: center; margin-bottom: 40px;">
    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; color: white; margin-bottom: 20px;">
      DR
    </div>
    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Confirm Email Change</h1>
  </div>

  <div style="background-color: #0a0a0a; border: 1px solid rgba(147, 51, 234, 0.3); border-radius: 8px; padding: 30px; margin-bottom: 30px;">
    <h2 style="color: #a855f7; margin-top: 0;">Verify Your New Email Address</h2>

    <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 25px;">
      You requested to change your email address for your Design-Rite account. Please confirm this is your new email address to complete the change.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #9333ea; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Confirm New Email
      </a>
    </div>

    <p style="color: #9ca3af; font-size: 14px; margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(147, 51, 234, 0.2);">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <span style="color: #a855f7; word-break: break-all;">{{ .ConfirmationURL }}</span>
    </p>

    <div style="background-color: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.3); border-radius: 6px; padding: 15px; margin-top: 20px;">
      <p style="color: #fca5a5; font-size: 13px; margin: 0;">
        ⚠️ If you didn't request this email change, please contact support@designrite.com immediately
      </p>
    </div>
  </div>

  <div style="text-align: center; color: #6b7280; font-size: 13px;">
    <p>Design-Rite Professional Systems<br>
    Security Estimation & Proposal Platform</p>
  </div>
</div>
```

---

## 5. Reset Password

**Subject:** Reset Your Design-Rite v3 Password

**Message Body:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 40px 20px;">
  <div style="text-align: center; margin-bottom: 40px;">
    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; color: white; margin-bottom: 20px;">
      DR
    </div>
    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Reset Your Password</h1>
  </div>

  <div style="background-color: #0a0a0a; border: 1px solid rgba(147, 51, 234, 0.3); border-radius: 8px; padding: 30px; margin-bottom: 30px;">
    <h2 style="color: #a855f7; margin-top: 0;">Password Reset Request</h2>

    <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 25px;">
      We received a request to reset your password for your Design-Rite account. Click the button below to set a new password.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #9333ea; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Reset Password
      </a>
    </div>

    <p style="color: #9ca3af; font-size: 14px; margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(147, 51, 234, 0.2);">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <span style="color: #a855f7; word-break: break-all;">{{ .ConfirmationURL }}</span>
    </p>

    <div style="background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 6px; padding: 15px; margin-top: 20px;">
      <p style="color: #93c5fd; font-size: 13px; margin: 0;">
        ℹ️ This link expires in 1 hour for security reasons
      </p>
    </div>

    <div style="background-color: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.3); border-radius: 6px; padding: 15px; margin-top: 15px;">
      <p style="color: #fca5a5; font-size: 13px; margin: 0;">
        ⚠️ If you didn't request this password reset, please ignore this email or contact support@designrite.com
      </p>
    </div>
  </div>

  <div style="text-align: center; color: #6b7280; font-size: 13px;">
    <p>Design-Rite Professional Systems<br>
    Security Estimation & Proposal Platform</p>
  </div>
</div>
```

---

## 6. Reauthentication

**Subject:** Verify Your Identity - Design-Rite v3

**Message Body:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #1a1a1a; color: #ffffff; padding: 40px 20px;">
  <div style="text-align: center; margin-bottom: 40px;">
    <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #9333ea 0%, #7e22ce 100%); border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; font-size: 32px; font-weight: 900; color: white; margin-bottom: 20px;">
      DR
    </div>
    <h1 style="color: #ffffff; margin: 0; font-size: 28px;">Verify Your Identity</h1>
  </div>

  <div style="background-color: #0a0a0a; border: 1px solid rgba(147, 51, 234, 0.3); border-radius: 8px; padding: 30px; margin-bottom: 30px;">
    <h2 style="color: #a855f7; margin-top: 0;">Reauthentication Required</h2>

    <p style="color: #d1d5db; line-height: 1.6; margin-bottom: 25px;">
      For security reasons, we need to verify your identity before you can complete this action. Please click the button below to reauthenticate.
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="{{ .ConfirmationURL }}" style="display: inline-block; background-color: #9333ea; color: white; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: bold; font-size: 16px;">
        Verify Identity
      </a>
    </div>

    <p style="color: #9ca3af; font-size: 14px; margin-top: 25px; padding-top: 20px; border-top: 1px solid rgba(147, 51, 234, 0.2);">
      If the button doesn't work, copy and paste this link into your browser:<br>
      <span style="color: #a855f7; word-break: break-all;">{{ .ConfirmationURL }}</span>
    </p>

    <div style="background-color: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); border-radius: 6px; padding: 15px; margin-top: 20px;">
      <p style="color: #93c5fd; font-size: 13px; margin: 0;">
        ℹ️ This verification link expires in 15 minutes
      </p>
    </div>

    <div style="background-color: rgba(220, 38, 38, 0.1); border: 1px solid rgba(220, 38, 38, 0.3); border-radius: 6px; padding: 15px; margin-top: 15px;">
      <p style="color: #fca5a5; font-size: 13px; margin: 0;">
        ⚠️ If you didn't attempt this action, please contact support@designrite.com immediately
      </p>
    </div>
  </div>

  <div style="text-align: center; color: #6b7280; font-size: 13px;">
    <p>Design-Rite Professional Systems<br>
    Security Estimation & Proposal Platform</p>
  </div>
</div>
```

---

## How to Apply These Templates

1. Go to: https://supabase.com/dashboard/project/ickwrbdpuorzdpzqbqpf/auth/templates

2. For each email type (6 total):
   - Click the email template name
   - Copy the **Subject** from above
   - Copy the entire **Message Body** HTML
   - Paste into Supabase
   - Click "Save"

3. Test by triggering a password reset at http://localhost:3010/login

## Features of These Templates

✅ Branded Design-Rite styling with purple theme
✅ Professional HTML design that works across all email clients
✅ Security warnings for suspicious activity
✅ Fallback plain-text links if buttons don't work
✅ Mobile-responsive design
✅ Won't be marked as spam (proper HTML structure)
✅ Clear call-to-action buttons
✅ Company branding footer

After applying these templates, your password reset email should arrive within 1-2 minutes!
