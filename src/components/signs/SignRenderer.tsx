import React, { useMemo, useState } from 'react';
import { TRAFFIC_SIGN_CATALOG } from '../../data/trafficSignsCatalog';
import { getSignImageSrc, getSignImageSrcByCode } from './signAssets';

export type SignId = string;

const SIZE = 52;

function SignFallback({
  signId,
  code,
  name,
  size,
}: {
  signId: string;
  code?: string;
  name?: string;
  size: number;
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className="h-full w-full object-contain"
      aria-label={name ?? signId}
      role="img"
    >
      <polygon points="50,6 94,90 6,90" fill="#ffffff" stroke="#dc2626" strokeWidth="6" />
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fontSize="22"
        fontWeight="800"
        fill="#dc2626"
        fontFamily="system-ui, sans-serif"
      >
        ПДР
      </text>
      {code && (
        <text
          x="50"
          y="82"
          textAnchor="middle"
          fontSize="11"
          fontWeight="600"
          fill="#64748b"
          fontFamily="system-ui, sans-serif"
        >
          {code}
        </text>
      )}
    </svg>
  );
}

export function SignRenderer({ signId, size = SIZE }: { signId: SignId; size?: number }) {
  const entry = useMemo(
    () => TRAFFIC_SIGN_CATALOG.find((s) => s.id === signId),
    [signId]
  );

  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const primarySrc = getSignImageSrc(signId, entry?.code);
  const codeSrc = entry ? getSignImageSrcByCode(entry.code) : null;

  const src =
    failedSrc === primarySrc && codeSrc && codeSrc !== primarySrc ? codeSrc : primarySrc;

  const [showFallback, setShowFallback] = useState(false);

  if (showFallback) {
    return (
      <SignFallback
        signId={signId}
        code={entry?.code}
        name={entry?.name}
        size={size}
      />
    );
  }

  return (
    <img
      src={src}
      alt={entry?.name ?? signId}
      width={size}
      height={size}
      className="h-full w-full object-contain"
      loading="lazy"
      decoding="async"
      onError={() => {
        if (codeSrc && src === primarySrc && failedSrc !== primarySrc) {
          setFailedSrc(primarySrc);
          return;
        }
        setShowFallback(true);
      }}
    />
  );
}
