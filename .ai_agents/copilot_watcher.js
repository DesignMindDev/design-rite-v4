#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const ACTION_MAP = path.join(__dirname, 'action_map.json');
const QUEUE = path.join(__dirname, 'command_queue.json');
const LOG = path.join(__dirname, 'agent_log.json');

const argv = require('minimist')(process.argv.slice(2));
const ONCE = argv.once || argv['--once'] || false;

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    return null;
  }
}

function writeJson(file, obj) {
  fs.writeFileSync(file, JSON.stringify(obj, null, 2));
}

function appendLog(entry) {
  const logs = readJson(LOG) || [];
  logs.push(entry);
  writeJson(LOG, logs);
}

// Whitelist low-risk actions that can be auto-executed
const AUTO_WHITELIST = new Set(['run-tests', 'run-next-area:import', 'run-load-test', 'no-jest-results-produced', 'auth-audit']);

async function processOnce() {
  const actionMap = readJson(ACTION_MAP) || {};
  const queue = readJson(QUEUE) || [];

  if (!queue.length) {
    console.log('[Copilot] No queued items. Exiting.');
    return;
  }

  // Process items in FIFO order
  for (const item of queue) {
    // Validate shape
    if (!item || !item.id || !item.agent || !item.action) {
      appendLog({ timestamp: new Date().toISOString(), agent: 'Copilot', action: 'validate-queue', result: 'invalid-entry', entry: item });
      continue;
    }

    if (item.status && item.status !== 'pending') continue; // already processed

    const mapped = actionMap[item.action];
    if (!mapped) {
      appendLog({ timestamp: new Date().toISOString(), agent: 'Copilot', action: item.action, result: 'unknown-action' });
      continue;
    }

    const canAuto = AUTO_WHITELIST.has(item.action) || item.risk === 'low' || item.auto === true;

    if (!canAuto) {
      // leave for Claude approval
      item.status = 'pending:requires_approval';
      appendLog({ timestamp: new Date().toISOString(), agent: 'Copilot', action: item.action, result: 'requires_approval', itemId: item.id });
      continue;
    }

    // Mark executing and write queue back atomically
    item.status = 'executing';
    writeJson(QUEUE, queue);

    appendLog({ timestamp: new Date().toISOString(), agent: 'Copilot', action: item.action, result: 'starting', itemId: item.id });

    // Execute the command safely using spawn (shell false)
    const cmdParts = mapped.command.split(' ');
    const cmd = cmdParts.shift();
    const proc = spawn(cmd, cmdParts, { cwd: ROOT, shell: false, stdio: ['ignore', 'pipe', 'pipe'] });

    let stdout = '';
    let stderr = '';

    proc.stdout.on('data', (d) => { stdout += d.toString(); process.stdout.write(d); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); process.stderr.write(d); });

    const exit = await new Promise((resolve) => proc.on('close', (code) => resolve(code)));

    item.status = exit === 0 ? 'done' : 'failed';
    item.completedAt = new Date().toISOString();
    writeJson(QUEUE, queue);

    appendLog({
      timestamp: new Date().toISOString(),
      agent: 'Copilot',
      action: item.action,
      result: exit === 0 ? 'success' : 'failure',
      exitCode: exit,
      stdout: stdout.slice(0, 32_000),
      stderr: stderr.slice(0, 32_000),
      itemId: item.id,
    });
  }
}

async function main() {
  // ensure files exist
  if (!fs.existsSync(LOG)) writeJson(LOG, []);
  if (!fs.existsSync(QUEUE)) writeJson(QUEUE, []);
  if (!fs.existsSync(ACTION_MAP)) {
    console.error('[Copilot] Missing action_map.json in .ai_agents. Aborting.');
    process.exit(1);
  }

  await processOnce();

  if (!ONCE) {
    console.log('[Copilot] Watching for new queue entries (poll every 3s). Press Ctrl+C to stop.');
    setInterval(async () => {
      await processOnce();
    }, 3000);
  } else {
    console.log('[Copilot] --once finished.');
  }
}

main().catch((err) => {
  console.error('[Copilot] Fatal error', err);
  appendLog({ timestamp: new Date().toISOString(), agent: 'Copilot', action: 'fatal', result: 'error', error: String(err) });
  process.exit(1);
});
