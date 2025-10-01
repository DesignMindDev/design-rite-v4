#!/usr/bin/env node
/*
  agent_next_action.js
  Simple helper an AI agent can run to read the agent log and append a suggested next action.
  Usage: node .\scripts\agent_next_action.js --agent=Claude --suggestion="Run security tests for auth routes"
*/

const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const logPath = path.join(process.cwd(), '.ai_agents', 'agent_log.json');
if (!fs.existsSync(logPath)) {
  console.error('agent_log.json not found');
  process.exit(1);
}

const agent = argv.agent || 'unknown';
const suggestion = argv.suggestion || 'investigate failing tests and propose fixes';

const raw = fs.readFileSync(logPath, 'utf8');
let arr = [];
try { arr = JSON.parse(raw); } catch(e) { console.error('invalid JSON', e.message); process.exit(1); }

const entry = {
  id: `todo-${Date.now()}`,
  agent,
  timestamp: new Date().toISOString(),
  action: 'suggest-next',
  suggestion,
  status: 'open'
};
arr.push(entry);
fs.writeFileSync(logPath, JSON.stringify(arr, null, 2), 'utf8');
console.log('Appended next-action suggestion:', entry.id);
