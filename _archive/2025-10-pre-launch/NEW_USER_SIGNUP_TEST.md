# 🧪 New User Signup & Login Test - Complete Walkthrough

**Date:** October 5, 2025
**Test:** Fresh user signup from @design-rite.com email
**Purpose:** Verify complete auth flow and business access control

---

## 📋 Pre-Test Checklist

- [x] Dev server running: http://localhost:3000
- [ ] All users deleted from Supabase (run `CLEAN_ALL_USERS.sql`)
- [ ] Browser incognito/private mode (clean cookies)

---

## 🧹 Step 1: Clean Slate

### **Delete All Existing Users**

1. Go to: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/sql/new
2. Copy contents of `CLEAN_ALL_USERS.sql`
3. Paste into SQL Editor
4. Click **RUN** ▶️
5. Verify all counts = 0

**Expected Result:**
```
table_name          | count
--------------------|-------
auth.users          | 0
profiles            | 0
user_roles          | 0
module_permissions  | 0
```

---

## 👤 Step 2: Sign Up as New User

### **Scenario: Dan from Design-Rite signs up**

1. **Open incognito/private browser window**
2. Go to: http://localhost:3000/signup
3. Fill out form:
   - **Company Name:** Design-Rite
   - **Email:** dan@design-rite.com
   - **Password:** TestPassword123!
   - **Confirm Password:** TestPassword123!
4. Click **Create Account**

**What to Watch For:**
- ✅ Password reveal eyes work on both password fields
- ✅ Success message appears
- ✅ Redirects to `/subscribe` page

**Expected Result:**
- User created in Supabase
- Email confirmed (auto-confirm should be enabled)
- Redirected to subscription page

---

## 🔐 Step 3: Assign Super Admin Role

Since this is your first user, we need to assign super_admin role manually.

1. Go to: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/auth/users
2. Find **dan@design-rite.com** in the user list
3. Copy the User ID (UUID)
4. Go to SQL Editor: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/sql/new
5. Run this SQL (replace USER_ID):

```sql
-- Assign super_admin role to Dan
INSERT INTO user_roles (user_id, role, user_group)
VALUES (
  'PASTE_USER_ID_HERE',
  'super_admin',
  'internal'
);

-- Create profile
INSERT INTO profiles (id, email, full_name, company, department, job_title)
VALUES (
  'PASTE_USER_ID_HERE',
  'dan@design-rite.com',
  'Dan Kozich',
  'Design-Rite',
  'Leadership',
  'CEO / Founder'
);

-- Grant ALL module permissions
INSERT INTO module_permissions (
  user_id,
  operations_dashboard, analytics,
  ai_providers, ai_assistant_config, chatbot_config,
  product_harvester,
  team_management, creative_studio, spatial_studio,
  logo_management, video_management, blog_management,
  subscriptions, demo_dashboard, testing_dashboard,
  about_us_management,
  user_management, permissions_management, activity_logs
)
VALUES (
  'PASTE_USER_ID_HERE',
  true, true,
  true, true, true,
  true,
  true, true, true, true, true, true,
  true, true, true,
  true,
  true, true, true
);

-- Verify
SELECT
  u.email,
  ur.role,
  ur.user_group,
  p.full_name,
  p.department
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'dan@design-rite.com';
```

**Expected Result:**
```
email                | role        | user_group | full_name  | department
---------------------|-------------|------------|------------|------------
dan@design-rite.com  | super_admin | internal   | Dan Kozich | Leadership
```

---

## 🚪 Step 4: Test Login & Admin Access

### **Login as Super Admin**

1. **Logout** if currently logged in (or use new incognito window)
2. Go to: http://localhost:3000/login
3. Enter credentials:
   - **Email:** dan@design-rite.com
   - **Password:** TestPassword123!
4. Click **Sign In**

**What to Watch For:**
- ✅ Password reveal eye works
- ✅ Login successful
- ✅ Redirects to `/admin` (NOT `/dashboard`)
- ✅ Admin portal loads with all modules visible

**Expected Redirect Flow:**
```
/login → Middleware checks auth → Checks user_roles table →
role = 'super_admin' → Redirect to /admin ✅
```

---

## 🎛️ Step 5: Verify Admin Portal Access

### **Check Super Admin Permissions**

Once logged in to `/admin`, verify you can access:

**Top Navigation:**
- [ ] Operations Dashboard (🟠 Orange dropdown)
- [ ] Analytics (🔵 Blue dropdown)
- [ ] AI Tools (🟣 Purple dropdown)
  - [ ] AI Providers
  - [ ] AI Assistant Config
  - [ ] Chatbot Config
- [ ] Data Tools (🟦 Cyan dropdown)
  - [ ] Product Harvester
- [ ] Marketing & Content (🟢 Green dropdown)
  - [ ] Team Management
  - [ ] Creative Studio
  - [ ] Spatial Studio
  - [ ] Logo Management
  - [ ] Video Management
  - [ ] Blog Posts
- [ ] Business Tools (🟡 Yellow dropdown)
  - [ ] Subscriptions
  - [ ] Demo Dashboard
  - [ ] Testing Dashboard
- [ ] About Us (🟣 Indigo dropdown)
- [ ] **Super Admin** (👑 Red dropdown)
  - [ ] User Management
  - [ ] Activity Logs
  - [ ] Permissions Management

**Expected Result:**
- ✅ All dropdowns visible (super admin has full access)
- ✅ Can navigate to any admin page
- ✅ No "unauthorized" redirects

---

## 🧪 Step 6: Test Domain Restriction

### **Scenario: Non-@design-rite.com user tries to access admin**

1. **Logout** from dan@design-rite.com
2. **Sign up** with a different email domain:
   - Email: testuser@gmail.com
   - Password: TestPassword123!
3. **Login** with testuser@gmail.com
4. **Try to access:** http://localhost:3000/admin

**What to Watch For:**
- ✅ Middleware blocks access (no @design-rite.com email)
- ✅ Redirects to `/unauthorized?reason=domain_restricted`
- ✅ Unauthorized page displays correct error message
- ✅ Shows contact info: dan@design-rite.com

**Expected Error Message:**
```
Access Denied
Business Admin Access Restricted

Access to the business admin portal is restricted to:
• @design-rite.com email addresses
• Users with domain override permission
• Super administrators

Need Access? Contact your Design-Rite administrator at dan@design-rite.com
```

---

## 👥 Step 7: Test Adding Second Admin (Phil)

### **Super Admin Creates Admin User**

**Option 1: Via Signup + SQL (Recommended)**

1. **Logout** from super admin
2. **Signup** as Phil:
   - Email: plisk@design-rite.com
   - Password: (Phil's password)
3. **As Dan** (super admin), run SQL:

```sql
-- Get Phil's user ID
SELECT id, email FROM auth.users WHERE email = 'plisk@design-rite.com';

-- Assign admin role
INSERT INTO user_roles (user_id, role, user_group)
VALUES (
  'PHILS_USER_ID_HERE',
  'admin',
  'internal'
);

-- Create profile
INSERT INTO profiles (id, email, full_name, company, department, job_title)
VALUES (
  'PHILS_USER_ID_HERE',
  'plisk@design-rite.com',
  'Phil Lisk',
  'Design-Rite',
  'Operations',
  'Admin'
);

-- Grant admin permissions (NOT super admin functions)
INSERT INTO module_permissions (
  user_id,
  operations_dashboard, analytics,
  ai_providers, ai_assistant_config, chatbot_config,
  product_harvester,
  team_management, creative_studio, spatial_studio,
  logo_management, video_management, blog_management,
  subscriptions, demo_dashboard, testing_dashboard,
  about_us_management,
  user_management, permissions_management, activity_logs
)
VALUES (
  'PHILS_USER_ID_HERE',
  true, true,
  true, true, true,
  true,
  true, true, true, true, true, true,
  true, true, true,
  true,
  false, false, true  -- No user/permissions management
);
```

**Option 2: Via Super Admin Panel (When Built)**

Later, this will be done via `/admin/super/create-user` UI.

---

## ✅ Test Completion Checklist

### **Authentication Flow:**
- [ ] Signup page works
- [ ] Password reveal eyes functional
- [ ] Email confirmation (auto or manual)
- [ ] Login redirects based on role
- [ ] Logout works

### **Business Access Control:**
- [ ] @design-rite.com emails can access /admin
- [ ] Non-@design-rite.com emails blocked
- [ ] Unauthorized page displays correctly
- [ ] Super admin has full access

### **Role Hierarchy:**
- [ ] Super admin sees all modules
- [ ] Admin sees most modules (no user/permissions management)
- [ ] Regular user redirects to /dashboard

### **Database State:**
- [ ] Users created in auth.users
- [ ] Profiles created
- [ ] Roles assigned in user_roles
- [ ] Module permissions set correctly

---

## 🐛 Common Issues & Fixes

### **Issue: "user_roles table does not exist"**
**Fix:** Run `SETUP_BUSINESS_AUTH_SYSTEM.sql` first

### **Issue: Login redirects to /dashboard instead of /admin**
**Fix:** User doesn't have admin/super_admin role - run role assignment SQL

### **Issue: Can't access /admin even with @design-rite.com email**
**Fix:** Clear browser cookies, logout, login again

### **Issue: Password reveal eyes not showing**
**Fix:** Hard refresh page (Ctrl+F5)

### **Issue: Unauthorized page not found (404)**
**Fix:** Restart dev server: `npm run dev`

---

## 📊 Expected Database State After Test

```sql
-- Run this to verify everything is correct:
SELECT
  u.email,
  ur.role,
  ur.user_group,
  p.full_name,
  p.department,
  mp.user_management,
  mp.permissions_management
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN module_permissions mp ON mp.user_id = u.id
ORDER BY
  CASE ur.role
    WHEN 'super_admin' THEN 1
    WHEN 'admin' THEN 2
    ELSE 3
  END;
```

**Expected Result:**
```
email                | role        | user_group | full_name  | user_mgmt | perms_mgmt
---------------------|-------------|------------|------------|-----------|------------
dan@design-rite.com  | super_admin | internal   | Dan Kozich | true      | true
plisk@design-rite.com| admin       | internal   | Phil Lisk  | false     | false
testuser@gmail.com   | user        | NULL       | NULL       | NULL      | NULL
```

---

## 🎯 Success Criteria

✅ **All authentication flows work correctly**
✅ **Domain restriction enforces @design-rite.com requirement**
✅ **Super admin has full access to all modules**
✅ **Admin has limited access (no user/permissions management)**
✅ **Non-@design-rite.com users properly blocked**
✅ **Database state matches expected schema**

---

**Ready to start testing!** Follow each step carefully and check off as you go. 🚀
