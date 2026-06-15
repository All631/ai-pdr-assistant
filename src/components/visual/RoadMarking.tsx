import React, { useId } from 'react';
import type { RoadMarkingEntry } from '../../data/roadMarkingsData';

function AsphaltSurface({ children, patternId }: { children: React.ReactNode; patternId: string }) {
  return (
    <svg viewBox="0 0 320 120" className="w-full h-28 mb-3" role="img">
      <defs>
        <pattern id={patternId} width="8" height="8" patternUnits="userSpaceOnUse">
          <rect width="8" height="8" fill="#3d4450" />
          <circle cx="2" cy="3" r="0.8" fill="#4a5160" opacity="0.6" />
          <circle cx="6" cy="6" r="0.6" fill="#353b47" opacity="0.5" />
          <circle cx="5" cy="1" r="0.5" fill="#525868" opacity="0.4" />
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

      {/* Sky / horizon */}
      <rect x="0" y="0" width="320" height="30" fill="#94a3b8" opacity="0.3" />
      <rect x="0" y="28" width="320" height="4" fill="#64748b" opacity="0.5" />

      {/* Road surface — perspective trapezoid */}
      <path
        d="M 20 32 L 300 32 L 320 118 L 0 118 Z"
        fill="url(#roadPerspective)"
        stroke="#1e293b"
        strokeWidth="0.5"
      />
      <path
        d="M 20 32 L 300 32 L 320 118 L 0 118 Z"
        fill={`url(#${patternId})`}
        opacity="0.85"
      />

      {/* Road edge lines */}
      <line x1="24" y1="34" x2="8" y2="116" stroke="white" strokeWidth="2" opacity="0.7" />
      <line x1="296" y1="34" x2="312" y2="116" stroke="white" strokeWidth="2" opacity="0.7" />

      {/* Center markings */}
      <g filter="url(#markingGlow)">{children}</g>

      {/* Lane texture lines (subtle) */}
      <line x1="80" y1="40" x2="70" y2="110" stroke="#4a5160" strokeWidth="0.5" opacity="0.3" />
      <line x1="240" y1="40" x2="250" y2="110" stroke="#4a5160" strokeWidth="0.5" opacity="0.3" />
    </svg>
  );
}

function CenterMarking({ type }: { type: RoadMarkingEntry['type'] }) {
  const cx = 160;

  if (type === 'solid') {
    return (
      <line x1={cx} y1="36" x2={cx} y2="112" stroke="white" strokeWidth="5" strokeLinecap="round" />
    );
  }

  if (type === 'dashed') {
    const dashes = [36, 48, 60, 72, 84, 96, 108];
    return (
      <>
        {dashes.map((y, i) => (
          <line key={i} x1={cx} y1={y} x2={cx} y2={y + 8} stroke="white" strokeWidth="5" strokeLinecap="round" />
        ))}
      </>
    );
  }

  return (
    <>
      <line x1={cx - 6} y1="36" x2={cx - 6} y2="112" stroke="white" strokeWidth="4" strokeLinecap="round" />
      <line x1={cx + 6} y1="36" x2={cx + 6} y2="112" stroke="white" strokeWidth="4" strokeLinecap="round" />
    </>
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
        <CenterMarking type={entry.type} />
      </AsphaltSurface>
      <p className="text-xs font-bold text-slate-800">{entry.label}</p>
      <p className="mt-1 text-4xs leading-relaxed text-slate-600">{entry.rule}</p>
      <p className="mt-2 text-4xs leading-relaxed text-slate-500 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
        {entry.legalDetails}
      </p>
    </div>
  );
}
