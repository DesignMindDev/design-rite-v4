#!/usr/bin/env node
/*
  system_surveyor_load_test.js
  Simple concurrent load test agent for the System Surveyor API integration endpoints

  Usage (PowerShell):
    node .\scripts\system_surveyor_load_test.js --baseUrl=http://localhost:3000 --token=MY_TOKEN --concurrency=5 --iterations=20

  The script will repeatedly call /api/system-surveyor/sites, then for each site call /api/system-surveyor/surveys?siteId=..., and attempt to POST /api/system-surveyor/import for a picked survey.
  It is intentionally conservative (no aggressive socket reuse) and uses a small pool. Adjust concurrency/iterations for stress.
*/

const DEFAULT_BASE = 'http://localhost:3000';

function parseArgs() {
  const args = require('minimist')(process.argv.slice(2));
  return {
    baseUrl: args.baseUrl || args.b || DEFAULT_BASE,
    token: args.token || args.t || '',
    concurrency: Number(args.concurrency || args.c || 5),
    iterations: Number(args.iterations || args.i || 20),
    delayMs: Number(args.delayMs || 100)
  };
}

async function httpGet(url, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(url, { headers });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch(e) { json = text; }
  return { ok: res.ok, status: res.status, body: json };
}

async function httpPost(url, token, body) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch(e) { json = text; }
  return { ok: res.ok, status: res.status, body: json };
}

async function worker(id, config, stats) {
  const { baseUrl, token, iterations, delayMs } = config;
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    try {
      // 1) get sites
      const sitesRes = await httpGet(`${baseUrl}/api/system-surveyor/sites`, token);
      if (!sitesRes.ok) {
        stats.fail++;
        console.log(`[W${id}] sites failed (${sitesRes.status})`);
        await sleep(delayMs);
        continue;
      }
      const sites = sitesRes.body.sites || sitesRes.body || [];

      // pick a site (or continue if none)
      const site = Array.isArray(sites) && sites.length ? sites[Math.floor(Math.random() * sites.length)] : null;
      if (!site) {
        stats.skipped++;
        console.log(`[W${id}] no sites found (iteration ${i})`);
        await sleep(delayMs);
        continue;
      }

      // 2) get surveys for site
      const surveysRes = await httpGet(`${baseUrl}/api/system-surveyor/surveys?siteId=${encodeURIComponent(site.id)}`, token);
      if (!surveysRes.ok) {
        stats.fail++;
        console.log(`[W${id}] surveys failed (${surveysRes.status}) for site ${site.id}`);
        await sleep(delayMs);
        continue;
      }
      const surveys = surveysRes.body.surveys || surveysRes.body || [];
      if (!Array.isArray(surveys) || surveys.length === 0) {
        stats.skipped++;
        console.log(`[W${id}] no surveys for site ${site.id}`);
        await sleep(delayMs);
        continue;
      }

      // pick a survey
      const survey = surveys[Math.floor(Math.random() * surveys.length)];

      // 3) import
      const importRes = await httpPost(`${baseUrl}/api/system-surveyor/import`, token, { surveyId: survey.id, site });
      if (!importRes.ok) {
        stats.fail++;
        console.log(`[W${id}] import failed (${importRes.status}) survey ${survey.id}`);
      } else {
        stats.success++;
        console.log(`[W${id}] import succeeded for survey ${survey.id} (${Date.now()-start}ms)`);
      }

    } catch (err) {
      stats.fail++;
      console.log(`[W${id}] exception:`, err.message || err);
    }
    await sleep(delayMs);
  }
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function run() {
  const args = parseArgs();
  if (!args.token) {
    console.log('Warning: no token provided. Endpoints requiring Authorization may reject requests. Use --token=XYZ');
  }
  console.log('Config:', args);

  const stats = { success: 0, fail: 0, skipped: 0 };
  const pool = [];
  const perWorker = Math.ceil(args.iterations / args.concurrency);
  for (let w = 0; w < args.concurrency; w++) {
    pool.push(worker(w+1, { ...args, iterations: perWorker }, stats));
  }

  await Promise.all(pool);
  console.log('Done. Stats:', stats);
}

// ensure fetch and needed deps
(async () => {
  try {
    // require minimist dynamically; if missing, instruct user
    try { require.resolve('minimist'); } catch(e) {
      console.error('Missing dependency "minimist". Run: npm install minimist');
      process.exit(1);
    }
    if (typeof fetch === 'undefined') {
      console.error('Node global fetch not found. Use Node 18+ or install a fetch polyfill.');
      process.exit(1);
    }
    await run();
  } catch (err) {
    console.error('Fatal:', err);
    process.exit(1);
  }
})();
