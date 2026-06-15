import React, { useId } from 'react';

export interface LensConfig {
  cy: number;
  isOn: boolean;
  activeColor: string;
  glowColor: string;
  dimColor: string;
  /** Custom SVG content inside lens (arrow, pedestrian, X, etc.) */
  children?: React.ReactNode;
  r?: number;
}

export function LightDefs({ uid }: { uid: string }) {
  return (
    <defs>
      <linearGradient id={`bodyGrad-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#2d2d2d" />
        <stop offset="50%" stopColor="#5c5c5c" />
        <stop offset="100%" stopColor="#2d2d2d" />
      </linearGradient>
      <linearGradient id={`hoodGrad-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#3d3d3d" />
        <stop offset="100%" stopColor="#1a1a1a" />
      </linearGradient>
      <radialGradient id={`lensOn-${uid}`} cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="white" stopOpacity="0.4" />
        <stop offset="100%" stopColor="black" stopOpacity="0.08" />
      </radialGradient>
      <radialGradient id={`lensOff-${uid}`} cx="35%" cy="30%" r="65%">
        <stop offset="0%" stopColor="white" stopOpacity="0.06" />
        <stop offset="100%" stopColor="black" stopOpacity="0.45" />
      </radialGradient>
      <filter id={`glow-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur stdDeviation="3.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

export function SignalLens({
  uid,
  cx,
  cy,
  isOn,
  activeColor,
  glowColor,
  dimColor,
  children,
  r = 14,
}: LensConfig & { uid: string; cx: number }) {
  return (
    <g>
      <path
        d={`M ${cx - 20} ${cy - 22} Q ${cx} ${cy - 28} ${cx + 20} ${cy - 22} L ${cx + 18} ${cy - 16} Q ${cx} ${cy - 20} ${cx - 18} ${cy - 16} Z`}
        fill={`url(#hoodGrad-${uid})`}
        stroke="#111"
        strokeWidth="0.4"
      />
      <circle cx={cx} cy={cy} r={r + 2.5} fill="#080808" />
      {isOn && (
        <circle cx={cx} cy={cy} r={r + 7} fill={activeColor} opacity="0.28" filter={`url(#glow-${uid})`} />
      )}
      <circle cx={cx} cy={cy} r={r} fill={isOn ? activeColor : dimColor} />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={`url(#lensOn-${uid})`}
        opacity={isOn ? 1 : 0.5}
        style={{ mixBlendMode: 'overlay' }}
      />
      {!isOn && <circle cx={cx} cy={cy} r={r} fill={`url(#lensOff-${uid})`} />}
      <ellipse cx={cx - 4} cy={cy - 5} rx={5} ry={3.5} fill="white" opacity={isOn ? 0.5 : 0.07} />
      {isOn && <circle cx={cx} cy={cy} r={7} fill={glowColor} opacity="0.45" filter={`url(#glow-${uid})`} />}
      {children && (
        <g opacity={isOn ? 1 : 0.2}>{children}</g>
      )}
    </g>
  );
}

export function LightHousing({
  uid,
  width,
  height,
  x = 8,
  y = 12,
  children,
}: {
  uid: string;
  width: number;
  height: number;
  x?: number;
  y?: number;
  children: React.ReactNode;
}) {
  return (
    <>
      <rect x={width / 2 - 6} y={0} width={12} height={12} rx={2} fill="#1a1a1a" />
      <rect
        x={x}
        y={y}
        width={width - x * 2}
        height={height - y - 8}
        rx={9}
        fill={`url(#bodyGrad-${uid})`}
        stroke="#111"
        strokeWidth="1.2"
      />
      <rect x={x + 3} y={y + 4} width={width - (x + 3) * 2} height={height - y - 16} rx={7} fill="#1a1a1a" opacity="0.25" />
      {children}
      <rect x={width / 2 - 18} y={height - 14} width={36} height={7} rx={2} fill="#2d2d2d" />
    </>
  );
}

export function useLightUid() {
  return useId().replace(/:/g, '');
}

/** Arrow icon for lens */
export function ArrowIcon({ direction }: { direction: 'left' | 'right' | 'down' }) {
  if (direction === 'left') {
    return <path d="M0 0 L-8 0 L-8 -6 L-16 0 L-8 6 L-8 0" fill="white" transform="translate(0,0)" />;
  }
  if (direction === 'right') {
    return <path d="M0 0 L8 0 L8 -6 L16 0 L8 6 L8 0" fill="white" />;
  }
  return <path d="M0 -8 L-6 0 L-2 0 L-2 8 L2 8 L2 0 L6 0 Z" fill="white" />;
}

/** Pedestrian silhouettes */
export function PedStandingIcon() {
  return (
    <g fill="white" transform="translate(-8,-12)">
      <circle cx="8" cy="4" r="3" />
      <rect x="6" y="7" width="4" height="8" rx="1" />
      <line x1="6" y1="10" x2="2" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="10" x2="14" y2="14" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="7" y1="15" x2="5" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="9" y1="15" x2="11" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

export function PedWalkingIcon() {
  return (
    <g fill="white" transform="translate(-8,-12)">
      <circle cx="8" cy="4" r="3" />
      <rect x="6" y="7" width="4" height="7" rx="1" transform="rotate(8 8 10)" />
      <line x1="6" y1="9" x2="1" y2="7" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="9" x2="14" y2="12" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="7" y1="14" x2="4" y2="20" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <line x1="9" y1="14" x2="13" y2="19" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

export function RedXIcon() {
  return (
    <g stroke="white" strokeWidth="3.5" strokeLinecap="round">
      <line x1="-8" y1="-8" x2="8" y2="8" />
      <line x1="8" y1="-8" x2="-8" y2="8" />
    </g>
  );
}

export interface InteractiveLightCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  controls?: React.ReactNode;
}

export function InteractiveLightCard({ title, description, children, controls }: InteractiveLightCardProps) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm">
      <div className="flex justify-center mb-3">{children}</div>
      {controls && <div className="flex flex-wrap justify-center gap-2 mb-3">{controls}</div>}
      <p className="text-sm font-bold text-slate-900">{title}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

export function LightControlBtn({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg px-2.5 py-1 text-4xs font-bold transition-all ${
        active ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {label}
    </button>
  );
}
