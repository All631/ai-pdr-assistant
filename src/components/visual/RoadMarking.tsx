import React, { useId } from 'react';
import type { RoadMarkingEntry, RoadMarkingType } from '../../data/roadMarkingsData';

function MarkingOverlay({ type }: { type: RoadMarkingType }) {
  const cx = 160;

  switch (type) {
    case 'solid':
      return <line x1={cx} y1="36" x2={cx} y2="112" stroke="white" strokeWidth="5" strokeLinecap="round" />;
    case 'dashed':
      return (
        <>
          {[36, 48, 60, 72, 84, 96, 108].map((y, i) => (
            <line key={i} x1={cx} y1={y} x2={cx} y2={y + 8} stroke="white" strokeWidth="5" strokeLinecap="round" />
          ))}
        </>
      );
    case 'double':
      return (
        <>
          <line x1={cx - 6} y1="36" x2={cx - 6} y2="112" stroke="white" strokeWidth="4" strokeLinecap="round" />
          <line x1={cx + 6} y1="36" x2={cx + 6} y2="112" stroke="white" strokeWidth="4" strokeLinecap="round" />
        </>
      );
    case 'zebra':
      return (
        <>
          {Array.from({ length: 12 }).map((_, i) => (
            <rect
              key={i}
              x={100 + i * 10}
              y="55"
              width="6"
              height="50"
              fill="white"
              transform={`skewX(-8 ${103 + i * 10} 80)`}
            />
          ))}
        </>
      );
    case 'stop-line':
      return (
        <>
          <line x1="60" y1="95" x2="260" y2="95" stroke="white" strokeWidth="6" strokeLinecap="round" />
          <text x="160" y="88" fontSize="8" textAnchor="middle" fill="white" opacity="0.7">
            STOP
          </text>
        </>
      );
    case 'yield-triangle':
      return (
        <>
          {Array.from({ length: 6 }).map((_, row) =>
            Array.from({ length: row + 1 }).map((_, col) => (
              <polygon
                key={`${row}-${col}`}
                points={`${150 + col * 12 - row * 6},${105 - row * 8} ${156 + col * 12 - row * 6},${105 - row * 8} ${153 + col * 12 - row * 6},${99 - row * 8}`}
                fill="white"
                opacity="0.9"
              />
            ))
          )}
        </>
      );
    case 'lane-arrow':
      return (
        <>
          <path d="M155 75 L155 105 M155 75 L145 88 M155 75 L165 88" stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M175 80 L195 95 L175 110" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </>
      );
    case 'island':
      return (
        <>
          <path d="M145 70 L175 70 L180 100 L140 100 Z" fill="white" opacity="0.95" />
          <path d="M148 73 L172 73 L176 97 L144 97 Z" fill="#475569" />
          <line x1="152" y1="78" x2="168" y2="78" stroke="white" strokeWidth="1.5" />
          <line x1="152" y1="84" x2="168" y2="84" stroke="white" strokeWidth="1.5" />
          <line x1="152" y1="90" x2="168" y2="90" stroke="white" strokeWidth="1.5" />
        </>
      );
    case 'yellow-solid-curb':
      return (
        <>
          <line x1="28" y1="36" x2="18" y2="112" stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
          <line x1="34" y1="36" x2="24" y2="112" stroke="#ca8a04" strokeWidth="2" opacity="0.5" />
        </>
      );
    case 'yellow-dashed-curb':
      return (
        <>
          {[36, 52, 68, 84, 100].map((y, i) => (
            <line key={i} x1="30" y1={y} x2="26" y2={y + 10} stroke="#eab308" strokeWidth="5" strokeLinecap="round" />
          ))}
        </>
      );
    default:
      return null;
  }
}

function AsphaltSurface({ children, patternId }: { children: React.ReactNode; patternId: string }) {
  return (
    <svg viewBox="0 0 320 120" className="w-full h-32 mb-3" role="img">
      <defs>
        <pattern id={patternId} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#3d4450" />
          <circle cx="2" cy="3" r="0.8" fill="#4a5160" opacity="0.6" />
          <circle cx="6" cy="6" r="0.6" fill="#353b47" opacity="0.5" />
        </pattern>
        <linearGradient id="roadPerspective" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#525868" />
          <stop offset="100%" stopColor="#2d323c" />
        </linearGradient>
        <filter id="markingGlow">
          <feGaussianBlur stdDeviation="0.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Sky */}
      <rect x="0" y="0" width="320" height="28" fill="#87a8c4" opacity="0.5" />
      <rect x="0" y="26" width="320" height="6" fill="#6b7280" opacity="0.4" />

      {/* Shoulder / curb left */}
      <path d="M 0 32 L 20 32 L 8 118 L 0 118 Z" fill="#4ade80" opacity="0.35" />
      <path d="M 300 32 L 320 32 L 320 118 L 312 118 Z" fill="#4ade80" opacity="0.35" />

      {/* Road */}
      <path d="M 20 32 L 300 32 L 320 118 L 0 118 Z" fill="url(#roadPerspective)" stroke="#1e293b" strokeWidth="0.5" />
      <path d="M 20 32 L 300 32 L 320 118 L 0 118 Z" fill={`url(#${patternId})`} opacity="0.88" />

      {/* Edge lines */}
      <line x1="24" y1="34" x2="10" y2="116" stroke="white" strokeWidth="2.5" opacity="0.75" />
      <line x1="296" y1="34" x2="310" y2="116" stroke="white" strokeWidth="2.5" opacity="0.75" />

      {/* Curb stones hint */}
      <line x1="14" y1="34" x2="6" y2="116" stroke="#9ca3af" strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />

      <g filter="url(#markingGlow)">{children}</g>

      {/* Lane wear */}
      <line x1="80" y1="40" x2="68" y2="110" stroke="#4a5160" strokeWidth="0.5" opacity="0.25" />
      <line x1="240" y1="40" x2="252" y2="110" stroke="#4a5160" strokeWidth="0.5" opacity="0.25" />
    </svg>
  );
}

interface RoadMarkingProps {
  entry: RoadMarkingEntry;
}

export function RoadMarking({ entry }: RoadMarkingProps) {
  const patternId = `asphaltTex-${useId().replace(/:/g, '')}`;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm">
      <AsphaltSurface patternId={patternId}>
        <MarkingOverlay type={entry.type} />
      </AsphaltSurface>
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold text-slate-800">{entry.label}</p>
        <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-4xs font-mono text-slate-500">
          {entry.code}
        </span>
      </div>
      <p className="mt-1 text-4xs leading-relaxed text-slate-600">{entry.rule}</p>
      <p className="mt-2 text-4xs leading-relaxed text-slate-500 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
        {entry.legalDetails}
      </p>
    </div>
  );
}
