# Dev Team Database Schema Documentation

**Source**: designalmostright-review repository
**Deployed To**: Design-Rite Validation Lab Supabase
**Project ID**: ickwrbdpuorzdpzqbqpf
**URL**: https://supabase.com/dashboard/project/ickwrbdpuorzdpzqbqpf

**Production Database**: Design-Rite Subscriptions
**Project ID**: aeorianxnxpxveoxzhov
**URL**: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov

---

## 📊 COMPLETE TABLE INVENTORY

### Core Auth & User Management

#### 1. `auth.users` (Supabase Managed)
```sql
-- Managed by Supabase Auth
-- Contains: id, email, encrypted_password, email_confirmed_at, etc.
```

#### 2. `profiles`
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  company TEXT,
  website TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  business_type TEXT,
  tax_id TEXT,
  logo_url TEXT,                    -- Path to logo in 'user-logos' bucket
  has_free_access BOOLEAN DEFAULT FALSE,  -- Admin override for free access
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS Policies
-- Users can view/update own profile
-- Admins can view all profiles
```

**Usage**: Complete business profile for subscribers, used in invoices/proposals

---

#### 3. `user_roles`
```sql
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'moderator', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- RLS Policies
-- Users can view own roles
-- Admins can manage all roles
```

**Usage**: Role-based access control (admin/moderator/user)

---

#### 4. `user_subscriptions`
```sql
CREATE TABLE user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  tier TEXT CHECK (tier IN ('free', 'base', 'pro', 'enterprise')) DEFAULT 'free',
  max_documents INTEGER DEFAULT 2,
  status TEXT CHECK (status IN ('active', 'trialing', 'past_due', 'cancelled', 'paused')) DEFAULT 'active',
  is_active BOOLEAN DEFAULT TRUE,
  source TEXT CHECK (source IN ('free', 'stripe', 'manual')) DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  billing_period TEXT CHECK (billing_period IN ('monthly', 'annual')),
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Computed Column (via Edge Function)
-- effective_tier: Returns tier with admin overrides applied
-- If user has has_free_access=true or is admin/moderator, returns their actual tier
-- Otherwise returns subscription tier

-- RLS Policies
-- Users can view own subscription
-- Admins can view/manage all subscriptions
```

**Usage**: Core subscription management, Stripe integration, tier-based feature access

---

### Admin Configuration

#### 5. `admin_settings`
```sql
CREATE TABLE admin_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- AI Configuration
  ai_model TEXT DEFAULT 'gpt-4o-mini',
  chat_completions_url TEXT DEFAULT 'https://api.openai.com/v1/chat/completions',
  api_key_encrypted TEXT,
  temperature NUMERIC(3,2) DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 1500,

  -- Global Prompt Template
  global_prompt TEXT,

  -- Platform-Specific AI
  general_assistant_id TEXT,
  platform_assistant_id TEXT,
  platform_prompt TEXT,

  -- Document Limits by Tier
  max_free_documents INTEGER DEFAULT 2,
  max_base_documents INTEGER DEFAULT 5,
  max_pro_documents INTEGER DEFAULT 50,
  max_enterprise_documents INTEGER DEFAULT 999,

  -- Pricing (in cents)
  price_base_cents INTEGER DEFAULT 4995,    -- $49.95
  price_pro_cents INTEGER DEFAULT 9995,     -- $99.95
  price_enterprise_cents INTEGER DEFAULT 0,

  -- Stripe Price IDs
  stripe_price_id_base TEXT,
  stripe_price_id_pro TEXT,
  stripe_price_id_enterprise TEXT,

  -- System Settings
  payment_required BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Single row table (only one settings record)
-- Admin-only access via RLS
```

**Usage**: Centralized admin configuration, no code changes needed to update settings

---

#### 6. `usage_limits`
```sql
CREATE TABLE usage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'base', 'pro', 'enterprise')),
  limit_type TEXT DEFAULT 'satellite_assessment',
  limit_value INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(subscription_tier, limit_type)
);

-- RLS: Admin-only
```

**Usage**: Per-tier usage limits for specific features (e.g., Satellite Assessment tool)

---

#### 7. `invite_tokens`
```sql
CREATE TABLE invite_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  email TEXT,
  role TEXT CHECK (role IN ('admin', 'moderator', 'user')) DEFAULT 'user',
  subscription_tier TEXT CHECK (subscription_tier IN ('free', 'base', 'pro', 'enterprise')),
  max_uses INTEGER DEFAULT 1,
  used_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- RLS: Admin-only
```

**Usage**: Generate invite codes for onboarding users with pre-assigned roles/tiers

---

### Documents & Content

#### 8. `new_user_documents`
```sql
CREATE TABLE new_user_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,           -- Path in Supabase storage
  file_size BIGINT,
  mime_type TEXT,
  description TEXT,
  is_processed BOOLEAN DEFAULT FALSE,
  processing_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Users can view/manage own documents
-- Admins can view all documents
```

**Usage**: User-uploaded documents for AI processing

---

#### 9. `generated_documents`
```sql
CREATE TABLE generated_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  document_type TEXT CHECK (document_type IN ('invoice', 'proposal', 'report', 'other')),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,           -- Path in 'generated-pdfs' bucket
  file_size BIGINT,
  metadata JSONB,                    -- Additional document metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Users can view own generated documents
```

**Usage**: PDFs generated by Invoice/Proposal generators

---

#### 10. `helpful_documents`
```sql
CREATE TABLE helpful_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,           -- Path in storage
  file_size BIGINT,
  mime_type TEXT,
  category TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Public read access, admin write access
```

**Usage**: Help documentation, guides, templates accessible to all users

---

#### 11. `global_documents`
```sql
CREATE TABLE global_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  description TEXT,
  file_size BIGINT,
  mime_type TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Admin-only management, AI can access for context
```

**Usage**: Documents accessible to AI for all conversations (global knowledge base)

---

### Chat & AI

#### 12. `chat_conversations`
```sql
CREATE TABLE chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Users can manage own conversations
```

---

#### 13. `chat_messages`
```sql
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES chat_conversations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: Users can view/manage messages in own conversations
```

**Usage**: AI chat conversation history (NOT needed if removing AI assistant)

---

### Usage Tracking

#### 14. `assessment_usage`
```sql
CREATE TABLE assessment_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_type TEXT,              -- 'satellite', 'security', etc.
  usage_date DATE DEFAULT CURRENT_DATE,
  usage_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, assessment_type, usage_date)
);

-- RLS: Users can view own usage
-- Admins can view all usage
```

**Usage**: Track daily usage of assessment tools for rate limiting

---

### Theming

#### 15. `user_themes`
```sql
CREATE TABLE user_themes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#8b5cf6',
  secondary_color TEXT DEFAULT '#a855f7',
  accent_color TEXT DEFAULT '#ec4899',
  text_color TEXT DEFAULT '#1f2937',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS: Users can manage own theme
```

**Usage**: Customizable UI theming per user

---

## 🪣 STORAGE BUCKETS

### 1. `user-logos`
- **Purpose**: Company logos for profiles and invoices
- **Access**: Private, user-specific
- **Max Size**: 2MB per file
- **Allowed Types**: image/png, image/jpeg, image/svg+xml

### 2. `generated-pdfs`
- **Purpose**: Generated invoices, proposals, reports
- **Access**: Private, user-specific
- **Path Structure**: `{user_id}/invoices/{filename}.pdf`
- **Max Size**: 10MB per file

### 3. `user-documents`
- **Purpose**: User-uploaded documents for AI processing
- **Access**: Private, user-specific
- **Max Size**: 10MB per file
- **Allowed Types**: pdf, docx, txt, csv

### 4. `helpful-documents`
- **Purpose**: Public help documentation
- **Access**: Public read
- **Max Size**: 20MB per file

### 5. `global-documents`
- **Purpose**: AI knowledge base documents
- **Access**: Admin upload, AI read
- **Max Size**: 50MB per file

---

## 🔧 EDGE FUNCTIONS

### 1. `ai-chat`
- **Purpose**: AI chat completions
- **Auth**: Required
- **Usage**: Powers AI assistant (TO BE REMOVED)

### 2. `create-checkout-session`
- **Purpose**: Create Stripe checkout session
- **Auth**: Required
- **Input**: `{ priceId, userId }`
- **Output**: `{ url }` (Stripe checkout URL)

### 3. `stripe-webhooks`
- **Purpose**: Handle Stripe webhook events
- **Auth**: Stripe signature verification
- **Events**: checkout.session.completed, customer.subscription.*

### 4. `sync-subscription-status`
- **Purpose**: Get user's effective subscription tier
- **Auth**: Required
- **Output**: `{ subscription }` with computed `effective_tier`
- **Logic**:
  - Returns `effective_tier` based on role overrides
  - Auto-creates free subscription if none exists
  - Checks `has_free_access` flag

### 5. `generate-document`
- **Purpose**: Generate PDF documents
- **Auth**: Required
- **Input**: Document type and data
- **Output**: PDF file stored in `generated-pdfs` bucket

### 6. `delete-user-document`
- **Purpose**: Delete user document from storage
- **Auth**: Required
- **Validates**: User owns the document

### 7. `delete-helpful-document`
- **Purpose**: Delete helpful document
- **Auth**: Admin only

### 8. `stripe-config-status`
- **Purpose**: Check if Stripe is configured
- **Auth**: Admin only
- **Output**: `{ configured: boolean }`

---

## 🔐 RLS POLICIES SUMMARY

### User-Scoped Tables (Users see only their data):
- `profiles`
- `user_subscriptions`
- `new_user_documents`
- `generated_documents`
- `chat_conversations`
- `chat_messages`
- `assessment_usage`
- `user_themes`

### Admin-Only Tables:
- `admin_settings`
- `usage_limits`
- `invite_tokens`
- `global_documents` (admin write)

### Public Read Tables:
- `helpful_documents`

### Admin Override:
- Admins with `user_roles.role = 'admin'` can view/manage all tables
- Moderators can view most tables but limited write access

---

## 🔄 KEY DATABASE FUNCTIONS/PROCEDURES

### `get_user_subscription_status()`
```sql
-- Returns user's effective subscription with computed fields:
-- - effective_tier (tier with overrides applied)
-- - is_active (considering role overrides)
-- - max_documents (tier-specific limit)
```

### `get_public_pricing_settings()`
```sql
-- Returns public pricing information (no sensitive data)
-- Used by subscription page to show pricing
```

### `update_updated_at_column()`
```sql
-- Trigger function to auto-update updated_at timestamp
-- Applied to multiple tables
```

---

## 📊 DATA RELATIONSHIPS

```
auth.users (Supabase)
├── profiles (1:1)
├── user_roles (1:many)
├── user_subscriptions (1:1)
├── user_themes (1:1)
├── new_user_documents (1:many)
├── generated_documents (1:many)
├── chat_conversations (1:many)
│   └── chat_messages (1:many)
└── assessment_usage (1:many)

admin_settings (singleton)
usage_limits (per-tier config)
invite_tokens (standalone)
helpful_documents (public)
global_documents (AI knowledge base)
```

---

## 🎯 TABLES TO KEEP VS REMOVE FOR SUBSCRIBER PORTAL

### ✅ KEEP (Core Subscriber Features):
- ✅ `profiles` - Profile management
- ✅ `user_subscriptions` - Subscription management
- ✅ `user_roles` - Role-based access
- ✅ `admin_settings` - Admin configuration
- ✅ `usage_limits` - Feature limits
- ✅ `invite_tokens` - User invitations
- ✅ `new_user_documents` - Document uploads
- ✅ `generated_documents` - Generated PDFs (invoices, proposals)
- ✅ `helpful_documents` - Help docs
- ✅ `assessment_usage` - Usage tracking
- ✅ `user_themes` - UI customization

### ❌ REMOVE OR IGNORE (AI Assistant Related):
- ⚠️ `chat_conversations` - Only if AI-specific
- ⚠️ `chat_messages` - Only if AI-specific
- ⚠️ `global_documents` - Only if AI-specific

### 🔧 EDGE FUNCTIONS TO KEEP:
- ✅ `create-checkout-session`
- ✅ `stripe-webhooks`
- ✅ `sync-subscription-status`
- ✅ `generate-document`
- ✅ `delete-user-document`
- ✅ `delete-helpful-document`
- ✅ `stripe-config-status`

### ❌ EDGE FUNCTIONS TO REMOVE:
- ❌ `ai-chat` (AI assistant)

---

## 🚀 MIGRATION NOTES

### From Validation Lab to Production:
1. All tables exist in Validation Lab (ickwrbdpuorzdpzqbqpf)
2. Need to verify/create in Production (aeorianxnxpxveoxzhov)
3. Compare schemas between projects
4. Run any missing migrations
5. Deploy Edge Functions to both projects

### Schema Differences to Watch:
- Your V4 may have additional tables (spatial_studio, creative_studio, etc.)
- Ensure no table name conflicts
- Verify RLS policies are consistent
- Check storage bucket names match

---

**Last Updated**: October 7, 2025
**Documented By**: Claude Code AI
**Source**: designalmostright-review codebase analysis
