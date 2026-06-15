import React, { useId } from 'react';

interface TrafficLightCardProps {
  redOn: boolean;
  yellowOn: boolean;
  greenOn: boolean;
  label: string;
  rule: string;
}

const SIGNALS = [
  { key: 'red' as const, cy: 52, active: '#ef4444', glow: '#fca5a5', dim: '#3f1515' },
  { key: 'yellow' as const, cy: 100, active: '#facc15', glow: '#fef08a', dim: '#3f3510' },
  { key: 'green' as const, cy: 148, active: '#22c55e', glow: '#86efac', dim: '#143320' },
];

function SignalLens({
  cy,
  isOn,
  activeColor,
  glowColor,
  dimColor,
  uid,
}: {
  cy: number;
  isOn: boolean;
  activeColor: string;
  glowColor: string;
  dimColor: string;
  uid: string;
}) {
  const cx = 40;
  const r = 16;

  return (
    <g>
      <path
        d={`M ${cx - 22} ${cy - 24} Q ${cx} ${cy - 30} ${cx + 22} ${cy - 24} L ${cx + 20} ${cy - 18} Q ${cx} ${cy - 22} ${cx - 20} ${cy - 18} Z`}
        fill={`url(#hoodGrad-${uid})`}
        stroke="#1a1a1a"
        strokeWidth="0.5"
      />
      <circle cx={cx} cy={cy} r={r + 3} fill="#0a0a0a" />
      {isOn && (
        <circle cx={cx} cy={cy} r={r + 8} fill={activeColor} opacity="0.25" filter={`url(#glow-${uid})`} />
      )}
      <circle cx={cx} cy={cy} r={r} fill={isOn ? activeColor : dimColor} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={`url(#lensGrad-${isOn ? 'on' : 'off'}-${uid})`}
        opacity={isOn ? 1 : 0.6}
      />
      <ellipse cx={cx - 5} cy={cy - 6} rx={6} ry={4} fill="white" opacity={isOn ? 0.45 : 0.08} />
      <ellipse cx={cx + 4} cy={cy + 5} rx={3} ry={2} fill="white" opacity={isOn ? 0.15 : 0.04} />
      {isOn && (
        <circle cx={cx} cy={cy} r={8} fill={glowColor} opacity="0.5" filter={`url(#glow-${uid})`} />
      )}
    </g>
  );
}

export function TrafficLightCard({ redOn, yellowOn, greenOn, label, rule }: TrafficLightCardProps) {
  const uid = useId().replace(/:/g, '');
  const states = { red: redOn, yellow: yellowOn, green: greenOn };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 text-center shadow-sm">
      <svg viewBox="0 0 80 200" className="mx-auto h-44 w-[4.5rem]" role="img" aria-label={label}>
        <defs>
          <linearGradient id={`bodyGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2d2d2d" />
            <stop offset="30%" stopColor="#4a4a4a" />
            <stop offset="50%" stopColor="#5c5c5c" />
            <stop offset="70%" stopColor="#4a4a4a" />
            <stop offset="100%" stopColor="#2d2d2d" />
          </linearGradient>
          <linearGradient id={`hoodGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3d3d3d" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>
          <radialGradient id={`lensGrad-on-${uid}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="white" stopOpacity="0.35" />
            <stop offset="100%" stopColor="black" stopOpacity="0.1" />
          </radialGradient>
          <radialGradient id={`lensGrad-off-${uid}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="white" stopOpacity="0.08" />
            <stop offset="100%" stopColor="black" stopOpacity="0.4" />
          </radialGradient>
          <filter id={`glow-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Mounting bracket */}
        <rect x="34" y="0" width="12" height="14" rx="2" fill="#1a1a1a" />
        <rect x="36" y="2" width="8" height="10" rx="1" fill="#404040" />

        {/* Main housing */}
        <rect x="8" y="12" width="64" height="176" rx="10" fill={`url(#bodyGrad-${uid})`} stroke="#1a1a1a" strokeWidth="1.5" />
        <rect x="12" y="16" width="56" height="168" rx="8" fill="#1e1e1e" opacity="0.3" />

        {/* Side highlights (metal sheen) */}
        <rect x="10" y="14" width="3" height="172" rx="1" fill="white" opacity="0.06" />
        <rect x="67" y="14" width="3" height="172" rx="1" fill="black" opacity="0.15" />

        {SIGNALS.map((sig) => (
          <SignalLens
            key={sig.key}
            uid={uid}
            cy={sig.cy}
            isOn={states[sig.key]}
            activeColor={sig.active}
            glowColor={sig.glow}
            dimColor={sig.dim}
          />
        ))}

        {/* Base plate */}
        <rect x="20" y="188" width="40" height="8" rx="2" fill="#2d2d2d" stroke="#1a1a1a" strokeWidth="0.5" />
      </svg>
      <p className="mt-3 text-sm font-bold text-slate-900">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{rule}</p>
    </div>
  );
}
