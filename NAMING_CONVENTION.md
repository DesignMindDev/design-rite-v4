# 🏷️ Design-Rite Naming Convention & Version Control

**Created**: 2025-10-08
**Purpose**: Eliminate confusion about versions, branches, and deployments
**Problem Solved**: Folders named "v3.1" containing "v3.0" code

---

## 🎯 THE PROBLEM

**Current Confusion**:
```
❌ design-rite-v3.1/     ← Folder name says v3.1
   └── package.json      → version: "3.0.0"  ← Code says v3.0
   └── README says v3    ← Docs say v3
```

**Why this causes issues**:
- Don't know what version is actually deployed
- Can't tell if code is newer than folder name
- Makes rollback/debugging impossible
- "Which v3 has the auth fix?" becomes guessing game

---

## ✅ NEW FOOLPROOF NAMING CONVENTION

### **Rule 1: Folder Name = Major Version Only**

```
✅ CORRECT:
design-rite-v4/              ← v4.x.x code lives here
├── package.json             → version: "4.2.1"
├── Git tags: v4.0.0, v4.1.0, v4.2.0, v4.2.1
└── Branches show environment, not version

❌ WRONG:
design-rite-v4.2.1/          ← Don't put minor version in folder name
design-rite-v4-staging/      ← Don't put branch name in folder name
```

**Why**: Folder name stays constant, Git handles version history

---

### **Rule 2: Branch Names = Environment + Purpose**

```
✅ CORRECT Branch Names:
main                         ← Production (always deployable)
develop                      ← Integration (features merge here first)
staging                      ← Pre-production validation
feature/subscriber-portal    ← Experimental work
feature/auth-fix            ← Specific fixes
hotfix/critical-auth-bug    ← Emergency production fixes

❌ WRONG Branch Names:
v4.2-staging                 ← No version numbers in branches
main-v4                      ← "main" is implicit
production                   ← Use "main" for production
dev-branch                   ← Use "develop"
```

**Why**: Branches describe role, not version. Git tags describe version.

---

### **Rule 3: Version Numbers = Semantic Versioning**

**Format**: `MAJOR.MINOR.PATCH` (e.g., `4.2.1`)

```
MAJOR (4.x.x) - Breaking changes, new architecture
├── v4.0.0 - Initial v4 release (NextAuth → Supabase migration)
├── v5.0.0 - Future: Complete auth rewrite

MINOR (4.2.x) - New features, backwards compatible
├── v4.1.0 - Added subscriber portal
├── v4.2.0 - Added Spatial Studio integration

PATCH (4.2.1) - Bug fixes, no new features
├── v4.2.1 - Fixed auth session persistence
├── v4.2.2 - Fixed logout redirect
```

**In package.json**:
```json
{
  "name": "design-rite",
  "version": "4.2.1",
  "description": "Design-Rite v4 - Multi-AI Security Intelligence Platform"
}
```

---

### **Rule 4: Git Tags = Deployment Markers**

**Production Releases** (from main branch):
```bash
v4.0.0          ← Initial production release
v4.1.0          ← Feature release
v4.1.1          ← Bug fix
v4.2.0          ← Major feature (subscriber portal)
v4.2.1          ← Auth fix (current)
```

**Staging Pre-releases** (from staging branch):
```bash
v4.2.0-staging.1     ← First staging build before v4.2.0 release
v4.2.0-staging.2     ← Second staging iteration (fixes found)
v4.2.0-rc.1          ← Release candidate (ready for production)
```

**Development Snapshots** (from develop branch - optional):
```bash
v4.2.0-dev.1         ← Development snapshot (rarely used)
```

**Create tags**:
```bash
# Production release
git tag -a v4.2.1 -m "Release v4.2.1: Auth session fix"
git push origin v4.2.1

# Staging pre-release
git tag -a v4.3.0-staging.1 -m "Staging: New auth system"
git push origin v4.3.0-staging.1
```

---

## 🗂️ DIRECTORY STRUCTURE (One Repository)

### **Active Development**:
```
C:\Users\dkozi\Projects\
└── design-rite-v4\                    ← ONE folder for v4.x.x
    ├── .git\                          ← Git history tracks versions
    │   ├── main branch                → v4.2.1 (production)
    │   ├── staging branch             → v4.3.0-staging.1 (testing)
    │   ├── develop branch             → v4.3.0-dev (integration)
    │   └── feature/new-thing          → experimental
    │
    ├── package.json                   → version: "4.2.1"
    ├── CHANGELOG.md                   → Version history
    └── (your code)
```

### **Archives** (Old Versions):
```
C:\Users\dkozi\Projects\ARCHIVE\
├── v3-experiments-20251008\           ← Old v3.1 folder (archived today)
│   └── README: "Archived experiments from design-rite-v3.1"
│
├── v3-production-20241215\            ← v3 production backup (if needed)
│   └── README: "Production v3.0.0 before v4 migration"
│
└── v2-legacy-20230601\                ← Ancient history
    └── README: "v2 archived for reference"
```

**Archive Naming**: `v{MAJOR}-{PURPOSE}-{YYYYMMDD}`

---

## 📋 DEPLOYMENT URLS & ENVIRONMENT MAPPING

### **Production** (main branch):
```
URL: https://design-rite.com
Branch: main
Version: v4.2.1 (tagged)
Deploy: Render auto-deploy from main branch
```

### **Staging** (staging branch):
```
URL: https://design-rite-staging.onrender.com
Branch: staging
Version: v4.3.0-staging.1 (tagged)
Deploy: Render auto-deploy from staging branch
```

### **Development** (develop branch):
```
URL: http://localhost:3009 (local only)
Branch: develop
Version: v4.3.0-dev (no tag, active work)
Deploy: Local development only (npm run dev)
```

### **Feature Branches** (feature/*):
```
URL: http://localhost:3010 (local only)
Branch: feature/subscriber-portal
Version: Based on parent branch (develop)
Deploy: Local development only
```

---

## 🔄 VERSION BUMP WORKFLOW

### **When to Bump Version**:

**MAJOR** (Breaking Changes):
```bash
# Example: v4.2.1 → v5.0.0
# When: Complete auth system rewrite, API changes
npm version major
git push origin main
git push origin v5.0.0
```

**MINOR** (New Features):
```bash
# Example: v4.2.1 → v4.3.0
# When: Add subscriber portal, new integrations
npm version minor
git push origin main
git push origin v4.3.0
```

**PATCH** (Bug Fixes):
```bash
# Example: v4.2.1 → v4.2.2
# When: Fix auth bug, fix logout redirect
npm version patch
git push origin main
git push origin v4.2.2
```

**Pre-release** (Staging Testing):
```bash
# Example: v4.2.1 → v4.3.0-staging.1
# When: Testing new feature in staging
npm version preminor --preid=staging
git push origin staging
git push origin v4.3.0-staging.1
```

---

## 📊 CHANGELOG.md (Required)

**Format**: Track version history in `CHANGELOG.md`

```markdown
# Changelog

All notable changes to Design-Rite v4 will be documented in this file.

## [4.2.1] - 2025-10-08
### Fixed
- Auth session persistence issue
- Logout redirect loop
- Removed all NextAuth references

### Changed
- Migrated to 100% Supabase Auth

## [4.2.0] - 2025-10-07
### Added
- Subscriber portal integration
- Cross-service authentication
- Super admin dashboard

### Fixed
- Branch synchronization issues

## [4.1.0] - 2025-10-01
### Added
- Calendly demo booking system
- Lead scoring algorithm
- Admin demo dashboard

## [4.0.0] - 2025-09-30
### Added
- Initial v4 release
- Multi-AI provider failover
- System Surveyor integration

### Changed
- Migrated from NextAuth to Supabase (incomplete)
- New authentication architecture

### Breaking Changes
- Removed v3 compatibility
```

---

## 🏷️ PACKAGE.JSON VERSION SYNC

**Always keep synchronized**:

```json
{
  "name": "design-rite",
  "version": "4.2.1",
  "description": "Design-Rite v4 - Multi-AI Security Intelligence Platform",
  "author": "Design-Rite Professional",
  "repository": {
    "type": "git",
    "url": "https://github.com/DesignMindDev/design-rite-v4"
  }
}
```

**Check version**:
```bash
npm version           # Shows current version
git describe --tags   # Shows current Git tag
```

**If mismatched**:
```bash
# Update package.json to match Git tag
npm version 4.2.1 --no-git-tag-version
git add package.json
git commit -m "Sync package.json version with Git tag v4.2.1"
```

---

## 📖 DOCUMENTATION VERSION HEADERS

**Every major doc file should have**:

```markdown
# File Name

**Version**: v4.2.1
**Last Updated**: 2025-10-08
**Branch**: staging
**Status**: Active

---

## Changes in v4.2.1:
- Fixed auth issues
- Removed NextAuth completely
```

**Files requiring version headers**:
- README.md
- CLAUDE.md
- PROJECT_CONTEXT.md
- FOOLPROOF_WORKFLOW.md
- Any architectural docs

---

## 🎯 QUICK REFERENCE COMMANDS

### **Check Current Version**:
```bash
# In code
npm version

# In Git
git describe --tags

# In deployment
curl https://design-rite.com/api/health | grep version
```

### **Create Release**:
```bash
# 1. Update version
npm version minor  # or major/patch

# 2. Update CHANGELOG.md
# (manual edit)

# 3. Commit & tag
git add .
git commit -m "Release v4.3.0: New subscriber portal"
git tag -a v4.3.0 -m "Release v4.3.0"

# 4. Push
git push origin main
git push origin v4.3.0
```

### **Rollback to Previous Version**:
```bash
# Find previous version
git tag -l "v4.*" | tail -5

# Rollback
git checkout v4.2.0
./scripts/promote.sh HEAD main "Emergency rollback to v4.2.0"
```

---

## 🚨 MIGRATION: Fix v3.1 Naming Confusion

### **Problem**:
Folder named `design-rite-v3.1` contains v3.0.0 code

### **Solution**: Archive with clear naming

```bash
# Step 1: Check what version is actually in there
cd "C:/Users/dkozi/Projects/Design-Rite/v3/design-rite-v3.1/design-rite-v3"
grep "\"version\"" package.json
# Output: "version": "3.0.0" or similar

# Step 2: Archive with accurate naming
cd "C:/Users/dkozi/Projects/Design-Rite/v3"
mv design-rite-v3.1 ../ARCHIVE/v3.0-experiments-archived-20251008

# Step 3: Add README to archive
echo "# Archived v3.0 Experiments
Archived: 2025-10-08
Original folder name: design-rite-v3.1 (misleading)
Actual version: v3.0.0
Reason: Replaced by v4 feature branches
Purpose: Historical reference only - DO NOT USE" > ../ARCHIVE/v3.0-experiments-archived-20251008/ARCHIVED_README.md

# Step 4: Create symlink for reference (optional)
ln -s ../ARCHIVE/v3.0-experiments-archived-20251008 design-rite-v3-archived
```

---

## ✅ NAMING CONVENTION CHECKLIST

**Before creating anything new**:

- [ ] Folder name = major version only (design-rite-v4, not design-rite-v4.2)
- [ ] Branch name = purpose, not version (feature/auth-fix, not v4.2-branch)
- [ ] package.json version = semantic versioning (4.2.1)
- [ ] Git tag created for releases (v4.2.1)
- [ ] CHANGELOG.md updated
- [ ] Documentation headers updated
- [ ] No misleading version numbers anywhere
- [ ] Archive folders clearly labeled with actual version

---

## 🎓 TRAINING: Explaining to Team

**Simple rule for team members**:

> "The folder name never changes. Git branches and tags track versions. If you see 'design-rite-v4', it contains ALL v4.x.x code. Check `git describe --tags` to see the actual version."

**Examples**:
```
design-rite-v4/
├── main branch = v4.2.1 (production)
├── staging branch = v4.3.0-staging.1 (testing new feature)
└── develop branch = v4.3.0-dev (active work)

All in ONE folder. Git manages versions.
```

---

## 📞 QUESTIONS & ANSWERS

**Q**: "Should I create design-rite-v5 folder for v5?"
**A**: Yes, but only when starting v5 development. Not for v4.x minor versions.

**Q**: "What if I need to test v4.1 and v4.2 simultaneously?"
**A**: Use Git worktrees:
```bash
git worktree add ../design-rite-v4.1-test v4.1.0
git worktree add ../design-rite-v4.2-test v4.2.0
```

**Q**: "Can I rename design-rite-v4 to design-rite?"
**A**: Yes, after v5 is released and v4 is archived. For now, keep v4 in name for clarity.

**Q**: "What about database versions?"
**A**: Use migration files with version prefixes:
```
supabase/migrations/
├── 20251008_v4.2.1_fix_auth_constraints.sql
├── 20251007_v4.2.0_add_subscriber_tables.sql
```

---

**Last Updated**: 2025-10-08
**Current Version**: v4.2.1
**Next Version**: v4.3.0 (after auth fix + testing)
**Status**: ✅ ACTIVE CONVENTION - Use for all naming decisions
