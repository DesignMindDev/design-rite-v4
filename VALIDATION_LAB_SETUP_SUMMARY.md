# Validation Lab Setup - Complete Summary

**Date**: 2025-10-06
**Goal**: Set up staging/validation environment with test authentication accounts
**Environment**: Staging (design-rite-staging) → Supabase ickwrbdpuorzdpzqbqpf

---

## 🎯 Final Status: SUCCESS ✅

**Validation Lab Database**: Clean and ready for proper user creation via Supabase Dashboard
**Production**: Live and working at www.design-rite.com
**Staging**: Deployed at https://cak-end.onrender.com

---

## 🔥 Critical Issues Discovered and Resolved

### 1. Production Build Failures (SOLVED)
**Problem**: Production wouldn't build - missing dependencies
**Root Cause**: `tailwindcss` and TypeScript types in devDependencies
**Solution**: Moved to dependencies in package.json (lines 92-98)
**Result**: Production deployed successfully

**Files Modified**:
- `package.json` - Moved tailwindcss, @types/node, @types/react, @types/react-dom to dependencies

---

### 2. Staging Logout 404 Errors (SOLVED - Staging Branch)
**Problem**: Logout redirected to production URL (https://www.design-rite.com/admin/login) causing 404
**Root Cause**: Hardcoded production URLs in lib/supabase.ts lines 48 and 168
**Solution**: Changed to use `process.env.NEXT_PUBLIC_APP_URL` environment variable
**Status**: Fixed in staging branch, needs deployment

**Files Modified**:
- `lib/supabase.ts` (staging branch) - Uses NEXT_PUBLIC_APP_URL instead of hardcoded URLs

---

### 3. SQL-Created Users Don't Authenticate (UNDERSTOOD)
**Problem**: Users created via direct SQL INSERT can't log in
**Root Cause**: Bypass Supabase Auth internal processes:
- No `auth.identities` record created
- Password hashing doesn't integrate with Supabase Auth
- Missing internal metadata

**Solution**: NEVER create users via SQL INSERT - always use:
- Supabase Dashboard UI (manual creation)
- Supabase Admin API `supabase.auth.admin.createUser()` (programmatic)

---

### 4. Cannot Delete Users - Foreign Key Constraint (SOLVED) 🎉
**Problem**: User deletion fails from both Supabase Dashboard and SQL with error:
```
ERROR: 23503: update or delete on table "users" violates foreign key constraint "user_roles_user_id_fkey"
```

**Root Cause**: The `public.user_roles` table has foreign key to `auth.users` WITHOUT CASCADE delete

**Solution**: Always delete from dependent tables FIRST:
```sql
-- 1. Delete from user_roles FIRST (this was the blocker!)
DELETE FROM public.user_roles WHERE user_id = 'USER_UUID';

-- 2. Delete from auth.identities
DELETE FROM auth.identities WHERE user_id = 'USER_UUID';

-- 3. Delete from auth.sessions
DELETE FROM auth.sessions WHERE user_id = 'USER_UUID';

-- 4. Finally delete from auth.users
DELETE FROM auth.users WHERE id = 'USER_UUID';
```

**Automated Script**: `supabase/delete_both_users_minimal.sql`

---

### 5. Production Has Wrong Supabase Service Keys (IDENTIFIED - NOT YET FIXED)
**Problem**: Production environment (design-rite-v4) has validation lab Supabase keys instead of production keys
**Impact**: Server-side auth operations may fail in production

**Current State** (INCORRECT):
- NEXT_PUBLIC_SUPABASE_URL: `https://ickwrbdpuorzdpzqbqpf.supabase.co` (validation lab)
- SUPABASE_SERVICE_KEY: Validation lab service key

**Should Be** (CORRECT):
- NEXT_PUBLIC_SUPABASE_URL: `https://aeorianxnxpxveoxzhov.supabase.co` (production)
- SUPABASE_SERVICE_KEY: Production service key from aeorianxnxpxveoxzhov project

**Action Required**: Update Render environment variables for design-rite-v4 service

---

## 📋 Files Created During Debugging

### Diagnostic Scripts
- `supabase/diagnose_deletion_blocker.sql` - Found auth.identities blocking deletion
- `supabase/diagnose_systemwide_block.sql` - Checked for triggers, RLS policies, constraints
- `supabase/diagnose_database_constraints.sql` - Comprehensive constraint analysis
- `supabase/show_all_users.sql` - List all users and roles
- `supabase/verify_current_state.sql` - Check user state after deletion attempts
- `supabase/check_triggers.sql` - Check for DELETE triggers
- `supabase/check_nextauth_tables.sql` - Look for lingering NextAuth tables

### Working Scripts
- `supabase/delete_both_users_minimal.sql` - **WORKING** user deletion script
- `supabase/force_delete_user.sql` - Alternative deletion approach
- `scripts/delete-user-admin-api.js` - Admin API deletion attempt (failed - no identity)

### Failed User Creation Attempts (SQL - DON'T USE)
- `supabase/create_test_users_fixed.sql` - Creates users but they can't authenticate
- Multiple iterations with missing columns (email_change, confirmation_token, etc.)

### Documentation
- `supabase/CREATE_PHIL_ACCOUNT.md` - Proper method for creating accounts via Dashboard
- `VALIDATION_LAB_SETUP_SUMMARY.md` - This file

---

## 🎓 Key Lessons Learned

### 1. **NEVER Create Users via Direct SQL INSERT**
- Bypasses Supabase Auth internal machinery
- Creates broken users that can't authenticate
- Missing auth.identities record makes them invisible to Auth API
- Always use Dashboard UI or Admin API

### 2. **Foreign Key Constraints Block Deletion**
- `user_roles` table has FK to `auth.users` without CASCADE
- Must delete from dependent tables FIRST before deleting users
- Supabase Dashboard doesn't handle this automatically

### 3. **Environment Variable Architecture**
Production and Staging must have isolated Supabase credentials:

**Production (design-rite-v4)**:
- URL: https://www.design-rite.com
- Supabase: aeorianxnxpxveoxzhov (design-rite-subscriptions)

**Staging (design-rite-staging)**:
- URL: https://cak-end.onrender.com
- Supabase: ickwrbdpuorzdpzqbqpf (design-rite-validation-lab)

**Shared**:
- OpenAI API keys
- Anthropic API keys

### 4. **Production Dependencies Matter**
- Production `npm install` skips devDependencies
- Build-essential packages must be in dependencies (tailwindcss, TypeScript types)

### 5. **Hardcoded URLs Break Multi-Environment Deployments**
- Use `process.env.NEXT_PUBLIC_APP_URL` for all redirect URLs
- Fixed in staging branch lib/supabase.ts

---

## ✅ Next Steps

### Immediate Actions
1. **Create Phil's account via Supabase Dashboard**:
   - Go to: https://supabase.com/dashboard/project/ickwrbdpuorzdpzqbqpf/auth/users
   - Email: plisk@design-rite.com
   - ✅ Auto-confirm user
   - Assign super_admin role via SQL

2. **Create Dan's account via Supabase Dashboard**:
   - Email: dan@design-rite.com
   - ✅ Auto-confirm user
   - Assign super_admin role via SQL

3. **Create test accounts**:
   - test1@design-rite.com, test2@design-rite.com, test3@design-rite.com
   - Assign 'user' or 'manager' roles

4. **Test login flow**:
   - Login at https://cak-end.onrender.com/login
   - Verify authentication works
   - Test logout (should stay on staging domain)

### Follow-Up Actions
1. **Fix production Supabase environment variables**:
   - Update NEXT_PUBLIC_SUPABASE_URL to aeorianxnxpxveoxzhov URL
   - Update SUPABASE_SERVICE_KEY to production key

2. **Deploy staging branch** to get logout fix live

3. **Consider fixing user_roles foreign key** to include CASCADE delete:
   ```sql
   ALTER TABLE public.user_roles
   DROP CONSTRAINT user_roles_user_id_fkey;

   ALTER TABLE public.user_roles
   ADD CONSTRAINT user_roles_user_id_fkey
   FOREIGN KEY (user_id) REFERENCES auth.users(id)
   ON DELETE CASCADE;
   ```

---

## 📊 Architecture Overview

### Current Environment Setup

| Environment | URL | Supabase Project | Branch | Status |
|-------------|-----|------------------|--------|--------|
| Production | www.design-rite.com | aeorianxnxpxveoxzhov (design-rite-subscriptions) | main | ✅ Live (wrong Supabase keys) |
| Staging | cak-end.onrender.com | ickwrbdpuorzdpzqbqpf (design-rite-validation-lab) | staging | ✅ Deployed |

### Supabase Authentication Tables

```
auth.users              - Main user accounts
├── auth.identities     - Provider linkage (email, oauth, etc.) [CRITICAL - must exist for auth to work]
├── auth.sessions       - Active login sessions
└── public.user_roles   - Design-Rite role assignments (super_admin, admin, manager, user)
    ├── Foreign key to auth.users WITHOUT CASCADE
    └── MUST BE DELETED FIRST before deleting users
```

---

## 🚨 Known Issues / Tech Debt

1. **Production has wrong Supabase keys** - Needs manual fix in Render dashboard
2. **user_roles foreign key** - Doesn't cascade delete, causes deletion failures
3. **Hardcoded URLs in main branch** - Fixed in staging branch, needs merge
4. **No automated user cleanup** - Must manually run SQL deletion scripts

---

## 🔗 Related Documentation

- `supabase/CREATE_PHIL_ACCOUNT.md` - User creation guide
- `ROUTING_AUTH_AUDIT_REPORT.md` - Complete platform auth audit
- `BUSINESS_AUTH_IMPLEMENTATION_SUMMARY.md` - Admin auth system overview
- `SUPABASE_AUTH_MIGRATION_COMPLETE.md` - NextAuth → Supabase migration notes
