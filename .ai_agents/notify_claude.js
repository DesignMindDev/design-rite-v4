#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const QUEUE = path.join(__dirname, 'command_queue.json');
const LOG = path.join(__dirname, 'agent_log.json');
const TO_REVIEW = path.join(__dirname, 'shared', 'to_review');

if (!fs.existsSync(TO_REVIEW)) fs.mkdirSync(TO_REVIEW, { recursive: true });

function readJson(file) { try { return JSON.parse(fs.readFileSync(file,'utf8')); } catch(e){return []; } }
function writeJson(file, obj) { fs.writeFileSync(file, JSON.stringify(obj, null, 2)); }

const queue = readJson(QUEUE);
const pending = queue.filter(q => q.status === 'pending' || q.status === 'pending:requires_approval');

for (const item of pending) {
  const filename = `${item.id}.json`;
  const target = path.join(TO_REVIEW, filename);
  if (fs.existsSync(target)) continue; // don't duplicate
  fs.writeFileSync(target, JSON.stringify(item, null, 2), 'utf8');
  // log the notification
  const logs = readJson(LOG);
  logs.push({ id: `notify-${Date.now()}`, agent: 'Copilot', timestamp: new Date().toISOString(), action: 'notify_claude', itemId: item.id, file: `shared/to_review/${filename}` });
  writeJson(LOG, logs);
  console.log('Notified Claude for', item.id);
}

console.log('Done. Notified', pending.length, 'items.');
