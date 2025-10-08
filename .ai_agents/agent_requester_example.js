#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

const QUEUE = path.join(__dirname, 'command_queue.json');
const id = argv.id || `req_${Date.now()}`;
const agent = argv.agent || 'OpenAI';
const action = argv.action || 'run-tests';
const risk = argv.risk || 'low';

function readJson(file) { try { return JSON.parse(fs.readFileSync(file,'utf8')); } catch(e){return null;} }
function writeJson(file, obj) { fs.writeFileSync(file, JSON.stringify(obj, null, 2)); }

const queue = readJson(QUEUE) || [];
queue.push({ id, agent, action, risk, status: 'pending', createdAt: new Date().toISOString() });
writeJson(QUEUE, queue);
console.log(`Enqueued ${action} as ${id} by ${agent} (risk=${risk})`);
