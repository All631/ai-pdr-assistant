/**
 * Downloads official Ukrainian road sign SVGs from Wikimedia Commons (DSTU 4100).
 * Usage: node scripts/download_dstu_signs.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CATALOG_PATH = path.join(ROOT, 'src/data/trafficSignsCatalog.ts');
const OUT_DIR = path.join(ROOT, 'public/images/signs');
const MANIFEST_PATH = path.join(OUT_DIR, 'manifest.json');

const USER_AGENT = 'ai-pdr-assistant/1.0 (educational; DSTU sign downloader; github.com/All631/ai-pdr-assistant)';
const REQUEST_DELAY_MS = 2000;
const MAX_DOWNLOAD_ATTEMPTS = 1;
/** Download only the first N catalog entries (core set across all DSTU categories). */
const DOWNLOAD_LIMIT = 45;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const WIKI_OVERRIDES = {
  'speed-30': ['UA road sign 3.29-020.svg', 'UA_road_sign_3.29-020.svg'],
  'speed-50': ['UA road sign 3.29-050.svg', 'UA_road_sign_3.29-050.svg'],
  'speed-70': ['UA road sign 3.29-070.svg', 'UA_road_sign_3.29-070.svg'],
  'speed-90': ['UA road sign 3.29-060.svg', 'UA_road_sign_3.29-060.svg'],
  stop: ['UA road sign 2.2.svg', 'UA_road_sign_2.2.svg'],
  'end-main-road': ['UA road sign 2.24.svg', 'UA_road_sign_2.24.svg'],
  'turn-right': ['UA road sign 4.1.2.svg', 'UA_road_sign_4.1.2.svg'],
  'turn-left': ['UA road sign 4.1.2-1.svg', 'UA_road_sign_4.1.2-1.svg'],
  'living-zone': ['UA road sign 5.38-1.svg', 'UA_road_sign_5.38-1.svg'],
  food: ['UA road sign 6.4-1.svg', 'UA_road_sign_6.4-1.svg'],
  'min-speed-40': ['UA road sign 3.27-040.svg', 'UA_road_sign_3.27-040.svg'],
  parking: ['UA road sign 6.4.svg', 'UA_road_sign_6.4.svg'],
  'pedestrian-zone': ['UA road sign 5.38.svg', 'UA_road_sign_5.38.svg'],
  children: ['UA road sign 1.23.1.svg', 'UA_road_sign_1.23.1.svg'],
  railway: ['UA road sign 1.31.1.svg', 'UA_road_sign_1.31.1.svg', 'UA road sign 1.31.svg'],
};

const ASSET_OVERRIDES = {
  'speed-30': '3_29_30',
  'speed-50': '3_29_50',
  'speed-70': '3_29_70',
  'speed-90': '3_29_90',
  stop: '2_2',
  'end-main-road': '2_24',
  'turn-right': '4_1_2',
  'turn-left': '4_1_2_1',
  'living-zone': '5_38_1',
  food: '6_4_1',
  parking: '6_4',
  'pedestrian-zone': '5_38',
  'min-speed-40': '3_27_40',
};

function parseCatalog(content) {
  const entries = [];
  const re = /\{\s*id:\s*'([^']+)',\s*code:\s*'([^']+)'[\s\S]*?category:\s*'([^']+)'/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    entries.push({ id: m[1], code: m[2], category: m[3], name: m[1] });
  }
  return entries;
}

export function codeToAssetId(code) {
  return code.replace(/\./g, '_');
}

function assetFileName(signId, code) {
  const base = ASSET_OVERRIDES[signId] ?? codeToAssetId(code);
  return `${base}.svg`;
}

function wikiCandidates(signId, code) {
  const list = [];
  if (WIKI_OVERRIDES[signId]) list.push(...WIKI_OVERRIDES[signId]);
  list.push(`UA road sign ${code}.svg`);
  list.push(`UA_road_sign_${code}.svg`);
  return [...new Set(list)];
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

  for (let attempt = 1; attempt <= MAX_DOWNLOAD_ATTEMPTS; attempt++) {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      redirect: 'follow',
    });

    if (res.status === 429) {
      return null;
    }

    if (!res.ok) return null;

    const text = await res.text();
    if (!text.includes('<svg') && !text.includes('<SVG')) return null;
    return text;
  }

  return null;
}

async function downloadSign(entry) {
  const candidates = wikiCandidates(entry.id, entry.code);

  for (const wikiName of candidates) {
    const svg = await fetchSvgFromCommons(wikiName);
    await delay(REQUEST_DELAY_MS);
    if (svg) return { wikiName, svg };
  }

  return null;
}

async function main() {
  const catalogContent = fs.readFileSync(CATALOG_PATH, 'utf8');
  const catalog = parseCatalog(catalogContent).slice(0, DOWNLOAD_LIMIT);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  const manifest = {
    generatedAt: new Date().toISOString(),
    source: 'Wikimedia Commons (UA road signs, DSTU 4100)',
    downloadLimit: DOWNLOAD_LIMIT,
    requestDelayMs: REQUEST_DELAY_MS,
    signs: [],
  };

  let ok = 0;
  let skipped = 0;
  let fail = 0;

  console.log(`Downloading up to ${catalog.length} core signs to ${OUT_DIR}`);
  console.log(`Delay between requests: ${REQUEST_DELAY_MS}ms\n`);

  for (const entry of catalog) {
    const fileName = assetFileName(entry.id, entry.code);
    const dest = path.join(OUT_DIR, fileName);
    process.stdout.write(`  ${entry.id} (${entry.code}) -> ${fileName} … `);

    if (isValidSvgFile(dest)) {
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
    console.log(`OK (${result.wikiName})`);
    ok++;
    manifest.signs.push({
      id: entry.id,
      code: entry.code,
      category: entry.category,
      file: fileName,
      assetId: ASSET_OVERRIDES[entry.id] ?? codeToAssetId(entry.code),
      wikiName: result.wikiName,
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
