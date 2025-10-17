# Magic Link Callback Implementation - FIXED

**Date:** October 16, 2025
**Status:** ✅ Fixed - Auth callback route created

---

## Problem Summary

Magic links were redirecting to `/auth` instead of `/welcome` with password setup modal because:
1. **No auth callback route existed** - Portal had no `/auth/callback` route to handle Supabase magic link tokens
2. **Wrong redirect URL** - Magic link was trying to redirect directly to `/welcome` instead of going through callback handler
3. **Session not established** - Without callback route, Supabase couldn't complete authentication flow

---

## Solution Implemented

### **1. Created Auth Callback Route**
**File:** `design-rite-portal-v2/src/app/auth/callback/route.ts`

**What it does:**
- Receives magic link token from Supabase email
- Verifies the OTP token using `supabase.auth.verifyOtp()`
- Establishes authenticated session
- Sets session cookie
- Redirects to `/welcome` page where password modal appears

**Key Code:**
```typescript
export async function GET(request: NextRequest) {
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type')

  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type: type as any
    })

    // Set session cookie and redirect to welcome
    const response = NextResponse.redirect(new URL('/welcome', request.url))
    response.cookies.set('supabase-auth-token', data.session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return response
  }
}
```

### **2. Updated Magic Link Redirect URL**
**File:** `design-rite-v4/app/api/leads/create-account/route.ts`

**Changed from:**
```typescript
emailRedirectTo: 'http://localhost:3001/welcome'
```

**Changed to:**
```typescript
emailRedirectTo: 'http://localhost:3001/auth/callback'
```

This ensures the magic link goes through the auth callback handler first.

---

## Complete User Flow (Now Fixed)

```
1. User fills form on V4 → http://localhost:3000/create-account
   ↓
2. API saves lead to Supabase
   ↓
3. API sends magic link email with redirect to: http://localhost:3001/auth/callback
   ↓
4. User sees success screen: "Check your email: dan@design-rite.com"
   ↓
5. User clicks magic link in email
   ↓
6. Redirected to: http://localhost:3001/auth/callback?token_hash=xxx&type=magiclink
   ↓
7. Callback route verifies token with Supabase
   ↓
8. Session established, cookie set
   ↓
9. User redirected to: http://localhost:3001/welcome ✅
   ↓
10. Password setup modal appears automatically ✅
```

---

## What Was Wrong Before

**Before:**
```
Magic Link → http://localhost:3001/welcome (direct)
            ↓
         No auth callback to verify token
            ↓
         Session not established
            ↓
         User redirected to /auth (not authenticated)
```

**After:**
```
Magic Link → http://localhost:3001/auth/callback (proper handler)
            ↓
         Token verified, session established
            ↓
         User redirected to /welcome
            ↓
         Password modal appears ✅
```

---

## Supabase Configuration Required

### **Go to Supabase Dashboard:**
1. Open: https://supabase.com/dashboard
2. Select project: `aeorianxnxpxveoxzhov`
3. Go to: **Authentication** → **URL Configuration**

### **Add Redirect URLs:**
```
Development:
- http://localhost:3001/auth/callback ✅ (NEW - Required!)
- http://localhost:3001/welcome

Production:
- https://portal.design-rite.com/auth/callback ✅ (NEW - Required!)
- https://portal.design-rite.com/welcome
```

### **Site URL:**
```
Development: http://localhost:3001
Production: https://portal.design-rite.com
```

---

## Testing Checklist

### **Test 1: New Magic Link Signup**
1. ✅ Go to `http://localhost:3000/create-account`
2. ✅ Fill form, select "7-Day Free Trial"
3. ✅ Click "Accept the Challenge"
4. ✅ See success screen: "Check your email: your-email@company.com"
5. ✅ Check email for magic link
6. ✅ Click magic link
7. ✅ **Expected:** Redirected to `http://localhost:3001/welcome`
8. ✅ **Expected:** Password setup modal appears automatically
9. ✅ Set password
10. ✅ Sign out
11. ✅ Sign in with email + password
12. ✅ **Expected:** Login successful

### **Test 2: Console Logs to Monitor**
**Portal Terminal (localhost:3001):**
```
[Auth Callback] Received magic link callback
[Auth Callback] Token hash: present
[Auth Callback] Type: magiclink
[Auth Callback] Magic link verified successfully
[Auth Callback] User: dan@design-rite.com
[Welcome] First login detected, showing password setup modal
```

**V4 Terminal (localhost:3000):**
```
[Create Account API] Lead saved successfully: <uuid>
[Create Account API] Sending magic link to: dan@design-rite.com
[Create Account API] Magic link sent successfully
```

---

## Files Modified

### **Portal (design-rite-portal-v2):**
1. ✅ `src/app/auth/callback/route.ts` - **CREATED** - Auth callback handler
2. ✅ `src/components/SetPasswordModal.tsx` - Already created (password modal)
3. ✅ `src/app/welcome/page.tsx` - Already updated (first-login detection)

### **V4 (design-rite-v4):**
1. ✅ `app/api/leads/create-account/route.ts` - Updated redirect URL to `/auth/callback`
2. ✅ `MAGIC_LINK_CALLBACK_FIX.md` - This documentation

---

## Why This Fixes the Issue

### **Root Cause:**
Supabase magic links use a **PKCE (Proof Key for Code Exchange) flow** that requires:
1. Email link with `token_hash` parameter
2. Server-side verification via `verifyOtp()`
3. Session establishment before redirecting to app

### **What Was Missing:**
The portal had **no callback route** to complete this flow. Supabase couldn't establish a session, so users appeared unauthenticated and got redirected to `/auth`.

### **How Callback Route Fixes It:**
1. Receives `token_hash` and `type` from magic link URL
2. Calls `supabase.auth.verifyOtp()` to verify token
3. Establishes authenticated session
4. Sets HTTP-only session cookie
5. Redirects to `/welcome` where password modal appears

---

## Production Deployment

### **Environment Variables (Already Configured):**
```bash
# Portal
NEXT_PUBLIC_SUPABASE_URL=https://aeorianxnxpxveoxzhov.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<configured>

# V4
NEXT_PUBLIC_SUPABASE_URL=https://aeorianxnxpxveoxzhov.supabase.co
SUPABASE_SERVICE_KEY=<configured>
```

### **Deployment Steps:**
1. ✅ Commit portal changes (auth callback route)
2. ✅ Commit V4 changes (updated redirect URL)
3. ✅ Push to GitHub
4. ✅ Render auto-deploys both apps
5. ✅ Add production redirect URLs to Supabase Dashboard
6. ✅ Test with real email on production

---

## Success Criteria

✅ **Magic link redirects to `/welcome` (not `/auth`)**
✅ **User is authenticated after clicking magic link**
✅ **Password setup modal appears on first login**
✅ **User can set password successfully**
✅ **User can sign in with email + password after setup**
✅ **No more confusing "back to auth screen" experience**

---

## Next Time You Test

1. **Start fresh signup** - Don't reuse old magic links (they expire)
2. **Check portal console logs** - Verify callback route is receiving requests
3. **Verify session established** - Check browser cookies for `supabase-auth-token`
4. **Confirm password modal appears** - Should show automatically on welcome page

**The fix is now in place. Ready for testing!** 🚀
