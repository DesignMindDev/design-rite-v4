# 🏗️ DESIGN-RITE COMPLETE TOPOLOGY DIAGRAM
**Analysis Date:** October 10, 2025
**Total Services:** 9 Components across 7 Ports
**Launch Target:** October 17, 2025

---

## 📐 **VISUAL TOPOLOGY**

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          DESIGN-RITE ECOSYSTEM                          │
│                     🌐 https://design-rite.com                          │
└─────────────────────────────────────────────────────────────────────────┘
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
        ┌───────────▼──────────┐          ┌────────────▼────────────┐
        │   MAIN PLATFORM v4   │          │  SUBSCRIBER PORTAL      │
        │   Port 3000          │◄────────►│  https://portal...      │
        │   95% Ready          │  Cross-  │  100% Ready             │
        │   93 API Endpoints   │  Domain  │  8 Features             │
        └──────────┬───────────┘  Auth    └─────────────────────────┘
                   │
                   │ Supabase Auth + Database
                   │
        ┌──────────▼─────────────────────────────────────────────┐
        │              SUPABASE (PostgreSQL)                     │
        │  - auth.users (authentication)                         │
        │  - public.* (50+ tables)                               │
        │  - Storage buckets (spatial-floorplans, etc)           │
        └────────────────────────────────────────────────────────┘
                   │
                   │ Data Layer
                   │
        ┌──────────┴──────────────────────────────────────────────┐
        │                                                          │
        │              MICROSERVICES LAYER                         │
        │                                                          │
        │  ┌─────────────────────────────────────────────┐        │
        │  │  1. CREATIVE STUDIO (Port 3030)              │        │
        │  │     ✅ Production Ready                      │        │
        │  │     - Blog post generation                   │        │
        │  │     - Case study creation                    │        │
        │  │     - Technical documentation                │        │
        │  │     - Multi-format export (HTML/MD/PDF)      │        │
        │  └─────────────────────────────────────────────┘        │
        │                                                          │
        │  ┌─────────────────────────────────────────────┐        │
        │  │  2. SUPER AGENT (Port 9500) 🧠               │        │
        │  │     ✅ Production Ready                      │        │
        │  │     - Claude 3.5 Sonnet orchestration        │        │
        │  │     - 12 tools across all services           │        │
        │  │     - Natural language → multi-step workflows│        │
        │  │     - Parallel/sequential execution          │        │
        │  └─────────────────────────────────────────────┘        │
        │                                                          │
        │  ┌─────────────────────────────────────────────┐        │
        │  │  3. SPATIAL STUDIO (Port 3020) 📐            │        │
        │  │     ✅ Production Ready (22/22 tests)        │        │
        │  │     - GPT-4 Vision floor plan analysis       │        │
        │  │     - 3D visualization (Three.js)            │        │
        │  │     - Async processing architecture          │        │
        │  │     - Smart camera placement                 │        │
        │  └─────────────────────────────────────────────┘        │
        │                                                          │
        │  ┌─────────────────────────────────────────────┐        │
        │  │  4. INSIGHT STUDIO (Ports 8000/8002) 🔍      │        │
        │  │     ✅ 85% Ready (MCP Server)                │        │
        │  │     - Web scraping (static/dynamic)          │        │
        │  │     - YouTube transcription (Whisper AI)     │        │
        │  │     - Competitor intelligence                │        │
        │  │     - $50K+/year cost savings                │        │
        │  └─────────────────────────────────────────────┘        │
        │                                                          │
        │  ┌─────────────────────────────────────────────┐        │
        │  │  5. TESTING SERVICE (Port 9600) 🧪           │        │
        │  │     ✅ Production Ready                      │        │
        │  │     - Automated test execution               │        │
        │  │     - Cron scheduling (APScheduler)          │        │
        │  │     - WebSocket live updates                 │        │
        │  │     - AI chat assistant for test analysis    │        │
        │  └─────────────────────────────────────────────┘        │
        │                                                          │
        └──────────────────────────────────────────────────────────┘
                                   │
                                   │ API Calls
                                   │
        ┌──────────────────────────▼──────────────────────────┐
        │           EXTERNAL AI PROVIDERS                      │
        │                                                      │
        │  🤖 Anthropic (Claude 3.5 Sonnet) - Primary          │
        │  🤖 OpenAI (GPT-4/Vision) - Secondary + Spatial      │
        │  🤖 Google (Gemini) - Tertiary                       │
        │                                                      │
        │  Multi-AI Failover: Claude → OpenAI → Gemini        │
        └──────────────────────────────────────────────────────┘
                                   │
        ┌──────────────────────────▼──────────────────────────┐
        │           PAYMENT & INTEGRATIONS                     │
        │                                                      │
        │  💳 Stripe (Subscriptions) - 80% Ready               │
        │  📅 Calendly (Demo Booking) - 100% Ready             │
        │  📊 System Surveyor (Excel Import) - 100% Ready      │
        └──────────────────────────────────────────────────────┘
```

---

## 🔗 **SERVICE INTEGRATION MAP**

### **Data Flow Architecture:**

```
User Request
    │
    ├──► Main Platform (Port 3000)
    │    ├──► Supabase Auth (Authentication)
    │    ├──► Multi-AI Engine (Claude/OpenAI/Gemini)
    │    ├──► Stripe API (Subscriptions)
    │    ├──► Calendly Webhook (Demo Bookings)
    │    └──► System Surveyor Import (Excel)
    │
    ├──► Subscriber Portal (portal.design-rite.com)
    │    ├──► Cross-domain auth from Main Platform
    │    ├──► AI Assistant (GPT-4)
    │    ├──► Document upload & analysis
    │    └──► Business tools (invoice generation)
    │
    └──► Microservices (Standalone/Future Integration)
         ├──► Creative Studio (Port 3030)
         │    └──► OpenAI Assistants → Blog/Case Study → PDF/HTML
         │
         ├──► Super Agent (Port 9500)
         │    ├──► Claude 3.5 → Orchestration Logic
         │    ├──► Calls: MCP, Intelligence, Spatial, Creative, Estimator
         │    └──► Supabase → Audit Trail
         │
         ├──► Spatial Studio (Port 3020)
         │    ├──► Upload → Supabase Storage
         │    ├──► GPT-4 Vision → Floor Plan Analysis
         │    ├──► Three.js → 3D Visualization
         │    └──► Supabase → Project Data
         │
         ├──► Insight Studio (Port 8000/8002)
         │    ├──► Playwright → Web Scraping
         │    ├──► Whisper AI → Video Transcription
         │    ├──► Claude → Competitive Analysis
         │    └──► Supabase → Intelligence Data
         │
         └──► Testing Service (Port 9600)
              ├──► FastAPI → Test Runner
              ├──► WebSocket → Live Progress
              ├──► APScheduler → Cron Jobs
              └──► Supabase → Test Results
```

---

## 📊 **COMPLETE API ENDPOINT INVENTORY**

### **MAIN PLATFORM (Port 3000) - 93 Endpoints**

#### **Authentication & User Management (8 endpoints)**
```
POST   /api/auth/login                    - User authentication
POST   /api/auth/logout                   - Session termination
POST   /api/auth/signup                   - New user registration
GET    /api/auth/session                  - Session validation
POST   /api/auth/refresh                  - Token refresh
GET    /api/user/profile                  - User profile data
PUT    /api/user/profile                  - Update profile
DELETE /api/user/account                  - Account deletion
```

#### **AI Discovery & Assessment (12 endpoints)**
```
POST   /api/discovery-assistant           - AI chat interface (no rate limit ⚠️)
POST   /api/ai-assessment                 - Generate assessment (no rate limit ⚠️)
POST   /api/ai-assessment/refine          - Refine assessment
GET    /api/ai-assessment/{id}            - Retrieve assessment
PUT    /api/ai-assessment/{id}            - Update assessment
DELETE /api/ai-assessment/{id}            - Delete assessment
POST   /api/discovery-assistant/save      - Save conversation
GET    /api/discovery-assistant/history   - Conversation history
POST   /api/chat/message                  - Send chat message
POST   /api/chat/refinement               - Refine with AI
GET    /api/chat/sessions                 - List chat sessions
POST   /api/chat/clear                    - Clear chat history
```

#### **Quote Generation & Proposals (10 endpoints)**
```
POST   /api/generate-quote                - Generate quote (60 req/min)
GET    /api/quotes                        - List user quotes
GET    /api/quotes/{id}                   - Get specific quote
PUT    /api/quotes/{id}                   - Update quote
DELETE /api/quotes/{id}                   - Delete quote
POST   /api/quotes/{id}/export            - Export quote PDF
POST   /api/quotes/compare                - Compare multiple quotes
POST   /api/proposals/generate            - Generate proposal
GET    /api/proposals/{id}                - Get proposal
POST   /api/proposals/{id}/export         - Export proposal PDF
```

#### **Scenario Library (5 endpoints)**
```
GET    /api/scenarios                     - List scenarios (60 req/min)
GET    /api/scenarios/{id}                - Get scenario details
POST   /api/scenarios/apply               - Apply scenario to project
GET    /api/scenarios/industries          - List industries
GET    /api/scenarios/search              - Search scenarios
```

#### **System Surveyor Integration (5 endpoints)**
```
POST   /api/system-surveyor/auth          - Authenticate API
GET    /api/system-surveyor/sites         - List sites
GET    /api/system-surveyor/surveys       - Get surveys
POST   /api/system-surveyor/import        - Import survey data
POST   /api/system-surveyor/upload-excel  - Upload Excel (12 req/5min)
```

#### **Product Intelligence (6 endpoints)**
```
GET    /api/products                      - Search products
GET    /api/products/{id}                 - Get product details
POST   /api/products/recommend            - Get recommendations
GET    /api/products/pricing              - Get pricing data
POST   /api/products/compare              - Compare products
GET    /api/products/categories           - List categories
```

#### **AI Providers Management (8 endpoints)**
```
GET    /api/ai-providers                  - List providers
POST   /api/ai-providers                  - Add provider
PUT    /api/ai-providers/{id}             - Update provider
DELETE /api/ai-providers/{id}             - Remove provider
POST   /api/ai-providers/{id}/test        - Test connection
GET    /api/ai-providers/health           - Health status
POST   /api/ai-providers/failover         - Trigger failover
GET    /api/ai-providers/usage            - Usage stats
```

#### **Stripe Subscriptions (8 endpoints)**
```
POST   /api/stripe/create-checkout        - Create checkout session
POST   /api/stripe/create-portal          - Customer portal
POST   /api/stripe/webhook                - Stripe webhooks
GET    /api/stripe/subscription           - Get subscription
PUT    /api/stripe/subscription           - Update subscription
DELETE /api/stripe/subscription           - Cancel subscription
GET    /api/stripe/invoices               - List invoices
GET    /api/stripe/payment-methods        - List payment methods
```

#### **Calendly Demo Booking (4 endpoints)**
```
POST   /api/webhooks/calendly             - Calendly webhook
GET    /api/demo-dashboard                - Dashboard stats
POST   /api/demo-dashboard                - Update booking
GET    /api/demo-bookings                 - List bookings
```

#### **Spatial Studio (Inside v4) (7 endpoints)**
```
POST   /api/spatial-studio/upload-floorplan     - Upload (async, no rate limit ⚠️)
POST   /api/spatial-studio/process-analysis     - Background worker
GET    /api/spatial-studio/upload-floorplan     - Get project status
POST   /api/spatial-studio/analyze-site         - Camera recommendations
POST   /api/spatial-studio/add-annotation       - GPS annotations
GET    /api/spatial-studio/analytics            - Usage metrics
DELETE /api/spatial-studio/projects/{id}        - Delete project
```

#### **Creative Studio (Inside v4 - Vision Only) (7 endpoints - NOT BUILT)**
```
POST   /api/creative-studio/generate      - Generate content (NOT IMPLEMENTED)
POST   /api/creative-studio/chat          - Refinement chat (NOT IMPLEMENTED)
GET    /api/creative-studio/projects      - List projects (NOT IMPLEMENTED)
POST   /api/creative-studio/assets        - Upload assets (NOT IMPLEMENTED)
GET    /api/creative-studio/designs       - Templates (NOT IMPLEMENTED)
POST   /api/creative-studio/publish       - Export content (NOT IMPLEMENTED)
GET    /api/creative-studio/history       - Generation history (NOT IMPLEMENTED)
```

#### **Admin Dashboard (13 endpoints)**
```
GET    /api/admin/dashboard               - Dashboard stats
GET    /api/admin/users                   - List users
POST   /api/admin/users                   - Create user
PUT    /api/admin/users/{id}              - Update user
DELETE /api/admin/users/{id}              - Delete user
GET    /api/admin/activity                - Activity logs
GET    /api/admin/assessments             - List assessments
GET    /api/admin/team-activity           - Team activity
POST   /api/admin/permissions             - Set permissions
GET    /api/admin/super                   - Super admin panel
GET    /api/admin/ai-providers            - Provider management
GET    /api/admin/demo-dashboard          - Demo bookings
POST   /api/admin/export-data             - Export platform data
```

---

### **CREATIVE STUDIO (Port 3030) - 7 Endpoints (Standalone)**

```
POST   /api/generate                      - AI content generation
POST   /api/chat                          - Interactive refinement
GET    /api/projects                      - List projects
POST   /api/projects                      - Create project
POST   /api/assets                        - Upload files
GET    /api/designs                       - Template library
POST   /api/publish                       - Export (HTML/MD/PDF)
```

---

### **SUPER AGENT (Port 9500) - 4 Endpoints**

```
POST   /orchestrate                       - Natural language orchestration
GET    /health                            - Service health
GET    /tools                             - List available tools (12)
GET    /docs                              - API documentation (Swagger)
```

**12 Tools Available:**
- MCP Server: `scrape_static_page`, `scrape_dynamic_page`, `analyze_competitor_page`, `monitor_page_changes`
- Intelligence: `get_product_pricing`, `transcribe_video`, `search_competitor_intel`
- Spatial: `analyze_floor_plan`
- Creative: `generate_blog_post`, `generate_case_study`
- Estimator: `generate_security_proposal`, `compare_specifications`

---

### **SPATIAL STUDIO (Port 3020) - 5 Endpoints (Standalone)**

```
POST   /api/upload-floorplan              - Upload floor plan
POST   /api/process-analysis              - Background worker
GET    /api/upload-floorplan              - Poll status
POST   /api/analyze-site                  - Camera placement
GET    /api/analytics                     - Usage stats
```

---

### **INSIGHT STUDIO (Ports 8000/8002) - 12 Endpoints**

**MCP Server (Port 8000):**
```
POST   /scrape/static                     - Static page scraping
POST   /scrape/dynamic                    - Dynamic page scraping
POST   /analyze/competitor                - Competitor analysis
POST   /monitor/page                      - Page monitoring
GET    /health                            - Health check
```

**Intelligence Platform (Port 8002):**
```
POST   /products/search                   - Product search
GET    /products/pricing                  - Real-time pricing
POST   /video/transcribe                  - YouTube transcription
POST   /intel/competitor                  - Competitive intel
GET    /intel/search                      - Intelligence search
POST   /insights/generate                 - AI insights
GET    /health                            - Health check
```

---

### **TESTING SERVICE (Port 9600) - 15 Endpoints**

```
POST   /api/tests/run                     - Run tests immediately
GET    /api/tests/status/{run_id}         - Test status
GET    /api/tests/results                 - List test runs
WS     /api/tests/stream/{run_id}         - Live updates (WebSocket)
POST   /api/schedules                     - Create schedule
GET    /api/schedules                     - List schedules
PUT    /api/schedules/{id}                - Update schedule
DELETE /api/schedules/{id}                - Delete schedule
POST   /api/chat                          - AI chat
GET    /api/chat/history                  - Chat history
GET    /api/agents/status                 - Agent status
GET    /health                            - Service health
POST   /api/export/pdf                    - Export PDF report
POST   /api/export/csv                    - Export CSV report
GET    /api/export/json                   - Export JSON data
```

---

## ❓ **WHY ARE THERE DUPLICATES?**

### **Spatial Studio - 2 Versions Explained:**

**Timeline of Development:**

1. **Phase 1 (Standalone Microservice - Port 3020)**
   - Built as separate Next.js app
   - Complete with 22 automated tests
   - Production-ready deployment
   - Three.js 3D visualization
   - Async processing architecture
   - **Purpose:** Rapid prototyping, independent deployment

2. **Phase 2 (Integrated in v4 - `/admin/spatial-studio-dev`)**
   - Features copied into main platform
   - Tighter integration with admin panel
   - Shared authentication
   - Same functionality, different architecture
   - **Purpose:** Unified admin experience

**Why Both Exist:**
- Standalone was built FIRST for speed
- v4 integration started for unified UX
- Both work, but maintaining both is inefficient
- **Decision needed:** Which to keep for launch?

### **Creative Studio - 2 Versions Explained:**

1. **Standalone Microservice (Port 3030)**
   - Fully built and production-ready
   - 7 API endpoints working
   - OpenAI Assistants integration
   - Multi-format export

2. **Vision Document in v4 (`AI_CREATIVE_STUDIO.md`)**
   - Just a concept document
   - 0% code written
   - Future integration plan
   - **Purpose:** Documentation of future intent

**Why Both Exist:**
- Standalone was built as proof-of-concept
- v4 document is the PLAN for future integration
- Only standalone actually works
- **Decision needed:** Use standalone or skip for launch?

---

## 🎯 **RECOMMENDED LAUNCH ARCHITECTURE**

### **Option A: Core + Proxied Microservices (RECOMMENDED)**

```
Production Deployment:

Main Platform (design-rite.com)
├── Port 3000 - Main app with 93 endpoints
├── Proxy to Creative Studio (internal URL)
│   └── /admin/creative-studio/* → Port 3030
├── Proxy to Spatial Studio (choose one!)
│   ├── Option 1: Use /admin/spatial-studio-dev (integrated)
│   └── Option 2: Proxy to Port 3020 (standalone)
├── Proxy to Insight Studio
│   └── /admin/insight-studio/* → Port 8000
└── Proxy to Super Agent
    └── /admin/super-agent/* → Port 9500

Subscriber Portal (portal.design-rite.com)
└── Port 443 - 8 features live

Testing Service (internal.design-rite.com)
└── Port 9600 - Automated testing
```

**Pros:**
- ✅ Use production-ready services immediately
- ✅ Independent scaling per service
- ✅ Can launch THIS WEEK (6 hours work)
- ✅ Easy to maintain and update

**Cons:**
- ⚠️ More complex deployment (7 services)
- ⚠️ Need reverse proxy configuration

---

### **Option B: Monolithic (NOT RECOMMENDED)**

**Why NOT Recommended:**
- ❌ 100+ hours to rebuild all microservices in v4
- ❌ Delays launch by weeks
- ❌ Risk breaking working services
- ❌ Duplicate effort (already built!)

---

## 🚀 **LAUNCH DECISION MATRIX**

### **For October 17 Launch:**

**Include (MUST HAVE):**
- ✅ Main Platform v4 (Port 3000) - 95% ready
- ✅ Subscriber Portal - 100% ready
- ✅ Stripe production testing - 2 hours
- ✅ Rate limiting expansion - 2 hours
- ✅ Smoke tests - 2 hours

**Include (NICE TO HAVE - If Help Platform):**
- ✅ Spatial Studio (use v4 integrated version for now)
- ✅ Testing Service (for internal monitoring)

**Deploy Post-Launch (Week 1-4):**
- 📅 Creative Studio integration - Week 2
- 📅 Super Agent dashboard - Week 2-3
- 📅 Insight Studio admin page - Week 1
- 📅 Deprecate duplicate Spatial Studio - Week 1

---

## 🔐 **SECURITY & AUTHENTICATION FLOW**

```
User Authentication Flow:

1. User visits design-rite.com
   ├── Clicks "Sign In"
   └──► Redirected to portal.design-rite.com/auth

2. Portal Authentication
   ├── Supabase Auth (magic link or password)
   ├── Creates session (JWT token)
   └──► Redirects to design-rite.com#session={encoded_token}

3. Main Platform Session Restore
   ├── Reads session from URL hash
   ├── Validates with Supabase
   ├── Sets local session
   └──► User authenticated across both domains

4. API Requests
   ├── Include Authorization: Bearer {token}
   ├── Middleware validates on each request
   └──► Returns 401 if invalid/expired
```

---

## 📊 **DEPLOYMENT CHECKLIST**

### **Services to Deploy:**

**Production URLs:**
```
Main Platform:      https://design-rite.com (Render)
Subscriber Portal:  https://portal.design-rite.com (Render - DONE ✅)
Creative Studio:    https://creative.design-rite.com (Render - TBD)
Spatial Studio:     N/A (use integrated in v4)
Super Agent:        Internal only (Port 9500 - TBD)
Insight Studio:     Internal only (Port 8000 - TBD)
Testing Service:    Internal only (Port 9600 - TBD)
```

**Environment Variables Needed:**
```bash
# All Services Need:
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_KEY=...
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...

# Main Platform Also Needs:
STRIPE_SECRET_KEY=...
STRIPE_WEBHOOK_SECRET=...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...

# Microservices Need:
NEXT_PUBLIC_MAIN_APP_URL=https://design-rite.com
```

---

**Last Updated:** October 10, 2025
**Created By:** Claude Code
**Status:** Ready for launch decisions ✅
