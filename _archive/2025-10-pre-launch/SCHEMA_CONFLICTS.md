# SQL Schema Conflict Analysis
## Design-Rite v3 Platform - Database Schema Conflicts

**Analysis Date**: October 5, 2025
**Schemas Analyzed**: 4 (Main Platform + 3 Microservices)

---

## 📊 Conflict Matrix

### ✅ No Table Name Conflicts
All microservices use **unique table names** - no duplicate table definitions found:

| Service | Tables | Conflicts |
|---------|--------|-----------|
| **Main Platform** | user_roles, module_permissions, profiles, activity_logs | ✅ None |
| **Spatial Studio** | spatial_projects, site_annotations, ai_device_suggestions, site_walk_sessions, ai_analysis_debug | ✅ None |
| **Creative Studio** | creative_projects, creative_assets, creative_templates, creative_generations | ✅ None |
| **Super Agent** | orchestration_sessions, tool_usage_analytics, super_agent_user_journey | ✅ None |

---

## 🚨 Critical Issues Found

### Issue 1: **RLS Policy Infinite Recursion** (CRITICAL!)
**Location**: Super Agent - `orchestration_tracking.sql`

**Problem**: Policies on `orchestration_sessions`, `tool_usage_analytics`, and `super_agent_user_journey` query `user_roles` table to check if user is admin/super_admin.

**Lines Affected**:
- Lines 108-116 (orchestration_sessions admin policy)
- Lines 135-141 (tool_usage_analytics admin policy)
- Lines 154-160 (super_agent_user_journey admin policy)

**Code**:
```sql
CREATE POLICY "Admins can view all orchestration sessions" ON orchestration_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );
```

**Why This Breaks**:
1. When user queries `orchestration_sessions`, policy checks `user_roles`
2. `user_roles` has policy that checks if user is super_admin by querying `user_roles` again
3. **Infinite recursion → 500 error**

**Resolution Required**:
Remove EXISTS check on `user_roles`. Use service role or simplified policy.

**Recommended Fix**:
```sql
-- Option 1: Allow all authenticated users (simplest)
CREATE POLICY "Authenticated users can view orchestration sessions" ON orchestration_sessions
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Option 2: Use service role for admin operations (recommended)
-- No admin policy needed - admins use service key
```

---

### Issue 2: **Missing Foreign Key Dependency**
**Location**: Super Agent - `v_recent_orchestration_sessions` view

**Problem**: View references `profiles` table with LEFT JOIN, but profiles table must exist first.

**Line**: 222
```sql
LEFT JOIN profiles p ON os.user_id = p.id
```

**Resolution Required**:
Ensure `profiles` table exists before creating Super Agent views.

**Deployment Order**:
1. ✅ Main Platform (creates profiles table)
2. ✅ Spatial Studio (independent)
3. ✅ Creative Studio (independent)
4. ✅ Super Agent (depends on profiles)

---

### Issue 3: **Timestamp Inconsistency**
**Location**: Spatial Studio vs. Main Platform

**Problem**: Spatial Studio uses `timestamp`, Main Platform uses `timestamptz`

**Spatial Studio** (`spatial_studio_tables.sql`):
- Lines 48, 53, 61, 76, 84, 89, 101
- Uses: `timestamp DEFAULT now()`

**Main Platform** (`activity_logs`, profiles, etc.):
- Uses: `timestamptz DEFAULT now()`

**Impact**:
- Low - both work, but `timestamptz` is recommended (stores timezone)
- May cause confusion when comparing timestamps across services

**Resolution**:
**Non-critical** - Can coexist, but standardize on `timestamptz` for consistency.

---

### Issue 4: **Profiles Table Schema Mismatch**
**Location**: Main Platform - `FRESH_START_BUSINESS_AUTH.sql`

**Problem**: Original profiles schema missing columns that `useSupabaseAuth.ts` expects.

**Original Schema** (lines 152-174):
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  company text,
  department text,
  job_title text,
  stripe_customer_id text UNIQUE,
  stripe_subscription_id text,
  subscription_tier text DEFAULT 'base',
  subscription_status text DEFAULT 'inactive',
  sso_enabled boolean DEFAULT false,
  sso_provider text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

**Missing Columns** (added via `ADD_MISSING_PROFILE_COLUMNS.sql`):
- `phone text`
- `avatar_url text`

**Resolution**:
Already fixed in separate migration file, but main schema file should be updated for future deployments.

---

## ⚠️ Moderate Issues

### Issue 5: **Recursive RLS Policies in Main Platform**
**Location**: Main Platform - `FRESH_START_BUSINESS_AUTH.sql`

**Problem**: Same infinite recursion issue exists in main platform policies (not yet deployed).

**Lines Affected**:
- Lines 52-60 (user_roles)
- Lines 128-136 (module_permissions)
- Lines 189-197 (profiles)

**Code**:
```sql
CREATE POLICY "Super admins can view all roles" ON user_roles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      WHERE ur.user_id = auth.uid()
      AND ur.role = 'super_admin'
    )
  );
```

**Resolution**:
Use `FIX_RLS_POLICIES.sql` and `FIX_RLS_ALLOW_ANON.sql` instead of these policies.

**Status**: ✅ Already fixed in separate files

---

### Issue 6: **Storage Bucket Naming**
**Location**: All services

**Storage Buckets Created**:
- `spatial-floorplans` (Spatial Studio)
- `creative-assets` (Creative Studio)

**Potential Conflict**: None - unique bucket names

**Recommendation**: Add prefix `dr-` for clarity:
- `dr-spatial-floorplans`
- `dr-creative-assets`

**Impact**: Low - Not critical, but helps identify buckets in Supabase UI

---

## ✅ Non-Issues (Validated)

### ✅ Foreign Key References to auth.users
**Status**: Valid across all services

All tables correctly reference `auth.users(id)`:
- ✅ Main Platform: `user_roles.user_id`
- ✅ Spatial Studio: None (uses customer_id)
- ✅ Creative Studio: `creative_projects.user_id`, `creative_assets.user_id`, etc.
- ✅ Super Agent: `orchestration_sessions.user_id`, `tool_usage_analytics` (via session)

---

### ✅ Service Name Tracking
**Status**: Good practice

Creative Studio and Spatial Studio include `service_name` field for multi-service tracking:
- `creative_projects.service_name DEFAULT 'creative-studio'`
- `spatial_projects` uses `customer_id` instead

**Recommendation**: Add `service_name` to Spatial Studio for consistency.

---

## 📝 Deployment Strategy

### Phase 1: Main Platform (Run First)
1. ✅ Run `FRESH_START_BUSINESS_AUTH.sql` (creates user_roles, profiles, module_permissions)
2. ✅ Run `ADD_MISSING_PROFILE_COLUMNS.sql` (adds phone, avatar_url)
3. ✅ Run `CREATE_ACTIVITY_LOGS.sql` (creates activity_logs)
4. ✅ Run `FIX_RLS_POLICIES.sql` (fixes infinite recursion)
5. ✅ Run `FIX_RLS_ALLOW_ANON.sql` (allows anon reads)

**Status**: ✅ Already deployed in current session

### Phase 2: Independent Microservices (Run in Parallel)
6. Run `spatial_studio_tables.sql`
7. Run `creative_studio_tables.sql`

**Note**: These can run simultaneously - no dependencies

### Phase 3: Super Agent (Run Last)
8. **FIX** `orchestration_tracking.sql` first:
   - Remove recursive admin policies (lines 108-116, 135-141, 154-160)
   - Use simplified policies or service role
9. Run fixed `orchestration_tracking.sql`

**Why Last**: Depends on `profiles` table existing

---

## 🔧 Required Fixes Before Deployment

### Fix 1: Update Super Agent Policies
**File**: `design-rite-super-agent/supabase/orchestration_tracking.sql`

**Remove these policies** (lines 108-116, 135-141, 154-160):
```sql
-- DELETE THIS (causes infinite recursion)
CREATE POLICY "Admins can view all orchestration sessions" ON orchestration_sessions
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
    )
  );
```

**Replace with**:
```sql
-- Allow all authenticated users to view their own sessions
-- (Already exists as "Users can view own orchestration sessions")

-- For admin access, use service role key in API calls
-- No admin policy needed
```

### Fix 2: Update Main Platform Schema
**File**: `FRESH_START_BUSINESS_AUTH.sql`

**Add missing columns to profiles table** (after line 160):
```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  company text,

  -- Contact info
  phone text,              -- ADD THIS
  avatar_url text,         -- ADD THIS

  -- Business user info
  department text,
  job_title text,

  -- ... rest of table
);
```

### Fix 3: Standardize Timestamps (Optional)
**Files**: `spatial_studio_tables.sql`

**Change all `timestamp` to `timestamptz`**:
```sql
-- OLD:
created_at timestamp DEFAULT now()

-- NEW:
created_at timestamptz DEFAULT now()
```

---

## ✅ Validation Queries

After deployment, run these to verify:

```sql
-- 1. Check all tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Expected: 16 tables (4 main + 5 spatial + 4 creative + 3 super_agent)

-- 2. Check for RLS recursion
SELECT schemaname, tablename, policyname, qual
FROM pg_policies
WHERE qual LIKE '%user_roles%'
AND tablename != 'user_roles';

-- Expected: 0 rows (no policies query user_roles except on user_roles itself)

-- 3. Verify foreign keys
SELECT
  tc.table_name,
  kcu.column_name,
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;

-- Expected: All foreign keys valid, no broken references

-- 4. Check storage buckets
SELECT id, name, public FROM storage.buckets;

-- Expected:
-- spatial-floorplans | true
-- creative-assets    | true
```

---

## 📊 Summary

### Critical (Must Fix)
- [x] **Super Agent RLS Recursion** - Remove admin policies that query user_roles
- [x] **Deployment Order** - Main Platform → Microservices → Super Agent

### Important (Should Fix)
- [ ] **Profiles Schema** - Update FRESH_START_BUSINESS_AUTH.sql with phone/avatar_url
- [ ] **Timestamp Consistency** - Change Spatial Studio to timestamptz

### Nice to Have (Optional)
- [ ] **Bucket Naming** - Add `dr-` prefix to storage buckets
- [ ] **Service Name** - Add service_name to Spatial Studio tables

---

## 🎯 Next Steps

1. **Fix Super Agent SQL file** - Remove recursive policies
2. **Update Main Platform schema** - Add phone/avatar_url to profiles
3. **Deploy in order**: Main → Spatial/Creative → Super Agent
4. **Run validation queries** - Verify no conflicts
5. **Test each service** - Ensure APIs work

**Estimated Time**: 1 hour (30 min fixes + 30 min deployment & testing)
