# 🔐 Business Auth System - Super Admin Guide

**For:** Dan Kozich (Super Admin)
**Email:** dan@design-rite.com
**Updated:** October 5, 2025

---

## 📋 Overview

The Design-Rite business admin portal is now restricted to **@design-rite.com** email addresses only, with super admin override capability for contractors and developers.

---

## 🎯 Access Control Rules

### **Automatic Access (No Override Needed)**
✅ **@design-rite.com emails** - Automatically granted access
- dan@design-rite.com (Super Admin)
- plisk@design-rite.com (Admin)
- Any new @design-rite.com employee

### **Requires Domain Override**
⚠️ **Non-@design-rite.com emails** - Requires super admin approval
- Contractors: contractor@example.com
- Developers: dev@freelancer.com
- Partners: partner@agency.com

---

## 👥 Role Hierarchy

| Role | Description | Example |
|------|-------------|---------|
| **super_admin** | Full platform control, can grant overrides | dan@design-rite.com |
| **admin** | Team management, content, no user/permission control | plisk@design-rite.com |
| **manager** | Unlimited quotes/assessments, no admin access | sales@design-rite.com |
| **developer** | Custom permissions, requires domain override | dev@contractor.com |
| **contractor** | Custom permissions, requires domain override | freelancer@gmail.com |
| **user** | Rate-limited customer access | customer@company.com |
| **guest** | Public/trial access | anonymous |

---

## 🚀 Setup Instructions

### **Step 1: Create User Accounts**

1. Go to: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/auth/users
2. Click "**Add user**" → "**Create new user**"
3. Enter details:
   - **Email:** dan@design-rite.com
   - **Password:** (strong password)
   - ✅ **Auto Confirm User** (IMPORTANT!)
4. Repeat for plisk@design-rite.com

### **Step 2: Run Setup Script**

1. Go to: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/sql/new
2. Copy entire contents of `SETUP_BUSINESS_AUTH_SYSTEM.sql`
3. Click **RUN** ▶️
4. Verify you see:
   ```
   email                 | role        | user_group | full_name  | department
   ----------------------|-------------|------------|------------|-----------
   dan@design-rite.com   | super_admin | internal   | Dan Kozich | Leadership
   plisk@design-rite.com | admin       | internal   | Phil Lisk  | Operations
   ```

### **Step 3: Test Login**

1. Go to: http://localhost:3000/login
2. Login as: dan@design-rite.com
3. You should be redirected to: http://localhost:3000/admin ✅

---

## 🔧 Granting Contractor/Developer Access

### **Scenario:** External developer needs admin access

**SQL Script (Run in Supabase SQL Editor):**

```sql
-- 1. First, create the user in Supabase Dashboard:
--    https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/auth/users
--    Email: developer@contractor.com
--    Password: (secure password)
--    ✅ Auto Confirm User

-- 2. Then run this to grant domain override:
INSERT INTO user_roles (
  user_id,
  role,
  user_group,
  domain_override,
  override_reason,
  override_granted_by
)
SELECT
  id,
  'developer',
  'contractor',
  true,
  'External developer - needs access to admin portal for platform development',
  (SELECT id FROM auth.users WHERE email = 'dan@design-rite.com')
FROM auth.users
WHERE email = 'developer@contractor.com'
ON CONFLICT (user_id) DO UPDATE SET
  domain_override = true,
  override_reason = 'External developer - needs access to admin portal for platform development',
  override_granted_by = (SELECT id FROM auth.users WHERE email = 'dan@design-rite.com'),
  override_granted_at = now();

-- 3. Set specific module permissions for contractor
INSERT INTO module_permissions (
  user_id,
  -- Grant only necessary permissions
  operations_dashboard,
  ai_providers,
  testing_dashboard,
  -- Deny sensitive permissions
  user_management,
  permissions_management,
  subscriptions
)
SELECT
  id,
  true,   -- operations_dashboard
  true,   -- ai_providers
  true,   -- testing_dashboard
  false,  -- user_management (denied)
  false,  -- permissions_management (denied)
  false   -- subscriptions (denied)
FROM auth.users
WHERE email = 'developer@contractor.com'
ON CONFLICT (user_id) DO UPDATE SET
  operations_dashboard = true,
  ai_providers = true,
  testing_dashboard = true,
  user_management = false,
  permissions_management = false,
  subscriptions = false;

-- 4. Verify access granted
SELECT
  u.email,
  ur.role,
  ur.user_group,
  ur.domain_override,
  ur.override_reason
FROM auth.users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
WHERE u.email = 'developer@contractor.com';
```

---

## 🎛️ Module Permissions Reference

Use this to customize what each user can access:

```sql
-- Full permissions list (true = granted, false = denied)
module_permissions:
  -- Operations & Monitoring
  operations_dashboard: true/false
  analytics: true/false

  -- AI Tools
  ai_providers: true/false
  ai_assistant_config: true/false
  chatbot_config: true/false

  -- Data Tools
  product_harvester: true/false

  -- Marketing & Content
  team_management: true/false
  creative_studio: true/false
  spatial_studio: true/false
  logo_management: true/false
  video_management: true/false
  blog_management: true/false

  -- Business Tools
  subscriptions: true/false
  demo_dashboard: true/false
  testing_dashboard: true/false

  -- About Us
  about_us_management: true/false

  -- Super Admin Only
  user_management: true/false
  permissions_management: true/false
  activity_logs: true/false
```

---

## 📝 Common Admin Tasks

### **1. Add New Design-Rite Employee**

```sql
-- Step 1: Create user via Supabase Dashboard
-- Email: newemployee@design-rite.com

-- Step 2: Assign role and permissions
INSERT INTO user_roles (user_id, role, user_group)
SELECT id, 'admin', 'internal'
FROM auth.users
WHERE email = 'newemployee@design-rite.com'
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Step 3: Grant all admin permissions
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
SELECT
  id,
  true, true, true, true, true, true,
  true, true, true, true, true, true,
  true, true, true, true,
  false, false, true  -- No user/permission management
FROM auth.users
WHERE email = 'newemployee@design-rite.com'
ON CONFLICT (user_id) DO UPDATE SET
  operations_dashboard = true,
  analytics = true,
  -- ... (set all to true)
  user_management = false,
  permissions_management = false;
```

### **2. Revoke Contractor Access**

```sql
-- Remove domain override
UPDATE user_roles
SET
  domain_override = false,
  override_reason = 'Contract ended - access revoked',
  role = 'user'
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'contractor@example.com');

-- Or delete entirely
DELETE FROM user_roles
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'contractor@example.com');
```

### **3. View All Users with Admin Access**

```sql
SELECT
  u.email,
  ur.role,
  ur.user_group,
  ur.domain_override,
  p.full_name,
  p.department
FROM auth.users u
JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN profiles p ON p.id = u.id
WHERE ur.role IN ('super_admin', 'admin', 'manager', 'developer', 'contractor')
ORDER BY
  CASE ur.role
    WHEN 'super_admin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'manager' THEN 3
    WHEN 'developer' THEN 4
    WHEN 'contractor' THEN 5
  END;
```

### **4. View All Users with Domain Override**

```sql
SELECT
  u.email,
  ur.role,
  ur.domain_override,
  ur.override_reason,
  ur.override_granted_at,
  granted_by.email AS granted_by_email
FROM auth.users u
JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN auth.users granted_by ON granted_by.id = ur.override_granted_by
WHERE ur.domain_override = true
ORDER BY ur.override_granted_at DESC;
```

---

## 🚨 Security Best Practices

1. **Domain Override Audit:** Review domain overrides monthly
2. **Contract Expiry:** Remove contractor access when contract ends
3. **Least Privilege:** Only grant permissions needed for the role
4. **Activity Monitoring:** Check `activity_logs` table regularly
5. **Password Policy:** Require strong passwords for all admin accounts

---

## 🔗 Quick Links

- **Supabase Auth Users:** https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/auth/users
- **Supabase SQL Editor:** https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/sql/new
- **Admin Portal (Local):** http://localhost:3000/admin
- **Admin Portal (Production):** https://design-rite-v3.onrender.com/admin

---

## 📞 Support

**Questions?** Email: dan@design-rite.com

**Platform Issues?** Check:
- `/admin/operations` - Platform health
- `/admin/super/activity` - Activity logs
- Supabase logs for errors

---

**Last Updated:** October 5, 2025
**System Version:** Business Auth v1.0
