# ⚡ Admin Dashboard - Quick Reference Card
**Print this page for your desk reference**

---

## 🔐 Quick Access URLs

```
Main Admin:        http://localhost:3000/admin
Login:             http://localhost:3000/admin/login
Super Admin:       http://localhost:3000/admin/super
AI Providers:      http://localhost:3000/admin/ai-providers
Demo Dashboard:    http://localhost:3000/admin/demo-dashboard
Operations:        http://localhost:3000/admin/operations
```

---

## 🎯 Navigation Map

```
ADMIN DASHBOARD
│
├── 📊 OPERATIONS DASHBOARD → Real-time platform metrics
│   └── /admin/operations
│
├── 📈 ANALYTICS → Spatial Studio & platform analytics
│   └── In-page tab
│
├── 🤖 AI TOOLS
│   ├── 🧠 AI Providers → /admin/ai-providers
│   ├── ✨ AI Assistant Config → /admin/ai-assistant
│   └── 💬 Chatbot Config → /admin/chatbot
│
├── 🗄️ DATA TOOLS
│   └── 🔍 Product Harvester → /admin/harvester
│
├── ✍️ CONTENT TOOLS
│   ├── 👥 Team Management → In-page tab
│   ├── 🎨 Creative Studio → /admin/creative-studio
│   ├── 🏗️ Spatial Studio → /admin/spatial-studio-dev
│   ├── 🖼️ Logo Management → In-page tab
│   ├── 🎥 Video Management → In-page tab
│   └── 📝 Blog Posts → In-page tab
│
├── 💼 BUSINESS TOOLS
│   ├── 💳 Subscriptions → /admin/subscriptions
│   ├── 📅 Demo Dashboard → /admin/demo-dashboard
│   └── 🧪 Testing Dashboard → /admin/testing
│
├── ℹ️ ABOUT US
│   └── Company info management
│
└── 👑 SUPER ADMIN (Super Admin only)
    ├── User Management → /admin/super
    ├── Activity Logs → /admin/super/activity
    ├── Permissions → /admin/super/permissions
    └── Create User → /admin/super/create-user
```

---

## 🎨 Color-Coded Dropdowns

| Color | Section | Purpose |
|-------|---------|---------|
| 🟠 Orange | Operations Dashboard | Platform health & metrics |
| 🔵 Blue | Analytics | Data analysis & reporting |
| 🟣 Purple | AI Tools | AI provider management |
| 🟦 Cyan | Data Tools | Product harvesting |
| 🟢 Green | Content Tools | Marketing & content |
| 🟡 Yellow | Business Tools | Subscriptions & demos |
| 🟣 Indigo | About Us | Company information |

---

## 👥 User Roles

```
┌─────────────────────────────────────────────────┐
│  SUPER ADMIN                                    │
│  • Full platform control                       │
│  • User management                              │
│  • All features unlocked                        │
│  Access Code: DR-SA-DK-2025                     │
└─────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────┐
│  ADMIN                                          │
│  • Content management                           │
│  • Analytics access                             │
│  • Limited user management                      │
│  Access Code: DR-AD-[initials]-2025             │
└─────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────┐
│  MANAGER                                        │
│  • Unlimited quotes/assessments                 │
│  • No admin panel access                        │
│  Access Code: DR-MG-[initials]-2025             │
└─────────────────────────────────────────────────┘
        ↓
┌─────────────────────────────────────────────────┐
│  USER                                           │
│  • 10 quotes/day, 50/month                      │
│  • 5 AI assessments/day                         │
│  Access Code: DR-US-[company]-[number]          │
└─────────────────────────────────────────────────┘
```

---

## ⚡ Common Tasks (Quick Commands)

### **Add New Admin User:**
```
1. /admin/super → Create User
2. Email + Password
3. Role: Admin
4. Code: DR-AD-XX-2025
5. Assign permissions
6. Save
```

### **Configure AI Failover:**
```
1. /admin/ai-providers
2. Priority 1: Claude ✅
3. Priority 2: OpenAI ✅
4. Priority 3: Gemini ✅
5. Test all providers
```

### **Review High-Value Leads:**
```
1. /admin/demo-dashboard
2. Look for yellow borders
3. Score ≥ 70 = High Value
4. Prioritize these demos
```

### **Publish Blog Post:**
```
1. /admin → Blog Posts tab
2. + New Blog Post
3. Write content
4. Upload image
5. Toggle "Published" ON
6. Save
```

### **Fix Failed Spatial Upload:**
```
1. /admin/spatial-studio-dev
2. Find failed project
3. View Logs
4. Retry Analysis
5. Export when complete
```

---

## 🚨 Emergency Contacts

```
┌─────────────────────────────────────────┐
│  EMERGENCY PROCEDURES                   │
├─────────────────────────────────────────┤
│  Platform Down:                         │
│    → Check /admin/operations            │
│    → View error logs                    │
│    → Contact DevOps                     │
│                                         │
│  AI Provider Failing:                   │
│    → /admin/ai-providers                │
│    → Health tab                         │
│    → Verify failover working            │
│                                         │
│  Database Issue:                        │
│    → Check Supabase dashboard           │
│    → Review connection pool             │
│    → Contact DBA                        │
│                                         │
│  Security Breach:                       │
│    → /admin/super/activity              │
│    → Review suspicious activity         │
│    → Disable compromised accounts       │
│    → Alert security team                │
└─────────────────────────────────────────┘
```

---

## 📊 AI Provider Quick Config

### **Provider Settings:**
```json
{
  "Claude (Primary)": {
    "priority": 1,
    "model": "claude-3-5-sonnet-20241022",
    "max_tokens": 1500,
    "timeout": 25,
    "api_key": "configured_from_env"
  },
  "OpenAI (Backup)": {
    "priority": 2,
    "model": "gpt-4o",
    "max_tokens": 1500,
    "timeout": 30,
    "api_key": "configured_from_env"
  },
  "Gemini (Tertiary)": {
    "priority": 3,
    "model": "gemini-pro",
    "max_tokens": 1500,
    "timeout": 30,
    "api_key": "configured_from_env"
  }
}
```

### **Failover Test:**
```bash
# Test Discovery Assistant
curl http://localhost:3000/api/discovery-assistant

# Should show:
{
  "ai_engine": {
    "providers_available": 3,
    "enabled_providers": [
      {"name": "Claude (Primary)", "priority": 1},
      {"name": "Open Ai", "priority": 2},
      {"name": "Google Gemini", "priority": 3}
    ]
  }
}
```

---

## 🔑 Environment Variables Checklist

```bash
# Required for Production:
✅ NEXT_PUBLIC_SUPABASE_URL
✅ SUPABASE_SERVICE_KEY
✅ ANTHROPIC_API_KEY
✅ OPENAI_API_KEY
✅ NEXT_PUBLIC_APP_URL
✅ NEXT_PUBLIC_HARVESTER_API_URL

# Optional but Recommended:
⚠️ GOOGLE_API_KEY (Gemini failover)
⚠️ SENTRY_DSN (Error tracking)
⚠️ STRIPE_SECRET_KEY (Subscriptions)
```

**Verify All:** `npm run verify-env`

---

## 📈 Demo Lead Scoring Cheat Sheet

```
BASE SCORE: 50 points

KEYWORDS:
+ "slow"              → +15
+ "time consuming"    → +20
+ "compliance"        → +25
+ "losing bids"       → +25

VOLUME:
+ 5-9 proposals/mo    → +10
+ 10-19 proposals/mo  → +20
+ 20+ proposals/mo    → +25

URGENCY:
+ "ASAP"              → +20
+ "this week"         → +25
+ "next week"         → +20
+ "this month"        → +15

RESULT:
Score ≥ 70 = HIGH VALUE LEAD 🔥
```

---

## 🛠️ Troubleshooting Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Can't login | Clear cookies, try incognito |
| AI not responding | Check `/admin/ai-providers` Health tab |
| Upload fails | Check file size < 10MB, type PNG/JPG |
| Demo not showing | Verify Calendly webhook configured |
| Permission denied | Contact super admin for role update |
| Slow performance | Check Operations Dashboard for issues |

---

## 📞 Support URLs

```
Platform Docs:     http://localhost:3000/docs
API Reference:     http://localhost:3000/api-docs
Admin Guide:       ADMIN_WALKTHROUGH_GUIDE.md
Launch Checklist:  PRE_LAUNCH_30MIN_CHECKLIST.md
AI Engines Report: AI_ESTIMATE_ENGINES_REPORT.md
```

---

## 🎯 Daily Admin Checklist

```
Morning (5 min):
[ ] Check Operations Dashboard
[ ] Review demo leads for today
[ ] Check AI provider health

Midday (10 min):
[ ] Review new demo bookings
[ ] Check for failed Spatial uploads
[ ] Monitor user activity

Evening (5 min):
[ ] Final demo lead review
[ ] Check for system alerts
[ ] Plan tomorrow's high-value demos
```

---

## 📱 Mobile Quick Actions

**Tablet-Friendly:**
- ✅ View demo dashboard
- ✅ Check analytics
- ✅ Monitor operations
- ✅ Review blog posts

**Desktop Recommended:**
- ⚠️ AI provider configuration
- ⚠️ User permission management
- ⚠️ Bulk operations
- ⚠️ Complex content editing

---

**Print this page and keep it handy!**

---

**Last Updated:** October 5, 2025
**Version:** 1.0
**Created for:** Design-Rite Admin Team
