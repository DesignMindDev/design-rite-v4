#!/usr/bin/env node
/*
  run_tests_and_log.js
  Runs jest, captures the summary (pass/fail counts) and appends an entry to .ai_agents/agent_log.json

  Usage:
    node .\scripts\run_tests_and_log.js --agent=Claude
*/

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const agent = argv.agent || 'unknown';
const jestCmd = process.platform === 'win32' ? 'npx.cmd' : 'npx';

// Run jest and write JSON output to tmp/jest_results.json for reliable parsing
const outDir = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const resultsPath = path.join(outDir, 'jest_results.json');
// Remove previous results if any
try { if (fs.existsSync(resultsPath)) fs.unlinkSync(resultsPath); } catch (e) {}

const res = spawnSync(jestCmd, ['jest', `--outputFile=${resultsPath}`, '--json'], { stdio: 'inherit', encoding: 'utf8', shell: true });

let summary = { success: res.status === 0, status: res.status };
try {
  if (fs.existsSync(resultsPath)) {
    const json = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
    summary = {
      success: json.success,
      numTotalTests: json.numTotalTests,
      numPassedTests: json.numPassedTests,
      numFailedTests: json.numFailedTests,
      startTime: json.startTime
    };
  } else {
    summary = { success: res.status === 0, status: res.status, error: 'No jest_results.json produced' };
  }
} catch (err) {
  summary = { success: res.status === 0, error: String(err) };
}

// Append to agent log
const logDir = path.join(process.cwd(), '.ai_agents');
const logFile = path.join(logDir, 'agent_log.json');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
if (!fs.existsSync(logFile)) fs.writeFileSync(logFile, '[]', 'utf8');
const logs = JSON.parse(fs.readFileSync(logFile, 'utf8')) || [];
const entry = {
  id: `test-log-${Date.now()}`,
  agent,
  timestamp: new Date().toISOString(),
  action: 'run-tests',
  result: summary
};
logs.push(entry);
fs.writeFileSync(logFile, JSON.stringify(logs, null, 2), 'utf8');
console.log('Wrote test summary to', logFile);
process.exit(res.status);
