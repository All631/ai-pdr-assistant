import React, { useState } from 'react';
import {
  InteractiveLightCard,
  LightControlBtn,
  LightDefs,
  LightHousing,
  SignalLens,
  useLightUid,
  ArrowIcon,
  PedStandingIcon,
  PedWalkingIcon,
  RedXIcon,
} from './LightShared';
import { TRAM_LIGHT_DESCRIPTIONS, TRAM_LIGHT_LABELS } from './tramLightLegal';

export function StandardTrafficLight() {
  const uid = useLightUid();
  const [state, setState] = useState<'red' | 'ry' | 'green' | 'yellow'>('red');

  const red = state === 'red' || state === 'ry';
  const yellow = state === 'ry' || state === 'yellow';
  const green = state === 'green';

  return (
    <InteractiveLightCard
      title="Триколірний транспортний"
      description={
        state === 'red'
          ? 'Червоний — стоп, рух заборонено.'
          : state === 'ry'
            ? 'Червоний + жовтий — приготуйтеся, скоро зелений.'
            : state === 'green'
              ? 'Зелений — рух дозволено, якщо перехрестя вільне.'
              : 'Жовтий — заборона руху, якщо можна безпечно зупинитися.'
      }
      controls={
        <>
          {(['red', 'ry', 'green', 'yellow'] as const).map((s) => (
            <LightControlBtn key={s} active={state === s} onClick={() => setState(s)} label={
              s === 'red' ? 'Червоний' : s === 'ry' ? 'Ч+Ж' : s === 'green' ? 'Зелений' : 'Жовтий'
            } />
          ))}
        </>
      }
    >
      <svg viewBox="0 0 80 200" className="h-44 w-[4.5rem]">
        <LightDefs uid={uid} />
        <LightHousing uid={uid} width={80} height={200}>
          <SignalLens uid={uid} cx={40} cy={52} isOn={red} activeColor="#ef4444" glowColor="#fca5a5" dimColor="#3f1515" />
          <SignalLens uid={uid} cx={40} cy={100} isOn={yellow} activeColor="#facc15" glowColor="#fef08a" dimColor="#3f3510" />
          <SignalLens uid={uid} cx={40} cy={148} isOn={green} activeColor="#22c55e" glowColor="#86efac" dimColor="#143320" />
        </LightHousing>
      </svg>
    </InteractiveLightCard>
  );
}

export function ArrowSectionTrafficLight() {
  const uid = useLightUid();
  const [mode, setMode] = useState<'red' | 'red-arrow'>('red');

  const redOn = true;
  const arrowOn = mode === 'red-arrow';

  return (
    <InteractiveLightCard
      title="З додатковою секцією (стрілки)"
      description={
        arrowOn
          ? 'Червоний основний + зелена стрілка (п. 8.7.3): рух дозволено лише у напрямку стрілки. Водій зобов\'язаний дати дорогу транспортним засобам, що рухаються з інших напрямків, а також пішоходам, що переходять проїзну частину.'
          : 'Лише червоний: рух заборонено у всіх напрямках, включно зі смугою додаткової секції.'
      }
      controls={
        <>
          <LightControlBtn active={mode === 'red'} onClick={() => setMode('red')} label="Лише червоний" />
          <LightControlBtn active={mode === 'red-arrow'} onClick={() => setMode('red-arrow')} label="Черв + зел. стрілка" />
        </>
      }
    >
      <svg viewBox="0 0 100 220" className="h-48 w-24">
        <LightDefs uid={uid} />
        <LightHousing uid={uid} width={100} height={220} x={10}>
          <SignalLens uid={uid} cx={50} cy={48} isOn={redOn} activeColor="#ef4444" glowColor="#fca5a5" dimColor="#3f1515" />
          <SignalLens uid={uid} cx={50} cy={96} isOn={false} activeColor="#facc15" glowColor="#fef08a" dimColor="#3f3510" />
          <SignalLens uid={uid} cx={50} cy={144} isOn={false} activeColor="#22c55e" glowColor="#86efac" dimColor="#143320" />
          {/* Additional arrow section */}
          <SignalLens
            uid={uid}
            cx={50}
            cy={192}
            r={12}
            isOn={arrowOn}
            activeColor="#22c55e"
            glowColor="#86efac"
            dimColor="#143320"
          >
            <g transform="translate(50,192)">
              <ArrowIcon direction="right" />
            </g>
          </SignalLens>
        </LightHousing>
        <text x="50" y="215" fontSize="6" textAnchor="middle" fill="#64748b">стрілка →</text>
      </svg>
    </InteractiveLightCard>
  );
}

export function PedestrianTrafficLight() {
  const uid = useLightUid();
  const [state, setState] = useState<'stop' | 'go'>('stop');

  return (
    <InteractiveLightCard
      title="Пішохідний світлофор"
      description={
        state === 'stop'
          ? 'Червоний силует (стоїть) — перехід заборонено. Дочекайтеся зеленого.'
          : 'Зелений силует (йде) — перехід дозволено, але переконайтеся, що водії зупинилися.'
      }
      controls={
        <>
          <LightControlBtn active={state === 'stop'} onClick={() => setState('stop')} label="Стоп" />
          <LightControlBtn active={state === 'go'} onClick={() => setState('go')} label="Іти" />
        </>
      }
    >
      <svg viewBox="0 0 70 150" className="h-40 w-16">
        <LightDefs uid={uid} />
        <LightHousing uid={uid} width={70} height={150} x={8}>
          <SignalLens uid={uid} cx={35} cy={52} isOn={state === 'stop'} activeColor="#ef4444" glowColor="#fca5a5" dimColor="#3f1515" r={16}>
            <g transform="translate(35,52)"><PedStandingIcon /></g>
          </SignalLens>
          <SignalLens uid={uid} cx={35} cy={110} isOn={state === 'go'} activeColor="#22c55e" glowColor="#86efac" dimColor="#143320" r={16}>
            <g transform="translate(35,110)"><PedWalkingIcon /></g>
          </SignalLens>
        </LightHousing>
      </svg>
    </InteractiveLightCard>
  );
}

export function ReversibleTrafficLight() {
  const uid = useLightUid();
  const [state, setState] = useState<'closed' | 'open'>('closed');

  return (
    <InteractiveLightCard
      title="Реверсивний світлофор"
      description={
        state === 'closed'
          ? 'Червоний Х — рух смугою заборонено. Смуга закрита для руху в вашому напрямку.'
          : 'Зелена стрілка вниз — рух смугою дозволено. Дотримуйтесь швидкості та дистанції.'
      }
      controls={
        <>
          <LightControlBtn active={state === 'closed'} onClick={() => setState('closed')} label="Х (закрито)" />
          <LightControlBtn active={state === 'open'} onClick={() => setState('open')} label="↓ (відкрито)" />
        </>
      }
    >
      <svg viewBox="0 0 70 150" className="h-40 w-16">
        <LightDefs uid={uid} />
        <LightHousing uid={uid} width={70} height={150} x={8}>
          <SignalLens uid={uid} cx={35} cy={52} isOn={state === 'closed'} activeColor="#ef4444" glowColor="#fca5a5" dimColor="#3f1515" r={16}>
            <g transform="translate(35,52)"><RedXIcon /></g>
          </SignalLens>
          <SignalLens uid={uid} cx={35} cy={110} isOn={state === 'open'} activeColor="#22c55e" glowColor="#86efac" dimColor="#143320" r={16}>
            <g transform="translate(35,110)"><ArrowIcon direction="down" /></g>
          </SignalLens>
        </LightHousing>
      </svg>
    </InteractiveLightCard>
  );
}

type TramMode = 'forbidden' | 'straight' | 'left' | 'right';

export function TramTrafficLight() {
  const uid = useLightUid();
  const [mode, setMode] = useState<TramMode>('forbidden');

  const lenses: Record<TramMode, [boolean, boolean, boolean, boolean]> = {
    forbidden: [true, true, true, false],
    straight: [true, false, false, true],
    left: [true, true, false, true],
    right: [false, false, true, true],
  };
  const [top, left, right, bottom] = lenses[mode];
  const moon = '#f8fafc';
  const moonDim = '#334155';

  const MoonLens = ({ cx, cy, on }: { cx: number; cy: number; on: boolean }) => (
    <SignalLens
      uid={uid}
      cx={cx}
      cy={cy}
      r={11}
      isOn={on}
      activeColor={moon}
      glowColor="#ffffff"
      dimColor={moonDim}
    />
  );

  return (
    <InteractiveLightCard
      title="Т-подібний (трамвайний)"
      description={TRAM_LIGHT_DESCRIPTIONS[mode]}
      controls={
        (['forbidden', 'straight', 'left', 'right'] as TramMode[]).map((m) => (
          <LightControlBtn
            key={m}
            active={mode === m}
            onClick={() => setMode(m)}
            label={TRAM_LIGHT_LABELS[m]}
          />
        ))
      }
    >
      <svg viewBox="0 0 120 130" className="h-36 w-32">
        <LightDefs uid={uid} />
        {/* T-bar housing */}
        <rect x="48" y="8" width="24" height="8" rx="2" fill="#1a1a1a" />
        <rect x="10" y="16" width="100" height="28" rx="6" fill={`url(#bodyGrad-${uid})`} stroke="#111" />
        <rect x="45" y="16" width="30" height="90" rx="6" fill={`url(#bodyGrad-${uid})`} stroke="#111" />
        <MoonLens cx={60} cy={30} on={top} />
        <MoonLens cx={28} cy={30} on={left} />
        <MoonLens cx={92} cy={30} on={right} />
        <MoonLens cx={60} cy={96} on={bottom} />
        <text x="60" y="125" fontSize="6" textAnchor="middle" fill="#64748b">біло-місячні лінзи</text>
      </svg>
    </InteractiveLightCard>
  );
}

export function TrafficLightsGallery() {
  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-slate-100 bg-gradient-to-br from-slate-50 to-white px-4 py-3 sm:px-5 sm:py-4">
        <p className="text-xs font-bold text-slate-800">5 інтерактивних моделей світлофорів</p>
        <p className="mt-1 text-4xs leading-relaxed text-slate-500">
          Натисніть кнопки під кожною моделлю, щоб перемикати сигнали. Активні лінзи мають ефект світіння (SVG glow + radial-gradient).
          Корпуси з металевим градієнтом і козирками над лінзами.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5 gap-4">
        <StandardTrafficLight />
        <ArrowSectionTrafficLight />
        <PedestrianTrafficLight />
        <ReversibleTrafficLight />
        <TramTrafficLight />
      </div>
    </div>
  );
}
