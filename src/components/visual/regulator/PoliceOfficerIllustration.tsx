import React, { useId } from 'react';
import type { ApproachSide, RegulatorGestureId } from '../../../data/regulatorGesturesData';

const NPU_BLUE = '#0c1f3d';
const NPU_BLUE_LIGHT = '#1e3a5f';
const VEST_ORANGE = '#ea580c';
const VEST_STRIPE = '#fef08a';

interface PoliceOfficerSvgProps {
  gesture: RegulatorGestureId;
  /** Який бік регулювальника бачить спостерігач (водій) */
  viewSide: ApproachSide;
  className?: string;
}

function Baton({ x, y, angle }: { x: number; y: number; angle: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <rect x="-3" y="0" width="6" height="42" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
      {[0, 14, 28].map((off, i) => (
        <rect key={i} x="-3" y={off} width="6" height="14" rx="1" fill={i % 2 === 0 ? '#dc2626' : '#fef08a'} />
      ))}
    </g>
  );
}

function Cockade({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="7" fill="#1e40af" stroke="#fbbf24" strokeWidth="1.5" />
      <path d={`M${cx} ${cy - 4} L${cx + 3} ${cy + 3} L${cx - 3} ${cy + 3} Z`} fill="#fbbf24" />
    </g>
  );
}

/** Деталізована фігура поліцейського НПУ */
export function PoliceOfficerSvg({ gesture, viewSide, className = '' }: PoliceOfficerSvgProps) {
  const uid = useId().replace(/:/g, '');

  const facing = viewSide === 'chest' ? 'front' : viewSide === 'back' ? 'back' : viewSide === 'left' ? 'left' : 'right';

  return (
    <svg viewBox="0 0 160 220" className={className} role="img" aria-label="Регулювальник НПУ">
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
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Ground shadow */}
      <ellipse cx="80" cy="210" rx="35" ry="6" fill="#000" opacity="0.15" />

      {/* Legs & boots */}
      <g filter={`url(#shadow-${uid})`}>
        <rect x="58" y="155" width="18" height="48" rx="4" fill={NPU_BLUE} />
        <rect x="84" y="155" width="18" height="48" rx="4" fill={NPU_BLUE} />
        <rect x="54" y="195" width="26" height="10" rx="3" fill="#0a0a0a" />
        <rect x="80" y="195" width="26" height="10" rx="3" fill="#0a0a0a" />
        <rect x="56" y="198" width="22" height="4" rx="1" fill="#374151" />
        <rect x="82" y="198" width="22" height="4" rx="1" fill="#374151" />
      </g>

      {/* Torso — varies by facing */}
      {(facing === 'front' || facing === 'back') && (
        <g filter={`url(#shadow-${uid})`}>
          {/* Uniform jacket */}
          <path
            d="M45 95 L115 95 L108 158 L52 158 Z"
            fill={`url(#uniform-${uid})`}
            stroke="#081528"
            strokeWidth="1"
          />
          {/* Reflective vest */}
          <path
            d="M48 98 L112 98 L106 152 L54 152 Z"
            fill={`url(#vest-${uid})`}
            stroke="#c2410c"
            strokeWidth="0.8"
          />
          {/* Vest stripes */}
          {[108, 118, 128, 138].map((y) => (
            <rect key={y} x="52" y={y} width="56" height="4" rx="1" fill={VEST_STRIPE} opacity="0.95" />
          ))}
          {facing === 'front' && (
            <>
              <text x="80" y="125" fontSize="11" textAnchor="middle" fill="white" fontWeight="bold" fontFamily="Arial,sans-serif">
                ПОЛІЦІЯ
              </text>
              {/* Shoulder patches */}
              <rect x="46" y="96" width="14" height="10" rx="2" fill={NPU_BLUE_LIGHT} />
              <rect x="100" y="96" width="14" height="10" rx="2" fill={NPU_BLUE_LIGHT} />
            </>
          )}
          {facing === 'back' && (
            <text x="80" y="125" fontSize="10" textAnchor="middle" fill="white" fontWeight="bold" fontFamily="Arial,sans-serif">
              ПОЛІЦІЯ
            </text>
          )}
        </g>
      )}

      {facing === 'left' && (
        <g filter={`url(#shadow-${uid})`}>
          <path d="M70 95 L110 95 L105 158 L65 158 Z" fill={`url(#uniform-${uid})`} />
          <path d="M72 98 L108 98 L104 152 L68 152 Z" fill={`url(#vest-${uid})`} />
          {[108, 118, 128].map((y) => (
            <rect key={y} x="70" y={y} width="36" height="4" rx="1" fill={VEST_STRIPE} />
          ))}
          <text x="88" y="122" fontSize="8" textAnchor="middle" fill="white" fontWeight="bold" transform="rotate(-90 88 122)">
            ПОЛІЦІЯ
          </text>
        </g>
      )}

      {facing === 'right' && (
        <g filter={`url(#shadow-${uid})`}>
          <path d="M50 95 L90 95 L95 158 L55 158 Z" fill={`url(#uniform-${uid})`} />
          <path d="M52 98 L88 98 L92 152 L56 152 Z" fill={`url(#vest-${uid})`} />
          {[108, 118, 128].map((y) => (
            <rect key={y} x="54" y={y} width="36" height="4" rx="1" fill={VEST_STRIPE} />
          ))}
          <text x="72" y="122" fontSize="8" textAnchor="middle" fill="white" fontWeight="bold" transform="rotate(90 72 122)">
            ПОЛІЦІЯ
          </text>
        </g>
      )}

      {/* Arms by gesture */}
      {gesture === 'stop' && facing === 'front' && (
        <>
          <path d="M48 100 L30 55 L38 50 L52 88 Z" fill={NPU_BLUE_LIGHT} stroke="#081528" strokeWidth="0.5" />
          <circle cx="32" cy="48" r="7" fill="#fcd9b6" />
          <path d="M112 100 L130 55 L122 50 L108 88 Z" fill={NPU_BLUE_LIGHT} stroke="#081528" strokeWidth="0.5" />
          <circle cx="128" cy="48" r="7" fill="#fcd9b6" />
        </>
      )}
      {gesture === 'stop' && facing === 'back' && (
        <>
          <path d="M48 100 L28 58 L36 52 L52 90 Z" fill={NPU_BLUE_LIGHT} />
          <path d="M112 100 L132 58 L124 52 L108 90 Z" fill={NPU_BLUE_LIGHT} />
        </>
      )}
      {gesture === 'stop' && (facing === 'left' || facing === 'right') && (
        <>
          <path d="M75 98 L75 45 L85 45 L85 98 Z" fill={NPU_BLUE_LIGHT} rx="4" />
          <circle cx="80" cy="40" r="6" fill="#fcd9b6" />
        </>
      )}

      {gesture === 'arms-out' && (
        <>
          <rect x="8" y="108" width="42" height="12" rx="5" fill={NPU_BLUE_LIGHT} stroke="#081528" strokeWidth="0.5" />
          <circle cx="6" cy="114" r="7" fill="#fcd9b6" />
          <rect x="110" y="108" width="42" height="12" rx="5" fill={NPU_BLUE_LIGHT} stroke="#081528" strokeWidth="0.5" />
          <circle cx="154" cy="114" r="7" fill="#fcd9b6" />
          <Baton x={148} y={108} angle={-15} />
        </>
      )}

      {gesture === 'arm-forward' && facing !== 'back' && (
        <>
          <rect x="55" y="108" width="12" height="38" rx="5" fill={NPU_BLUE_LIGHT} />
          <circle cx="61" cy="150" r="6" fill="#fcd9b6" />
          {facing === 'front' && (
            <>
              <rect x="95" y="108" width="48" height="12" rx="5" fill={NPU_BLUE_LIGHT} />
              <circle cx="146" cy="114" r="7" fill="#fcd9b6" />
              <Baton x={142} y={100} angle={10} />
            </>
          )}
          {facing === 'left' && (
            <>
              <rect x="95" y="112" width="40" height="10" rx="5" fill={NPU_BLUE_LIGHT} />
              <Baton x={130} y={105} angle={5} />
            </>
          )}
          {facing === 'right' && (
            <>
              <rect x="25" y="112" width="40" height="10" rx="5" fill={NPU_BLUE_LIGHT} />
              <circle cx="22" cy="117" r="6" fill="#fcd9b6" />
            </>
          )}
        </>
      )}

      {gesture === 'arm-forward' && facing === 'back' && (
        <>
          <rect x="55" y="108" width="12" height="38" rx="5" fill={NPU_BLUE_LIGHT} />
          <rect x="93" y="108" width="12" height="38" rx="5" fill={NPU_BLUE_LIGHT} />
        </>
      )}

      {/* Head & cap */}
      <g filter={`url(#shadow-${uid})`}>
        <circle cx="80" cy="72" r="18" fill="#fcd9b6" stroke="#d4a574" strokeWidth="0.8" />
        {/* Cap */}
        <ellipse cx="80" cy="58" rx="22" ry="8" fill={NPU_BLUE} />
        <rect x="58" y="52" width="44" height="12" rx="3" fill={NPU_BLUE} />
        <path d="M58 58 L102 58 L100 64 L60 64 Z" fill="#1e40af" />
        {(facing === 'front' || facing === 'left' || facing === 'right') && <Cockade cx={80} cy={54} />}
        {facing === 'back' && (
          <rect x="68" y="50" width="24" height="8" rx="2" fill={NPU_BLUE_LIGHT} />
        )}
        {/* Face details (front/sides) */}
        {facing === 'front' && (
          <>
            <circle cx="73" cy="70" r="2" fill="#1e293b" />
            <circle cx="87" cy="70" r="2" fill="#1e293b" />
          </>
        )}
      </g>

      {/* Direction badge */}
      <rect x="4" y="4" width="52" height="16" rx="4" fill="#1e293b" opacity="0.85" />
      <text x="30" y="15" fontSize="7" textAnchor="middle" fill="white" fontWeight="bold">
        {viewSide === 'chest' ? 'ГРУДИ' : viewSide === 'back' ? 'СПИНА' : viewSide === 'left' ? 'ЛІВО' : 'ПРАВО'}
      </text>
    </svg>
  );
}

interface ApproachDiagramProps {
  approachSide: ApproachSide;
  allowed: boolean;
  className?: string;
}

/** Вид зверху: перехрестя, регулювальник, стрілка підходу */
export function ApproachDiagram({ approachSide, allowed, className = '' }: ApproachDiagramProps) {
  const arrowPaths: Record<ApproachSide, { x1: number; y1: number; x2: number; y2: number; label: string }> = {
    chest: { x1: 100, y1: 175, x2: 100, y2: 130, label: 'Ви' },
    back: { x1: 100, y1: 25, x2: 100, y2: 70, label: 'Ви' },
    left: { x1: 25, y1: 100, x2: 70, y2: 100, label: 'Ви' },
    right: { x1: 175, y1: 100, x2: 130, y2: 100, label: 'Ви' },
  };
  const arr = arrowPaths[approachSide];
  const zoneColor = allowed ? '#22c55e' : '#ef4444';

  return (
    <svg viewBox="0 0 200 200" className={className} role="img">
      <rect width="200" height="200" fill="#e2e8f0" rx="8" />
      {/* Roads */}
      <rect x="70" y="0" width="60" height="200" fill="#475569" />
      <rect x="0" y="70" width="200" height="60" fill="#475569" />
      {/* Crosswalk hints */}
      <g opacity="0.3">
        {Array.from({ length: 5 }).map((_, i) => (
          <rect key={`h${i}`} x={75 + i * 10} y="68" width="5" height="64" fill="white" />
        ))}
      </g>
      {/* Officer (top-down) */}
      <circle cx="100" cy="100" r="14" fill={VEST_ORANGE} stroke={NPU_BLUE} strokeWidth="2" />
      <circle cx="100" cy="100" r="6" fill={NPU_BLUE} />
      {/* Chest indicator (front) */}
      <text x="100" y="118" fontSize="6" textAnchor="middle" fill="white" fontWeight="bold">
        ГРУДИ
      </text>
      <text x="100" y="88" fontSize="6" textAnchor="middle" fill="#94a3b8">
        СПИНА
      </text>
      {/* Approach arrow */}
      <line x1={arr.x1} y1={arr.y1} x2={arr.x2} y2={arr.y2} stroke={zoneColor} strokeWidth="4" markerEnd="url(#arrowhead)" />
      <defs>
        <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
          <polygon points="0 0, 8 3, 0 6" fill={zoneColor} />
        </marker>
      </defs>
      <text x={arr.x1} y={arr.y1 + (approachSide === 'chest' ? 14 : approachSide === 'back' ? -6 : 0)} fontSize="8" textAnchor="middle" fill={zoneColor} fontWeight="bold">
        {arr.label}
      </text>
      {/* Status badge */}
      <rect x="130" y="8" width="62" height="18" rx="4" fill={zoneColor} />
      <text x="161" y="20" fontSize="8" textAnchor="middle" fill="white" fontWeight="bold">
        {allowed ? 'ДОЗВОЛЕНО' : 'ЗАБОРОНЕНО'}
      </text>
    </svg>
  );
}
