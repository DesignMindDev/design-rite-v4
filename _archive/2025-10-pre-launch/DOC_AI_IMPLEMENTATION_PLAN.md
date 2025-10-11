# Document AI Complete Implementation Plan

**Date:** 2025-10-02
**Target Launch:** Mid-March 2025
**Scope:** Full subscription platform with future e-commerce readiness

---

## 📊 PRICING STRUCTURE (From Published Page)

### Current Published Prices
- **Starter:** $49/month ($490/year - save 2 months)
  - 25 assessments/month
  - Basic features
  - 30-day free trial

- **Professional:** $149/month ($1,490/year - save 2 months) **[Most Popular]**
  - Unlimited assessments
  - White-label branding
  - Priority support

- **Enterprise:** $499/month ($4,990/year - save 2 months)
  - Multi-site management
  - Dedicated account manager
  - Custom integrations

### Document AI Subscription Mapping
**Old (Document AI):** Base ($0), Pro ($99), Enterprise ($299)
**New (Published):** Starter ($49), Professional ($149), Enterprise ($499)

**Note:** Document AI features should align with Starter/Professional tiers.

---

## 🎯 IMPLEMENTATION PHASES (Logical Order)

### **Phase 1: Database & Auth Migration** ✅ PRIORITY
**Goal:** Migrate Document AI to use dev team's Supabase Auth system

**Tasks:**
1. Run Supabase Auth migration SQL
2. Update `useUnifiedAuth` hook to use Supabase client
3. Update Document AI API routes (chat, documents, generate)
4. Test authentication flow
5. Verify role-based access works

**Files to modify:**
- `lib/hooks/useUnifiedAuth.ts` → Use `@supabase/auth-helpers-nextjs`
- `app/api/doc-ai-chat/route.ts` → Use dev team's `.supabase.ts` template
- `app/api/doc-ai/upload-document/route.ts` → Supabase Auth
- `app/api/doc-ai/generate-document/route.ts` → Supabase Auth
- `app/doc-ai/layout.tsx` → Verify access control

**Estimated time:** 4-6 hours

---

### **Phase 2: Update Pricing to Match Published Page** 💰
**Goal:** Align Document AI subscription prices with public pricing page

**Tasks:**
1. Update `app/doc-ai/subscription/page.tsx` pricing display
2. Update Stripe Price IDs (need actual IDs from Stripe dashboard)
3. Map features correctly: Starter → Professional → Enterprise
4. Update checkout flow to use correct prices

**Changes:**
```typescript
// OLD pricing (Document AI)
Base: $0, Pro: $99, Enterprise: $299

// NEW pricing (Published)
Starter: $49, Professional: $149, Enterprise: $499
```

**Files to modify:**
- `app/doc-ai/subscription/page.tsx` - Update plan definitions
- `app/api/doc-ai/create-checkout/route.ts` - Update Stripe Price IDs

**Estimated time:** 1-2 hours

---

### **Phase 3: Admin Subscription Management Panel** 🛠️
**Goal:** Comprehensive admin tools to manage all subscriptions

**Location:** `/admin/subscriptions/page.tsx` (new file)

**Features Required:**
1. **Subscriber Dashboard**
   - View all subscribers in table
   - Columns: Email, Company, Plan, Status, MRR, Start Date, Last Payment
   - Search by email/company
   - Filter: Active, Cancelled, Past Due, Trial, All
   - Export to CSV

2. **Subscriber Details Modal**
   - View subscription history
   - Payment history
   - Document usage stats (from `generated_documents`)
   - Chat usage (from `ai_sessions`)
   - Activity logs

3. **Subscription Actions**
   - Manual plan change (upgrade/downgrade)
   - Pause subscription
   - Cancel subscription
   - Issue refund
   - Extend trial
   - Send renewal reminder email
   - Reset password

4. **Analytics Dashboard**
   - **MRR** (Monthly Recurring Revenue)
   - **Churn Rate** (% cancellations per month)
   - **Trial Conversion Rate** (% trials → paid)
   - **LTV** (Lifetime Value)
   - **New Subscribers** (this month)
   - **Revenue Chart** (last 12 months)

5. **Subscription Management**
   - Create manual subscription (comp accounts)
   - Bulk operations (cancel, refund, email)
   - Failed payment handling
   - Dunning management (retry failed payments)

**Database Views Needed:**
```sql
-- Admin analytics view
CREATE VIEW admin_subscription_analytics AS
SELECT
  COUNT(*) FILTER (WHERE status = 'active') as active_count,
  COUNT(*) FILTER (WHERE status = 'trialing') as trial_count,
  COUNT(*) FILTER (WHERE status = 'past_due') as past_due_count,
  SUM(amount) FILTER (WHERE status = 'active') as mrr,
  AVG(EXTRACT(EPOCH FROM (NOW() - created_at))/86400) as avg_customer_age_days
FROM subscriptions;

-- Subscriber list view
CREATE VIEW admin_subscriber_list AS
SELECT
  u.id, u.email, p.company, s.tier, s.status, s.amount, s.created_at,
  (SELECT MAX(created_at) FROM payments WHERE user_id = u.id) as last_payment,
  (SELECT COUNT(*) FROM generated_documents WHERE user_id = u.id) as doc_count
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.id
LEFT JOIN subscriptions s ON u.id = s.user_id;
```

**Estimated time:** 8-10 hours

---

### **Phase 4: Restore Sign In Utility Menu** 🔐
**Goal:** Add "Sign In" option to navigation for subscriber login

**Options:**
1. **Restore Old Utility Menu** (Help/Subscribe/Login)
2. **Add to UnifiedNavigation dropdown**
3. **Standalone "Sign In" button in header**

**Recommended:** Option 1 - Restore utility menu

**Implementation:**
```typescript
// app/components/UnifiedNavigation.tsx
// Add utility menu to top right:
<div className="flex items-center gap-2">
  <Link href="/help">Help</Link>
  <Link href="/pricing">Subscribe</Link>
  <Link href="/login">Sign In</Link> {/* → /doc-ai/chat if authenticated */}
</div>
```

**Login Flow:**
1. User clicks "Sign In"
2. If not authenticated → `/login` page (create new sign-in page)
3. If authenticated → redirect to `/doc-ai/chat`
4. If admin → redirect to `/admin/super`

**New Files Needed:**
- `/app/login-portal/page.tsx` - Public login page (not admin login)
- Link admin login at `/admin/login` (already exists)

**Estimated time:** 2-3 hours

---

### **Phase 5: Stripe Webhook Handler** 💳
**Goal:** Process real Stripe subscription events

**Webhook Events to Handle:**
1. `checkout.session.completed` - Create subscription
2. `customer.subscription.created` - New subscription
3. `customer.subscription.updated` - Plan change, status update
4. `customer.subscription.deleted` - Cancellation
5. `invoice.payment_succeeded` - Successful payment
6. `invoice.payment_failed` - Failed payment
7. `customer.subscription.trial_will_end` - Trial ending soon

**File:** `app/api/webhooks/stripe/route.ts`

**Database Updates on Webhook:**
```typescript
// On subscription created
- Insert into `subscriptions` table
- Update `profiles.subscription_tier`
- Update `profiles.subscription_status`
- Create payment record
- Log activity

// On payment succeeded
- Insert into `payments` table
- Update subscription next_billing_date
- Send receipt email

// On payment failed
- Update subscription status to 'past_due'
- Send dunning email
- Retry payment (Stripe handles this)

// On cancellation
- Update subscription status to 'cancelled'
- Set cancellation_date
- Send exit survey email
```

**Security:**
```typescript
// Verify Stripe signature
const sig = headers().get('stripe-signature');
const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
```

**Estimated time:** 3-4 hours

---

### **Phase 6: Subscription Database Tables** 🗄️
**Goal:** Create comprehensive subscription schema (e-commerce ready)

**Tables to Create:**

#### 1. `subscriptions` table
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  tier TEXT CHECK (tier IN ('starter', 'professional', 'enterprise')),
  status TEXT CHECK (status IN ('active', 'trialing', 'past_due', 'cancelled', 'paused')),
  amount INTEGER, -- in cents
  billing_period TEXT CHECK (billing_period IN ('monthly', 'annual')),
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 2. `payments` table
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  stripe_payment_intent_id TEXT UNIQUE,
  amount INTEGER, -- in cents
  currency TEXT DEFAULT 'usd',
  status TEXT CHECK (status IN ('succeeded', 'pending', 'failed', 'refunded')),
  description TEXT,
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 3. `subscription_history` table (audit log)
```sql
CREATE TABLE subscription_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  subscription_id UUID REFERENCES subscriptions(id),
  action TEXT CHECK (action IN ('created', 'upgraded', 'downgraded', 'cancelled', 'reactivated', 'payment_failed')),
  old_tier TEXT,
  new_tier TEXT,
  old_status TEXT,
  new_status TEXT,
  reason TEXT,
  performed_by UUID REFERENCES auth.users(id), -- admin who made change (if manual)
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 4. `products` table (for future e-commerce)
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stripe_product_id TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('subscription', 'physical', 'digital', 'service')),
  category TEXT, -- 'subscription', 'camera', 'nvr', 'access_control', etc.
  price INTEGER, -- in cents
  currency TEXT DEFAULT 'usd',
  stock_quantity INTEGER, -- null for unlimited/subscriptions
  sku TEXT UNIQUE,
  vendor TEXT, -- for dropship items
  vendor_cost INTEGER, -- wholesale cost
  margin_percent NUMERIC(5,2), -- profit margin
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 5. `orders` table (for future e-commerce)
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  order_number TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  total_amount INTEGER, -- in cents
  shipping_amount INTEGER,
  tax_amount INTEGER,
  status TEXT CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  shipping_address JSONB,
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### 6. `order_items` table
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price INTEGER, -- in cents (at time of purchase)
  total_price INTEGER, -- quantity * unit_price
  vendor TEXT, -- for dropship
  vendor_status TEXT, -- 'pending', 'ordered', 'shipped'
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Indexes:**
```sql
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_payments_user ON payments(user_id);
CREATE INDEX idx_payments_subscription ON payments(subscription_id);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

**RLS Policies:**
```sql
-- Users can view their own subscriptions
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can view all
CREATE POLICY "Admins can view all subscriptions"
  ON subscriptions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
    )
  );
```

**Estimated time:** 2-3 hours

---

### **Phase 7: Integration Testing & Commit** ✅
**Goal:** Test complete end-to-end flow and commit to GitHub

**Test Scenarios:**
1. **Public User Flow**
   - Visit `/pricing` → Click "Start Free Trial"
   - Redirects to `/login-portal` → Creates account
   - Stripe checkout → Enters card
   - Webhook received → Subscription created
   - Redirects to `/doc-ai/chat` → Can use features

2. **Subscription Management**
   - User visits `/doc-ai/subscription`
   - Views current plan
   - Clicks "Upgrade to Professional"
   - Completes checkout
   - Plan upgrades immediately

3. **Admin Management**
   - Admin logs in at `/admin/login`
   - Visits `/admin/subscriptions`
   - Views all subscribers
   - Manually changes user plan
   - Cancels subscription
   - Issues refund

4. **Webhook Handling**
   - Test payment succeeded
   - Test payment failed
   - Test subscription cancelled
   - Test trial ending

**Commit Strategy:**
```bash
git add .
git commit -m "feat: Complete Document AI subscription platform with admin panel

- Migrate to Supabase Auth (dev team's unified schema)
- Update pricing to match published page ($49/$149/$499)
- Create comprehensive admin subscription management panel
- Add Sign In utility menu for public access
- Build Stripe webhook handler for real subscriptions
- Create e-commerce-ready database schema
- Implement end-to-end subscription flow

Ready for soft launch testing (March 2025 target)"
```

**Estimated time:** 4-5 hours

---

## 📅 TIMELINE ESTIMATE

| Phase | Time | Completion |
|-------|------|------------|
| Phase 1: Database & Auth Migration | 4-6 hours | Week 1 |
| Phase 2: Update Pricing | 1-2 hours | Week 1 |
| Phase 3: Admin Panel | 8-10 hours | Week 2-3 |
| Phase 4: Sign In Menu | 2-3 hours | Week 3 |
| Phase 5: Stripe Webhooks | 3-4 hours | Week 4 |
| Phase 6: Database Tables | 2-3 hours | Week 4 |
| Phase 7: Testing & Commit | 4-5 hours | Week 5 |
| **TOTAL** | **24-33 hours** | **5 weeks** |

**Launch Ready:** Early February 2025
**Buffer for Testing:** 4-6 weeks
**Public Launch:** **Mid-March 2025** ✅

---

## 🛒 FUTURE E-COMMERCE NOTES

### Equipment Sales Integration
**Ready for:**
- Physical product sales (cameras, NVRs, access control)
- Dropship vendor integration
- Inventory tracking
- Order fulfillment

**Phase 8 (Post-Launch):**
1. Add product catalog UI
2. Shopping cart functionality
3. Vendor API integrations
4. Shipping integrations (UPS, FedEx, USPS)
5. Tax calculation (TaxJar, Avalara)

**Database:** Already prepared with `products`, `orders`, `order_items` tables

---

## 🔒 SECURITY CHECKLIST

- [ ] Stripe webhook signature verification
- [ ] RLS policies on all subscription tables
- [ ] Rate limiting on API endpoints
- [ ] Prevent subscription manipulation by non-admins
- [ ] Secure Stripe Price IDs (not hardcoded)
- [ ] PCI compliance (no card data stored)
- [ ] GDPR compliance (data export/deletion)
- [ ] User consent for emails

---

## 📧 EMAIL NOTIFICATIONS NEEDED

1. **Welcome email** (after signup)
2. **Trial ending reminder** (7 days before)
3. **Payment succeeded receipt**
4. **Payment failed dunning** (retry reminder)
5. **Subscription cancelled confirmation**
6. **Refund processed**
7. **Plan upgraded/downgraded**
8. **Password reset**

**Integration:** Use Resend, SendGrid, or Postmark

---

## 🎯 SUCCESS METRICS (Post-Launch)

**Week 1:**
- 10 beta signups
- 5 paid subscriptions
- 0 critical bugs

**Month 1:**
- 50+ paid subscribers
- $5K+ MRR
- 80%+ trial conversion rate

**Month 3 (March Launch):**
- 200+ subscribers
- $20K+ MRR
- <5% churn rate
- Public launch marketing campaign

---

**Ready to execute! Let's start with Phase 1.**
