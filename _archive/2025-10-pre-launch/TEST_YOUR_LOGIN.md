# Test Your Login After Migration

## Your Current Account:
- **Email:** `dan@designrite.com`
- **Role:** `super_admin`
- **Access Code:** `DR-SA-DK-2025`
- **Current Auth:** Next-Auth (will be migrated)

---

## What Happens During Migration:

### Step 1: User Migration Script Creates Supabase Auth Account
```typescript
// Script creates:
1. Supabase Auth user (auth.users table)
2. Profile record (profiles table)
3. Role assignment (user_roles table)
4. Sends password reset email to dan@designrite.com
```

### Step 2: You Set Your New Password
```
1. Check inbox: dan@designrite.com
2. Subject: "Reset your password for Design-Rite v3"
3. Click link in email
4. Set new password (recommend using same as before for consistency)
```

### Step 3: Login to New System
```
1. Go to: http://localhost:3010/login
2. Email: dan@designrite.com
3. Password: [your new password]
4. Auto-redirected to: http://localhost:3010/admin (because you're super_admin)
```

---

## Testing the New Login Pages:

### Option 1: Main Login Page
```
URL: http://localhost:3010/login
Look: Purple theme, unified branding
Result: Auto-redirects to /admin (you're super_admin)
```

### Option 2: Admin Login Page
```
URL: http://localhost:3010/admin/login
Look: Purple theme, "Admin Access Portal"
Result: Redirects to /admin/super
```

### Option 3: Doc-AI Login Page
```
URL: http://localhost:3010/doc-ai/login
Look: Blue theme, "Document AI"
Result: Would redirect regular users to /doc-ai/chat
Result: For you (admin): Still redirects to /admin
```

**All three use the same backend!** Just different UI themes.

---

## Your Super Admin Capabilities:

After logging in with Supabase Auth, you'll have:

✅ **Full Admin Panel Access**
- User management (create, edit, delete users)
- Role assignment
- Permission management
- Activity log viewing
- All admin features

✅ **Document AI Access**
- Unlimited AI chat
- Unlimited document uploads
- Unlimited generated documents
- No rate limits

✅ **API Access**
- All admin API routes
- Subscription management
- User CRUD operations
- System settings

---

## Recommended Migration Flow for You:

### Phase 1: Prepare (Now)
```bash
# 1. Backup your current password somewhere safe
# 2. Decide if you want same password or new one
# 3. Make sure you have access to dan@designrite.com inbox
```

### Phase 2: Run Database Migration
```sql
-- In Supabase SQL Editor:
-- Execute: supabase/migrations/SUPABASE_AUTH_001_unify_schema.sql
```

### Phase 3: Run User Migration
```bash
# In terminal:
# DRY RUN first to see what will happen:
DRY_RUN=true SEND_EMAILS=false npx ts-node scripts/migrate-users-to-supabase-auth.ts

# Review output, then run for real:
DRY_RUN=false SEND_EMAILS=true npx ts-node scripts/migrate-users-to-supabase-auth.ts
```

### Phase 4: Reset Password
```
1. Check email inbox
2. Click password reset link
3. Set new password
```

### Phase 5: Test Login
```
1. Go to http://localhost:3010/login
2. Login with dan@designrite.com + new password
3. Verify redirect to /admin
4. Test admin features
```

---

## Troubleshooting:

### "I didn't receive password reset email"
```bash
# Option A: Check Supabase Dashboard email settings
Supabase → Project Settings → Auth → Email Templates

# Option B: Manually send reset email
Supabase → Authentication → Users → dan@designrite.com → "Send password reset email"

# Option C: Set password in dashboard
Supabase → Authentication → Users → dan@designrite.com → "Reset password"
```

### "Login fails with 'Invalid credentials'"
```bash
# Check if migration completed:
SELECT au.email, p.full_name, ur.role
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
LEFT JOIN user_roles ur ON ur.user_id = au.id
WHERE au.email = 'dan@designrite.com';

# Should return:
# email: dan@designrite.com
# full_name: Dan Kozich
# role: super_admin
```

### "User not found"
```bash
# Re-run migration script:
DRY_RUN=false npx ts-node scripts/migrate-users-to-supabase-auth.ts
```

---

## Alternative: Create New Account Manually

If you want to skip the migration and create a fresh account:

```sql
-- In Supabase Dashboard → Authentication → Users
-- Click "Add user"
-- Email: dan@designrite.com
-- Password: [set your password]
-- Auto-confirm: Yes

-- Then in SQL Editor:
-- Create profile
INSERT INTO profiles (id, email, full_name, company, status)
SELECT id, email, 'Dan Kozich', 'Design-Rite Professional', 'active'
FROM auth.users
WHERE email = 'dan@designrite.com';

-- Assign role
INSERT INTO user_roles (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = 'dan@designrite.com';
```

Then you can login immediately without waiting for email!

---

## Summary:

Your login will work exactly the same, just with Supabase Auth instead of Next-Auth:

- **Same email:** `dan@designrite.com`
- **New password:** Set via email reset link
- **Same role:** `super_admin`
- **Same access:** Full admin panel + Document AI
- **Better system:** Unified auth, better security, easier management

You're all set! Just run the migrations and reset your password. 🚀
