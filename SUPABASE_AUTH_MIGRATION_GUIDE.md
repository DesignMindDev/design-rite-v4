# Supabase Auth Migration Guide
## Migrating Admin System from Next-Auth to Supabase Auth

**Date:** 2025-10-02
**Purpose:** Unify authentication system - both Admin Panel and Document AI will use Supabase Auth
**Impact:** All users will need to use Supabase Auth login instead of Next-Auth

---

## 📋 Migration Overview

### Current State
- **Admin Panel**: Uses Next-Auth with `users` table and bcrypt passwords
- **Document AI**: Uses Supabase Auth with `auth.users` and `profiles` tables
- **Problem**: Two separate auth systems, confusing UX

### Target State
- **Both systems**: Unified Supabase Auth
- **One login**: `/login` works for both admin and doc-ai
- **One user table**: `auth.users` (Supabase) + `profiles` (extended)
- **Simplified**: No more Next-Auth configuration

---

## 🚀 Migration Steps

### Phase 1: Database Migration (Run in Supabase SQL Editor)

#### Step 1: Run Schema Unification Migration
```sql
-- File: supabase/migrations/SUPABASE_AUTH_001_unify_schema.sql
-- This extends the profiles table with all admin fields
```

**What it does:**
- ✅ Adds admin fields to `profiles` table (phone, access_code, status, etc.)
- ✅ Extends `app_role` enum with super_admin, manager, guest
- ✅ Creates `activity_logs`, `permissions`, `usage_tracking` tables
- ✅ Adds helper functions: `get_user_role()`, `check_rate_limit()`, etc.
- ✅ Seeds default permissions for all roles
- ✅ Updates RLS policies for unified access

**Run it:**
1. Open Supabase Dashboard → SQL Editor
2. Paste contents of `supabase/migrations/SUPABASE_AUTH_001_unify_schema.sql`
3. Click "Run"
4. Verify success messages

---

### Phase 2: User Data Migration (Run via Terminal)

#### Step 2: Migrate Existing Users to Supabase Auth
```bash
# Install dependencies if needed
npm install @supabase/supabase-js

# Run migration script (DRY RUN first)
DRY_RUN=true SEND_EMAILS=false npx ts-node scripts/migrate-users-to-supabase-auth.ts

# Review output, then run for real
DRY_RUN=false SEND_EMAILS=true npx ts-node scripts/migrate-users-to-supabase-auth.ts
```

**What it does:**
- ✅ Creates Supabase Auth account for each Next-Auth user
- ✅ Copies all user data to `profiles` table
- ✅ Assigns roles in `user_roles` table
- ✅ Sends password reset emails to all users
- ✅ Logs migration progress in `auth_migration_log` table

**Expected Results:**
```
📊 Migration Summary
Total users: 1
✅ Successful: 1
❌ Failed: 0
```

---

### Phase 3: Frontend Migration (Code Updates)

#### Step 3: Update Admin Login Page

**File:** `app/admin/login/page.tsx`

**Before:**
```typescript
import { signIn } from 'next-auth/react';

const result = await signIn('credentials', {
  email,
  password,
  redirect: false,
});
```

**After:**
```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabase = createClientComponentClient();
const { data, error } = await supabase.auth.signInWithPassword({
  email,
  password,
});
```

---

#### Step 4: Update All Admin Pages to Use `useSupabaseAuth`

**Find all files using:**
```bash
grep -r "useUnifiedAuth" app/admin/
```

**Replace:**
```typescript
// OLD
import { useUnifiedAuth } from '@/lib/hooks/useUnifiedAuth';
const auth = useUnifiedAuth();

// NEW
import { useSupabaseAuth } from '@/lib/hooks/useSupabaseAuth';
const auth = useSupabaseAuth();

// Property changes:
// - user.name → user.fullName
// - auth.isPro → auth.isProfessional
```

---

#### Step 5: Update Admin API Routes

**File:** `app/api/admin/*/route.ts`

**Before:**
```typescript
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

const session = await getServerSession(authOptions);
if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
```

**After:**
```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabase = createRouteHandlerClient({ cookies });
const { data: { session } } = await supabase.auth.getSession();
if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

// Get user role
const { data: profile } = await supabase
  .from('profiles')
  .select('*, user_roles(role)')
  .eq('id', session.user.id)
  .single();

const role = profile?.user_roles?.role || 'user';
```

---

### Phase 4: Create Unified Login Page

#### Step 6: Create `/login` Page (Works for Both Systems)

**File:** `app/login/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function UnifiedLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) throw error;

      // Get user role to determine redirect
      const { data: profile } = await supabase
        .from('profiles')
        .select('*, user_roles(role)')
        .eq('id', data.user.id)
        .single();

      const role = profile?.user_roles?.role || 'user';

      // Redirect based on role
      if (role === 'super_admin' || role === 'admin' || role === 'manager') {
        router.push('/admin');
      } else {
        router.push('/doc-ai/chat');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Design-Rite v3</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="text-center text-sm text-gray-600">
            <a href="/forgot-password" className="text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
```

---

### Phase 5: Cleanup (After Successful Migration)

#### Step 7: Remove Next-Auth Configuration

**Files to remove:**
- ✅ `lib/auth-config.ts` (Next-Auth configuration)
- ✅ `app/api/auth/[...nextauth]/route.ts` (Next-Auth API handler)
- ✅ `lib/hooks/useUnifiedAuth.ts` (Next-Auth hook - replaced by useSupabaseAuth)

**Files to update:**
- ✅ `middleware.ts` - Update to use Supabase Auth
- ✅ `package.json` - Remove `next-auth` and `bcryptjs` dependencies
- ✅ `.env.local` - Remove `NEXTAUTH_SECRET` and `NEXTAUTH_URL`

**Database cleanup:**
- ✅ Drop `users` table (old Next-Auth users)
- ✅ Drop `user_sessions` table (if using old sessions)

---

## 🧪 Testing Checklist

### Test 1: Super Admin Login
```bash
# Test URL: http://localhost:3010/login
# Email: dan@designrite.com
# Password: (use password reset link from migration email)

Expected:
✅ Login succeeds
✅ Redirected to /admin
✅ Can access all admin features
✅ See "super_admin" role in session
```

### Test 2: Document AI User Login
```bash
# Test URL: http://localhost:3010/login
# Email: (any doc-ai user email)
# Password: (use password reset link)

Expected:
✅ Login succeeds
✅ Redirected to /doc-ai/chat
✅ Can access doc-ai features
✅ See "user" role in session
```

### Test 3: API Route Protection
```bash
# Test unauthorized access
curl http://localhost:3010/api/admin/subscriptions

Expected:
✅ Returns 401 Unauthorized

# Test authorized access (after login)
Expected:
✅ Returns data
✅ RLS policies enforced
```

### Test 4: Rate Limiting
```bash
# Login as standard user
# Make 11 quick estimates

Expected:
✅ First 10 succeed
✅ 11th shows rate limit error
✅ Upgrade prompt shown
```

---

## 📊 Migration Verification

### Database Queries

```sql
-- Check all users migrated
SELECT
  au.email,
  p.full_name,
  ur.role,
  p.subscription_tier,
  p.status
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
LEFT JOIN user_roles ur ON ur.user_id = au.id
ORDER BY ur.role, au.email;

-- Check migration log
SELECT
  email,
  status,
  migrated_at,
  error_message
FROM auth_migration_log
ORDER BY migrated_at DESC;

-- Check permissions
SELECT role, feature, can_create, daily_limit, monthly_limit
FROM permissions
WHERE role IN ('super_admin', 'admin', 'user')
ORDER BY role, feature;
```

---

## 🚨 Rollback Plan (If Something Goes Wrong)

### Option A: Quick Rollback (Keep Next-Auth)
```bash
# 1. Restore old code from git
git checkout main -- lib/auth-config.ts
git checkout main -- app/api/auth/[...nextauth]/route.ts
git checkout main -- app/admin/login/page.tsx

# 2. Restart dev server
npm run dev

# Users can still log in with Next-Auth
```

### Option B: Database Rollback
```sql
-- Restore from backup taken before migration
-- Use Supabase Dashboard → Database → Backups
```

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue 1: "User not found in profiles table"**
```bash
# Solution: Re-run migration script
DRY_RUN=false npx ts-node scripts/migrate-users-to-supabase-auth.ts
```

**Issue 2: "Invalid credentials"**
```bash
# Solution: Send password reset email
# In Supabase Dashboard → Authentication → Users
# Click user → "Send password reset email"
```

**Issue 3: "Unauthorized" after login**
```bash
# Solution: Check user_roles table
SELECT * FROM user_roles WHERE user_id = '<user-id>';

# If missing, insert role:
INSERT INTO user_roles (user_id, role)
VALUES ('<user-id>', 'admin');
```

---

## ✅ Migration Complete!

**Congratulations!** You've successfully migrated from Next-Auth to Supabase Auth.

**Benefits:**
- ✅ Unified authentication system
- ✅ Simplified codebase (no Next-Auth config)
- ✅ Better security (Supabase Auth best practices)
- ✅ Easier user management (Supabase Dashboard)
- ✅ Built-in email verification and password reset

**Next Steps:**
1. Monitor error logs for any auth issues
2. Update documentation for new login flow
3. Notify users about password reset emails
4. Remove old Next-Auth dependencies
5. Celebrate! 🎉
