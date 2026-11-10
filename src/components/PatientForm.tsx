import type { PatientDraft } from '../types';
import { VaccineHistory } from './VaccineHistory';

interface Props {
  value: PatientDraft;
  onChange: (v: PatientDraft) => void;
  onCalculate: () => void;
  onSave: () => void;
  onReset: () => void;
  error?: string;
  notice?: string;
}

export function PatientForm({ value, onChange, onCalculate, onSave, onReset, error, notice }: Props) {
  const set = <K extends keyof PatientDraft>(k: K, v: PatientDraft[K]) => onChange({ ...value, [k]: v });
  const ready = Boolean(value.name.trim() && value.mrn.trim() && value.dob && value.targetDate);

  return (
    <div className="space-y-6">
      <section aria-labelledby="form-h" className="card card-pad">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 id="form-h" className="text-lg font-semibold">Patient details</h2>
            <p className="text-sm text-slate-500">Identifiers, date of birth and the date to calculate for.</p>
          </div>
          <button type="button" onClick={onReset} className="btn-ghost shrink-0">New patient</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="f-name">Patient name</label>
            <input id="f-name" className="field" value={value.name} autoComplete="off" onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="f-mrn">National ID / MRN</label>
            <input id="f-mrn" className="field" value={value.mrn} autoComplete="off" onChange={(e) => set('mrn', e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="f-dob">Date of birth</label>
            <input id="f-dob" type="date" className="field" value={value.dob} onChange={(e) => set('dob', e.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="f-target">Calculation date</label>
            <input id="f-target" type="date" className="field" value={value.targetDate} onChange={(e) => set('targetDate', e.target.value)} />
          </div>
        </div>
      </section>

      <section aria-labelledby="hist-h" className="card card-pad">
        <h2 id="hist-h" className="text-lg font-semibold">Vaccine history</h2>
        <p className="mb-4 text-sm text-slate-500">Add one row for each dose already given, with its administration date.</p>
        <VaccineHistory doses={value.doses} onChange={(d) => set('doses', d)} />
      </section>

      {error && <p role="alert" className="rounded-lg border border-rose-200 bg-repeat-tint px-3 py-2 text-sm text-repeat">{error}</p>}
      {notice && <p role="status" className="rounded-lg border border-teal-200 bg-teal-50 px-3 py-2 text-sm text-teal-800">{notice}</p>}

      <div className="sticky bottom-0 z-10 -mx-4 flex gap-2 border-t border-slate-200 bg-white/90 px-4 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none">
        <button type="button" disabled={!ready} onClick={onCalculate} className="btn-primary flex-1 sm:flex-none">Calculate schedule</button>
        <button type="button" disabled={!ready} onClick={onSave} className="btn-secondary flex-1 sm:flex-none">Save patient</button>
      </div>
    </div>
  );
}
