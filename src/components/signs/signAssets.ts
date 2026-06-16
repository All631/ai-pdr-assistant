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
  'end-main-road': '2_24',
  straight: '4_1_1',
  'turn-right': '4_1_2',
  'turn-left': '4_1_2_1',
  'bicycle-lane': '4_4_1',
  'living-zone': '5_38_1',
  'gas-station': '5_15',
  food: '6_4_1',
  parking: '6_4',
  'pedestrian-zone': '5_38',
  hotel: '6_2',
  'car-service': '6_8',
  'sign-plate': '8_1_1',
  'min-speed-40': '3_27_40',
};

export function getSignAssetId(signId: string, code?: string): string {
  if (ASSET_OVERRIDES[signId]) return ASSET_OVERRIDES[signId];
  if (code) return codeToAssetId(code);
  return signId;
}

/** Primary image path: DSTU code with underscores (e.g. 2_1.svg, 3_29_50.svg). */
export function getSignImageSrc(signId: string, code?: string): string {
  return `/images/signs/${getSignAssetId(signId, code)}.svg`;
}

/** Legacy alias lookup by code alone (unique codes only). */
export function getSignImageSrcByCode(code: string): string {
  return `/images/signs/${codeToAssetId(code)}.svg`;
}

/** Ordered fallback paths when primary asset is missing on disk/CDN. */
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
