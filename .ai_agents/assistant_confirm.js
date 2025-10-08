#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const QUEUE = path.join(__dirname, 'command_queue.json');
const LOG = path.join(__dirname, 'agent_log.json');
const COMPLETED = path.join(__dirname, 'shared', 'completed');
const ARCHIVE = path.join(__dirname, 'shared', 'archive');

if (!fs.existsSync(COMPLETED)) fs.mkdirSync(COMPLETED, { recursive: true });
if (!fs.existsSync(ARCHIVE)) fs.mkdirSync(ARCHIVE, { recursive: true });

function readJson(file) { try { return JSON.parse(fs.readFileSync(file,'utf8')); } catch(e){return []; } }
function writeJson(file, obj) { fs.writeFileSync(file, JSON.stringify(obj, null, 2)); }

const approveNext = !!argv['approve-next'];

const queue = readJson(QUEUE);
const logs = readJson(LOG);

const files = fs.readdirSync(COMPLETED).filter(f => f.includes('-complete'));
for (const fn of files) {
  const full = path.join(COMPLETED, fn);
  // try to extract request id from filename (req_* or similar)
  const m = fn.match(/(req_[^\-]+)/);
  const reqId = m ? m[1] : null;
  logs.push({ id: `assistant-confirm-${Date.now()}-${fn}`, agent: 'Assistant', timestamp: new Date().toISOString(), action: 'confirm_completion', file: `shared/completed/${fn}`, itemId: reqId });
  // move to archive
  const dest = path.join(ARCHIVE, fn);
  fs.renameSync(full, dest);
  console.log('Archived', fn);
}

if (approveNext) {
  // Find first pending low-risk item and mark approved
  const idx = queue.findIndex(q => (q.status === 'pending' || q.status === 'pending:requires_approval') && (q.risk === 'low' || q.auto === true));
  if (idx !== -1) {
    queue[idx].status = 'approved';
    logs.push({ id: `assistant-approve-${Date.now()}`, agent: 'Assistant', timestamp: new Date().toISOString(), action: 'approve_next', itemId: queue[idx].id });
    console.log('Approved next low-risk item:', queue[idx].id);
  } else {
    console.log('No low-risk pending items to approve');
  }
}

writeJson(LOG, logs);
writeJson(QUEUE, queue);

console.log('Done.');
