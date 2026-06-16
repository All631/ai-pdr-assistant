/**
 * Shared asset naming + Wikimedia filename pattern logic for DSTU signs.
 */

export const ASSET_OVERRIDES = {
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

export function codeToAssetId(code) {
  return code.replace(/\./g, '_');
}

export function assetFileName(signId, code) {
  const base = ASSET_OVERRIDES[signId] ?? codeToAssetId(code);
  return `${base}.svg`;
}

function wikiPair(filePart) {
  const normalized = filePart.endsWith('.svg') ? filePart : `${filePart}.svg`;
  return [`UA road sign ${normalized}`, `UA_road_sign_${normalized.replace(/ /g, '_')}`];
}

/** Extract km/h value from catalog id or Ukrainian name. */
export function extractSpeedKmh(id, name) {
  const fromId = id.match(/^speed-(\d+)$/) || id.match(/^min-speed-(\d+)$/);
  if (fromId) return parseInt(fromId[1], 10);
  const fromName = name.match(/(\d+)\s*км\/год/i);
  return fromName ? parseInt(fromName[1], 10) : null;
}

/**
 * Wikimedia Commons naming patterns discovered for UA DSTU signs:
 * - Speed limit 3.29:  UA road sign 3.29-{NNN}.svg  (3-digit pad: 020, 050, 070, 060)
 * - Min speed 3.27:   UA road sign 3.27-{NNN}.svg or 3.27.svg
 * - Steep grade 1.13/1.14: UA road sign 1.13.svg (plain) or 1.13-{pct}.svg
 * - Sub-variants:     1.23.1, 1.31.1, 4.1.2-1, 5.38-1, 5.38.1, 6.4-1
 * - Dated variants:   6.1 (2021).svg, 6.1 (2002–2021).svg
 */
export function buildWikiCandidates(entry) {
  const { id, code, name } = entry;
  const out = [];
  const add = (...parts) => parts.forEach((p) => out.push(...wikiPair(p)));

  const speed = extractSpeedKmh(id, name);

  if (code === '3.29' && speed) {
    const pad3 = String(speed).padStart(3, '0');
    add(`3.29-${pad3}`);
    if (pad3 !== String(speed)) add(`3.29-${speed}`);
  }

  if (code === '3.27' && speed) {
    const pad3 = String(speed).padStart(3, '0');
    add(`3.27-${pad3}`);
    add('3.27');
  }

  const subById = {
    children: ['1.23.1'],
    railway: ['1.31.1', '1.31'],
    'turn-left': ['4.1.2-1'],
    'turn-right': ['4.1.2'],
    'end-main-road': ['2.24'],
    'living-zone': ['5.38-1', '5.38.1'],
    'pedestrian-zone': ['5.38', '5.38.2', '5.38.1'],
    food: ['6.4-1'],
    parking: ['6.4'],
    'first-aid': ['6.1 (2021)', '6.1 (2002–2021)', '6.1'],
    direction: ['5.7.1', '5.7'],
    'bus-lane': ['5.14'],
  };

  if (subById[id]) subById[id].forEach((v) => add(v));

  if (code === '1.13' || code === '1.14') {
    for (const pct of ['7', '10', '12', '15']) add(`${code}-${pct}`);
  }

  add(code);

  return [...new Set(out)];
}
