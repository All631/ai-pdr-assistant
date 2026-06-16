/** "3.29" -> "3_29" for code-based static paths */
export function codeToAssetId(code: string): string {
  return code.replace(/\./g, '_');
}

/** Asset filenames when multiple catalog entries share the same DSTU code. */
const ASSET_OVERRIDES: Record<string, string> = {
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

export function getSignAssetId(signId: string, code?: string): string {
  if (ASSET_OVERRIDES[signId]) return ASSET_OVERRIDES[signId];
  if (code) return codeToAssetId(code);
  return signId;
}

export function getSignImageSrc(signId: string, code?: string): string {
  return `/images/signs/${getSignAssetId(signId, code)}.svg`;
}

export function getSignImageSrcByCode(code: string): string {
  return `/images/signs/${codeToAssetId(code)}.svg`;
}

export function getSignImageCandidates(signId: string, code?: string): string[] {
  const primary = getSignAssetId(signId, code);
  const paths: string[] = [`/images/signs/${primary}.svg`];

  if (code) {
    const codePath = `/images/signs/${codeToAssetId(code)}.svg`;
    if (!paths.includes(codePath)) paths.push(codePath);
  }

  const legacyId = `/images/signs/${signId}.svg`;
  if (!paths.includes(legacyId)) paths.push(legacyId);

  return paths;
}
