#!/usr/bin/env node
/**
 * Autonomous Auth Audit Script
 * Searches for NextAuth and Supabase references, creates audit reports
 * Part of the foolproof autonomous workflow
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_ROOT = path.resolve(__dirname, '..');
const OUTPUT_DIR = path.join(__dirname);

console.log('[Auth Audit] Starting autonomous authentication audit...');
console.log('[Auth Audit] Project:', REPO_ROOT);

// Helper to run grep and capture results
function searchPattern(pattern, description) {
  try {
    const result = execSync(
      `grep -r "${pattern}" . --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next --exclude-dir=.ai_agents -n`,
      { cwd: REPO_ROOT, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 }
    );
    return { pattern, description, found: true, results: result };
  } catch (err) {
    // grep returns exit code 1 when no matches found
    if (err.status === 1) {
      return { pattern, description, found: false, results: '' };
    }
    return { pattern, description, found: false, error: err.message };
  }
}

// Phase 1: Search for NextAuth references
console.log('[Auth Audit] Phase 1: Searching for NextAuth references...');
const nextAuthPatterns = [
  { pattern: 'next-auth', desc: 'next-auth package imports' },
  { pattern: 'getServerSession', desc: 'NextAuth server session calls' },
  { pattern: 'useSession', desc: 'NextAuth client session hook' },
  { pattern: 'SessionProvider', desc: 'NextAuth session provider' },
  { pattern: 'NEXTAUTH_', desc: 'NextAuth environment variables' },
  { pattern: 'authOptions', desc: 'NextAuth configuration' },
  { pattern: '\\[\\.\\.\\.nextauth\\]', desc: 'NextAuth API route' }
];

const nextAuthResults = nextAuthPatterns.map(p => searchPattern(p.pattern, p.desc));

// Phase 2: Search for Supabase references
console.log('[Auth Audit] Phase 2: Searching for Supabase Auth references...');
const supabasePatterns = [
  { pattern: '@supabase/supabase-js', desc: 'Supabase client library' },
  { pattern: '@supabase/auth-helpers', desc: 'Supabase auth helpers' },
  { pattern: 'createClient', desc: 'Supabase client creation' },
  { pattern: 'signInWithPassword', desc: 'Supabase sign in' },
  { pattern: 'supabase\\.auth', desc: 'Supabase auth calls' },
  { pattern: 'getSession', desc: 'Session retrieval (Supabase or NextAuth)' },
  { pattern: 'getUser', desc: 'User retrieval (Supabase)' }
];

const supabaseResults = supabasePatterns.map(p => searchPattern(p.pattern, p.desc));

// Phase 3: Check specific critical files
console.log('[Auth Audit] Phase 3: Analyzing critical files...');
const criticalFiles = [
  'middleware.ts',
  'lib/auth.ts',
  'lib/supabase.ts',
  'app/admin/layout.tsx'
];

const criticalFileAnalysis = criticalFiles.map(file => {
  const filePath = path.join(REPO_ROOT, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasNextAuth = /next-auth|getServerSession|NextAuth/i.test(content);
    const hasSupabase = /supabase|@supabase/i.test(content);
    return {
      file,
      exists: true,
      hasNextAuth,
      hasSupabase,
      conflict: hasNextAuth && hasSupabase,
      lines: content.split('\n').length
    };
  }
  return { file, exists: false };
});

// Generate reports
console.log('[Auth Audit] Generating audit reports...');

// Report 1: NextAuth References
const nextAuthReport = `# NextAuth References Audit

**Generated**: ${new Date().toISOString()}
**Status**: ${nextAuthResults.some(r => r.found) ? '🔴 NextAuth Found' : '✅ No NextAuth'}

## Summary

${nextAuthResults.map(r => `- **${r.description}**: ${r.found ? `🔴 FOUND (${r.results.split('\n').filter(l => l).length} occurrences)` : '✅ Not found'}`).join('\n')}

## Detailed Findings

${nextAuthResults.filter(r => r.found).map(r => `
### ${r.description}

\`\`\`
${r.results}
\`\`\`
`).join('\n') || '✅ No NextAuth references found'}

## Recommendation

${nextAuthResults.some(r => r.found)
  ? '🔴 **CRITICAL**: NextAuth references found. Must remove all NextAuth code and migrate to 100% Supabase.'
  : '✅ **GOOD**: No NextAuth found. Auth migration appears complete.'}
`;

// Report 2: Supabase References
const supabaseReport = `# Supabase Auth References Audit

**Generated**: ${new Date().toISOString()}
**Status**: ${supabaseResults.some(r => r.found) ? '✅ Supabase Found' : '⚠️ No Supabase'}

## Summary

${supabaseResults.map(r => `- **${r.description}**: ${r.found ? `✅ FOUND (${r.results.split('\n').filter(l => l).length} occurrences)` : '❌ Not found'}`).join('\n')}

## Detailed Findings

${supabaseResults.filter(r => r.found).map(r => `
### ${r.description}

\`\`\`
${r.results.slice(0, 5000)}${r.results.length > 5000 ? '\n... (truncated)' : ''}
\`\`\`
`).join('\n') || '⚠️ No Supabase references found'}

## Recommendation

${supabaseResults.some(r => r.found)
  ? '✅ **GOOD**: Supabase auth implementation detected.'
  : '🔴 **CRITICAL**: No Supabase found. Must implement Supabase auth.'}
`;

// Report 3: Critical Files Analysis
const criticalFilesReport = `# Critical Files Analysis

**Generated**: ${new Date().toISOString()}

## Files Analyzed

${criticalFileAnalysis.map(f => `
### ${f.file}

- **Exists**: ${f.exists ? '✅ Yes' : '❌ No'}
${f.exists ? `- **Lines**: ${f.lines}
- **Has NextAuth**: ${f.hasNextAuth ? '🔴 YES' : '✅ No'}
- **Has Supabase**: ${f.hasSupabase ? '✅ YES' : '❌ No'}
- **Conflict**: ${f.conflict ? '🔴 YES - Both auth systems present!' : '✅ No'}` : ''}
`).join('\n')}

## Conflicts Detected

${criticalFileAnalysis.filter(f => f.conflict).length > 0
  ? `🔴 **${criticalFileAnalysis.filter(f => f.conflict).length} file(s) have BOTH NextAuth and Supabase**:
${criticalFileAnalysis.filter(f => f.conflict).map(f => `- ${f.file}`).join('\n')}`
  : '✅ No dual auth system conflicts detected'}
`;

// Master Report
const masterReport = `# Authentication Audit - Master Report

**Generated**: ${new Date().toISOString()}
**Project**: design-rite-v4 (staging branch)
**Audit Type**: Autonomous scan

---

## 🎯 Executive Summary

**NextAuth Status**: ${nextAuthResults.some(r => r.found) ? '🔴 FOUND - Must remove' : '✅ Clean'}
**Supabase Status**: ${supabaseResults.some(r => r.found) ? '✅ FOUND - Good' : '⚠️ Missing'}
**Conflicts**: ${criticalFileAnalysis.filter(f => f.conflict).length > 0 ? `🔴 ${criticalFileAnalysis.filter(f => f.conflict).length} file(s)` : '✅ None'}

---

## 📊 Findings Summary

### NextAuth References
${nextAuthResults.filter(r => r.found).length > 0
  ? `🔴 Found in ${nextAuthResults.filter(r => r.found).length} pattern(s):
${nextAuthResults.filter(r => r.found).map(r => `- ${r.description}: ${r.results.split('\n').filter(l => l).length} occurrences`).join('\n')}`
  : '✅ No NextAuth references found'}

### Supabase References
${supabaseResults.filter(r => r.found).length > 0
  ? `✅ Found in ${supabaseResults.filter(r => r.found).length} pattern(s):
${supabaseResults.filter(r => r.found).map(r => `- ${r.description}: ${r.results.split('\n').filter(l => l).length} occurrences`).join('\n')}`
  : '⚠️ No Supabase references found'}

### Critical File Conflicts
${criticalFileAnalysis.filter(f => f.conflict).map(f =>
  `🔴 **${f.file}**: Both NextAuth and Supabase detected`
).join('\n') || '✅ No conflicts in critical files'}

---

## 🔴 Critical Issues

${nextAuthResults.some(r => r.found) || criticalFileAnalysis.some(f => f.conflict)
  ? `### Issue #1: NextAuth Still Present

**Impact**: Authentication conflicts, session issues, "wonky" behavior
**Root Cause**: Incomplete migration from NextAuth to Supabase
**Files Affected**: ${nextAuthResults.filter(r => r.found).length} pattern matches

**Required Action**: Remove ALL NextAuth references:
${nextAuthResults.filter(r => r.found).map(r => `- Remove ${r.description}`).join('\n')}

### Issue #2: Dual Auth System Conflicts

**Files with both systems**:
${criticalFileAnalysis.filter(f => f.conflict).map(f => `- ${f.file}`).join('\n') || 'None'}

**Required Action**: Choose ONE auth system (Supabase recommended), remove the other completely.`
  : '✅ No critical issues detected'}

---

## ✅ Recommendations

### Priority 1: Immediate (Fix Today)
${nextAuthResults.some(r => r.found)
  ? `1. Remove all NextAuth imports and dependencies
2. Remove NextAuth API routes
3. Remove NextAuth environment variables
4. Update middleware.ts to use only Supabase`
  : '✅ NextAuth already removed'}

### Priority 2: Validation (This Week)
1. Test all protected routes with Supabase auth
2. Verify session persistence
3. Check logout functionality
4. Validate in staging environment

### Priority 3: Documentation (Next Week)
1. Update auth documentation
2. Remove NextAuth from package.json
3. Update CHANGELOG.md

---

## 📁 Detailed Reports

See individual reports for complete findings:
- AUDIT_NEXTAUTH_REFERENCES.md
- AUDIT_SUPABASE_REFERENCES.md
- AUDIT_CRITICAL_FILES.md

---

**Audit completed autonomously by run_auth_audit.js**
**Next step**: Review with Claude, approve fixes, test in staging
`;

// Write all reports
fs.writeFileSync(path.join(OUTPUT_DIR, 'AUDIT_NEXTAUTH_REFERENCES.md'), nextAuthReport);
fs.writeFileSync(path.join(OUTPUT_DIR, 'AUDIT_SUPABASE_REFERENCES.md'), supabaseReport);
fs.writeFileSync(path.join(OUTPUT_DIR, 'AUDIT_CRITICAL_FILES.md'), criticalFilesReport);
fs.writeFileSync(path.join(OUTPUT_DIR, 'AUTH_AUDIT_MASTER_REPORT.md'), masterReport);

console.log('[Auth Audit] ✅ Audit complete!');
console.log('[Auth Audit] Reports generated in .ai_agents/');
console.log('[Auth Audit] - AUDIT_NEXTAUTH_REFERENCES.md');
console.log('[Auth Audit] - AUDIT_SUPABASE_REFERENCES.md');
console.log('[Auth Audit] - AUDIT_CRITICAL_FILES.md');
console.log('[Auth Audit] - AUTH_AUDIT_MASTER_REPORT.md');

// Return summary for queue
const summary = {
  nextAuthFound: nextAuthResults.some(r => r.found),
  supabaseFound: supabaseResults.some(r => r.found),
  conflicts: criticalFileAnalysis.filter(f => f.conflict).length,
  status: 'completed'
};

console.log('[Auth Audit] Summary:', JSON.stringify(summary, null, 2));
process.exit(0);
