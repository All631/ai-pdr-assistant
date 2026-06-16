import React, { useId } from 'react';
import type {
  ApproachRule,
  ApproachSide,
  RegulatorGestureId,
  VehicleMove,
} from '../../../data/regulatorGesturesData';

const NPU_BLUE = '#0c1f3d';
const NPU_BLUE_LIGHT = '#1e3a5f';
const VEST_ORANGE = '#ea580c';
const VEST_STRIPE = '#fef08a';

interface PoliceOfficerSvgProps {
  gesture: RegulatorGestureId;
  viewSide: ApproachSide;
  className?: string;
}

function Baton({ x, y, angle }: { x: number; y: number; angle: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x="-3.5" y="0" width="7" height="44" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.6" />
      {[0, 11, 22, 33].map((off, i) => (
        <rect key={i} x="-3.5" y={off} width="7" height="11" rx="1" fill={i % 2 === 0 ? '#dc2626' : '#fef08a'} />
      ))}
    </g>
  );
}

function Cockade({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="8" fill="#1e40af" stroke="#fbbf24" strokeWidth="1.8" />
      <circle cx={cx} cy={cy} r="4.5" fill="#fbbf24" opacity="0.9" />
      <path
        d={`M${cx} ${cy - 5} L${cx + 4} ${cy + 4} L${cx - 4} ${cy + 4} Z`}
        fill="#1e40af"
        stroke="#fbbf24"
        strokeWidth="0.5"
      />
    </g>
  );
}

export function PoliceOfficerSvg({ gesture, viewSide, className = '' }: PoliceOfficerSvgProps) {
  const uid = useId().replace(/:/g, '');
  const facing =
    viewSide === 'chest' ? 'front' : viewSide === 'back' ? 'back' : viewSide === 'left' ? 'left' : 'right';

  return (
    <svg viewBox="0 0 180 240" className={className} role="img" aria-label="Регулювальник НПУ">
      <defs>
        <linearGradient id={`uniform-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={NPU_BLUE} />
          <stop offset="50%" stopColor={NPU_BLUE_LIGHT} />
          <stop offset="100%" stopColor={NPU_BLUE} />
        </linearGradient>
        <linearGradient id={`vest-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor={VEST_ORANGE} />
        </linearGradient>
        <filter id={`shadow-${uid}`}>
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodOpacity="0.22" />
        </filter>
      </defs>

      <ellipse cx="90" cy="228" rx="38" ry="7" fill="#000" opacity="0.12" />

      {/* Legs */}
      <g filter={`url(#shadow-${uid})`}>
        <rect x="64" y="168" width="20" height="52" rx="5" fill={NPU_BLUE} />
        <rect x="96" y="168" width="20" height="52" rx="5" fill={NPU_BLUE} />
        <rect x="60" y="212" width="28" height="12" rx="4" fill="#111" />
        <rect x="92" y="212" width="28" height="12" rx="4" fill="#111" />
        <rect x="62" y="216" width="24" height="5" rx="1" fill="#475569" />
        <rect x="94" y="216" width="24" height="5" rx="1" fill="#475569" />
      </g>

      {/* Torso */}
      {(facing === 'front' || facing === 'back') && (
        <g filter={`url(#shadow-${uid})`}>
          <path d="M48 108 L132 108 L124 172 L56 172 Z" fill={`url(#uniform-${uid})`} stroke="#081528" strokeWidth="1" />
          <path d="M52 112 L128 112 L122 166 L58 166 Z" fill={`url(#vest-${uid})`} stroke="#c2410c" strokeWidth="0.8" />
          {[118, 128, 138, 148].map((y) => (
            <rect key={y} x="56" y={y} width="68" height="5" rx="1.5" fill={VEST_STRIPE} opacity="0.95" />
          ))}
          {facing === 'front' && (
            <>
              <text x="90" y="138" fontSize="12" textAnchor="middle" fill="white" fontWeight="bold" fontFamily="Arial,sans-serif">
                ПОЛІЦІЯ
              </text>
              <rect x="50" y="110" width="16" height="12" rx="2" fill={NPU_BLUE_LIGHT} stroke="#fbbf24" strokeWidth="0.5" />
              <rect x="114" y="110" width="16" height="12" rx="2" fill={NPU_BLUE_LIGHT} stroke="#fbbf24" strokeWidth="0.5" />
              <rect x="72" y="158" width="36" height="8" rx="2" fill="#111" opacity="0.85" />
            </>
          )}
          {facing === 'back' && (
            <text x="90" y="138" fontSize="11" textAnchor="middle" fill="white" fontWeight="bold" fontFamily="Arial,sans-serif">
              ПОЛІЦІЯ
            </text>
          )}
        </g>
      )}

      {facing === 'left' && (
        <g filter={`url(#shadow-${uid})`}>
          <path d="M78 108 L124 108 L118 172 L72 172 Z" fill={`url(#uniform-${uid})`} />
          <path d="M80 112 L122 112 L117 166 L75 166 Z" fill={`url(#vest-${uid})`} />
          {[118, 130, 142].map((y) => (
            <rect key={y} x="78" y={y} width="40" height="5" rx="1" fill={VEST_STRIPE} />
          ))}
        </g>
      )}

      {facing === 'right' && (
        <g filter={`url(#shadow-${uid})`}>
          <path d="M56 108 L102 108 L108 172 L62 172 Z" fill={`url(#uniform-${uid})`} />
          <path d="M58 112 L100 112 L105 166 L63 166 Z" fill={`url(#vest-${uid})`} />
          {[118, 130, 142].map((y) => (
            <rect key={y} x="62" y={y} width="40" height="5" rx="1" fill={VEST_STRIPE} />
          ))}
        </g>
      )}

      {/* Arms by gesture */}
      {gesture === 'stop' && (
        <>
          {(facing === 'front' || facing === 'back') && (
            <>
              <path d="M52 112 L28 52 L38 46 L56 98 Z" fill={NPU_BLUE_LIGHT} stroke="#081528" strokeWidth="0.5" />
              <circle cx="30" cy="44" r="8" fill="#fcd9b6" stroke="#d4a574" strokeWidth="0.5" />
              <path d="M128 112 L152 52 L142 46 L124 98 Z" fill={NPU_BLUE_LIGHT} stroke="#081528" strokeWidth="0.5" />
              <circle cx="150" cy="44" r="8" fill="#fcd9b6" stroke="#d4a574" strokeWidth="0.5" />
            </>
          )}
          {(facing === 'left' || facing === 'right') && (
            <>
              <path d="M82 110 L82 38 L98 38 L98 110 Z" fill={NPU_BLUE_LIGHT} rx="4" />
              <circle cx="90" cy="32" r="7" fill="#fcd9b6" />
            </>
          )}
        </>
      )}

      {gesture === 'arms-out' && (
        <>
          <rect x="4" y="122" width="48" height="14" rx="6" fill={NPU_BLUE_LIGHT} stroke="#081528" strokeWidth="0.5" />
          <circle cx="4" cy="129" r="8" fill="#fcd9b6" />
          <rect x="128" y="122" width="48" height="14" rx="6" fill={NPU_BLUE_LIGHT} stroke="#081528" strokeWidth="0.5" />
          <circle cx="176" cy="129" r="8" fill="#fcd9b6" />
          <Baton x={168} y={118} angle={-12} />
        </>
      )}

      {gesture === 'arm-forward' && facing !== 'back' && (
        <>
          <rect x="58" y="120" width="14" height="42" rx="6" fill={NPU_BLUE_LIGHT} />
          <circle cx="65" cy="166" r="7" fill="#fcd9b6" />
          {(facing === 'front' || facing === 'right') && (
            <>
              <rect x="108" y="120" width="54" height="14" rx="6" fill={NPU_BLUE_LIGHT} />
              <circle cx="166" cy="127" r="8" fill="#fcd9b6" />
              <Baton x={160} y={108} angle={8} />
            </>
          )}
          {facing === 'left' && (
            <>
              <rect x="118" y="124" width="46" height="12" rx="6" fill={NPU_BLUE_LIGHT} />
              <circle cx="168" cy="130" r="7" fill="#fcd9b6" />
              <Baton x={162} y={112} angle={5} />
            </>
          )}
        </>
      )}

      {gesture === 'arm-forward' && facing === 'back' && (
        <>
          <rect x="58" y="120" width="14" height="42" rx="6" fill={NPU_BLUE_LIGHT} />
          <rect x="108" y="120" width="14" height="42" rx="6" fill={NPU_BLUE_LIGHT} />
        </>
      )}

      {/* Head & cap */}
      <g filter={`url(#shadow-${uid})`}>
        <circle cx="90" cy="82" r="20" fill="#fcd9b6" stroke="#d4a574" strokeWidth="0.8" />
        <ellipse cx="90" cy="66" rx="24" ry="9" fill={NPU_BLUE} />
        <rect x="66" y="58" width="48" height="14" rx="4" fill={NPU_BLUE} />
        <path d="M66 66 L114 66 L112 74 L68 74 Z" fill="#1e40af" />
        <rect x="64" y="72" width="52" height="6" rx="2" fill="#0a0a0a" opacity="0.7" />
        {(facing === 'front' || facing === 'left' || facing === 'right') && <Cockade cx={90} cy={62} />}
        {facing === 'front' && (
          <>
            <circle cx="82" cy="80" r="2.2" fill="#1e293b" />
            <circle cx="98" cy="80" r="2.2" fill="#1e293b" />
          </>
        )}
      </g>

      <rect x="6" y="6" width="58" height="18" rx="5" fill="#1e293b" opacity="0.9" />
      <text x="35" y="18" fontSize="8" textAnchor="middle" fill="white" fontWeight="bold">
        {viewSide === 'chest' ? 'ГРУДИ' : viewSide === 'back' ? 'СПИНА' : viewSide === 'left' ? 'ЛІВО' : 'ПРАВО'}
      </text>
    </svg>
  );
}

/** Map allowed moves to arrow endpoints relative to approach direction (view from above). */
function moveArrows(
  approachSide: ApproachSide,
  allowed: VehicleMove[]
): Array<{ x1: number; y1: number; x2: number; y2: number; move: VehicleMove }> {
  const base: Record<ApproachSide, Record<VehicleMove, [number, number, number, number]>> = {
    chest: {
      straight: [100, 175, 100, 115],
      right: [100, 175, 155, 130],
      left: [100, 175, 45, 130],
      'u-turn': [100, 175, 55, 175],
    },
    back: {
      straight: [100, 25, 100, 85],
      right: [100, 25, 155, 70],
      left: [100, 25, 45, 70],
      'u-turn': [100, 25, 145, 25],
    },
    left: {
      straight: [25, 100, 85, 100],
      right: [25, 100, 70, 155],
      left: [25, 100, 70, 45],
      'u-turn': [25, 100, 25, 145],
    },
    right: {
      straight: [175, 100, 115, 100],
      right: [175, 100, 130, 45],
      left: [175, 100, 130, 155],
      'u-turn': [175, 100, 175, 55],
    },
  };

  return allowed.map((move) => {
    const [x1, y1, x2, y2] = base[approachSide][move];
    return { x1, y1, x2, y2, move };
  });
}

interface ApproachDiagramProps {
  approach: ApproachRule;
  className?: string;
}

export function ApproachDiagram({ approach, className = '' }: ApproachDiagramProps) {
  const uid = useId().replace(/:/g, '');
  const zoneColor = approach.allowed ? '#16a34a' : '#dc2626';
  const arrows = moveArrows(approach.side, approach.vehicles.allowed);

  const approachPaths: Record<ApproachSide, { x1: number; y1: number; x2: number; y2: number }> = {
    chest: { x1: 100, y1: 188, x2: 100, y2: 128 },
    back: { x1: 100, y1: 12, x2: 100, y2: 72 },
    left: { x1: 12, y1: 100, x2: 72, y2: 100 },
    right: { x1: 188, y1: 100, x2: 128, y2: 100 },
  };
  const arr = approachPaths[approach.side];

  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={approach.label}>
      <rect width="200" height="200" fill="#cbd5e1" rx="10" />
      <rect x="72" y="0" width="56" height="200" fill="#475569" />
      <rect x="0" y="72" width="200" height="56" fill="#475569" />
      <rect x="88" y="88" width="24" height="24" fill="#64748b" rx="2" />

      {/* Crosswalk stripes */}
      <g opacity="0.35">
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={`v${i}`} x={76 + i * 8} y="68" width="4" height="64" fill="white" />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={`h${i}`} x="68" y={76 + i * 8} width="64" height="4" fill="white" />
        ))}
      </g>

      {/* Officer top-down with orientation */}
      <circle cx="100" cy="100" r="16" fill={VEST_ORANGE} stroke={NPU_BLUE} strokeWidth="2.5" />
      <circle cx="100" cy="100" r="7" fill={NPU_BLUE} />
      <polygon
        points={
          approach.side === 'chest'
            ? '100,118 92,104 108,104'
            : approach.side === 'back'
              ? '100,82 92,96 108,96'
              : approach.side === 'left'
                ? '82,100 96,92 96,108'
                : '118,100 104,92 104,108'
        }
        fill="#fef08a"
      />

      {/* Allowed movement arrows (green) */}
      {arrows.map(({ x1, y1, x2, y2, move }) => (
        <g key={move}>
          <line
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#16a34a"
            strokeWidth="4"
            strokeLinecap="round"
            markerEnd={`url(#arrow-green-${uid})`}
            opacity="0.9"
          />
        </g>
      ))}

      {/* Your approach arrow (blue) */}
      <line
        x1={arr.x1}
        y1={arr.y1}
        x2={arr.x2}
        y2={arr.y2}
        stroke="#2563eb"
        strokeWidth="3.5"
        strokeDasharray="6 3"
        markerEnd={`url(#arrow-blue-${uid})`}
      />
      <text
        x={arr.x1 + (approach.side === 'left' ? -8 : approach.side === 'right' ? 8 : 0)}
        y={arr.y1 + (approach.side === 'chest' ? 14 : approach.side === 'back' ? -8 : 0)}
        fontSize="9"
        textAnchor="middle"
        fill="#2563eb"
        fontWeight="bold"
      >
        Ви
      </text>

      <defs>
        <marker id={`arrow-green-${uid}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#16a34a" />
        </marker>
        <marker id={`arrow-blue-${uid}`} markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill="#2563eb" />
        </marker>
      </defs>

      {/* Status badge */}
      <rect x="8" y="8" width="78" height="20" rx="5" fill={zoneColor} />
      <text x="47" y="22" fontSize="9" textAnchor="middle" fill="white" fontWeight="bold">
        {approach.allowed ? 'ДОЗВОЛЕНО' : 'ЗАБОРОНЕНО'}
      </text>

      {/* Pedestrian mini-badge */}
      <rect
        x="114"
        y="8"
        width="78"
        height="20"
        rx="5"
        fill={approach.pedestrians.allowed ? '#059669' : '#64748b'}
      />
      <text x="153" y="22" fontSize="7.5" textAnchor="middle" fill="white" fontWeight="bold">
        {approach.pedestrians.allowed ? 'ПІШОХОДИ ✓' : 'ПІШОХОДИ ✗'}
      </text>
    </svg>
  );
}
