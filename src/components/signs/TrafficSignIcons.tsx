import React from 'react';

interface SignIconProps {
  size?: number;
  className?: string;
}

const signBase = 'shrink-0';

/** Обмеження швидкості (круглий знак) */
export function SpeedLimitSign({
  limit,
  size = 40,
  className = '',
}: SignIconProps & { limit: number | string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${signBase} ${className}`}
      role="img"
      aria-label={`Обмеження швидкості ${limit}`}
    >
      <circle cx="50" cy="50" r="45" fill="white" stroke="#dc2626" strokeWidth="5" />
      <text
        x="50"
        y="65"
        fontSize={String(limit).length > 2 ? '32' : '40'}
        textAnchor="middle"
        fill="#dc2626"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
      >
        {limit}
      </text>
    </svg>
  );
}

/** STOP (знак 2.2) */
export function StopSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${signBase} ${className}`}
      role="img"
      aria-label="STOP"
    >
      <polygon
        points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
        fill="white"
        stroke="#dc2626"
        strokeWidth="5"
      />
      <text
        x="50"
        y="58"
        fontSize="22"
        textAnchor="middle"
        fill="#dc2626"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
      >
        STOP
      </text>
    </svg>
  );
}

/** Дати дорогу (трикутник) */
export function GiveWaySign({ size = 40, className = '' }: SignIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${signBase} ${className}`}
      role="img"
      aria-label="Дати дорогу"
    >
      <polygon points="50,10 90,85 10,85" fill="white" stroke="#dc2626" strokeWidth="5" />
    </svg>
  );
}

/** В'їзд заборонено */
export function NoEntrySign({ size = 40, className = '' }: SignIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${signBase} ${className}`}
      role="img"
      aria-label="В'їзд заборонено"
    >
      <circle cx="50" cy="50" r="45" fill="white" stroke="#dc2626" strokeWidth="5" />
      <rect x="20" y="45" width="60" height="10" fill="#dc2626" />
    </svg>
  );
}

/** SVG з папки public/images/signs/ (статичний файл) */
export function PublicTrafficSign({
  name,
  alt,
  size = 40,
  className = '',
}: {
  name: 'speed-20' | 'speed-50' | 'stop' | 'give-way' | 'no-entry';
  alt: string;
  size?: number;
  className?: string;
}) {
  return (
    <img
      src={`/images/signs/${name}.svg`}
      alt={alt}
      width={size}
      height={size}
      className={`${signBase} ${className}`}
    />
  );
}
