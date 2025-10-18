# Design-Rite V4 Deployment Policy

**Last Updated:** October 18, 2025
**Status:** Pre-Production Development Phase

---

## 🎯 Current Development Status

**V4 is NOT yet production-ready.** We are currently in active development and testing phase.

### Production Environment
- **URL:** https://design-rite.com (design-rite-v3-zk5r.onrender.com)
- **Branch:** `main`
- **Auto-Deploy:** ✅ Enabled
- **Service ID:** `srv-d35mk4bipnbc739je85g`
- **Render Plan:** Standard

### Staging Environment
- **URL:** https://cak-end.onrender.com
- **Branch:** `staging`
- **Auto-Deploy:** ❌ Disabled (Manual only)
- **Service ID:** `srv-d3hvbnjuibrs73b8hvs0`
- **Render Plan:** Starter

---

## 🚧 Phase 1: Pre-Production Development (CURRENT PHASE)

**Goal:** Build, test, and stabilize V4 features before going live.

### Workflow

#### 1. Development on Main Branch
- All development work happens on `main` branch
- Commits automatically deploy to production environment
- This allows rapid iteration and testing

#### 2. Staging Validation (Manual)
When you want to test changes in staging:

```bash
# 1. Sync staging with main
git checkout staging
git merge main -m "Sync staging with main - [describe changes]"
git push origin staging

# 2. Manually trigger deployment via Render API
curl -X POST \
  -H "Authorization: Bearer rnd_6o7BYWraBuvow4iZbDpJov4y7gJQ" \
  -H "Content-Type: application/json" \
  -d '{"clearCache":"clear"}' \
  "https://api.render.com/v1/services/srv-d3hvbnjuibrs73b8hvs0/deploys"

# 3. Check deployment status
curl -H "Authorization: Bearer rnd_6o7BYWraBuvow4iZbDpJov4y7gJQ" \
  "https://api.render.com/v1/services/srv-d3hvbnjuibrs73b8hvs0/deploys?limit=1"
```

#### 3. Testing
- **Production:** Test at https://design-rite.com
- **Staging:** Test at https://cak-end.onrender.com
- Both environments should have identical code during validation

### Why Manual Staging?
- Prevents accidental staging deployments during development
- Allows controlled testing when needed
- Saves build minutes on Render
- Staging is only deployed when explicitly needed for validation

---

## 🎓 Phase 2: Production-Ready Workflow (FUTURE)

**When:** Once V4 is deemed stable and ready for public production use.

### Branch Strategy

```
feature-branch → staging → main (protected)
     ↓              ↓         ↓
  Development    Testing   Production
```

### Workflow

#### Step 1: Feature Development
```bash
# Create feature branch from staging
git checkout staging
git pull origin staging
git checkout -b feature/your-feature-name

# Make changes, commit, push
git add .
git commit -m "Add feature: your feature description"
git push origin feature/your-feature-name
```

#### Step 2: Merge to Staging
```bash
# Merge feature to staging
git checkout staging
git merge feature/your-feature-name
git push origin staging

# Manually deploy to staging
curl -X POST \
  -H "Authorization: Bearer rnd_6o7BYWraBuvow4iZbDpJov4y7gJQ" \
  -H "Content-Type: application/json" \
  -d '{"clearCache":"clear"}' \
  "https://api.render.com/v1/services/srv-d3hvbnjuibrs73b8hvs0/deploys"
```

#### Step 3: Staging Validation
**⚠️ CRITICAL: Test thoroughly on staging before promoting to main**

Test checklist:
- [ ] All pages load without errors
- [ ] Authentication flows work correctly
- [ ] API endpoints respond as expected
- [ ] Database operations complete successfully
- [ ] No console errors in browser
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing complete
- [ ] Performance is acceptable

#### Step 4: Production Deployment
```bash
# ONLY after staging validation passes
git checkout main
git merge staging -m "Release: [version] - [brief description]"
git push origin main

# Production deploys automatically
# Monitor at https://dashboard.render.com/web/srv-d35mk4bipnbc739je85g
```

### Branch Protection Rules (To Be Enabled)

When moving to Phase 2, enable these GitHub protections on `main`:

1. **Require pull request reviews**
   - At least 1 approval required
   - Dismiss stale reviews on new commits

2. **Require status checks**
   - Build must pass
   - Linting must pass
   - Tests must pass (when test suite exists)

3. **Require branches to be up to date**
   - Must merge latest main before pushing

4. **Do not allow bypassing**
   - Even admins must follow the process

---

## 🛠️ Render API Commands

### Check Deployment Status
```bash
# Production
curl -H "Authorization: Bearer rnd_6o7BYWraBuvow4iZbDpJov4y7gJQ" \
  "https://api.render.com/v1/services/srv-d35mk4bipnbc739je85g/deploys?limit=5"

# Staging
curl -H "Authorization: Bearer rnd_6o7BYWraBuvow4iZbDpJov4y7gJQ" \
  "https://api.render.com/v1/services/srv-d3hvbnjuibrs73b8hvs0/deploys?limit=5"
```

### Trigger Manual Deploy
```bash
# Staging (manual deploys only)
curl -X POST \
  -H "Authorization: Bearer rnd_6o7BYWraBuvow4iZbDpJov4y7gJQ" \
  -H "Content-Type: application/json" \
  -d '{"clearCache":"clear"}' \
  "https://api.render.com/v1/services/srv-d3hvbnjuibrs73b8hvs0/deploys"
```

### List All Services
```bash
curl -H "Authorization: Bearer rnd_6o7BYWraBuvow4iZbDpJov4y7gJQ" \
  "https://api.render.com/v1/services"
```

---

## 🚨 Emergency Rollback Procedure

If a bad deployment reaches production:

### Option 1: Revert via Git
```bash
# Find the last good commit
git log --oneline -10

# Revert to last good commit
git revert <bad-commit-hash>
git push origin main

# Wait for automatic deployment
```

### Option 2: Redeploy Previous Version via Render Dashboard
1. Go to https://dashboard.render.com/web/srv-d35mk4bipnbc739je85g
2. Click "Deploys" tab
3. Find last successful deploy
4. Click "Redeploy" button

### Option 3: Manual Rollback via API
```bash
# Get previous deploy ID
curl -H "Authorization: Bearer rnd_6o7BYWraBuvow4iZbDpJov4y7gJQ" \
  "https://api.render.com/v1/services/srv-d35mk4bipnbc739je85g/deploys?limit=10"

# Redeploy specific commit (replace DEPLOY_ID)
curl -X POST \
  -H "Authorization: Bearer rnd_6o7BYWraBuvow4iZbDpJov4y7gJQ" \
  "https://api.render.com/v1/services/srv-d35mk4bipnbc739je85g/deploys/DEPLOY_ID/redeploy"
```

---

## 📝 Commit Message Guidelines

### Format
```
<type>: <brief description>

<detailed explanation if needed>

<breaking changes if any>
```

### Types
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Formatting, missing semicolons, etc.
- `refactor:` Code restructuring without behavior change
- `test:` Adding or updating tests
- `chore:` Maintenance tasks, dependency updates

### Examples
```bash
# Good
git commit -m "fix: Resolve merge conflict in check-email page - Suspense import"

# Good
git commit -m "feat: Add Stripe trial implementation with 7-day free trial"

# Good
git commit -m "docs: Update deployment policy for Phase 2 workflow"

# Bad
git commit -m "fixes"
git commit -m "stuff"
git commit -m "wip"
```

---

## 🔐 Security Notes

### Environment Variables
- **Never commit** `.env` files
- **Never commit** API keys or secrets
- Store secrets in Render dashboard: https://dashboard.render.com/web/srv-d35mk4bipnbc739je85g/env

### API Keys
- **Render API Key:** Stored securely, rotated every 90 days
- **Current Key:** `rnd_6o7BYWraBuvow4iZbDpJov4y7gJQ` (set Oct 18, 2025)
- **Next Rotation:** January 18, 2026

---

## 📊 Monitoring & Health Checks

### Production Monitoring
- **Health Check:** https://design-rite.com/api/health
- **Status Page:** https://dashboard.render.com/web/srv-d35mk4bipnbc739je85g
- **Uptime:** Monitor via Render dashboard

### Staging Monitoring
- **Health Check:** https://cak-end.onrender.com/api/health (if configured)
- **Status Page:** https://dashboard.render.com/web/srv-d3hvbnjuibrs73b8hvs0

---

## 🎯 Transition Checklist: Phase 1 → Phase 2

**Before transitioning to production-ready workflow:**

- [ ] All critical features implemented and tested
- [ ] No known critical bugs
- [ ] Performance benchmarks met
- [ ] Security audit completed
- [ ] Database migrations tested
- [ ] Error tracking configured (Sentry, etc.)
- [ ] Analytics configured
- [ ] Customer support system ready
- [ ] Documentation complete
- [ ] Team trained on Phase 2 workflow
- [ ] GitHub branch protection rules enabled
- [ ] Staging auto-deploy remains disabled
- [ ] Production backup strategy in place
- [ ] Rollback procedure tested

**When checklist is complete:**
1. Announce transition to team
2. Update this document status to "Phase 2: Production-Ready"
3. Enable branch protections on `main`
4. Communicate new workflow to all developers

---

## 📚 Related Documentation

- **Main Platform CLAUDE.md:** `design-rite-v4/CLAUDE.md`
- **Portal CLAUDE.md:** `design-rite-portal-v2/CLAUDE.md`
- **Ecosystem Overview:** `Design-Rite Corp/CLAUDE.md`
- **API Routing Audit:** `design-rite-v4/API_ROUTING_AUDIT_COMPREHENSIVE.md`

---

## 💡 Tips for Claude Code Sessions

**When starting a new Claude Code session:**

1. Read this `DEPLOYMENT_POLICY.md` file first
2. Check current phase (Phase 1 or Phase 2)
3. Follow the appropriate workflow
4. Never push directly to `main` in Phase 2 without staging validation
5. Always test locally before committing
6. Use descriptive commit messages
7. Sync staging manually via API when needed

**Common Commands:**
```bash
# Check what phase we're in
head -n 10 DEPLOYMENT_POLICY.md

# See recent deployments
git log --oneline -5

# Check if staging needs sync
git log main..staging
```

---

**Remember: The goal is to keep production stable while allowing rapid development. When in doubt, test in staging first!**

---

**Document Maintained By:** Design-Rite Development Team
**Questions?** Check `CLAUDE.md` or consult recent deployment logs
