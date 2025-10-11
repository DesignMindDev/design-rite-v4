# How to Fix Claude Code Workspace Settings

## The Problem

Claude Code is currently configured with the WRONG primary working directory:

**Current (WRONG):**
```
Primary: C:\Users\dkozi\Projects\Design-Rite\v3\design-rite-v3.1\design-rite-v3
Additional: C:\Users\dkozi\Projects\design-rite-v4
```

**Should Be:**
```
Primary: C:\Users\dkozi\Projects\design-rite-v4
Additional: C:\Users\dkozi\Desktop (for SQL scripts)
```

---

## How to Fix This

### Option 1: Manual Update (Recommended)

1. Open Claude Code settings
2. Find "Working Directory" setting
3. Change from:
   ```
   C:\Users\dkozi\Projects\Design-Rite\v3\design-rite-v3.1\design-rite-v3
   ```
   To:
   ```
   C:\Users\dkozi\Projects\design-rite-v4
   ```

### Option 2: Start Claude Code from Correct Directory

In a terminal:
```bash
cd C:\Users\dkozi\Projects\design-rite-v4
code .
# Then start Claude Code from this VS Code instance
```

---

## Verification

After fixing, ask Claude to run:
```bash
pwd
```

**Should show:**
```
/c/Users/dkozi/Projects/design-rite-v4
```

**NOT:**
```
/c/Users/dkozi/Projects/Design-Rite/v3/design-rite-v3.1/design-rite-v3
```

---

## Why This Matters

When Claude Code starts in the wrong directory:
- Git commits go to the wrong branch
- File paths get confusing
- Pushes might fail or go to unexpected places
- You waste time troubleshooting like we just did!

---

**Fix this BEFORE the next Claude Code session!**
