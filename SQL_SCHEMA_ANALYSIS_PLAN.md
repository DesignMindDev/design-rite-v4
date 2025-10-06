# SQL Schema Analysis & Consolidation Plan

## 🎯 Objective
Identify and resolve schema conflicts between main platform and microservices before deployment.

---

## 📊 Schema Inventory

### Main Platform (design-rite-v3)
- `FRESH_START_BUSINESS_AUTH.sql` - user_roles, profiles, module_permissions
- `CREATE_ACTIVITY_LOGS.sql` - activity_logs
- `ADD_MISSING_PROFILE_COLUMNS.sql` - ALTER TABLE profiles
- `FIX_RLS_POLICIES.sql` - Policy updates
- `FIX_RLS_ALLOW_ANON.sql` - Policy updates

### Microservices
- `design-rite-spatial-studio/supabase/spatial_studio_tables.sql`
- `design-rite-creative-studio/supabase/creative_studio_tables.sql`
- `design-rite-super-agent/supabase/orchestration_tracking.sql`

### Consolidated
- `C:\Users\dkozi\OneDrive\Design-Rite\ALL_SUPABASE_TABLES.sql`

---

## 🔍 Analysis Steps (In Order)

### Step 1: Read All Schema Files
- [ ] Read FRESH_START_BUSINESS_AUTH.sql
- [ ] Read CREATE_ACTIVITY_LOGS.sql
- [ ] Read spatial_studio_tables.sql
- [ ] Read creative_studio_tables.sql
- [ ] Read orchestration_tracking.sql
- [ ] Read ALL_SUPABASE_TABLES.sql (consolidated)

### Step 2: Identify Duplicate Tables
**Check for conflicts:**
- [ ] profiles table (main vs. microservices)
- [ ] user_roles table (main vs. microservices)
- [ ] activity_logs table (main vs. microservices)
- [ ] Any other overlapping table names

### Step 3: Compare RLS Policies
**Check for conflicts:**
- [ ] Service role access (should be consistent)
- [ ] Authenticated user access
- [ ] Anonymous access (where needed)
- [ ] Policy recursion issues

### Step 4: Verify Foreign Key Relationships
**Cross-service dependencies:**
- [ ] Do microservices reference auth.users?
- [ ] Do they reference user_roles?
- [ ] Are there circular dependencies?

### Step 5: Check Column Definitions
**For duplicate tables, verify:**
- [ ] Column names match
- [ ] Data types match
- [ ] Constraints match (NOT NULL, CHECK, etc.)
- [ ] Default values match

---

## 🚨 Known Issues from Today

### Issue 1: Missing Columns in profiles
**Problem**: useSupabaseAuth.ts expected `phone` and `avatar_url`
**Resolution**: Added columns via ADD_MISSING_PROFILE_COLUMNS.sql
**Check**: Do microservices also expect these columns?

### Issue 2: RLS Infinite Recursion
**Problem**: Policies querying same table
**Resolution**: Changed to auth.role() and auth.uid()
**Check**: Are microservice policies using same pattern?

### Issue 3: Reserved Keywords
**Problem**: `timestamp` column name
**Resolution**: Changed to `created_at`
**Check**: Do microservices use reserved keywords?

---

## 📋 Conflict Resolution Strategy

### If Duplicate Tables Found:
1. **Determine Source of Truth**
   - Main platform owns: auth.users, user_roles, profiles
   - Microservices own: domain-specific tables

2. **Resolution Options**
   - **Option A**: Keep in main, reference from microservices
   - **Option B**: Move to shared schema (public vs. service-specific)
   - **Option C**: Rename microservice tables with prefix (e.g., spatial_profiles)

3. **Update References**
   - Update foreign keys
   - Update RLS policies
   - Update application code

### If Policy Conflicts Found:
1. **Merge Policies**
   - Combine USING clauses with OR
   - Ensure service role always has access
   - Keep policies non-recursive

2. **Standardize Pattern**
   - auth.uid() for user-specific
   - auth.role() for role-based
   - service_role for admin bypass

---

## ✅ Validation Checklist

After schema consolidation:
- [ ] All tables exist in Supabase
- [ ] No duplicate table errors
- [ ] All RLS policies active
- [ ] Foreign keys working
- [ ] No infinite recursion errors
- [ ] Service roles can bypass RLS
- [ ] Authenticated users have correct access
- [ ] Anonymous users limited correctly

---

## 🔄 Recommended Order of Operations

### Phase 1: Analysis (30 minutes)
1. Read all schema files
2. Create conflict matrix (which tables overlap)
3. Identify critical vs. non-critical conflicts

### Phase 2: Main Platform (15 minutes)
4. Ensure main platform schemas are correct
5. Verify profiles table has phone/avatar_url
6. Verify activity_logs uses created_at (not timestamp)

### Phase 3: Microservices (30 minutes)
7. Check if microservices duplicate auth tables
8. Verify they reference auth.users correctly
9. Check for reserved keyword issues

### Phase 4: Consolidation (45 minutes)
10. Create master schema file
11. Resolve all conflicts
12. Test in Supabase SQL Editor

### Phase 5: Deployment (30 minutes)
13. Drop conflicting tables (if safe)
14. Run consolidated schema
15. Verify all tables created
16. Test application functionality

**Total Estimated Time**: 2.5 hours

---

## 🛠️ Tools & Commands

### PostgreSQL Inspection Queries
```sql
-- List all tables
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check for duplicate columns
SELECT table_name, column_name FROM information_schema.columns WHERE column_name = 'phone';

-- View all RLS policies
SELECT schemaname, tablename, policyname FROM pg_policies;

-- Check foreign key relationships
SELECT tc.table_name, kcu.column_name, ccu.table_name AS foreign_table_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY';
```

---

## 📝 Output Artifacts

At end of analysis, create:
1. **SCHEMA_CONFLICTS.md** - List of all conflicts found
2. **SCHEMA_RESOLUTION.md** - How each conflict was resolved
3. **MASTER_SCHEMA.sql** - Final consolidated schema
4. **MIGRATION_PLAN.md** - Step-by-step deployment plan

---

**Next Action**: Start Phase 1 - Read all schema files and create conflict matrix
