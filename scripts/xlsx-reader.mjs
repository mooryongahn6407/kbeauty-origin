/**
 * Minimal, dependency-free OOXML (.xlsx) reader.
 *
 * This reader is deliberately READ-ONLY. It never writes back to a workbook.
 * Values are returned verbatim as strings so that source IDs, status values and
 * version strings survive extraction without normalisation, coercion or trimming
 * of meaningful characters.
 */
import { readFileSync } from 'node:fs';
import { inflateRawSync } from 'node:zlib';

const EOCD_SIG = 0x06054b50;
const CEN_SIG = 0x02014b50;

/** Parse the zip central directory and return a Map of entry name -> raw bytes. */
function readZip(buffer) {
  let eocd = -1;
  for (let i = buffer.length - 22; i >= 0; i--) {
    if (buffer.readUInt32LE(i) === EOCD_SIG) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('Not a zip archive: end-of-central-directory not found');

  const entryCount = buffer.readUInt16LE(eocd + 10);
  let p = buffer.readUInt32LE(eocd + 16);
  const entries = new Map();

  for (let n = 0; n < entryCount; n++) {
    if (buffer.readUInt32LE(p) !== CEN_SIG) throw new Error('Corrupt central directory');
    const method = buffer.readUInt16LE(p + 10);
    const compressedSize = buffer.readUInt32LE(p + 20);
    const nameLen = buffer.readUInt16LE(p + 28);
    const extraLen = buffer.readUInt16LE(p + 30);
    const commentLen = buffer.readUInt16LE(p + 32);
    const localOffset = buffer.readUInt32LE(p + 42);
    const name = buffer.toString('utf8', p + 46, p + 46 + nameLen);

    // Re-read the local header, whose extra field length may differ from the central one.
    const localNameLen = buffer.readUInt16LE(localOffset + 26);
    const localExtraLen = buffer.readUInt16LE(localOffset + 28);
    const dataStart = localOffset + 30 + localNameLen + localExtraLen;
    const raw = buffer.subarray(dataStart, dataStart + compressedSize);

    entries.set(name, method === 0 ? raw : inflateRawSync(raw));
    p += 46 + nameLen + extraLen + commentLen;
  }
  return entries;
}

const XML_ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };

function decodeXml(text) {
  return text.replace(/&(#x?[0-9a-fA-F]+|[a-z]+);/g, (match, code) => {
    if (code[0] === '#') {
      const value = code[1] === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(value) ? String.fromCodePoint(value) : match;
    }
    return XML_ENTITIES[code] ?? match;
  });
}

/** Concatenate every <t> run inside an XML fragment, which is how OOXML stores rich text. */
function textRuns(fragment) {
  const out = [];
  const re = /<(?:[a-zA-Z0-9]+:)?t(?:\s[^>]*)?(?:\/>|>([\s\S]*?)<\/(?:[a-zA-Z0-9]+:)?t>)/g;
  let m;
  while ((m = re.exec(fragment)) !== null) out.push(decodeXml(m[1] ?? ''));
  return out.join('');
}

/** Convert an A1-style cell reference to a zero-based column index. */
function columnIndex(ref) {
  const letters = /^([A-Z]+)/.exec(ref);
  if (!letters) return 0;
  let index = 0;
  for (const ch of letters[1]) index = index * 26 + (ch.charCodeAt(0) - 64);
  return index - 1;
}

/**
 * Read a workbook into `{ sheetName: string[][] }`.
 * Blank cells become empty strings and rows are padded to the widest row so that
 * downstream header/row zipping stays positional.
 */
export function readWorkbook(filePath) {
  const entries = readZip(readFileSync(filePath));
  const read = (name) => {
    const bytes = entries.get(name);
    return bytes ? bytes.toString('utf8') : null;
  };

  const sharedStrings = [];
  const sharedXml = read('xl/sharedStrings.xml');
  if (sharedXml) {
    const re = /<(?:[A-Za-z0-9]+:)?si(?:\s[^>]*)?>([\s\S]*?)<\/(?:[A-Za-z0-9]+:)?si>/g;
    let m;
    while ((m = re.exec(sharedXml)) !== null) sharedStrings.push(textRuns(m[1]));
  }

  const relsXml = read('xl/_rels/workbook.xml.rels') ?? '';
  const relTargets = new Map();
  for (const m of relsXml.matchAll(/<(?:[A-Za-z0-9]+:)?Relationship\b[^>]*?\/>/g)) {
    const id = /\bId="([^"]+)"/.exec(m[0])?.[1];
    const target = /\bTarget="([^"]+)"/.exec(m[0])?.[1];
    if (id && target) relTargets.set(id, target);
  }

  const workbookXml = read('xl/workbook.xml') ?? '';
  const sheets = {};

  for (const m of workbookXml.matchAll(/<(?:[A-Za-z0-9]+:)?sheet\b[^>]*?\/>/g)) {
    const name = decodeXml(/\bname="([^"]*)"/.exec(m[0])?.[1] ?? '');
    // Matches the namespaced relationship attribute (r:id) without also matching sheetId.
    const rid = /[\s:]id="([^"]+)"/i.exec(m[0])?.[1];
    let target = relTargets.get(rid) ?? '';
    target = target.replace(/^\//, '');
    if (!entries.has(target)) target = `xl/${target.replace(/^xl\//, '')}`;
    const sheetXml = read(target);
    if (sheetXml === null) throw new Error(`Worksheet part not found for sheet "${name}"`);

    const rows = [];
    let width = 0;
    for (const rowMatch of sheetXml.matchAll(/<(?:[A-Za-z0-9]+:)?row\b[^>]*?>([\s\S]*?)<\/(?:[A-Za-z0-9]+:)?row>/g)) {
      const cells = [];
      for (const cellMatch of rowMatch[1].matchAll(/<(?:[A-Za-z0-9]+:)?c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/(?:[A-Za-z0-9]+:)?c>)/g)) {
        const attrs = cellMatch[1];
        const body = cellMatch[2] ?? '';
        const ref = /\br="([A-Z]+\d+)"/.exec(attrs)?.[1];
        const type = /\bt="([^"]+)"/.exec(attrs)?.[1];
        const at = ref ? columnIndex(ref) : cells.length;

        let value = '';
        if (type === 's') {
          const idx = Number(/<(?:[A-Za-z0-9]+:)?v(?:\s[^>]*)?>([\s\S]*?)<\/(?:[A-Za-z0-9]+:)?v>/.exec(body)?.[1]);
          value = sharedStrings[idx] ?? '';
        } else if (type === 'inlineStr') {
          value = textRuns(body);
        } else {
          value = decodeXml(/<(?:[A-Za-z0-9]+:)?v(?:\s[^>]*)?>([\s\S]*?)<\/(?:[A-Za-z0-9]+:)?v>/.exec(body)?.[1] ?? '');
        }

        while (cells.length < at) cells.push('');
        cells[at] = value;
      }
      width = Math.max(width, cells.length);
      rows.push(cells);
    }
    for (const row of rows) while (row.length < width) row.push('');
    sheets[name] = rows;
  }

  return sheets;
}

/** Zip a header row with the data rows below it into plain objects. */
export function rowsToObjects(rows, { headerRow = 0 } = {}) {
  if (rows.length <= headerRow) return [];
  const header = rows[headerRow].map((h) => h.trim());
  return rows.slice(headerRow + 1).map((row) => {
    const record = {};
    header.forEach((key, i) => {
      if (key) record[key] = row[i] ?? '';
    });
    return record;
  });
}
