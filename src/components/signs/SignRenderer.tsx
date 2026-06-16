import React, { useMemo, useState } from 'react';
import { TRAFFIC_SIGN_CATALOG, type SignCategoryId } from '../../data/trafficSignsCatalog';
import { getSignImageCandidates, SIGN_ASSET_CACHE_BUST } from './signAssets';

export type SignId = string;

const SIZE = 52;

const CATEGORY_STYLES: Record<
  SignCategoryId,
  { shape: 'triangle' | 'circle' | 'square' | 'rectangle'; bg: string; border: string; labelFill: string }
> = {
  warning: { shape: 'triangle', bg: '#ffffff', border: '#dc2626', labelFill: '#1e293b' },
  priority: { shape: 'square', bg: '#ffffff', border: '#1e293b', labelFill: '#1e293b' },
  prohibitory: { shape: 'circle', bg: '#ffffff', border: '#dc2626', labelFill: '#1e293b' },
  mandatory: { shape: 'circle', bg: '#2563eb', border: '#1d4ed8', labelFill: '#ffffff' },
  info: { shape: 'rectangle', bg: '#2563eb', border: '#1d4ed8', labelFill: '#ffffff' },
  service: { shape: 'square', bg: '#2563eb', border: '#1d4ed8', labelFill: '#ffffff' },
};

function SignFallback({
  signId,
  code,
  name,
  category,
  size,
}: {
  signId: string;
  code?: string;
  name?: string;
  category?: SignCategoryId;
  size: number;
}) {
  const style = category ? CATEGORY_STYLES[category] : CATEGORY_STYLES.warning;
  const label = code ?? signId;

  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="h-full w-full object-contain"
      aria-label={name ?? signId}
      role="img"
    >
      {style.shape === 'triangle' && (
        <polygon points="50,8 92,88 8,88" fill={style.bg} stroke={style.border} strokeWidth="6" />
      )}
      {style.shape === 'circle' && (
        <circle cx="50" cy="50" r="42" fill={style.bg} stroke={style.border} strokeWidth="6" />
      )}
      {style.shape === 'square' && (
        <rect x="12" y="12" width="76" height="76" rx="4" fill={style.bg} stroke={style.border} strokeWidth="5" />
      )}
      {style.shape === 'rectangle' && (
        <rect x="8" y="22" width="84" height="56" rx="6" fill={style.bg} stroke={style.border} strokeWidth="5" />
      )}
      {category === 'mandatory' && !code && (
        <polygon points="50,28 62,58 38,58" fill={style.labelFill} />
      )}
      <text
        x="50"
        y={category === 'mandatory' && !code ? '72' : '58'}
        textAnchor="middle"
        fontSize={label.length > 5 ? 14 : 18}
        fontWeight="700"
        fill={style.labelFill}
        fontFamily="system-ui, sans-serif"
      >
        {label}
      </text>
    </svg>
  );
}

export function SignRenderer({ signId, size = SIZE }: { signId: SignId; size?: number }) {
  const entry = useMemo(
    () => TRAFFIC_SIGN_CATALOG.find((s) => s.id === signId),
    [signId]
  );

  const candidates = useMemo(
    () => getSignImageCandidates(signId, entry?.code),
    [signId, entry?.code]
  );

  const [candidateIndex, setCandidateIndex] = useState(0);
  const src = candidates[Math.min(candidateIndex, candidates.length - 1)];
  const srcWithCacheBust = `${src}?v=${SIGN_ASSET_CACHE_BUST}`;

  if (candidateIndex >= candidates.length) {
    return (
      <SignFallback
        signId={signId}
        code={entry?.code}
        name={entry?.name}
        category={entry?.category}
        size={size}
      />
    );
  }

  return (
    <img
      key={srcWithCacheBust}
      src={srcWithCacheBust}
      alt={entry?.name ?? signId}
      width={size}
      height={size}
      className="h-full w-full object-contain"
      loading="lazy"
      decoding="async"
      onError={() => {
        setCandidateIndex((i) => i + 1);
      }}
    />
  );
}
