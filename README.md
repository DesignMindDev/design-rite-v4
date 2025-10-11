# Design-Rite™ AI Security Platform v4
**Status:** 🚀 **LAUNCH READY** (October 17, 2025)

> **⚠️ PROPRIETARY SOFTWARE - CONFIDENTIAL**
>
> This repository contains proprietary business logic and trade secrets.
> All code is Copyright (c) 2025 Design-Rite, LLC.
> Unauthorized access, copying, or distribution is strictly prohibited.
> **Patent Pending** - AI-powered spatial analysis and equipment mapping systems.
>
> See [LICENSE.md](LICENSE.md) for complete terms.

---

## 🌟 **What is Design-Rite?**

The **complete AI-powered platform** for security integrators to create professional proposals in minutes instead of hours.

**Main Platform:** https://design-rite.com
**Subscriber Portal:** https://portal.design-rite.com
**GitHub:** https://github.com/DesignMindDev/design-rite-v4

---

## 🎯 **Core Features**

### ✅ **AI Discovery Assistant**
- 7-step methodology (WHO, WHAT, WHEN, WHERE, WHY, HOW, COMPLIANCE)
- Multi-AI failover (Claude → OpenAI → Gemini)
- Streaming chat interface with confidence scoring
- Professional PDF proposal generation
- System Surveyor Excel import integration

### ✅ **Quick Security Estimate**
- 5-minute ballpark pricing form
- Real-time Supabase product pricing
- Data handoff to AI Assessment
- Perfect for lead qualification

### ✅ **Quote Generation**
- Server-side protected API
- Line item pricing with confidence scores
- BOM generation with labor estimates
- Implementation timeline recommendations

### ✅ **System Surveyor Integration**
- Excel import (no API required)
- 96-item equipment mapping (Patriot Auto validated)
- Intelligent camera type detection
- Automatic labor hour calculations

### ✅ **Stripe Subscriptions**
- 3-tier pricing (Starter $49, Professional $199, Enterprise $499)
- 30-day free trials
- Automatic billing management
- Subscriber portal access

### ✅ **Admin Dashboard**
- AI provider health monitoring
- User management & permissions
- Activity logging & analytics
- Demo booking management (Calendly integration)
- Team access codes

---

## 🏗️ **Platform Architecture**

### **Main Components:**
```
┌─────────────────────────────────────────────────┐
│         DESIGN-RITE ECOSYSTEM                   │
└─────────────────────────────────────────────────┘

1. MAIN PLATFORM (design-rite-v4)
   ├── 93 API endpoints
   ├── Next.js 14 + App Router
   ├── Supabase (auth + database)
   ├── Stripe subscriptions
   └── Multi-AI failover

2. SUBSCRIBER PORTAL (design-rite-subscriber-portal)
   ├── Cross-domain authentication
   ├── AI Assistant chat
   ├── Document management
   ├── Business tools
   └── 8 complete features

3. INSIGHT STUDIO (lowvolt-spec-harvester) [Optional]
   ├── MCP Server (web scraping)
   ├── Video transcription (Whisper AI)
   ├── Intelligence gathering
   └── $50K+/year savings vs SaaS

4. SPATIAL STUDIO (Phase 1.0 complete)
   ├── Floor plan upload + AI analysis
   ├── 3D visualization (Three.js)
   ├── Async processing
   └── 22/22 tests passing

5. AI CREATIVE STUDIO (vision only)
   └── Future enhancement (Q1 2026)
```

---

## ⚡ **Quick Start**

### **Local Development:**
```bash
# Clone repository
git clone https://github.com/DesignMindDev/design-rite-v4.git
cd design-rite-v4

# Install dependencies
npm install

# Environment setup
cp .env.example .env

# Required environment variables:
ANTHROPIC_API_KEY=your_claude_api_key
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# Stripe (for subscriptions)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Start development server
npm run dev
# Server running on http://localhost:3000
```

### **Production Deployment:**
```bash
# Build for production
npm run build

# Run production server
npm run start

# Or deploy to Render.com
# (Auto-deploys on git push to main)
```

---

## 🚀 **Launch Timeline**

### **CURRENT STATUS: 95% READY**

**Launch Date:** Thursday, October 17, 2025

**Completed:** ✅
- Main platform (93 API endpoints)
- Subscriber portal (8 features)
- Multi-AI failover
- Stripe integration (test mode)
- System Surveyor import
- Cross-domain authentication
- Rate limiting (3 endpoints)
- Admin dashboard
- Calendly demo booking

**Remaining:** 📋
- Stripe production testing (2 hours)
- Rate limiting expansion (2 hours)
- Production smoke tests (2 hours)

**See:** [7_DAY_LAUNCH_ROADMAP.md](7_DAY_LAUNCH_ROADMAP.md) for detailed plan

---

## 📊 **Subscription Tiers**

### **Starter - $49/month**
- 10 AI assessments/month
- Basic quote generation
- System Surveyor import (5/month)
- Email support

### **Professional - $199/month**
- Unlimited AI assessments
- Advanced quote generation
- Unlimited System Surveyor imports
- Spatial Studio access (Phase 1)
- Priority support

### **Enterprise - $499/month**
- Everything in Professional
- Insight Studio access (web scraping)
- Video intelligence (transcription)
- White-labeled deliverables
- Dedicated account manager
- API access

---

## 🔐 **Security & Compliance**

### **Authentication**
- 100% Supabase Auth (no Next-Auth)
- 5-tier role hierarchy (Super Admin → Admin → Manager → User → Guest)
- Row-level security on all database tables
- Session management with automatic refresh
- Activity logging for all actions

### **API Security**
- Rate limiting (LRU cache-based)
- Server-side only proprietary logic
- API key authentication
- CORS protection
- Input validation (Pydantic)

### **Data Protection**
- Environment variable encryption
- No long-term customer data storage
- Automatic session cleanup
- Audit trails for compliance
- HTTPS/TLS for all communications

### **Production Checklist**
- [x] HTTPS/SSL certificates active
- [x] Environment variables in Render
- [x] API keys secure (not in code)
- [x] Database RLS policies enabled
- [x] Error logging configured
- [x] CORS policies set
- [ ] Rate limiting on all expensive endpoints (in progress)
- [x] Security headers (CSP, HSTS)

---

## 🛠️ **Technical Stack**

### **Frontend**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Radix UI components
- Three.js (Spatial Studio)
- React Hook Form

### **Backend**
- Next.js API Routes
- Supabase (PostgreSQL)
- Stripe (payments)
- OpenAI API
- Anthropic Claude API
- Google Gemini API

### **Infrastructure**
- Hosting: Render.com
- Database: Supabase (PostgreSQL)
- Auth: Supabase Auth
- Storage: Supabase Storage
- CDN: Cloudflare (via Render)
- Monitoring: Render Metrics + Sentry (optional)

### **Development**
- Git + GitHub
- Claude Code (AI pair programming)
- Jest (testing)
- ESLint + Prettier
- TypeScript strict mode

---

## 📚 **Documentation**

### **Quick Links**
- **[Launch Roadmap](7_DAY_LAUNCH_ROADMAP.md)** - Day-by-day launch plan
- **[Launch Readiness](LAUNCH_READINESS_COMPLETE.md)** - Complete assessment
- **[CLAUDE.md](CLAUDE.md)** - Project context and implementation history
- **[Spatial Studio Roadmap](SPATIAL_STUDIO_ROADMAP.md)** - Product vision
- **[Changelog](CHANGELOG.md)** - Version history

### **Setup Guides**
- **[Stripe Setup](STRIPE_SETUP_NOW.md)** - Subscription configuration
- **[Calendly Setup](CALENDLY_SETUP.md)** - Demo booking integration
- **[Pre-Launch Checklist](PRE_LAUNCH_30MIN_CHECKLIST.md)** - Final tasks

### **Admin Guides**
- **[Admin Quick Reference](ADMIN_QUICK_REFERENCE.md)** - Common tasks
- **[Admin Walkthrough](ADMIN_WALKTHROUGH_GUIDE.md)** - Complete guide
- **[Business Auth](BUSINESS_AUTH_ADMIN_GUIDE.md)** - Role management

---

## 🤝 **Team Access**

**Access Codes (DR-XX-2025 format):**
- Dan Kozich: DR-DK-2025 (Super Admin)
- Philip Lisk: DR-PL-2025 (Admin)
- Munnyman Communications: DR-MC-2025 (Admin)

**Admin Panel:** https://design-rite.com/admin

---

## 📈 **Performance Metrics**

### **Platform Performance:**
- Quote Generation: 20+ hours → 45 minutes
- Average Confidence Score: 68% (target: 75%+)
- Uptime: 99.9% (multi-AI failover)
- Page Load: <2s average
- API Response: <500ms average

### **System Surveyor Integration:**
- Equipment Mapping Accuracy: 92%
- Processing Speed: <2s for 96 items
- Data Transformation: 100% success rate

### **Success Metrics (Week 1 Goals):**
- [ ] 5 demo bookings
- [ ] 3 trial signups
- [ ] 1 paying customer
- [ ] 100 website visitors
- [ ] Zero critical bugs

---

## 🐛 **Troubleshooting**

### **Common Issues:**

**AI Provider Failover Not Working:**
```bash
# Check AI provider health at /admin/ai-providers
# Verify API keys in .env.local
# Test connection for each provider in admin panel
```

**Stripe Checkout Failing:**
```bash
# Verify environment variables
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET

# Check Stripe dashboard → Events for errors
```

**Supabase Connection Issues:**
```bash
# Verify credentials in .env.local
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_KEY

# Check Supabase dashboard → Settings → API
```

**Rate Limiting Blocking Requests:**
```bash
# Check X-RateLimit-Remaining header in Network tab
# Wait for X-RateLimit-Reset time
# Use different IP for testing
```

---

## 🚨 **Emergency Procedures**

### **If Production Goes Down:**
1. Check Render logs: Dashboard → Logs tab
2. Check Supabase status: status.supabase.com
3. Check AI provider status:
   - status.anthropic.com
   - status.openai.com
4. Rollback if needed:
   - Render → Deployments → Previous deploy → "Rollback"

### **If Security Breach Suspected:**
1. Immediately rotate all API keys
2. Check activity logs for unauthorized access
3. Review Supabase Auth logs
4. Disable compromised user accounts
5. Update security measures

---

## 📞 **Support & Contact**

**Production URLs:**
- **Main Platform:** https://design-rite.com
- **Subscriber Portal:** https://portal.design-rite.com
- **Admin Dashboard:** https://design-rite.com/admin

**Repository:**
- **GitHub:** https://github.com/DesignMindDev/design-rite-v4
- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions

**Support Email:** support@design-rite.com
**Security Email:** security@design-rite.com

---

## 📄 **License**

**Proprietary License** - Copyright (c) 2025 Design-Rite, LLC.

This software is proprietary and confidential. Unauthorized use, copying, distribution, or modification is strictly prohibited and may result in severe civil and criminal penalties.

**Patent Pending:** AI-powered spatial analysis and equipment mapping systems.

See [LICENSE.md](LICENSE.md) for complete terms.

---

## 🎉 **Built With**

- **Next.js 14** - React framework
- **Supabase** - Backend as a service
- **Stripe** - Payment processing
- **Anthropic Claude** - AI assistance
- **OpenAI GPT-4** - AI fallback
- **Three.js** - 3D visualization
- **Render.com** - Hosting
- **Claude Code** - AI pair programming

---

**Design-Rite™ v4** - AI-Powered Security Intelligence Platform
🤖 Built by sales engineers, for sales engineers
🚀 Launching October 17, 2025

**Last Updated:** October 10, 2025
**Status:** Launch Ready (95%)
