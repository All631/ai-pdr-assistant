/**
 * Downloads official Ukrainian road sign SVGs from Wikimedia Commons (DSTU 4100).
 * Usage: node scripts/download_dstu_signs.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  ASSET_OVERRIDES,
  assetFileName,
  buildWikiCandidates,
  codeToAssetId,
  extractSpeedKmh,
} from './signAssetConfig.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'src/data/trafficSignsCatalog.ts');
const OUT_DIR = path.join(ROOT, 'public/images/signs');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');

const USER_AGENT = 'ai-pdr-assistant/1.0 (educational; DSTU sign downloader; github.com/All631/ai-pdr-assistant)';
const REQUEST_DELAY_MS = 2000;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseCatalog(content) {
  const entries = [];
  const re =
    /\{\s*id:\s*'([^']+)',\s*code:\s*'([^']+)',\s*name:\s*(['"])((?:\\.|(?!\3).)*)\3[\s\S]*?category:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    entries.push({
      id: m[1],
      code: m[2],
      name: m[4].replace(/\\'/g, "'"),
      category: m[5],
    });
  }
  return entries;
}

function isValidSvgFile(filePath) {
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    return text.includes('<svg') || text.includes('<SVG');
  } catch {
    return false;
  }
}

async function fetchSvgFromCommons(wikiFileName) {
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(wikiFileName)}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'follow',
    });
    if (res.status === 429 || !res.ok) return null;
    const text = await res.text();
    if (!text.includes('<svg') && !text.includes('<SVG')) return null;
    return text;
  } catch {
    return null;
  }
}

function titleMatchesEntry(title, entry) {
  const base = title
    .replace(/^UA road sign /, '')
    .replace(/^UA_road_sign_/, '')
    .replace(/\.svg$/i, '');

  const speed = extractSpeedKmh(entry.id, entry.name);
  if (entry.code === '3.29' && speed) {
    const pad3 = String(speed).padStart(3, '0');
    return base === `3.29-${pad3}` || base === `3.29-${speed}`;
  }
  if (entry.code === '4.16' && speed) {
    const pad3 = String(speed).padStart(3, '0');
    return base === `4.16-${pad3}` || base === '4.16';
  }

  if (entry.code.startsWith('4.1') || entry.code.startsWith('8.1')) {
    return (
      base === entry.code ||
      base.startsWith(`${entry.code}-`) ||
      base.startsWith(`${entry.code}.`)
    );
  }

  if (entry.id === 'turn-left' && (base === '4.1.2-1' || base === '4.1.2.1')) return true;
  if (entry.id === 'turn-right' && base === '4.1.2') return true;

  return base === entry.code || base.startsWith(`${entry.code}-`) || base.startsWith(`${entry.code}.`);
}

async function searchCommonsCandidates(entry) {
  const query = encodeURIComponent(`"UA road sign ${entry.code}"`);
  const apiUrl =
    `https://commons.wikimedia.org/w/api.php?action=query&list=search` +
    `&srsearch=${query}&srnamespace=6&format=json&origin=*&srlimit=12`;

  try {
    await delay(REQUEST_DELAY_MS);
    const res = await fetch(apiUrl, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return [];
    const data = await res.json();
    return (data.query?.search ?? [])
      .map((hit) => hit.title.replace(/^File:/, ''))
      .filter(
        (title) =>
          (title.startsWith('UA road sign') || title.startsWith('UA_road_sign')) &&
          title.endsWith('.svg') &&
          titleMatchesEntry(title, entry)
      );
  } catch {
    return [];
  }
}

async function downloadSign(entry) {
  const candidates = buildWikiCandidates(entry);

  for (const wikiName of candidates) {
    const svg = await fetchSvgFromCommons(wikiName);
    await delay(REQUEST_DELAY_MS);
    if (svg) return { wikiName, svg, source: 'pattern' };
  }

  const searched = await searchCommonsCandidates(entry);
  for (const wikiName of searched) {
    if (candidates.includes(wikiName)) continue;
    const svg = await fetchSvgFromCommons(wikiName);
    await delay(REQUEST_DELAY_MS);
    if (svg) return { wikiName, svg, source: 'search' };
  }

  return null;
}

function auditCatalog(catalog) {
  const missing = [];
  const present = [];
  for (const entry of catalog) {
    const file = assetFileName(entry.id, entry.code);
    const dest = path.join(OUT_DIR, file);
    if (isValidSvgFile(dest)) present.push(entry);
    else missing.push(entry);
  }
  return { missing, present };
}

const REFRESH = process.argv.includes('--refresh');

async function main() {
  const catalogContent = fs.readFileSync(CATALOG_PATH, 'utf8');
  const catalog = parseCatalog(catalogContent);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const { missing, present } = auditCatalog(catalog);
  console.log(`Catalog audit: ${catalog.length} signs, ${present.length} on disk, ${missing.length} missing\n`);

  if (missing.length) {
    console.log('Missing assets:');
    for (const e of missing) {
      console.log(`  - ${e.id} (${e.code}) -> ${assetFileName(e.id, e.code)}`);
    }
    console.log('');
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: 'Wikimedia Commons (UA road signs, DSTU 4100)',
    requestDelayMs: REQUEST_DELAY_MS,
    patterns: [
      '3.29 speed: UA road sign 3.29-{NNN}.svg (3-digit pad)',
      '4.16 min speed: UA road sign 4.16-{NNN}.svg',
      '1.13/1.14 grade: UA road sign 1.13.svg or 1.13-{pct}.svg',
      'Sub-variants: 1.23.1, 4.1.2-1, 5.29.1, 5.38.1, 6.7.1',
    ],
    signs: [],
  };

  let ok = 0;
  let skipped = 0;
  let fail = 0;

  console.log(`Downloading missing signs to ${OUT_DIR}`);
  console.log(`Delay between requests: ${REQUEST_DELAY_MS}ms\n`);

  for (const entry of catalog) {
    const fileName = assetFileName(entry.id, entry.code);
    const dest = path.join(OUT_DIR, fileName);
    process.stdout.write(`  ${entry.id} (${entry.code}) -> ${fileName} … `);

    if (isValidSvgFile(dest) && !REFRESH) {
      console.log('SKIP (exists)');
      skipped++;
      manifest.signs.push({
        id: entry.id,
        code: entry.code,
        category: entry.category,
        file: fileName,
        assetId: ASSET_OVERRIDES[entry.id] ?? codeToAssetId(entry.code),
        ok: true,
        cached: true,
      });
      continue;
    }

    const result = await downloadSign(entry);

    if (!result) {
      console.log('MISS');
      fail++;
      manifest.signs.push({
        id: entry.id,
        code: entry.code,
        category: entry.category,
        file: fileName,
        assetId: ASSET_OVERRIDES[entry.id] ?? codeToAssetId(entry.code),
        ok: false,
      });
      continue;
    }

    fs.writeFileSync(dest, result.svg, 'utf8');
    console.log(`OK (${result.wikiName}, ${result.source})`);
    ok++;
    manifest.signs.push({
      id: entry.id,
      code: entry.code,
      category: entry.category,
      file: fileName,
      assetId: ASSET_OVERRIDES[entry.id] ?? codeToAssetId(entry.code),
      wikiName: result.wikiName,
      source: result.source,
      ok: true,
    });
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2), 'utf8');

  console.log(`\nDone: ${ok} new, ${skipped} skipped, ${fail} missing.`);
  console.log(`Manifest: ${MANIFEST_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
