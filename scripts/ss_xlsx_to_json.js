#!/usr/bin/env node
/*
  ss_xlsx_to_json.js
  Convert a System Surveyor XLSX export into a normalized JSON structure that matches the lib/system-surveyor-api.ts expected survey format.

  Usage (PowerShell):
    node .\scripts\ss_xlsx_to_json.js "C:\Users\dkozi\Downloads\survey-element-1176427 (1).xlsx" .\tmp\survey.json

  Dependencies: xlsx
    npm install xlsx minimist

  The converter uses heuristics: if the spreadsheet contains rows that look like elements with accessory columns, it groups accessories by element id.
*/

const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');

function usage() {
  console.log('Usage: node ss_xlsx_to_json.js <input.xlsx> <output.json>');
}

function inferColumns(headerRow) {
  const cols = {};
  headerRow.forEach((h, idx) => {
    if (!h) return;
    const key = String(h).trim().toLowerCase();
    cols[key] = idx;
  });
  return cols;
}

function normalize(rows, headers) {
  // Simple heuristics to turn rows into 'elements' with accessories
  const elements = [];
  const byElement = {};

  rows.forEach(r => {
    const elementId = r['element id'] || r['element_id'] || r['elementid'] || r['id'] || r['element'] || r['element_id#'] || r['element id#'];
    const name = r['name'] || r['element name'] || r['element_name'] || r['elementname'] || r['element label'] || r['label'];

    const accessoryManufacturer = r['accessory manufacturer'] || r['manufacturer'] || r['acc_manufacturer'];
    const accessoryModel = r['accessory model'] || r['model'] || r['acc_model'];
    const accessoryDescription = r['accessory description'] || r['description'] || r['acc_description'];
    const accessoryQty = Number(r['accessory quantity'] || r['qty'] || r['quantity'] || r['acc_qty'] || 1) || 1;
    const accessoryPrice = Number(r['accessory price'] || r['price'] || r['acc_price'] || 0) || null;
    const accessoryLabor = Number(r['accessory labor_hours'] || r['labor_hours'] || r['acc_labor'] || 0) || null;

    const key = elementId || name || JSON.stringify(r);
    if (!byElement[key]) {
      byElement[key] = {
        id: elementId || `el-${Object.keys(byElement).length+1}`,
        name: name || `Element ${Object.keys(byElement).length+1}`,
        element_id: Number(elementId) || null,
        element_profile_id: null,
        systemtype_id: null,
        position: { x: null, y: null },
        photo_urls: [],
        accessories: [],
        attributes: []
      };
    }

    // If row contains accessory info, add
    if (accessoryManufacturer || accessoryModel || accessoryDescription) {
      byElement[key].accessories.push({
        id: `acc-${byElement[key].accessories.length+1}`,
        manufacturer: accessoryManufacturer || '',
        model: accessoryModel || '',
        description: accessoryDescription || '',
        quantity: accessoryQty,
        price: accessoryPrice,
        labor_hours: accessoryLabor,
        row_index: byElement[key].accessories.length
      });
    }

    // collect attributes by scanning for known prefixed columns
    Object.keys(r).forEach(col => {
      if (col.startsWith('attr:') || col.startsWith('attribute:')) {
        byElement[key].attributes.push({ id: col, name: col.replace(/^(attr:|attribute:)/, ''), value: r[col] });
      }
    });
  });

  return Object.values(byElement);
}

function readSheet(filePath) {
  const wb = xlsx.readFile(filePath, { cellDates: true });
  const first = wb.SheetNames[0];
  const sheet = wb.Sheets[first];
  const json = xlsx.utils.sheet_to_json(sheet, { defval: null });
  return json;
}

function buildSurveyObject(rows, filePath) {
  const elements = normalize(rows);
  const survey = {
    id: path.basename(filePath, path.extname(filePath)),
    title: `Imported ${path.basename(filePath)}`,
    label: null,
    site: 'unknown',
    elements,
    status: 'open',
    created_at: Math.floor(Date.now() / 1000),
    modified_at: Math.floor(Date.now() / 1000),
    preview_image: null
  };
  return survey;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    usage();
    process.exit(1);
  }
  const [inFile, outFile] = args;
  if (!fs.existsSync(inFile)) { console.error('Input file not found:', inFile); process.exit(1); }

  const rows = readSheet(inFile);
  const survey = buildSurveyObject(rows, inFile);
  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(survey, null, 2), 'utf8');
  console.log('Wrote normalized survey to', outFile);
}

main().catch(err => { console.error(err); process.exit(1); });
