#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const QUEUE = path.join(__dirname, 'command_queue.json');
const LOG = path.join(__dirname, 'agent_log.json');

function readJson(file) { try { return JSON.parse(fs.readFileSync(file,'utf8')); } catch(e){return []; } }
function writeJson(file, obj) { fs.writeFileSync(file, JSON.stringify(obj, null, 2)); }

const id = argv.id;
const file = argv.file;
const reviewer = argv.reviewer || 'Claude';

if (!id || !file) {
  console.error('Usage: node claude_complete.js --id=<requestId> --file=<path-to-artifact> [--reviewer=Name]');
  process.exit(2);
}

const queue = readJson(QUEUE);
const idx = queue.findIndex(q => q.id === id);
if (idx === -1) {
  console.error('Queue item not found:', id);
  process.exit(3);
}

queue[idx].status = 'completed';
queue[idx].completedAt = new Date().toISOString();
queue[idx].artifact = file;
queue[idx].reviewer = reviewer;

writeJson(QUEUE, queue);

const logs = readJson(LOG);
logs.push({ id: `claude-complete-${Date.now()}`, agent: reviewer, timestamp: new Date().toISOString(), action: 'claude_complete', itemId: id, artifact: file });
writeJson(LOG, logs);

console.log('Marked', id, 'completed. Artifact:', file);
