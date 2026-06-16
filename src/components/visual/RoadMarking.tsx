import React, { useId } from 'react';
import type { RoadMarkingEntry, RoadMarkingType } from '../../data/roadMarkingsData';

/** Interpolate x on road edges at given y (trapezoid perspective). */
function roadXAtY(y: number, side: 'left' | 'right' | 'center'): number {
  const t = (y - 28) / (118 - 28);
  const left = 28 + t * (8 - 28);
  const right = 292 + t * (312 - 292);
  if (side === 'left') return left;
  if (side === 'right') return right;
  return (left + right) / 2;
}

function MarkingOverlay({ type }: { type: RoadMarkingType }) {
  switch (type) {
    case 'solid':
      return (
        <line
          x1={roadXAtY(38, 'center')}
          y1="38"
          x2={roadXAtY(112, 'center')}
          y2="112"
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
        />
      );
    case 'dashed':
      return (
        <>
          {[38, 52, 66, 80, 94, 108].map((y) => (
            <line
              key={y}
              x1={roadXAtY(y, 'center')}
              y1={y}
              x2={roadXAtY(y + 9, 'center')}
              y2={y + 9}
              stroke="white"
              strokeWidth="5"
              strokeLinecap="round"
            />
          ))}
        </>
      );
    case 'double':
      return (
        <>
          <line
            x1={roadXAtY(38, 'center') - 5}
            y1="38"
            x2={roadXAtY(112, 'center') - 5}
            y2="112"
            stroke="white"
            strokeWidth="4"
          />
          <line
            x1={roadXAtY(38, 'center') + 5}
            y1="38"
            x2={roadXAtY(112, 'center') + 5}
            y2="112"
            stroke="white"
            strokeWidth="4"
          />
        </>
      );
    case 'zebra':
      return (
        <>
          {Array.from({ length: 14 }).map((_, i) => {
            const x = 95 + i * 11;
            return (
              <rect
                key={i}
                x={x}
                y="58"
                width="7"
                height="48"
                fill="white"
                transform={`skewX(-12 ${x + 3.5} 82)`}
                opacity="0.95"
              />
            );
          })}
        </>
      );
    case 'stop-line':
      return (
        <>
          <line x1="55" y1="98" x2="265" y2="98" stroke="white" strokeWidth="7" strokeLinecap="round" />
          <text x="160" y="90" fontSize="9" textAnchor="middle" fill="white" opacity="0.65" fontWeight="bold">
            STOP
          </text>
        </>
      );
    case 'yield-triangle':
      return (
        <>
          {Array.from({ length: 5 }).map((_, row) =>
            Array.from({ length: row + 1 }).map((_, col) => {
              const bx = 148 + col * 14 - row * 7;
              const by = 108 - row * 10;
              return (
                <polygon
                  key={`${row}-${col}`}
                  points={`${bx},${by} ${bx + 7},${by} ${bx + 3.5},${by - 7}`}
                  fill="white"
                  opacity="0.92"
                />
              );
            })
          )}
        </>
      );
    case 'lane-arrow':
      return (
        <>
          <path
            d="M158 72 L158 108 M158 72 L148 86 M158 72 L168 86"
            stroke="white"
            strokeWidth="4.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M182 78 L208 98 L182 118"
            stroke="white"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
    case 'island':
      return (
        <>
          <path
            d="M142 68 L178 68 L184 104 L136 104 Z"
            fill="white"
            opacity="0.96"
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          <path d="M146 72 L174 72 L178 100 L142 100 Z" fill="#64748b" />
          {[76, 82, 88, 94].map((y) => (
            <line key={y} x1="150" y1={y} x2="170" y2={y} stroke="white" strokeWidth="1.5" opacity="0.8" />
          ))}
        </>
      );
    case 'yellow-solid-curb':
      return (
        <line
          x1={roadXAtY(36, 'left') - 6}
          y1="36"
          x2={roadXAtY(114, 'left') - 10}
          y2="114"
          stroke="#eab308"
          strokeWidth="5"
          strokeLinecap="round"
        />
      );
    case 'yellow-dashed-curb':
      return (
        <>
          {[36, 52, 68, 84, 100].map((y) => (
            <line
              key={y}
              x1={roadXAtY(y, 'left') - 5}
              y1={y}
              x2={roadXAtY(y + 11, 'left') - 7}
              y2={y + 11}
              stroke="#eab308"
              strokeWidth="5"
              strokeLinecap="round"
            />
          ))}
        </>
      );
    default:
      return null;
  }
}

function RoadPerspective3D({
  children,
  patternId,
  uid,
}: {
  children: React.ReactNode;
  patternId: string;
  uid: string;
}) {
  return (
    <svg viewBox="0 0 320 140" className="w-full h-36 mb-3" role="img" aria-hidden>
      <defs>
        <pattern id={patternId} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill="#3d4450" />
          <circle cx="2" cy="4" r="1" fill="#555d6e" opacity="0.5" />
          <circle cx="7" cy="8" r="0.8" fill="#2f3540" opacity="0.4" />
        </pattern>
        <linearGradient id={`sky-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#cbd5e1" />
        </linearGradient>
        <linearGradient id={`road-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#64748b" />
          <stop offset="45%" stopColor="#475569" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>
        <linearGradient id={`grass-${uid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
        <filter id={`glow-${uid}`}>
          <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#fff" floodOpacity="0.35" />
        </filter>
      </defs>

      <rect x="0" y="0" width="320" height="30" fill={`url(#sky-${uid})`} />
      <rect x="0" y="28" width="320" height="4" fill="#94a3b8" opacity="0.5" />

      <path d="M 0 30 L 28 30 L 8 138 L 0 138 Z" fill={`url(#grass-${uid})`} opacity="0.55" />
      <path d="M 292 30 L 320 30 L 320 138 L 312 138 Z" fill={`url(#grass-${uid})`} opacity="0.55" />

      <path d="M 8 30 L 28 30 L 12 138 L 0 138 Z" fill="#9ca3af" stroke="#6b7280" strokeWidth="0.5" />
      <path d="M 292 30 L 312 30 L 320 138 L 308 138 Z" fill="#9ca3af" stroke="#6b7280" strokeWidth="0.5" />

      <path
        d="M 28 30 L 292 30 L 320 138 L 0 138 Z"
        fill={`url(#road-${uid})`}
        stroke="#1e293b"
        strokeWidth="0.6"
      />
      <path d="M 28 30 L 292 30 L 320 138 L 0 138 Z" fill={`url(#${patternId})`} opacity="0.85" />

      <line
        x1={roadXAtY(32, 'left')}
        y1="32"
        x2={roadXAtY(134, 'left')}
        y2="134"
        stroke="white"
        strokeWidth="2.5"
        opacity="0.7"
      />
      <line
        x1={roadXAtY(32, 'right')}
        y1="32"
        x2={roadXAtY(134, 'right')}
        y2="134"
        stroke="white"
        strokeWidth="2.5"
        opacity="0.7"
      />

      <circle cx="160" cy="28" r="1.5" fill="#94a3b8" opacity="0.4" />

      <g filter={`url(#glow-${uid})`}>{children}</g>

      <path d="M 0 130 L 320 130 L 320 140 L 0 140 Z" fill="#000" opacity="0.12" />
    </svg>
  );
}

interface RoadMarkingProps {
  entry: RoadMarkingEntry;
}

export function RoadMarking({ entry }: RoadMarkingProps) {
  const uid = useId().replace(/:/g, '');
  const patternId = `asphalt-${uid}`;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
      <RoadPerspective3D patternId={patternId} uid={uid}>
        <MarkingOverlay type={entry.type} />
      </RoadPerspective3D>

      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-bold text-slate-800">{entry.label}</p>
        <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-4xs font-mono text-slate-600">
          {entry.code}
        </span>
      </div>

      <p className="mt-0.5 text-4xs font-mono text-indigo-600">{entry.pdrReference}</p>
      <p className="mt-1.5 text-4xs leading-relaxed text-slate-600">{entry.rule}</p>

      {entry.exceptions && entry.exceptions.length > 0 && (
        <div className="mt-2 rounded-lg border border-amber-100 bg-amber-50/60 p-2.5">
          <p className="text-4xs font-bold text-amber-800 mb-1">Винятки (розділ 34):</p>
          <ul className="list-disc pl-4 space-y-0.5">
            {entry.exceptions.map((ex) => (
              <li key={ex} className="text-4xs text-amber-900/90 leading-relaxed">
                {ex}
              </li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-2 text-4xs leading-relaxed text-slate-500 bg-slate-50 rounded-lg p-2.5 border border-slate-100">
        {entry.legalDetails}
      </p>
    </div>
  );
}
