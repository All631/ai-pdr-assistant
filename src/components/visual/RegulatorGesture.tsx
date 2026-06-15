import React from 'react';

export type RegulatorVariant = 1 | 2 | 3;

interface RegulatorGestureProps {
  variant: RegulatorVariant;
  label: string;
  description: string;
  legalDetails?: string;
}

function RegulatorBody({
  leftArm,
  rightArm,
  batonAngle = 0,
  showBaton = true,
}: {
  leftArm: React.ReactNode;
  rightArm: React.ReactNode;
  batonAngle?: number;
  showBaton?: boolean;
}) {
  return (
    <>
      <ellipse cx="60" cy="132" rx="22" ry="4" fill="#000" opacity="0.12" />
      <rect x="48" y="98" width="10" height="32" rx="3" fill="#1e293b" />
      <rect x="62" y="98" width="10" height="32" rx="3" fill="#1e293b" />
      <rect x="46" y="126" width="14" height="5" rx="2" fill="#0f172a" />
      <rect x="60" y="126" width="14" height="5" rx="2" fill="#0f172a" />
      <path d="M38 52 L82 52 L78 98 L42 98 Z" fill="#f97316" stroke="#ea580c" strokeWidth="1" />
      <rect x="40" y="58" width="40" height="4" rx="1" fill="#fef08a" opacity="0.9" />
      <rect x="40" y="68" width="40" height="4" rx="1" fill="#fef08a" opacity="0.9" />
      <rect x="42" y="78" width="36" height="3" rx="1" fill="#fef08a" opacity="0.7" />
      <path d="M38 52 L42 98 L48 98 L48 52 Z" fill="#fb923c" />
      <path d="M82 52 L78 98 L72 98 L72 52 Z" fill="#fb923c" />
      <rect x="48" y="50" width="24" height="12" rx="3" fill="#2563eb" />
      {leftArm}
      {rightArm}
      <circle cx="60" cy="36" r="14" fill="#fcd9b6" stroke="#d4a574" strokeWidth="1" />
      <ellipse cx="60" cy="26" rx="16" ry="6" fill="#1e3a5f" />
      <rect x="44" y="22" width="32" height="8" rx="2" fill="#1e3a5f" />
      <path d="M44 26 L76 26 L74 30 L46 30 Z" fill="#2563eb" />
      <circle cx="60" cy="24" r="3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
      {showBaton && (
        <g transform={`rotate(${batonAngle} 72 70)`}>
          <rect x="70" y="55" width="4" height="36" rx="1.5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
          <rect x="70" y="55" width="4" height="12" rx="1" fill="#dc2626" />
          <rect x="70" y="67" width="4" height="12" rx="1" fill="#fef08a" />
          <rect x="70" y="79" width="4" height="12" rx="1" fill="#dc2626" />
        </g>
      )}
    </>
  );
}

export function RegulatorGesture({ variant, label, description, legalDetails }: RegulatorGestureProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 text-center shadow-sm">
      <svg viewBox="0 0 120 140" className="mx-auto h-32 w-28 sm:h-36 sm:w-32" role="img" aria-label={label}>
        <defs>
          <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#e2e8f0" />
          </linearGradient>
        </defs>
        <rect width="120" height="140" fill="url(#groundGrad)" rx="8" />
        {variant === 1 && (
          <RegulatorBody
            leftArm={
              <>
                <rect x="34" y="28" width="9" height="28" rx="4" fill="#2563eb" transform="rotate(-35 38 42)" />
                <circle cx="28" cy="22" r="5" fill="#fcd9b6" />
              </>
            }
            rightArm={
              <>
                <rect x="77" y="28" width="9" height="28" rx="4" fill="#2563eb" transform="rotate(35 82 42)" />
                <circle cx="92" cy="22" r="5" fill="#fcd9b6" />
              </>
            }
            batonAngle={-20}
            showBaton={false}
          />
        )}
        {variant === 2 && (
          <RegulatorBody
            leftArm={
              <>
                <rect x="14" y="58" width="28" height="9" rx="4" fill="#2563eb" />
                <circle cx="10" cy="62" r="5" fill="#fcd9b6" />
              </>
            }
            rightArm={
              <>
                <rect x="78" y="58" width="28" height="9" rx="4" fill="#2563eb" />
                <circle cx="110" cy="62" r="5" fill="#fcd9b6" />
              </>
            }
            batonAngle={0}
          />
        )}
        {variant === 3 && (
          <RegulatorBody
            leftArm={
              <>
                <rect x="32" y="58" width="9" height="26" rx="4" fill="#2563eb" />
                <circle cx="34" cy="86" r="5" fill="#fcd9b6" />
              </>
            }
            rightArm={
              <>
                <rect x="72" y="54" width="32" height="9" rx="4" fill="#2563eb" />
                <circle cx="106" cy="58" r="5" fill="#fcd9b6" />
              </>
            }
            batonAngle={12}
          />
        )}
        {variant === 2 && (
          <>
            <text x="60" y="12" fontSize="8" textAnchor="middle" fill="#64748b" fontWeight="bold">
              СПИНА
            </text>
            <text x="60" y="138" fontSize="8" textAnchor="middle" fill="#64748b" fontWeight="bold">
              ГРУДИ
            </text>
          </>
        )}
        {variant === 3 && (
          <>
            <text x="108" y="12" fontSize="7" textAnchor="middle" fill="#64748b">
              ЗАБОРОНЕНО
            </text>
            <text x="12" y="62" fontSize="7" textAnchor="middle" fill="#16a34a" fontWeight="bold">
              ДОЗВОЛЕНО
            </text>
          </>
        )}
      </svg>
      <p className="mt-3 text-sm font-bold text-slate-900">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-600">{description}</p>
      {legalDetails && (
        <p className="mt-2 text-4xs leading-relaxed text-slate-500 text-left bg-slate-50 rounded-lg p-2.5 border border-slate-100">
          {legalDetails}
        </p>
      )}
    </div>
  );
}

export const REGULATOR_GESTURES = [
  {
    variant: 1 as RegulatorVariant,
    label: 'Рука піднята вгору',
    description: 'Рух заборонено всім учасникам — водіям і пішоходам.',
    legalDetails:
      'За п. 8.7 ПДР: сигнал «Увага! Всім стояти!» — регулювальник підняв руку вгору або обидві руки. Усі ТЗ та пішоходи зобов\'язані зупинитися. Пішоходи не переходять проїзну частину. Сигнал має пріоритет над світлофором і знаками.',
  },
  {
    variant: 2 as RegulatorVariant,
    label: 'Руки витягнуті в сторони',
    description: 'З правого боку — прямо та праворуч; з лівого — прямо та ліворуч; з грудей і спини — заборонено.',
    legalDetails:
      'За п. 8.7 ПДР: руки опущені або витягнуті в сторони. З правого боку регулювальника дозволено рух прямо та праворуч; з лівого — прямо та ліворуч. З боку грудей та спини рух заборонено всім. Пішоходи можуть переходити проїзну частину за спиною регулювальника.',
  },
  {
    variant: 3 as RegulatorVariant,
    label: 'Права рука витягнута вперед',
    description: 'З лівого боку — у всіх напрямках; з грудей — лише праворуч; з правого боку та спини — заборонено.',
    legalDetails:
      'За п. 8.7 ПДР: права рука витягнута вперед. З лівого боку регулювальника дозволено рух у всіх напрямках. З боку грудей — лише праворуч. З правого боку та спини рух заборонено. Пішоходи можуть переходити за спиною регулювальника.',
  },
];
