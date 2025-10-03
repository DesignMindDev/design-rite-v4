# Spatial Studio Microservice Extraction - Claude Project Brief

**Copy this entire document into a new Claude Desktop project for AI assistance**

---

## 🎯 What Are You Trying to Achieve?

I'm extracting **Spatial Studio** (an AI-powered floor plan analysis and camera placement tool) from the Design-Rite v3 monolith into a standalone microservice. This is part of a broader architecture strategy to:

1. **Reduce load on the main Design-Rite platform** as we scale
2. **Enable independent deployment** of AI-intensive features
3. **Create reusable patterns** for extracting future products
4. **Track costs and revenue** per product clearly
5. **Prepare for white-labeling** or partnerships

### Current State
- Spatial Studio currently lives **inside** Design-Rite v3 at `/app/api/spatial-studio/*`
- It uses OpenAI GPT-4 Vision for floor plan analysis
- 22 comprehensive tests all passing
- Production-ready code but tightly coupled to main app

### Target State
- Spatial Studio as **independent microservice** with its own:
  - Git repository: `design-rite-spatial-studio`
  - Render web service deployment
  - OpenAI API key (separate billing)
  - MCP server endpoint (like our Spec Harvester)
- Still shares with Design-Rite v3:
  - Supabase database (same instance, RLS isolation)
  - Authentication (Next-Auth, same secret)
  - User management and billing

---

## 📋 What You Need to Know

### Project Context

**Design-Rite v3** is a security estimation platform for low-voltage integrators. We're building multiple AI-powered products:

1. ✅ **Spec Harvester** - PDF extraction tool (already microservice)
2. 🔄 **Spatial Studio** - Floor plan analysis (extracting now)
3. 📋 **AI Assessment** - Discovery tool (stays in monolith for now)
4. 📊 **Quote Generator** - Pricing engine (stays in monolith)

### Spatial Studio Features

**What it does:**
- Accepts floor plan uploads (PDF/PNG/JPG)
- Uses GPT-4 Vision to detect walls, doors, windows
- Generates 3D models with Three.js
- Recommends camera placements with AI
- Mobile site walk annotations with GPS
- Async processing (upload returns immediately, AI runs in background)

**API Endpoints:**
```
POST /api/spatial-studio/upload-floorplan    (File upload, trigger analysis)
POST /api/spatial-studio/process-analysis    (Background worker, OpenAI)
POST /api/spatial-studio/analyze-site        (Camera recommendations)
POST /api/spatial-studio/add-annotation      (Site walk notes)
GET  /api/spatial-studio/upload-floorplan?projectId=xxx (Check status)
```

**Database Tables:**
```sql
spatial_projects           (Core project data)
spatial_annotations        (Site walk notes)
ai_analysis_debug          (OpenAI API logs)
ai_device_suggestions      (Camera placements)
```

**Test Coverage:**
- 22 tests, all passing (76.7 seconds execution time)
- Phase 1: Critical path (upload, analysis, annotations)
- Phase 2: Error handling (validation, failures)
- Phase 3: Integration & performance

---

## 🏗️ Architecture Pattern (Proven)

We've already done this successfully with **Spec Harvester**:

```
┌──────────────────────────────────────────────┐
│       Design-Rite v3 (Main Platform)         │
│   - Next.js 14 on Render                     │
│   - Next-Auth (session provider)             │
│   - Calls microservices via API wrappers     │
└───────────────┬──────────────────────────────┘
                │
                │ Shared Supabase + Auth
                │
        ┌───────┴──────────┬─────────────────┐
        │                  │                 │
  ┌─────▼─────────┐  ┌─────▼────────┐  ┌────▼─────────┐
  │ Spec Harvester│  │ Spatial      │  │ Future       │
  │ (Done ✅)     │  │ Studio       │  │ Services     │
  │               │  │ (Extracting) │  │              │
  └───────────────┘  └──────────────┘  └──────────────┘
```

### Shared Components
- **Same Supabase instance** (multi-tenant with RLS)
- **Same Next-Auth secret** (JWT tokens work across services)
- **Same user/role tables** (unified identity)
- **MCP server pattern** (Claude Desktop integration)

### Isolated Components
- **Separate Git repos** (independent versioning)
- **Separate Render services** (independent deployment)
- **Separate API keys** (OpenAI, other services)
- **Service-specific tables** (RLS policies enforce isolation)

---

## 🔧 Technical Requirements

### Repository Structure

**New repo:** `design-rite-spatial-studio`

```
design-rite-spatial-studio/
├── app/
│   ├── api/
│   │   ├── spatial-studio/
│   │   │   ├── upload-floorplan/route.ts
│   │   │   ├── process-analysis/route.ts
│   │   │   ├── analyze-site/route.ts
│   │   │   └── add-annotation/route.ts
│   │   └── mcp/route.ts              (Claude Desktop integration)
│   ├── components/
│   │   └── spatial-studio/
│   │       ├── FloorPlanViewer3D.tsx
│   │       └── AnalyticsDashboard.tsx
│   └── page.tsx                      (Optional admin UI)
├── middleware.ts                     (Auth verification)
├── lib/
│   ├── supabase.ts                   (Database client)
│   └── openai.ts                     (AI client)
├── __tests__/
│   └── api/
│       └── spatial-studio.test.ts    (22 tests)
├── package.json
├── tsconfig.json
├── .env.example
└── README.md
```

### Environment Variables

**Required for microservice:**
```bash
# Supabase (SHARED with main app - same project)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_KEY=eyJ...

# OpenAI (SEPARATE key for cost tracking)
OPENAI_API_KEY=sk-spatial-studio-key

# Main app URL (for callbacks and CORS)
MAIN_APP_URL=https://design-rite.com
NEXT_PUBLIC_MAIN_APP_URL=https://design-rite.com
```

**Note:** No Next-Auth needed! Using Supabase Auth which is built into Supabase packages.

### Authentication Flow (Supabase Auth)

1. User logs into **design-rite.com** (main app)
2. Supabase Auth creates session with JWT token
3. Session stored in HTTP-only cookie (automatic)
4. User clicks Spatial Studio feature
5. Main app calls `spatial.design-rite.com/api/...`
6. Browser sends Supabase session cookie automatically
7. Microservice middleware verifies session via Supabase
8. User profile fetched from `profiles` + `user_roles` tables

**Key File: `middleware.ts`**
```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res })

  // Refresh session if needed
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check user role from user_roles table
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .single()

  const userRole = roleData?.role || 'user'
  if (!['super_admin', 'admin', 'manager'].includes(userRole)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return res
}

export const config = {
  matcher: '/api/spatial-studio/:path*'
}
```

**Helper Functions: `lib/supabase-admin-auth.ts`**
```typescript
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function getAdminUser() {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .single()

  return {
    id: session.user.id,
    email: session.user.email!,
    role: roleData?.role || 'user',
    ...profile
  }
}

export async function requireAuth() {
  const user = await getAdminUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  return user
}
```

---

## 📝 Step-by-Step Extraction Process

### Phase 1: Repository Setup (Week 1)

**Tasks:**
1. Create new GitHub repo: `design-rite-spatial-studio`
2. Initialize Next.js 14 with TypeScript
3. Install dependencies:
   ```bash
   npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
   npm install openai
   npm install three @react-three/fiber @react-three/drei
   ```
4. Copy `.env.example` from main app
5. Setup basic folder structure

**Files to create:**
- `package.json` (dependencies)
- `tsconfig.json` (TypeScript config)
- `.env.example` (environment template)
- `README.md` (setup instructions)

### Phase 2: Extract API Routes (Week 1-2)

**Tasks:**
1. Copy entire `/app/api/spatial-studio/` directory
2. Update imports (remove `@/lib/*` paths, use direct packages)
3. Initialize Supabase client directly (no shared lib)
4. Initialize OpenAI client directly
5. Test each endpoint locally

**Key Changes:**

**Before (in monolith):**
```typescript
import { createClient } from '@/lib/supabase-server'
```

**After (in microservice):**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)
```

### Phase 3: Database Isolation (Week 2)

**Tasks:**
1. Add `service_name` column to all Spatial Studio tables
2. Update RLS policies to allow microservice access
3. Backfill existing data with `service_name='spatial-studio'`
4. Test database access from microservice

**SQL Migration:**
```sql
-- Add service identifier
ALTER TABLE spatial_projects
  ADD COLUMN IF NOT EXISTS service_name VARCHAR(50) DEFAULT 'spatial-studio';

ALTER TABLE spatial_annotations
  ADD COLUMN IF NOT EXISTS service_name VARCHAR(50) DEFAULT 'spatial-studio';

ALTER TABLE ai_analysis_debug
  ADD COLUMN IF NOT EXISTS service_name VARCHAR(50) DEFAULT 'spatial-studio';

-- Create indexes
CREATE INDEX idx_spatial_projects_service ON spatial_projects(service_name);

-- Update RLS policies
CREATE POLICY "Spatial Studio microservice access"
ON spatial_projects
FOR ALL
USING (
  service_name = 'spatial-studio' OR
  auth.uid() IN (SELECT id FROM users WHERE role IN ('super_admin', 'admin'))
);
```

### Phase 4: Render Deployment (Week 3)

**Tasks:**
1. Create new Render web service: `spatial-studio-api`
2. Connect GitHub repo
3. Configure environment variables
4. Deploy and test production endpoints
5. (Optional) Setup custom domain: `spatial.design-rite.com`

**Render Configuration:**
- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`
- **Environment:** Node 20
- **Auto-Deploy:** Yes (main branch)

### Phase 5: Main App Integration (Week 3)

**Tasks:**
1. Add `NEXT_PUBLIC_SPATIAL_STUDIO_API_URL` to main app env
2. Create API client wrapper: `lib/spatial-studio-client.ts`
3. Update admin pages to call microservice
4. Test integration end-to-end

**Client Wrapper Example:**
```typescript
// lib/spatial-studio-client.ts in design-rite-v3
import { getSession } from 'next-auth/react'

const SPATIAL_API = process.env.NEXT_PUBLIC_SPATIAL_STUDIO_API_URL

export async function uploadFloorPlan(formData: FormData) {
  const session = await getSession()

  const res = await fetch(`${SPATIAL_API}/api/spatial-studio/upload-floorplan`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session?.accessToken}`
    },
    body: formData
  })

  return res.json()
}

export async function analyzeSite(projectId: string) {
  const session = await getSession()

  const res = await fetch(`${SPATIAL_API}/api/spatial-studio/analyze-site`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.accessToken}`
    },
    body: JSON.stringify({ projectId })
  })

  return res.json()
}
```

### Phase 6: MCP Server Integration (Week 4)

**Tasks:**
1. Create `/api/mcp/route.ts` endpoint
2. Implement MCP commands (upload, analyze, list)
3. Update Claude Desktop config
4. Test MCP integration

**MCP Endpoint:**
```typescript
// app/api/mcp/route.ts
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('Authorization')
  if (authHeader !== `Bearer ${process.env.MCP_API_KEY}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { method, params } = await request.json()

  switch (method) {
    case 'spatial.upload':
      return handleUpload(params)
    case 'spatial.analyze':
      return handleAnalyze(params)
    case 'spatial.listProjects':
      return handleListProjects(params)
    default:
      return NextResponse.json({ error: 'Unknown method' }, { status: 400 })
  }
}
```

**Claude Desktop Config:**
```json
{
  "mcpServers": {
    "spatial-studio": {
      "url": "https://spatial-studio-api.onrender.com/mcp",
      "apiKey": "${SPATIAL_STUDIO_MCP_KEY}"
    }
  }
}
```

### Phase 7: Testing & Validation (Week 4-5)

**Tasks:**
1. Copy test suite to new repo
2. Update test URLs to microservice
3. Run all 22 tests, ensure passing
4. Create integration tests (main app → microservice)
5. Load testing (10+ concurrent uploads)

**Test Command:**
```bash
TEST_BASE_URL=https://spatial-studio-api.onrender.com \
  npm test -- __tests__/api/spatial-studio.test.ts
```

**Expected Result:**
```
Test Suites: 1 passed, 1 total
Tests:       22 passed, 22 total
Time:        76-90 seconds
```

---

## 🎯 Acceptance Criteria

### Technical Success
- [ ] All 22 tests passing on microservice
- [ ] Authentication working (shared JWT)
- [ ] Main app successfully calls microservice
- [ ] Database isolation working (RLS policies)
- [ ] Independent deployment successful
- [ ] MCP server responding to Claude Desktop

### Performance Success
- [ ] Upload response time < 2 seconds
- [ ] AI analysis completion < 45 seconds
- [ ] No degradation from monolith version
- [ ] Concurrent uploads handled (2+ simultaneous)

### Business Success
- [ ] Zero downtime during extraction
- [ ] User experience unchanged or improved
- [ ] Cost tracking per service enabled
- [ ] Documentation complete for replication

---

## 📚 Reference Documents

### In This Repo
- `SPATIAL_STUDIO_ROADMAP.md` - Product vision and phasing
- `docs/SPATIAL_STUDIO_TEST_PLAN.md` - Complete test strategy
- `docs/SPATIAL_STUDIO_EXTRACTION_PLAN.md` - Detailed extraction guide
- `__tests__/fixtures/README.md` - Test fixtures and results

### External References
- Spec Harvester repo (reference implementation)
- Render dashboard (deployment configuration)
- Supabase SQL Editor (database migrations)

---

## 🤝 How You Can Help

### Primary Assistance Needed

1. **Code Extraction Guidance**
   - Identify all dependencies to extract
   - Flag any tight coupling issues
   - Suggest refactoring for cleaner separation

2. **Authentication Implementation**
   - Ensure JWT validation working correctly
   - Help setup middleware properly
   - Debug cross-domain session issues

3. **Database Migration Strategy**
   - Review RLS policies for security
   - Suggest optimal isolation approach
   - Help write migration scripts

4. **Testing Support**
   - Ensure tests cover microservice edge cases
   - Help create integration test suite
   - Identify gaps in test coverage

5. **Documentation**
   - Keep extraction process documented
   - Note any deviations from plan
   - Capture lessons learned

---

## 🚨 Potential Pitfalls

### Watch Out For

1. **Authentication Issues**
   - ⚠️ JWT secret must be identical across services
   - ⚠️ Cookie domain settings for cross-domain auth
   - ⚠️ Session expiration handling

2. **Database Access**
   - ⚠️ RLS policies can be tricky to debug
   - ⚠️ Service role vs. anon key permissions
   - ⚠️ Forgotten columns needing `service_name`

3. **Environment Variables**
   - ⚠️ Missing vars cause silent failures
   - ⚠️ Development vs. production URLs
   - ⚠️ API keys must be separate per service

4. **CORS Issues**
   - ⚠️ Main app calling microservice needs CORS headers
   - ⚠️ Cookie-based auth requires credentials: 'include'

5. **File Upload Size**
   - ⚠️ Render has 100MB request limit
   - ⚠️ Need to enforce 10MB limit in code
   - ⚠️ Supabase storage limits

---

## 💡 Key Decisions Made

### Why Microservice vs. Monolith?

**Pros:**
- ✅ Independent scaling (AI workload separate)
- ✅ Clearer cost attribution per product
- ✅ Faster deployment cycles
- ✅ Reusable pattern for future products
- ✅ Easier to white-label or sell separately

**Cons:**
- ⚠️ More complex architecture
- ⚠️ Harder to debug (distributed tracing)
- ⚠️ Network latency between services
- ⚠️ Authentication complexity

**Decision:** Proceed with microservice
- Benefits outweigh complexity
- We've proven the pattern with Spec Harvester
- Business needs justify architecture investment

### Why Shared Database?

**Alternative considered:** Separate Supabase instance per service

**Decision:** Keep shared database
- **Reason:** Cross-product queries needed (user activity, billing)
- **Isolation:** RLS policies provide security
- **Cost:** One Supabase project cheaper than multiple
- **Complexity:** Single source of truth for users

### Why MCP Server?

**Alternative considered:** Direct API calls from Claude Desktop

**Decision:** Use MCP pattern
- **Reason:** Standardized across all our services
- **Consistency:** Same approach as Spec Harvester
- **Future-proof:** Easier to add new commands
- **Security:** API key authentication built-in

---

## 📞 Questions to Ask

### Before Starting
- Which environment should I deploy to first? (Staging vs. Production)
- Do you want the admin UI in microservice or keep in main app?
- Should we maintain backward compatibility with old API routes?
- What's the priority: speed of extraction or zero downtime?

### During Extraction
- Found tight coupling - should I refactor or keep minimal changes?
- Database migration strategy - all at once or gradual migration?
- Testing approach - migrate tests first or after extraction?
- Error handling - how should microservice failures appear to users?

### After Deployment
- How do we monitor microservice health?
- What alerts should we set for failures?
- Cost limits - when should we get notified?
- Rollback plan - how do we revert if needed?

---

## ✅ Success Looks Like

### Day 1: Repository Setup Complete
- New repo created and cloned
- Dependencies installed
- Basic structure in place
- Environment variables documented

### Week 1: Local Development Working
- API routes copied and functional
- Tests running locally
- Authentication middleware working
- Database connections established

### Week 2: Database Isolation Complete
- RLS policies deployed
- Existing data migrated
- Service-specific access verified
- Cross-service queries tested

### Week 3: Production Deployment Live
- Render service deployed
- Main app calling microservice
- All tests passing in production
- Zero customer-facing errors

### Week 4: MCP Integration Done
- Claude Desktop connecting successfully
- MCP commands working
- Documentation updated
- Team trained on new architecture

### Week 5: Monitoring & Optimization
- Dashboards showing metrics
- Cost tracking per service
- Performance optimized
- Ready for next product extraction

---

**Use this document as context for all conversations about Spatial Studio extraction.**

**Key Principle:** We're not building from scratch - we're carefully separating working code into a more scalable architecture.

---

**Document Created:** October 3, 2025
**For Use In:** New Claude Desktop project
**Project Name:** "Spatial Studio Microservice Extraction"
