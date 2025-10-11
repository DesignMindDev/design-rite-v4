# Document AI Authentication & Subscription Strategy

**Date:** 2025-10-02
**Status:** Pre-Launch Planning
**Decision:** Hidden Dev Access with Future Public Launch

---

## 🎯 CURRENT SITUATION

### What We Just Built
- **4 Document AI Pages**: Chat, Documents, Library, Subscription
- **Styled to match**: Light Design-Rite brand (white backgrounds, clean UI)
- **Files created**: `app/doc-ai/` directory (not yet committed)
- **Auth hook used**: `useUnifiedAuth` (Next-Auth based)

### What the Dev Team Built
- **Supabase Auth Migration**: Complete migration from Next-Auth → Supabase Auth
- **Database schema**: Unified `profiles` table, role-based permissions, rate limiting
- **User migration script**: Ready to migrate existing users
- **API templates**: Supabase Auth-ready API routes

---

## 🔐 AUTHENTICATION ARCHITECTURE ANALYSIS

### Option A: Current State (Next-Auth)
**What we're using now:**
```typescript
// lib/hooks/useUnifiedAuth.ts - Next-Auth based
const auth = useUnifiedAuth();
// Uses: next-auth/react → useSession()
// Database: Uses old 'users' table
```

**Document AI pages use:**
```typescript
import { useUnifiedAuth } from '@/lib/hooks/useUnifiedAuth';
const auth = useUnifiedAuth();
if (!auth.isAuthenticated) return <LoginPage />;
```

### Option B: Dev Team's Solution (Supabase Auth)
**What the dev team prepared:**
```typescript
// Supabase Auth approach
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
const supabase = createRouteHandlerClient({ cookies });
const { data: { session } } = await supabase.auth.getSession();
// Database: Uses 'profiles' table (unified schema)
```

**Migration files ready:**
- ✅ `supabase/migrations/SUPABASE_AUTH_001_unify_schema.sql` (600+ lines)
- ✅ `scripts/migrate-users-to-supabase-auth.ts` (350+ lines)
- ✅ `app/api/doc-ai-chat/route.supabase.ts` (500+ lines template)

---

## 🚧 CRITICAL INTEGRATION ISSUES

### Issue #1: Auth System Mismatch
**Problem:** Document AI pages use `useUnifiedAuth` (Next-Auth) but dev team built Supabase Auth migration.

**Impact:**
- ❌ Document AI won't work with Supabase Auth system
- ❌ User roles/permissions won't sync properly
- ❌ Subscription status checks may fail

**Current Auth Flow:**
```
Document AI Pages (useUnifiedAuth)
  → Next-Auth session (next-auth/react)
    → Old 'users' table
      → Doesn't use 'profiles' or Supabase Auth
```

**Dev Team's Auth Flow:**
```
Supabase Auth
  → auth.users (Supabase managed)
    → profiles table (unified schema)
      → role-based permissions
        → rate limiting
```

### Issue #2: Database Schema Conflict
**Document AI expects:**
- `users` table with `subscriptionTier`, `subscriptionStatus`, `stripeCustomerId`
- Direct queries to `users` table

**Dev Team's schema:**
- `profiles` table with extended fields
- `user_roles` table for role assignments
- `permissions` table for feature access
- Rate limiting in `usage_tracking`

### Issue #3: Subscription Management
**Current Document AI pages:**
- ✅ Display subscription tiers (Base, Pro, Enterprise)
- ✅ Show current plan status
- ✅ Upgrade buttons with Stripe integration
- ❌ But... no actual subscription table in Supabase
- ❌ No Stripe webhook handlers
- ❌ No subscription update logic

---

## 🎭 PROPOSED SOLUTION: Hidden Dev Access

### Phase 1: Hidden Launch (Now)
**Hide Document AI from public but allow dev/admin access**

#### 1. Create Hidden Entry Point
```typescript
// app/components/UnifiedNavigation.tsx
// Instead of "Sign In" button, use a hidden emoji trigger

// Option 1: Hidden URL
// Navigate to: /doc-ai/chat (direct URL, no menu link)

// Option 2: Easter Egg Button
// Click the logo 5 times → shows "🎓 Dev Mode" button
// Click "🎓" → unlocks /doc-ai access

// Option 3: Query Parameter
// Add ?dev=true to any URL → shows Document AI in menu
```

#### 2. Gate Document AI Pages
```typescript
// app/doc-ai/layout.tsx
export default function DocAILayout({ children }) {
  const auth = useUnifiedAuth();

  // Only allow admins and super admins
  if (!auth.isAdmin && !auth.isSuperAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Coming Soon
          </h1>
          <p className="text-gray-600">
            Document AI subscription features launching Q2 2025
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
```

#### 3. Admin Login Flow
**Current login page:** `/admin/login` (dark theme, exists)
- Already configured with Next-Auth
- Redirects to `/admin/super` after login
- Works with existing `users` table

**Keep this for now:**
- Admins can log in at `/admin/login`
- After login, they can navigate to `/doc-ai/chat` directly
- Document AI pages check `auth.isAdmin` for access

### Phase 2: Fix Auth Integration (Before Public Launch)

#### Option A: Adapt Document AI to Supabase Auth
**Pros:**
- Uses dev team's unified schema
- Proper role-based permissions
- Rate limiting built-in

**Steps:**
1. Run Supabase Auth migration SQL
2. Update `useUnifiedAuth` to use Supabase Auth client
3. Update Document AI API routes to use Supabase client
4. Migrate existing users

**Estimated time:** 4-6 hours

#### Option B: Keep Next-Auth, Add Subscription Schema
**Pros:**
- Don't need to migrate auth system
- Document AI works as-is

**Steps:**
1. Add subscription tables to Supabase
2. Create Stripe webhook handlers
3. Update `users` table with subscription fields

**Estimated time:** 2-3 hours

---

## 💰 SUBSCRIPTION MANAGEMENT REQUIREMENTS

### What's Missing for Real Subscriptions
1. **Stripe Integration**
   - ❌ Stripe webhook handler (`/api/webhooks/stripe`)
   - ❌ Checkout session creation (exists but untested)
   - ❌ Subscription status sync
   - ❌ Customer portal link

2. **Database Tables**
   - ❌ `subscriptions` table
   - ❌ `subscription_history` table
   - ❌ `invoices` table

3. **Admin Management**
   - ❌ Admin panel to view all subscriptions
   - ❌ Manual subscription override
   - ❌ Refund/cancel functionality

### What Works Now
- ✅ Display subscription tiers
- ✅ Feature comparison
- ✅ Upgrade button UI
- ✅ Current plan display

---

## 🎓 RECOMMENDED IMPLEMENTATION: Graduate Emoji

### Step 1: Add Hidden Dev Button
```typescript
// app/components/UnifiedNavigation.tsx
const [clickCount, setClickCount] = useState(0);
const [showDevMode, setShowDevMode] = useState(false);

const handleLogoClick = () => {
  setClickCount(prev => {
    const newCount = prev + 1;
    if (newCount >= 5) {
      setShowDevMode(true);
      return 0;
    }
    return newCount;
  });
};

// In the header
<div onClick={handleLogoClick} className="cursor-pointer">
  <Image src="/logo.png" alt="Design-Rite" />
</div>

// Show dev button if clicked 5 times OR if user is admin
{(showDevMode || auth.isAdmin) && (
  <Link href="/doc-ai/chat" className="flex items-center gap-2">
    🎓 Document AI
  </Link>
)}
```

### Step 2: Gate Document AI Pages
```typescript
// app/doc-ai/layout.tsx - Add access control
if (!auth.isAdmin && !auth.isSuperAdmin) {
  return <ComingSoonPage />;
}
```

### Step 3: When Ready for Public Launch
**Just change the button:**
```typescript
// Remove hidden trigger
// Change "🎓 Document AI" → "Sign In"
// Point to public subscription page
```

---

## 📊 ADMIN SUBSCRIPTION MANAGEMENT

### Admin Panel Requirements
**Location:** `/admin/subscriptions` (new page needed)

**Features needed:**
1. **View All Subscribers**
   - Table: Email, Plan, Status, MRR, Start Date, Last Payment
   - Filters: Active, Cancelled, Past Due, All
   - Search by email/company

2. **Subscriber Details**
   - View subscription history
   - See payment history
   - View document usage stats
   - Manual plan override

3. **Actions**
   - Pause subscription
   - Cancel subscription
   - Refund payment
   - Change plan manually
   - Send renewal reminder

4. **Analytics Dashboard**
   - MRR (Monthly Recurring Revenue)
   - Churn rate
   - Trial conversion rate
   - Average customer lifetime value

---

## 🚀 DEPLOYMENT STRATEGY

### Immediate (This Week)
1. ✅ Commit Document AI pages (hidden from public)
2. ✅ Add hidden access for admins
3. ⏳ Test internal subscription flow
4. ⏳ Verify Stripe test mode works

### Short-term (1-2 Weeks)
1. ⏳ Decide: Next-Auth vs Supabase Auth
2. ⏳ Implement chosen auth system
3. ⏳ Add Stripe webhook handler
4. ⏳ Create subscription tables
5. ⏳ Build admin subscription panel

### Before Public Launch (4-6 Weeks)
1. ⏳ Complete auth migration (if Supabase)
2. ⏳ Test complete signup → payment → access flow
3. ⏳ Add usage tracking and rate limiting
4. ⏳ Create customer billing portal
5. ⏳ Legal: Terms of Service, Privacy Policy for subscriptions
6. ⏳ Change 🎓 button → "Sign In" for public

---

## 🤔 DECISION NEEDED

### Question 1: Which Auth System?
**Option A: Migrate to Supabase Auth** (dev team's work)
- ✅ Unified schema, role-based permissions, rate limiting built-in
- ❌ 4-6 hours to migrate Document AI pages
- ❌ Need to test thoroughly

**Option B: Keep Next-Auth**
- ✅ Document AI works as-is
- ❌ Need to add subscription schema manually
- ❌ Less integrated with dev team's work

**Recommendation:** **Option A** - The dev team built a comprehensive system. Use it.

### Question 2: When to Launch Publicly?
**Option 1: Soft Launch (4 weeks)**
- Internal testing only
- Invite beta users manually
- Fix issues before public launch

**Option 2: Public Launch (6-8 weeks)**
- Complete auth migration
- Full Stripe integration
- Admin panel complete
- Marketing materials ready

**Recommendation:** **Option 1** - Soft launch to beta users first

### Question 3: Subscription Pricing?
**Current Display:**
- Base: $0/month (5 docs, 5 chats)
- Pro: $99/month (unlimited)
- Enterprise: $299/month (custom)

**Need to confirm:**
- Are these real prices?
- What are the actual Stripe Price IDs?
- Do we want a trial period?

---

## 📝 IMMEDIATE NEXT STEPS

1. **Review this analysis** - Discuss auth system choice
2. **Commit Document AI pages** - With admin-only access
3. **Add hidden access method** - Graduate emoji or direct URL
4. **Create admin subscription panel** - Basic view
5. **Test internal flow** - Admin login → Document AI → Subscription display

---

## 🎯 SUCCESS CRITERIA

**Phase 1 Complete (Hidden Launch):**
- ✅ Document AI pages accessible by admins only
- ✅ Subscription display works
- ✅ No public menu links
- ✅ Hidden access method works

**Phase 2 Complete (Full Integration):**
- ✅ Auth system unified (Supabase or Next-Auth decided)
- ✅ Stripe webhooks working
- ✅ Users can subscribe and access features
- ✅ Admin can manage subscriptions

**Phase 3 Complete (Public Launch):**
- ✅ "Sign In" button in navigation
- ✅ Public signup flow works
- ✅ Payment processing works
- ✅ Usage tracking and rate limiting active
- ✅ Customer billing portal live

---

**Let's discuss and decide on the auth system before committing!**
