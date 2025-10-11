# 🔍 Database Backup Analysis - designr_backup.sql

**Analysis Date:** 2025-10-02
**Source:** Document AI (Designalmostright) Production Database
**Authentication System:** Supabase Auth (`auth.users`)

---

## 🚨 CRITICAL FINDINGS

### **1. THIS IS A SUPABASE AUTH DATABASE, NOT NEXT-AUTH**

The backup uses **Supabase Auth** (`auth.users`), which is INCOMPATIBLE with the Next-Auth integration I created.

**Evidence:**
- All foreign keys reference `auth.users` (Supabase's auth table)
- Uses `auth.uid()` in RLS policies
- No `users` table in public schema - only `profiles` table extending `auth.users`
- Role system uses `user_roles` table with `app_role` enum

**Impact:**
- My migration scripts assumed Design-Rite v3 uses Next-Auth with a `public.users` table
- The backup shows Document AI is already using Supabase Auth standalone
- **This changes the entire integration strategy**

---

## 📊 EXISTING DOCUMENT AI SCHEMA (FROM BACKUP)

### **Tables Already Present:**

1. **`profiles`** (extends `auth.users`)
   - Columns: id, email, full_name, company, website, phone, address, city, state, zip_code, business_type, tax_id, token_usage, has_free_access, has_seen_subscription_page, granted_tier, stripe_customer_id, logo_url
   - **FK:** `profiles.id` → `auth.users.id` (ON DELETE CASCADE)

2. **`admin_settings`** ✅ Already exists
   - Columns: global_prompt, ai_model, chat_completions_url, api_key_encrypted, max_base_documents, max_pro_documents, max_enterprise_documents, price_base_cents, price_pro_cents, price_enterprise_cents, stripe_price_id_base, stripe_price_id_pro, stripe_price_id_enterprise, general_assistant_id, platform_assistant_id, platform_prompt, payment_required, stripe_webhook_endpoint, temperature, max_tokens

3. **`user_themes`** ✅ Already exists
   - Columns: id, user_id, logo_url, primary_color, secondary_color, accent_color, text_color, background_color_light, background_color_dark

4. **`chat_conversations`** ✅ Already exists
   - Columns: id, user_id, title, company_name, assessment_type, priority_score, priority_level, conversation_summary, assessment_data
   - **FK:** `user_id` → `auth.users.id` (ON DELETE CASCADE)

5. **`chat_messages`** ✅ Already exists
   - Columns: id, conversation_id, user_id, role, content, created_at
   - **FK:** `user_id` → `auth.users.id` (ON DELETE CASCADE)

6. **`user_documents`** ✅ Already exists
   - Columns: id, user_id, filename, file_path, file_size, mime_type, extracted_text
   - **FK:** `user_id` → `auth.users.id` (ON DELETE CASCADE)

7. **`new_document_chunks`** ✅ Already exists (uses `vector(1536)`)
   - Columns: id, document_id, chunk_text, chunk_index, embedding, metadata
   - Uses pgvector extension

8. **`generated_documents`** ✅ Already exists
   - See below for full schema

9. **`global_ai_documents`** ✅ Already exists
   - Columns: id, filename, file_path, file_size, mime_type, content, created_at, updated_at, uploaded_by

10. **`global_documents`** ✅ Already exists (duplicate?)
    - Appears to be similar to global_ai_documents

11. **`document_processing_queue`** ✅ Already exists
    - Columns: id, user_id, document_id, status, error_message, created_at, processed_at

12. **`user_roles`** (Role system)
    - Columns: id, user_id, role (enum: admin, moderator, user)
    - **FK:** `user_id` → `auth.users.id` (ON DELETE CASCADE)

13. **`user_subscriptions`**
    - Columns: id, user_id, stripe_subscription_id, stripe_customer_id, plan_name, status, current_period_start, current_period_end, cancel_at_period_end

14. **`invite_tokens`**
    - Columns: id, token, target_role, subscription_tier, max_uses, uses, expires_at, created_by

### **Storage Buckets:**
- Not visible in SQL backup (created separately via Supabase storage API)

### **Extensions:**
- ✅ `vector` - pgvector extension already installed
- ✅ `pg_cron` - Cron job scheduler
- ✅ `pg_net` - HTTP client
- ✅ `wrappers` - Foreign data wrappers
- ✅ Stripe FDW schemas: `stripe_schema1`, `stripe_schema2`, `stripe_schema4`

---

## 🔄 SCHEMA COMPARISON: Document AI vs My Migrations

| Table | In Backup | In My Migration | Status |
|-------|-----------|-----------------|--------|
| `users` (public) | ❌ No | ✅ Yes | **CONFLICT** - Backup uses `auth.users` |
| `profiles` | ✅ Yes | ❌ No | **CONFLICT** - My migration extends `users` |
| `admin_settings` | ✅ Yes | ✅ Yes | ✅ Compatible (same structure) |
| `user_themes` | ✅ Yes | ✅ Yes | ✅ Compatible |
| `chat_conversations` | ✅ Yes | ✅ Yes | ✅ Compatible |
| `chat_messages` | ✅ Yes | ✅ Yes | ✅ Compatible |
| `user_documents` | ✅ Yes | ✅ Yes | ✅ Compatible |
| `document_chunks` | ✅ Yes (`new_document_chunks`) | ✅ Yes | ⚠️ Name differs |
| `generated_documents` | ✅ Yes | ✅ Yes | ✅ Compatible |
| `global_documents` | ✅ Yes (+ `global_ai_documents`) | ✅ Yes | ⚠️ Duplicate tables? |
| `document_processing_queue` | ✅ Yes | ✅ Yes | ✅ Compatible |
| `activity_logs` | ❌ No | ✅ Yes | Need to add |
| `permissions` | ❌ No | ✅ Yes | Need to add |
| `user_sessions` | ❌ No | ✅ Yes | Need to add |

---

## 🚨 KEY CONFLICTS

### **1. Authentication System Mismatch**

**Backup (Document AI):**
- Uses Supabase Auth (`auth.users` table managed by Supabase)
- All user data stored in `profiles` table extending `auth.users`
- RLS policies use `auth.uid()` function
- User roles stored in separate `user_roles` table

**My Migrations (Designed for Next-Auth):**
- Assumes Design-Rite v3 uses Next-Auth
- Extends `public.users` table (not `profiles`)
- Uses JWT sessions, not Supabase Auth
- Role stored as column in `users` table

**Resolution Required:**
- **Option A:** Keep Supabase Auth, don't integrate with Design-Rite Next-Auth (separate platform)
- **Option B:** Migrate Document AI from Supabase Auth to Next-Auth (complex, requires user password reset)
- **Option C:** Run both auth systems in parallel (dual login)

### **2. User Data Table**

**Conflict:**
- Backup has `profiles` table (extends `auth.users`)
- My migration adds columns to `users` table (doesn't exist in backup)

**Impact:**
- All my API routes reference `users` table, but backup uses `profiles`
- Need to change all queries from `users` → `profiles`

### **3. Document Chunks Table Name**

**Backup:** `new_document_chunks`
**My Migration:** `document_chunks`

**Resolution:** Use `new_document_chunks` to match existing schema

### **4. Role System**

**Backup:**
- Enum: `app_role` (admin, moderator, user)
- Stored in separate `user_roles` table
- Function: `has_role(user_id, role)`

**My Migration:**
- Role stored as column in `users` table
- 5-tier system: super_admin, admin, manager, user, guest

**Resolution:** Need to map between systems or unify

---

## 📋 GENERATED_DOCUMENTS SCHEMA (FROM BACKUP)

```sql
CREATE TABLE IF NOT EXISTS "public"."generated_documents" (
    "id" uuid DEFAULT gen_random_uuid() NOT NULL,
    "user_id" uuid NOT NULL,  -- FK to auth.users
    "document_type" text NOT NULL,
    "title" text NOT NULL,
    "content" text NOT NULL,
    "created_at" timestamp with time zone DEFAULT now() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
    "client_name" text,
    "file_url" text,
    "conversation_id" uuid,  -- FK to chat_conversations
    "document_category" text DEFAULT 'general'::text
);
```

**Compatible with my migration:** ✅ Yes (same structure)

---

## 🎯 WHAT THIS MEANS FOR INTEGRATION

### **Scenario 1: Document AI Already Deployed Separately**

If this backup represents a **separate Document AI instance** (not integrated with Design-Rite):

**Best Approach:**
1. Keep Document AI as standalone Supabase Auth application
2. Don't merge with Design-Rite v3's Next-Auth system
3. My API routes can work with minimal changes:
   - Change `users` → `profiles`
   - Keep `auth.uid()` authentication
   - No need for Next-Auth integration

**Pros:**
- Minimal changes to existing Document AI
- No user migration needed
- Faster deployment

**Cons:**
- Two separate authentication systems
- Users need separate logins for Design-Rite vs Document AI

### **Scenario 2: Merge Into Design-Rite v3**

If goal is to **unify both platforms** under single Next-Auth:

**Required Work:**
1. Migrate Document AI from Supabase Auth → Next-Auth
2. Create `users` table in Design-Rite with Document AI columns
3. Migrate `profiles` data → `users` table
4. Update all RLS policies to use `public.users` instead of `auth.users`
5. Force password reset for all users (Supabase passwords can't be migrated)
6. Update all API routes to use Next-Auth sessions

**Pros:**
- Single authentication system
- Unified user management
- Consistent permission system

**Cons:**
- Major migration effort (2-3 days work)
- All users lose sessions, need password reset
- Higher risk of breaking existing Document AI

---

## 🔧 RECOMMENDED NEXT STEPS

**I need clarification on the goal:**

### **Question 1: Is this backup from a separate Document AI deployment?**
- If YES → Keep Supabase Auth, minimal changes needed
- If NO → Need unified auth strategy

### **Question 2: Does Design-Rite v3 production use Next-Auth or Supabase Auth?**
- If **Next-Auth** → Need full migration from Supabase Auth
- If **Supabase Auth** → My migrations were based on wrong assumption

### **Question 3: What's the desired end state?**
- **Option A:** Two separate platforms (Document AI + Design-Rite) with separate logins
- **Option B:** Fully integrated platform with single authentication system
- **Option C:** Document AI features embedded in Design-Rite (what I assumed)

---

## 📝 MIGRATION SCRIPT ADJUSTMENTS NEEDED

### **If Keeping Supabase Auth (Scenario 1):**

1. **Update API Routes:**
   - Change all `users` → `profiles`
   - Change `getServerSession(authOptions)` → `supabase.auth.getUser()`
   - Use `auth.uid()` instead of `session.user.id`

2. **Skip These Migrations:**
   - `001_unified_auth_schema.sql` (extends users table - doesn't exist)
   - Skip `users` table modifications

3. **Run These Migrations:**
   - `002_add_doc_ai_tables.sql` - ✅ Safe (admin_settings, user_themes already compatible)
   - `003_create_storage_buckets.sql` - ✅ Safe

4. **Add Missing Tables:**
   - `activity_logs` (for audit trail)
   - `permissions` (for Design-Rite integration)

### **If Migrating to Next-Auth (Scenario 2):**

1. **Create Migration:**
   - Create `public.users` table
   - Copy data from `profiles` → `users`
   - Update all FKs from `auth.users` → `public.users`
   - Update all RLS policies
   - Update all functions

2. **User Migration:**
   - Force password reset for all users
   - Update authentication flows

3. **Estimated Time:** 2-3 days of development + testing

---

## ✅ WHAT'S WORKING (Good News!)

These tables/features are **100% compatible** between backup and my migrations:
- ✅ `admin_settings` - Same structure
- ✅ `user_themes` - Same structure
- ✅ `chat_conversations` - Same structure
- ✅ `chat_messages` - Same structure
- ✅ `generated_documents` - Same structure
- ✅ `document_processing_queue` - Same structure
- ✅ pgvector extension - Already installed
- ✅ Stripe integration - Already configured

**Only blocker is the authentication system difference.**

---

## 🎯 ACTION REQUIRED

**Please clarify:**

1. Is this backup from a **separate Document AI deployment** or is it already integrated with Design-Rite v3?

2. Does **Design-Rite v3 production** use:
   - [ ] Next-Auth (my assumption)
   - [ ] Supabase Auth (what backup shows)

3. What's the desired integration approach:
   - [ ] Keep separate (Document AI stays Supabase Auth, Design-Rite stays Next-Auth)
   - [ ] Fully merge (migrate everything to one auth system)

Once confirmed, I'll adjust the migration scripts accordingly.

---

**Status:** ⚠️ Awaiting Clarification
**Last Updated:** 2025-10-02
