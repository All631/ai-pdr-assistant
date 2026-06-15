import React from 'react';

interface SignIconProps {
  size?: number;
  className?: string;
}

const signBase = 'shrink-0';

function WarningTriangle({ children, size, className, label }: SignIconProps & { label: string; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${signBase} ${className ?? ''}`}
      role="img"
      aria-label={label}
    >
      <polygon points="50,8 92,88 8,88" fill="white" stroke="#dc2626" strokeWidth="5" />
      {children}
    </svg>
  );
}

function InfoSign({ children, size, className, label }: SignIconProps & { label: string; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${signBase} ${className ?? ''}`}
      role="img"
      aria-label={label}
    >
      <rect x="10" y="10" width="80" height="80" rx="6" fill="#2563eb" stroke="#1d4ed8" strokeWidth="4" />
      {children}
    </svg>
  );
}

function MandatorySign({ children, size, className, label }: SignIconProps & { label: string; children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`${signBase} ${className ?? ''}`}
      role="img"
      aria-label={label}
    >
      <circle cx="50" cy="50" r="45" fill="#2563eb" stroke="#1d4ed8" strokeWidth="4" />
      {children}
    </svg>
  );
}

/** Небезпечний поворот (1.12) */
export function DangerousTurnSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <WarningTriangle size={size} className={className} label="Небезпечний поворот">
      <path
        d="M35 72 Q35 45 55 40 Q72 36 68 55"
        fill="none"
        stroke="#1e293b"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M68 55 L62 48 M68 55 L60 58" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
    </WarningTriangle>
  );
}

/** Перехрестя (1.30) */
export function CrossroadsSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <WarningTriangle size={size} className={className} label="Перехрестя">
      <line x1="50" y1="35" x2="50" y2="75" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
      <line x1="30" y1="55" x2="70" y2="55" stroke="#1e293b" strokeWidth="6" strokeLinecap="round" />
    </WarningTriangle>
  );
}

/** Загальна небезпека (1.33) */
export function GeneralDangerSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <WarningTriangle size={size} className={className} label="Небезпека">
      <text x="50" y="72" fontSize="40" textAnchor="middle" fill="#1e293b" fontFamily="Arial,sans-serif" fontWeight="bold">
        !
      </text>
    </WarningTriangle>
  );
}

/** Крутий спуск (1.14) */
export function SteepDescentSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <WarningTriangle size={size} className={className} label="Крутий спуск">
      <line x1="28" y1="40" x2="72" y2="72" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
      <text x="62" y="52" fontSize="14" fill="#1e293b" fontFamily="Arial,sans-serif" fontWeight="bold">
        10%
      </text>
    </WarningTriangle>
  );
}

/** Крутий підйом (1.13) */
export function SteepAscentSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <WarningTriangle size={size} className={className} label="Крутий підйом">
      <line x1="28" y1="72" x2="72" y2="40" stroke="#1e293b" strokeWidth="5" strokeLinecap="round" />
      <text x="62" y="58" fontSize="14" fill="#1e293b" fontFamily="Arial,sans-serif" fontWeight="bold">
        10%
      </text>
    </WarningTriangle>
  );
}

/** Дикі тварини (1.24) */
export function WildAnimalsSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <WarningTriangle size={size} className={className} label="Дикі тварини">
      <path
        d="M30 68 L35 55 L42 50 L48 52 L52 48 L58 50 L62 55 L68 68 L62 72 L38 72 Z"
        fill="#1e293b"
      />
      <circle cx="44" cy="54" r="2" fill="white" />
      <path d="M35 50 L30 44 M35 50 L38 44" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
      <path d="M62 50 L67 44 M62 50 L59 44" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
    </WarningTriangle>
  );
}

/** Дорожні роботи (1.34) */
export function RoadWorksSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <WarningTriangle size={size} className={className} label="Дорожні роботи">
      <rect x="38" y="38" width="24" height="18" rx="2" fill="#1e293b" />
      <path d="M32 68 L42 56 L50 62 L58 50 L68 68 Z" fill="#1e293b" />
      <line x1="44" y1="44" x2="56" y2="44" stroke="#facc15" strokeWidth="2" />
      <line x1="44" y1="50" x2="56" y2="50" stroke="#facc15" strokeWidth="2" />
    </WarningTriangle>
  );
}

/** Слизька дорога (1.19) */
export function SlipperyRoadSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <WarningTriangle size={size} className={className} label="Слизька дорога">
      <path
        d="M30 68 Q38 58 50 62 Q62 66 70 52"
        fill="none"
        stroke="#1e293b"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <ellipse cx="42" cy="58" rx="8" ry="4" fill="none" stroke="#1e293b" strokeWidth="2" transform="rotate(-20 42 58)" />
      <ellipse cx="58" cy="62" rx="8" ry="4" fill="none" stroke="#1e293b" strokeWidth="2" transform="rotate(15 58 62)" />
    </WarningTriangle>
  );
}

/** Кінець головної дороги (2.4) */
export function EndOfMainRoadSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <WarningTriangle size={size} className={className} label="Кінець головної дороги">
      <rect x="30" y="38" width="40" height="30" rx="3" fill="#facc15" stroke="#ca8a04" strokeWidth="2" transform="rotate(0 50 53)" />
      <line x1="35" y1="53" x2="65" y2="53" stroke="white" strokeWidth="5" />
    </WarningTriangle>
  );
}

/** Лікарня (5.29) */
export function HospitalSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <InfoSign size={size} className={className} label="Лікарня">
      <rect x="46" y="28" width="8" height="44" fill="white" rx="1" />
      <rect x="34" y="40" width="32" height="8" fill="white" rx="1" />
    </InfoSign>
  );
}

/** АЗС (5.15) */
export function GasStationSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <InfoSign size={size} className={className} label="АЗС">
      <rect x="38" y="30" width="24" height="40" rx="3" fill="white" />
      <rect x="42" y="34" width="16" height="12" rx="1" fill="#2563eb" />
      <rect x="44" y="50" width="4" height="16" fill="#64748b" />
      <circle cx="54" cy="58" r="4" fill="none" stroke="#64748b" strokeWidth="2" />
      <path d="M54 54 L54 50 L58 46" stroke="#64748b" strokeWidth="2" fill="none" />
    </InfoSign>
  );
}

/** Місце відпочинку (5.26) */
export function RestAreaSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <InfoSign size={size} className={className} label="Місце відпочинку">
      <rect x="32" y="48" width="36" height="6" rx="1" fill="white" />
      <rect x="36" y="54" width="4" height="14" fill="white" />
      <rect x="60" y="54" width="4" height="14" fill="white" />
      <path d="M38 38 L50 28 L62 38" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </InfoSign>
  );
}

/** Напрямок руху (5.7) */
export function DirectionSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <InfoSign size={size} className={className} label="Напрямок руху">
      <path d="M35 50 L55 50 L55 38 L70 55 L55 72 L55 60 L35 60 Z" fill="white" />
    </InfoSign>
  );
}

/** Круговий рух (1.29) */
export function RoundaboutSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <WarningTriangle size={size} className={className} label="Круговий рух">
      <circle cx="50" cy="55" r="18" fill="none" stroke="#1e293b" strokeWidth="4" />
      <path d="M62 42 L68 36 M62 42 L58 48" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
      <path d="M38 68 L32 74 M38 68 L42 62" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
    </WarningTriangle>
  );
}

/** Рух прямо (4.1.1) */
export function StraightAheadSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <MandatorySign size={size} className={className} label="Рух прямо">
      <path d="M50 25 L50 65 M50 25 L38 40 M50 25 L62 40" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </MandatorySign>
  );
}

/** Поворот праворуч (4.1.2) */
export function TurnRightSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <MandatorySign size={size} className={className} label="Поворот праворуч">
      <path d="M35 65 L35 45 Q35 30 50 30 L65 30" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
      <path d="M65 30 L55 22 M65 30 L55 38" stroke="white" strokeWidth="5" strokeLinecap="round" />
    </MandatorySign>
  );
}

/** Смуга для автобусів (5.14) */
export function BusLaneSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <InfoSign size={size} className={className} label="Смуга для автобусів">
      <rect x="28" y="38" width="44" height="28" rx="4" fill="white" />
      <rect x="32" y="42" width="28" height="14" rx="2" fill="#2563eb" />
      <circle cx="38" cy="62" r="4" fill="#64748b" />
      <circle cx="58" cy="62" r="4" fill="#64748b" />
      <rect x="62" y="44" width="6" height="10" rx="1" fill="white" />
    </InfoSign>
  );
}

/** Велосипедна доріжка (4.4.1) */
export function BicycleLaneSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <MandatorySign size={size} className={className} label="Велосипедна доріжка">
      <circle cx="38" cy="62" r="10" fill="none" stroke="white" strokeWidth="3" />
      <circle cx="62" cy="62" r="10" fill="none" stroke="white" strokeWidth="3" />
      <line x1="38" y1="62" x2="50" y2="38" stroke="white" strokeWidth="3" />
      <line x1="50" y1="38" x2="62" y2="62" stroke="white" strokeWidth="3" />
      <line x1="44" y1="48" x2="56" y2="48" stroke="white" strokeWidth="3" />
    </MandatorySign>
  );
}
