# Supabase Magic Link Redirect Fix

**Problem:** Magic links redirect to `/auth` instead of `/welcome`, preventing automatic password setup modal.

**Root Cause:** Redirect URLs not configured in Supabase Dashboard.

---

## 🔧 Fix: Add Redirect URLs to Supabase

### **Step 1: Go to Supabase Dashboard**
1. Open: https://supabase.com/dashboard
2. Select your project (the one with URL: `https://aeorianxnxpxveoxzhov.supabase.co`)
3. Go to: **Authentication** → **URL Configuration**

### **Step 2: Add Redirect URLs**

In the **"Redirect URLs"** section, add these URLs:

**For Development:**
```
http://localhost:3001/welcome
http://localhost:3001/auth/callback
```

**For Production:**
```
https://portal.design-rite.com/welcome
https://portal.design-rite.com/auth/callback
```

### **Step 3: Update Site URL**

In the **"Site URL"** field, set:
- **Development**: `http://localhost:3001`
- **Production**: `https://portal.design-rite.com`

### **Step 4: Save Changes**

Click **"Save"** at the bottom of the page.

---

## 🧪 Test the Fix

### **Test 1: New Magic Link**
1. Go to `http://localhost:3000/create-account`
2. Fill out form, select "7-Day Free Trial"
3. Submit form
4. Check email for magic link
5. Click magic link
6. **Expected**: Redirected to `http://localhost:3001/welcome` with password modal

### **Test 2: Verify No More Auth Page**
1. After clicking magic link
2. **Expected**: Should NOT see `/auth` page
3. **Expected**: Should see welcome page with password modal

---

## 📸 Screenshots from Your Test

**Issue #1**: After accepting challenge, showed success screen ✅
**Issue #2**: After clicking magic link → Redirected to `/auth` instead of `/welcome` ❌

**What Should Happen:**
```
1. User submits form
   ↓
2. Success screen: "Check your email: dan@design-rite.com"
   ↓
3. User clicks magic link in email
   ↓
4. Supabase validates token
   ↓
5. User redirected to: http://localhost:3001/welcome ✅
   ↓
6. Password setup modal appears ✅
```

**What's Happening Now:**
```
1. User submits form ✅
   ↓
2. Success screen ✅
   ↓
3. User clicks magic link ✅
   ↓
4. Supabase validates token ✅
   ↓
5. Redirect URL not whitelisted ❌
   ↓
6. User redirected to: http://localhost:3001/auth ❌ (fallback)
   ↓
7. No password modal ❌
```

---

## 🔍 Alternative: Check Email Template

If redirect URLs are already configured, check the email template:

### **Go to Supabase Dashboard**
1. **Authentication** → **Email Templates**
2. Click **"Confirm Signup"** or **"Magic Link"** template
3. Verify it contains: `{{ .ConfirmationURL }}`
4. The redirect should append to this URL

---

## ⚡ Quick Fix for Testing (Alternative Approach)

If you can't access Supabase Dashboard right now, we can modify the code to use a different approach:

### **Option 1: Use Auth Code Flow Instead of Magic Link**
This creates the user account immediately instead of waiting for email verification.

### **Option 2: Manual Password Setup on First Portal Visit**
Detect first-time users on the `/auth` page and show password setup there.

**Would you like me to implement Option 2 as a temporary workaround?**

---

## ✅ After Configuration

Once redirect URLs are added to Supabase:

1. **No code changes needed** - everything will work automatically
2. **Magic links will redirect correctly** to `/welcome`
3. **Password modal will appear** on first login
4. **Users can set passwords** and sign in with email + password

---

## 📝 Supabase Configuration Checklist

- [ ] Add `http://localhost:3001/welcome` to Redirect URLs
- [ ] Add `http://localhost:3001/auth/callback` to Redirect URLs
- [ ] Add `https://portal.design-rite.com/welcome` to Redirect URLs (production)
- [ ] Add `https://portal.design-rite.com/auth/callback` to Redirect URLs (production)
- [ ] Set Site URL to `http://localhost:3001` (or production URL)
- [ ] Save changes
- [ ] Test new magic link signup

---

## 🆘 If You Don't Have Supabase Access

If you can't access the Supabase Dashboard, we can implement a workaround:

1. **Detect magic link authentication on `/auth` page**
2. **Auto-redirect to `/welcome`** after successful auth
3. **Show password modal on welcome page**

Let me know if you want me to implement this workaround!
