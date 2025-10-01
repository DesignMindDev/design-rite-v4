# Design-Rite™ AI Security Platform - Project Context

> **Quick Start for AI Collaboration**: This document provides comprehensive context for AI assistants (Claude, ChatGPT, etc.) to understand the Design-Rite platform architecture, business model, and technical implementation.

---

## 🎯 **Executive Summary**

**Design-Rite** is a B2B SaaS platform that transforms security system design from a 20+ hour manual process into a 45-minute AI-powered workflow. We serve security integrators, consultants, and sales engineers who need to generate professional proposals for physical security systems (cameras, access control, VMS, analytics).

**Market Position**: We're not competing with design software—we're eliminating the pre-design bottleneck. Our AI Discovery Assistant qualifies leads, gathers requirements, and generates 68% confident quotes in minutes, allowing sales engineers to focus on high-value activities.

**Revenue Model**:
- Free tier for basic estimates
- Pro tier ($149/month) for unlimited AI assessments
- Enterprise tier (custom) for System Surveyor integration
- Partnership revenue: 15% recurring commission with System Surveyor

---

## 🏗️ **Technical Architecture**

### **Platform Stack**
```
Frontend:  Next.js 14 (App Router), React, TypeScript
Backend:   Next.js API Routes (Server-Side)
Database:  Supabase (PostgreSQL) - 3,000+ security products
AI:        Multi-provider failover (Claude → OpenAI → Gemini)
Hosting:   Render.com
Domain:    https://www.design-rite.com
```

### **Core Components**

#### **1. AI Discovery Assistant** (`/ai-assessment`)
- **Purpose**: 7-step methodology (WHO, WHAT, WHEN, WHERE, WHY, HOW, COMPLIANCE)
- **Technology**: Streaming chat interface with OpenAI Assistants API
- **Input**: Conversational requirements gathering
- **Output**: Comprehensive assessment data → Quote generation
- **Key Feature**: Standard assumptions system (60-70% faster discovery)

#### **2. Quick Security Estimate** (`/security-estimate`)
- **Purpose**: 5-minute basic estimate for low-touch leads
- **Technology**: Form-based with real-time pricing from Supabase
- **Input**: Basic facility details (type, size, cameras, doors)
- **Output**: Ballpark pricing + option to upgrade to AI Assessment
- **Key Feature**: Data handoff to AI Assistant for refinement

#### **3. Quote Generator** (`lib/quote-generator.ts`)
- **Status**: 🔒 PROPRIETARY - Server-side only
- **Purpose**: Generate professional quotes with line items, pricing, confidence scores
- **Input**: Assessment data from AI or Quick Estimate
- **Output**: PDF-ready proposal with BOM, timelines, compliance notes
- **Key Feature**: Confidence scoring (65-90%) with refinement recommendations

#### **4. Scenario Library** (`lib/scenario-library.ts`)
- **Status**: 🔒 PROPRIETARY - Server-side only
- **Purpose**: Pre-built security scenarios to accelerate discovery
- **Industries**: Office, Retail, Education, Healthcare, Industrial, Hospitality
- **Deployment Tiers**: Entry, Professional, Enterprise, Cloud-First
- **Key Feature**: 8 comprehensive scenarios with VMS/analytics options

#### **5. System Surveyor Integration** (`/integrations/system-surveyor/`)
- **Purpose**: Import field survey data from System Surveyor Excel exports
- **Technology**: Server-side Excel parsing + equipment mapping algorithms
- **Input**: .xlsx file with site/equipment data (96+ items)
- **Output**: AI-ready assessment data + product recommendations
- **Status**: Built, awaiting API access for full integration demo

#### **6. VMS/Analytics Database** (`lib/vms-analytics-database.ts`)
- **Status**: 🔒 PROPRIETARY
- **Purpose**: Enterprise VMS and analytics platform database
- **Platforms**: 14 VMS options (Genetec, Milestone, Verkada, etc.)
- **Analytics**: 5 specialized options (weapons detection, face recognition, behavior analysis)
- **Key Feature**: Real pricing data from actual enterprise deployments

---

## 🔐 **Intellectual Property Protection**

### **Trade Secrets Protected**
1. **Quote Generation Algorithms** - Pricing formulas, confidence scoring, refinement logic
2. **Scenario Library** - Industry-specific assumptions, deployment tier pricing
3. **Equipment Mapping** - System Surveyor data transformation algorithms
4. **VMS/Analytics Database** - Curated enterprise platform catalog with real pricing

### **Security Measures Implemented**
- ✅ Copyright headers on 18 proprietary files (October 01, 2025)
- ✅ Proprietary LICENSE.md with trade secret declarations
- ✅ Server-side-only business logic (no client exposure)
- ✅ Rate limiting (10-30 req/min per IP)
- ✅ Timestamped git commits for ownership proof
- 🔜 Patent Pending status for integration algorithms

### **Rate Limiting Policies**
```typescript
/api/generate-quote          → 10 requests/minute  (expensive computation)
/api/scenarios               → 30 requests/minute  (read-only)
/api/system-surveyor/upload  → 5 requests/5 min    (file parsing)
```

---

## 💼 **Business Model & Go-To-Market**

### **Target Customers**
1. **Security Integrators** (Primary)
   - Pain Point: Spend 20+ hours on proposals that don't close
   - Solution: 45-minute AI-powered proposals with 68%+ confidence
   - Value Prop: Get your weekends back, close more deals

2. **Sales Engineers** (Secondary)
   - Pain Point: Tuesday morning chaos—endless revisions, impossible deadlines
   - Solution: Professional proposals in minutes, not days
   - Value Prop: Focus on high-value activities, not spreadsheets

3. **Security Consultants** (Tertiary)
   - Pain Point: Manual BOM creation, outdated pricing data
   - Solution: Real-time pricing from distributors (CDW, ADI, ScanSource)
   - Value Prop: Professional credibility with live data

### **Pricing Tiers**
```
Free Tier:
- Quick Security Estimate (unlimited)
- 1 AI Assessment per month
- Basic PDF export

Pro Tier ($149/month):
- Unlimited AI Assessments
- Advanced quote customization
- Priority support
- System Surveyor import (coming soon)

Enterprise Tier (Custom):
- Multi-user access
- Custom branding
- API access
- Dedicated account manager
```

### **Strategic Partnerships**

#### **System Surveyor Partnership** (In Progress)
- **Relationship**: Featured customer success story on their website
- **Integration Status**: Technical implementation complete, awaiting API access
- **Value Proposition**:
  - For System Surveyor: Makes platform stickier, creates vendor lock-in
  - For Design-Rite: Access to established customer base, field data accuracy
  - For Customers: Complete workflow from field survey to proposal (20 hours → 45 minutes)
- **Revenue Model**: 15% recurring commission both ways
- **Contact**: Maureen Carlson & Chris Hugman (founders)
- **Demo Hook**: "I've built the technical integration—just need API access to demo"

---

## 🛠️ **Development Workflow**

### **Local Development**
```bash
# Start dev server
npm run dev  # Runs on http://localhost:3009 (auto-increments if 3000-3008 in use)

# Environment variables (.env.local)
ANTHROPIC_API_KEY=sk-ant-...
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### **Key Files to Know**

#### **Frontend Pages**
```
/app/page.tsx                       → Homepage (storm concept messaging)
/app/estimate-options/page.tsx      → Choice page (Quick vs. AI)
/app/security-estimate/page.tsx     → 5-minute quick estimate
/app/ai-assessment/page.tsx         → 15-20 minute AI discovery
/app/ai-discovery/page.tsx          → Alternative AI flow (scenarios first)
/app/integrations/system-surveyor/  → System Surveyor import workflow
```

#### **Backend APIs**
```
/app/api/generate-quote/route.ts    → 🔒 Proprietary quote generation
/app/api/scenarios/route.ts         → 🔒 Scenario library API
/app/api/system-surveyor/           → 🔒 Excel import + mapping
/app/api/ai-assessment/route.ts     → AI streaming chat endpoint
```

#### **Core Libraries**
```
/lib/quote-generator.ts             → 🔒 PROPRIETARY - Quote algorithms
/lib/scenario-library.ts            → 🔒 PROPRIETARY - Security scenarios
/lib/vms-analytics-database.ts      → 🔒 PROPRIETARY - VMS/analytics catalog
/lib/system-surveyor-mapper.ts      → 🔒 PROPRIETARY - Equipment mapping
/lib/rate-limiter.ts                → 🔒 PROPRIETARY - API protection
/lib/ai-engine.ts                   → Multi-AI provider failover
```

#### **Configuration**
```
/data/ai-providers.json             → AI provider config (health, priority)
/LICENSE.md                         → Proprietary license terms
/CLAUDE.md                          → Project history & implementation notes
```

### **Git Workflow**
```bash
# Current branch: main
# Recent commits:
c2171f2 - IP Protection Task 1.5: Rate Limiting Implementation
5aacc51 - IP Protection Task 1.2: Server-Side APIs
e4eed55 - IP Protection Task 1.1: Copyright Headers
8b8f146 - Update UnifiedNavigation.tsx
8bd6d8b - Fix demo AI assistants configuration

# Always include detailed commit messages
# Include "🤖 Generated with Claude Code" footer
```

---

## 🎨 **Design Philosophy & User Experience**

### **Messaging Strategy: "Storm Concept"**
- **Problem**: Tuesday morning chaos that every sales engineer recognizes
- **Visual Pain Points**: Coffee ☕, urgent changes 📞, impossible deadlines 📝
- **Solution**: Professional proposals in minutes ✨
- **Emotional Hook**: "Get your weekends back"
- **Tagline**: "Calming the chaos for Sales Engineers everywhere"

### **User Journey**
1. **Landing Page** → Emotional hook (storm concept) + value prop
2. **Try Platform Button** → Email gate → Choice page
3. **Choice Page** → Quick Estimate (5 min) OR AI Discovery (15-20 min)
4. **Quick Estimate** → Basic form → Ballpark quote → Option to upgrade to AI
5. **AI Discovery** → Conversational chat → Comprehensive assessment → Professional quote
6. **System Surveyor Import** (Enterprise) → Excel upload → AI refinement → Quote

### **Key UX Principles**
- **Speed First**: Every friction point costs conversions
- **Professional Appearance**: Security integrators judge credibility instantly
- **Data Handoff**: Seamless flow between quick estimate and AI assessment
- **Confidence Transparency**: Show 68% confidence, explain how to get to 90%+
- **Mobile-First**: Sales engineers work from trucks, job sites, coffee shops

---

## 📊 **Success Metrics & KPIs**

### **Platform Metrics**
- **Quote Generation Time**: 20+ hours → 45 minutes (target: <30 min)
- **Confidence Score**: 68% average (target: 75%+)
- **Conversion Rate**: Basic → AI Assessment (target: 30%)
- **Quote Close Rate**: Industry avg 20% → Design-Rite users 30%+ (target: 40%)

### **System Surveyor Integration Metrics**
- **Equipment Mapping Accuracy**: 92% (96 items processed in <2s)
- **Data Transformation Speed**: <2 seconds for typical survey
- **AI Context Generation**: 100% success rate

### **AI Provider Performance**
- **Primary (Claude)**: 95% uptime, <2s response time
- **Failover Success Rate**: 99.9% (Claude → OpenAI seamless)
- **Health Monitoring**: Real-time status tracking (last 100 checks)

---

## 🚀 **Roadmap & Future Features**

### **Phase 1: Foundation** (✅ Complete - Q4 2024)
- ✅ AI Discovery Assistant with 7-step methodology
- ✅ Quick Security Estimate with real pricing
- ✅ Quote Generator with confidence scoring
- ✅ Scenario Library (8 industries)
- ✅ Multi-AI provider failover
- ✅ IP protection implementation

### **Phase 2: Integration** (🔄 In Progress - Q1 2025)
- ✅ System Surveyor Excel import (technical implementation complete)
- 🔜 System Surveyor API integration (awaiting access)
- 🔜 Demo partnership pitch to Maureen/Chris
- 🔜 Partnership agreement finalization

### **Phase 3: Enterprise** (🔜 Q2 2025)
- 🔜 Multi-user team access
- 🔜 Custom branding for integrators
- 🔜 API access for programmatic quote generation
- 🔜 Advanced analytics dashboard

### **Phase 4: Scale** (🔜 Q3 2025)
- 🔜 Integration with distributor pricing APIs (CDW, ADI, ScanSource)
- 🔜 Mobile app for field assessments
- 🔜 CRM integrations (Salesforce, HubSpot)
- 🔜 White-label solution for VMS vendors

---

## 🤝 **Collaboration Guidelines for AI Assistants**

### **When Working on Design-Rite Code:**

#### **✅ DO:**
- Read this file first to understand context
- Ask clarifying questions about business goals before implementation
- Consider IP protection when adding new features (server-side by default)
- Include detailed commit messages with business context
- Test rate limiting and API protection when modifying endpoints
- Update CLAUDE.md with significant implementation details
- Think about the sales engineer persona (speed, professional appearance, mobile-first)

#### **❌ DON'T:**
- Expose proprietary business logic client-side
- Skip rate limiting on new API endpoints
- Create new files without copyright headers
- Modify quote generation or scenario logic without understanding business impact
- Change pricing algorithms without explicit approval
- Break existing AI provider failover logic

### **Key Questions to Ask:**
1. **Business Context**: "What problem does this feature solve for sales engineers?"
2. **IP Protection**: "Should this logic be server-side only?"
3. **User Experience**: "How does this fit the 'calming the chaos' narrative?"
4. **Integration Impact**: "Does this affect System Surveyor or VMS partnerships?"
5. **Scalability**: "Will this work for enterprise multi-user scenarios?"

### **Common Tasks & How to Approach Them:**

#### **Adding a New Feature**
1. Understand the user story (sales engineer pain point)
2. Design server-side APIs first (IP protection)
3. Add rate limiting to new endpoints
4. Include copyright headers on new files
5. Test with multi-AI provider failover in mind
6. Update CLAUDE.md with implementation notes

#### **Modifying Proprietary Logic**
1. **STOP** and confirm with Dan before changing:
   - Quote generation algorithms
   - Scenario library assumptions
   - Pricing calculations
   - Equipment mapping logic
2. If approved, maintain server-side-only architecture
3. Update copyright "Last Modified" date
4. Add detailed commit message explaining business rationale

#### **Debugging User Issues**
1. Check AI provider health first (`/admin/ai-providers`)
2. Review rate limit headers in Network tab
3. Verify server-side API responses (not client-side logic)
4. Test with typical sales engineer workflow (mobile, fast internet)
5. Consider System Surveyor import flow if enterprise user

---

## 📞 **Key Contacts & Resources**

### **Design-Rite Team**
- **Dan Kozich** (Owner/Developer): Access code DR-DK-2025
- **Philip Lisk**: Access code DR-PL-2025
- **Munnyman Communications**: Access code DR-MC-2025

### **Strategic Partners**
- **System Surveyor**: Maureen Carlson & Chris Hugman (founders)
  - Relationship: Featured customer success story
  - Integration Status: Technical complete, awaiting API access

### **Production Access**
- **Platform**: https://www.design-rite.com
- **AI Assessment**: https://www.design-rite.com/ai-assessment
- **Admin Panel**: https://www.design-rite.com/admin/ai-providers
- **System Surveyor Upload**: https://www.design-rite.com/integrations/system-surveyor/upload

### **Documentation**
- **CLAUDE.md**: Detailed implementation history and technical notes
- **LICENSE.md**: Proprietary license and trade secret protections
- **README.md**: Setup instructions and security checklist
- **ip_protection_plan.md**: Comprehensive IP hardening roadmap (Tasks 1.1-2.3)

---

## 🎯 **Success Criteria for AI Collaboration**

When working with AI assistants on Design-Rite, consider the session successful if:

1. **Business Understanding** ✅
   - AI understands the sales engineer persona
   - Solutions align with "calming the chaos" value proposition
   - Features support the 20 hours → 45 minutes transformation

2. **Technical Excellence** ✅
   - IP protection maintained (server-side proprietary logic)
   - Rate limiting applied to new APIs
   - Multi-AI failover preserved
   - No security regressions

3. **User Experience** ✅
   - Fast (mobile-first, <2s response times)
   - Professional (enterprise credibility)
   - Seamless (data handoff between flows)
   - Transparent (confidence scores, refinement guidance)

4. **Documentation** ✅
   - Commit messages explain business context
   - CLAUDE.md updated with implementation notes
   - Copyright headers on new files
   - This file updated if architecture changes

---

## 🤖 **AI Assistant Quick Reference**

### **File Reading Priority**
```
High Priority (Always Read First):
1. PROJECT_CONTEXT.md (this file)
2. CLAUDE.md (implementation history)
3. LICENSE.md (IP boundaries)

Medium Priority (Read for Specific Tasks):
4. README.md (setup, security checklist)
5. /lib/quote-generator.ts (if touching pricing)
6. /lib/scenario-library.ts (if touching scenarios)
7. /lib/ai-engine.ts (if touching AI providers)

Low Priority (Read as Needed):
8. Specific page files based on task
9. API route files for debugging
```

### **Common Commands**
```bash
npm run dev               # Start local development
npm run build             # Production build
npm run lint              # Check code quality
git status                # Check uncommitted changes
git log --oneline -10     # Recent commit history
curl http://localhost:3009/api/scenarios  # Test API
```

### **Emergency Rollback**
```bash
git log --oneline -5      # Find last good commit
git revert <commit-hash>  # Revert specific commit
git push origin main      # Push rollback
```

---

## 📝 **Version History**

- **v1.0** (October 01, 2025) - Initial project context document
  - Comprehensive architecture overview
  - IP protection implementation summary
  - System Surveyor integration documentation
  - AI collaboration guidelines

---

**Design-Rite™ v3.1** - Multi-AI Security Intelligence Platform
🤖 Powered by Claude Code with comprehensive IP protection
🔒 Proprietary & Confidential - Copyright (c) 2025 Design-Rite Professional
