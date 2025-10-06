# Supabase Staging Project Setup

**Project**: Design-Rite Validation Lab
**Date**: 2025-10-06

---

## 🎯 **Step-by-Step Setup**

### Step 1: Create New Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in details:
   - **Name**: Design-Rite Staging
   - **Database Password**: [Generate strong password]
   - **Region**: Same as production (East US)
   - **Pricing Plan**: Pro (same as production)
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

### Step 2: Note Staging Credentials

Save these to your password manager:

```
Project URL: https://[project-ref].supabase.co
Project Ref: [copy from dashboard]
API URL: https://[project-ref].supabase.co
Anon Key: [copy from Settings → API]
Service Role Key: [copy from Settings → API]
Database Password: [the one you generated]
```

---

## 🔄 **Clone Production Schema**

### Option 1: Using SQL Backup (RECOMMENDED)

1. **Export from Production:**
   - We already have: `C:\Users\dkozi\Downloads\designr_backup_final_v2.sql`
   - This is the cleaned backup without FDW/Stripe foreign tables

2. **Import to Staging:**
   ```sql
   -- In Supabase SQL Editor for STAGING project
   -- Paste contents of designr_backup_final_v2.sql
   -- Click "Run"
   ```

3. **Verify Tables Created:**
   ```sql
   SELECT table_name
   FROM information_schema.tables
   WHERE table_schema = 'public'
   ORDER BY table_name;

   -- Should return 20+ tables:
   -- admin_settings, profiles, subscriptions, etc.
   ```

### Option 2: Using Supabase CLI (Alternative)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to production project
supabase link --project-ref ickwrbdpuorzdpzqbqpf

# Generate migration from production
supabase db diff --schema public > migrations/staging_init.sql

# Apply to staging project
supabase db push --db-url "postgresql://postgres:[password]@db.[staging-ref].supabase.co:5432/postgres"
```

---

## 🗄️ **Load Test Data**

### Anonymize Production Data

```bash
# Run anonymization script
./scripts/sync-staging-db.sh

# What it does:
# 1. Dumps production database
# 2. Replaces sensitive data:
#    - Emails: real@email.com → test1@example.com
#    - Names: Real Name → Test User 1
#    - Phone numbers: xxx-xxx-xxxx → 555-555-0001
# 3. Loads into staging database
```

### Manual Test Data (Alternative)

```sql
-- Create test user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  'test@design-rite.com',
  crypt('Localtestingonly2025', gen_salt('bf')),
  now(),
  now(),
  now()
);

-- Create test profile
INSERT INTO profiles (id, email, full_name, company)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'test@design-rite.com'),
  'test@design-rite.com',
  'Test User',
  'Test Company Inc'
);

-- Create test subscription (Pro tier)
INSERT INTO subscriptions (user_id, tier, status, stripe_subscription_id)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'test@design-rite.com'),
  'pro',
  'active',
  'sub_test_12345'
);
```

---

## 🔐 **Configure Authentication**

### Enable Email Auth

1. Go to **Authentication → Providers**
2. Enable **Email** provider
3. Configure email templates:
   - Confirmation email
   - Reset password email
   - Magic link email

### Email Settings

```
SMTP Settings (Same as Production):
- Host: [your SMTP host]
- Port: 587
- Username: [your SMTP username]
- Password: [your SMTP password]
- From: noreply@design-rite.com
```

### Site URL

```
Site URL: https://design-rite-staging.onrender.com
Redirect URLs:
  - https://design-rite-staging.onrender.com/auth/callback
  - https://design-rite-staging.onrender.com/api/auth/callback
```

---

## 🛡️ **Row Level Security (RLS)**

### Verify RLS Policies

```sql
-- Check RLS is enabled on all tables
SELECT
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = false;

-- Should return 0 rows (all tables should have RLS enabled)
```

### Test RLS Policies

```sql
-- Test as authenticated user
SET request.jwt.claims = '{"sub": "test-user-id", "role": "authenticated"}';

-- Try to query profiles (should only see own data)
SELECT * FROM profiles WHERE id = 'test-user-id';
-- Should succeed

SELECT * FROM profiles WHERE id != 'test-user-id';
-- Should return 0 rows (can't see other users)
```

---

## 🔗 **Storage Buckets**

### Create Buckets

```sql
-- Create storage buckets (if not in schema backup)
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('avatars', 'avatars', true),
  ('documents', 'documents', false),
  ('spatial-floorplans', 'spatial-floorplans', false);
```

### Configure Storage Policies

```sql
-- Allow users to upload their own avatars
CREATE POLICY "Users can upload own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own documents
CREATE POLICY "Users can read own documents"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## 👥 **Team Access**

### Add Team Members

1. Go to **Settings → Team**
2. Click **"Invite"**
3. Add team members:

**Phil Lisk**
- Email: [Phil's email]
- Role: Admin

**Nicholas Munn**
- Email: munnymancom@gmail.com
- Role: Admin

---

## 📊 **Monitoring & Logs**

### Enable Logging

1. Go to **Logs → Settings**
2. Enable all log types:
   - API logs
   - PostgreSQL logs
   - Realtime logs
   - Storage logs

### Set Up Alerts

1. Go to **Settings → Alerts**
2. Configure alerts:
   - High database CPU (> 80%)
   - Storage full (> 90%)
   - API errors (> 10 per minute)

**Alert Destinations:**
- Email: [Dan's email]
- Email: [Phil's email]
- Email: munnymancom@gmail.com

---

## 🔧 **Environment Variables for Render**

After Supabase staging is set up, update Render staging service with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://[staging-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[staging-anon-key]
SUPABASE_SERVICE_KEY=[staging-service-role-key]

# Database Connection (for direct access if needed)
DATABASE_URL=postgresql://postgres:[password]@db.[staging-ref].supabase.co:5432/postgres

# OpenAI (use production key for now)
OPENAI_API_KEY=[same as production]

# Stripe (use test keys for staging)
STRIPE_SECRET_KEY=[stripe-test-secret-key]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[stripe-test-publishable-key]

# Environment Flag
NODE_ENV=staging
NEXT_PUBLIC_ENVIRONMENT=staging
```

---

## ✅ **Verification Checklist**

After setup, verify everything works:

- [ ] Project created and provisioned
- [ ] Schema imported (20+ tables)
- [ ] Test data loaded
- [ ] RLS policies enabled
- [ ] Storage buckets created
- [ ] Authentication configured
- [ ] Team members invited
- [ ] Monitoring enabled
- [ ] Environment variables documented

---

## 🚨 **Troubleshooting**

### Schema Import Fails

**Problem**: Foreign key constraint errors
**Solution**: Import tables in correct order, or disable constraints temporarily:
```sql
SET session_replication_role = 'replica';
-- Run import
SET session_replication_role = 'origin';
```

### RLS Policies Too Strict

**Problem**: Can't query data even with correct permissions
**Solution**: Temporarily disable RLS for debugging:
```sql
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
-- Debug issue
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

### Storage Bucket Access Denied

**Problem**: Can't upload files to storage
**Solution**: Check bucket policies and CORS settings:
```sql
-- Check existing policies
SELECT * FROM storage.policies WHERE bucket_id = 'documents';

-- Verify CORS settings in Supabase dashboard
```

---

## 📝 **Next Steps**

After Supabase staging setup:
1. ✅ Supabase staging project created
2. ⏭️ Create Render staging service (see RENDER_STAGING_SETUP.md)
3. ⏭️ Configure environment variables
4. ⏭️ Test deployment
5. ⏭️ Set up daily database sync

---

**Setup Completed**: _______________
**Verified By**: _______________
**Date**: _______________
