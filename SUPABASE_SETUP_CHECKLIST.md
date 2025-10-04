# Supabase Setup Checklist - Design-Rite Platform

**Supabase Project:** aeorianxnxpxveoxzhov.supabase.co
**Dashboard:** https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov

---

## 📋 Tables to Create (If Not Already Done)

### 1. Creative Studio Tables ✅

**Open Supabase SQL Editor:**
https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/sql/new

**Run this SQL file:**
`design-rite-creative-studio/supabase/creative_studio_tables.sql`

**Tables created:**
- ✅ `creative_projects` - Content generation projects
- ✅ `creative_assets` - Uploaded/generated assets
- ✅ `creative_templates` - Reusable templates (with 3 sample templates)
- ✅ `creative_generations` - AI generation tracking

**Storage bucket:**
- ✅ `creative-assets` (public, 10MB limit)

**To verify:**
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'creative%';

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'creative-assets';
```

---

### 2. Spatial Studio Tables ✅

**Run this SQL file:**
`design-rite-spatial-studio/supabase/spatial_studio_tables.sql`

**Tables created:**
- ✅ `spatial_projects` - 3D floor plan projects
- ✅ `site_annotations` - Site walk annotations
- ✅ `ai_device_suggestions` - AI placement recommendations
- ✅ `site_walk_sessions` - Field visit tracking
- ✅ `ai_analysis_debug` - OpenAI API debug logging
- ✅ `spatial_studio_uploads` - File upload tracking
- ✅ `spatial_studio_extractions` - Extracted equipment data

**Storage bucket:**
- ✅ `spatial-floorplans` (public, 10MB limit)

**To verify:**
```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'spatial%' OR table_name LIKE 'site%' OR table_name LIKE 'ai_%';

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'spatial-floorplans';
```

---

### 3. Existing Design-Rite v3 Tables (Should Already Exist)

These were created during previous development:

**Authentication & Users:**
- ✅ `users` - User accounts
- ✅ `user_roles` - Role-based access control
- ✅ `user_sessions` - Active sessions
- ✅ `activity_logs` - Audit trail
- ✅ `permissions` - Feature permissions
- ✅ `usage_tracking` - Rate limiting

**Demo Bookings:**
- ✅ `demo_bookings` - Calendly integration

**Products:**
- ✅ `products` - Security products catalog (3,000+ items)
- ✅ `manufacturers` - Manufacturer data
- ✅ (Other product-related tables)

**To verify all tables:**
```sql
SELECT table_name, table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

---

## 🔐 Environment Variables

### Current Supabase Credentials

From your Supabase dashboard settings:
https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/settings/api

**Project URL:**
```
NEXT_PUBLIC_SUPABASE_URL=https://aeorianxnxpxveoxzhov.supabase.co
```

**Anon (Public) Key:**
```
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlb3JpYW54bnhweHZlb3h6aG92Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxNzczMjksImV4cCI6MjA3NDc1MzMyOX0.Ko6tdjeM-6D9WM8qnJZkU8ep8Av2Q-N9dp3hPXnOPT0
```

**Service Role Key (Server-side only - KEEP SECRET):**
```
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlb3JpYW54bnhweHZlb3h6aG92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE3NzMyOSwiZXhwIjoyMDc0NzUzMzI5fQ.qKUYyhUVZZpKKHXH-6-WCedEhlSbXIhuwk52ofXQqpk
```

**Alternative name (same value):**
```
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFlb3JpYW54bnhweHZlb3h6aG92Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTE3NzMyOSwiZXhwIjoyMDc0NzUzMzI5fQ.qKUYyhUVZZpKKHXH-6-WCedEhlSbXIhuwk52ofXQqpk
```

---

### All Environment Variables for Each Service

#### Design-Rite v3 (Main App) - Port 3010

**File:** `design-rite-v3/.env.local`

**Required Variables:**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://aeorianxnxpxveoxzhov.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...

# AI APIs
ANTHROPIC_API_KEY=sk-ant-api03-...
OPENAI_API_KEY=sk-proj-eNFCtLC6...

# Google/YouTube
YOUTUBE_API_KEY=AIzaSyCChskF...
GOOGLE_API_KEY=AIzaSyCChskF...
GEMINI_API_KEY=AIzaSyAbUiFlC...

# OpenAI Assistants
CREATIVE_ASSISTANT_ID=asst_ybxoe2JxhEOobS84D7VnCGJj
ASSESSMENT_ASSISTANT_ID=asst_k6HbBQBgNG3p04jxkbqUtplv
GENERAL_ASSISTANT_ID=asst_k6HbBQBgNG3p04jxkbqUtplv
CREATIVE-WRITING_ASSISTANT_ID=asst_ybxoe2JxhEOobS84D7VnCGJj

# Stripe (Test Mode)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51RdsmyP3...
STRIPE_SECRET_KEY=sk_test_51RdsmyP3...
STRIPE_WEBHOOK_SECRET=whsec_use_stripe_cli_for_local_testing

# Stripe Prices
NEXT_PUBLIC_STRIPE_PRICE_STARTER=price_1SDxmzP3RpKr1IEK1ZVKqe30
NEXT_PUBLIC_STRIPE_PRICE_PROFESSIONAL=price_1SDxmgP3RpKr1IEKLo2fIn7C
NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE=price_1SDxlYP3RpKr1IEKMjNlg4SK

# URLs
NEXT_PUBLIC_BASE_URL=http://localhost:3010
NEXT_PUBLIC_PRODUCTION_URL=https://design-rite-v3.onrender.com
NEXT_PUBLIC_SITE_URL=https://design-rite-v3.onrender.com
NEXT_PUBLIC_BACKEND_URL=https://design-rite-backend.onrender.com
BACKEND_URL=https://design-rite-backend.onrender.com

# Microservices
NEXT_PUBLIC_SPATIAL_STUDIO_URL=http://localhost:3020
NEXT_PUBLIC_CREATIVE_STUDIO_URL=http://localhost:3030

# Harvester/Insight Studio
NEXT_PUBLIC_HARVESTER_API_URL=http://localhost:8000
HARVESTER_API_URL=http://localhost:8000
```

---

#### Spatial Studio - Port 3020

**File:** `design-rite-spatial-studio/.env.local`

**Required Variables:**
```bash
# Supabase (SHARED with Design-Rite v3)
NEXT_PUBLIC_SUPABASE_URL=https://aeorianxnxpxveoxzhov.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...

# OpenAI
OPENAI_API_KEY=sk-proj-eNFCtLC6...

# Service Configuration
NEXT_PUBLIC_SERVICE_NAME=spatial-studio
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3010
```

---

#### Creative Studio - Port 3030

**File:** `design-rite-creative-studio/.env.local`

**Required Variables:**
```bash
# Supabase (SHARED with Design-Rite v3)
NEXT_PUBLIC_SUPABASE_URL=https://aeorianxnxpxveoxzhov.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...

# OpenAI
OPENAI_API_KEY=sk-proj-eNFCtLC6...

# Creative Studio Specific
CREATIVE_ASSISTANT_ID=asst_ybxoe2JxhEOobS84D7VnCGJj

# Service Configuration
NEXT_PUBLIC_SERVICE_NAME=creative-studio
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3010
```

---

## 🚀 Render Deployment Configuration

### Current Render Setup

**File:** `design-rite-v3/render.yaml`

**Check what needs to be added for microservices:**

1. **Design-Rite v3 (Main App)** - Already configured
2. **Spatial Studio** - Needs separate Render service
3. **Creative Studio** - Needs separate Render service

---

### Recommended Render Configuration

**Option 1: Separate Services (Recommended)**

Create 3 separate services in Render:

**Service 1: design-rite-v3**
- Name: `design-rite-v3`
- Type: Web Service
- Build Command: `npm install && npm run build`
- Start Command: `npm start`
- Environment: Node 18+
- Port: Auto-detected (Next.js default 3000)

**Service 2: design-rite-spatial-studio**
- Name: `design-rite-spatial-studio`
- Type: Web Service
- Build Command: `cd design-rite-spatial-studio && npm install && npm run build`
- Start Command: `cd design-rite-spatial-studio && npm start`
- Port: 3020

**Service 3: design-rite-creative-studio**
- Name: `design-rite-creative-studio`
- Type: Web Service
- Build Command: `cd design-rite-creative-studio && npm install && npm run build`
- Start Command: `cd design-rite-creative-studio && npm start`
- Port: 3030

---

### Environment Variables for Render

**For each service, add these in Render Dashboard:**

**design-rite-v3:**
```
NEXT_PUBLIC_SUPABASE_URL=https://aeorianxnxpxveoxzhov.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
OPENAI_API_KEY=sk-proj-eNFCtLC6...
ANTHROPIC_API_KEY=sk-ant-api03-...
NEXT_PUBLIC_SPATIAL_STUDIO_URL=https://design-rite-spatial-studio.onrender.com
NEXT_PUBLIC_CREATIVE_STUDIO_URL=https://design-rite-creative-studio.onrender.com
NEXT_PUBLIC_SITE_URL=https://design-rite-v3.onrender.com
```

**design-rite-spatial-studio:**
```
NEXT_PUBLIC_SUPABASE_URL=https://aeorianxnxpxveoxzhov.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...
OPENAI_API_KEY=sk-proj-eNFCtLC6...
NEXT_PUBLIC_SERVICE_NAME=spatial-studio
NEXT_PUBLIC_MAIN_APP_URL=https://design-rite-v3.onrender.com
```

**design-rite-creative-studio:**
```
NEXT_PUBLIC_SUPABASE_URL=https://aeorianxnxpxveoxzhov.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_KEY=eyJhbGci...
OPENAI_API_KEY=sk-proj-eNFCtLC6...
CREATIVE_ASSISTANT_ID=asst_ybxoe2JxhEOobS84D7VnCGJj
NEXT_PUBLIC_SERVICE_NAME=creative-studio
NEXT_PUBLIC_MAIN_APP_URL=https://design-rite-v3.onrender.com
```

---

## ✅ Setup Checklist

### Step 1: Supabase Database Setup

- [ ] 1.1. Open Supabase SQL Editor
- [ ] 1.2. Run `creative_studio_tables.sql`
- [ ] 1.3. Run `spatial_studio_tables.sql`
- [ ] 1.4. Verify all tables exist (run verification queries above)
- [ ] 1.5. Verify storage buckets exist (`creative-assets`, `spatial-floorplans`)

---

### Step 2: Local Environment Setup

- [ ] 2.1. Update `design-rite-v3/.env.local` with all variables
- [ ] 2.2. Update `design-rite-spatial-studio/.env.local`
- [ ] 2.3. Update `design-rite-creative-studio/.env.local`
- [ ] 2.4. Test each service locally:
  - [ ] v3: http://localhost:3010
  - [ ] Spatial Studio: http://localhost:3020
  - [ ] Creative Studio: http://localhost:3030

---

### Step 3: Render Deployment

**Current Status:**
- ✅ Design-Rite v3 is deployed (https://design-rite-v3.onrender.com)
- ❓ Spatial Studio - Need to create separate service
- ❓ Creative Studio - Need to create separate service

**Action Required:**

**Option A: Deploy as Separate Services (Recommended)**
- [ ] 3.1. Create new Render service for Spatial Studio
- [ ] 3.2. Create new Render service for Creative Studio
- [ ] 3.3. Add environment variables to each service
- [ ] 3.4. Deploy and test

**Option B: Deploy as Monorepo (Alternative)**
- [ ] 3.1. Update `render.yaml` to include all 3 services
- [ ] 3.2. Configure build/start commands for each
- [ ] 3.3. Deploy and test

---

## 🔍 Verification Commands

### Check Supabase Tables

```sql
-- List all tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- Check Creative Studio tables
SELECT COUNT(*) FROM creative_projects;
SELECT COUNT(*) FROM creative_templates; -- Should have 3 sample templates

-- Check Spatial Studio tables
SELECT COUNT(*) FROM spatial_projects;
SELECT COUNT(*) FROM ai_analysis_debug;

-- Check storage buckets
SELECT id, name, public, file_size_limit
FROM storage.buckets
WHERE id IN ('creative-assets', 'spatial-floorplans');
```

---

### Test API Connections

```bash
# Test v3 API
curl http://localhost:3010/api/health

# Test Spatial Studio API
curl http://localhost:3020/api/spatial-studio/health

# Test Creative Studio API
curl http://localhost:3030/api/health
```

---

## 📊 What's Different for Microservices

### Shared Resources
✅ **Supabase Database** - All services use same database (aeorianxnxpxveoxzhov)
✅ **Authentication** - Shared auth tokens across all services
✅ **Environment Variables** - Same Supabase credentials

### Isolated Resources
🔸 **Tables** - Each service has its own tables (prefixed: `creative_*`, `spatial_*`)
🔸 **Storage Buckets** - Separate buckets per service
🔸 **OpenAI Assistants** - Different assistant IDs per service
🔸 **Ports** - Different ports (3010, 3020, 3030)

---

## 🚨 Important Notes

### Security
- ⚠️ **NEVER commit** `.env.local` files to git
- ⚠️ **Service Role Key** should ONLY be in server-side code (never client-side)
- ⚠️ **API Keys** should be in Render environment variables, not code

### Render Deployment
- If microservices are NOT deployed yet, you need to:
  1. Create separate Render services for Spatial Studio and Creative Studio
  2. Add environment variables in Render Dashboard
  3. Update v3 `.env.local` with production URLs

### Database
- RLS (Row Level Security) is enabled on all tables
- Users can only access their own data
- Service role key bypasses RLS (use carefully)

---

## 📞 Quick Reference

**Supabase Dashboard:**
https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov

**SQL Editor:**
https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/sql/new

**API Settings:**
https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/settings/api

**Storage:**
https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/storage/buckets

**Render Dashboard:**
https://dashboard.render.com

---

**Status:** Ready to deploy microservices to Render! ✅

*Last Updated: October 3, 2025*
