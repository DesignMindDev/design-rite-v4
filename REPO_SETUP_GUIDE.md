# Repository Setup Guide - FIXED 2025-10-08

## ✅ CORRECT Repository to Use

**Primary Working Directory:**
```
C:\Users\dkozi\Projects\design-rite-v4
```

**Git Remote:**
```
https://github.com/DesignMindDev/design-rite-v4.git
```

**Available Branches:**
- `main` - Production (deployed)
- `staging` - Staging environment (https://cak-end.onrender.com)
- `develop` - Development work

---

## ❌ OLD/Confusing Repository (DO NOT USE)

**Path:**
```
C:\Users\dkozi\Projects\Design-Rite\v3\design-rite-v3.1\design-rite-v3
```

**Problem:**
- Path says "v3" but actually points to the v4 repo
- Creates confusion when committing and pushing
- Has outdated commits on develop branch

**Solution:**
- ✅ IGNORE this directory
- ✅ Use `C:\Users\dkozi\Projects\design-rite-v4` instead
- Optional: Delete or rename to `design-rite-v4-OLD-DO-NOT-USE`

---

## Current Status (2025-10-08)

### Staging Branch (DEPLOYED ✅)
- **Latest Commit:** 62ae1a1 "Fix auth: Add CASCADE to all foreign keys, enable user deletion"
- **Status:** LIVE on Render at https://cak-end.onrender.com
- **Working:** User deletion, auth flow, signup/login tested ✅

### Develop Branch
- Has 2 additional commits (4c91633, b8b75ee) from older auth fix attempts
- May need to be synced with staging later

---

## How to Work Going Forward

### 1. Set Claude Code Working Directory
In Claude Code settings, set:
```
Working Directory: C:\Users\dkozi\Projects\design-rite-v4
```

### 2. Always Verify You're in the Right Repo
Before committing:
```bash
pwd
# Should show: /c/Users/dkozi/Projects/design-rite-v4

git remote -v
# Should show: https://github.com/DesignMindDev/design-rite-v4.git
```

### 3. Branch Workflow
- Create feature branches from `develop`
- Merge to `staging` for testing
- Merge to `main` for production

---

## Render Deployments

### Production (main branch)
- Service: design-rite-v4
- URL: https://design-rite-v3-zk5r.onrender.com
- Branch: main

### Staging (staging branch) ✅
- Service: design-rite-staging
- URL: https://cak-end.onrender.com
- Branch: staging
- Auto-deploy: ✅ Enabled

---

## Emergency: If You End Up in Wrong Repo

**Quick check:**
```bash
pwd
```

**If it shows the v3 path:**
```bash
cd C:/Users/dkozi/Projects/design-rite-v4
```

**Verify you're in the right place:**
```bash
git remote -v
# Should show design-rite-v4.git
```

---

**Last Updated:** 2025-10-08
**Fixed By:** Claude Code + Dan
**Auth Status:** ✅ Working (user deletion via SQL, signup/login tested)
