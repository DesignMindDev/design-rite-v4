# 🚀 Document AI Integration - Quick Deployment Guide

**Status:** ✅ All code complete, ready to deploy
**Estimated Time:** 2-3 hours (database + testing)

---

## ⚡ Fast Track Deployment (For Experienced Teams)

### Step 1: Database Migrations (30 min)

```bash
# In Supabase SQL Editor (https://app.supabase.com/project/YOUR_PROJECT/sql)
# Run these 3 files in order:

1. supabase/migrations/001_unified_auth_schema.sql
2. supabase/migrations/002_add_doc_ai_tables.sql
3. supabase/migrations/003_create_storage_buckets.sql
```

**Verify:**
```sql
-- Copy/paste from scripts/verify-doc-ai-integration.sql
-- Should show "✅ READY FOR USE"
```

### Step 2: Environment Variables (10 min)

Add to `.env.local` (see `ENV_VARIABLES_GUIDE.md` for details):

```bash
# Already configured (verify these exist):
NEXTAUTH_SECRET=<your-secret>
NEXTAUTH_URL=http://localhost:3010
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_KEY=<your-service-key>

# Required for Document AI features:
OPENAI_API_KEY=sk-...                    # Required for AI chat
STRIPE_SECRET_KEY=sk_test_...            # Required for subscriptions
STRIPE_WEBHOOK_SECRET=whsec_...          # Required for webhooks

# Optional (can use Gemini instead of OpenAI for document generation):
GEMINI_API_KEY=AIza...                   # Optional

# Optional (can be configured in admin_settings table instead):
STRIPE_PRICE_BASE=price_...              # Optional
STRIPE_PRICE_PRO=price_...               # Optional
STRIPE_PRICE_ENTERPRISE=price_...        # Optional
```

### Step 3: Stripe Webhook Integration (15 min)

**Option A: Extend Existing Webhook (Recommended)**

Edit `app/api/stripe/webhook/route.ts`:

```typescript
// 1. Add import at top of file
import {
  handleDocAICheckoutCompleted,
  handleDocAISubscriptionUpdated,
  handleDocAISubscriptionDeleted,
  handleDocAIPaymentSucceeded,
  handleDocAIPaymentFailed
} from '@/lib/stripe-doc-ai-handler';

// 2. Add to switch statement inside POST handler
switch (event.type) {
  case 'checkout.session.completed':
    // NEW: Document AI checkout
    await handleDocAICheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    break;

  case 'customer.subscription.created':
  case 'customer.subscription.updated':
    // Existing Design-Rite handler (keep as-is)
    await handleSubscriptionChange(event.data.object as Stripe.Subscription);
    // NEW: Document AI handler (add this line)
    await handleDocAISubscriptionUpdated(event.data.object as Stripe.Subscription);
    break;

  case 'customer.subscription.deleted':
    // Existing Design-Rite handler (keep as-is)
    await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
    // NEW: Document AI handler (add this line)
    await handleDocAISubscriptionDeleted(event.data.object as Stripe.Subscription);
    break;

  case 'invoice.payment_succeeded':
    // Existing Design-Rite handler (keep as-is)
    await handlePaymentSucceeded(event.data.object as Stripe.Invoice);
    // NEW: Document AI handler (add this line)
    await handleDocAIPaymentSucceeded(event.data.object as Stripe.Invoice);
    break;

  case 'invoice.payment_failed':
    // Existing Design-Rite handler (keep as-is)
    await handlePaymentFailed(event.data.object as Stripe.Invoice);
    // NEW: Document AI handler (add this line)
    await handleDocAIPaymentFailed(event.data.object as Stripe.Invoice);
    break;

  // Keep all other existing cases
  default:
    console.log(`Unhandled event type: ${event.type}`);
}
```

**Option B: Create Separate Webhook (If needed)**

If you prefer a separate endpoint, the handlers can be called from a new route at `/api/doc-ai/stripe-webhook/route.ts` (not included, but straightforward to create).

### Step 4: Test API Endpoints (30 min)

```bash
# Start dev server
npm run dev

# Test 1: AI Chat
curl -X POST http://localhost:3010/api/doc-ai-chat \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<your-session-token>" \
  -d '{"message":"Hello, test message","conversation_id":"test-123"}'

# Expected: 200 OK with AI response

# Test 2: Document Generation
curl -X POST http://localhost:3010/api/doc-ai/generate-document \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<your-session-token>" \
  -d '{"document_type":"security_assessment","title":"Test Report"}'

# Expected: 200 OK with generated markdown content

# Test 3: Stripe Checkout
curl -X POST http://localhost:3010/api/doc-ai/create-checkout \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<your-session-token>" \
  -d '{"tier":"pro"}'

# Expected: 200 OK with Stripe checkout URL
```

### Step 5: Test Webhooks with Stripe CLI (15 min)

```bash
# Install Stripe CLI (if not already installed)
# https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local dev server
stripe listen --forward-to localhost:3010/api/stripe/webhook

# In another terminal, trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_succeeded

# Check console logs for:
# [Doc AI Stripe] ✅ Activated pro subscription for user@example.com
```

**Verify in database:**
```sql
-- Check user was updated
SELECT
  email,
  stripe_customer_id,
  subscription_tier,
  subscription_status
FROM users
WHERE stripe_customer_id IS NOT NULL
ORDER BY created_at DESC
LIMIT 5;

-- Check activity logs
SELECT
  u.email,
  al.action,
  al.success,
  al.created_at
FROM activity_logs al
JOIN users u ON al.user_id = u.id
WHERE al.action LIKE 'subscription%'
ORDER BY al.created_at DESC
LIMIT 10;
```

### Step 6: Production Deployment (30 min)

**Staging First:**
1. Deploy code to staging environment
2. Run migrations on staging database
3. Configure staging environment variables
4. Test full user flow: signup → subscribe → chat → generate document
5. Verify webhooks working in Stripe dashboard

**Production:**
1. Update production environment variables
2. Run migrations on production database (same SQL files)
3. Deploy application
4. Configure Stripe webhook URL: `https://yourdomain.com/api/stripe/webhook`
5. Test with Stripe test mode first
6. Switch to live mode when ready
7. Monitor error logs and activity_logs table

---

## 📋 Pre-Deployment Checklist

### Database
- [ ] Ran all 3 migration files in order
- [ ] Verified with `scripts/verify-doc-ai-integration.sql`
- [ ] All checks show ✅ status
- [ ] pgvector extension installed
- [ ] Storage buckets created

### Environment
- [ ] `.env.local` has all required variables
- [ ] `OPENAI_API_KEY` configured and has spending limits set
- [ ] `STRIPE_SECRET_KEY` configured (test mode for testing)
- [ ] `STRIPE_WEBHOOK_SECRET` matches Stripe dashboard
- [ ] `NEXTAUTH_SECRET` is unique and secure

### Code
- [ ] Stripe webhook handlers imported in existing webhook
- [ ] New event cases added to switch statement
- [ ] No TypeScript errors (`npm run typecheck`)
- [ ] No ESLint errors (`npm run lint`)

### Testing
- [ ] AI chat endpoint returns responses
- [ ] Document generation creates markdown
- [ ] Stripe checkout creates sessions
- [ ] Webhooks update users table
- [ ] Activity logs being created

### Production
- [ ] Staging deployment successful
- [ ] End-to-end user flow tested
- [ ] Stripe webhook URL configured
- [ ] Production env vars set
- [ ] Error monitoring enabled

---

## 🚨 Common Issues & Quick Fixes

### Issue: "No AI API key configured"
**Fix:** Add `OPENAI_API_KEY=sk-...` to `.env.local` and restart server

### Issue: Webhook signature verification fails
**Fix:** Copy correct webhook secret from Stripe dashboard → Webhooks → Your endpoint → Reveal signing secret

### Issue: "User not found for customer"
**Fix:** Ensure Stripe customer has `userId` in metadata when creating customer

### Issue: Migration fails with "relation already exists"
**Fix:** Safe to ignore if re-running migrations. Tables use `IF NOT EXISTS` checks.

### Issue: Storage bucket not found
**Fix:** Run `003_create_storage_buckets.sql` migration. Verify with `SELECT * FROM storage.buckets;`

### Issue: Vector search not working
**Fix:** Verify pgvector extension: `SELECT * FROM pg_extension WHERE extname = 'vector';`

---

## 📊 What's Included

### API Endpoints Created
- ✅ `/api/doc-ai-chat` - AI conversation with document context
- ✅ `/api/doc-ai/create-checkout` - Stripe subscription checkout
- ✅ `/api/doc-ai/generate-document` - AI document generation
- ✅ `lib/stripe-doc-ai-handler.ts` - Webhook event handlers

### Database Tables Created
- ✅ Extended `users` table with 14 Document AI columns
- ✅ `admin_settings` - AI model configuration
- ✅ `user_themes` - White-label branding
- ✅ `user_documents` - Uploaded files
- ✅ `document_chunks` - Vector embeddings for RAG
- ✅ `chat_conversations` - AI chat sessions
- ✅ `chat_messages` - Chat history
- ✅ `generated_documents` - AI-generated PDFs
- ✅ `global_documents` - Shared knowledge base
- ✅ `document_processing_queue` - Async processing

### Storage Buckets Created
- ✅ `documents` - User uploaded files (10MB limit)
- ✅ `generated-pdfs` - AI-generated documents (5MB limit)
- ✅ `user-logos` - White-label logos (2MB limit)
- ✅ `global-documents` - Shared files (10MB limit)

### Frontend Hooks
- ✅ `lib/hooks/useUnifiedAuth.ts` - Unified authentication with role/subscription checks

---

## 📚 Full Documentation

For complete details, see:

- **`INTEGRATION_COMPLETE.md`** - Full completion summary
- **`UNIFIED_AUTH_INTEGRATION_GUIDE.md`** - Comprehensive integration guide
- **`ENV_VARIABLES_GUIDE.md`** - Environment configuration
- **`STRIPE_WEBHOOK_INTEGRATION.md`** - Webhook setup details
- **`DOC_AI_MIGRATION_ANALYSIS.md`** - Architecture analysis

---

## ✅ Success Criteria

Deployment is successful when:

1. ✅ All database migrations run without errors
2. ✅ Verification script shows "✅ READY FOR USE"
3. ✅ AI chat endpoint returns responses
4. ✅ Document generation creates markdown content
5. ✅ Stripe checkout creates sessions
6. ✅ Webhooks update `users` table with subscription data
7. ✅ Activity logs being created for all actions
8. ✅ Storage buckets accessible and RLS policies working

---

**Ready to deploy!** 🚀

**Questions?** Review the full documentation or contact the development team.

**Last Updated:** 2025-10-02
**Status:** ✅ Production-Ready
