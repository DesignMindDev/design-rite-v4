# Leads & Web Activity Tracking System

## Overview
Complete lead tracking system with web activity journey mapping, lead scoring, and conversion analytics.

---

## 🗄️ Database Schema

### **Tables Created:**
1. **`leads`** - Core lead information and scoring
2. **`web_activity_events`** - Detailed web activity for journey mapping
3. **`lead_notes`** - Manual and system notes for each lead

### **Key Features:**
- ✅ Automatic lead scoring (0-100 points)
- ✅ Lead grading (A/B/C/D)
- ✅ Journey tracking from first visit to conversion
- ✅ Tool usage tracking (Quick Estimate, AI Assessment, System Surveyor)
- ✅ Demo booking integration
- ✅ Trial and customer conversion tracking
- ✅ UTM parameter capture
- ✅ Referrer and landing page tracking

---

## 📊 Lead Scoring System

### **Automatic Scoring Formula:**

**Base Engagement:**
- 2 points per page view
- 5 points per session
- 20 points per quote generated

**Tool Usage:**
- Quick Estimate: +10 points
- AI Assessment: +25 points
- System Surveyor: +30 points

**Conversion Milestones:**
- Demo Booked: +30 points
- Demo Completed: +40 points
- Trial Started: +50 points

**Lead Grades:**
- **A Grade:** 90-100 points (Hot leads)
- **B Grade:** 70-89 points (Warm leads)
- **C Grade:** 50-69 points (Engaged leads)
- **D Grade:** 0-49 points (Cold leads)

---

## 🎯 Lead Status Workflow

```
new → contacted → qualified → demo_scheduled → demo_completed → trial → customer
                                                                     ↓
                                                                  lost
```

**Status Definitions:**
- **new**: First time visitor, no contact yet
- **contacted**: Sales team reached out
- **qualified**: Meets ICP criteria, good fit
- **demo_scheduled**: Has booked a demo
- **demo_completed**: Attended demo
- **trial**: Started free trial
- **customer**: Paying customer
- **lost**: Did not convert / not interested

---

## 🌐 Web Activity Event Types

### **Navigation Events:**
- `page_view` - Page visited
- `session_start` - New session started
- `session_end` - Session ended

### **Engagement Events:**
- `tool_usage` - Used Quick Estimate, AI Assessment, etc.
- `quote_generated` - Generated a security quote
- `form_submit` - Submitted a form
- `file_download` - Downloaded file
- `video_watch` - Watched demo video

### **Conversion Events:**
- `demo_booked` - Booked a demo via Calendly
- `trial_started` - Started free trial
- `account_created` - Created account
- `purchase_completed` - Became paying customer

---

## 🚀 API Endpoints

### **GET /api/leads-tracking**
Fetch all leads with filtering

**Query Parameters:**
- `status` - Filter by lead_status
- `grade` - Filter by lead_grade (A/B/C/D)
- `min_score` - Minimum lead score
- `email` - Get specific lead with journey
- `limit` - Max results (default: 100)

**Response:**
```json
{
  "success": true,
  "leads": [...],
  "stats": {
    "total": 150,
    "by_status": { "new": 50, "contacted": 30, ... },
    "by_grade": { "A": 20, "B": 45, "C": 60, "D": 25 },
    "average_score": 62,
    "trial_started": 15,
    "customers": 8,
    "new_this_week": 12,
    "new_this_month": 45
  }
}
```

### **GET /api/leads-tracking?email=user@example.com**
Get lead journey with all web activity

**Response:**
```json
{
  "success": true,
  "lead": {
    "email": "user@example.com",
    "name": "John Doe",
    "company": "Security Co",
    "lead_score": 85,
    "lead_grade": "B",
    "page_views": 15,
    "quotes_generated": 3,
    ...
  },
  "activities": [
    {
      "event_type": "page_view",
      "page_url": "/security-estimate",
      "created_at": "2025-10-01T10:30:00Z"
    },
    {
      "event_type": "tool_usage",
      "tool_name": "ai_assessment",
      "tool_data": { "facility_type": "Office" },
      "created_at": "2025-10-01T10:35:00Z"
    },
    ...
  ],
  "notes": [...]
}
```

### **POST /api/leads-tracking**
Create/update leads and track events

**Actions:**
1. **create_lead** - Create new lead
2. **update_lead** - Update lead information
3. **track_event** - Track web activity event
4. **add_note** - Add note to lead

**Example - Track Event:**
```json
{
  "action": "track_event",
  "event_data": {
    "email": "user@example.com",
    "session_id": "abc123",
    "event_type": "tool_usage",
    "event_category": "engagement",
    "event_action": "completed_assessment",
    "tool_name": "ai_assessment",
    "tool_data": { "facility_type": "Office", "cameras": 15 },
    "page_url": "/ai-assessment",
    "page_title": "AI Security Assessment"
  }
}
```

**Example - Create Lead:**
```json
{
  "action": "create_lead",
  "lead_data": {
    "email": "newlead@example.com",
    "name": "Jane Smith",
    "company": "ABC Security",
    "lead_source": "linkedin",
    "utm_campaign": "spring_2025",
    "landing_page": "/estimate-options"
  }
}
```

**Example - Add Note:**
```json
{
  "action": "add_note",
  "lead_data": {
    "email": "user@example.com",
    "note": "Follow up next week about trial",
    "note_type": "manual",
    "created_by": "sales@design-rite.com"
  }
}
```

---

## 📱 Planned Dashboard UI Features

### **Overview Tab:**
- Total leads count
- New leads this week/month
- Lead distribution by grade (A/B/C/D)
- Lead distribution by status
- Average lead score
- Conversion funnel visualization

### **Leads List:**
- Sortable table with all leads
- Filter by status, grade, score
- Search by email, company, name
- Click row to see detailed journey

### **Lead Detail View:**
- Complete lead information
- Lead score breakdown
- Activity timeline (visual journey map)
- All web events chronologically
- Demo booking info (if applicable)
- Notes section
- Quick actions: Update status, add note, send email

### **Journey Visualization:**
Timeline view showing:
- 🌐 First visit (with landing page & referrer)
- 📄 Pages viewed
- 🔧 Tools used
- 💼 Quotes generated
- 📅 Demo booked
- 🚀 Trial started
- 💰 Converted to customer

### **Analytics Tab:**
- Lead source breakdown
- Conversion rates by source
- Average time to conversion
- Most visited pages
- Most used tools
- Drop-off points in funnel

---

## 🔗 Integration Points

### **Existing Systems to Connect:**

1. **Email Gate Component** - Capture lead on first gated action
2. **Quick Estimate Tool** - Track usage + tool_data
3. **AI Assessment Tool** - Track usage + assessment results
4. **System Surveyor Import** - Track premium feature usage
5. **Calendly Demo Bookings** - Link to `demo_bookings` table
6. **Quote Generator** - Track quote generation events
7. **Platform Access Form** - Capture lead info on signup

### **Tracking Code to Add:**

**Example - Track Page View:**
```typescript
// Add to layout or page components
useEffect(() => {
  trackEvent({
    event_type: 'page_view',
    page_url: window.location.pathname,
    page_title: document.title
  })
}, [])
```

**Example - Track Tool Usage:**
```typescript
// After tool completion
await fetch('/api/leads-tracking', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    action: 'track_event',
    event_data: {
      email: userEmail,
      event_type: 'tool_usage',
      tool_name: 'quick_estimate',
      tool_data: { result: estimateData }
    }
  })
})
```

---

## 🎯 Business Use Cases

### **Sales Team:**
- See hot leads (Grade A) to prioritize outreach
- View lead journey to personalize pitch
- Add notes after calls/demos
- Track follow-up tasks

### **Marketing Team:**
- Analyze which sources generate best leads
- See which content drives conversions
- Identify drop-off points
- Optimize funnel based on data

### **Product Team:**
- See which tools are most used
- Understand user journey through platform
- Identify friction points
- Measure feature adoption

---

## 📋 Next Steps to Complete Implementation

### **Phase 1: Database Setup** ✅ (Complete)
- [x] Create leads table
- [x] Create web_activity_events table
- [x] Create lead_notes table
- [x] Add indexes and RLS policies
- [x] Create scoring functions

### **Phase 2: API Layer** ✅ (Complete)
- [x] Create /api/leads-tracking endpoint
- [x] Implement GET (list leads + stats)
- [x] Implement GET with email (journey view)
- [x] Implement POST (create/update/track/note)

### **Phase 3: Dashboard UI** ⏳ (In Progress)
- [ ] Create /admin/leads-dashboard page
- [ ] Overview stats cards
- [ ] Leads list with filters
- [ ] Lead detail modal with journey
- [ ] Activity timeline visualization
- [ ] Notes section
- [ ] Quick action buttons

### **Phase 4: Integration** ⏳ (Pending)
- [ ] Add tracking to Email Gate
- [ ] Add tracking to Quick Estimate
- [ ] Add tracking to AI Assessment
- [ ] Add tracking to System Surveyor
- [ ] Add tracking to Quote Generator
- [ ] Link Calendly demos to leads

### **Phase 5: Analytics** ⏳ (Pending)
- [ ] Lead source analysis
- [ ] Conversion funnel
- [ ] Drop-off analysis
- [ ] Tool usage stats
- [ ] Revenue attribution

---

## 🚀 Quick Start

### **1. Run SQL in Supabase:**
```bash
supabase/leads_tracking_tables.sql
```

### **2. Test API:**
```bash
# Create a test lead
curl -X POST http://localhost:3009/api/leads-tracking \
  -H "Content-Type: application/json" \
  -d '{
    "action": "create_lead",
    "lead_data": {
      "email": "test@example.com",
      "name": "Test User",
      "lead_source": "direct"
    }
  }'

# Track an event
curl -X POST http://localhost:3009/api/leads-tracking \
  -H "Content-Type: application/json" \
  -d '{
    "action": "track_event",
    "event_data": {
      "email": "test@example.com",
      "event_type": "page_view",
      "page_url": "/estimate-options"
    }
  }'

# Get lead journey
curl http://localhost:3009/api/leads-tracking?email=test@example.com
```

### **3. Access Dashboard** (when complete):
Go to: `/admin/leads-dashboard`

---

## 💡 Future Enhancements

- **Email Integration:** Send automated follow-up emails
- **Slack Notifications:** Alert on hot leads (Grade A)
- **Lead Enrichment:** Auto-enrich company data (Clearbit/ZoomInfo)
- **Predictive Scoring:** ML model for conversion probability
- **A/B Testing:** Track experiment variants
- **Revenue Attribution:** Link MRR to lead source

---

**Ready to complete the dashboard UI implementation?** This system provides the foundation for comprehensive lead tracking and journey analytics!
