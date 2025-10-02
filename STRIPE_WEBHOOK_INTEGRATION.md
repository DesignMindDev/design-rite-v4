# Stripe Webhook Integration for Document AI
## Extending Existing Design-Rite Webhook

**File:** `app/api/stripe/webhook/route.ts`
**Status:** Enhancement Required (NOT a new file)

---

## 📋 Overview

Design-Rite already has a Stripe webhook handler at `/api/stripe/webhook/route.ts`. Instead of creating a duplicate, we'll **extend the existing webhook** to also handle Document AI subscriptions.

The existing webhook writes to `user_profiles` table. We've created handlers that write to the unified `users` table for Document AI.

---

## 🔧 Integration Steps

### **Step 1: Import Document AI Handlers**

Add this import at the top of `app/api/stripe/webhook/route.ts`:

```typescript
import {
  handleDocAICheckoutCompleted,
  handleDocAISubscriptionUpdated,
  handleDocAISubscriptionDeleted,
  handleDocAIPaymentSucceeded,
  handleDocAIPaymentFailed
} from '@/lib/stripe-doc-ai-handler';
```

### **Step 2: Enhance Event Handlers**

Modify the `switch` statement in the `POST` function to call both existing and Doc AI handlers:

#### **Before (existing code):**
```typescript
switch (event.type) {
  case 'customer.subscription.created':
  case 'customer.subscription.updated':
    await handleSubscriptionChange(event.data.object as Stripe.Subscription)
    break

  case 'customer.subscription.deleted':
    await handleSubscriptionCanceled(event.data.object as Stripe.Subscription)
    break

  case 'invoice.payment_succeeded':
    await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
    break

  case 'invoice.payment_failed':
    await handlePaymentFailed(event.data.object as Stripe.Invoice)
    break

  default:
    console.log(`Unhandled event type: ${event.type}`)
}
```

#### **After (enhanced code):**
```typescript
switch (event.type) {
  case 'checkout.session.completed':
    // NEW: Handle Document AI checkout completion
    await handleDocAICheckoutCompleted(event.data.object as Stripe.Checkout.Session)
    break

  case 'customer.subscription.created':
  case 'customer.subscription.updated':
    // Existing: Design-Rite subscriptions
    await handleSubscriptionChange(event.data.object as Stripe.Subscription)
    // NEW: Document AI subscriptions
    await handleDocAISubscriptionUpdated(event.data.object as Stripe.Subscription)
    break

  case 'customer.subscription.deleted':
    // Existing: Design-Rite subscriptions
    await handleSubscriptionCanceled(event.data.object as Stripe.Subscription)
    // NEW: Document AI subscriptions
    await handleDocAISubscriptionDeleted(event.data.object as Stripe.Subscription)
    break

  case 'invoice.payment_succeeded':
    // Existing: Design-Rite payments
    await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
    // NEW: Document AI payments
    await handleDocAIPaymentSucceeded(event.data.object as Stripe.Invoice)
    break

  case 'invoice.payment_failed':
    // Existing: Design-Rite payments
    await handlePaymentFailed(event.data.object as Stripe.Invoice)
    // NEW: Document AI payments
    await handleDocAIPaymentFailed(event.data.object as Stripe.Invoice)
    break

  default:
    console.log(`Unhandled event type: ${event.type}`)
}
```

---

## ✅ **Why This Approach?**

1. **No Duplication:** Reuses existing webhook endpoint
2. **No Conflicts:** Both handlers can run in parallel
3. **Gradual Migration:** Document AI handlers only affect `users` table, existing handlers only affect `user_profiles`
4. **Easy Rollback:** Simply remove the new handler calls if needed

---

## 🧪 **Testing**

### **Local Testing with Stripe CLI**

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3010/api/stripe/webhook

# Trigger test events
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_succeeded
```

### **Verify Database Updates**

After triggering webhooks, check that both tables are updated:

```sql
-- Check user_profiles table (existing Design-Rite)
SELECT email, subscription_status, plan_name
FROM user_profiles
WHERE email = 'test@example.com';

-- Check users table (new Document AI)
SELECT email, subscription_tier, subscription_status, stripe_customer_id
FROM users
WHERE email = 'test@example.com';
```

---

## 📊 **Data Flow Diagram**

```
Stripe Webhook Event
         │
         ├─> handleSubscriptionChange()
         │   └─> Updates user_profiles table (existing)
         │
         └─> handleDocAISubscriptionUpdated()
             └─> Updates users table (new)
                 └─> Logs to activity_logs
```

---

## 🔍 **Handler Behavior**

### **handleDocAICheckoutCompleted()**
- **Trigger:** `checkout.session.completed`
- **Action:**
  - Retrieves subscription details
  - Maps price ID to tier (base/pro/enterprise)
  - Updates `users.subscription_tier` and `users.subscription_status`
  - Logs activity to `activity_logs`

### **handleDocAISubscriptionUpdated()**
- **Trigger:** `customer.subscription.updated`
- **Action:**
  - Updates tier if price changed (upgrade/downgrade)
  - Updates status (active/cancelled/past_due)
  - Logs subscription change

### **handleDocAISubscriptionDeleted()**
- **Trigger:** `customer.subscription.deleted`
- **Action:**
  - Downgrades user to 'base' tier
  - Sets status to 'cancelled'
  - Logs cancellation

### **handleDocAIPaymentSucceeded()**
- **Trigger:** `invoice.payment_succeeded`
- **Action:**
  - Ensures subscription_status = 'active'

### **handleDocAIPaymentFailed()**
- **Trigger:** `invoice.payment_failed`
- **Action:**
  - Sets subscription_status = 'past_due'
  - Logs failure for follow-up

---

## 🚨 **Important Notes**

1. **Customer Metadata:** Ensure all Stripe customers have `userId` in metadata for lookup
2. **Price IDs:** Configure in `admin_settings` table or environment variables
3. **Error Handling:** All handlers use try-catch to prevent webhook failures
4. **Non-Blocking:** Handlers run in parallel, failures in one don't affect the other

---

## 🔑 **Environment Variables**

Add these to `.env.local` if not already present:

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Optional: Price IDs (can also be stored in admin_settings table)
STRIPE_PRICE_BASE=price_base_...
STRIPE_PRICE_PRO=price_pro_...
STRIPE_PRICE_ENTERPRISE=price_enterprise_...
```

---

## 📝 **Deployment Checklist**

- [ ] Import Document AI handlers in webhook route
- [ ] Add new event handlers to switch statement
- [ ] Configure Stripe webhook in dashboard to send events to `/api/stripe/webhook`
- [ ] Add price IDs to `admin_settings` table or environment variables
- [ ] Test with Stripe CLI locally
- [ ] Deploy to staging
- [ ] Verify webhooks working in Stripe dashboard
- [ ] Monitor `activity_logs` table for subscription events
- [ ] Deploy to production

---

**Status:** Ready to integrate
**Estimated Time:** 30 minutes
**Risk Level:** Low (non-breaking changes)
