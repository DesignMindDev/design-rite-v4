# Design-Rite Subscriber Portal - Project Plan

**Project**: Subscriber Self-Service Portal Microservice Integration
**Date Created**: October 7, 2025
**Project Owner**: Dan Kozich
**Technical Implementation**: Claude Code AI
**Admin Team Lead**: Phil Lisk
**Target Launch**: October 18, 2025 (10 business days)

---

## 📋 EXECUTIVE SUMMARY

### Project Overview
We are integrating a comprehensive subscriber self-service portal as a standalone microservice to enable customers to manage their accounts, subscriptions, and access professional business tools. This portal was developed by an external dev team (designalmostright-review repo running on port 8081) and includes all essential subscriber-facing features.

### Strategic Decision: Keep AI Assistants from V4
- **KEEPING**: Your 3 working AI assistants from V4 `/estimate-options` flow
- **REMOVING**: Dev team's AI chat assistant from their app
- **RESULT**: Best of both worlds - proven subscriber UI + your working AI tools

### Business Goals
1. **Enable subscriber self-service** - Profile management, subscription upgrades, billing updates
2. **Provide Pro/Enterprise tools** - Invoice generator, proposal generator, business calculators
3. **Reduce admin overhead** - Automated subscription management, usage tracking
4. **Accelerate launch timeline** - Leverage existing working code vs building from scratch
5. **Maintain architecture flexibility** - Microservices allow independent updates and scaling

### Key Technology Decisions

**Microservices Architecture** ✅
- **Main Platform (V4)**: Security estimation, AI discovery assistants, admin business dashboard
- **Subscriber Portal**: Profile, subscription, business tools, analytics
- **Shared Backend**: Single Supabase database, authentication, and Stripe integration
- **Seamless UX**: Users navigate between services transparently with single sign-on

**Why Microservices Won**:
- ✅ No Vite→Next.js conversion (messy, risky, time-consuming)
- ✅ Keep dev team's code as-is (React + Vite working perfectly)
- ✅ Easier to innovate on each service independently
- ✅ Cleaner architecture, better scaling
- ✅ Faster to launch (days vs weeks)

---

## 🏗️ SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────────┐
│                  DESIGN-RITE ECOSYSTEM                          │
└─────────────────────────────────────────────────────────────────┘

PRODUCTION ENVIRONMENT
├── Main Platform (design-rite-v4)
│   ├── Port: 3000
│   ├── URL: www.design-rite.com
│   ├── Branch: main
│   ├── Render: design-rite-v4
│   ├── Supabase: aeorianxnxpxveoxzhov (Production)
│   └── Features:
│       ├── Security estimation tools
│       ├── AI discovery assistants (3 working ones)
│       ├── Admin business dashboard
│       ├── Spatial Studio integration
│       └── Links to Subscriber Portal
│
└── Subscriber Portal (design-rite-subscriber-portal)
    ├── Port: 3040
    ├── URL: portal.design-rite.com
    ├── Branch: main
    ├── Render: design-rite-subscriber-portal (NEW)
    ├── Supabase: aeorianxnxpxveoxzhov (Shared with V4)
    └── Features:
        ├── Profile management ✅
        ├── Subscription management ✅
        ├── Business tools (Invoice/Proposal/Calculators) ✅
        ├── Analytics dashboard ✅
        ├── Usage visualization ✅
        ├── Admin settings (Stripe, limits, invites) ✅
        └── Links back to Main Platform for AI

STAGING ENVIRONMENT (Mirrors Production)
├── V4 Staging (design-rite-v4-staging)
│   ├── URL: staging.design-rite.com (current URL)
│   ├── Branch: staging (ALREADY LIVE)
│   └── Supabase: ickwrbdpuorzdpzqbqpf (Validation Lab)
│
└── Subscriber Portal Staging (NEW)
    ├── URL: portal-staging.design-rite.com
    ├── Branch: staging
    └── Supabase: ickwrbdpuorzdpzqbqpf (Shared with V4 staging)
```

---

## 🎯 PROJECT MILESTONES

### ✅ Milestone 0: Documentation & Planning
**Duration**: Complete (Oct 7)
**Owner**: Technical Team
**Status**: 🟢 COMPLETE

**Deliverables**:
- [x] Dev team database schema documented (`DEV_TEAM_DATABASE_SCHEMA.md`)
- [x] Project plan created (this document)
- [x] Architecture confirmed
- [x] Team aligned on approach

---

### 📦 Milestone 1: Repository Setup & Cleanup
**Duration**: 1 day (Oct 7)
**Owner**: Technical Team
**Status**: 🟡 Ready to Start

#### Tasks

**1.1 Repository Decision** (30 mins)
- [ ] Decide: Repurpose `designalmostright-review` OR create new `design-rite-subscriber-portal` repo
- [ ] **Recommendation**: Repurpose existing (faster, code already working)
- [ ] If repurposing: Rename repo in GitHub to `design-rite-subscriber-portal`
- [ ] If new: Clone and clean up

**1.2 Repository Cleanup** (1 hour)
- [ ] Remove README.md (Supabase CLI readme)
- [ ] Create proper README for subscriber portal
- [ ] Update package.json name and description
- [ ] Clean up any dev notes or temporary files

**1.3 Git Branching** (30 mins)
- [ ] Ensure `main` branch is clean
- [ ] Create `staging` branch from `main`
- [ ] Create `feature/remove-ai-assistant` branch for cleanup work

**Deliverables**:
- [ ] Clean repository structure
- [ ] Proper branching strategy
- [ ] Updated project documentation

**Success Criteria**: Repository renamed, organized, and ready for code cleanup

**Dependencies**: None
**Risk Level**: Low
**Estimated Hours**: 2 hours

---

### 🧹 Milestone 2: Remove AI Assistant Code
**Duration**: 2 days (Oct 8-9)
**Owner**: Technical Team
**Status**: ⚪ Not Started

#### What's Being Removed

**Files to DELETE**:
```
src/pages/Chat.tsx                           // AI chat interface
src/components/chat/AssessmentForm.tsx       // If AI-specific
src/components/chat/PlatformHelpBubble.tsx   // If AI-specific
supabase/functions/ai-chat/                  // AI chat Edge Function
```

**Code to REMOVE** (partial file edits):
```
src/components/layout/Navigation.tsx
  - Remove "AI Chat" navigation link

src/App.tsx
  - Remove Chat import
  - Remove /chat route

src/hooks/ (review each):
  - Remove AI-specific hooks if any
```

**Tables/Functions to IGNORE** (keep but don't use):
```
chat_conversations       // May be reused later
chat_messages           // May be reused later
global_documents        // AI knowledge base (ignore for now)
```

#### What's Being KEPT

**All Profile/Subscription Pages**:
- ✅ `src/pages/Profile.tsx` - Complete profile management
- ✅ `src/pages/Subscription.tsx` - Subscription tiers & management
- ✅ `src/pages/Admin.tsx` - Admin configuration
- ✅ `src/pages/Analytics.tsx` - Usage analytics
- ✅ `src/pages/GetStarted.tsx` - Onboarding
- ✅ `src/pages/Theme.tsx` - Theme customization

**All Business Tools**:
- ✅ `src/pages/BusinessTools.tsx` - Business tools landing
- ✅ `src/components/business/InvoiceGenerator.tsx` - Invoice with logo
- ✅ `src/components/business/ProposalGenerator.tsx` - Proposals
- ✅ `src/components/business/BusinessCalculators.tsx` - Tax/ROI calcs

**All Admin Components**:
- ✅ `src/components/admin/StripeManager.tsx` - Stripe config
- ✅ `src/components/admin/UsageLimitsManager.tsx` - Feature limits
- ✅ `src/components/admin/InviteTokenManager.tsx` - User invites
- ✅ `src/components/admin/UserAnalytics.tsx` - User metrics
- ✅ `src/components/admin/GlobalAIDocumentUpload.tsx` - Global docs
- ✅ `src/components/admin/HelpfulDocumentUpload.tsx` - Help docs

**All Documents Features**:
- ✅ `src/pages/Documents.tsx` - Document management
- ✅ `src/components/documents/*` - All document components

**All Other Features**:
- ✅ Satellite Assessment pages
- ✅ PDF Extractor
- ✅ Voltage Calculator
- ✅ All authentication hooks
- ✅ All UI components (shadcn/ui)
- ✅ All Edge Functions except `ai-chat`

#### Tasks

**Day 1 (Oct 8)** - File Removal
- [ ] Delete `src/pages/Chat.tsx`
- [ ] Review and remove AI-specific chat components
- [ ] Delete `supabase/functions/ai-chat/`
- [ ] Remove AI chat navigation links from `Navigation.tsx`
- [ ] Remove chat route from `App.tsx`
- [ ] Test application compiles successfully
- [ ] Fix any broken imports

**Day 2 (Oct 9)** - Testing & Verification
- [ ] Run `npm run dev` and verify no errors
- [ ] Test all remaining pages load correctly:
  - [ ] Profile page
  - [ ] Subscription page
  - [ ] Business Tools (Invoice, Proposal, Calculators)
  - [ ] Admin panel
  - [ ] Documents page
  - [ ] Analytics page
- [ ] Verify navigation works (no broken links)
- [ ] Test authentication flow
- [ ] Document what was removed
- [ ] Commit changes to `feature/remove-ai-assistant` branch

**Deliverables**:
- [ ] AI assistant code removed
- [ ] Application compiles and runs
- [ ] All other features functional
- [ ] Documentation updated
- [ ] Branch ready for merge

**Success Criteria**: Clean application running locally, all non-AI features working perfectly

**Dependencies**: Milestone 1 complete
**Risk Level**: Medium (careful not to break other features)
**Estimated Hours**: 16 hours

---

### ⚙️ Milestone 3: Environment Configuration
**Duration**: 1 day (Oct 10)
**Owner**: Technical Team + Phil
**Status**: ⚪ Not Started

#### Environment Variables

**Production `.env`**:
```bash
# Supabase
VITE_SUPABASE_URL=https://aeorianxnxpxveoxzhov.supabase.co
VITE_SUPABASE_ANON_KEY=[production-anon-key]

# Stripe (configured in Supabase Edge Function secrets)
STRIPE_SECRET_KEY=[set in Supabase secrets]
VITE_STRIPE_PUBLISHABLE_KEY=[production-pk-live-key]
VITE_STRIPE_PRICE_ID_BASE=price_xxx_base
VITE_STRIPE_PRICE_ID_PRO=price_xxx_pro
VITE_STRIPE_PRICE_ID_ENTERPRISE=price_xxx_enterprise

# App Configuration
VITE_MAIN_PLATFORM_URL=https://www.design-rite.com
VITE_PORTAL_URL=https://portal.design-rite.com
VITE_APP_PORT=3040
```

**Staging `.env`**:
```bash
# Supabase Validation Lab
VITE_SUPABASE_URL=https://ickwrbdpuorzdpzqbqpf.supabase.co
VITE_SUPABASE_ANON_KEY=[validation-lab-anon-key]

# Stripe Test Mode
STRIPE_SECRET_KEY=[test-sk-key in Supabase secrets]
VITE_STRIPE_PUBLISHABLE_KEY=[test-pk-key]
VITE_STRIPE_PRICE_ID_BASE=price_xxx_base_test
VITE_STRIPE_PRICE_ID_PRO=price_xxx_pro_test
VITE_STRIPE_PRICE_ID_ENTERPRISE=price_xxx_enterprise_test

# App Configuration
VITE_MAIN_PLATFORM_URL=https://staging.design-rite.com
VITE_PORTAL_URL=https://portal-staging.design-rite.com
VITE_APP_PORT=3040
```

#### Tasks

**Morning (Oct 10)**
- [ ] Create `.env` file for production
- [ ] Create `.env.staging` file for staging
- [ ] Add `.env` to `.gitignore` (should already be)
- [ ] Document environment variables in README

**Afternoon (Oct 10)**
- [ ] Configure port 3040 in `vite.config.ts`
- [ ] Test local connection to production Supabase
- [ ] Test Stripe configuration
- [ ] Verify storage buckets accessible
- [ ] Test Edge Functions callable
- [ ] Run full local test

**Deliverables**:
- [ ] Environment files configured
- [ ] Local testing successful
- [ ] Documentation complete

**Success Criteria**: Application runs locally connected to production Supabase

**Dependencies**: Milestone 2 complete
**Risk Level**: Low
**Estimated Hours**: 8 hours

---

### 🔗 Milestone 4: Navigation Integration (V4 ↔ Portal)
**Duration**: 1 day (Oct 11)
**Owner**: Technical Team
**Status**: ⚪ Not Started

#### User Experience Flow

**New User Journey**:
1. User visits www.design-rite.com (V4)
2. Clicks "Try Platform" → `/estimate-options`
3. Completes AI Discovery (V4's working AI assistants)
4. Creates account → Redirected to **portal.design-rite.com/profile** for profile setup
5. Completes profile with logo upload
6. Redirected to **portal.design-rite.com/subscription** to choose tier
7. Completes Stripe checkout
8. Redirected back to **www.design-rite.com/dashboard**

**Existing User Journey**:
1. User logs in at www.design-rite.com
2. Dashboard shows cards:
   - "Start New Estimate" → V4
   - "View Profile" → portal.design-rite.com
   - "Business Tools" → portal.design-rite.com
   - "Manage Subscription" → portal.design-rite.com
3. User clicks "Business Tools"
4. Navigates to portal, generates invoice
5. Clicks "Back to Platform" → returns to V4

#### Changes to V4 Platform

**File**: `app/dashboard/page.tsx`
```typescript
// Add navigation cards
<Card onClick={() => window.location.href = 'https://portal.design-rite.com/profile'}>
  <CardHeader>
    <CardTitle>Manage Profile</CardTitle>
    <CardDescription>Update your company info and logo</CardDescription>
  </CardHeader>
</Card>

<Card onClick={() => window.location.href = 'https://portal.design-rite.com/subscription'}>
  <CardHeader>
    <CardTitle>Manage Subscription</CardTitle>
    <CardDescription>View usage, upgrade, or manage billing</CardDescription>
  </CardHeader>
</Card>

<Card onClick={() => window.location.href = 'https://portal.design-rite.com/business-tools'}>
  <Badge>Pro</Badge>
  <CardHeader>
    <CardTitle>Business Tools</CardTitle>
    <CardDescription>Generate invoices, proposals, and more</CardDescription>
  </CardHeader>
</Card>
```

**File**: `app/components/UnifiedNavigation.tsx`
```typescript
// Add to dropdown menu
<DropdownMenuItem onClick={() => window.location.href = 'https://portal.design-rite.com/business-tools'}>
  Business Tools
</DropdownMenuItem>
```

#### Changes to Subscriber Portal

**File**: `src/components/layout/Navigation.tsx`
```typescript
// Add navigation links back to V4
<Button onClick={() => window.location.href = 'https://www.design-rite.com/ai-assistant'}>
  AI Assistant
</Button>

<Button onClick={() => window.location.href = 'https://www.design-rite.com/estimate-options'}>
  New Estimate
</Button>

// Update logo link
<Logo onClick={() => window.location.href = 'https://www.design-rite.com'} />
```

**File**: `src/pages/BusinessTools.tsx`
```typescript
// Add "Back to Platform" button
<Button variant="outline" onClick={() => window.location.href = 'https://www.design-rite.com/dashboard'}>
  ← Back to Platform
</Button>
```

#### Tasks

- [ ] Update V4 dashboard with portal links
- [ ] Update V4 navigation with "Business Tools" item
- [ ] Update portal navigation with V4 links
- [ ] Update portal logo to link to V4
- [ ] Add "Back to Platform" buttons in portal
- [ ] Test authentication flow between services
- [ ] Verify Supabase session shared properly
- [ ] Test logout from either service

**Deliverables**:
- [ ] Navigation updated in both apps
- [ ] User flows tested and working
- [ ] Documentation updated

**Success Criteria**: Users navigate seamlessly between services without re-authenticating

**Dependencies**: Milestone 3 complete
**Risk Level**: Medium (auth session sharing)
**Estimated Hours**: 8 hours

---

### 🚀 Milestone 5: Production Deployment to Render
**Duration**: 2 days (Oct 14-15)
**Owner**: Technical Team + Phil
**Status**: ⚪ Not Started

#### Day 1 (Oct 14) - Render Service Setup

**Morning Tasks**:
- [ ] Create new Render service: `design-rite-subscriber-portal`
- [ ] Connect to GitHub repository
- [ ] Configure build settings:
  ```
  Build Command: npm install && npm run build
  Start Command: npm run preview
  Branch: main
  ```
- [ ] Set environment variables in Render dashboard:
  ```
  VITE_SUPABASE_URL=https://aeorianxnxpxveoxzhov.supabase.co
  VITE_SUPABASE_ANON_KEY=[key]
  VITE_STRIPE_PUBLISHABLE_KEY=[pk_live_key]
  VITE_STRIPE_PRICE_ID_BASE=[price_id]
  VITE_STRIPE_PRICE_ID_PRO=[price_id]
  VITE_STRIPE_PRICE_ID_ENTERPRISE=[price_id]
  VITE_MAIN_PLATFORM_URL=https://www.design-rite.com
  VITE_PORTAL_URL=https://portal.design-rite.com
  ```

**Afternoon Tasks**:
- [ ] Configure custom domain in Render: `portal.design-rite.com`
- [ ] Set up DNS CNAME record pointing to Render
- [ ] Enable auto-deploy on push to `main`
- [ ] Configure health check endpoint
- [ ] Set up deployment notifications (Slack/Email)

#### Day 2 (Oct 15) - DNS & Testing

**Morning Tasks**:
- [ ] Verify DNS propagation (24-48 hours, but check)
- [ ] SSL certificate provisioning (automatic via Render)
- [ ] First deployment to Render
- [ ] Monitor deployment logs
- [ ] Fix any build errors

**Afternoon Tasks**:
- [ ] Test production URL: https://portal.design-rite.com
- [ ] Verify Supabase connection working
- [ ] Test Stripe checkout flow (test mode first!)
- [ ] Test profile page + logo upload
- [ ] Test invoice generation
- [ ] Test navigation to/from V4
- [ ] Test authentication flow

**Deliverables**:
- [ ] Production subscriber portal live at portal.design-rite.com
- [ ] SSL certificate active
- [ ] All features tested and working
- [ ] Monitoring configured

**Success Criteria**: Production portal accessible, fully functional, integrated with V4

**Dependencies**: Milestone 4 complete
**Risk Level**: Medium (DNS, SSL, first deployment)
**Estimated Hours**: 16 hours

---

### 🧪 Milestone 6: Staging Environment Setup
**Duration**: 2 days (Oct 16-17)
**Owner**: Technical Team + Phil
**Status**: ⚪ Not Started

#### Staging Architecture

```
Staging Environment:
├── V4 Staging (EXISTING)
│   ├── URL: staging.design-rite.com
│   ├── Branch: staging (ALREADY LIVE)
│   └── Supabase: Validation Lab (ickwrbdpuorzdpzqbqpf)
│
└── Subscriber Portal Staging (NEW)
    ├── URL: portal-staging.design-rite.com
    ├── Branch: staging
    └── Supabase: Validation Lab (ickwrbdpuorzdpzqbqpf)
```

#### Day 1 (Oct 16) - Staging Service Setup

**Tasks**:
- [ ] Merge `feature/remove-ai-assistant` to `main`
- [ ] Create `staging` branch from `main`
- [ ] Create new Render service: `design-rite-subscriber-portal-staging`
- [ ] Connect to GitHub → `staging` branch
- [ ] Configure build settings (same as production)
- [ ] Set staging environment variables (Validation Lab Supabase)
- [ ] Configure custom domain: `portal-staging.design-rite.com`
- [ ] Set up DNS CNAME
- [ ] Enable auto-deploy on push to `staging`

#### Day 2 (Oct 17) - Validation Lab Configuration

**Validation Lab Supabase Setup**:
- [ ] Verify all tables exist in Validation Lab
- [ ] Run any missing migrations
- [ ] Create test user accounts:
  - [ ] dan@design-rite.com (admin)
  - [ ] phil@design-rite.com (admin)
  - [ ] test@example.com (user)
- [ ] Configure Stripe test mode webhooks
- [ ] Verify storage buckets exist
- [ ] Deploy Edge Functions to Validation Lab
- [ ] Test all Edge Functions working

**Staging Testing**:
- [ ] Access portal-staging.design-rite.com
- [ ] Test full user flow
- [ ] Test admin features
- [ ] Test navigation with staging.design-rite.com
- [ ] Document any issues

**Deliverables**:
- [ ] Complete staging environment operational
- [ ] Validation Lab fully configured
- [ ] Testing documentation

**Success Criteria**: Full staging environment mirrors production, safe for testing

**Dependencies**: Milestone 5 complete
**Risk Level**: Low (isolated from production)
**Estimated Hours**: 16 hours

---

### ✅ Milestone 7: End-to-End Testing
**Duration**: 2 days (Oct 17-18)
**Owner**: Phil + Technical Team
**Status**: ⚪ Not Started

#### Test Scenarios

**Scenario 1: New User Signup Flow**
- [ ] User visits www.design-rite.com
- [ ] Completes AI discovery estimate
- [ ] Creates account with email/password
- [ ] Redirected to portal.design-rite.com/profile
- [ ] Fills out company information
- [ ] Uploads company logo
- [ ] Redirected to /subscription
- [ ] Reviews pricing tiers
- [ ] Clicks "Start Free Trial" (Base tier)
- [ ] Completes Stripe checkout (test card: 4242 4242 4242 4242)
- [ ] Redirected back to www.design-rite.com/dashboard
- [ ] Dashboard shows subscription status
- [ ] Can navigate to portal features

**Scenario 2: Existing User Profile Update**
- [ ] User logs in at www.design-rite.com
- [ ] Clicks "Manage Profile" card
- [ ] Redirected to portal.design-rite.com/profile
- [ ] Updates company name
- [ ] Changes logo
- [ ] Saves changes successfully
- [ ] Clicks "Back to Platform"
- [ ] Returns to www.design-rite.com/dashboard
- [ ] Changes reflected in header/nav

**Scenario 3: Pro User Invoice Generation**
- [ ] Pro user logs in
- [ ] Navigates to Business Tools
- [ ] Clicks "Invoice Generator"
- [ ] Fills out invoice details
- [ ] Logo auto-populated from profile
- [ ] Clicks "Generate PDF"
- [ ] PDF downloads successfully
- [ ] Invoice saved to Documents
- [ ] Can view in Generated Documents list

**Scenario 4: Subscription Upgrade Flow**
- [ ] Base tier user logs in
- [ ] Navigates to Subscription page
- [ ] Clicks "Upgrade to Pro"
- [ ] Redirected to Stripe checkout
- [ ] Completes upgrade
- [ ] Subscription updated immediately
- [ ] Can now access Pro features (Invoice Generator)
- [ ] Usage limits updated

**Scenario 5: Admin Configuration**
- [ ] Phil logs in with admin account
- [ ] Navigates to Admin panel in portal
- [ ] Updates Stripe Price IDs
- [ ] Sets new usage limits for Pro tier
- [ ] Generates invite token
- [ ] Views user analytics
- [ ] Checks subscription status for test users
- [ ] All changes save successfully

**Scenario 6: Payment Failure Handling**
- [ ] User with expiring card
- [ ] Payment fails (Stripe test card: 4000 0000 0000 0341)
- [ ] Subscription status → past_due
- [ ] Payment failed modal appears
- [ ] User clicks "Update Payment Method"
- [ ] Redirected to Stripe Customer Portal
- [ ] Updates card
- [ ] Payment retries successfully
- [ ] Subscription reactivated

**Scenario 7: Cross-Service Navigation**
- [ ] User starts at www.design-rite.com
- [ ] Navigates to portal.design-rite.com
- [ ] Session maintained (no re-login)
- [ ] Navigates back to V4
- [ ] Still logged in
- [ ] Logout from V4
- [ ] Also logged out of portal

#### Bug Tracking

**Critical Bugs** (Must fix before launch):
- [ ] List any bugs found during testing
- [ ] Assign to Technical Team
- [ ] Track resolution

**Minor Issues** (Can fix post-launch):
- [ ] List non-critical issues
- [ ] Prioritize for post-launch

**Deliverables**:
- [ ] All test scenarios completed
- [ ] Bug list documented
- [ ] Critical bugs resolved
- [ ] User acceptance sign-off

**Success Criteria**: All critical test scenarios pass, zero critical bugs

**Dependencies**: Milestone 6 complete
**Risk Level**: Low (testing only)
**Estimated Hours**: 16 hours

---

### 🎉 Milestone 8: Production Launch
**Duration**: 1 day (Oct 18)
**Owner**: Dan + Phil + Technical Team
**Status**: ⚪ Not Started

#### Pre-Launch Checklist (Morning)

**Technical Verification**:
- [ ] All Milestone 7 tests passed
- [ ] Zero critical bugs remaining
- [ ] Production deployment stable
- [ ] Staging environment functioning
- [ ] Monitoring configured
- [ ] Error tracking enabled
- [ ] Database backup completed (Supabase auto-backup verified)

**Stripe Configuration**:
- [ ] Switch from test mode to live mode
- [ ] Live Stripe products verified:
  - [ ] Base: $49.95/month (price_xxx)
  - [ ] Pro: $99.95/month (price_xxx)
  - [ ] Enterprise: Custom (price_xxx)
- [ ] Live Stripe webhooks configured:
  - [ ] Webhook endpoint: https://[project].supabase.co/functions/v1/stripe-webhooks
  - [ ] Events: checkout.session.completed, customer.subscription.*
  - [ ] Webhook secret updated in Supabase secrets
- [ ] Test live checkout with real card (then refund)

**DNS & SSL**:
- [ ] portal.design-rite.com fully propagated
- [ ] SSL certificate active and valid
- [ ] No mixed content warnings
- [ ] All assets loading via HTTPS

**Documentation**:
- [ ] User onboarding guide ready
- [ ] Admin documentation complete
- [ ] Support team briefed
- [ ] Rollback procedure documented

#### Go-Live Activities (10:00 AM EST)

- [ ] Final production smoke test
- [ ] Update environment variables to live Stripe keys
- [ ] Enable production Stripe webhooks
- [ ] Announce launch internally (Slack/Email)
- [ ] Monitor logs for first hour

**First Customer Test** (10:30 AM):
- [ ] Dan or Phil creates test subscription with real card
- [ ] Verify full flow works
- [ ] Verify email notifications sent
- [ ] Refund test transaction

#### Post-Launch Monitoring (First 24 Hours)

**Continuous Monitoring**:
- [ ] Error logs (check every 2 hours)
- [ ] Stripe webhook deliveries (check every 2 hours)
- [ ] User signups (track in real-time)
- [ ] Subscription activations (track in real-time)
- [ ] Payment processing (monitor for failures)
- [ ] Performance metrics (page load times)
- [ ] Uptime (99.9% target)

**Communication Plan**:
- 10:00 AM: Launch announcement
- 12:00 PM: 2-hour status update
- 2:00 PM: 4-hour status update
- 4:00 PM: 6-hour status update
- 6:00 PM: End-of-day debrief

**Evening Wrap-Up (6:00 PM)**:
- [ ] Review metrics
- [ ] Document any issues
- [ ] Plan next day monitoring
- [ ] Celebrate launch! 🎉

**Deliverables**:
- [ ] Production system live and accepting customers
- [ ] Launch announcement sent
- [ ] Monitoring dashboard configured
- [ ] Support team ready

**Success Criteria**: System live, first customer completes signup successfully, no critical issues

**Dependencies**: All previous milestones complete
**Risk Level**: Medium (launch day always has surprises)
**Estimated Hours**: 8+ hours (monitoring continues)

---

## 📅 COMPLETE PROJECT TIMELINE

```
WEEK 1: Oct 7-11 (Subscriber Portal Setup)
═══════════════════════════════════════════════════════════════
Mon 10/7   │ ████████ Milestone 0: Documentation (COMPLETE)
           │ ████████ Milestone 1: Repository Setup (8hrs)
           │
Tue 10/8   │ ████████████████ Milestone 2: Remove AI Code - Day 1 (8hrs)
           │
Wed 10/9   │ ████████████████ Milestone 2: Remove AI Code - Day 2 (8hrs)
           │
Thu 10/10  │ ████████████████ Milestone 3: Environment Config (8hrs)
           │
Fri 10/11  │ ████████████████ Milestone 4: Navigation Integration (8hrs)
           │

WEEK 2: Oct 14-18 (Deployment & Launch)
═══════════════════════════════════════════════════════════════
Mon 10/14  │ ████████████████ Milestone 5: Production Deploy - Day 1 (8hrs)
           │
Tue 10/15  │ ████████████████ Milestone 5: Production Deploy - Day 2 (8hrs)
           │
Wed 10/16  │ ████████████████ Milestone 6: Staging Setup - Day 1 (8hrs)
           │
Thu 10/17  │ ████████ Milestone 6: Staging - Day 2 (4hrs)
           │ ████████ Milestone 7: Testing - Day 1 (4hrs)
           │
Fri 10/18  │ ████████ Milestone 7: Testing - Day 2 (4hrs)
           │ ████████ Milestone 8: 🚀 LAUNCH! (4hrs + monitoring)
           │
═══════════════════════════════════════════════════════════════

Total Estimated Hours: 88 hours over 10 business days
Average Hours Per Day: 8.8 hours
```

---

## 👥 ROLES & RESPONSIBILITIES

### Dan Kozich (Project Owner)
**Responsibilities**:
- Final decision-making authority
- Review and approve all milestones
- Business strategy alignment
- Customer communication
- Launch authorization
- Post-launch monitoring

**Daily Commitment**: 30-60 minutes for milestone reviews

### Phil Lisk (Admin Lead)
**Responsibilities**:
- Admin panel testing and configuration
- Stripe configuration management
- User acceptance testing
- Team coordination
- Post-launch monitoring
- Customer support escalation

**Daily Commitment**: 2-4 hours during setup, full-time during testing/launch

### Technical Team (Claude Code AI)
**Responsibilities**:
- Code implementation
- Deployment configuration
- Integration work
- Bug fixes
- Technical documentation
- Architecture decisions

**Daily Commitment**: Full-time (8+ hours/day)

### Operations Team (Support)
**Responsibilities**:
- Testing execution
- Documentation review
- Training material preparation
- Customer support readiness
- Post-launch monitoring

**Daily Commitment**: 1-2 hours during prep, full-time during launch

---

## 🚨 RISK MANAGEMENT

### Risk Matrix

| Risk | Probability | Impact | Mitigation | Owner |
|------|-------------|--------|------------|-------|
| **Microservice integration issues** | Medium | High | Extensive testing in staging, clear rollback plan | Technical |
| **Stripe webhook delays** | Low | High | Webhook monitoring, manual override capability, retry logic | Technical |
| **Session management between services** | Medium | Medium | Thorough auth testing, Supabase session sharing verified | Technical |
| **DNS propagation delays** | Low | Low | Configure DNS early, allow 24-48hr propagation | Phil |
| **User confusion with multiple domains** | Medium | Medium | Clear navigation, consistent branding, onboarding guide | Dan |
| **Database schema conflicts** | Low | High | Schema comparison V4 vs dev team, careful migration | Technical |
| **AI code removal breaks other features** | Medium | High | Careful testing, feature branch isolation, code review | Technical |
| **Launch day critical bug** | Low | Critical | Staging testing, rollback procedure, 24/7 monitoring | All |

### Rollback Procedures

**If Critical Issue During Launch**:
1. **Immediate**: Disable portal.design-rite.com in Render (service can be paused)
2. **Communication**: Notify team immediately via Slack
3. **Triage**: Technical team investigates logs
4. **Decision**: Dan + Phil decide: Fix forward or rollback
5. **Fix Forward**: Deploy hotfix to production
6. **Rollback**: Point DNS to maintenance page, fix in staging, redeploy
7. **Post-Mortem**: Document what happened, update procedures

**Rollback Timeline**: 15-30 minutes to disable service, 2-4 hours for full rollback

---

## 📊 SUCCESS METRICS

### Technical Metrics (Week 1 Post-Launch)
- [ ] 99.9% uptime
- [ ] <2 second average page load time
- [ ] Zero critical bugs in production
- [ ] 100% Stripe webhook delivery success
- [ ] Session persistence 100% across services
- [ ] Zero user-reported auth issues

### Business Metrics (Week 1 Post-Launch)
- [ ] 10+ new signups
- [ ] 3+ trial starts
- [ ] 1+ paid subscription conversion
- [ ] Zero support tickets related to profile/subscription access
- [ ] Pro users successfully generate invoices
- [ ] Admin workload reduced (no manual subscription management)

### User Experience Metrics
- [ ] Seamless navigation between services (no complaints)
- [ ] Clear visual consistency
- [ ] Professional invoice/proposal generation
- [ ] Intuitive subscription management
- [ ] Positive user feedback

### Admin Metrics
- [ ] Phil can configure Stripe without developer help
- [ ] Usage limits easily adjustable
- [ ] Invite token system working
- [ ] User analytics accessible
- [ ] Subscription dashboard actionable

---

## 📚 DELIVERABLES CHECKLIST

### Technical Documentation
- [x] Database schema documentation (`DEV_TEAM_DATABASE_SCHEMA.md`)
- [ ] Architecture diagram (services, databases, integrations)
- [ ] API integration documentation
- [ ] Environment variables guide
- [ ] Deployment procedures
- [ ] Rollback procedures
- [ ] Monitoring and alerting setup

### User Documentation
- [ ] User onboarding guide
- [ ] Profile setup instructions
- [ ] Business tools user guide (Invoice/Proposal)
- [ ] Subscription management help docs
- [ ] FAQ document
- [ ] Video tutorials (optional, post-launch)

### Admin Documentation
- [ ] Admin panel guide
- [ ] Stripe configuration guide
- [ ] Usage limits management
- [ ] Invite token system guide
- [ ] User management procedures
- [ ] Troubleshooting guide
- [ ] Support escalation procedures

### Code Repositories
- [ ] Subscriber portal repository clean and organized
- [ ] README updated with setup instructions
- [ ] Environment variable examples documented
- [ ] Edge Functions documented
- [ ] CI/CD pipeline configured

---

## 🔧 TECHNICAL SPECIFICATIONS

### Subscriber Portal Stack
**Frontend**:
- React 18.3.1
- Vite 5.4.19
- TypeScript 5.8.3
- React Router 6.30.1
- Shadcn/UI + Radix UI
- Tailwind CSS 3.4.17
- Lucide React (icons)

**Backend/Infrastructure**:
- Supabase Auth
- Supabase PostgreSQL
- Supabase Storage
- Supabase Edge Functions (Deno)
- Stripe (payments)
- React Query (state management)

**Deployment**:
- Render.com (hosting)
- GitHub (source control)
- Auto-deploy on push

### Environment Requirements
**Node Version**: 18+ (specified in `.nvmrc`)
**Package Manager**: npm
**Build Time**: ~2-3 minutes
**Bundle Size**: <500KB (estimated)

### Performance Targets
- **First Contentful Paint**: <1.5 seconds
- **Time to Interactive**: <2.5 seconds
- **Lighthouse Score**: 90+ (mobile and desktop)
- **Uptime SLA**: 99.9%

### Security Requirements
- HTTPS only (enforced)
- Supabase RLS enabled on all tables
- Environment variables never committed
- Stripe webhooks signature verified
- CORS properly configured
- XSS protection via React
- CSRF protection via Supabase

---

## 🔗 INTEGRATION POINTS

### V4 Platform → Subscriber Portal
```typescript
// Navigation links from V4 to Portal
'https://portal.design-rite.com/profile'
'https://portal.design-rite.com/subscription'
'https://portal.design-rite.com/business-tools'
'https://portal.design-rite.com/analytics'
```

### Subscriber Portal → V4 Platform
```typescript
// Navigation links from Portal to V4
'https://www.design-rite.com/dashboard'
'https://www.design-rite.com/ai-assistant'
'https://www.design-rite.com/estimate-options'
'https://www.design-rite.com/admin' (for admins)
```

### Shared Resources
- **Supabase Auth**: Single session, shared JWT
- **Supabase Database**: Same tables, same data
- **Supabase Storage**: Shared buckets
- **Stripe**: Single Stripe account, shared webhooks

### API Communication
No direct API calls needed - both services use same Supabase database.

---

## 📞 COMMUNICATION PLAN

### Daily Standups
**Time**: 9:00 AM EST
**Duration**: 15 minutes
**Attendees**: Dan, Phil, Technical Team
**Format**:
- What was accomplished yesterday
- What's planned for today
- Any blockers or issues

**Delivery**: Slack or quick video call

### Milestone Reviews
**Schedule**: End of each milestone
**Duration**: 30 minutes
**Attendees**: Full team
**Format**:
- Demo what was completed
- Review deliverables
- Discuss any issues
- Approval to proceed to next milestone

### Blocker Resolution
**Process**:
1. Technical team identifies blocker
2. Post in Slack immediately
3. Dan/Phil respond within 2 hours
4. Emergency issues: Call/text immediately

### Launch Day Communication
**Pre-Launch**: Team briefing at 8:00 AM
**Go-Live**: 10:00 AM EST
**Status Updates**: Every 2 hours for first 8 hours
**Evening Debrief**: 6:00 PM

---

## 🎯 POST-LAUNCH PLAN

### Week 1 After Launch (Oct 21-25)
**Focus**: Monitoring and Stabilization

**Daily Tasks**:
- [ ] Monitor error logs (morning and evening)
- [ ] Check Stripe webhook deliveries
- [ ] Review user signups
- [ ] Track subscription conversions
- [ ] Address any bugs (prioritize critical)
- [ ] Collect user feedback

**Deliverables**:
- [ ] Bug fix deployments (if needed)
- [ ] User feedback summary
- [ ] Performance metrics report
- [ ] Lessons learned document

### Week 2-4 After Launch (Oct 28 - Nov 15)
**Focus**: Optimization and Phase 2 Planning

**Activities**:
- [ ] Analyze usage metrics
- [ ] Identify optimization opportunities
- [ ] Gather customer testimonials
- [ ] Plan Phase 2 enhancements
- [ ] Marketing push for Pro features

**Phase 2 Feature Ideas**:
- Team/multi-seat subscriptions
- Advanced analytics dashboard
- API access management
- Additional business tools
- Workflow automation
- Integration with accounting software

---

## 💡 LESSONS LEARNED (To Be Filled Post-Launch)

This section will be updated after launch with:
- What went well
- What could be improved
- Unexpected challenges
- Time estimation accuracy
- Process improvements for future projects

---

## 📋 NOTES & DECISIONS LOG

**Oct 7, 2025 - Architecture Decision**:
- **Decision**: Use microservices architecture (keep Vite/React separate) vs porting to Next.js
- **Rationale**:
  - Faster launch (days vs weeks)
  - No risky Vite→Next.js conversion
  - Cleaner architecture
  - Easier to innovate independently
  - Keep what works
- **Approved By**: Dan Kozich
- **Impact**: 10-day launch timeline vs 4-6 week porting effort

**Oct 7, 2025 - AI Assistant Decision**:
- **Decision**: Remove dev team's AI assistant, keep V4's 3 working AI assistants
- **Rationale**:
  - V4's AI assistants already working and integrated
  - No need for duplicate AI functionality
  - Reduces complexity
  - Maintains consistency for users
- **Approved By**: Dan Kozich
- **Impact**: Cleaner codebase, better UX

**Oct 7, 2025 - Repository Decision**:
- **Decision**: TBD - Repurpose existing repo vs create new
- **Recommendation**: Repurpose (faster)
- **Approved By**: Pending
- **Impact**: 1-2 hours saved if repurposing

**Oct 7, 2025 - Domain Names**:
- **Decision**:
  - Production: portal.design-rite.com
  - Staging: portal-staging.design-rite.com
- **Approved By**: Dan Kozich
- **Impact**: Clear, professional URLs

---

## ✅ FINAL SIGN-OFF

This project plan must be reviewed and approved before execution begins.

**Dan Kozich (Project Owner)**
Date: ________________
Signature: ________________
Approval: [ ] Approved [ ] Changes Required

**Phil Lisk (Admin Lead)**
Date: ________________
Signature: ________________
Approval: [ ] Approved [ ] Changes Required

---

## 🚀 READY TO LAUNCH!

This comprehensive project plan provides:
- ✅ Clear timeline (10 business days)
- ✅ Detailed milestones with tasks
- ✅ Risk management strategy
- ✅ Success metrics
- ✅ Communication plan
- ✅ Complete documentation requirements
- ✅ Rollback procedures

**Next Steps**:
1. Review and approve this plan
2. Begin Milestone 1: Repository Setup
3. Daily standups to track progress
4. Launch on October 18, 2025! 🎉

---

**Document Version**: 1.0
**Created**: October 7, 2025
**Last Updated**: October 7, 2025
**Next Review**: October 14, 2025 (Mid-project checkpoint)
**Status**: Ready for Approval

---

**Questions or Concerns?**
Contact Dan Kozich or Phil Lisk immediately.

**Let's build something amazing! 💪**
