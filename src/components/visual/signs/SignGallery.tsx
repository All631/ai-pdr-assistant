import React, { useMemo, useState } from 'react';
import { SignRenderer } from '../../signs/SignRenderer';
import {
  SIGN_CATEGORIES,
  TRAFFIC_SIGN_CATALOG,
  type SignCategoryId,
} from '../../../data/trafficSignsCatalog';

const GRID = 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';

function SignCard({ signId, name, description }: { signId: string; name: string; description: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-3 sm:p-4 text-center shadow-sm hover:shadow-md transition-shadow">
      <div className="mb-2 sm:mb-3 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center">
        <SignRenderer signId={signId} size={52} />
      </div>
      <p className="text-4xs sm:text-xs font-bold text-slate-800 leading-tight">{name}</p>
      <p className="mt-1 text-4xs leading-relaxed text-slate-500 hidden sm:block">{description}</p>
    </div>
  );
}

export function SignGallery() {
  const [category, setCategory] = useState<SignCategoryId>('warning');

  const filtered = useMemo(
    () => TRAFFIC_SIGN_CATALOG.filter((s) => s.category === category),
    [category]
  );

  const activeMeta = SIGN_CATEGORIES.find((c) => c.id === category)!;

  return (
    <div className="space-y-5">
      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {SIGN_CATEGORIES.map((cat) => {
          const count = TRAFFIC_SIGN_CATALOG.filter((s) => s.category === cat.id).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id)}
              className={`shrink-0 rounded-xl px-3 py-2 text-left transition-all sm:px-4 sm:py-2.5 ${
                category === cat.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="block text-4xs sm:text-xs font-bold">{cat.label}</span>
              <span className={`block text-4xs mt-0.5 ${category === cat.id ? 'text-blue-100' : 'text-slate-400'}`}>
                {count} · {cat.hint}
              </span>
            </button>
          );
        })}
      </div>

      <div className="rounded-xl bg-slate-50 border border-slate-100 px-4 py-3">
        <p className="text-sm font-bold text-slate-800">{activeMeta.label}</p>
        <p className="text-4xs text-slate-500 mt-0.5">{activeMeta.hint} · ДСТУ 4100</p>
      </div>

      <div className={GRID}>
        {filtered.map((entry) => (
          <div key={`${entry.id}-${entry.code}`}>
            <SignCard signId={entry.id} name={`${entry.name} (${entry.code})`} description={entry.description} />
          </div>
        ))}
      </div>
    </div>
  );
}

export { TRAFFIC_SIGN_CATALOG, SIGN_CATEGORIES };
