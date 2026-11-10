import { SERIES_RULES } from '../engine/rules';
import type { RecordedDose, SeriesId } from '../types';
import { PlusIcon, XIcon } from './Icons';

interface Props {
  doses: RecordedDose[];
  onChange: (doses: RecordedDose[]) => void;
}

export function VaccineHistory({ doses, onChange }: Props) {
  const add = (seriesId: SeriesId) => onChange([...doses, { id: crypto.randomUUID(), seriesId, date: '' }]);
  const update = (id: string, date: string) => onChange(doses.map((d) => (d.id === id ? { ...d, date } : d)));
  const remove = (id: string) => onChange(doses.filter((d) => d.id !== id));

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {SERIES_RULES.map((s) => {
        const rows = doses.filter((d) => d.seriesId === s.id);
        return (
          <div key={s.id} className={`rounded-xl border p-3 transition ${rows.length ? 'border-brand-200 bg-brand-50/40' : 'border-slate-200 bg-slate-50/50'}`}>
            <div className="flex items-center justify-between gap-2">
              <span className="font-medium">{s.name}</span>
              <button type="button" onClick={() => add(s.id)} aria-label={`Add ${s.name} dose`}
                className="inline-flex items-center gap-1 rounded-lg bg-white px-2.5 py-1.5 text-xs font-semibold text-brand-700 shadow-sm ring-1 ring-brand-100 hover:bg-brand-50">
                <PlusIcon width={14} height={14} /> Add dose
              </button>
            </div>
            {rows.length === 0 && <p className="mt-2 text-xs text-slate-500">No doses recorded.</p>}
            {rows.map((d, i) => (
              <div key={d.id} className="mt-2 flex items-center gap-2">
                <label htmlFor={d.id} className="w-14 shrink-0 text-xs font-medium text-slate-600">Dose {i + 1}</label>
                <input id={d.id} type="date" value={d.date} onChange={(e) => update(d.id, e.target.value)} className="field !py-1.5" />
                <button type="button" onClick={() => remove(d.id)} aria-label={`Remove ${s.name} dose ${i + 1}`}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-repeat-tint hover:text-repeat">
                  <XIcon width={16} height={16} />
                </button>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
