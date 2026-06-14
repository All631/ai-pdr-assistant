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

/** Обгін заборонено (знак 3.20) */
export function NoOvertakingSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${signBase} ${className}`}
      role="img"
      aria-label="Обгін заборонено"
    >
      <circle cx="50" cy="50" r="45" fill="white" stroke="#dc2626" strokeWidth="5" />
      <rect x="22" y="38" width="22" height="14" rx="3" fill="#dc2626" />
      <rect x="56" y="38" width="22" height="14" rx="3" fill="#dc2626" />
      <path d="M44 45 L56 45" stroke="white" strokeWidth="3" />
    </svg>
  );
}

/** Попереджувальний знак (трикутник) */
export function WarningSign({
  size = 40,
  className = '',
  label = '!',
}: SignIconProps & { label?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${signBase} ${className}`}
      role="img"
      aria-label="Попереджувальний знак"
    >
      <polygon points="50,8 92,88 8,88" fill="white" stroke="#dc2626" strokeWidth="5" />
      <text
        x="50"
        y="72"
        fontSize="36"
        textAnchor="middle"
        fill="#1e293b"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
      >
        {label}
      </text>
    </svg>
  );
}

/** Головна дорога (знак 2.1) */
export function MainRoadSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${signBase} ${className}`}
      role="img"
      aria-label="Головна дорога"
    >
      <rect
        x="10"
        y="10"
        width="80"
        height="80"
        rx="4"
        fill="#facc15"
        stroke="#ca8a04"
        strokeWidth="3"
        transform="rotate(45 50 50)"
      />
      <rect x="25" y="47" width="50" height="6" fill="white" />
    </svg>
  );
}

/** Поворот ліворуч заборонено (знак 3.18) */
export function NoLeftTurnSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${signBase} ${className}`}
      role="img"
      aria-label="Поворот ліворуч заборонено"
    >
      <circle cx="50" cy="50" r="45" fill="white" stroke="#dc2626" strokeWidth="5" />
      <path
        d="M62 30 L62 55 Q62 68 50 68 L38 68"
        fill="none"
        stroke="#1e293b"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M38 68 L30 60 M38 68 L46 60" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      <line x1="28" y1="28" x2="72" y2="72" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

/** Розворот заборонено (знак 3.19) */
export function NoUTurnSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${signBase} ${className}`}
      role="img"
      aria-label="Розворот заборонено"
    >
      <circle cx="50" cy="50" r="45" fill="white" stroke="#dc2626" strokeWidth="5" />
      <path
        d="M58 32 L58 52 Q58 68 42 68 Q28 68 28 54"
        fill="none"
        stroke="#1e293b"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M28 54 L20 46 M28 54 L36 46" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      <line x1="28" y1="28" x2="72" y2="72" stroke="#dc2626" strokeWidth="6" strokeLinecap="round" />
    </svg>
  );
}

/** Пішохідний перехід (знак 1.22) */
export function PedestrianCrossingSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${signBase} ${className}`}
      role="img"
      aria-label="Пішохідний перехід"
    >
      <polygon points="50,8 92,88 8,88" fill="white" stroke="#dc2626" strokeWidth="5" />
      <circle cx="50" cy="38" r="6" fill="#1e293b" />
      <line x1="50" y1="44" x2="50" y2="62" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="50" x2="62" y2="58" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="50" x2="38" y2="58" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="62" x2="42" y2="78" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      <line x1="50" y1="62" x2="58" y2="78" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
      <line x1="30" y1="72" x2="70" y2="72" stroke="#1e293b" strokeWidth="3" strokeDasharray="6 4" />
    </svg>
  );
}

/** Діти (знак 1.23) */
export function ChildrenSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${signBase} ${className}`}
      role="img"
      aria-label="Діти"
    >
      <polygon points="50,8 92,88 8,88" fill="white" stroke="#dc2626" strokeWidth="5" />
      <circle cx="42" cy="40" r="5" fill="#1e293b" />
      <circle cx="58" cy="44" r="4" fill="#1e293b" />
      <line x1="42" y1="45" x2="42" y2="60" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="48" x2="58" y2="62" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="52" x2="34" y2="58" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="54" x2="66" y2="60" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="60" x2="38" y2="72" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="42" y1="60" x2="48" y2="72" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="62" x2="54" y2="74" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <line x1="58" y1="62" x2="64" y2="74" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** Парковка (знак 6.4) */
export function ParkingSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${signBase} ${className}`}
      role="img"
      aria-label="Парковка"
    >
      <rect x="10" y="10" width="80" height="80" rx="6" fill="#2563eb" stroke="#1d4ed8" strokeWidth="4" />
      <text
        x="50"
        y="68"
        fontSize="48"
        textAnchor="middle"
        fill="white"
        fontFamily="Arial, sans-serif"
        fontWeight="bold"
      >
        P
      </text>
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
