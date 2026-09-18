/**
 * Source extraction: official workbooks -> versioned JSON under data/source/.
 *
 * Governance contract (00_CLAUDE_MASTER_CODING_HANDOFF_COMMAND_v1.0.md):
 *   - Never change, delete, merge, rename or reinterpret source IDs.
 *   - Preserve evidence, status, version, provenance and localization fields.
 *   - Never promote Draft/Review data to Approved.
 *
 * This script therefore copies every cell verbatim. It performs no normalisation,
 * no de-duplication, no status inference and no repair of dangling references.
 * Integrity problems are *reported* (see src/governance/integrity.ts), never fixed here.
 *
 * Usage:
 *   node scripts/extract-sources.mjs            # (re)generate data/source/*.json
 *   node scripts/extract-sources.mjs --verify   # fail if generated output is stale
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readWorkbook, rowsToObjects } from './xlsx-reader.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'data', 'source');

const MASTER_DB = 'KOREA_GLOW_Beauty_Knowledge_Master_Database_v1.0.xlsx';
const RECONCILIATION = '01_STRAND_FORENSIC_RECONCILIATION_WORKING_v1.0.xlsx';

/** Sheet -> output file. Sheet names are part of the source contract and are not renamed. */
const MASTER_DB_SHEETS = {
  '01_DOMAINS': 'domains',
  '02_STRANDS': 'strands',
  '03_KNOWLEDGE_NODES': 'knowledge-nodes',
  '04_SKILLS': 'skills',
  '05_NODE_SKILL_MAP': 'node-skill-map',
  '06_INGREDIENTS': 'ingredients',
  '07_CONCERNS': 'concerns',
  '08_PRODUCT_CATEGORIES': 'product-categories',
  '09_ROUTINES': 'routines',
  '10_NODE_ROUTINE_MAP': 'node-routine-map',
  '11_QUESTS': 'quests',
  '12_QUEST_NODE_MAP': 'quest-node-map',
  '13_AI_RULES': 'ai-rules',
  '14_EVIDENCE': 'evidence-sources',
  '15_LOCALIZATION': 'localization',
  '16_PRODUCTS': 'products',
  '17_PRODUCT_RELATIONS': 'product-relations',
  '18_RELATIONS': 'relations',
  '19_MASTERY_RULES': 'mastery-rules',
  '20_ENUMS': 'enums',
  '21_CONTENT_ATOMS': 'content-atoms',
  '22_SCHEMA_DICTIONARY': 'schema-dictionary',
};

const RECONCILIATION_SHEETS = {
  DB_92_VS_CURRICULUM: 'reconciliation-db-vs-curriculum',
  CURRICULUM_35_CODED: 'reconciliation-curriculum-coded',
  UNCODED_CURRICULUM_GROUPINGS: 'reconciliation-uncoded-groupings',
};

const sha256 = (path) => createHash('sha256').update(readFileSync(path)).digest('hex');

/** Drop rows that are entirely blank; a blank row carries no record and no ID. */
const withoutBlankRows = (records) =>
  records.filter((record) => Object.values(record).some((value) => value !== ''));

function extract() {
  const files = [];
  const outputs = new Map();

  const emit = (name, records, meta) => {
    outputs.set(`${name}.json`, {
      $schema_note:
        'Verbatim extraction of an official KOREA GLOW source. Field names and values are unmodified. Do not edit by hand; regenerate with `npm run extract:sources`.',
      ...meta,
      recordCount: records.length,
      records,
    });
  };

  for (const [sourceFile, sheetMap] of [
    [MASTER_DB, MASTER_DB_SHEETS],
    [RECONCILIATION, RECONCILIATION_SHEETS],
  ]) {
    const path = join(ROOT, 'sources', sourceFile);
    const digest = sha256(path);
    files.push({ file: sourceFile, sha256: digest });
    const workbook = readWorkbook(path);

    for (const [sheet, outName] of Object.entries(sheetMap)) {
      const rows = workbook[sheet];
      if (!rows) throw new Error(`Sheet "${sheet}" missing from ${sourceFile}`);
      const records = withoutBlankRows(rowsToObjects(rows));
      emit(outName, records, { sourceFile, sourceSheet: sheet, sourceSha256: digest });
    }
  }

  outputs.set('_manifest.json', {
    $schema_note: 'Provenance manifest for data/source/. Regenerate with `npm run extract:sources`.',
    generatedBy: 'scripts/extract-sources.mjs',
    extractionPolicy: 'verbatim: no ID changes, no status promotion, no reference repair',
    sourceFiles: files,
    datasets: [...outputs.keys()].sort().map((file) => ({
      file,
      sourceFile: outputs.get(file).sourceFile,
      sourceSheet: outputs.get(file).sourceSheet,
      recordCount: outputs.get(file).recordCount,
    })),
  });

  return outputs;
}

const serialise = (value) => `${JSON.stringify(value, null, 2)}\n`;

const outputs = extract();
const verifyOnly = process.argv.includes('--verify');
mkdirSync(OUT_DIR, { recursive: true });

let stale = 0;
for (const [file, value] of outputs) {
  const path = join(OUT_DIR, file);
  const next = serialise(value);
  if (verifyOnly) {
    let current = null;
    try {
      current = readFileSync(path, 'utf8');
    } catch {
      /* missing file counts as stale */
    }
    if (current !== next) {
      stale += 1;
      console.error(`STALE: data/source/${file} does not match the official source`);
    }
  } else {
    writeFileSync(path, next);
  }
}

if (verifyOnly) {
  if (stale > 0) {
    console.error(`\n${stale} extracted dataset(s) are out of date. Run: npm run extract:sources`);
    process.exit(1);
  }
  console.log(`OK: ${outputs.size - 1} datasets match the official sources.`);
} else {
  const total = [...outputs.values()].reduce((sum, v) => sum + (v.recordCount ?? 0), 0);
  console.log(`Extracted ${outputs.size - 1} datasets (${total} records) into data/source/.`);
}
