# Phil's Login Setup - Supabase Auth Migration

**Email:** `plisk@design-rite.com`
**Current Status:** Unknown (need to check if account exists)

---

## Scenario 1: Phil Has Existing Next-Auth Account

**If Phil's account exists in the `users` table:**

### What Happens During Migration:
1. ✅ Migration script finds his account in `users` table
2. ✅ Creates Supabase Auth account for `plisk@design-rite.com`
3. ✅ Copies all his data to `profiles` table
4. ✅ Assigns his role in `user_roles` table
5. ✅ **Sends password reset email to plisk@design-rite.com**

### Phil's Next Steps:
```
1. Check inbox: plisk@design-rite.com
2. Click password reset link from email
3. Set new password
4. Login at: http://localhost:3010/login
5. Auto-redirected based on his role:
   - If admin/manager → /admin
   - If regular user → /doc-ai/chat
```

**Same as your migration process!** ✅

---

## Scenario 2: Phil Does NOT Have an Account Yet

**If Phil's account doesn't exist in the `users` table:**

### Option A: You Create His Account (Recommended)

**After running the database migration, create Phil's account in Supabase Dashboard:**

#### Step 1: Create Supabase Auth User
```
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add user"
3. Email: plisk@design-rite.com
4. Password: [temporary password or send invite]
5. Auto-confirm email: Yes
6. Click "Create user"
```

#### Step 2: Create Profile
```sql
-- Run in Supabase SQL Editor:
INSERT INTO profiles (id, email, full_name, company, status, created_by)
SELECT
  id,
  email,
  'Phil Lisk',
  'Design-Rite Professional',
  'active',
  (SELECT id FROM auth.users WHERE email = 'dan@designrite.com')
FROM auth.users
WHERE email = 'plisk@design-rite.com';
```

#### Step 3: Assign Role
```sql
-- Decide Phil's role (choose one):

-- Option 1: Make Phil an Admin
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'plisk@design-rite.com';

-- Option 2: Make Phil a Manager
INSERT INTO user_roles (user_id, role)
SELECT id, 'manager'
FROM auth.users
WHERE email = 'plisk@design-rite.com';

-- Option 3: Make Phil a Regular User
INSERT INTO user_roles (user_id, role)
SELECT id, 'user'
FROM auth.users
WHERE email = 'plisk@design-rite.com';
```

#### Step 4: Send Phil Login Info
```
Email Phil:
- Login URL: http://localhost:3010/login
- Email: plisk@design-rite.com
- Password: [the password you set or reset link]
```

---

### Option B: Use the Admin User Management UI

**After updating the admin routes (see: `scripts/update-admin-routes-to-supabase.md`):**

```
1. Login as super admin (dan@designrite.com)
2. Go to http://localhost:3010/admin/super
3. Click "Create New User" (if that UI exists)
4. Fill in:
   - Email: plisk@design-rite.com
   - Full Name: Phil Lisk
   - Role: admin/manager/user
   - Company: Design-Rite Professional
5. Submit → Phil receives welcome email with password reset link
```

---

## Recommended Role for Phil:

Based on typical company structure:

### If Phil is Co-Owner/Partner:
```sql
-- Make him Admin
INSERT INTO user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users
WHERE email = 'plisk@design-rite.com';
```

**Admin Permissions:**
- ✅ Create/manage users (except super admins)
- ✅ View all projects and data
- ✅ Unlimited quotes, AI assessments
- ✅ Access admin panel
- ✅ View activity logs
- ✅ Manage team members

### If Phil is Sales Manager:
```sql
-- Make him Manager
INSERT INTO user_roles (user_id, role)
SELECT id, 'manager'
FROM auth.users
WHERE email = 'plisk@design-rite.com';
```

**Manager Permissions:**
- ✅ Unlimited quotes, AI assessments
- ✅ Own projects only
- ✅ No user management
- ✅ Access admin panel (view only)

---

## Quick Check: Does Phil Have an Account?

Run this query in Supabase SQL Editor:

```sql
-- Check old Next-Auth users table
SELECT id, email, full_name, role, status, created_at
FROM users
WHERE email = 'plisk@design-rite.com';

-- If returns data: Phil has existing account → will be migrated
-- If returns nothing: Phil needs new account created
```

---

## Migration Summary for Phil:

| Scenario | Action Required | Phil's Steps |
|----------|----------------|--------------|
| **Has existing account** | None - migration script handles it | Check email → Reset password → Login |
| **No existing account** | You create account in Supabase | You send him login info → He logs in |

---

## After Migration - Phil's Login Experience:

### Step 1: Phil goes to login page
```
http://localhost:3010/login
```

### Step 2: Phil enters credentials
```
Email: plisk@design-rite.com
Password: [his new password]
```

### Step 3: System checks his role
```sql
SELECT role FROM user_roles WHERE user_id = Phil's UUID
```

### Step 4: Auto-redirect
```javascript
if (role === 'admin' || role === 'manager') {
  redirect('/admin');
} else {
  redirect('/doc-ai/chat');
}
```

**Same unified login system as yours!** ✅

---

## Recommendation:

1. **Check if Phil has existing account** (run SQL query above)
2. **If yes:** Migration script handles everything - Phil just resets password
3. **If no:** Create his account manually with appropriate role
4. **Decide his role:** Probably `admin` if he's co-owner, `manager` if sales lead

Need me to check if Phil has an existing account in your database?
