# 📊 Document AI Platform - Migration Analysis
## Designalmostright Repository Analysis

**Repository:** https://github.com/MunnymanCommunications/Designalmostright
**Analysis Date:** 2025-10-02
**Integration Target:** Design-Rite v3 (Unified Auth Schema)

---

## 🏗️ Document AI Platform Architecture

### **Tech Stack:**
- **Frontend:** React 18 + Vite + TypeScript
- **UI Components:** Radix UI + Tailwind CSS + shadcn/ui
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions)
- **AI Integration:** OpenAI API (GPT-4o-mini, Assistants API v2)
- **PDF Processing:** jsPDF, html2canvas, pdfjs-dist
- **Routing:** React Router DOM v6
- **State Management:** TanStack React Query + Contexts

### **Authentication:**
- **System:** Supabase Auth (JWT tokens)
- **Provider:** Email/Password (no OAuth providers)
- **Session Storage:** localStorage via Supabase client
- **User Table:** `auth.users` (Supabase managed) + `profiles` table (custom)

---

## 🗄️ Database Schema Analysis

### **Key Differences from Design-Rite v3:**

| Feature | Document AI | Design-Rite v3 | Action Required |
|---------|-------------|----------------|-----------------|
| **Auth System** | Supabase Auth (`auth.users`) | Next-Auth + custom `users` table | ✅ **Unified Schema Created** |
| **User Profiles** | `profiles` table (extends `auth.users`) | `users` table (standalone) | ✅ **Merged into users table** |
| **Roles** | No role system (all users equal) | 5-tier role system | ⚠️ **Design-Rite system wins** |
| **Subscriptions** | Stripe + `granted_tier` in profiles | None yet | ✅ **Already planned in unified schema** |
| **Permissions** | None (feature access based on subscription) | Granular permissions table | ✅ **Design-Rite system wins** |
| **Rate Limiting** | `assessment_usage` table only | `usage_tracking` + `permissions` | ✅ **Design-Rite system wins** |
| **Activity Logs** | None | Comprehensive audit trail | ✅ **Design-Rite system wins** |

### **Tables in Document AI (Not in Design-Rite):**

1. **`profiles`** (user extended data)
   - ✅ **MERGED** → Fields added to Design-Rite `users` table
   - Columns: `full_name`, `email`, `company`, `business_type`, `logo_url`, `stripe_customer_id`, `token_usage`

2. **`user_themes`** (UI customization)
   - ✅ **KEEP SEPARATE** → White-label branding feature
   - Columns: `logo_url`, `primary_color`, `secondary_color`, `accent_color`, `text_color`
   - Action: Migrate to Design-Rite with FK to `users` table

3. **`chat_conversations`** (AI chat sessions)
   - ✅ **ALREADY CREATED** in unified schema migration
   - No changes needed

4. **`chat_messages`** (chat history)
   - ✅ **ALREADY CREATED** in unified schema migration
   - No changes needed

5. **`assessment_usage`** (rate limiting for AI assessments)
   - ⚠️ **SUPERSEDED** by Design-Rite `usage_tracking` table
   - Action: Migrate existing data to `usage_tracking` with feature='ai_assessments'

6. **`admin_settings`** (global AI configuration)
   - 🔄 **EVALUATE** → Useful for centralizing OpenAI API keys
   - Columns: `global_prompt`, `general_assistant_id`, `ai_model`, `api_key_encrypted`
   - Action: Create in Design-Rite for AI config management

7. **`user_documents`**, **`global_ai_documents`** (document storage)
   - ✅ **ALREADY CREATED** in unified schema migration
   - No changes needed

---

## 🔌 Supabase Edge Functions Inventory

### **Functions to Migrate:**

#### 1. **`ai-chat`** (330 lines) ⭐ PRIORITY 1
**Purpose:** Main AI chat endpoint with document context
**Dependencies:**
- `admin_settings` table (API key storage)
- `profiles` table (user info)
- `user_documents` table (user uploads)
- `global_ai_documents` table (shared knowledge)
- `chat_conversations` table (priority scoring)

**Current Flow:**
```typescript
1. Extract JWT from Authorization header → supabase.auth.getUser()
2. Fetch admin_settings for OpenAI API key + assistant ID
3. Fetch user documents + global documents
4. Build context from documents (keyword matching)
5. If ASSISTANT_ID exists → Use Assistants API v2
6. Else → Use chat completions API
7. Extract priority score from response
8. Update chat_conversations with priority
9. Return JSON response
```

**Migration Strategy:**
```typescript
// BEFORE (Supabase Auth)
const authHeader = req.headers.get('Authorization');
const { data: { user } } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));

// AFTER (Next-Auth API Route)
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }
  const userId = session.user.id;

  // Change profiles → users table reference
  const { data: user } = await supabase
    .from('users')  // Was: 'profiles'
    .select('full_name, email, company')
    .eq('id', userId)
    .single();
}
```

#### 2. **`create-checkout-session`** (Stripe billing) ⭐ PRIORITY 2
**Purpose:** Create Stripe checkout sessions for Pro/Enterprise subscriptions
**Dependencies:** Stripe API, `profiles` table

**Migration:** Straightforward - just update table references
```typescript
// Change: profiles → users
// Add: subscription_tier, subscription_status updates
```

#### 3. **`stripe-webhooks`** (Payment processing) ⭐ PRIORITY 2
**Purpose:** Handle Stripe events (payment success, subscription canceled, etc.)
**Dependencies:** Stripe API, `profiles` table

**Migration:** Update to write to `users` table columns
```typescript
// Old: Update profiles.granted_tier
// New: Update users.subscription_tier + subscription_status
```

#### 4. **`generate-document`** (PDF generation) ⭐ PRIORITY 3
**Purpose:** Generate PDF invoices/proposals with company branding
**Dependencies:** `profiles` table (logo, company info), `generated_documents` table

**Migration:** Update table references
```typescript
// Change: profiles → users for branding data
```

#### 5. **`delete-user-document`** (Document cleanup) 🔄 OPTIONAL
**Purpose:** Cascade delete user documents from storage + database
**Dependencies:** `user_documents` table, storage buckets

**Migration:** Already compatible - just update Supabase client

#### 6. **`delete-helpful-document`** (Admin document management) 🔄 OPTIONAL
**Purpose:** Admin deletion of global documents
**Dependencies:** `helpful_documents` table

**Migration:** Add admin role check via Design-Rite permissions

---

## 🔄 Migration Path: Supabase Auth → Next-Auth

### **Challenge:** Document AI uses Supabase Auth, Design-Rite uses Next-Auth

### **Solution:** Adapter Pattern

**Option A: Refactor Edge Functions to Next.js API Routes** (RECOMMENDED)
```
Benefits:
✅ Native Next-Auth integration
✅ TypeScript type safety
✅ Unified codebase
✅ Easier debugging

Drawbacks:
❌ More code to rewrite (6 functions)
❌ 1-2 week migration time
```

**Option B: Create Auth Adapter for Edge Functions**
```
Keep Deno edge functions but adapt authentication:

// In each edge function
async function verifyNextAuthToken(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');

  // Verify JWT against Next-Auth secret
  const payload = await jose.jwtVerify(token, new TextEncoder().encode(NEXTAUTH_SECRET));

  // Extract user ID from JWT payload
  const userId = payload.payload.sub;

  // Fetch user from unified users table
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  return user;
}

Benefits:
✅ Minimal code changes
✅ Faster migration (3-5 days)

Drawbacks:
❌ Two auth systems to maintain
❌ JWT verification complexity
❌ Harder to debug
```

### **Recommendation:** Option A (API Routes)
Refactor to Next.js API routes for long-term maintainability.

---

## 📋 Step-by-Step Migration Checklist

### **Phase 1: Database Schema (Complete)**
✅ Extended `users` table with Document AI fields
✅ Created `user_documents`, `document_chunks`, `chat_conversations`, `chat_messages`
✅ Created `generated_documents`, `global_documents`
✅ Added permissions for `document_upload`, `ai_chat`, `generated_documents`

### **Phase 2: Additional Tables Needed**

Create these Document AI tables in Design-Rite:

```sql
-- admin_settings (AI configuration)
CREATE TABLE IF NOT EXISTS admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  global_prompt text,
  general_assistant_id text,
  ai_model text DEFAULT 'gpt-4o-mini',
  api_key_encrypted text, -- OpenAI API key
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Enable RLS (super_admin only)
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can manage AI settings" ON admin_settings
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users AS u
      WHERE u.id = auth.uid()::uuid
      AND u.role = 'super_admin'
      AND u.status = 'active'
    )
  );

-- user_themes (white-label branding)
CREATE TABLE IF NOT EXISTS user_themes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  logo_url text,
  primary_color text DEFAULT '#8b5cf6',
  secondary_color text DEFAULT '#a855f7',
  accent_color text DEFAULT '#ec4899',
  text_color text DEFAULT '#1f2937',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_themes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own theme" ON user_themes
  FOR ALL
  USING (user_id = auth.uid()::uuid);

-- Unique constraint
CREATE UNIQUE INDEX user_themes_user_id_idx ON user_themes(user_id);
```

### **Phase 3: Migrate Edge Functions**

**Priority Order:**

1. **`ai-chat`** → `app/api/ai-chat/route.ts`
   - Refactor auth validation
   - Update table references (`profiles` → `users`)
   - Test with Next-Auth session

2. **`create-checkout-session`** → `app/api/stripe/create-checkout/route.ts`
   - Update user lookup
   - Test Stripe checkout flow

3. **`stripe-webhooks`** → `app/api/webhooks/stripe/route.ts`
   - Update subscription sync logic
   - Map to `users.subscription_tier` + `subscription_status`

4. **`generate-document`** → `app/api/generate-document/route.ts`
   - Update branding data source

5. **Delete functions** → Keep as Edge Functions or migrate to API routes

### **Phase 4: Frontend Integration**

**Replace Supabase Auth Context with Next-Auth:**

```typescript
// BEFORE (Document AI)
import { useAuth } from '@/hooks/useAuth'; // Supabase Auth
const { user, session } = useAuth();

// AFTER (Design-Rite)
import { useUnifiedAuth } from '@/lib/hooks/useUnifiedAuth'; // Next-Auth
const { user, isAuthenticated, isPro } = useUnifiedAuth();
```

**Update API calls:**

```typescript
// BEFORE (Document AI)
const response = await supabase.functions.invoke('ai-chat', {
  body: { message, userId, conversationHistory }
});

// AFTER (Design-Rite)
const response = await fetch('/api/ai-chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    // No Authorization header needed - Next-Auth handles session
  },
  body: JSON.stringify({ message, conversationHistory })
});
```

---

## ⚡ Quick Win: Keep Existing Tables

**Good News:** The unified schema migration already created most tables!

**What's Already Done:**
✅ `user_documents` - Created
✅ `document_chunks` - Created
✅ `chat_conversations` - Created
✅ `chat_messages` - Created
✅ `generated_documents` - Created
✅ `global_documents` - Created

**What Needs Adding:**
⚠️ `admin_settings` - For AI configuration
⚠️ `user_themes` - For white-label branding

**Migration SQL:** See Phase 2 above ☝️

---

## 🎯 Estimated Timeline

| Phase | Task | Time | Dependencies |
|-------|------|------|--------------|
| 1 | ✅ Create unified schema | COMPLETE | None |
| 2 | Add `admin_settings` + `user_themes` tables | 2 hours | Phase 1 |
| 3 | Migrate `ai-chat` edge function | 1 day | Phase 2 |
| 4 | Migrate Stripe functions | 1 day | Phase 3 |
| 5 | Migrate `generate-document` | 4 hours | Phase 3 |
| 6 | Update frontend auth context | 1 day | Phase 3-5 |
| 7 | Test end-to-end flows | 2 days | All |
| **TOTAL** | **5-6 days** | | |

---

## 🚨 Critical Migration Considerations

### **1. Existing Document AI Users**
If the Document AI platform has active users:

```sql
-- Migration script needed
INSERT INTO users (
  email, password_hash, full_name, company, role, status,
  subscription_tier, subscription_status, stripe_customer_id, token_usage
)
SELECT
  au.email,
  au.encrypted_password, -- Map Supabase password hash
  p.full_name,
  p.company,
  'user' as role, -- Default role
  'active' as status,
  COALESCE(p.granted_tier, 'base') as subscription_tier,
  CASE WHEN p.has_free_access THEN 'active' ELSE 'inactive' END as subscription_status,
  p.stripe_customer_id,
  p.token_usage
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE au.deleted_at IS NULL;
```

⚠️ **Password Migration Issue:**
- Supabase uses different password hashing than bcrypt
- Users will need to reset passwords after migration
- Send password reset emails after migration

### **2. OpenAI API Key Management**
Document AI stores API keys in `admin_settings.api_key_encrypted`

**Options:**
- **A)** Keep in database (requires encryption key management)
- **B)** Move to environment variables (simpler, more secure)

**Recommendation:** Environment variables (`OPENAI_API_KEY`)

### **3. Stripe Customer Mapping**
Ensure Stripe customers link to new `users` table:

```typescript
// In stripe webhook handler
const { data: user } = await supabase
  .from('users')
  .select('id')
  .eq('stripe_customer_id', customerId)
  .single();
```

---

## 📈 Post-Migration Benefits

✅ **Single Authentication System** - No more dual auth
✅ **Role-Based Access Control** - Admins can manage users
✅ **Comprehensive Permissions** - Granular feature access
✅ **Activity Logging** - Full audit trail
✅ **Rate Limiting** - Prevent abuse
✅ **Unified User Management** - One admin panel for everything

---

## 🔧 Next Steps

1. ✅ Review this analysis
2. ⏭️ Add `admin_settings` + `user_themes` tables (SQL provided above)
3. ⏭️ Start with `ai-chat` function migration
4. ⏭️ Test auth flow end-to-end
5. ⏭️ Migrate remaining functions
6. ⏭️ Update frontend to use Next-Auth
7. ⏭️ Deploy and test

---

**Ready to begin migration?** Start with Phase 2 (adding the two missing tables), then we'll tackle the `ai-chat` function refactoring.
