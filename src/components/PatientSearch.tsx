import { useState } from 'react';
import { usePatientSearch } from '../hooks/usePatientSearch';
import type { PatientRecord } from '../types';
import { displayDate } from '../engine/dateUtils';
import { ChevronIcon, SearchIcon, TrashIcon, UsersIcon } from './Icons';

interface Props {
  onSelect: (p: PatientRecord) => void;
  onDelete: (p: PatientRecord) => void;
}

export function PatientSearch({ onSelect, onDelete }: Props) {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false); // mobile accordion; always open on desktop
  const results = usePatientSearch(q);

  return (
    <section aria-label="Saved patients" className="card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="patient-list"
        className="flex w-full items-center justify-between px-4 py-3.5 text-left lg:hidden"
      >
        <span className="flex items-center gap-2 font-semibold"><UsersIcon className="text-brand-600" /> Saved patients</span>
        <ChevronIcon className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <div id="patient-list" className={`${open ? 'block' : 'hidden'} p-4 pt-1 lg:block lg:p-5`}>
        <h2 className="mb-3 hidden items-center gap-2 text-base font-semibold lg:flex">
          <UsersIcon className="text-brand-600" /> Saved patients
        </h2>

        <div className="relative">
          <SearchIcon className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-slate-400" width={18} height={18} />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or ID"
            aria-label="Search patients by name or ID"
            className="field ps-10"
          />
        </div>

        <ul className="mt-3 max-h-[26rem] space-y-1.5 overflow-auto">
          {results.length === 0 && (
            <li className="rounded-lg bg-slate-50 px-3 py-4 text-center text-sm text-slate-500">
              {q ? 'No match. Check the spelling or try the ID number.' : 'No saved patients yet. Save a patient to see them here.'}
            </li>
          )}
          {results.map((p) => (
            <li key={p.id} className="group flex items-center gap-1 rounded-xl border border-transparent hover:border-brand-100 hover:bg-brand-50/60">
              <button type="button" onClick={() => onSelect(p)} className="flex min-w-0 flex-1 items-center gap-3 px-2 py-2 text-left">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                  {p.name.trim().charAt(0).toUpperCase() || '?'}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{p.name}</span>
                  <span className="block truncate text-xs text-slate-500">ID {p.mrn}, born {displayDate(p.dob)}</span>
                </span>
              </button>
              <button
                type="button"
                aria-label={`Delete ${p.name}`}
                onClick={() => confirm(`Delete ${p.name} from this device?`) && onDelete(p)}
                className="me-1 rounded-lg p-2 text-slate-400 hover:bg-repeat-tint hover:text-repeat"
              >
                <TrashIcon width={18} height={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
