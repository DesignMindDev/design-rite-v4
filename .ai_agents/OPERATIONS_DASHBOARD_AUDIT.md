# Operations Dashboard Audit & Implementation Plan
**Date**: 2025-10-01
**Objective**: Create unified operations dashboard with complete Supabase table visibility

---

## 📊 Current State: Existing Tables & Dashboards

### ✅ Tables WITH Dashboards

| Table | Dashboard | Location | Status |
|-------|-----------|----------|--------|
| `demo_bookings` | Demo Dashboard | `/admin/demo-dashboard` | ✅ Complete |
| `leads` | Leads Dashboard | `/admin/leads-dashboard` | ✅ Complete |
| `web_activity_events` | Leads Dashboard | `/admin/leads-dashboard` | ✅ Integrated |
| `spatial_projects` | Spatial Studio | `/admin/spatial-studio` | ✅ Complete |

### ⚠️ Tables WITHOUT Dashboards (GAPS IDENTIFIED)

| Table | Purpose | Priority | Missing Analytics |
|-------|---------|----------|-------------------|
| `ai_sessions` | AI chat sessions tracking | 🔴 HIGH | Session duration, provider usage, user engagement |
| `ai_conversations` | Individual chat messages | 🔴 HIGH | Message volume, response times, conversation flow |
| `ai_analysis_debug` | Spatial Studio AI logs | 🟡 MEDIUM | OpenAI API performance, error rates, execution times |
| `chatbot_conversations` | Chatbot interactions | 🔴 HIGH | Conversation quality, user satisfaction, topic analysis |
| `ai_device_suggestions` | Spatial Studio AI suggestions | 🟡 MEDIUM | Suggestion accuracy, acceptance rates |
| `site_annotations` | Spatial Studio site walks | 🟡 MEDIUM | Annotation density, GPS accuracy |
| `lead_notes` | Lead interaction notes | 🟢 LOW | Note frequency, manual vs automated |

---

## 🎯 Required Dashboards (Priority Order)

### 1️⃣ **Operations Dashboard** (NEW - MASTER DASHBOARD)
**Purpose**: Single pane of glass for all platform operations
**Location**: `/admin/operations`
**Priority**: 🔴 CRITICAL

**Metrics to Display**:
- **Real-time Activity**: Last 24 hours activity across all tables
- **System Health**: API response times, error rates, uptime
- **User Engagement**: Active sessions, tool usage, conversions
- **Revenue Metrics**: Trial starts, conversions, MRR
- **AI Performance**: OpenAI API usage, costs, success rates
- **Lead Pipeline**: New leads, demos booked, conversion funnel

**Data Sources**:
```typescript
- demo_bookings (demo metrics)
- leads (lead scoring, conversion rates)
- ai_sessions (AI usage stats)
- ai_conversations (message volume)
- ai_analysis_debug (AI performance)
- spatial_projects (Spatial Studio usage)
- web_activity_events (user journey mapping)
```

---

### 2️⃣ **AI Sessions Analytics** (NEW)
**Purpose**: Analyze AI assistant usage and performance
**Location**: `/admin/ai-analytics`
**Priority**: 🔴 HIGH

**Key Metrics**:
- **Session Metrics**: Total sessions, avg duration, messages per session
- **Provider Breakdown**: Usage by provider (Claude, OpenAI, fallback)
- **User Engagement**: Active users, returning users, abandonment rate
- **Assessment Data**: Common assessment scenarios, completion rates
- **Time Series**: Sessions over time, peak usage hours

**Queries Needed**:
```sql
-- Session volume by provider
SELECT ai_provider, COUNT(*) as sessions, AVG(message_count) as avg_messages
FROM ai_sessions
GROUP BY ai_provider;

-- Daily active users
SELECT DATE(created_at) as date, COUNT(DISTINCT user_hash) as active_users
FROM ai_sessions
GROUP BY DATE(created_at);

-- Average session duration (using last_activity - created_at)
SELECT AVG(EXTRACT(EPOCH FROM (last_activity - created_at))) as avg_duration_seconds
FROM ai_sessions;
```

---

### 3️⃣ **Chatbot Analytics** (ENHANCE EXISTING)
**Purpose**: Deep dive into chatbot performance
**Location**: `/admin/chatbot` (enhance current page)
**Priority**: 🔴 HIGH

**Current State**: Basic dashboard exists, needs enhancement

**Add These Metrics**:
- **Conversation Quality**: Avg satisfaction score, thumbs up/down ratio
- **Topic Analysis**: Most common questions, intent classification
- **Deflection Rate**: % of conversations that don't escalate to human
- **Response Times**: Avg time to first response, time to resolution
- **Fallback Rate**: How often chatbot falls back to generic responses

---

### 4️⃣ **Spatial Studio Analytics** (ENHANCE EXISTING)
**Purpose**: Track Spatial Studio usage and AI performance
**Location**: `/admin/spatial-studio` (enhance current page)
**Priority**: 🟡 MEDIUM

**Current State**: Admin page exists, needs analytics

**Add These Metrics**:
- **Upload Performance**: Upload success rate, avg file size, file types
- **AI Analysis Performance** (from `ai_analysis_debug`):
  - Success rate by operation
  - Avg execution time
  - Retry frequency
  - Error categories
- **User Adoption**: Projects per user, completion rates
- **Cost Tracking**: OpenAI API costs per analysis

**Query Examples**:
```sql
-- AI analysis performance
SELECT
  operation,
  COUNT(*) as total_attempts,
  COUNT(*) FILTER (WHERE error_message IS NULL) as successes,
  AVG(execution_time_ms) as avg_execution_ms
FROM ai_analysis_debug
GROUP BY operation;

-- Upload success rate
SELECT
  analysis_status,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM spatial_projects
GROUP BY analysis_status;
```

---

### 5️⃣ **Web Activity & Journey Mapping** (NEW)
**Purpose**: Visualize user journey from first visit to conversion
**Location**: `/admin/user-journey`
**Priority**: 🟡 MEDIUM

**Key Features**:
- **Funnel Visualization**: Landing → Tool Usage → Demo Book → Trial → Customer
- **Drop-off Analysis**: Where users abandon the journey
- **Tool Performance**: Which tools drive highest conversion rates
- **Session Replay** (conceptual): View individual user paths
- **Attribution Analysis**: Which UTM sources/campaigns perform best

---

## 📐 Dashboard Architecture

### Shared Components to Build

```typescript
// Generic metric card component
<MetricCard
  title="Total Sessions"
  value={1234}
  change="+12.5%"
  trend="up"
  icon={<Activity />}
/>

// Time series chart component
<TimeSeriesChart
  data={dailyMetrics}
  xKey="date"
  yKeys={['sessions', 'conversions']}
  title="Activity Over Time"
/>

// Funnel visualization
<FunnelChart
  stages={[
    { name: 'Landing', count: 1000 },
    { name: 'Tool Used', count: 600 },
    { name: 'Demo Booked', count: 150 },
    { name: 'Trial Started', count: 50 },
    { name: 'Converted', count: 15 }
  ]}
/>

// Data table with export
<DataTable
  columns={columns}
  data={rows}
  exportable={true}
  filterable={true}
  sortable={true}
/>
```

---

## 🔧 Implementation Strategy

### Phase 1: Operations Dashboard (Master Dashboard)
**Effort**: 4-6 hours
**Priority**: 🔴 CRITICAL

**Tasks**:
1. Create `/app/admin/operations/page.tsx`
2. Create API route `/app/api/admin/operations/route.ts`
3. Build reusable metric card components
4. Query all tables for high-level metrics
5. Add real-time activity feed
6. Add system health checks

**Queries to Build**:
```typescript
GET /api/admin/operations
Returns:
{
  realtime: {
    activeSessions: 42,
    todayLeads: 15,
    todayDemos: 3,
    aiApiCalls: 127
  },
  systemHealth: {
    apiResponseTime: 245,
    errorRate: 0.02,
    uptime: 99.9
  },
  userEngagement: {
    weeklyActiveUsers: 234,
    avgSessionDuration: 480,
    toolUsageRate: 0.65
  },
  revenue: {
    mrr: 15400,
    trialStarts: 12,
    conversions: 3
  }
}
```

---

### Phase 2: AI Sessions Analytics
**Effort**: 3-4 hours
**Priority**: 🔴 HIGH

**Tasks**:
1. Create `/app/admin/ai-analytics/page.tsx`
2. Create API route `/app/api/admin/ai-analytics/route.ts`
3. Query `ai_sessions` and `ai_conversations` tables
4. Build provider breakdown charts
5. Add time series graphs
6. Add user engagement metrics

---

### Phase 3: Enhance Existing Dashboards
**Effort**: 2-3 hours each
**Priority**: 🟡 MEDIUM

**Targets**:
- `/admin/chatbot` - Add conversation quality metrics
- `/admin/spatial-studio` - Add AI performance metrics from `ai_analysis_debug`
- `/admin/leads-dashboard` - Enhance with web activity journey mapping

---

### Phase 4: User Journey Mapping
**Effort**: 4-5 hours
**Priority**: 🟢 LOW

**Tasks**:
1. Create `/app/admin/user-journey/page.tsx`
2. Query `web_activity_events` for full user paths
3. Build funnel visualization
4. Add attribution analysis
5. Add drop-off analysis

---

## 📊 Database Views to Create (Optimize Queries)

```sql
-- Operations summary view
CREATE OR REPLACE VIEW operations_summary AS
SELECT
  (SELECT COUNT(*) FROM ai_sessions WHERE DATE(created_at) = CURRENT_DATE) as today_sessions,
  (SELECT COUNT(*) FROM leads WHERE DATE(created_at) = CURRENT_DATE) as today_leads,
  (SELECT COUNT(*) FROM demo_bookings WHERE DATE(created_at) = CURRENT_DATE) as today_demos,
  (SELECT COUNT(*) FROM spatial_projects WHERE DATE(created_at) = CURRENT_DATE) as today_projects,
  (SELECT COUNT(*) FROM ai_analysis_debug WHERE DATE(created_at) = CURRENT_DATE) as today_ai_calls;

-- AI performance metrics view
CREATE OR REPLACE VIEW ai_performance_metrics AS
SELECT
  operation,
  COUNT(*) as total_attempts,
  COUNT(*) FILTER (WHERE error_message IS NULL) as successes,
  ROUND(AVG(execution_time_ms), 0) as avg_execution_ms,
  MAX(execution_time_ms) as max_execution_ms
FROM ai_analysis_debug
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY operation;

-- Lead conversion funnel view
CREATE OR REPLACE VIEW lead_conversion_funnel AS
SELECT
  COUNT(*) as total_leads,
  COUNT(*) FILTER (WHERE demo_booked = true) as demo_booked,
  COUNT(*) FILTER (WHERE trial_started = true) as trial_started,
  COUNT(*) FILTER (WHERE converted_to_customer = true) as customers
FROM leads
WHERE created_at > NOW() - INTERVAL '30 days';
```

---

## 🎨 UI/UX Recommendations

### Navigation Structure
```
Admin (root)
├── Operations Dashboard (NEW - default landing page)
├── Analytics
│   ├── AI Sessions (NEW)
│   ├── Chatbot (enhance existing)
│   ├── Spatial Studio (enhance existing)
│   └── User Journey (NEW)
├── Leads & Sales
│   ├── Leads Dashboard (existing)
│   └── Demo Dashboard (existing)
├── Content Management
│   ├── Team Management (existing)
│   ├── Blog (existing)
│   └── Creative Studio (existing)
└── System
    ├── AI Providers (existing)
    ├── Session Debug (existing)
    └── User Activity (existing)
```

---

## 🚀 Next Steps (Recommended Order)

1. **Create Operations Dashboard** - Master dashboard for all metrics
2. **Create AI Sessions Analytics** - Deep dive into AI usage
3. **Enhance Chatbot Dashboard** - Add quality and performance metrics
4. **Enhance Spatial Studio Dashboard** - Add AI performance from debug logs
5. **Create User Journey Dashboard** - Full funnel visualization
6. **Create Database Views** - Optimize query performance
7. **Add Real-time Updates** - WebSocket or polling for live data

---

## 📈 Success Metrics

**When Complete, We Should Answer**:
- ✅ How many active AI sessions right now?
- ✅ What's our chatbot deflection rate?
- ✅ Which AI provider is most reliable?
- ✅ What's our lead-to-customer conversion rate?
- ✅ Which marketing channels drive highest-quality leads?
- ✅ How much are we spending on OpenAI API calls?
- ✅ Where do users drop off in the funnel?
- ✅ Which tools drive the most conversions?

---

**Ready for Implementation**: All existing Supabase tables identified, gaps documented, implementation plan ready.

**Estimated Total Effort**: 15-20 hours for complete operations visibility
