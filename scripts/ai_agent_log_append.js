#!/usr/bin/env node
/*
  ai_agent_log_append.js
  Append a structured log entry to .ai_agents/agent_log.json. Usage:
    node .\scripts\ai_agent_log_append.js --agent=Claude --action=run-load-test --status=success --details="..." --artifacts=./tmp/survey.json,./tmp/result.json
*/

const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const LOG_DIR = path.join(process.cwd(), '.ai_agents');
const LOG_FILE = path.join(LOG_DIR, 'agent_log.json');

function ensureLog() {
  if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });
  if (!fs.existsSync(LOG_FILE)) fs.writeFileSync(LOG_FILE, '[]', 'utf8');
}

function append(entry) {
  ensureLog();
  const raw = fs.readFileSync(LOG_FILE, 'utf8');
  let arr = [];
  try { arr = JSON.parse(raw); } catch(e) { arr = []; }
  arr.push(entry);
  fs.writeFileSync(LOG_FILE, JSON.stringify(arr, null, 2), 'utf8');
}

const entry = {
  id: `log-${Date.now()}-${Math.floor(Math.random()*1000)}`,
  agent: argv.agent || argv.a || 'unknown',
  timestamp: new Date().toISOString(),
  action: argv.action || argv.act || 'action',
  command: argv.command || null,
  status: argv.status || 'unknown',
  details: argv.details || '',
  artifacts: argv.artifacts ? String(argv.artifacts).split(',').map(s => s.trim()) : []
};

append(entry);
console.log('Appended log entry:', entry.id);
