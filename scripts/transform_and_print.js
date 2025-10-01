#!/usr/bin/env node
/*
  transform_and_print.js
  Reads a normalized System Surveyor survey JSON (from ss_xlsx_to_json.js output) and runs a transform that mirrors lib/system-surveyor-api.ts::transformToAssessmentData.

  Usage (PowerShell):
    node .\scripts\transform_and_print.js .\tmp\survey.json .\tmp\designrite_assessment.json --agent=Claude

  It will also attempt to append a log entry using scripts/ai_agent_log_append.js if present.
*/

const fs = require('fs');
const path = require('path');
const argv = require('minimist')(process.argv.slice(2));

function usage() {
  console.log('Usage: node transform_and_print.js <inputSurvey.json> <outDesignRite.json> [--agent=name]');
}

const inFile = argv._[0] || '.\tmp\survey.json';
const outFile = argv._[1] || '.\tmp\designrite_assessment.json';
const agentName = argv.agent || argv.a || 'unknown-agent';

if (!fs.existsSync(inFile)) {
  console.error('Input file not found:', inFile);
  usage();
  process.exit(1);
}

const raw = fs.readFileSync(inFile, 'utf8');
let survey;
try { survey = JSON.parse(raw); } catch(e) { console.error('Invalid JSON in input file'); process.exit(1); }

// Transform logic (mirrors lib/system-surveyor-api.ts)
function transformToAssessmentData(survey, site) {
  const equipmentCounts = {};
  const accessories = [];
  let totalLaborHours = 0;

  (survey.elements || []).forEach(element => {
    const name = element.name || element.element_name || 'Other';
    const typeName = String(name).split('-')[0] || 'Other';
    equipmentCounts[typeName] = (equipmentCounts[typeName] || 0) + 1;

    (element.accessories || []).forEach(acc => {
      const normalized = {
        id: acc.id || `acc-${Math.random().toString(36).slice(2,8)}`,
        manufacturer: acc.manufacturer || '',
        model: acc.model || '',
        description: acc.description || '',
        quantity: acc.quantity || 1,
        price: (acc.price === null || typeof acc.price === 'undefined') ? null : Number(acc.price),
        labor_hours: acc.labor_hours || 0,
        row_index: typeof acc.row_index === 'number' ? acc.row_index : accessories.length
      };
      accessories.push(normalized);
      totalLaborHours += normalized.labor_hours || 0;
    });
  });

  const totalValue = accessories.reduce((sum, acc) => sum + ((acc.price || 0) * (acc.quantity || 1)), 0);

  const location = (site && ((site.city || '') + (site.state ? ', ' + site.state : '') + (site.zip_code ? ' ' + site.zip_code : ''))) || 'Location not specified';

  return {
    projectName: survey.title || survey.id || 'Imported Survey',
    siteName: (site && site.name) || survey.site || 'Unknown Site',
    location: location || 'Location not specified',
    elementCount: (survey.elements || []).length,
    equipmentCounts,
    accessories,
    totalValue,
    totalLaborHours,
    surveyDate: new Date((survey.modified_at || Math.floor(Date.now()/1000)) * 1000).toISOString(),
    surveyId: survey.id || null,
    siteId: site && site.id ? site.id : (site && site.siteId) || null
  };
}

// If survey contains top-level site info, use it; otherwise create a placeholder
const site = survey.site && typeof survey.site === 'object' ? survey.site : { id: survey.site || 'site-unknown', name: survey.site || 'Imported Site', city: survey.city || null, state: survey.state || null, zip_code: survey.zip_code || null };

const result = transformToAssessmentData(survey, site);
fs.mkdirSync(path.dirname(outFile), { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(result, null, 2), 'utf8');
console.log('Wrote transformed DesignRite assessment to', outFile);

// Attempt to append an AI agent log entry
const logScript = path.join(process.cwd(), 'scripts', 'ai_agent_log_append.js');
if (fs.existsSync(logScript)) {
  try {
    const spawn = require('child_process').spawnSync;
    const details = `Transformed ${inFile} -> ${outFile}`;
    const cmdArgs = ['--agent=' + agentName, '--action=transform-survey', '--status=success', '--details=' + details, '--artifacts=' + outFile];
    const child = spawn('node', [logScript, ...cmdArgs], { stdio: 'inherit' });
    if (child.status !== 0) console.warn('Log append script exited with status', child.status);
  } catch (err) {
    console.warn('Failed to run log append:', err.message || err);
  }
} else {
  console.log('Log append script not found; skipping log entry.');
}
