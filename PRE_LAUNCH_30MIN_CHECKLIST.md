# ⚡ 30-Minute Pre-Launch Checklist
**Target:** Soft Launch This Week
**Time Required:** 30 minutes
**Status:** Complete these before deploying to production

---

## ✅ **CRITICAL: 30-Minute Tasks**

### **Task 1: Add Rate Limiting to Critical Endpoints** (10 minutes)

**File:** `app/api/discovery-assistant/route.ts`
```typescript
// Add at top
import { rateLimit, getClientIp, createRateLimitResponse } from '../../../lib/rate-limiter';

const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 500 });

// Add in POST function, before authentication
export async function POST(request: NextRequest) {
  // Rate limit check
  const ip = getClientIp(request);
  const rateCheck = limiter.check(20, ip); // 20 requests/minute
  if (!rateCheck.success) {
    return createRateLimitResponse(rateCheck);
  }

  // ... rest of existing code
}
```

**File:** `app/api/ai-assessment/route.ts`
```typescript
// Add same rate limiting code as above
const limiter = rateLimit({ interval: 60000, uniqueTokenPerInterval: 500 });

export async function POST(request: Request) {
  const ip = getClientIp(request);
  const rateCheck = limiter.check(15, ip); // 15 requests/minute (expensive)
  if (!rateCheck.success) {
    return createRateLimitResponse(rateCheck);
  }

  // ... rest of existing code
}
```

**File:** `app/api/spatial-studio/upload-floorplan/route.ts`
```typescript
// Add rate limiting for uploads
import { rateLimit, getClientIp, createRateLimitResponse } from '../../../../lib/rate-limiter';

const uploadLimiter = rateLimit({ interval: 5 * 60000, uniqueTokenPerInterval: 200 }); // 5 minutes

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rateCheck = uploadLimiter.check(10, ip); // 10 uploads per 5 minutes
  if (!rateCheck.success) {
    return createRateLimitResponse(rateCheck);
  }

  // ... rest of existing code
}
```

---

### **Task 2: Verify Production Environment Variables** (5 minutes)

**Login to Render.com → design-rite-v3 service → Environment**

Verify these are set:
```bash
✅ NEXT_PUBLIC_SUPABASE_URL
✅ SUPABASE_SERVICE_KEY (NOT just ANON_KEY)
✅ ANTHROPIC_API_KEY
✅ OPENAI_API_KEY
⚠️ NEXT_PUBLIC_APP_URL=https://www.design-rite.com
⚠️ NEXT_PUBLIC_HARVESTER_API_URL=https://<harvester-url>
```

**If any are missing, add them now.**

---

### **Task 3: Supabase Production Verification** (5 minutes)

**Login to Supabase → Project → SQL Editor**

Run this verification query:
```sql
-- Verify all tables exist and have RLS enabled
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- Expected tables:
-- assessments, spatial_projects, ai_analysis_debug,
-- ai_sessions, demo_bookings, users, user_sessions, activity_logs
-- ALL should show rowsecurity = true
```

**Check storage bucket exists:**
```sql
-- Go to Supabase Storage tab
-- Verify bucket: spatial-floorplans
-- If missing, run: supabase/spatial_studio_tables.sql
```

---

### **Task 4: Test Async Worker in Production** (5 minutes)

**After deploying to production:**

```bash
# Upload test floor plan via production API
curl -X POST https://www.design-rite.com/api/spatial-studio/upload-floorplan \
  -H "Authorization: Bearer <your-test-token>" \
  -F "floorplan=@test.png" \
  -F "projectName=Production Test"

# Response should include projectId
# Wait 30 seconds, then check status:
curl "https://www.design-rite.com/api/spatial-studio/upload-floorplan?projectId=<id>"

# Should show status: 'completed' or 'processing'
# If stuck on 'pending', async worker cannot reach itself
```

**If worker fails:**
- Check Render logs for "Failed to trigger async analysis"
- Verify `NEXT_PUBLIC_APP_URL` is set correctly
- Test firewall/network: `curl https://www.design-rite.com/api/spatial-studio/process-analysis`

---

### **Task 5: AI Provider Health Check** (5 minutes)

**Test each AI provider responds:**

```bash
# Test Discovery Assistant (Claude primary)
curl -X POST https://www.design-rite.com/api/discovery-assistant \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"message": "Hello, are you working in production?"}'

# Should return AI response with provider_used: "Claude" or "OpenAI"
```

**Check API keys have credits:**
- Anthropic Console: https://console.anthropic.com/settings/billing
- OpenAI Console: https://platform.openai.com/usage

**Set up billing alerts (prevent surprise bills):**
- Anthropic: Set spending limit
- OpenAI: Set hard usage limit

---

## 🎯 **DONE! You're Ready to Launch**

Once all 5 tasks complete, you can deploy with confidence.

---

## 📊 **Post-Deploy Smoke Test** (5 minutes)

After deploying to production, run these quick tests:

```bash
# 1. Health check
curl https://www.design-rite.com/api/health
# Should return: { "status": "ok" }

# 2. AI provider health
curl https://www.design-rite.com/api/discovery-assistant
# Should return provider status

# 3. Authentication works
curl https://www.design-rite.com/api/admin/dashboard
# Should return 401 Unauthorized (auth required)

# 4. Rate limiting works
for i in {1..25}; do
  curl -s https://www.design-rite.com/api/scenarios | head -1
done
# Should eventually return 429 Too Many Requests

# 5. Spatial Studio upload works
# (Use your browser or Postman for this - easier than curl for file upload)
```

---

## 🚨 **Emergency Rollback Plan**

If something breaks after launch:

**Option 1: Revert to Previous Deploy**
```bash
# In Render dashboard:
# Settings → Deploys → Click previous successful deploy → "Rollback to this version"
```

**Option 2: Disable Failing Feature**
```bash
# Set environment variable:
FEATURE_SPATIAL_STUDIO_ENABLED=false
FEATURE_AI_ASSESSMENT_ENABLED=false
# Then redeploy
```

**Option 3: Enable Maintenance Mode**
```bash
# Set environment variable:
MAINTENANCE_MODE=true
# All API routes will return 503 Service Unavailable
# (You'll need to implement this check in each route)
```

---

## ✅ **All Clear for Launch!**

Complete these 5 tasks (30 minutes), run the smoke test, and you're **100% ready** to soft launch.

**Good luck! 🚀**
