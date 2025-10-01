#!/usr/bin/env node
/*
  auto_fix_transform.js
  Conservative auto-fix proposer for failing tests that look related to the transform.
  It will not edit source. Instead it generates a human-readable proposal file under tmp/ and appends a log entry.

  Usage: node scripts/auto_fix_transform.js --agent=AutoFixer
*/

const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const AGENT = argv.agent || 'AutoFixer';
const logScript = path.join(process.cwd(), 'scripts', 'ai_agent_log_append.js');

const resultsPath = path.join(process.cwd(), 'tmp', 'jest_results.json');
if (!fs.existsSync(resultsPath)) {
  console.error('No jest results found at', resultsPath);
  process.exit(1);
}

const j = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
const failing = (j.testResults || []).flatMap(s => s.assertionResults || []).filter(a => a.status === 'failed');

if (failing.length === 0) {
  console.log('No failing tests detected; nothing to propose.');
  process.exit(0);
}

// Look for tests mentioning transform or system-surveyor mapper
const transformFailures = failing.filter(f => /transform|survey|system-surveyor|mapper|ss_xlsx|transform_lib/i.test(f.fullName || f.title || f.ancestorTitles.join(' ')));

const proposal = {
  id: `proposal-${Date.now()}`,
  agent: AGENT,
  timestamp: new Date().toISOString(),
  target: transformFailures.length ? 'transform_lib.js / lib/system-surveyor-api.ts' : 'unknown',
  summary: `${failing.length} failing tests; ${transformFailures.length} appear related to transform/mapper logic`,
  details: transformFailures.map(f => ({ title: f.fullName || f.title, failureMessages: f.failureMessages })).slice(0, 10),
  suggested_changes: []
};

if (transformFailures.length > 0) {
  // Propose safe, conservative suggestions based on common transform issues seen before
  proposal.suggested_changes.push({
    file: 'scripts/transform_lib.js',
    description: 'Add defensive handling for missing accessory.price and ensure quantity is numeric. Add clearer row_index assignment and preserve original order.',
    patch: [
      "// In transform loop, replace quantity handling with:\n",
      "quantity: Number.isFinite(Number(acc.quantity)) ? Number(acc.quantity) : 1,\n",
      "price: (acc.price === null || typeof acc.price === 'undefined') ? null : Number(acc.price),\n"
    ]
  });

  proposal.suggested_changes.push({
    file: 'lib/system-surveyor-api.ts',
    description: 'Normalize element names and trim whitespace before splitting by - to detect equipment types more reliably.',
    patch: [
      "// e.g. const typeName = String(name).trim().split('-')[0] || 'Other';\n"
    ]
  });
}

const outDir = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
const outFile = path.join(outDir, `${proposal.id}.json`);
fs.writeFileSync(outFile, JSON.stringify(proposal, null, 2), 'utf8');
console.log('Wrote proposal to', outFile);

// Append to agent log
if (fs.existsSync(logScript)) {
  try {
    const spawn = require('child_process').spawnSync;
    const details = `Proposal generated: ${outFile}`;
    const args = [logScript, `--agent=${AGENT}`, '--action=code_proposal', '--status=proposal_ready', `--details=${details}`, `--artifacts=${outFile}`];
    spawn('node', args, { stdio: 'inherit', shell: true });
  } catch (e) {
    console.warn('Failed to append proposal to log:', e.message || e);
  }
}

process.exit(0);
