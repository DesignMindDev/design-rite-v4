# 🔐 Unified Auth Integration Guide
## Design-Rite v3 + Document AI Platform

**Integration Approach:** Option 1 - Unified Auth Schema
**Created:** 2025-10-02
**Status:** Implementation Planning

---

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Migration Strategy](#migration-strategy)
3. [Implementation Phases](#implementation-phases)
4. [Edge Functions Refactoring](#edge-functions-refactoring)
5. [Stripe Integration](#stripe-integration)
6. [Testing Strategy](#testing-strategy)
7. [Rollback Plan](#rollback-plan)

---

## 🏗️ Architecture Overview

### Unified User Model

```
┌─────────────────────────────────────────────────────────┐
│                    users (Unified)                      │
├─────────────────────────────────────────────────────────┤
│ Design-Rite Fields:                                     │
│   - id, email, password_hash, role, status              │
│   - company, phone, access_code                         │
│   - login_count, failed_login_attempts                  │
│   - created_by, notes                                   │
│                                                          │
│ Document AI Fields (NEW):                               │
│   - stripe_customer_id, stripe_subscription_id          │
│   - subscription_tier (base/pro/enterprise)             │
│   - subscription_status (active/inactive/cancelled)     │
│   - token_usage (AI token consumption)                  │
│   - logo_url, business_type, website                    │
│   - address, city, state, zip_code, tax_id              │
│   - has_free_access, has_seen_subscription_page         │
└─────────────────────────────────────────────────────────┘
```

### Role Mapping

| Doc AI Role | Design-Rite Role | Permissions Level |
|-------------|------------------|-------------------|
| Admin       | super_admin      | Full platform control |
| Moderator   | admin or manager | Team management |
| User        | user             | Standard features with rate limits |
| N/A         | guest            | Public access only |

### Feature Permissions Matrix

| Feature | Super Admin | Admin | Manager | User | Guest |
|---------|-------------|-------|---------|------|-------|
| **document_upload** | Unlimited | Unlimited | 20/month | 10/month | ❌ |
| **ai_chat** | Unlimited | Unlimited | Unlimited | 50/month | ❌ |
| **generated_documents** | Full CRUD | Full CRUD | Create/Read | Read Only | ❌ |
| **quotes** | Unlimited | Unlimited | Unlimited | 50/month | ❌ |
| **ai_assessments** | Unlimited | Unlimited | Unlimited | 5/day | ❌ |

---

## 🔄 Migration Strategy

### Existing User Migration

#### Scenario 1: No Existing Document AI Users
✅ **Simplest Path** - Just run migration SQL

```sql
-- Migration already complete via 001_unified_auth_schema.sql
-- All Design-Rite users automatically get Document AI fields with defaults:
--   - subscription_tier = 'base'
--   - subscription_status = 'inactive'
--   - token_usage = 0
```

#### Scenario 2: Document AI Platform Has Existing Users

**Step 1: Export Document AI Users**
```sql
-- Run on Document AI Supabase instance
SELECT
  email,
  full_name,
  company,
  business_type,
  logo_url,
  stripe_customer_id,
  token_usage,
  granted_tier as subscription_tier,
  has_free_access
FROM profiles
WHERE email NOT IN (SELECT email FROM auth.users WHERE deleted_at IS NOT NULL);
```

**Step 2: Create Migration Script**
```typescript
// migrate-doc-ai-users.ts
import { createClient } from '@supabase/supabase-js';
import { hash } from 'bcryptjs';

interface DocAIUser {
  email: string;
  full_name: string;
  company?: string;
  business_type?: string;
  logo_url?: string;
  stripe_customer_id?: string;
  token_usage: number;
  subscription_tier: 'base' | 'pro' | 'enterprise';
  has_free_access: boolean;
}

async function migrateUsers(users: DocAIUser[]) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  for (const user of users) {
    // Check if user already exists in Design-Rite
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .eq('email', user.email.toLowerCase())
      .single();

    if (existing) {
      // User exists - merge Document AI data
      console.log(`Merging data for existing user: ${user.email}`);

      await supabase
        .from('users')
        .update({
          business_type: user.business_type,
          logo_url: user.logo_url,
          stripe_customer_id: user.stripe_customer_id,
          token_usage: user.token_usage,
          subscription_tier: user.subscription_tier,
          subscription_status: user.has_free_access ? 'active' : 'inactive',
          has_free_access: user.has_free_access
        })
        .eq('id', existing.id);
    } else {
      // New user - create with temporary password
      console.log(`Creating new user: ${user.email}`);

      const tempPassword = generateSecurePassword();
      const passwordHash = await hash(tempPassword, 10);

      const { data: newUser, error } = await supabase
        .from('users')
        .insert({
          email: user.email.toLowerCase(),
          password_hash: passwordHash,
          full_name: user.full_name,
          company: user.company,
          business_type: user.business_type,
          logo_url: user.logo_url,
          stripe_customer_id: user.stripe_customer_id,
          token_usage: user.token_usage,
          subscription_tier: user.subscription_tier,
          subscription_status: user.has_free_access ? 'active' : 'inactive',
          has_free_access: user.has_free_access,
          role: 'user', // Default role
          status: 'pending', // Require password reset
          notes: 'Migrated from Document AI platform'
        })
        .select()
        .single();

      if (!error && newUser) {
        // TODO: Send password reset email
        console.log(`Created user ${user.email} - Password reset required`);
      }
    }
  }
}

function generateSecurePassword(): string {
  return crypto.randomBytes(32).toString('hex');
}
```

**Step 3: Migrate Document Metadata**
```sql
-- Map Document AI documents to unified schema
INSERT INTO user_documents (id, user_id, filename, file_path, file_size, mime_type, extracted_text, processing_status)
SELECT
  ud.id,
  u.id as user_id, -- Map via email
  ud.filename,
  ud.file_path,
  ud.file_size,
  ud.mime_type,
  ud.extracted_text,
  CASE
    WHEN EXISTS (SELECT 1 FROM new_user_documents nud WHERE nud.id = ud.id AND nud.processing_status = 'completed') THEN 'completed'
    ELSE 'pending'
  END as processing_status
FROM doc_ai.user_documents ud
INNER JOIN users u ON u.email = (SELECT email FROM doc_ai.auth.users WHERE id = ud.user_id)
ON CONFLICT (id) DO NOTHING;
```

---

## 🚀 Implementation Phases

### **PHASE 1: Database Schema (Week 1, Days 1-3)**

**Day 1: Backup & Preparation**
```bash
# 1. Create database snapshot
supabase db dump > backup_before_unified_auth_$(date +%Y%m%d).sql

# 2. Test migration on staging
supabase db reset --db-url $STAGING_DATABASE_URL
supabase db push
```

**Day 2: Run Migration**
```bash
# Run in Supabase SQL Editor
# File: supabase/migrations/001_unified_auth_schema.sql

# Verify tables created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('user_documents', 'document_chunks', 'chat_conversations');

# Verify new columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('stripe_customer_id', 'subscription_tier', 'token_usage');
```

**Day 3: Create Storage Buckets**
```sql
-- Create storage buckets via Supabase Dashboard or SQL

-- 1. Documents bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  false,
  10485760, -- 10MB limit
  ARRAY['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
);

-- RLS policy for documents bucket
CREATE POLICY "Users can upload to their folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can read their files"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents' AND
  auth.uid()::text = (storage.foldername(name))[1]
);

-- 2. Generated PDFs bucket (private)
INSERT INTO storage.buckets (id, name, public, file_size_limit)
VALUES ('generated-pdfs', 'generated-pdfs', false, 5242880); -- 5MB limit

-- Similar RLS policies for generated-pdfs...
```

**Verification Checklist:**
- [ ] All tables created successfully
- [ ] Indexes created on key columns
- [ ] RLS policies active on all tables
- [ ] Vector extension enabled
- [ ] Storage buckets created with proper RLS
- [ ] Permissions seeded with Document AI features
- [ ] Database functions created

---

### **PHASE 2: Authentication Integration (Week 1, Days 4-7)**

**Day 4: Extend Next-Auth Configuration**

Update `lib/auth-config.ts`:
```typescript
// Add Document AI fields to session
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
    accessCode?: string;
    // NEW: Document AI fields
    subscriptionTier?: string;
    subscriptionStatus?: string;
    tokenUsage?: number;
    stripeCustomerId?: string;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    accessCode?: string;
    // NEW: Document AI fields
    subscriptionTier?: string;
    subscriptionStatus?: string;
  }
}

// Update callbacks to include new fields
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.role = user.role;
      token.accessCode = user.accessCode;
      token.subscriptionTier = user.subscriptionTier;
      token.subscriptionStatus = user.subscriptionStatus;
    }
    return token;
  },

  async session({ session, token }) {
    if (session.user) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      session.user.accessCode = token.accessCode as string;
      session.user.subscriptionTier = token.subscriptionTier as string;
      session.user.subscriptionStatus = token.subscriptionStatus as string;
    }
    return session;
  }
}
```

Update `authorize` function to fetch new fields:
```typescript
async authorize(credentials) {
  // ... existing code ...

  const { data: user, error } = await supabase
    .from('users')
    .select(`
      id, email, password_hash, full_name, role, access_code, status,
      subscription_tier, subscription_status, token_usage, stripe_customer_id
    `)
    .eq('email', credentials.email.toLowerCase())
    .single();

  // ... rest of existing code ...

  return {
    id: user.id,
    email: user.email,
    name: user.full_name,
    role: user.role,
    accessCode: user.access_code,
    subscriptionTier: user.subscription_tier,
    subscriptionStatus: user.subscription_status,
    tokenUsage: user.token_usage,
    stripeCustomerId: user.stripe_customer_id
  };
}
```

**Day 5-7: Create Unified Auth Hooks**

Create `lib/hooks/useUnifiedAuth.ts`:
```typescript
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export interface UnifiedAuthState {
  user: {
    id: string;
    email: string;
    name: string | null;
    role: 'super_admin' | 'admin' | 'manager' | 'user' | 'guest';
    subscriptionTier: 'base' | 'pro' | 'enterprise';
    subscriptionStatus: 'active' | 'inactive' | 'cancelled' | 'past_due';
  } | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isPro: boolean;
  isEnterprise: boolean;
  hasActiveSubscription: boolean;
}

export function useUnifiedAuth(): UnifiedAuthState {
  const { data: session, status } = useSession();

  return useMemo(() => {
    const isLoading = status === 'loading';
    const isAuthenticated = status === 'authenticated' && !!session?.user;

    if (!isAuthenticated || !session?.user) {
      return {
        user: null,
        isAuthenticated: false,
        isLoading,
        isSuperAdmin: false,
        isAdmin: false,
        isPro: false,
        isEnterprise: false,
        hasActiveSubscription: false
      };
    }

    const role = session.user.role as string;
    const subscriptionTier = (session.user.subscriptionTier || 'base') as string;
    const subscriptionStatus = (session.user.subscriptionStatus || 'inactive') as string;

    return {
      user: {
        id: session.user.id,
        email: session.user.email!,
        name: session.user.name,
        role: role as any,
        subscriptionTier: subscriptionTier as any,
        subscriptionStatus: subscriptionStatus as any
      },
      isAuthenticated: true,
      isLoading: false,
      isSuperAdmin: role === 'super_admin',
      isAdmin: role === 'super_admin' || role === 'admin',
      isPro: subscriptionTier === 'pro' || role === 'super_admin' || role === 'admin',
      isEnterprise: subscriptionTier === 'enterprise' || role === 'super_admin',
      hasActiveSubscription: subscriptionStatus === 'active' || role === 'super_admin' || role === 'admin'
    };
  }, [session, status]);
}
```

---

### **PHASE 3: Edge Functions Refactoring (Week 2)**

#### Strategy: Adapt Document AI Edge Functions to Next-Auth

**Key Changes Required:**
1. Replace Supabase Auth JWT validation with Next-Auth session
2. Update `auth.users` references to `users` table
3. Update `profiles` table references to `users` table
4. Maintain RPC function compatibility

#### Example: Refactor `ai-chat` Edge Function

**Before (Document AI):**
```typescript
// Document AI version
const authHeader = req.headers.get('Authorization');
const token = authHeader?.replace('Bearer ', '');
const { data: { user } } = await supabase.auth.getUser(token);

if (!user) throw new Error('Unauthorized');
const userId = user.id;
```

**After (Unified):**
```typescript
// Unified version - Option A: API Route with Next-Auth
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-config';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const userId = session.user.id;

  // Rest of function logic...
}
```

**Migration Checklist for Each Edge Function:**

✅ **ai-chat**
- [x] Replace auth validation
- [ ] Update user profile queries (profiles → users)
- [ ] Test with Next-Auth sessions
- [ ] Verify streaming still works

✅ **process-embeddings**
- [x] Service key authentication (no changes needed)
- [ ] Update user_documents table references
- [ ] Test OpenAI embedding generation

✅ **vector-search**
- [x] Replace auth validation
- [ ] Update document_chunks query
- [ ] Test vector similarity search

✅ **generate-invoice**
- [x] Replace auth validation
- [ ] Update profiles → users for company info
- [ ] Test PDF generation

✅ **stripe-webhook**
- [ ] Update subscription sync to unified users table
- [ ] Map Stripe events to subscription_tier/subscription_status columns
- [ ] Test webhook event handling

**Deployment Strategy:**
```bash
# Option 1: Migrate to Next.js API Routes (RECOMMENDED)
# Place in app/api/ai-chat/route.ts
# Benefit: Native Next-Auth integration, better type safety

# Option 2: Keep as Supabase Edge Functions
# Update Deno functions to accept Next-Auth JWT in header
# Benefit: Maintain current architecture
```

---

### **PHASE 4: Stripe Integration (Week 3)**

#### Architecture: Stripe → Webhook → Unified Users Table

**Step 1: Update Stripe Webhook Handler**

Create `app/api/webhooks/stripe/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentSucceeded(invoice);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionCancelled(subscription);
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const subscriptionId = session.subscription as string;
  const userEmail = session.customer_email || session.customer_details?.email;

  if (!userEmail) {
    console.error('No email in checkout session');
    return;
  }

  // Get subscription details to determine tier
  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const priceId = subscription.items.data[0]?.price.id;

  // Map Stripe price ID to tier
  const tier = mapPriceToTier(priceId);

  // Update user with Stripe info
  const { error } = await supabase
    .from('users')
    .update({
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      subscription_tier: tier,
      subscription_status: 'active'
    })
    .eq('email', userEmail.toLowerCase());

  if (error) {
    console.error('Failed to update user subscription:', error);
  } else {
    console.log(`✅ Activated ${tier} subscription for ${userEmail}`);
  }

  // Log activity
  await supabase.from('activity_logs').insert({
    user_id: null, // Will be linked via email
    action: 'subscription_activated',
    success: true,
    details: {
      email: userEmail,
      tier,
      stripe_customer_id: customerId
    }
  });
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  await supabase
    .from('users')
    .update({ subscription_status: 'active' })
    .eq('stripe_customer_id', customerId);

  console.log(`✅ Payment succeeded for customer ${customerId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;

  await supabase
    .from('users')
    .update({ subscription_status: 'past_due' })
    .eq('stripe_customer_id', customerId);

  console.log(`⚠️ Payment failed for customer ${customerId}`);
}

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const customerId = subscription.customer as string;

  await supabase
    .from('users')
    .update({
      subscription_status: 'cancelled',
      subscription_tier: 'base'
    })
    .eq('stripe_customer_id', customerId);

  console.log(`❌ Subscription cancelled for customer ${customerId}`);
}

function mapPriceToTier(priceId: string): 'base' | 'pro' | 'enterprise' {
  // Map your Stripe price IDs to tiers
  const priceMap: Record<string, 'base' | 'pro' | 'enterprise'> = {
    'price_pro_monthly': 'pro',
    'price_pro_annual': 'pro',
    'price_enterprise_monthly': 'enterprise',
    'price_enterprise_annual': 'enterprise'
  };

  return priceMap[priceId] || 'base';
}
```

**Step 2: Configure Stripe Checkout**

Create `lib/stripe.ts`:
```typescript
import Stripe from 'stripe';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth-config';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

export async function createCheckoutSession(tier: 'pro' | 'enterprise') {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    throw new Error('Not authenticated');
  }

  const priceId = tier === 'pro'
    ? process.env.STRIPE_PRICE_PRO_MONTHLY!
    : process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY!;

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer_email: session.user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/admin/subscription?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/admin/subscription?cancelled=true`,
    metadata: {
      user_email: session.user.email,
      tier
    }
  });

  return checkoutSession.url;
}

export { stripe };
```

**Step 3: Environment Variables**
```bash
# Add to .env.local
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...
```

---

## 🧪 Testing Strategy

### Unit Tests

**Test File:** `__tests__/lib/unified-auth.test.ts`
```typescript
import { checkPermission, checkRateLimit } from '@/lib/permissions';

describe('Unified Auth Permissions', () => {
  it('should allow super_admin unlimited document uploads', async () => {
    const canUpload = await checkPermission('document_upload', 'create');
    expect(canUpload).toBe(true);
  });

  it('should enforce rate limits for user role', async () => {
    const rateLimit = await checkRateLimit(userId, 'document_upload');
    expect(rateLimit.limit).toBe(10);
  });
});
```

### Integration Tests

**Test Scenarios:**
1. ✅ User registers → Gets base tier → Can upload 5 documents
2. ✅ User upgrades to Pro → Stripe webhook fires → Tier updated → Can upload 20 documents
3. ✅ Admin creates user → User logs in → Has correct permissions
4. ✅ User exceeds rate limit → Gets 429 error with clear message
5. ✅ Document upload → Processing queue → Embedding generation → Vector search works

### Manual Testing Checklist

**Authentication:**
- [ ] Login with Design-Rite user
- [ ] Login with migrated Document AI user
- [ ] Session persists for 24 hours
- [ ] Logout clears session
- [ ] Failed login increments counter

**Permissions:**
- [ ] Super admin can access all features
- [ ] User role respects rate limits
- [ ] Permission denied shows upgrade prompt

**Document Processing:**
- [ ] Upload PDF → Extract text → Queue for processing
- [ ] Embedding generation completes
- [ ] Vector search returns relevant results
- [ ] AI chat uses document context

**Stripe:**
- [ ] Checkout session creates successfully
- [ ] Payment success webhook updates user
- [ ] Subscription tier reflected in permissions
- [ ] Cancellation downgrades to base tier

---

## 🔄 Rollback Plan

### Database Rollback
```bash
# Restore from backup
psql $DATABASE_URL < backup_before_unified_auth_20251002.sql

# Or use Supabase point-in-time recovery
supabase db restore --db-url $DATABASE_URL --point-in-time "2025-10-02 10:00:00"
```

### Application Rollback
```bash
# Revert to previous deployment
git revert <merge-commit-hash>
git push origin main

# Or redeploy previous version
vercel rollback
```

### Data Integrity Check
```sql
-- Verify no data loss
SELECT COUNT(*) FROM users; -- Should match pre-migration count
SELECT COUNT(*) FROM user_documents; -- Should match migrated count
SELECT COUNT(*) FROM activity_logs WHERE action = 'migration_error'; -- Should be 0
```

---

## 📊 Success Metrics

**Phase 1 Complete:**
- [ ] All tables created successfully
- [ ] All indexes created
- [ ] RLS policies tested
- [ ] Zero data loss
- [ ] Zero downtime

**Phase 2 Complete:**
- [ ] Next-Auth session includes Document AI fields
- [ ] useUnifiedAuth hook works
- [ ] All admin pages use unified auth

**Phase 3 Complete:**
- [ ] All edge functions migrated
- [ ] AI chat works with Next-Auth
- [ ] Document processing pipeline functional

**Phase 4 Complete:**
- [ ] Stripe webhooks updating users table
- [ ] Subscription tiers reflected in permissions
- [ ] Payment flows tested end-to-end

**Production Ready:**
- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security audit complete
- [ ] Documentation updated
- [ ] Team trained on new architecture

---

## 📞 Support & Questions

**Implementation Questions:**
- Database Schema: Review `supabase/migrations/001_unified_auth_schema.sql`
- Auth Integration: Review `lib/auth-config.ts` changes
- Edge Functions: Check Document AI platform repo for original implementations

**Rollback Triggers:**
- Critical security vulnerability discovered
- Data corruption detected
- Performance degradation >50%
- User authentication failures >5%

---

**Next Steps:** Run Phase 1 migration on staging environment and verify all tests pass before proceeding to production.
