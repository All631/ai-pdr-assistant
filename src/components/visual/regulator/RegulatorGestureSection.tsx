import React from 'react';
import type { ApproachRule, RegulatorGestureGroup } from '../../../data/regulatorGesturesData';
import { VEHICLE_MOVE_LABELS } from '../../../data/regulatorGesturesData';
import { ApproachDiagram, PoliceOfficerSvg } from './PoliceOfficerIllustration';
import { Car, TrainFront, PersonStanding } from 'lucide-react';

function MoveChips({ allowed, color }: { allowed: string[]; color: string }) {
  if (allowed.length === 0) {
    return (
      <span className="inline-flex rounded-md bg-rose-100 px-2 py-0.5 text-4xs font-bold text-rose-700">
        Заборонено
      </span>
    );
  }
  return (
    <div className="flex flex-wrap gap-1">
      {allowed.map((m) => (
        <span
          key={m}
          className={`inline-flex rounded-md px-2 py-0.5 text-4xs font-bold text-white`}
          style={{ backgroundColor: color }}
        >
          {VEHICLE_MOVE_LABELS[m as keyof typeof VEHICLE_MOVE_LABELS] ?? m}
        </span>
      ))}
    </div>
  );
}

function ApproachViewCard({
  gestureId,
  approach,
}: {
  gestureId: RegulatorGestureGroup['id'];
  approach: ApproachRule;
}) {
  const tramLabels = approach.trams.allowed;

  return (
    <div
      className={`rounded-xl border p-3 sm:p-4 ${
        approach.allowed
          ? 'border-emerald-200 bg-emerald-50/40'
          : 'border-rose-200 bg-rose-50/40'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <p className="text-4xs font-bold uppercase tracking-wide text-slate-800">{approach.label}</p>
        <span
          className={`shrink-0 rounded-md px-2 py-0.5 text-4xs font-bold text-white ${
            approach.allowed ? 'bg-emerald-600' : 'bg-rose-600'
          }`}
        >
          {approach.allowed ? 'ДОЗВОЛЕНО' : 'ЗАБОРОНЕНО'}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <ApproachDiagram approach={approach} className="w-full h-auto rounded-lg border border-slate-200" />
        <PoliceOfficerSvg
          gesture={gestureId}
          viewSide={approach.side}
          className="w-full h-auto mx-auto max-h-[110px]"
        />
      </div>

      <div className="space-y-3 text-4xs leading-relaxed text-slate-600">
        <div>
          <p className="flex gap-1.5 items-center mb-1">
            <Car className="h-3.5 w-3.5 text-blue-600 shrink-0" />
            <strong className="text-slate-800">Автомобілі</strong>
          </p>
          <MoveChips
            allowed={approach.vehicles.allowed}
            color="#2563eb"
          />
          <p className="mt-1 pl-5">{approach.vehicles.summary}</p>
        </div>

        <div>
          <p className="flex gap-1.5 items-center mb-1">
            <TrainFront className="h-3.5 w-3.5 text-amber-600 shrink-0" />
            <strong className="text-slate-800">Трамваї</strong>
          </p>
          <MoveChips allowed={tramLabels} color="#d97706" />
          <p className="mt-1 pl-5">{approach.trams.summary}</p>
        </div>

        <div>
          <p className="flex gap-1.5 items-center mb-1">
            <PersonStanding className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <strong className="text-slate-800">Пішоходи</strong>
          </p>
          <span
            className={`inline-flex rounded-md px-2 py-0.5 text-4xs font-bold ${
              approach.pedestrians.allowed
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-rose-100 text-rose-800'
            }`}
          >
            {approach.pedestrians.allowed ? 'Перехід дозволено' : 'Перехід заборонено'}
          </span>
          <p className="mt-1 pl-5">{approach.pedestrians.summary}</p>
        </div>
      </div>
    </div>
  );
}

export function RegulatorGestureSection({ group }: { group: RegulatorGestureGroup }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm">
      <div className="mb-4 border-b border-slate-100 pb-4">
        <h4 className="text-sm sm:text-base font-bold text-slate-900">{group.title}</h4>
        <p className="mt-1 text-xs text-slate-600">{group.summary}</p>
        <p className="mt-1 text-4xs font-mono text-indigo-600">{group.pdrReference}</p>
      </div>

      <div className="mb-5 flex justify-center bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl py-5 border border-slate-100">
        <PoliceOfficerSvg gesture={group.id} viewSide="chest" className="h-52 w-auto sm:h-60" />
      </div>

      <p className="text-4xs font-bold uppercase tracking-wider text-slate-500 mb-3">
        4 ракурси підходу (п. 8.8 ПДР)
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {group.approaches.map((approach) => (
          <ApproachViewCard key={approach.side} gestureId={group.id} approach={approach} />
        ))}
      </div>
    </section>
  );
}

export { REGULATOR_GESTURE_GROUPS } from '../../../data/regulatorGesturesData';
