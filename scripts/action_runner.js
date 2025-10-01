#!/usr/bin/env node
/*
  action_runner.js
  Safe action runner for canonical suggestions recorded in .ai_agents/agent_log.json.
  It will look for the oldest open suggestion, map it via .ai_agents/action_map.json, and run the mapped command.
  The runner appends a result entry using scripts/ai_agent_log_append.js.

  Usage: node scripts/action_runner.js --agent=ActionRunner [--dry]
*/

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const argv = require('minimist')(process.argv.slice(2));

const DRY = argv.dry || false;
const AGENT = argv.agent || 'ActionRunner';

const logPath = path.join(process.cwd(), '.ai_agents', 'agent_log.json');
const mapPath = path.join(process.cwd(), '.ai_agents', 'action_map.json');
const appendScript = path.join(process.cwd(), 'scripts', 'ai_agent_log_append.js');

if (!fs.existsSync(logPath)) {
  console.error('No agent_log.json found at', logPath);
  process.exit(1);
}
if (!fs.existsSync(mapPath)) {
  console.error('No action_map.json found at', mapPath);
  process.exit(1);
}

const logRaw = fs.readFileSync(logPath, 'utf8');
let logArr = [];
try { logArr = JSON.parse(logRaw); } catch(e) { console.error('Invalid agent_log.json'); process.exit(1); }

// Find oldest open suggestion
const openIdx = logArr.findIndex(e => e.action === 'suggest-next' && e.status === 'open');
if (openIdx === -1) {
  console.log('No open suggestions found.');
  process.exit(0);
}
const suggestionEntry = logArr[openIdx];
const suggestion = suggestionEntry.suggestion || suggestionEntry.suggest || '';

const actionMap = JSON.parse(fs.readFileSync(mapPath, 'utf8'));

// suggestion may be like "run-next-area:import" or "fix-failing-tests (2 failing)"
const key = Object.keys(actionMap).find(k => suggestion.startsWith(k)) || suggestion.split(' ')[0];
const mapping = actionMap[key];

if (!mapping) {
  console.error('No mapping found for suggestion:', suggestion);
  // mark suggestion as unresolved
  const note = { id: `action-run-${Date.now()}`, agent: AGENT, timestamp: new Date().toISOString(), action: 'action-run', command: null, status: 'unmapped', details: `No mapping for suggestion: ${suggestion}`, artifacts: [] };
  logArr.push(note);
  fs.writeFileSync(logPath, JSON.stringify(logArr, null, 2), 'utf8');
  process.exit(1);
}

console.log('Found suggestion:', suggestionEntry.id, suggestion);
console.log('Mapped to command:', mapping.command);

if (DRY) {
  console.log('[dry] Would run:', mapping.command);
  process.exit(0);
}

// Execute the command in a shell and capture exit status
const parts = mapping.command;
const res = spawnSync(parts, { stdio: 'inherit', shell: true, encoding: 'utf8' });

const resultEntry = {
  id: `action-run-${Date.now()}`,
  agent: AGENT,
  timestamp: new Date().toISOString(),
  action: 'action-run',
  command: mapping.command,
  status: res.status === 0 ? 'success' : 'failed',
  details: res.error ? String(res.error) : `Exit code: ${res.status}`,
  artifacts: []
};

// append via appendScript if present
if (fs.existsSync(appendScript)) {
  try {
    const spawnSyncLocal = require('child_process').spawnSync;
    const args = [appendScript, `--agent=${AGENT}`, `--action=${resultEntry.action}`, `--status=${resultEntry.status}`, `--details=${resultEntry.details}`, `--artifacts=${resultEntry.artifacts.join(',')}`];
    spawnSyncLocal('node', args, { stdio: 'inherit', shell: true });
  } catch (e) {
    console.warn('Failed to append via ai_agent_log_append.js:', e.message || e);
    // fallback: write directly to log
    logArr.push(resultEntry);
    fs.writeFileSync(logPath, JSON.stringify(logArr, null, 2), 'utf8');
  }
} else {
  logArr.push(resultEntry);
  fs.writeFileSync(logPath, JSON.stringify(logArr, null, 2), 'utf8');
}

// Mark the suggestion as closed with a link to the action-run entry
logArr = JSON.parse(fs.readFileSync(logPath, 'utf8'));
if (logArr[openIdx] && logArr[openIdx].action === 'suggest-next') {
  logArr[openIdx].status = 'closed';
  logArr[openIdx].closed_by = resultEntry.id;
  fs.writeFileSync(logPath, JSON.stringify(logArr, null, 2), 'utf8');
}

console.log('Action run logged as', resultEntry.id);
process.exit(res.status || 0);
