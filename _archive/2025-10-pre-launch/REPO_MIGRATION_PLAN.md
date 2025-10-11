# Repository Migration Plan - V3 ↔ V4 Separation

## The Problem
You renamed the original v3 repo to "design-rite-v4" on GitHub, which created confusion. Now we need to:
1. Rename the GitHub repo BACK to v3
2. Create a FRESH v4 repo
3. Push your current working code (with auth fixes) to the new v4 repo

---

## ✅ What's Ready

I've prepared everything you need:

### Files Created:
- ✅ `CREATE_NEW_V4_REPO_STEPS.md` - Step-by-step guide
- ✅ `switch-to-new-repo.bat` - Automated script for Windows
- ✅ `switch-to-new-repo.sh` - Automated script for Mac/Linux

### What Will Be Migrated:
Your local `C:\Users\dkozi\Projects\design-rite-v4` has these branches ready:

```
staging  → 38581bf (Repo docs) → 62ae1a1 (AUTH FIX ✅) → 950eb22 (NextAuth removed)
develop  → 4c91633 (Diagnostics) → b8b75ee (User roles fix)
main     → Production code
```

All of this will be pushed to the new fresh v4 repo!

---

## 📋 Step-by-Step Instructions

### STEP 1: Rename Old Repo to V3 (GitHub Web)

1. Open: https://github.com/DesignMindDev/design-rite-v4/settings
2. Scroll to "Repository name" section
3. Change from: `design-rite-v4`
4. Change to: `design-rite-v3` (or `design-rite-v3-legacy`)
5. Type the new name to confirm
6. Click **"Rename"** button

**✅ Result:** Old repo is now at https://github.com/DesignMindDev/design-rite-v3

---

### STEP 2: Create New V4 Repo (GitHub Web)

1. Open: https://github.com/new
2. Fill in:
   - **Owner:** DesignMindDev
   - **Repository name:** `design-rite-v4` (now available!)
   - **Description:** Design-Rite v4 - Security Estimation Platform
   - **Visibility:** ✅ Private
   - **Initialize:** ❌ Leave ALL checkboxes UNCHECKED (empty repo)
3. Click **"Create repository"**

**✅ Result:** New empty repo at https://github.com/DesignMindDev/design-rite-v4

---

### STEP 3: Run Migration Script (Local)

**Option A - Windows (Recommended):**
```cmd
cd C:\Users\dkozi\Projects\design-rite-v4
switch-to-new-repo.bat
```

**Option B - Git Bash:**
```bash
cd C:/Users/dkozi/Projects/design-rite-v4
bash switch-to-new-repo.sh
```

**What the script does:**
1. Shows your current remote (backup)
2. Asks for confirmation that you created the new repo
3. Updates `origin` remote to new repo URL
4. Pushes all 3 branches (staging, develop, main)
5. Shows success message

**✅ Result:** All your code is now in the fresh v4 repo!

---

### STEP 4: Update Render Deployments

**Staging Service:**
1. Open: https://dashboard.render.com/web/srv-d3hvbnjuibrs73b8hvs0
2. Go to "Settings" tab
3. Under "Repository", click "Connect"
4. Select: `DesignMindDev/design-rite-v4` (the NEW repo)
5. Branch: `staging`
6. Click "Save"

**Production Service:**
1. Open: https://dashboard.render.com/web/srv-d35mk4bipnbc739je85g
2. Go to "Settings" tab
3. Under "Repository", click "Connect"
4. Select: `DesignMindDev/design-rite-v4` (the NEW repo)
5. Branch: `main`
6. Click "Save"

**✅ Result:** Render deployments now use the new v4 repo!

---

## 🎯 Final State

**GitHub Repos:**
- ✅ design-rite-v3 → Old/legacy code (originally v3, was temporarily named v4)
- ✅ design-rite-v4 → NEW repo with your current working code

**Local Repos:**
- ✅ `C:\Users\dkozi\Projects\design-rite-v4` → Points to NEW v4 repo
- 🗑️ `C:\Users\dkozi\Projects\Design-Rite\v3\...` → Can be deleted (old clone)

**Deployments:**
- ✅ Staging (https://cak-end.onrender.com) → design-rite-v4/staging
- ✅ Production (https://design-rite-v3-zk5r.onrender.com) → design-rite-v4/main

---

## ⏱️ Time Estimate

- Step 1 (Rename): 1 minute
- Step 2 (Create): 1 minute
- Step 3 (Script): 2 minutes
- Step 4 (Render): 3 minutes

**Total: ~7 minutes**

---

## 🚨 Important Notes

1. **Render will auto-deploy** after you update the repo connection
2. **No code changes needed** - everything is ready to go
3. **Old v3 repo stays intact** - nothing is deleted, just renamed
4. **All commit history preserved** - your auth fix and all work is safe

---

**Ready to start? Begin with STEP 1!**

After you complete steps 1-2, run the script in STEP 3 and I'll help with STEP 4.
