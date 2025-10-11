# Design-Rite v3 SQL Database Audit & Fixes

**Date**: 2025-10-01
**Purpose**: Organize SQL scripts, identify issues, enable admin dashboard visibility

---

## 🚨 CRITICAL FINDING: AI Chat Sessions NOT Being Captured

**Problem**: Multiple AI-assisted pages exist but conversations are NOT being logged to database.

**Root Cause**: AI chat endpoints don't call the logging API (`/api/ai/logging`)

**Impact**: Design-Rite employees have ZERO visibility into:
- How many people are using AI tools
- What questions users are asking
- Which AI providers are being used
- Conversation quality and user satisfaction
- Lead qualification opportunities from AI interactions

---

## 📊 SQL Scripts Inventory (9 Files)

### ✅ **ACTIVE & REQUIRED**

#### 1. `supabase/ai_sessions_tables.sql` ⭐ **PRIMARY**
**Status**: ✅ Active
**Purpose**: AI chat session tracking for admin dashboard
**Tables Created**:
- `ai_sessions` - Session metadata and tracking
- `ai_conversations` - Individual messages within sessions
- `ai_session_summaries` (VIEW) - Analytics view

**Used By**: `/api/ai/logging` endpoint
**Admin Dashboard Ready**: YES

**Recommendation**: ✅ **THIS IS THE CANONICAL SCHEMA** - Keep and use

---

#### 2. `supabase/demo_bookings_table.sql` ⭐ **WORKING**
**Status**: ✅ Active & Working
**Purpose**: Calendly demo booking integration
**Tables Created**:
- `demo_bookings` - Demo scheduling with lead scoring

**Used By**: `/api/webhooks/calendly`, `/api/demo-dashboard`
**Admin Dashboard**: `/admin/demo-dashboard` EXISTS

**Recommendation**: ✅ Keep - fully implemented and working

---

#### 3. `supabase/leads_tracking_tables.sql` ⭐ **COMPREHENSIVE**
**Status**: ✅ Active
**Purpose**: Complete lead journey tracking
**Tables Created**:
- `leads` - Core lead data with scoring
- `web_activity_events` - User behavior tracking
- `lead_notes` - Internal notes

**Functions**: Auto-scoring, lead grading (A-D)
**Admin Dashboard Ready**: YES

**Recommendation**: ✅ Keep - most comprehensive lead tracking

---

### ⚠️ **REDUNDANT / NEEDS CONSOLIDATION**

#### 4. `supabase_chatbot_table.sql`
**Status**: ⚠️ Redundant with #1
**Purpose**: Chatbot conversation logging
**Tables Created**:
- `chatbot_conversations` - Similar to `ai_conversations`

**Issue**: Different schema than `ai_sessions`/`ai_conversations`
**Recommendation**: 🔄 **DEPRECATE** - Consolidate into `ai_sessions` schema

---

#### 5. `setup_lead_tables.sql`
**Status**: ⚠️ Partial overlap with #3
**Purpose**: Basic lead capture tables
**Tables Created**:
- `waitlist_subscribers`
- `chat_interactions` (DUPLICATE!)
- `lead_scores` (DUPLICATE!)
- `contact_submissions`
- `email_campaigns`
- `email_activity`

**Issue**: Overlaps with `leads_tracking_tables.sql`
**Recommendation**: 🔄 **MERGE** with #3 or deprecate redundant tables

---

#### 6. `supabase-leads-table.sql`
**Status**: ⚠️ Minimal, redundant
**Purpose**: Simple leads table
**Tables Created**:
- `leads` (basic version, conflicts with #3)

**Recommendation**: ❌ **DELETE** - Superseded by comprehensive leads tracking

---

### 🏗️ **FEATURE-SPECIFIC (Keep)**

#### 7. `supabase_complete_setup.sql`
**Status**: ✅ Master setup file
**Purpose**: All-in-one database initialization
**Tables Created**:
- `chatbot_conversations`
- `ai_sessions`
- `ai_conversations`
- `assessments`

**Recommendation**: ✅ Keep as reference, but update to use canonical schemas

---

#### 8. `supabase_creative_studio_tables.sql`
**Status**: ✅ Feature-specific
**Purpose**: Creative Studio feature data
**Tables Created**: 8 tables for projects, assets, chat, content, research, designs

**Recommendation**: ✅ Keep - specific to Creative Studio feature

---

#### 9. `config/database/init.sql`
**Status**: ✅ Platform-level
**Purpose**: Core platform schema (users, subscriptions, assessments)
**Tables Created**: 6 core tables with authentication

**Recommendation**: ✅ Keep - foundational platform tables

---

## 🔧 FIXES REQUIRED

### Priority 1: Enable AI Chat Session Logging

**Problem**: AI chat endpoints NOT calling `/api/ai/logging`

**AI Chat Endpoints to Fix**:
1. `/api/ai-chat` - General AI chat
2. `/api/discovery-assistant` - Security assessment chat
3. `/api/help-assistant` - Help system chat
4. `/api/general-ai-chat` - Generic AI chat
5. `/api/creative-studio/chat` - Creative studio AI
6. `/api/ai/chat` - Generic AI chat endpoint

**Required Changes**:
Each endpoint must call `/api/ai/logging` with:
```typescript
// After AI response generated:
await fetch('/api/ai/logging', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'log_conversation',
    data: {
      sessionId,
      userHash,
      userMessage,
      aiResponse,
      aiProvider,
      timestamp: new Date().toISOString(),
      metadata: { page, feature, etc }
    }
  })
});
```

---

### Priority 2: Create Admin Dashboard for AI Sessions

**File to Create**: `app/admin/ai-sessions/page.tsx`

**Dashboard Features**:
- Total AI sessions count
- Sessions by AI provider (OpenAI, Claude, Simulated, etc.)
- Average messages per session
- Most active time periods
- User engagement metrics
- Conversation topics/categories
- Sessions list with search/filter
- Click to view full conversation

**SQL Query for Dashboard**:
```sql
-- Session Statistics
SELECT
  COUNT(*) as total_sessions,
  AVG(message_count) as avg_messages,
  ai_provider,
  COUNT(*) as sessions_by_provider
FROM ai_sessions
GROUP BY ai_provider
ORDER BY sessions_by_provider DESC;

-- Recent Sessions
SELECT * FROM ai_session_summaries
ORDER BY last_activity DESC
LIMIT 50;

-- Activity by Day
SELECT
  DATE(created_at) as date,
  COUNT(*) as session_count,
  SUM(message_count) as total_messages
FROM ai_sessions
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 30;
```

---

### Priority 3: Consolidate Redundant Tables

**Action Items**:
1. ❌ Delete `supabase-leads-table.sql` (basic, superseded)
2. 🔄 Merge `setup_lead_tables.sql` email tracking into `leads_tracking_tables.sql`
3. 🔄 Deprecate `chatbot_conversations` in favor of `ai_conversations`
4. 📝 Update `supabase_complete_setup.sql` to reference canonical schemas
5. 📁 Move all Supabase SQL files to `/supabase` directory for consistency

---

## 📋 CANONICAL SCHEMA DECISION

### **Use These Tables** (Final Decision):

#### AI Chat Tracking:
- ✅ `ai_sessions` (from `ai_sessions_tables.sql`)
- ✅ `ai_conversations` (from `ai_sessions_tables.sql`)

#### Lead Management:
- ✅ `leads` (from `leads_tracking_tables.sql` - comprehensive version)
- ✅ `web_activity_events` (from `leads_tracking_tables.sql`)
- ✅ `lead_notes` (from `leads_tracking_tables.sql`)

#### Demo Bookings:
- ✅ `demo_bookings` (from `demo_bookings_table.sql`)

#### Platform Core:
- ✅ `users`, `assessments`, `subscriptions` (from `config/database/init.sql`)

#### Feature-Specific:
- ✅ Creative Studio tables (from `supabase_creative_studio_tables.sql`)

---

## 🎯 IMMEDIATE ACTION PLAN

### Step 1: Verify Tables Exist in Supabase
```sql
-- Run in Supabase SQL Editor
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;
```

### Step 2: Check for AI Session Data
```sql
-- See if ANY sessions are being logged
SELECT COUNT(*) FROM ai_sessions;
SELECT COUNT(*) FROM ai_conversations;
```

### Step 3: Add Logging to ONE AI Endpoint (Test)
- Pick `/api/discovery-assistant` (most used)
- Add call to `/api/ai/logging` after response
- Test with real conversation
- Verify data appears in `ai_sessions`

### Step 4: Roll Out to All AI Endpoints
- Add logging to remaining 5 AI chat endpoints
- Test each one
- Monitor `ai_sessions` table growth

### Step 5: Build Admin Dashboard
- Create `/admin/ai-sessions` page
- Show session statistics
- Enable conversation viewing
- Add filters and search

---

## 📊 Expected Admin Dashboard Views

### 1. `/admin/ai-sessions` - AI Chat Analytics
- Session count by provider
- Messages per session average
- Active sessions graph
- Recent conversations list
- Search by user_hash or keywords

### 2. `/admin/demo-dashboard` - ✅ Already Exists
- Demo bookings
- Lead scoring
- Conversion tracking

### 3. `/admin/leads` - **NEEDS CREATION**
- Lead journey visualization
- Engagement scores
- Web activity timeline
- Lead grading (A-D)

### 4. `/admin/assessments` - ✅ Already Exists
- Security assessments list
- Assessment analytics

---

## 🔍 Next Steps for Implementation

1. **Verify Logging Endpoint Works**:
   ```bash
   curl -X POST http://localhost:3000/api/ai/logging \
     -H "Content-Type: application/json" \
     -d '{"action":"create_session","data":{"sessionId":"test123","userHash":"test","sessionName":"Test Session"}}'
   ```

2. **Check Supabase for Test Data**:
   ```sql
   SELECT * FROM ai_sessions WHERE session_id = 'test123';
   ```

3. **Add Logging to AI Endpoints** (see Priority 1)

4. **Build Admin Dashboards** (see Priority 2)

5. **Clean Up Redundant SQL Files** (see Priority 3)

---

## ✅ SUCCESS CRITERIA

- [ ] All AI chat sessions being logged to `ai_sessions`
- [ ] Admin dashboard shows real-time AI usage statistics
- [ ] Design-Rite employees can view user conversations
- [ ] Lead tracking captures AI interaction data
- [ ] Redundant SQL files removed/consolidated
- [ ] Documentation updated with canonical schemas
