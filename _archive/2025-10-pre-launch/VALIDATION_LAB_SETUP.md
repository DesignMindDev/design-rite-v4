# Validation Lab Setup Guide

**Project:** Design-Rite v4 Platform
**Team:** Dan Kozina, Phil Lisk, Nicholas Munn (munnymancom@gmail.com)
**Setup Date:** 2025-10-06

---

## 🏗️ Infrastructure Overview

### 3-Environment Strategy

```
develop branch  → Render Dev      → Supabase Dev      (Daily development)
   ↓ manual merge
staging branch  → Render Staging  → Supabase Staging  (VALIDATION LAB)
   ↓ manual merge
main branch     → Render Production → Supabase Production (Live users)
```

---

## 🌐 Environment URLs

### Development
- **URL**: https://design-rite-dev.onrender.com (to be created)
- **Branch**: develop
- **Supabase**: ickwrbdpuorzdpzqbqpf-dev (to be created)
- **Purpose**: Rapid experimentation, breaking changes OK

### Validation Lab (Staging)
- **URL**: https://design-rite-staging.onrender.com (to be created)
- **Branch**: staging
- **Supabase**: ickwrbdpuorzdpzqbqpf-staging (to be created)
- **Purpose**: Feature validation, production mirror, UAT

### Production
- **URL**: https://design-rite-v4.onrender.com (existing)
- **Branch**: main
- **Supabase**: ickwrbdpuorzdpzqbqpf (existing)
- **Purpose**: Live customer traffic

---

## 📋 Setup Checklist

### ✅ Phase 1: GitHub (COMPLETED)
- [x] Create develop branch
- [x] Create staging branch
- [x] Push branches to origin
- [x] Set develop as default working branch

### 🔄 Phase 2: Supabase Projects
- [ ] Log in to Supabase dashboard
- [ ] Create new project: "Design-Rite Staging"
- [ ] Note staging project credentials
- [ ] Run schema sync from production
- [ ] Set up daily database sync cron job
- [ ] Configure RLS policies
- [ ] Add team member access (Phil Lisk, Nicholas Munn)

### 🚀 Phase 3: Render Services
- [ ] Log in to Render dashboard
- [ ] Create new Web Service: "design-rite-staging"
  - Connect to GitHub repo: DesignMindDev/design-rite-v3
  - Branch: staging
  - Build command: `npm install && npm run build`
  - Start command: `npm run start`
  - Auto-deploy: OFF (manual trigger only)
- [ ] Configure environment variables (copy from production)
- [ ] Test staging deployment
- [ ] Add team member access

### 📝 Phase 4: Scripts & Automation
- [ ] Create database sync script (daily)
- [ ] Create promotion scripts (develop→staging, staging→main)
- [ ] Create validation checklist template
- [ ] Document access credentials
- [ ] Set up monitoring alerts

---

## 🔐 Team Access

### GitHub Repository Access
**Repo**: https://github.com/DesignMindDev/design-rite-v3

**Team Members:**
1. **Dan Kozina** (Owner) - Full access
2. **Phil Lisk** - Developer access
3. **Nicholas Munn** (munnymancom@gmail.com) - Developer access

**Branch Protection Rules:**
- `main`: Require manual approval before merge
- `staging`: Require validation checklist sign-off
- `develop`: No restrictions (fast iteration)

### Supabase Access
**Production Project**: ickwrbdpuorzdpzqbqpf
**Staging Project**: [To be created]

**Access Levels:**
- Dan Kozina: Owner
- Phil Lisk: Admin
- Nicholas Munn: Admin

### Render Access
**Production Service**: design-rite-v4
**Staging Service**: [To be created]

**Access Levels:**
- Dan Kozina: Owner
- Phil Lisk: Developer
- Nicholas Munn: Developer

---

## 🔄 Daily Validation Workflow

### Morning Sync (9 AM Daily)
1. Run database sync script: `./scripts/sync-staging-db.sh`
2. Verify staging database updated
3. Check for any schema conflicts
4. Review recent production changes

### Development Workflow
```bash
# Work on feature
git checkout develop
git pull origin develop
git checkout -b feature/my-awesome-feature

# Make changes, commit, push
git commit -m "Add awesome feature"
git push origin feature/my-awesome-feature

# Merge to develop (via PR or direct)
git checkout develop
git merge feature/my-awesome-feature
git push origin develop

# Test in dev environment
# (Auto-deploy if configured, or manual trigger)
```

### Promotion to Validation Lab
```bash
# When ready to validate
./scripts/promote.sh develop staging

# This will:
# 1. Merge develop → staging
# 2. Push to origin/staging
# 3. Prompt for manual Render deployment
```

### Validation Process
1. Test feature in staging environment
2. Fill out validation checklist
3. Get team sign-off (Dan/Phil/Nicholas)
4. If approved, promote to production

### Production Promotion
```bash
# After validation approval
./scripts/promote.sh staging production

# This will:
# 1. Merge staging → main
# 2. Push to origin/main
# 3. Prompt for manual Render deployment
# 4. Monitor production logs
```

---

## 📊 Database Sync Strategy

### Daily Sync Schedule
**Time**: 9:00 AM EST (before work starts)
**Frequency**: Daily during active v4 development
**Method**: Automated script with anonymization

### Sync Process
```bash
# Run daily sync
./scripts/sync-staging-db.sh

# What it does:
# 1. Export production schema + data
# 2. Anonymize sensitive data (emails, names, etc.)
# 3. Restore to staging database
# 4. Verify data integrity
# 5. Send notification to team
```

### Data Anonymization
- Replace real emails with test@example.com
- Replace customer names with "Test User 1", "Test User 2"
- Keep data structure intact for testing
- Preserve relationships (foreign keys)

---

## 🧪 Validation Checklist

Before promoting staging → production, complete this checklist:

### Functional Testing
- [ ] Feature works as designed
- [ ] No console errors
- [ ] Works in Chrome, Firefox, Safari
- [ ] Mobile responsive
- [ ] Error handling works

### Integration Testing
- [ ] Supabase queries work correctly
- [ ] API endpoints respond properly
- [ ] AI provider integration functional
- [ ] Stripe integration (if applicable)

### Performance Testing
- [ ] Page load < 3 seconds
- [ ] API response < 1 second
- [ ] No memory leaks
- [ ] Database queries optimized

### Security Testing
- [ ] RLS policies enforced
- [ ] Authentication required
- [ ] No sensitive data exposed
- [ ] CSRF protection active

### User Acceptance
- [ ] Meets business requirements
- [ ] UX is intuitive
- [ ] Copy/messaging correct
- [ ] Aligns with brand

**Validated by**: _______________
**Date**: _______________
**Approved for production**: ☐ Yes  ☐ No

---

## 🚨 Rollback Procedure

If production deployment fails:

```bash
# Immediate rollback
git checkout main
git revert HEAD
git push origin main

# Trigger Render deployment to previous version
# Or use Render's "Redeploy previous version" button

# Investigate issue in staging
git checkout staging
# Fix issue, test again, re-promote
```

---

## 📞 Support Contacts

**Technical Issues:**
- Dan Kozina (Owner)
- Phil Lisk (Team Lead)
- Nicholas Munn (munnymancom@gmail.com) (Developer)

**Render Support**: https://render.com/support
**Supabase Support**: https://supabase.com/support

---

## 📝 Change Log

### 2025-10-06
- ✅ Created GitHub branches (develop, staging)
- ✅ Documented validation lab setup process
- 🔄 Next: Create Supabase staging project

---

**Last Updated**: 2025-10-06
**Maintained By**: Dan Kozina, Phil Lisk, Nicholas Munn
