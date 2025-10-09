# Supabase Management Setup - Pre-Launch Checklist

## ✅ Completed Setup

- [x] GitHub Integration → Connected to `design-rite-v4` repo
- [x] Production branch set to `main` (lowercase)
- [x] Automatic migrations enabled on push to main
- [x] Preview branching enabled (50 branch limit)

---

## 🔥 Critical - Do Before Launch

### 1. Enable Point-in-Time Recovery (PITR)
**Location:** Settings → Database → Backups

**Why:** Allows you to restore to any second within last 7 days if something goes wrong

**How:**
1. Navigate to Settings → Database
2. Scroll to "Backups" section
3. Click "Enable Point-in-Time Recovery"
4. Confirm the upgrade (may require Pro plan)

**Status:** ⏳ **NEEDS SETUP**

---

## 🔔 High Priority - Setup This Week

### 2. Database Webhooks for Critical Events

**Location:** Database → Webhooks → Create a new webhook

#### A. New User Signup Notifications
```
Name: new-user-signup
Table: auth.users
Events: ☑ INSERT
HTTP Method: POST
HTTP Endpoint: [YOUR SLACK WEBHOOK OR NOTIFICATION ENDPOINT]
Headers: (if needed for authentication)
```

#### B. Subscription Changes
```
Name: subscription-changes
Table: subscriptions
Events: ☑ INSERT ☑ UPDATE
HTTP Method: POST
HTTP Endpoint: [YOUR NOTIFICATION ENDPOINT]
```

#### C. Demo Bookings
```
Name: demo-bookings
Table: demo_bookings
Events: ☑ INSERT
HTTP Method: POST
HTTP Endpoint: [YOUR NOTIFICATION ENDPOINT]
```

**Slack Webhook Format:**
```json
{
  "text": "🎉 New user signed up: {{record.email}}"
}
```

**Status:** ⏳ **NEEDS SETUP**

---

### 3. Auth Hooks (Optional but Recommended)

**Location:** Settings → Authentication → Hooks

#### A. Send Email Hook
Trigger custom email logic when users sign up
```
Hook: send_email
Function: Edge Function or external webhook
Purpose: Custom welcome emails, onboarding sequences
```

#### B. Custom Access Token Hook
Add custom claims to JWT (e.g., user roles, subscription tier)
```
Hook: custom_access_token
Function: Edge Function
Purpose: Include role and subscription_tier in JWT
```

**Status:** 📋 **OPTIONAL** (can do post-launch)

---

## 📊 Monitoring Setup

### 4. Query Performance Monitoring

**Location:** Reports → Query Performance

**What to Check:**
- Queries taking >100ms
- Queries without indexes
- High-frequency queries that could be optimized

**Recommendation:** Check weekly after launch, daily during first month

**Status:** ✅ **AVAILABLE** (no setup needed)

---

### 5. Logs Explorer

**Location:** Logs → Explorer

**What to Monitor:**
- Auth failures (failed login attempts)
- API errors (500, 401, 403 responses)
- Slow query logs
- Storage upload failures

**Setup Alerts:**
1. Create saved queries for critical errors
2. Export to external monitoring (DataDog, Sentry) if needed

**Status:** ✅ **AVAILABLE** (no setup needed)

---

## 🚀 Nice-to-Have Features

### 6. Realtime Subscriptions for Admin Dashboards

**Enable Realtime on Tables:**

Settings → API → Realtime

Enable on:
- [ ] `activity_logs` - Live admin activity feed
- [ ] `demo_bookings` - Live demo booking notifications
- [ ] `subscriptions` - Live subscription status changes

**Usage in Code:**
```typescript
const subscription = supabase
  .channel('admin-activity')
  .on('postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'activity_logs' },
    (payload) => {
      console.log('New activity:', payload.new)
      // Update UI in real-time
    }
  )
  .subscribe()
```

**Status:** 📋 **OPTIONAL** (improves UX)

---

### 7. Edge Functions for Background Jobs

**Location:** Edge Functions → Deploy new function

**Use Cases:**
- Send welcome emails after signup
- Process subscription renewals
- Generate usage reports
- Clean up old data

**Example:**
```typescript
// supabase/functions/send-welcome-email/index.ts
Deno.serve(async (req) => {
  const { userId } = await req.json()
  // Send welcome email logic
  return new Response(JSON.stringify({ success: true }))
})
```

**Status:** 📋 **OPTIONAL** (post-launch optimization)

---

## 🎯 Pre-Launch Action Items

**Immediate (Before Launch):**
1. ✅ Fix .env file syntax errors (completed)
2. ✅ Link Supabase CLI to production project (completed)
3. ⏳ Enable Point-in-Time Recovery
4. ⏳ Set up Slack webhook for new user signups
5. ⏳ Test backup/restore process in staging environment

**Week 1 Post-Launch:**
- [ ] Set up database webhooks for subscriptions
- [ ] Set up demo booking notifications
- [ ] Monitor query performance for optimization opportunities
- [ ] Check logs daily for errors

**Week 2-4 Post-Launch:**
- [ ] Implement auth hooks for custom JWT claims
- [ ] Enable realtime subscriptions for admin dashboards
- [ ] Create custom monitoring dashboard

---

## 📝 Quick Reference Links

- Dashboard: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov
- Database: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/database/tables
- Auth: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/auth/users
- Logs: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/logs/explorer
- Settings: https://supabase.com/dashboard/project/aeorianxnxpxveoxzhov/settings/general

---

## 🆘 Support

Supabase Support: https://supabase.com/support
Community Discord: https://discord.supabase.com
