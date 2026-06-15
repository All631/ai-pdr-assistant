import React from 'react';

interface SignIconProps {
  size?: number;
  className?: string;
}

const base = 'shrink-0';

function WarningFrame({ size, className, label, children }: SignIconProps & { label: string; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={`${base} ${className ?? ''}`} role="img" aria-label={label}>
      <polygon points="50,8 92,88 8,88" fill="white" stroke="#dc2626" strokeWidth="5" />
      {children}
    </svg>
  );
}

function BlueCircle({ size, className, label, children }: SignIconProps & { label: string; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={`${base} ${className ?? ''}`} role="img" aria-label={label}>
      <circle cx="50" cy="50" r="45" fill="#2563eb" stroke="#1d4ed8" strokeWidth="4" />
      {children}
    </svg>
  );
}

function RedCircle({ size, className, label, children }: SignIconProps & { label: string; children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={`${base} ${className ?? ''}`} role="img" aria-label={label}>
      <circle cx="50" cy="50" r="45" fill="white" stroke="#dc2626" strokeWidth="5" />
      {children}
    </svg>
  );
}

function BlueRect({ size, className, label, children, fill = '#2563eb' }: SignIconProps & { label: string; children: React.ReactNode; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={`${base} ${className ?? ''}`} role="img" aria-label={label}>
      <rect x="10" y="10" width="80" height="80" rx="6" fill={fill} stroke="#1d4ed8" strokeWidth="4" />
      {children}
    </svg>
  );
}

/** Залізничний переїзд (1.31) */
export function RailwayCrossingSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <WarningFrame size={size} className={className} label="Залізничний переїзд">
      <rect x="25" y="55" width="50" height="8" fill="#1e293b" />
      <line x1="30" y1="45" x2="70" y2="75" stroke="#1e293b" strokeWidth="4" />
      <line x1="70" y1="45" x2="30" y2="75" stroke="#1e293b" strokeWidth="4" />
    </WarningFrame>
  );
}

/** Тунель (1.32) */
export function TunnelSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <WarningFrame size={size} className={className} label="Тунель">
      <path d="M30 75 Q30 45 50 40 Q70 45 70 75 Z" fill="none" stroke="#1e293b" strokeWidth="4" />
      <rect x="35" y="60" width="30" height="15" fill="#1e293b" opacity="0.3" />
    </WarningFrame>
  );
}

/** Перехрестя з головною (2.3) */
export function PriorityIntersectionSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={`${base} ${className}`} role="img" aria-label="Перехрестя з головною">
      <polygon points="50,8 92,88 8,88" fill="white" stroke="#dc2626" strokeWidth="5" />
      <rect x="35" y="45" width="30" height="30" rx="3" fill="#facc15" stroke="#ca8a04" strokeWidth="2" transform="rotate(45 50 60)" />
      <line x1="42" y1="60" x2="58" y2="60" stroke="white" strokeWidth="4" />
    </svg>
  );
}

/** Стоянка заборонена (3.34) */
export function NoParkingSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <RedCircle size={size} className={className} label="Стоянка заборонена">
      <rect x="28" y="46" width="44" height="8" fill="#dc2626" transform="rotate(45 50 50)" />
      <text x="50" y="58" fontSize="22" textAnchor="middle" fill="#1e293b" fontWeight="bold">P</text>
    </RedCircle>
  );
}

/** Зупинка заборонена (3.33) */
export function NoStoppingSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <RedCircle size={size} className={className} label="Зупинка заборонена">
      <rect x="28" y="46" width="44" height="8" fill="#dc2626" transform="rotate(45 50 50)" />
      <rect x="28" y="46" width="44" height="8" fill="#dc2626" transform="rotate(-45 50 50)" />
    </RedCircle>
  );
}

/** Сигнали заборонено (3.32) */
export function NoHornsSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <RedCircle size={size} className={className} label="Сигнали заборонено">
      <path d="M35 55 L55 45 L55 65 Z" fill="#1e293b" />
      <path d="M58 48 Q68 55 58 62" fill="none" stroke="#1e293b" strokeWidth="3" />
      <line x1="28" y1="28" x2="72" y2="72" stroke="#dc2626" strokeWidth="5" />
    </RedCircle>
  );
}

/** Поворот ліворуч (4.1.2) */
export function TurnLeftSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <BlueCircle size={size} className={className} label="Поворот ліворuch">
      <path d="M65 65 L65 45 Q65 30 50 30 L35 30" fill="none" stroke="white" strokeWidth="6" strokeLinecap="round" />
      <path d="M35 30 L43 22 M35 30 L43 38" stroke="white" strokeWidth="5" strokeLinecap="round" />
    </BlueCircle>
  );
}

/** Круговий рух наказовий (4.3) */
export function MandatoryRoundaboutSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <BlueCircle size={size} className={className} label="Круговий рух">
      <circle cx="50" cy="52" r="18" fill="none" stroke="white" strokeWidth="4" />
      <path d="M62 40 L68 34 M62 40 L58 48" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </BlueCircle>
  );
}

/** Односторонній рух (5.5) */
export function OneWaySign({ size = 40, className = '' }: SignIconProps) {
  return (
    <BlueRect size={size} className={className} label="Односторонній рух">
      <path d="M30 50 L60 50 L60 38 L75 55 L60 72 L60 60 L30 60 Z" fill="white" />
    </BlueRect>
  );
}

/** Тупик (5.6) */
export function DeadEndSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <BlueRect size={size} className={className} label="Тупик">
      <path d="M25 50 L55 50 L55 30 L70 50 L55 70 L55 50" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round" />
      <line x1="25" y1="50" x2="25" y2="65" stroke="white" strokeWidth="5" strokeLinecap="round" />
    </BlueRect>
  );
}

/** Пішохідна зона (5.38) */
export function PedestrianZoneSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <BlueRect size={size} className={className} label="Пішохідна зона">
      <circle cx="50" cy="38" r="6" fill="white" />
      <line x1="50" y1="44" x2="50" y2="58" stroke="white" strokeWidth="3" />
      <line x1="50" y1="50" x2="58" y2="55" stroke="white" strokeWidth="3" />
      <line x1="50" y1="50" x2="42" y2="55" stroke="white" strokeWidth="3" />
      <rect x="30" y="62" width="40" height="4" rx="1" fill="white" />
    </BlueRect>
  );
}

/** Житлова зона (5.38) */
export function LivingZoneSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <BlueRect size={size} className={className} label="Житлова зона" fill="#059669">
      <rect x="35" y="35" width="30" height="25" rx="2" fill="white" />
      <polygon points="50,28 65,38 35,38" fill="white" />
      <rect x="44" y="48" width="12" height="12" fill="#059669" />
    </BlueRect>
  );
}

/** Автомагістраль (5.1) */
export function MotorwaySign({ size = 40, className = '' }: SignIconProps) {
  return (
    <BlueRect size={size} className={className} label="Автомагістраль" fill="#059669">
      <rect x="30" y="40" width="40" height="22" rx="3" fill="white" />
      <line x1="50" y1="40" x2="50" y2="62" stroke="#059669" strokeWidth="3" strokeDasharray="4 3" />
    </BlueRect>
  );
}

/** Готель (6.2) */
export function HotelSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <BlueRect size={size} className={className} label="Готель">
      <rect x="30" y="40" width="40" height="30" rx="2" fill="white" />
      <rect x="38" y="48" width="8" height="8" fill="#2563eb" />
      <rect x="54" y="48" width="8" height="8" fill="#2563eb" />
      <rect x="46" y="56" width="8" height="14" fill="#2563eb" />
    </BlueRect>
  );
}

/** Харчування (6.4) */
export function FoodSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <BlueRect size={size} className={className} label="Харчування">
      <ellipse cx="42" cy="55" rx="10" ry="6" fill="white" />
      <rect x="55" y="48" width="4" height="18" rx="1" fill="white" />
      <circle cx="57" cy="44" r="4" fill="white" />
    </BlueRect>
  );
}

/** Телефон (6.6) */
export function TelephoneSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <BlueRect size={size} className={className} label="Телефон">
      <rect x="38" y="32" width="24" height="40" rx="4" fill="white" />
      <circle cx="50" cy="58" r="6" fill="#2563eb" />
      <rect x="44" y="36" width="12" height="4" rx="1" fill="#2563eb" />
    </BlueRect>
  );
}

/** Медична допомога (6.1) */
export function FirstAidSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <BlueRect size={size} className={className} label="Медична допомога">
      <rect x="46" y="28" width="8" height="44" fill="white" rx="1" />
      <rect x="34" y="44" width="32" height="8" fill="white" rx="1" />
    </BlueRect>
  );
}

/** СТО (6.8) */
export function CarServiceSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <BlueRect size={size} className={className} label="СТО">
      <rect x="28" y="48" width="44" height="18" rx="3" fill="white" />
      <circle cx="38" cy="66" r="5" fill="#64748b" />
      <circle cx="62" cy="66" r="5" fill="#64748b" />
      <path d="M32 48 L40 38 L60 38 L68 48" fill="white" />
    </BlueRect>
  );
}

/** Табличка до знаку (8.x) */
export function SignPlateSign({ size = 40, className = '' }: SignIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={`${base} ${className}`} role="img" aria-label="Табличка">
      <rect x="15" y="30" width="70" height="40" rx="4" fill="white" stroke="#64748b" strokeWidth="3" />
      <text x="50" y="58" fontSize="14" textAnchor="middle" fill="#1e293b" fontWeight="bold">200 м</text>
    </svg>
  );
}

/** Мінімальна швидкість (3.27) */
export function MinSpeedSign({ size = 40, className = '', limit = 40 }: SignIconProps & { limit?: number }) {
  return (
    <BlueCircle size={size} className={className} label={`Мін. ${limit}`}>
      <text x="50" y="62" fontSize="32" textAnchor="middle" fill="white" fontWeight="bold">{limit}</text>
    </BlueCircle>
  );
}
