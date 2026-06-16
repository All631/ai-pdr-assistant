import React, { useId } from 'react';
import type {
  ApproachRule,
  ApproachSide,
  RegulatorGestureId,
  VehicleMove,
} from '../../../data/regulatorGesturesData';

const NPU = {
  navy: '#0a1628',
  navyMid: '#152a47',
  navyLight: '#1e3d66',
  vest: '#ea580c',
  vestDark: '#c2410c',
  stripe: '#fef08a',
  skin: '#f5c9a0',
  skinShadow: '#d4956a',
  gold: '#fbbf24',
  silver: '#cbd5e1',
  black: '#0f172a',
};

const VEST_ORANGE = NPU.vest;

interface PoliceOfficerSvgProps {
  gesture: RegulatorGestureId;
  viewSide: ApproachSide;
  className?: string;
}

function OfficerDefs({ uid }: { uid: string }) {
  return (
    <defs>
      <linearGradient id={`uni-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={NPU.navyLight} />
        <stop offset="45%" stopColor={NPU.navyMid} />
        <stop offset="100%" stopColor={NPU.navy} />
      </linearGradient>
      <linearGradient id={`uni-sh-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={NPU.navyMid} />
        <stop offset="100%" stopColor={NPU.navy} />
      </linearGradient>
      <linearGradient id={`vest-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor={NPU.vest} />
      </linearGradient>
      <linearGradient id={`cap-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={NPU.navyLight} />
        <stop offset="60%" stopColor={NPU.navyMid} />
        <stop offset="100%" stopColor={NPU.navy} />
      </linearGradient>
      <linearGradient id={`skin-${uid}`} x1="30%" y1="0%" x2="70%" y2="100%">
        <stop offset="0%" stopColor="#fde4c8" />
        <stop offset="100%" stopColor={NPU.skin} />
      </linearGradient>
      <linearGradient id={`badge-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f8fafc" />
        <stop offset="40%" stopColor={NPU.silver} />
        <stop offset="100%" stopColor="#64748b" />
      </linearGradient>
      <radialGradient id={`badge-glow-${uid}`} cx="35%" cy="30%" r="70%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.2" />
      </radialGradient>
      <filter id={`soft-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000" floodOpacity="0.2" />
      </filter>
      <filter id={`neon-${uid}`} x="-80%" y="-80%" width="260%" height="260%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

function Trident({ cx, cy }: { cx: number; cy: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(0.85)`}>
      <path d="M0 -5 L0 4 M-3.5 -2 L3.5 -2 M-2.5 0 L2.5 0" stroke={NPU.gold} strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M-3.5 -2 L-4.5 -4 M3.5 -2 L4.5 -4 M-2.5 0 L-3.5 1.5 M2.5 0 L3.5 1.5" stroke={NPU.gold} strokeWidth="0.9" strokeLinecap="round" />
    </g>
  );
}

function NpuCockade({ cx, cy, uid }: { cx: number; cy: number; uid: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="9" fill={`url(#uni-${uid})`} stroke={NPU.gold} strokeWidth="2" />
      <circle cx={cx} cy={cy} r="6" fill="#1e40af" stroke={NPU.gold} strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r="3.5" fill={NPU.gold} opacity="0.85" />
      <Trident cx={cx} cy={cy - 0.5} />
    </g>
  );
}

function PoliceBadge({ x, y, uid }: { x: number; y: number; uid: string }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <ellipse cx="0" cy="0" rx="11" ry="13" fill={`url(#badge-${uid})`} stroke="#475569" strokeWidth="0.6" />
      <ellipse cx="0" cy="0" rx="11" ry="13" fill={`url(#badge-glow-${uid})`} />
      <circle cx="0" cy="-2" r="4" fill={NPU.navyMid} stroke={NPU.gold} strokeWidth="0.5" />
      <text x="0" y="5" fontSize="4.5" textAnchor="middle" fill={NPU.navy} fontWeight="bold" fontFamily="Arial,sans-serif">
        НПУ
      </text>
    </g>
  );
}

function TacticalBelt({ y, width }: { y: number; width: number }) {
  const x = 90 - width / 2;
  return (
    <g>
      <rect x={x} y={y} width={width} height="10" rx="2" fill="#111827" stroke="#374151" strokeWidth="0.5" />
      <rect x={x + 4} y={y + 1.5} width={width - 8} height="3" rx="1" fill="#4b5563" opacity="0.6" />
      <rect x={x + width * 0.62} y={y - 2} width="14" height="16" rx="2" fill="#1f2937" stroke="#111" strokeWidth="0.5" />
      <ellipse cx={x + width * 0.69} cy={y + 6} rx="4" ry="5" fill="#0f172a" stroke={NPU.silver} strokeWidth="0.4" />
      <rect x={x + width * 0.38} y={y + 1} width="8" height="8" rx="1.5" fill="#374151" stroke="#111" strokeWidth="0.4" />
      <rect x={x + width * 0.48} y={y + 1} width="7" height="8" rx="1.5" fill="#374151" stroke="#111" strokeWidth="0.4" />
      <rect x={x + width * 0.22} y={y + 2} width="10" height="6" rx="1" fill="#1e293b" stroke={NPU.silver} strokeWidth="0.3" />
      <circle cx={x + width * 0.27} cy={y + 5} r="1.2" fill="#22c55e" opacity="0.8" />
    </g>
  );
}

function NeonBaton({ x, y, angle, uid }: { x: number; y: number; angle: number; uid: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`} filter={`url(#neon-${uid})`}>
      <rect x="-4" y="2" width="8" height="46" rx="2.5" fill="#fef08a" opacity="0.45" />
      <rect x="-3.5" y="0" width="7" height="44" rx="2" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
      {[0, 11, 22, 33].map((off, i) => (
        <rect key={i} x="-3.5" y={off} width="7" height="11" rx="1" fill={i % 2 === 0 ? '#dc2626' : '#fef08a'} />
      ))}
    </g>
  );
}

function ReflectiveVest({
  facing,
  uid,
}: {
  facing: 'front' | 'back' | 'left' | 'right';
  uid: string;
}) {
  const config: Record<string, { d: string; sx: number; sw: number; ys: number[] }> = {
    front: { d: 'M50 118 Q90 112 130 118 L124 168 Q90 174 56 168 Z', sx: 56, sw: 68, ys: [128, 138, 148, 158] },
    back: { d: 'M50 118 Q90 112 130 118 L124 168 Q90 174 56 168 Z', sx: 56, sw: 68, ys: [128, 138, 148, 158] },
    left: { d: 'M78 118 Q98 114 122 118 L118 168 Q98 172 74 168 Z', sx: 78, sw: 38, ys: [130, 142, 154] },
    right: { d: 'M58 118 Q82 114 102 118 L106 168 Q82 172 62 168 Z', sx: 64, sw: 38, ys: [130, 142, 154] },
  };
  const { d, sx, sw, ys } = config[facing];

  return (
    <g>
      <path d={d} fill={`url(#vest-${uid})`} stroke={NPU.vestDark} strokeWidth="0.8" />
      {ys.map((y) => (
        <rect key={y} x={sx} y={y} width={sw} height="5" rx="1.5" fill={NPU.stripe} opacity="0.95" />
      ))}
      {(facing === 'front' || facing === 'back') && (
        <text x="90" y="145" fontSize="11" textAnchor="middle" fill="white" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="1">
          ПОЛІЦІЯ
        </text>
      )}
    </g>
  );
}

function SleevePatch({ x, y, flip }: { x: number; y: number; flip?: boolean }) {
  return (
    <g transform={`translate(${x} ${y})${flip ? ' scale(-1,1)' : ''}`}>
      <rect x="-8" y="0" width="16" height="10" rx="2" fill={NPU.navyLight} stroke={NPU.gold} strokeWidth="0.5" />
      <rect x="-6" y="2" width="12" height="2" fill={NPU.gold} opacity="0.7" />
      <rect x="-4" y="5" width="8" height="3" rx="0.5" fill="#1e40af" />
    </g>
  );
}

function CollarAndTie() {
  return (
    <g>
      <path d="M78 108 L90 118 L102 108" fill="white" stroke="#e2e8f0" strokeWidth="0.5" />
      <path d="M86 118 L90 148 L94 118 Z" fill="#111827" />
      <path d="M88 118 L90 142 L92 118" fill="#374151" opacity="0.5" />
    </g>
  );
}

function Legs({ uid }: { uid: string }) {
  return (
    <g>
      <path d="M68 178 Q74 178 76 230 L60 230 Q58 178 64 178 Z" fill={`url(#uni-sh-${uid})`} stroke={NPU.black} strokeWidth="0.6" />
      <path d="M104 178 Q98 178 96 230 L112 230 Q114 178 108 178 Z" fill={`url(#uni-sh-${uid})`} stroke={NPU.black} strokeWidth="0.6" />
      <ellipse cx="68" cy="178" rx="10" ry="5" fill={NPU.navyMid} />
      <ellipse cx="112" cy="178" rx="10" ry="5" fill={NPU.navyMid} />
      <path d="M58 228 Q68 234 78 228 L78 236 Q68 240 58 236 Z" fill={NPU.black} />
      <path d="M102 228 Q112 234 122 228 L122 236 Q112 240 102 236 Z" fill={NPU.black} />
      <rect x="60" y="232" width="18" height="4" rx="1" fill="#475569" />
      <rect x="102" y="232" width="18" height="4" rx="1" fill="#475569" />
    </g>
  );
}

function Torso({ facing, uid }: { facing: 'front' | 'back' | 'left' | 'right'; uid: string }) {
  const torsoPaths: Record<string, string> = {
    front: 'M52 104 Q90 98 128 104 L132 178 Q90 184 48 178 Z',
    back: 'M52 104 Q90 98 128 104 L132 178 Q90 184 48 178 Z',
    left: 'M76 104 Q98 100 118 106 L122 178 Q98 182 72 176 Z',
    right: 'M62 104 Q82 100 104 106 L108 178 Q82 182 58 176 Z',
  };

  return (
    <g>
      <path d={torsoPaths[facing]} fill={`url(#uni-${uid})`} stroke={NPU.black} strokeWidth="0.8" />
      <ReflectiveVest facing={facing} uid={uid} />
      {facing === 'front' && (
        <>
          <PoliceBadge x={90} y={132} uid={uid} />
          <CollarAndTie />
          <SleevePatch x={48} y={118} />
          <SleevePatch x={132} y={118} flip />
        </>
      )}
      {facing === 'back' && <SleevePatch x={48} y={118} />}
      {(facing === 'front' || facing === 'back') && <TacticalBelt y={168} width={72} />}
    </g>
  );
}

function Head({ facing, uid }: { facing: 'front' | 'back' | 'left' | 'right'; uid: string }) {
  return (
    <g>
      <ellipse cx="90" cy="88" rx="22" ry="24" fill={`url(#skin-${uid})`} stroke={NPU.skinShadow} strokeWidth="0.6" />
      {facing !== 'back' && (
        <>
          <ellipse cx="82" cy="86" rx="3" ry="3.5" fill={NPU.black} />
          <ellipse cx="98" cy="86" rx="3" ry="3.5" fill={NPU.black} />
          <circle cx="83" cy="85" r="1" fill="white" opacity="0.7" />
          <circle cx="99" cy="85" r="1" fill="white" opacity="0.7" />
          <path d="M84 96 Q90 99 96 96" stroke={NPU.skinShadow} strokeWidth="1" fill="none" strokeLinecap="round" />
        </>
      )}
      <path d="M66 72 Q90 58 114 72 L112 82 Q90 76 68 82 Z" fill={`url(#cap-${uid})`} stroke={NPU.black} strokeWidth="0.6" />
      <ellipse cx="90" cy="72" rx="26" ry="8" fill={`url(#cap-${uid})`} />
      <rect x="62" y="78" width="56" height="7" rx="2" fill={NPU.black} opacity="0.75" />
      {facing !== 'back' && <NpuCockade cx={90} cy={66} uid={uid} />}
    </g>
  );
}

function Arms({
  gesture,
  facing,
  uid,
}: {
  gesture: RegulatorGestureId;
  facing: 'front' | 'back' | 'left' | 'right';
  uid: string;
}) {
  const armFill = `url(#uni-${uid})`;

  if (gesture === 'stop') {
    if (facing === 'front' || facing === 'back') {
      return (
        <g>
          <path d="M52 112 Q38 78 32 48 Q38 42 48 46 Q54 88 58 112 Z" fill={armFill} stroke={NPU.black} strokeWidth="0.5" />
          <circle cx="34" cy="44" r="9" fill={NPU.skin} stroke={NPU.skinShadow} strokeWidth="0.5" />
          <path d="M128 112 Q142 78 148 48 Q142 42 132 46 Q126 88 122 112 Z" fill={armFill} stroke={NPU.black} strokeWidth="0.5" />
          <circle cx="146" cy="44" r="9" fill={NPU.skin} stroke={NPU.skinShadow} strokeWidth="0.5" />
        </g>
      );
    }
    return (
      <g>
        <path d="M82 108 Q84 60 90 36 Q98 36 100 108 Z" fill={armFill} stroke={NPU.black} strokeWidth="0.5" />
        <circle cx="90" cy="32" r="8" fill={NPU.skin} />
      </g>
    );
  }

  if (gesture === 'arms-out') {
    return (
      <g>
        <path d="M48 118 Q20 118 6 128 Q4 134 10 136 Q28 130 52 126 Z" fill={armFill} stroke={NPU.black} strokeWidth="0.5" />
        <circle cx="6" cy="130" r="8" fill={NPU.skin} />
        <path d="M132 118 Q160 118 174 128 Q176 134 170 136 Q152 130 128 126 Z" fill={armFill} stroke={NPU.black} strokeWidth="0.5" />
        <circle cx="174" cy="130" r="8" fill={NPU.skin} />
        <NeonBaton x={168} y={108} angle={-10} uid={uid} />
      </g>
    );
  }

  if (gesture === 'arm-forward') {
    if (facing === 'back') {
      return (
        <g>
          <path d="M58 118 Q52 148 54 172 Q62 174 66 148 Q64 118 60 112 Z" fill={armFill} />
          <path d="M122 118 Q128 148 126 172 Q118 174 114 148 Q116 118 120 112 Z" fill={armFill} />
        </g>
      );
    }
    return (
      <g>
        <path d="M58 118 Q52 148 54 172 Q62 174 66 148 Q64 118 60 112 Z" fill={armFill} stroke={NPU.black} strokeWidth="0.5" />
        <circle cx="56" cy="174" r="7" fill={NPU.skin} />
        {(facing === 'front' || facing === 'right') && (
          <>
            <path d="M118 122 Q148 118 168 126 Q172 132 166 134 Q140 128 120 128 Z" fill={armFill} stroke={NPU.black} strokeWidth="0.5" />
            <circle cx="168" cy="128" r="8" fill={NPU.skin} />
            <NeonBaton x={162} y={108} angle={6} uid={uid} />
          </>
        )}
        {facing === 'left' && (
          <>
            <path d="M118 124 Q148 128 166 132 Q170 128 164 124 Q138 120 120 122 Z" fill={armFill} />
            <circle cx="166" cy="128" r="7" fill={NPU.skin} />
            <NeonBaton x={160} y={110} angle={4} uid={uid} />
          </>
        )}
      </g>
    );
  }

  return null;
}

export function PoliceOfficerSvg({ gesture, viewSide, className = '' }: PoliceOfficerSvgProps) {
  const uid = useId().replace(/:/g, '');
  const facing: 'front' | 'back' | 'left' | 'right' =
    viewSide === 'chest' ? 'front' : viewSide === 'back' ? 'back' : viewSide === 'left' ? 'left' : 'right';

  const sideLabel =
    viewSide === 'chest' ? 'ГРУДИ' : viewSide === 'back' ? 'СПИНА' : viewSide === 'left' ? 'ЛІВО' : 'ПРАВО';

  return (
    <svg viewBox="0 0 180 248" className={className} role="img" aria-label="Регулювальник НПУ">
      <OfficerDefs uid={uid} />
      <ellipse cx="90" cy="238" rx="42" ry="6" fill="#000" opacity="0.1" />
      <g filter={`url(#soft-${uid})`}>
        <Legs uid={uid} />
        <Torso facing={facing} uid={uid} />
        <Arms gesture={gesture} facing={facing} uid={uid} />
        <Head facing={facing} uid={uid} />
      </g>
      <rect x="6" y="6" width="62" height="20" rx="6" fill={NPU.navyMid} opacity="0.92" />
      <text x="37" y="19" fontSize="8.5" textAnchor="middle" fill="white" fontWeight="bold" fontFamily="system-ui,sans-serif">
        {sideLabel}
      </text>
    </svg>
  );
}

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

      <g opacity="0.35">
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={`v${i}`} x={76 + i * 8} y="68" width="4" height="64" fill="white" />
        ))}
        {Array.from({ length: 6 }).map((_, i) => (
          <rect key={`h${i}`} x="68" y={76 + i * 8} width="64" height="4" fill="white" />
        ))}
      </g>

      <circle cx="100" cy="100" r="16" fill={VEST_ORANGE} stroke={NPU.navy} strokeWidth="2.5" />
      <circle cx="100" cy="100" r="7" fill={NPU.navyMid} />
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
        fill={NPU.stripe}
      />

      {arrows.map(({ x1, y1, x2, y2, move }) => (
        <line
          key={move}
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
      ))}

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

      <rect x="8" y="8" width="78" height="20" rx="5" fill={zoneColor} />
      <text x="47" y="22" fontSize="9" textAnchor="middle" fill="white" fontWeight="bold">
        {approach.allowed ? 'ДОЗВОЛЕНО' : 'ЗАБОРОНЕНО'}
      </text>

      <rect x="114" y="8" width="78" height="20" rx="5" fill={approach.pedestrians.allowed ? '#059669' : '#64748b'} />
      <text x="153" y="22" fontSize="7.5" textAnchor="middle" fill="white" fontWeight="bold">
        {approach.pedestrians.allowed ? 'ПІШОХОДИ ✓' : 'ПІШОХОДИ ✗'}
      </text>
    </svg>
  );
}
