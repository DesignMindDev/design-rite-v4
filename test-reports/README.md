# 🤖 AI Agent Testing System

**Autonomous testing with ChatGPT, File Watcher, and Claude Code**

## Quick Start

### 1. Install Dependencies

```bash
pip install openai requests
```

### 2. Set OpenAI API Key

Add to `.env` in project root:

```bash
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. Start Servers

```bash
# Terminal 1: Main app
npm run dev

# Terminal 2: Super Agent
cd design-rite-super-agent
python -m uvicorn app.main:app --reload --port 9500
```

### 4. Start File Watcher

```bash
# Terminal 3
cd test-reports
node file-watcher.js
```

### 5. Run Tests

```bash
# Terminal 4
cd test-reports
python ai-test-agent.py
```

---

## What Happens Next?

1. **ChatGPT** runs 40+ tests (stress, security, UX, admin)
2. **File Watcher** detects failures and creates `CLAUDE_TODO.md`
3. **You** tell Claude Code: "Check CLAUDE_TODO.md and fix the issue"
4. **Claude Code** (me) fixes the code and writes to `test-reports/fixes/`
5. **ChatGPT** retests and confirms the fix ✅

---

## Files Created

- `ai-test-agent.py` - ChatGPT test agent (400+ lines)
- `file-watcher.js` - File watcher (replaces Copilot)
- `AI_TESTING_WORKFLOW.md` - Complete documentation
- `issues/` - Issue reports from ChatGPT
- `fixes/` - Fix summaries from Claude Code
- `final/` - Final test reports

---

## Example Workflow

**ChatGPT finds SQL injection vulnerability:**
```bash
🚨 Issue Created: SECURITY_1_1738656789 - SQL Injection - Login Form
```

**File Watcher notifies you:**
```bash
👉 HEY CLAUDE! Check test-reports/CLAUDE_TODO.md for your next task!
```

**You tell Claude Code:**
```
"Hey Claude, check CLAUDE_TODO.md and fix the issue"
```

**Claude Code fixes it:**
```
✅ Fixed SQL injection in app/api/auth/[...nextauth]/route.ts
Created fix file: test-reports/fixes/SECURITY_1_1738656789_FIXED.json
```

**ChatGPT retests:**
```
✅ Fix confirmed - SQL injection attempt now properly rejected
```

---

## Need Help?

Read `AI_TESTING_WORKFLOW.md` for complete documentation.

**Common Issues:**
- File watcher not running? `node file-watcher.js`
- Servers not running? Check `npm run dev` and Super Agent
- Tests failing? Servers must be accessible on localhost

---

**Ready? Start the file watcher and run the tests!** 🚀
