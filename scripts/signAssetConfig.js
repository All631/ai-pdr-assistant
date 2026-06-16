/**
 * Shared asset naming + Wikimedia filename pattern logic for DSTU signs.
 */

export const ASSET_OVERRIDES = {
  'speed-30': '3_29_30',
  'speed-50': '3_29_50',
  'speed-70': '3_29_70',
  'speed-90': '3_29_90',
  stop: '2_2',
  'give-way': '2_1',
  'main-road': '2_3',
  'end-main-road': '2_4',
  'give-way-oncoming': '2_5',
  'priority-before-oncoming': '2_6',
  straight: '4_1_1',
  'turn-right': '4_1_2',
  'turn-left': '4_1_2_1',
  'bicycle-lane': '4_4_1',
  'min-speed-40': '4_16_40',
  parking: '5_38_1',
  direction: '5_53_1',
  'dead-end': '5_29_1',
  'pedestrian-zone': '5_33',
  'living-zone': '5_31',
  'bus-lane': '5_11',
  'first-aid': '6_1',
  hospital: '6_2',
  'car-service': '6_5',
  telephone: '6_8',
  'gas-station': '6_7_1',
  food: '6_13',
  'rest-area': '6_15',
  hotel: '6_16',
  'sign-plate': '8_1_1',
};

export const SPEED_329_SUFFIXES = ['020', '030', '040', '050', '060', '070', '080', '090', '110', '130'];

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

export function extractSpeedKmh(id, name) {
  const fromId = id.match(/^speed-(\d+)$/) || id.match(/^min-speed-(\d+)$/);
  if (fromId) return parseInt(fromId[1], 10);
  const fromName = name.match(/(\d+)\s*км\/год/i);
  return fromName ? parseInt(fromName[1], 10) : null;
}

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

  if (code === '4.16' && speed) {
    const pad3 = String(speed).padStart(3, '0');
    add(`4.16-${pad3}`);
    add('4.16');
  }

  const subById = {
    children: ['1.23.1'],
    railway: ['1.31.1', '1.31'],
    straight: ['4.1.1'],
    'turn-right': ['4.1.2', '4.1.2.2'],
    'turn-left': ['4.1.2-1', '4.1.2.1'],
    'bicycle-lane': ['4.4.1', '4.4'],
    'dead-end': ['5.29.1', '5.29.2'],
    'living-zone': ['5.31'],
    'pedestrian-zone': ['5.33'],
    parking: ['5.38.1', '5.38'],
    direction: ['5.53.1', '5.53'],
    'bus-lane': ['5.11'],
    'gas-station': ['6.7.1', '6.7.2', '6.7.3'],
    hospital: ['6.2'],
    hotel: ['6.16'],
    'car-service': ['6.5'],
    food: ['6.13'],
    'rest-area': ['6.15'],
    telephone: ['6.8'],
    'first-aid': ['6.1 (2021)', '6.1 (2002–2021)', '6.1'],
    'sign-plate': ['8.1.1', '8.1.1-1'],
    'priority-before-oncoming': ['2.6'],
    'give-way-oncoming': ['2.5'],
    'end-main-road': ['2.4'],
    'main-road': ['2.3'],
    'give-way': ['2.1'],
    stop: ['2.2'],
  };

  if (subById[id]) subById[id].forEach((v) => add(v));

  if (code === '1.13' || code === '1.14') {
    for (const pct of ['7', '10', '12', '15']) add(`${code}-${pct}`);
  }

  add(code);

  return [...new Set(out)];
}
