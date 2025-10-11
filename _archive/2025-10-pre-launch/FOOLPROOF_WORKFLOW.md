# 🔒 Foolproof Development Workflow
**Design-Rite v4 - Preventing Recurring Auth Issues**

**Created**: 2025-10-08
**Purpose**: Establish bulletproof methodology to prevent "wonky auth" from recurring after every push

---

## 🎯 THE PROBLEM WE'RE SOLVING

**Symptom**: Auth issues keep coming back after git pushes, requiring repeated fixes

**Root Cause**:
- Manual migration from v3.1 → v4 introduces inconsistencies
- Auth changes scattered across 15+ files
- No validation before merge
- Multiple sources of truth (v3.1 vs v4)

**Business Impact**: 1 day lost per incident, production instability, team frustration

---

## ✅ THE SOLUTION: Single Repo, Feature Branches

### **One Repository, Four Environments**

```
design-rite-v4/
├── feature/new-microservice     ← Your experimental work (replaces v3.1)
├── feature/auth-fix             ← Dedicated auth fix branch
├── develop                      ← Integration testing
├── staging                      ← Pre-production validation
└── main                         ← Production
```

**Benefits**:
- ✅ Git tracks ALL changes automatically
- ✅ Can't accidentally skip files
- ✅ Merge conflicts caught immediately
- ✅ Automated tests run before merge
- ✅ Single source of truth

---

## 📋 WORKFLOW STEPS

### **Step 1: Create Feature Branch for Experiments**

**When**: Starting new microservice, page, or major feature

```bash
cd C:/Users/dkozi/Projects/design-rite-v4
git checkout develop
git pull origin develop
git checkout -b feature/subscriber-portal  # Descriptive name
```

**Do your experimental work here** (replaces working in v3.1)

**Benefits**:
- Isolated from main codebase
- Easy to switch between features
- Can be deleted if experiment fails
- Git tracks every change

---

### **Step 2: Merge Feature → Develop (Integration Testing)**

**When**: Feature is working and ready for integration testing

```bash
# Step 2a: Update feature branch with latest develop
git checkout feature/subscriber-portal
git pull origin develop
# Fix any merge conflicts NOW (not in production!)

# Step 2b: Run automated checks
npm run lint          # Code quality check
npm run build         # Verify builds successfully
npm test              # Run all tests

# Step 2c: Merge to develop
git checkout develop
git merge feature/subscriber-portal
git push origin develop
```

**AI Agent Queue Check**:
```bash
# OpenAI agent checks queue for pending validations
node .ai_agents/copilot_watcher.js --once
```

**Benefits**:
- Conflicts detected early
- Tests run before integration
- Develop branch always deployable
- Feature branch preserved (can rollback)

---

### **Step 3: Deploy Develop → Staging (Validation Lab)**

**When**: Develop branch passes all tests and is ready for human validation

**Auto-Deploy** (if configured):
```bash
# Render.com auto-deploys develop branch to staging URL
# Staging URL: https://design-rite-staging.onrender.com
```

**Manual Deploy** (if needed):
```bash
git checkout staging
git merge develop
git push origin staging
```

**Validation Checklist** (run in staging environment):
```
Authentication Tests:
- [ ] User can log in at /login
- [ ] Session persists after page reload
- [ ] Protected routes redirect correctly
- [ ] Logout clears session
- [ ] No NextAuth cookies present
- [ ] No console errors

Feature Tests:
- [ ] New feature works as expected
- [ ] Doesn't break existing features
- [ ] Mobile responsive
- [ ] Performance acceptable (<2s load)

Cross-Service Tests (if applicable):
- [ ] Subscriber portal integration works
- [ ] API endpoints return correct data
- [ ] Supabase RLS policies enforced
```

**Benefits**:
- Test in production-like environment
- Catch environment-specific issues
- Human validation before production
- Safe to break staging (doesn't affect users)

---

### **Step 4: Promote Staging → Main (Production Deployment)**

**When**: Staging validation complete, ready for production

**Controlled Promotion**:
```bash
# Use the promotion script (includes safety checks)
./scripts/promote.sh staging main "Fix: Auth conflicts resolved permanently"
```

**What the script does**:
1. Verifies staging tests passed
2. Creates git tag for rollback
3. Merges staging → main
4. Pushes to GitHub
5. Triggers production deployment
6. Logs promotion in AI agent queue

**Benefits**:
- One-command promotion
- Automatic tagging for rollback
- Audit trail of what was deployed
- Can't accidentally skip steps

---

### **Step 5: Monitor & Rollback (if needed)**

**Monitor Production** (first 30 minutes):
```bash
# Check production logs
tail -f /var/log/design-rite/production.log

# Monitor error rate
curl https://design-rite.com/api/health
```

**Rollback if Needed** (rare, but prepared):
```bash
# Find last good commit
git log --oneline -10

# Rollback to last good tag
git checkout v4.2.1  # Last known good version
./scripts/promote.sh HEAD main "Emergency rollback to v4.2.1"
```

**Benefits**:
- Fast rollback (<5 minutes)
- Production never down long
- Clear audit trail

---

## 🔄 VISUAL WORKFLOW

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: EXPERIMENTAL WORK                                    │
│ feature/new-feature branch (replaces v3.1)                  │
│ - Test new microservices                                     │
│ - Validate new pages                                         │
│ - Experiment freely                                          │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    (git merge)
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: INTEGRATION TESTING                                  │
│ develop branch                                               │
│ - Run automated tests                                        │
│ - OpenAI/Copilot queue checks                               │
│ - Fix integration conflicts                                  │
└─────────────────────────────────────────────────────────────┘
                          ↓
                    (auto-deploy)
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: HUMAN VALIDATION                                     │
│ staging branch (https://design-rite-staging.onrender.com)   │
│ - Manual testing                                             │
│ - Auth validation checklist                                 │
│ - Performance checks                                         │
└─────────────────────────────────────────────────────────────┘
                          ↓
                  (promote script)
                          ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: PRODUCTION                                           │
│ main branch (https://design-rite.com)                       │
│ - Controlled promotion                                       │
│ - Automatic tagging                                          │
│ - Monitoring enabled                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## 🤖 AI AGENT QUEUE INTEGRATION

### **How Queue System Prevents Auth Issues**

**Problem**: Auth fixes scattered across 15+ files, easy to miss one

**Solution**: AI agents validate completeness before merge

#### **Queue Workflow**:

```json
// .ai_agents/command_queue.json
[
  {
    "id": "req_auth_validation_20251008",
    "agent": "OpenAI",
    "action": "validate-auth-completeness",
    "risk": "high",
    "status": "pending",
    "details": "Verify all 15 auth files updated before merge"
  }
]
```

**Copilot Watcher** checks queue every 3 seconds:
```bash
# Auto-runs safe validations
node .ai_agents/copilot_watcher.js

# Or run once before merge
node .ai_agents/copilot_watcher.js --once
```

**High-risk actions** (like auth changes) require human approval:
- OpenAI finds all auth files needing updates
- Creates checklist in queue
- Claude (you) reviews and approves
- Copilot executes approved changes
- All changes tracked in agent_log.json

---

## 🔒 PREVENTING RECURRING AUTH ISSUES

### **The Auth Fix Checklist** (enforced by AI agents)

When fixing auth issues, ALL these files must be updated:

```
Required File Updates (15 files):
☐ middleware.ts                          - Remove NextAuth, use Supabase
☐ lib/supabase.ts                        - Add server client
☐ lib/auth.ts                            - Remove entire file (NextAuth config)
☐ app/admin/layout.tsx                   - Update auth check
☐ app/admin/*/page.tsx (8 files)         - Update all admin pages
☐ app/api/*/route.ts (15+ files)         - Update all API routes
☐ .env.local                             - Remove NEXTAUTH_* vars
☐ package.json                           - Remove next-auth dependency

Validation Checks:
☐ No "next-auth" strings in codebase
☐ No "getServerSession" in codebase
☐ No NextAuth cookies in browser
☐ All protected routes use Supabase
☐ Tests pass with Supabase auth
```

**Automated Validation** (before merge):
```bash
# OpenAI agent runs this before merge approval
grep -r "next-auth" . --exclude-dir=node_modules
# If found → BLOCK MERGE
# If clean → APPROVE MERGE
```

---

## 📊 MIGRATION PATH: v3.1 → v4 Feature Branches

### **One-Time Migration**

**Current State**:
```
design-rite-v3.1/  ← Your experimental work
design-rite-v4/    ← Production codebase
```

**Target State**:
```
design-rite-v4/
├── feature/subscriber-portal  ← Migrate v3.1 subscriber work here
├── feature/spatial-studio     ← Migrate v3.1 spatial work here
└── develop                    ← Clean integration branch
```

**Migration Commands**:
```bash
# Step 1: Create feature branch in v4
cd C:/Users/dkozi/Projects/design-rite-v4
git checkout develop
git checkout -b feature/v3-experiments

# Step 2: Copy files from v3.1 (selective, not blind copy)
# Use queue system to track which files to migrate

# Step 3: Test in feature branch
npm run build
npm test

# Step 4: Merge to develop (go through workflow)
git checkout develop
git merge feature/v3-experiments

# Step 5: Archive v3.1
mv C:/Users/dkozi/Projects/Design-Rite/v3/design-rite-v3.1 \
   C:/Users/dkozi/Projects/Design-Rite/ARCHIVE/v3.1-archived-20251008
```

---

## 🎯 QUICK REFERENCE COMMANDS

### **Daily Development** (replaces v3.1 workflow)

```bash
# Start new experimental feature
git checkout develop
git pull origin develop
git checkout -b feature/new-thing
# ... do your work ...
npm run build && npm test
git add .
git commit -m "Add new thing"
git push origin feature/new-thing

# Merge to develop when ready
git checkout develop
git merge feature/new-thing
git push origin develop
```

### **Weekly Staging Validation**

```bash
# Deploy to staging (manual)
git checkout staging
git merge develop
git push origin staging

# Or use auto-deploy (Render watches develop branch)

# Validate staging
# Run through validation checklist
# If good → promote to main
./scripts/promote.sh staging main "Weekly release: Auth fixes + new features"
```

### **Emergency Production Fix**

```bash
# Hotfix from main
git checkout main
git checkout -b hotfix/auth-critical
# ... fix issue ...
git checkout main
git merge hotfix/auth-critical
git push origin main
# Then backport to develop
git checkout develop
git merge main
git push origin develop
```

---

## ✅ SUCCESS CRITERIA

**You know the workflow is working when**:

1. ✅ **No more manual file copying** from v3.1 to v4
2. ✅ **Git catches all merge conflicts** before they hit production
3. ✅ **Auth issues don't recur** because AI agents validate completeness
4. ✅ **Staging catches issues** before production
5. ✅ **Rollback is fast** (<5 minutes) if needed
6. ✅ **Clear audit trail** of what was deployed when
7. ✅ **Team confidence** in deployment process

---

## 🚀 NEXT STEPS (To Implement This)

### **Immediate Actions** (Today):

1. **Move auth audit to v4 staging**
   - Copy prompts from v3.1 to v4
   - Run OpenAI audit in v4 staging branch
   - Fix all auth issues in staging
   - Test thoroughly

2. **Set up queue system in v4**
   - Port copilot_watcher.js from v4 main to v4 staging
   - Configure whitelist for safe actions
   - Test queue with sample auth validation

3. **Create first feature branch**
   - Identify one experiment from v3.1
   - Create feature branch in v4
   - Migrate that experiment
   - Test merge workflow

### **This Week**:

4. **Migrate all v3.1 experiments**
   - Create feature branches for each
   - Test each migration
   - Archive v3.1 when complete

5. **Document deployment checklist**
   - Create validation checklist for staging
   - Train team on new workflow
   - Update CI/CD if applicable

### **Ongoing**:

6. **Use workflow for all changes**
   - Feature branch → develop → staging → main
   - No exceptions (prevents shortcuts that cause issues)
   - AI agents validate before merge

---

## 📞 SUPPORT & QUESTIONS

**When in doubt**:
1. Check this document first
2. Run validation: `npm run build && npm test`
3. Ask Claude (me) for clarification
4. Use queue system for risky changes

**Common Questions**:

**Q**: "Can I still test experimental features?"
**A**: Yes! Create feature branches instead of using v3.1

**Q**: "What if I need to test quickly?"
**A**: Feature branches are just as fast, with better safety

**Q**: "What if staging catches an issue?"
**A**: Fix in staging, test again, then promote. Production stays safe.

**Q**: "Can I skip staging for tiny changes?"
**A**: No. Auth issues started from "tiny changes" that skipped validation.

---

**Last Updated**: 2025-10-08
**Status**: ✅ ACTIVE WORKFLOW - Use for all changes
**Replaces**: Manual v3.1 → v4 migration process
