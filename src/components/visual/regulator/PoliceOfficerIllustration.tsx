import React, { useId } from 'react';
import type {
  ApproachRule,
  ApproachSide,
  RegulatorGestureId,
  VehicleMove,
} from '../../../data/regulatorGesturesData';

/** Палітра навчального плаката автошколи (NPU) */
const C = {
  navy: '#0c1a2e',
  navyMid: '#1a3354',
  navyLight: '#264a73',
  vest: '#e85d04',
  vestDark: '#b45309',
  stripe: '#fef9c3',
  skin: '#e8b48a',
  skinShadow: '#c48660',
  glove: '#f8fafc',
  gold: '#fbbf24',
  black: '#0f172a',
  boot: '#111827',
  bootSole: '#374151',
};

const VEST_ORANGE = C.vest;

type Facing = 'front' | 'back' | 'left' | 'right';

interface PoliceOfficerSvgProps {
  gesture: RegulatorGestureId;
  viewSide: ApproachSide;
  className?: string;
}

interface Point {
  x: number;
  y: number;
}

function OfficerDefs({ uid }: { uid: string }) {
  return (
    <defs>
      <linearGradient id={`uni-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor={C.navyLight} />
        <stop offset="100%" stopColor={C.navy} />
      </linearGradient>
      <linearGradient id={`vest-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#fb923c" />
        <stop offset="100%" stopColor={C.vest} />
      </linearGradient>
      <linearGradient id={`cap-${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={C.navyLight} />
        <stop offset="100%" stopColor={C.navyMid} />
      </linearGradient>
      <linearGradient id={`skin-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#fde8d4" />
        <stop offset="100%" stopColor={C.skin} />
      </linearGradient>
      <filter id={`shadow-${uid}`} x="-15%" y="-15%" width="130%" height="130%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#000" floodOpacity="0.22" />
      </filter>
      <filter id={`baton-glow-${uid}`} x="-60%" y="-60%" width="220%" height="220%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="blur" />
        <feMerge>
          <feMergeNode in="blur" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

function Trident({ cx, cy, scale = 1 }: { cx: number; cy: number; scale?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) scale(${scale})`}>
      <path d="M0 -6 L0 5 M-4.5 -2.5 L4.5 -2.5 M-3 1 L3 1" stroke={C.gold} strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <path d="M-4.5 -2.5 L-5.5 -4.5 M4.5 -2.5 L5.5 -4.5" stroke={C.gold} strokeWidth="1" strokeLinecap="round" />
    </g>
  );
}

function NpuCockade({ cx, cy, uid }: { cx: number; cy: number; uid: string }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="10" fill={`url(#uni-${uid})`} stroke={C.gold} strokeWidth="2.2" />
      <circle cx={cx} cy={cy} r="6.5" fill="#1d4ed8" stroke={C.gold} strokeWidth="0.9" />
      <circle cx={cx} cy={cy} r="3.8" fill={C.gold} />
      <Trident cx={cx} cy={cy - 0.5} scale={0.9} />
    </g>
  );
}

/** Сегмент кінцівки: плече/стегно → лікоть/коліно → зап'ястя/щиколотка */
function LimbSegment({
  from,
  mid,
  to,
  widthUpper,
  widthLower,
  fill,
  jointFill = C.navyMid,
}: {
  from: Point;
  mid: Point;
  to: Point;
  widthUpper: number;
  widthLower: number;
  fill: string;
  jointFill?: string;
}) {
  return (
    <g stroke={C.black} strokeWidth="0.9" strokeLinejoin="round">
      <line x1={from.x} y1={from.y} x2={mid.x} y2={mid.y} stroke={fill} strokeWidth={widthUpper} strokeLinecap="round" />
      <line x1={mid.x} y1={mid.y} x2={to.x} y2={to.y} stroke={fill} strokeWidth={widthLower} strokeLinecap="round" />
      <circle cx={mid.x} cy={mid.y} r={widthLower * 0.38} fill={jointFill} stroke={C.black} strokeWidth="0.6" />
    </g>
  );
}

function WhiteGlove({ cx, cy, angle = 0, size = 10 }: { cx: number; cy: number; angle?: number; size?: number }) {
  return (
    <g transform={`translate(${cx} ${cy}) rotate(${angle})`}>
      <ellipse cx="0" cy="0" rx={size * 0.85} ry={size} fill={C.glove} stroke="#cbd5e1" strokeWidth="0.7" />
      <path d={`M${-size * 0.5} ${-size * 0.3} L${-size * 0.5} ${-size * 1.1} M0 ${-size * 0.4} L0 ${-size * 1.2} M${size * 0.5} ${-size * 0.3} L${size * 0.5} ${-size * 1.05}`} stroke={C.glove} strokeWidth="2.2" strokeLinecap="round" />
    </g>
  );
}

function ReflectiveBaton({ x, y, angle, uid }: { x: number; y: number; angle: number; uid: string }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`} filter={`url(#baton-glow-${uid})`}>
      <rect x="-4" y="-2" width="8" height="52" rx="2.5" fill="#fef08a" opacity="0.35" />
      <rect x="-3.5" y="0" width="7" height="50" rx="2" fill="#fef08a" stroke="#a16207" strokeWidth="0.6" />
      {[0, 12, 24, 36].map((off, i) => (
        <rect key={off} x="-3.5" y={off} width="7" height="12" rx="1" fill={i % 2 === 0 ? '#dc2626' : '#fef08a'} />
      ))}
    </g>
  );
}

function ReflectiveVest({ facing, uid }: { facing: Facing; uid: string }) {
  const shapes: Record<Facing, { body: string; stripes: { x: number; y: number; w: number }[]; labelX: number; labelY: number }> = {
    front: {
      body: 'M58 138 Q120 128 182 138 L176 218 Q120 228 64 218 Z',
      stripes: [
        { x: 68, y: 152, w: 104 },
        { x: 68, y: 168, w: 104 },
        { x: 68, y: 184, w: 104 },
        { x: 68, y: 200, w: 104 },
      ],
      labelX: 120,
      labelY: 178,
    },
    back: {
      body: 'M58 138 Q120 128 182 138 L176 218 Q120 228 64 218 Z',
      stripes: [
        { x: 68, y: 152, w: 104 },
        { x: 68, y: 168, w: 104 },
        { x: 68, y: 184, w: 104 },
      ],
      labelX: 120,
      labelY: 182,
    },
    left: {
      body: 'M92 138 Q118 132 148 138 L144 218 Q118 224 88 216 Z',
      stripes: [
        { x: 96, y: 156, w: 44 },
        { x: 96, y: 174, w: 44 },
        { x: 96, y: 192, w: 44 },
      ],
      labelX: 118,
      labelY: 178,
    },
    right: {
      body: 'M92 138 Q118 132 148 138 L144 218 Q118 224 88 216 Z',
      stripes: [
        { x: 96, y: 156, w: 44 },
        { x: 96, y: 174, w: 44 },
        { x: 96, y: 192, w: 44 },
      ],
      labelX: 118,
      labelY: 178,
    },
  };
  const { body, stripes, labelX, labelY } = shapes[facing];

  return (
    <g>
      <path d={body} fill={`url(#vest-${uid})`} stroke={C.vestDark} strokeWidth="1" />
      {stripes.map((s, i) => (
        <rect key={i} x={s.x} y={s.y} width={s.w} height="7" rx="2" fill={C.stripe} opacity="0.95" />
      ))}
      {(facing === 'front' || facing === 'back') && (
        <text x={labelX} y={labelY} fontSize="13" textAnchor="middle" fill="white" fontWeight="bold" fontFamily="Arial,sans-serif" letterSpacing="1.2">
          ПОЛІЦІЯ
        </text>
      )}
    </g>
  );
}

function Boot({ heel, toe, facing }: { heel: Point; toe: Point; facing: Facing }) {
  const midX = (heel.x + toe.x) / 2;
  const midY = (heel.y + toe.y) / 2;
  const dx = toe.x - heel.x;
  const dy = toe.y - heel.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = (-dy / len) * 8;
  const ny = (dx / len) * 8;

  return (
    <g>
      <path
        d={`M${heel.x + nx} ${heel.y + ny} L${toe.x + nx} ${toe.y + ny} L${toe.x - nx * 0.4} ${toe.y - ny * 0.4} L${heel.x - nx * 0.4} ${heel.y - ny * 0.4} Z`}
        fill={C.boot}
        stroke={C.black}
        strokeWidth="0.8"
      />
      <ellipse cx={toe.x} cy={toe.y} rx="9" ry="6" fill={C.boot} stroke={C.black} strokeWidth="0.6" />
      <rect
        x={midX - 10}
        y={midY + (facing === 'front' || facing === 'back' ? 4 : 2)}
        width="20"
        height="4"
        rx="1"
        fill={C.bootSole}
        transform={`rotate(${Math.atan2(dy, dx) * (180 / Math.PI)} ${midX} ${midY})`}
      />
    </g>
  );
}

function OfficerLegs({ facing, uid }: { facing: Facing; uid: string }) {
  const fill = `url(#uni-${uid})`;
  const hipL: Point = facing === 'left' ? { x: 108, y: 228 } : facing === 'right' ? { x: 132, y: 228 } : { x: 98, y: 228 };
  const hipR: Point = facing === 'left' ? { x: 128, y: 228 } : facing === 'right' ? { x: 152, y: 228 } : { x: 142, y: 228 };
  const kneeL: Point = facing === 'left' ? { x: 104, y: 278 } : facing === 'right' ? { x: 136, y: 278 } : { x: 94, y: 278 };
  const kneeR: Point = facing === 'left' ? { x: 132, y: 278 } : facing === 'right' ? { x: 164, y: 278 } : { x: 146, y: 278 };
  const ankleL: Point = facing === 'left' ? { x: 100, y: 322 } : facing === 'right' ? { x: 132, y: 322 } : { x: 88, y: 322 };
  const ankleR: Point = facing === 'left' ? { x: 136, y: 322 } : facing === 'right' ? { x: 168, y: 322 } : { x: 152, y: 322 };
  const toeL: Point = { x: ankleL.x + (facing === 'left' ? -6 : facing === 'right' ? 6 : -4), y: ankleL.y + 8 };
  const toeR: Point = { x: ankleR.x + (facing === 'left' ? -6 : facing === 'right' ? 6 : 4), y: ankleR.y + 8 };

  return (
    <g>
      <LimbSegment from={hipL} mid={kneeL} to={ankleL} widthUpper={16} widthLower={14} fill={fill} />
      <LimbSegment from={hipR} mid={kneeR} to={ankleR} widthUpper={16} widthLower={14} fill={fill} />
      <Boot heel={ankleL} toe={toeL} facing={facing} />
      <Boot heel={ankleR} toe={toeR} facing={facing} />
    </g>
  );
}

function TacticalBelt({ centerX, y, width }: { centerX: number; y: number; width: number }) {
  const x = centerX - width / 2;
  return (
    <g>
      <rect x={x} y={y} width={width} height="11" rx="2" fill="#111827" stroke="#374151" strokeWidth="0.5" />
      <rect x={x + 4} y={y + 2} width={width - 8} height="3" rx="1" fill="#4b5563" opacity="0.55" />
      {/* Рація */}
      <rect x={x + 10} y={y - 2} width="14" height="16" rx="2" fill="#1f2937" stroke="#64748b" strokeWidth="0.45" />
      <rect x={x + 12} y={y + 1} width="10" height="6" rx="1" fill="#22c55e" opacity="0.75" />
      <rect x={x + 14} y={y + 9} width="6" height="3" rx="0.8" fill="#475569" />
      {/* Пряжка */}
      <rect x={centerX - 8} y={y + 1.5} width="16" height="8" rx="1.5" fill="#6b7280" stroke="#111827" strokeWidth="0.4" />
      {/* Кобура */}
      <rect x={x + width - 30} y={y - 4} width="20" height="22" rx="3" fill="#1f2937" stroke={C.gold} strokeWidth="0.55" />
      <ellipse cx={x + width - 20} cy={y + 8} rx="5.5" ry="6.5" fill="#0f172a" stroke="#94a3b8" strokeWidth="0.45" />
      <rect x={x + width - 26} y={y + 14} width="12" height="4" rx="1" fill="#374151" />
    </g>
  );
}

function OfficerTorso({ facing, uid }: { facing: Facing; uid: string }) {
  const paths: Record<Facing, string> = {
    front: 'M62 118 Q120 106 178 118 L184 232 Q120 242 56 232 Z',
    back: 'M62 118 Q120 106 178 118 L184 232 Q120 242 56 232 Z',
    left: 'M88 118 Q118 110 152 118 L158 232 Q118 240 82 228 Z',
    right: 'M88 118 Q118 110 152 118 L158 232 Q118 240 82 228 Z',
  };

  return (
    <g>
      <path d={paths[facing]} fill={`url(#uni-${uid})`} stroke={C.black} strokeWidth="1" />
      <ReflectiveVest facing={facing} uid={uid} />
      {(facing === 'front' || facing === 'back') && <TacticalBelt centerX={120} y={218} width={92} />}
      {facing === 'front' && (
        <>
          <path d="M98 112 L120 128 L142 112" fill="white" stroke="#e2e8f0" strokeWidth="0.6" />
          <path d="M114 128 L120 168 L126 128 Z" fill="#111827" />
          <ellipse cx="120" cy="148" rx="14" ry="16" fill="#cbd5e1" stroke="#64748b" strokeWidth="0.5" />
          <text x="120" y="153" fontSize="7" textAnchor="middle" fill={C.navy} fontWeight="bold" fontFamily="Arial,sans-serif">
            НПУ
          </text>
        </>
      )}
    </g>
  );
}

function OfficerHead({ facing, uid }: { facing: Facing; uid: string }) {
  const cx = facing === 'left' ? 128 : facing === 'right' ? 112 : 120;
  const profileNose =
    facing === 'left'
      ? 'M108 98 L96 102 L108 106'
      : facing === 'right'
        ? 'M132 98 L144 102 L132 106'
        : '';

  return (
    <g>
      {facing === 'front' && (
        <ellipse cx={cx} cy={88} rx="26" ry="28" fill={`url(#skin-${uid})`} stroke={C.skinShadow} strokeWidth="0.8" />
      )}
      {(facing === 'left' || facing === 'right') && (
        <ellipse cx={cx} cy={90} rx="22" ry="26" fill={`url(#skin-${uid})`} stroke={C.skinShadow} strokeWidth="0.8" />
      )}
      {facing === 'back' && (
        <ellipse cx={cx} cy={88} rx="26" ry="28" fill={`url(#skin-${uid})`} stroke={C.skinShadow} strokeWidth="0.8" />
      )}

      {facing !== 'back' && (
        <>
          {facing === 'front' && (
            <>
              <ellipse cx={108} cy={86} rx="3.5" ry="4" fill={C.black} />
              <ellipse cx={132} cy={86} rx="3.5" ry="4" fill={C.black} />
              <circle cx={109} cy={85} r="1.2" fill="white" />
              <circle cx={133} cy={85} r="1.2" fill="white" />
              <path d="M110 98 Q120 102 130 98" stroke={C.skinShadow} strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </>
          )}
          {(facing === 'left' || facing === 'right') && (
            <>
              <ellipse cx={facing === 'left' ? 104 : 136} cy={88} rx="3" ry="3.5" fill={C.black} />
              <path d={profileNose} fill={C.skinShadow} opacity="0.35" />
            </>
          )}
        </>
      )}

      {/* Кашкет НПУ */}
      {facing === 'front' && (
        <>
          <path d="M88 68 Q120 48 152 68 L150 82 Q120 74 90 82 Z" fill={`url(#cap-${uid})`} stroke={C.black} strokeWidth="0.8" />
          <ellipse cx={120} cy={66} rx="32" ry="10" fill={`url(#cap-${uid})`} />
          <rect x="86" y="78" width="68" height="8" rx="2" fill={C.black} opacity="0.85" />
          <NpuCockade cx={120} cy={58} uid={uid} />
        </>
      )}
      {facing === 'back' && (
        <>
          <path d="M88 68 Q120 48 152 68 L150 82 Q120 74 90 82 Z" fill={`url(#cap-${uid})`} stroke={C.black} strokeWidth="0.8" />
          <ellipse cx={120} cy={66} rx="32" ry="10" fill={`url(#cap-${uid})`} />
          <rect x="86" y="78" width="68" height="8" rx="2" fill={C.black} opacity="0.85" />
          <rect x="108" y="54" width="24" height="10" rx="2" fill={C.navyMid} stroke={C.gold} strokeWidth="0.6" />
        </>
      )}
      {(facing === 'left' || facing === 'right') && (
        <>
          <path
            d={
              facing === 'left'
                ? 'M96 62 Q118 50 138 66 L136 80 Q118 72 98 78 Z'
                : 'M102 66 Q124 50 144 62 L142 78 Q124 74 104 80 Z'
            }
            fill={`url(#cap-${uid})`}
            stroke={C.black}
            strokeWidth="0.8"
          />
          <NpuCockade cx={facing === 'left' ? 118 : 122} cy={58} uid={uid} />
        </>
      )}

      {/* Плечі — чітка лінія для ракурсу */}
      <path
        d={
          facing === 'front'
            ? 'M62 118 Q120 108 178 118'
            : facing === 'back'
              ? 'M62 118 Q120 108 178 118'
              : facing === 'left'
                ? 'M88 118 Q118 112 152 118'
                : 'M88 118 Q118 112 152 118'
        }
        fill="none"
        stroke={C.navyLight}
        strokeWidth="3"
        opacity="0.5"
      />
    </g>
  );
}

/** Жести з чіткими кутами ліктів (навчальний плакат) */
function OfficerArms({
  gesture,
  facing,
  uid,
}: {
  gesture: RegulatorGestureId;
  facing: Facing;
  uid: string;
}) {
  const fill = `url(#uni-${uid})`;
  const ls: Point = facing === 'left' ? { x: 92, y: 122 } : facing === 'right' ? { x: 148, y: 122 } : { x: 62, y: 122 };
  const rs: Point = facing === 'left' ? { x: 148, y: 122 } : facing === 'right' ? { x: 92, y: 122 } : { x: 178, y: 122 };

  if (gesture === 'stop') {
    const lElbow: Point = facing === 'front' || facing === 'back' ? { x: ls.x - 8, y: 72 } : { x: ls.x, y: 68 };
    const lWrist: Point = facing === 'front' || facing === 'back' ? { x: ls.x - 4, y: 38 } : { x: ls.x + (facing === 'left' ? -4 : 4), y: 36 };
    const rElbow: Point = facing === 'front' || facing === 'back' ? { x: rs.x + 8, y: 72 } : { x: rs.x, y: 68 };
    const rWrist: Point = facing === 'front' || facing === 'back' ? { x: rs.x + 4, y: 38 } : { x: rs.x + (facing === 'right' ? 4 : -4), y: 36 };

    return (
      <g>
        <LimbSegment from={ls} mid={lElbow} to={lWrist} widthUpper={13} widthLower={11} fill={fill} />
        <LimbSegment from={rs} mid={rElbow} to={rWrist} widthUpper={13} widthLower={11} fill={fill} />
        <WhiteGlove cx={lWrist.x} cy={lWrist.y - 6} angle={-10} size={11} />
        <WhiteGlove cx={rWrist.x} cy={rWrist.y - 6} angle={10} size={11} />
      </g>
    );
  }

  if (gesture === 'arms-out') {
    const lElbow: Point = { x: 28, y: 128 };
    const lWrist: Point = { x: 8, y: 128 };
    const rElbow: Point = { x: 212, y: 128 };
    const rWrist: Point = { x: 232, y: 128 };

    return (
      <g>
        <LimbSegment from={ls} mid={lElbow} to={lWrist} widthUpper={13} widthLower={11} fill={fill} />
        <LimbSegment from={rs} mid={rElbow} to={rWrist} widthUpper={13} widthLower={11} fill={fill} />
        <WhiteGlove cx={lWrist.x} cy={lWrist.y} angle={-90} size={10} />
        <WhiteGlove cx={rWrist.x} cy={rWrist.y} angle={90} size={10} />
        <ReflectiveBaton x={208} y={148} angle={75} uid={uid} />
      </g>
    );
  }

  // arm-forward — права рука вперед (дозволений напрямок), ліва опущена
  const lElbow: Point = { x: ls.x - 6, y: 168 };
  const lWrist: Point = { x: ls.x - 2, y: 208 };
  const rElbow: Point =
    facing === 'back' ? { x: rs.x + 6, y: 168 } : facing === 'left' ? { x: rs.x + 24, y: 132 } : { x: rs.x + 38, y: 128 };
  const rWrist: Point =
    facing === 'back'
      ? { x: rs.x + 2, y: 208 }
      : facing === 'left'
        ? { x: rs.x + 52, y: 128 }
        : facing === 'right'
          ? { x: rs.x + 48, y: 124 }
          : { x: rs.x + 58, y: 122 };

  return (
    <g>
      <LimbSegment from={ls} mid={lElbow} to={lWrist} widthUpper={13} widthLower={11} fill={fill} />
      <WhiteGlove cx={lWrist.x} cy={lWrist.y} size={9} />
      {facing !== 'back' && (
        <>
          <LimbSegment from={rs} mid={rElbow} to={rWrist} widthUpper={13} widthLower={11} fill={fill} />
          <WhiteGlove cx={rWrist.x} cy={rWrist.y} angle={facing === 'left' ? 0 : -8} size={10} />
          <ReflectiveBaton x={rWrist.x - 8} y={rWrist.y - 18} angle={facing === 'left' ? 8 : 12} uid={uid} />
        </>
      )}
      {facing === 'back' && (
        <LimbSegment from={rs} mid={rElbow} to={rWrist} widthUpper={13} widthLower={11} fill={fill} />
      )}
    </g>
  );
}

function OrientationCue({ facing }: { facing: Facing }) {
  const labels: Record<Facing, { text: string; arrow: string }> = {
    front: { text: 'ГРУДИ', arrow: 'M120 248 L120 268 M120 248 L112 260 M120 248 L128 260' },
    back: { text: 'СПИНА', arrow: 'M120 52 L120 32 M120 52 L112 40 M120 52 L128 40' },
    left: { text: 'ЛІВИЙ БІК', arrow: 'M52 120 L32 120 M52 120 L40 112 M52 120 L40 128' },
    right: { text: 'ПРАВИЙ БІК', arrow: 'M188 120 L208 120 M188 120 L200 112 M188 120 L200 128' },
  };
  const { text, arrow } = labels[facing];

  return (
    <g>
      <rect x="8" y="8" width="88" height="26" rx="8" fill={C.navyMid} opacity="0.94" />
      <text x="52" y="25" fontSize="10" textAnchor="middle" fill="white" fontWeight="bold" fontFamily="system-ui,sans-serif">
        {text}
      </text>
      <path d={arrow} stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.85" />
    </g>
  );
}

export function PoliceOfficerSvg({ gesture, viewSide, className = '' }: PoliceOfficerSvgProps) {
  const uid = useId().replace(/:/g, '');
  const facing: Facing =
    viewSide === 'chest' ? 'front' : viewSide === 'back' ? 'back' : viewSide === 'left' ? 'left' : 'right';

  return (
    <svg viewBox="0 0 240 340" className={className} role="img" aria-label="Регулювальник НПУ">
      <OfficerDefs uid={uid} />
      <rect x="0" y="0" width="240" height="340" fill="#f1f5f9" rx="12" />
      <ellipse cx="120" cy="332" rx="48" ry="7" fill="#000" opacity="0.12" />
      <g filter={`url(#shadow-${uid})`}>
        <OfficerLegs facing={facing} uid={uid} />
        <OfficerTorso facing={facing} uid={uid} />
        <OfficerArms gesture={gesture} facing={facing} uid={uid} />
        <OfficerHead facing={facing} uid={uid} />
      </g>
      <OrientationCue facing={facing} />
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

      <circle cx="100" cy="100" r="16" fill={VEST_ORANGE} stroke={C.navy} strokeWidth="2.5" />
      <circle cx="100" cy="100" r="7" fill={C.navyMid} />
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
        fill={C.stripe}
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
