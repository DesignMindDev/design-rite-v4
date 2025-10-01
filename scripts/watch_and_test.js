#!/usr/bin/env node
/*
  watch_and_test.js
  Watches the repository for changes and runs `npm run test:log` when files change.
  After each test run it will add a suggested next action to .ai_agents/agent_log.json using scripts/agent_next_action.js

  Usage:
    node ./scripts/watch_and_test.js
    or: npm run watch-tests
*/

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const watchDir = process.cwd();
const debounceMs = 700;
let timer = null;

function runTests() {
  console.log('[watch] Running tests...');
  const res = spawnSync('npm', ['run', 'test:log'], { stdio: 'inherit', shell: true });
  console.log('[watch] test:log exited with', res.status);

  // Decide next action based on tmp/jest_results.json
  const resultsPath = path.join(process.cwd(), 'tmp', 'jest_results.json');
  let suggestion = 'investigate test results';
  if (fs.existsSync(resultsPath)) {
    try {
      const raw = fs.readFileSync(resultsPath, 'utf8');
      const j = JSON.parse(raw);
      if (j.numFailedTests && j.numFailedTests > 0) {
        suggestion = `fix-failing-tests (${j.numFailedTests} failing)`;
      } else {
        suggestion = 'run-next-area:import';
      }
    } catch (e) {
      suggestion = 'could-not-parse-jest-results';
    }
  } else {
    suggestion = 'no-jest-results-produced';
  }

  // Append suggestion via agent_next_action.js
  const agentScript = path.join(process.cwd(), 'scripts', 'agent_next_action.js');
  if (fs.existsSync(agentScript)) {
    spawnSync('node', [agentScript, '--agent=Watcher', `--suggestion=${suggestion}`], { stdio: 'inherit', shell: true });
  } else {
    console.warn('[watch] agent_next_action.js not found, skipping suggestion append');
  }
}

function scheduleRun() {
  if (timer) clearTimeout(timer);
  timer = setTimeout(runTests, debounceMs);
}

console.log('[watch] Starting watch on', watchDir);
// Watch recursively - use fs.watch on the current directory and rely on debounce
fs.watch(watchDir, { recursive: true }, (eventType, filename) => {
  if (!filename) return;
  // ignore node_modules, tmp, .git, .next, .ai_agents
  if (filename.includes('node_modules') || filename.includes('.git') || filename.includes('tmp') || filename.includes('.next') || filename.includes('.ai_agents')) return;
  console.log('[watch] change detected:', filename, eventType);
  scheduleRun();
});

// run tests once at start
scheduleRun();
