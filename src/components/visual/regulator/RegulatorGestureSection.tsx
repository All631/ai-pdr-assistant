import React from 'react';
import type { ApproachRule, RegulatorGestureGroup } from '../../../data/regulatorGesturesData';
import { ApproachDiagram, PoliceOfficerSvg } from './PoliceOfficerIllustration';
import { Car, TrainFront, PersonStanding } from 'lucide-react';

function ApproachViewCard({
  gestureId,
  approach,
}: {
  gestureId: RegulatorGestureGroup['id'];
  approach: ApproachRule;
}) {
  return (
    <div
      className={`rounded-xl border p-3 sm:p-4 ${
        approach.allowed
          ? 'border-emerald-200 bg-emerald-50/30'
          : 'border-rose-200 bg-rose-50/30'
      }`}
    >
      <p className="text-4xs font-bold uppercase tracking-wide text-slate-700 mb-2">{approach.label}</p>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <ApproachDiagram approachSide={approach.side} allowed={approach.allowed} className="w-full h-auto rounded-lg" />
        <PoliceOfficerSvg
          gesture={gestureId}
          viewSide={approach.side}
          className="w-full h-auto mx-auto max-h-[100px]"
        />
      </div>

      <div className="space-y-2 text-4xs leading-relaxed text-slate-600">
        <p className="flex gap-1.5 items-start">
          <Car className="h-3.5 w-3.5 text-blue-600 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-800">Авто:</strong> {approach.vehicles}
          </span>
        </p>
        <p className="flex gap-1.5 items-start">
          <TrainFront className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-800">Трамваї:</strong> {approach.trams}
          </span>
        </p>
        <p className="flex gap-1.5 items-start">
          <PersonStanding className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-800">Пішоходи:</strong> {approach.pedestrians}
          </span>
        </p>
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

      {/* Hero illustration — front view of gesture */}
      <div className="mb-5 flex justify-center bg-gradient-to-b from-slate-50 to-slate-100 rounded-xl py-4 border border-slate-100">
        <PoliceOfficerSvg gesture={group.id} viewSide="chest" className="h-48 w-auto sm:h-56" />
      </div>

      <p className="text-4xs font-bold uppercase tracking-wider text-slate-500 mb-3">
        Правила за напрямком підходу (п. 8.7.3)
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
