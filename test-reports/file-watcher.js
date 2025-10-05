/**
 * File Watcher - Monitors test-reports/issues/ for new issues
 * Notifies Claude Code when ChatGPT drops an issue file
 * Replaces GitHub Copilot's "watcher" role
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ISSUES_DIR = path.join(__dirname, 'issues');
const FIXES_DIR = path.join(__dirname, 'fixes');
const NOTIFICATION_FILE = path.join(__dirname, 'CLAUDE_TODO.md');

// Track processed files
const processedFiles = new Set();

console.log('👁️  File Watcher Started');
console.log('📁 Monitoring:', ISSUES_DIR);
console.log('🔔 Will notify Claude Code of new issues...\n');

// Watch for new issue files
fs.watch(ISSUES_DIR, (eventType, filename) => {
  if (eventType === 'rename' && filename && filename.endsWith('.json')) {
    const filePath = path.join(ISSUES_DIR, filename);

    // Check if file exists (not deleted) and not already processed
    if (fs.existsSync(filePath) && !processedFiles.has(filename)) {
      processedFiles.add(filename);

      setTimeout(() => {
        handleNewIssue(filePath, filename);
      }, 500); // Wait 500ms for file to be fully written
    }
  }
});

function handleNewIssue(filePath, filename) {
  console.log('\n🚨 NEW ISSUE DETECTED:', filename);

  try {
    // Read issue data
    const issueData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    console.log('📋 Category:', issueData.category);
    console.log('🎯 Severity:', issueData.severity);
    console.log('🧪 Test:', issueData.test_name);
    console.log('❌ Error:', issueData.error);

    // Create notification for Claude Code
    createClaudeNotification(issueData, filename);

    // Open file in VS Code (optional - requires code CLI)
    // openInVSCode(filePath);

    // Play notification sound (Windows)
    playNotificationSound();

  } catch (error) {
    console.error('❌ Error processing issue:', error.message);
  }
}

function createClaudeNotification(issue, filename) {
  const notification = `# 🚨 Claude, Fix This! 🚨

**New Issue Detected:** ${issue.id}
**File:** test-reports/issues/${filename}
**Category:** ${issue.category}
**Severity:** ${issue.severity}
**Test:** ${issue.test_name}

## Problem
\`\`\`
${issue.error}
\`\`\`

## Details
${issue.details || 'See issue file for full details'}

## GPT-4 Suggested Fix
${issue.suggested_fix}

---

## Your Task
1. Read the full issue from: \`test-reports/issues/${filename}\`
2. Fix the code to resolve this issue
3. Create a fix summary at: \`test-reports/fixes/${issue.id}_FIXED.json\`

The fix file should contain:
\`\`\`json
{
  "issue_id": "${issue.id}",
  "files_modified": ["path/to/file.ts", "path/to/another.ts"],
  "changes_made": "Brief description of what you fixed",
  "tested": true,
  "notes": "Any additional notes for ChatGPT to retest"
}
\`\`\`

**ChatGPT will automatically retest after you create the fix file.**

---
**Timestamp:** ${new Date().toISOString()}
**Status:** AWAITING CLAUDE CODE FIX
`;

  // Write notification file
  fs.writeFileSync(NOTIFICATION_FILE, notification);

  console.log('✅ Notification created at:', NOTIFICATION_FILE);
  console.log('\n👉 HEY CLAUDE! Check test-reports/CLAUDE_TODO.md for your next task!\n');
}

function openInVSCode(filePath) {
  // Requires VS Code CLI (code command)
  exec(`code "${filePath}"`, (error) => {
    if (!error) {
      console.log('📝 Opened in VS Code');
    }
  });
}

function playNotificationSound() {
  // Windows notification sound
  if (process.platform === 'win32') {
    exec('powershell -c (New-Object Media.SoundPlayer "C:\\Windows\\Media\\notify.wav").PlaySync();');
  }
}

// Watch for Claude's fixes
fs.watch(FIXES_DIR, (eventType, filename) => {
  if (eventType === 'rename' && filename && filename.endsWith('.json')) {
    const filePath = path.join(FIXES_DIR, filename);

    if (fs.existsSync(filePath)) {
      console.log('\n✅ CLAUDE FIX DETECTED:', filename);
      console.log('👉 ChatGPT will now retest this fix...\n');

      // Update notification
      const fixNotification = `# ✅ Fix Applied by Claude Code

**File:** ${filename}
**Timestamp:** ${new Date().toISOString()}

ChatGPT Test Agent will now retest the fix.
Run the test agent to verify the fix worked.

**Command:**
\`\`\`bash
python test-reports/ai-test-agent.py
\`\`\`
`;

      fs.writeFileSync(NOTIFICATION_FILE, fixNotification);
    }
  }
});

// Health check
setInterval(() => {
  console.log(`⏰ Still watching... (${processedFiles.size} issues processed)`);
}, 60000); // Every minute

console.log('✅ File Watcher Ready!\n');
