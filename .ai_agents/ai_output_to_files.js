#!/usr/bin/env node
/*
  ai_output_to_files.js
  Parse agent chat output containing blocks like:

  --- FILE: .ai_agents/FILENAME.md ---
  <contents>
  --- END FILE ---

  and write each file to disk. By default it will NOT overwrite existing files
  unless --force is passed. It accepts input from a file path or stdin.
*/

const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const inputPath = argv._[0] || null;
const FORCE = !!argv.force || !!argv.f;

function readInput() {
  if (inputPath) return fs.readFileSync(inputPath, 'utf8');
  return fs.readFileSync(0, 'utf8'); // stdin
}

function parseBlocks(text) {
  const blocks = [];
  const fileRe = /^--- FILE:\s*(.+?)\s*---$/m;
  const endRe = /^--- END FILE ---$/m;

  const lines = text.split(/\r?\n/);
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const m = line.match(/^--- FILE:\s*(.+?)\s*---$/);
    if (m) {
      const filePath = m[1].trim();
      i++;
      const contentLines = [];
      while (i < lines.length && !lines[i].match(/^--- END FILE ---$/)) {
        contentLines.push(lines[i]);
        i++;
      }
      // skip END FILE if present
      if (i < lines.length && lines[i].match(/^--- END FILE ---$/)) i++;
      blocks.push({ filePath, content: contentLines.join('\n') });
    } else {
      i++;
    }
  }
  return blocks;
}

function ensureDirForFile(fp) {
  const dir = path.dirname(fp);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function writeBlock(root, block) {
  const target = path.resolve(root, block.filePath);
  // Safety: Do not allow writing outside repo root (basic check)
  if (!target.startsWith(path.resolve(root))) {
    throw new Error(`Refusing to write outside root: ${block.filePath}`);
  }

  if (fs.existsSync(target) && !FORCE) {
    return { status: 'skipped', reason: 'exists', path: target };
  }

  ensureDirForFile(target);
  fs.writeFileSync(target, block.content, 'utf8');
  return { status: 'written', path: target };
}

function main() {
  try {
    const root = path.resolve(process.cwd());
    const text = readInput();
    const blocks = parseBlocks(text);
    if (!blocks.length) {
      console.error('No file blocks found in input. Expected --- FILE: <path> --- ... --- END FILE ---');
      process.exit(1);
    }

    const results = [];
    for (const b of blocks) {
      try {
        const res = writeBlock(root, b);
        results.push({ file: b.filePath, ...res });
        console.log(`${res.status.toUpperCase()}: ${res.path}`);
      } catch (err) {
        console.error('ERROR writing', b.filePath, err.message);
        results.push({ file: b.filePath, status: 'error', error: String(err) });
      }
    }

    // Summary
    const written = results.filter(r => r.status === 'written').length;
    const skipped = results.filter(r => r.status === 'skipped').length;
    const errors = results.filter(r => r.status === 'error').length;
    console.log(`Done. written=${written} skipped=${skipped} errors=${errors}`);
    process.exit(errors ? 2 : 0);
  } catch (err) {
    console.error('Fatal:', err.message);
    process.exit(3);
  }
}

main();
