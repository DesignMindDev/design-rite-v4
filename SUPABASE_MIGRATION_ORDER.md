# 🚀 Supabase Migration - Correct Order

**IMPORTANT:** Run migrations in this exact order!

---

## ⚠️ Prerequisites

Before running ANY migrations, ensure:
1. ✅ Supabase project created
2. ✅ You have the `designr_backup.sql` file
3. ✅ Database is empty (fresh Supabase project) OR you have a backup

---

## 📋 STEP-BY-STEP MIGRATION ORDER

### **Step 1: Load Document AI Backup** (REQUIRED FIRST!)

**File:** `designr_backup.sql` (the backup you provided)
**Location:** `C:\Users\dkozi\Downloads\designr_backup.sql`

**In Supabase SQL Editor:**
```sql
-- Copy and paste the entire designr_backup.sql file
-- This creates:
-- - auth.users (Supabase Auth table)
-- - profiles table
-- - user_roles table with app_role enum
-- - All Document AI tables (chat_conversations, user_documents, etc.)
-- - Storage buckets
-- - Existing RLS policies
```

**What this creates:**
- ✅ `profiles` table
- ✅ `user_roles` table
- ✅ `app_role` enum (admin, moderator, user)
- ✅ `admin_settings` table
- ✅ `user_themes` table
- ✅ `chat_conversations`, `chat_messages`
- ✅ `user_documents`, `new_document_chunks`
- ✅ `generated_documents`
- ✅ `global_documents`, `global_ai_documents`
- ✅ All existing Document AI functionality

**Verify it worked:**
```sql
-- Check profiles table exists
SELECT COUNT(*) FROM profiles;

-- Check user_roles table exists
SELECT COUNT(*) FROM user_roles;

-- Check app_role enum exists
SELECT enumlabel FROM pg_enum WHERE enumtypid = 'app_role'::regtype;
-- Should return: admin, moderator, user
```

---

### **Step 2: Run Supabase Auth Unification** (AFTER Step 1!)

**File:** `supabase/migrations/SUPABASE_AUTH_001_unify_schema.sql`

**In Supabase SQL Editor:**
```sql
-- Copy and paste SUPABASE_AUTH_001_unify_schema.sql
```

**What this adds:**
- ✅ Extends `profiles` table with Design-Rite fields (phone, access_code, status, etc.)
- ✅ Adds new roles to `app_role` enum (super_admin, manager, guest)
- ✅ Creates Design-Rite tables: `activity_logs`, `permissions`, `usage_tracking`, `user_sessions`
- ✅ Creates role helper functions: `get_user_role()`, `has_role_level()`, `check_rate_limit()`
- ✅ Seeds default permissions for all 6 roles
- ✅ Adds RLS policies for new tables

**Verify it worked:**
```sql
-- Check new columns added to profiles
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('phone', 'access_code', 'status', 'rate_limit_override');
-- Should return 4 rows

-- Check new roles added
SELECT enumlabel FROM pg_enum WHERE enumtypid = 'app_role'::regtype ORDER BY enumsortorder;
-- Should return: admin, moderator, user, super_admin, manager, guest

-- Check new tables created
SELECT table_name FROM information_schema.tables
WHERE table_name IN ('activity_logs', 'permissions', 'usage_tracking', 'user_sessions')
AND table_schema = 'public';
-- Should return 4 rows

-- Check permissions seeded
SELECT COUNT(*) FROM permissions;
-- Should return 40+ rows (6 roles × 7 features)
```

---

### **Step 3: Verify Migration** (Optional but Recommended)

**File:** `scripts/verify-doc-ai-integration.sql`

**In Supabase SQL Editor:**
```sql
-- Copy and paste verify-doc-ai-integration.sql
-- This runs comprehensive checks
```

**Expected output:**
- ✅ All tables present
- ✅ All columns added
- ✅ Storage buckets created
- ✅ Functions created
- ✅ Permissions seeded
- ✅ pgvector extension installed

---

## 🔧 TROUBLESHOOTING

### **Error: "relation 'profiles' does not exist"**

**Cause:** You tried to run `SUPABASE_AUTH_001_unify_schema.sql` BEFORE loading the Document AI backup

**Solution:**
1. Run `designr_backup.sql` first (Step 1)
2. Then run `SUPABASE_AUTH_001_unify_schema.sql` (Step 2)

---

### **Error: "type 'app_role' already exists"**

**Cause:** You're trying to re-run the migration

**Solution:** This is actually OK! The migration uses `IF NOT EXISTS` checks and will skip creating things that already exist.

---

### **Error: "column already exists"**

**Cause:** You're re-running the migration

**Solution:** Safe to ignore. The migration uses `ADD COLUMN IF NOT EXISTS` which won't error if column exists.

---

### **Error: "constraint already exists"**

**Cause:** Re-running migration

**Solution:** The migration checks for existing constraints before adding them. Safe to ignore.

---

## 📝 COMPLETE WORKFLOW

```bash
# 1. Open Supabase SQL Editor
# https://app.supabase.com/project/YOUR_PROJECT/sql

# 2. Create new query

# 3. Copy/paste designr_backup.sql
# Click "Run" button
# Wait for completion (may take 30-60 seconds)

# 4. Verify backup loaded:
SELECT COUNT(*) FROM profiles;
SELECT COUNT(*) FROM user_roles;

# 5. Create new query

# 6. Copy/paste SUPABASE_AUTH_001_unify_schema.sql
# Click "Run" button
# Wait for completion (10-20 seconds)

# 7. Verify migration succeeded:
SELECT column_name FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'phone';
-- Should return 'phone'

SELECT enumlabel FROM pg_enum WHERE enumtypid = 'app_role'::regtype;
-- Should return 6 roles

SELECT COUNT(*) FROM permissions;
-- Should return 40+ rows

# 8. Migration complete! ✅
```

---

## 🎯 AFTER MIGRATION

Once both migrations are complete:

1. **Install Supabase Auth packages:**
   ```bash
   npm install @supabase/auth-helpers-nextjs @supabase/supabase-js
   ```

2. **Run user migration script** (if you have existing Next-Auth users):
   ```bash
   DRY_RUN=true npx ts-node scripts/migrate-users-to-supabase-auth.ts
   ```

3. **Update API routes** using the template in `app/api/doc-ai-chat/route.supabase.ts`

4. **Test authentication flow**

---

## ✅ SUMMARY

**Correct Order:**
1. ✅ Load `designr_backup.sql` (creates base schema)
2. ✅ Run `SUPABASE_AUTH_001_unify_schema.sql` (extends schema)
3. ✅ Verify with `verify-doc-ai-integration.sql`
4. ✅ Migrate users (if needed)
5. ✅ Update code

**DO NOT:**
- ❌ Run SUPABASE_AUTH_001 before designr_backup
- ❌ Skip the backup file
- ❌ Run migrations in wrong order

---

**Ready to migrate?** Start with Step 1! 🚀
