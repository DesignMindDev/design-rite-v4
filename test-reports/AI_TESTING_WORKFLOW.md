# 🤖 AI Agent Testing Workflow
## ChatGPT + Claude Code + File Watcher Automation

This workflow automates testing with three AI agents working together:
1. **ChatGPT/GPT-4** - Runs tests, detects issues, writes reports
2. **File Watcher** - Monitors for issues, notifies Claude Code
3. **Claude Code** - Fixes issues, writes fix summaries

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    AI Testing Workflow                          │
└─────────────────────────────────────────────────────────────────┘

  [1] ChatGPT Test Agent
      │
      ├─ Stress Tests (concurrency, load, rate limits)
      ├─ Penetration Tests (SQL injection, XSS, auth bypass)
      ├─ UX Tests (workflows, data population)
      ├─ Admin Tests (permissions, CRUD operations)
      │
      ├─ Detects Issues
      ├─ Generates Fix Suggestions (using GPT-4)
      │
      └──▶ Writes to test-reports/issues/*.json
            │
            │
  [2] File Watcher (replaces Copilot)
      │
      ├─ Monitors test-reports/issues/
      ├─ Detects new issue files
      ├─ Creates CLAUDE_TODO.md notification
      ├─ Plays sound alert (Windows)
      │
      └──▶ Notifies: "Hey Claude! Fix this!"
            │
            │
  [3] Claude Code (You + AI)
      │
      ├─ Reads CLAUDE_TODO.md
      ├─ Reads issue from test-reports/issues/
      ├─ Fixes the code
      ├─ Writes fix summary to test-reports/fixes/
      │
      └──▶ Writes to test-reports/fixes/{issue_id}_FIXED.json
            │
            │
  [4] File Watcher Detects Fix
      │
      └──▶ Notifies ChatGPT to retest
            │
            │
  [5] ChatGPT Retests
      │
      ├─ Reads fix file
      ├─ Re-runs original test
      │
      └──▶ Confirms fix ✅ or Creates new issue ❌
            │
            │
  [6] Final Report Generated
      │
      └─ test-reports/final/test-report-{timestamp}.md
```

---

## 📦 Setup Instructions

### 1. Install Dependencies

```bash
# Python dependencies for ChatGPT test agent
pip install openai requests

# Node.js is already installed (you're using npm)
```

### 2. Set Environment Variables

Add to your `.env` file:

```bash
# OpenAI API Key (for ChatGPT test agent)
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### 3. Start the File Watcher

Open a new terminal and run:

```bash
cd test-reports
node file-watcher.js
```

**This terminal must stay open** - it watches for issues and notifies Claude Code.

---

## 🚀 Running the Tests

### Option 1: Run All Tests

```bash
cd test-reports
python ai-test-agent.py
```

### Option 2: Run Specific Test Suite

Edit `ai-test-agent.py` and comment out unwanted tests:

```python
if __name__ == "__main__":
    agent = TestAgent()

    agent.run_stress_tests()         # ← Comment out if not needed
    # agent.run_penetration_tests()  # ← Commented out
    # agent.run_ux_tests()
    # agent.run_admin_tests()

    agent.generate_final_report()
```

### Option 3: Custom Tests

Add your own tests to `ai-test-agent.py`:

```python
def run_custom_tests(self):
    tests = [
        {
            "name": "My Custom Test",
            "endpoint": "http://localhost:3000/api/my-endpoint",
            "payload": {"test": "data"}
        }
    ]

    for test in tests:
        result = self._execute_ux_test(test)
        self.test_results["custom_tests"].append(result)
```

---

## 🔄 The Workflow in Action

### Step 1: ChatGPT Runs Tests

```bash
cd test-reports
python ai-test-agent.py
```

**Output:**
```
🤖 AI Test Agent Starting...
============================================================
🔥 Running Stress Tests...
🛡️ Running Penetration Tests...
🚨 Issue Created: SECURITY_1_1738656789 - SQL Injection - Login Form
🎨 Running UX Tests (Data Population)...
👑 Running Admin Panel Tests...
📊 Generating Final Report...
✅ Report saved to test-reports/final/test-report-1738656789.md
```

### Step 2: File Watcher Detects Issue

**File Watcher Terminal:**
```
👁️  File Watcher Started
📁 Monitoring: C:\Users\dkozi\...\test-reports\issues

🚨 NEW ISSUE DETECTED: SECURITY_1_1738656789.json
📋 Category: SECURITY
🎯 Severity: HIGH
🧪 Test: SQL Injection - Login Form
❌ Error: Malicious input was not rejected
✅ Notification created at: CLAUDE_TODO.md

👉 HEY CLAUDE! Check test-reports/CLAUDE_TODO.md for your next task!
```

**Windows notification sound plays** 🔔

### Step 3: Claude Code Fixes Issue

**You (the user) see:**
- `test-reports/CLAUDE_TODO.md` created with issue details
- Claude Code reads the issue and GPT-4's suggested fix

**You say to Claude Code:**
```
"Hey Claude, check CLAUDE_TODO.md and fix the issue"
```

**Claude Code (me) responds:**
```
I'll fix the SQL injection vulnerability. Reading the issue...

Issue: SQL Injection - Login Form
Location: app/api/auth/[...nextauth]/route.ts

I need to add input validation and parameterized queries.
Let me update the authentication handler...

[Claude makes code changes]

✅ Fixed! I've added:
1. Input validation with Zod schemas
2. Parameterized queries (Supabase handles this)
3. Rate limiting on login attempts

Creating fix summary in test-reports/fixes/SECURITY_1_1738656789_FIXED.json
```

**Claude creates fix file:**
```json
{
  "issue_id": "SECURITY_1_1738656789",
  "files_modified": [
    "app/api/auth/[...nextauth]/route.ts",
    "lib/auth.ts"
  ],
  "changes_made": "Added Zod input validation, sanitized user inputs, implemented rate limiting",
  "tested": true,
  "notes": "Login form now rejects malicious SQL strings. Retest with original payload."
}
```

### Step 4: File Watcher Detects Fix

**File Watcher Terminal:**
```
✅ CLAUDE FIX DETECTED: SECURITY_1_1738656789_FIXED.json
👉 ChatGPT will now retest this fix...
```

### Step 5: ChatGPT Retests

```bash
cd test-reports
python ai-test-agent.py
```

**ChatGPT:**
- Reads fix file
- Re-runs SQL injection test
- Verifies malicious input is now rejected ✅

### Step 6: Final Report

**test-reports/final/test-report-1738656789.md:**

```markdown
# AI Agent Testing Report
**Generated:** 2025-10-04 14:30:00
**Agent:** GPT-4 Test Agent

## Summary
- **Total Tests:** 42
- **Passed:** 41
- **Failed:** 1
- **Success Rate:** 97.6%

## Issues Fixed by Claude Code
✅ SECURITY_1 - SQL Injection - Login Form
   - Fixed by: Claude Code
   - Verified: ✅ Passed retest

## GPT-4 Agent Observations
- Server response times averaged 234ms
- Security posture: ✅ Excellent - All security tests passed
- Recommended: Add rate limiting to /api/estimate endpoint
```

---

## 📁 File Structure

```
test-reports/
├── ai-test-agent.py           # ChatGPT test agent
├── file-watcher.js            # File watcher (replaces Copilot)
├── AI_TESTING_WORKFLOW.md     # This file
│
├── issues/                    # ChatGPT writes issues here
│   ├── SECURITY_1_1738656789.json
│   ├── STRESS_TEST_2_1738656790.json
│   └── ...
│
├── fixes/                     # Claude Code writes fixes here
│   ├── SECURITY_1_1738656789_FIXED.json
│   └── ...
│
├── final/                     # Final test reports
│   ├── test-report-1738656789.md
│   └── ...
│
└── CLAUDE_TODO.md             # Current issue for Claude to fix
```

---

## 🎯 What Each Agent Does

### ChatGPT Test Agent (ai-test-agent.py)

**Responsibilities:**
- Run stress, penetration, UX, and admin tests
- Detect failures and vulnerabilities
- Generate fix suggestions using GPT-4
- Write detailed issue reports
- Monitor for Claude's fixes
- Retest after fixes applied
- Generate final test reports

**Tests Performed:**
1. **Stress Tests**
   - Concurrent request handling (10+ simultaneous)
   - Large payload handling (10KB+ prompts)
   - Rate limiting (50 requests/min)
   - Memory leak detection
   - Connection pooling

2. **Penetration Tests**
   - SQL injection attempts
   - XSS (cross-site scripting)
   - CSRF protection
   - Authentication bypass
   - API key validation
   - Session hijacking
   - Path traversal

3. **UX Tests**
   - Complete user workflows
   - Data population for dashboards
   - AI assessment flow
   - Super Agent orchestration
   - Admin panel navigation

4. **Admin Tests**
   - Role-based access control
   - User creation/management
   - Rate limit overrides
   - Activity log viewing
   - Permissions enforcement

### File Watcher (file-watcher.js)

**Responsibilities:**
- Monitor `test-reports/issues/` for new issue files
- Create `CLAUDE_TODO.md` notifications
- Play notification sound (Windows)
- Optionally open files in VS Code
- Monitor `test-reports/fixes/` for Claude's fixes
- Notify ChatGPT to retest

**Replaces:** GitHub Copilot's "watcher" role

### Claude Code (You + AI)

**Responsibilities:**
- Read issue reports from CLAUDE_TODO.md
- Analyze GPT-4's suggested fixes
- Fix code vulnerabilities/bugs
- Update relevant files
- Create fix summary JSON files
- Test fixes locally if needed

---

## 🔧 Customization

### Add Custom Tests

Edit `ai-test-agent.py`:

```python
def run_my_custom_tests(self):
    tests = [
        {
            "name": "Test API Endpoint",
            "endpoint": "http://localhost:3000/api/my-endpoint",
            "method": "POST",
            "payload": {"key": "value"}
        }
    ]

    for test in tests:
        result = self._execute_ux_test(test)
        self.test_results["custom_tests"].append(result)

# Add to main():
agent.run_my_custom_tests()
```

### Change Notification Behavior

Edit `file-watcher.js`:

```javascript
function createClaudeNotification(issue, filename) {
  // Customize notification format
  // Add Slack notifications
  // Send email alerts
  // etc.
}
```

### Adjust Test Severity

Edit `ai-test-agent.py`:

```python
def _create_issue(self, category, test_result):
    severity = "CRITICAL" if category == "SECURITY" else "MEDIUM"

    # Custom severity logic
    if "SQL" in test_result["name"]:
        severity = "CRITICAL"
    elif "Rate Limit" in test_result["name"]:
        severity = "LOW"
```

---

## 📊 Example Issue File

**test-reports/issues/SECURITY_1_1738656789.json:**

```json
{
  "id": "SECURITY_1_1738656789",
  "category": "SECURITY",
  "severity": "HIGH",
  "test_name": "SQL Injection - Login Form",
  "status": "OPEN",
  "error": "Malicious SQL input was not rejected (status 200)",
  "details": "Payload: {\"username\": \"admin' OR '1'='1\", \"password\": \"' OR '1'='1\"}",
  "timestamp": "2025-10-04T14:15:30.123456",
  "suggested_fix": "Root cause: Missing input validation on login form...\n\nFiles to modify:\n- app/api/auth/[...nextauth]/route.ts\n- lib/auth.ts\n\nChanges needed:\n1. Add Zod schema validation...\n2. Sanitize user inputs...\n3. Use parameterized queries..."
}
```

---

## 📊 Example Fix File

**test-reports/fixes/SECURITY_1_1738656789_FIXED.json:**

```json
{
  "issue_id": "SECURITY_1_1738656789",
  "files_modified": [
    "app/api/auth/[...nextauth]/route.ts",
    "lib/auth.ts"
  ],
  "changes_made": "Added Zod input validation schema, sanitized all user inputs, implemented rate limiting on login attempts",
  "tested": true,
  "notes": "Login form now rejects SQL injection attempts with 400 status. Malicious strings are sanitized before database queries."
}
```

---

## 🚨 Troubleshooting

### File Watcher Not Detecting Issues

**Problem:** File watcher doesn't notify when ChatGPT creates issue files.

**Solution:**
1. Ensure file watcher is running: `node test-reports/file-watcher.js`
2. Check file permissions on `test-reports/issues/` folder
3. Verify issues are being created (check folder manually)

### ChatGPT Can't Connect to APIs

**Problem:** `Connection refused` errors when running tests.

**Solution:**
1. Ensure servers are running:
   - Main app: `npm run dev` (port 3000)
   - Super Agent: `python -m uvicorn app.main:app --reload --port 9500`
2. Check firewall settings
3. Verify URLs in `ai-test-agent.py`

### Claude Code Doesn't See Notifications

**Problem:** `CLAUDE_TODO.md` exists but Claude doesn't respond.

**Solution:**
1. Manually check `test-reports/CLAUDE_TODO.md`
2. Tell Claude: "Check test-reports/CLAUDE_TODO.md for issues to fix"
3. Claude Code must be running in VS Code

### Tests Always Fail

**Problem:** All tests show failures even when code is correct.

**Solution:**
1. Check if servers are running and accessible
2. Verify API endpoints in `ai-test-agent.py`
3. Check authentication/API keys
4. Review test assertions (may need adjustment)

---

## 🎯 Success Criteria

**Workflow is successful when:**

1. ✅ ChatGPT runs all tests and generates reports
2. ✅ File watcher detects issues and creates notifications
3. ✅ Claude Code reads notifications and fixes issues
4. ✅ Claude creates fix files in test-reports/fixes/
5. ✅ ChatGPT retests and confirms fixes
6. ✅ Final report shows all tests passing

---

## 📈 Next Steps

### Phase 1: Basic Testing (Now)
- Run stress tests to identify performance bottlenecks
- Run security tests to find vulnerabilities
- Populate UX data for operations dashboard

### Phase 2: Continuous Testing
- Set up cron job to run tests nightly
- Create GitHub Actions workflow
- Add Slack notifications for critical failures

### Phase 3: Advanced Testing
- Visual regression testing (Percy, Chromatic)
- Accessibility testing (aXe, Pa11y)
- Performance monitoring (Lighthouse CI)
- Load testing (K6, Artillery)

### Phase 4: Full Automation
- Replace file watcher with GitHub Actions
- Automatically create GitHub issues for failures
- Auto-apply low-risk fixes (with review)

---

## 🤖 AI Agent Collaboration Summary

| Agent | Role | Input | Output |
|-------|------|-------|--------|
| **ChatGPT** | Tester | Test definitions | Issue reports, Final report |
| **File Watcher** | Coordinator | Issue files | Notifications, Alerts |
| **Claude Code** | Fixer | Issue reports | Code fixes, Fix summaries |

**Communication:**
- ChatGPT → File Watcher: Issue JSON files
- File Watcher → Claude: CLAUDE_TODO.md notifications
- Claude → ChatGPT: Fix JSON files
- ChatGPT → User: Final report

---

**Ready to test? Run:**

```bash
# Terminal 1: Start file watcher
cd test-reports
node file-watcher.js

# Terminal 2: Run tests
cd test-reports
python ai-test-agent.py

# Terminal 3: Claude Code (VS Code)
# Wait for notification in CLAUDE_TODO.md
```

🚀 **Let the AI agents work together!**
