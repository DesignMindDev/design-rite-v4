3# 🎯 Admin Dashboard V2 - Enterprise Architecture

**Status:** In Development
**Timeline:** Oct 4-5, 2025 (2 days)
**Goal:** Enterprise-grade admin dashboard with AI testing, scheduling, reports, and chat

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    Design-Rite Admin V2                         │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Main App   │  │   Testing    │  │  Operations  │         │
│  │  (Vercel)    │  │   Service    │  │  Dashboard   │         │
│  │  Port 3000   │  │  Port 9600   │  │  (Existing)  │         │
│  └──────────────┘  └──────────────┘  └──────────────┘         │
│         │                  │                  │                │
│         └──────────────────┴──────────────────┘                │
│                            │                                    │
│                    ┌───────▼────────┐                          │
│                    │    Supabase     │                          │
│                    │   PostgreSQL    │                          │
│                    └─────────────────┘                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 New Admin Dashboard Structure

### **Top-Level Navigation**

```
┌─────────────────────────────────────────────────────────────┐
│  DESIGN-RITE ADMIN                              [User] [?]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  🏠 Overview    🧪 Testing    📊 Operations    📈 Reports   │
│  👥 Users       🤖 AI Chat    ⚙️  Settings                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### **1. Overview Dashboard** (`/admin`)
- System health at a glance
- Quick actions (run tests, view logs, check performance)
- Recent activity feed
- Critical alerts
- Key metrics cards with tooltips

### **2. Testing Hub** (`/admin/testing`)
- **Test Suites** - Pre-built test categories
  - 🔥 Stress Tests
  - 🛡️ Security Tests
  - 🎨 UX Tests
  - 👑 Admin Tests
  - 📦 Full Suite
- **Run Tests** - One-click execution with live progress
- **Schedules** - Cron job manager with visual builder
- **Results History** - Past test runs with filtering
- **Agent Status** - ChatGPT & Claude Code monitoring

### **3. Operations Dashboard** (`/admin/operations`)
**PRESERVED - Enhanced with tooltips**
- Super Agent orchestration metrics
- Tool usage analytics
- User journey funnels
- Session success rates
- Performance trends
- **NEW:** Hover tooltips explaining each metric

### **4. Reports** (`/admin/reports`)
- **Test Reports** - Export as PDF/CSV/JSON
- **Operations Reports** - Weekly/monthly summaries
- **Performance Reports** - Response times, throughput
- **Security Reports** - Vulnerability scans
- **Custom Reports** - Build your own
- **Scheduled Reports** - Email delivery

### **5. Users & Permissions** (`/admin/users`)
**EXISTING - Enhanced**
- User management (preserved from current system)
- Role-based access control
- Activity logs
- API key management

### **6. AI Chat Assistant** (`/admin/chat`)
**NEW - Integrated AI helper**
- Ask questions about metrics
- Get explanations of test results
- Query operations data
- Generate reports via chat
- Troubleshooting assistant
- Connected to all dashboard data

### **7. Settings** (`/admin/settings`)
- Testing service configuration
- Notification settings (Slack, email)
- Schedule defaults
- AI provider settings (preserved)
- System preferences

---

## 🎯 New Features

### **1. Tooltip System**
Every metric/chart has:
- **Hover tooltip** - Quick explanation
- **Click modal** - Detailed documentation
- **AI explanation** - Ask AI chat for context

Example:
```typescript
<MetricCard
  title="Session Success Rate"
  value="87.3%"
  tooltip="Percentage of orchestration sessions that completed successfully"
  helpModal={{
    title: "Understanding Session Success Rate",
    content: "This metric shows how many Super Agent requests...",
    formula: "(completed_sessions / total_sessions) * 100"
  }}
  aiContext="session_success_rate"
/>
```

### **2. Schedule Builder**
Visual cron builder:
- Select test suite
- Choose frequency (daily, weekly, custom)
- Set time (with timezone)
- Configure notifications
- Preview next 5 run times

### **3. Live Test Execution**
WebSocket-powered live updates:
- Real-time progress bar
- Test-by-test status updates
- Streaming logs
- Instant notifications
- Agent activity monitor

### **4. Advanced Filtering**
All data tables have:
- Date range picker
- Status filters
- Search across all fields
- Column sorting
- Export options

### **5. AI Chat Integration**
Natural language queries:
```
User: "Show me failed security tests from last week"
AI: [Fetches data] "Found 3 failed security tests..."

User: "Why is session success rate dropping?"
AI: [Analyzes trends] "Success rate declined 12% due to..."

User: "Create a report of all stress test failures"
AI: [Generates report] "Created report with 47 failures..."
```

---

## 🗄️ Database Schema

### **New Tables**

```sql
-- Test Schedules
CREATE TABLE test_schedules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  test_suite text NOT NULL, -- 'stress', 'security', 'ux', 'admin', 'full'
  cron_expression text NOT NULL,
  enabled boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  last_run_at timestamp with time zone,
  next_run_at timestamp with time zone,
  notification_settings jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Test Runs
CREATE TABLE test_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id uuid REFERENCES test_schedules(id),
  test_suite text NOT NULL,
  status text NOT NULL, -- 'running', 'completed', 'failed'
  started_at timestamp with time zone DEFAULT now(),
  completed_at timestamp with time zone,
  total_tests integer,
  passed_tests integer,
  failed_tests integer,
  duration_ms numeric,
  triggered_by text, -- 'manual', 'schedule', 'ci_cd'
  triggered_by_user uuid REFERENCES auth.users(id),
  results_summary jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Test Results (Individual tests)
CREATE TABLE test_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  test_run_id uuid REFERENCES test_runs(id) ON DELETE CASCADE,
  test_name text NOT NULL,
  test_category text NOT NULL,
  status text NOT NULL, -- 'passed', 'failed', 'skipped'
  duration_ms numeric,
  error_message text,
  details jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- AI Chat History
CREATE TABLE admin_chat_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  message text NOT NULL,
  response text NOT NULL,
  context jsonb, -- What data was queried
  created_at timestamp with time zone DEFAULT now()
);

-- Dashboard Help Content
CREATE TABLE dashboard_help (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key text UNIQUE NOT NULL, -- 'session_success_rate', etc.
  title text NOT NULL,
  short_description text NOT NULL, -- For tooltip
  full_description text NOT NULL, -- For modal
  formula text,
  example_use_case text,
  related_metrics text[],
  created_at timestamp with time zone DEFAULT now()
);
```

### **Preserved Tables**
- `orchestration_sessions` ✅
- `tool_usage_analytics` ✅
- `super_agent_user_journey` ✅
- All existing views ✅
- All existing RLS policies ✅

---

## 🎨 UI Components

### **New Reusable Components**

1. **`<MetricCard />`** - With tooltip & help modal
2. **`<TestSuiteCard />`** - Clickable test suite launcher
3. **`<ScheduleBuilder />`** - Visual cron builder
4. **`<LiveTestRunner />`** - Real-time test execution
5. **`<ResultsTable />`** - Advanced filtering & export
6. **`<AIChat />`** - Dashboard AI assistant
7. **`<ReportBuilder />`** - Custom report generator
8. **`<TooltipWrapper />`** - Universal tooltip component
9. **`<HelpModal />`** - Detailed metric explanations
10. **`<TrendChart />`** - Time-series visualization

---

## 🚀 Testing Microservice

**Location:** `design-rite-testing-service/`

**Technology Stack:**
- FastAPI (Python)
- APScheduler (cron jobs)
- WebSockets (live updates)
- Supabase (results storage)
- OpenAI (ChatGPT agent)

**Endpoints:**

```python
# Test Execution
POST   /api/tests/run              # Run tests immediately
GET    /api/tests/status/{run_id}  # Get test run status
WS     /api/tests/stream/{run_id}  # Live updates

# Scheduling
POST   /api/schedules              # Create schedule
GET    /api/schedules              # List schedules
PUT    /api/schedules/{id}         # Update schedule
DELETE /api/schedules/{id}         # Delete schedule

# Results
GET    /api/results                # List test runs (paginated)
GET    /api/results/{run_id}       # Get specific run
GET    /api/results/{run_id}/export # Export as PDF/CSV

# Agents
GET    /api/agents/status          # ChatGPT & Claude status
POST   /api/agents/trigger-fix     # Trigger Claude to fix issue

# AI Chat
POST   /api/chat                   # Query dashboard data via AI
GET    /api/chat/history           # Get chat history
```

---

## 📈 Reports System

### **Report Types**

1. **Test Summary Report**
   - Test run statistics
   - Success/failure breakdown
   - Trend analysis
   - Common failure patterns

2. **Operations Report**
   - Super Agent metrics
   - Tool usage stats
   - User journey analysis
   - Performance trends

3. **Security Report**
   - Vulnerability findings
   - Security test results
   - Risk assessment
   - Remediation recommendations

4. **Performance Report**
   - Response times
   - Throughput metrics
   - Resource utilization
   - Bottleneck analysis

5. **Custom Report**
   - User-defined metrics
   - Custom date ranges
   - Multiple data sources
   - Scheduled delivery

### **Export Formats**
- PDF (formatted with charts)
- CSV (raw data)
- JSON (API integration)
- Excel (with formulas)

---

## 🤖 AI Chat Integration

### **Capabilities**

**Data Queries:**
```
"Show me all failed tests from yesterday"
"What's the average response time for Super Agent?"
"How many users created this week?"
```

**Explanations:**
```
"Why did session success rate drop?"
"Explain the user journey funnel"
"What does tool_calls_count mean?"
```

**Actions:**
```
"Run security tests now"
"Schedule stress tests for tonight"
"Create a report of last week's failures"
```

**Analysis:**
```
"Compare this week's performance to last week"
"Find patterns in test failures"
"Recommend optimization based on metrics"
```

---

## 🎯 Implementation Plan

### **Phase 1: Foundation (Today - 4 hours)**
1. ✅ Create testing microservice structure
2. ✅ Set up FastAPI with basic endpoints
3. ✅ Create Supabase tables
4. ✅ Build new admin navigation
5. ✅ Create metric card components with tooltips

### **Phase 2: Testing Dashboard (Today - 4 hours)**
1. ✅ Test suite selector UI
2. ✅ Live test runner with WebSocket
3. ✅ Results viewer with filtering
4. ✅ Schedule builder UI
5. ✅ Agent status monitor

### **Phase 3: Reports & AI (Tomorrow - 4 hours)**
1. ✅ Report builder UI
2. ✅ PDF/CSV export
3. ✅ AI chat interface
4. ✅ Chat history
5. ✅ AI data query engine

### **Phase 4: Polish & Deploy (Tomorrow - 4 hours)**
1. ✅ Add all tooltips to operations dashboard
2. ✅ Help modal system
3. ✅ Notification system
4. ✅ Deploy testing service
5. ✅ Final testing & documentation

---

## 🔧 Technology Stack

**Frontend (Main App):**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Recharts (data visualization)
- Socket.io-client (WebSocket)
- React Query (data fetching)

**Backend (Testing Service):**
- FastAPI (Python)
- APScheduler (cron)
- WebSockets
- OpenAI SDK (ChatGPT)
- python-dotenv
- httpx (HTTP client)

**Database:**
- Supabase (PostgreSQL)
- Row-Level Security
- Real-time subscriptions

**Deployment:**
- Main App: Vercel
- Testing Service: Render/Railway
- Database: Supabase Cloud

---

## 📊 Success Metrics

**After Implementation:**
- ⚡ Run any test suite in <30 seconds
- 📅 Schedule tests with 1-click cron builder
- 📈 View all metrics with explanatory tooltips
- 📄 Generate reports in <5 seconds
- 🤖 Ask AI questions about any metric
- 🔔 Get instant notifications on failures
- 📱 Mobile-responsive admin panel

---

## 🎉 New Capabilities

**What You'll Be Able to Do:**

1. **Morning Routine:**
   - Open admin dashboard
   - Check overnight test results
   - Review AI-generated summary
   - Click tooltip to understand any metric

2. **Schedule Tests:**
   - "Run security tests every night at 2am"
   - "Stress test before every deployment"
   - "Full suite every Monday morning"

3. **AI-Powered Analysis:**
   - "Show me trends for last 30 days"
   - "Why are stress tests failing?"
   - "Create a report for the team"

4. **Instant Reports:**
   - Click "Generate Report"
   - Select metrics & date range
   - Export as PDF with charts
   - Email to team automatically

5. **Troubleshooting:**
   - Hover over any metric for explanation
   - Click for detailed documentation
   - Ask AI chat for context
   - Get fix recommendations

---

**Ready to build this? Let's start with Phase 1!** 🚀
