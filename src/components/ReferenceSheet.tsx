import { forwardRef } from 'react';
import type { Duration } from 'date-fns';
import { SERIES_RULES } from '../engine/rules';
import { LIVE_SPACING_DAYS } from '../engine/calculate';
import { formatDuration, GRACE_DAYS, displayDate, todayISO } from '../engine/dateUtils';
import { DISCLAIMER } from '../config/legal';
import { RULESET_META } from '../config/appMeta';

const age = (d: Duration) => (Object.values(d).every((v) => !v) ? 'Birth' : formatDuration(d));
const opt = (d?: Duration) => (d ? formatDuration(d) : '-');

/** Rules table generated directly from rules.ts, so the PDF can never drift from the engine. */
export function RulesTable() {
  return (
    <table className="w-full min-w-[40rem] border-collapse text-left text-xs">
      <thead>
        <tr className="bg-brand-50 text-brand-800">
          <th className="border border-slate-300 px-2 py-1.5">Vaccine</th>
          <th className="border border-slate-300 px-2 py-1.5">Dose</th>
          <th className="border border-slate-300 px-2 py-1.5">Minimum age</th>
          <th className="border border-slate-300 px-2 py-1.5">Minimum interval from previous valid dose</th>
          <th className="border border-slate-300 px-2 py-1.5">Minimum interval from first dose</th>
          <th className="border border-slate-300 px-2 py-1.5">Not given from age</th>
        </tr>
      </thead>
      {SERIES_RULES.map((s) => {
        const notes = [s.note, s.completionNote, s.agedOutNote].filter(Boolean) as string[];
        return (
          <tbody key={s.id} className="avoid-break">
            {s.doses.map((d, i) => (
              <tr key={i}>
                {i === 0 && (
                  <th scope="row" rowSpan={s.doses.length + (notes.length ? 1 : 0)} className="border border-slate-300 bg-slate-50 px-2 py-1.5 align-top font-semibold">
                    {s.name}
                    {s.live && <span className="mt-0.5 block text-[10px] font-normal text-slate-500">Live vaccine</span>}
                  </th>
                )}
                <td className="border border-slate-300 px-2 py-1.5">{i + 1}</td>
                <td className="border border-slate-300 px-2 py-1.5">{age(d.minAge)}</td>
                <td className="border border-slate-300 px-2 py-1.5">{opt(d.minIntervalFromPrev)}</td>
                <td className="border border-slate-300 px-2 py-1.5">{opt(d.minIntervalFromFirst)}</td>
                <td className="border border-slate-300 px-2 py-1.5">{opt(d.maxAge)}</td>
              </tr>
            ))}
            {notes.length > 0 && (
              <tr>
                <td colSpan={5} className="border border-slate-300 px-2 py-1.5 text-[11px] text-slate-600">
                  {notes.map((n) => <p key={n}>{n}</p>)}
                </td>
              </tr>
            )}
          </tbody>
        );
      })}
    </table>
  );
}

export const ReferenceSheet = forwardRef<HTMLDivElement>(function ReferenceSheet(_props, ref) {
  const live = SERIES_RULES.filter((s) => s.live).map((s) => s.name).join(', ');
  const general = [
    `Grace period: a dose given up to ${GRACE_DAYS} days before its minimum age or minimum interval is accepted. The grace period does not apply to the ${LIVE_SPACING_DAYS}-day live-vaccine spacing rule.`,
    `Live vaccines (${live}): a live vaccine given fewer than ${LIVE_SPACING_DAYS} days after a different live vaccine, and not on the same day, is counted as a repeat dose.`,
    'Intervals are measured from the previous valid dose. A dose that fails validation is shown as "Repeat dose" and does not count toward the series. The repeat dose is spaced from the invalid dose by the normal minimum interval (assumption, pending clinical review).',
    'Duplicate entries on the same day, doses entered after a series is complete, and dates before birth or after the calculation date are not counted.',
    'Projected dates assume every dose due on the calculation date is given that day, and each later dose is placed at its earliest valid date. A later date is acceptable.',
    'Age limits: when the earliest valid date for a dose falls on or after its "not given from age" value, the dose is not scheduled and is listed under age limits.',
  ];

  return (
    <div ref={ref} className="bg-white p-6 text-[12px] leading-snug text-slate-900">
      <header className="border-b-2 border-brand-600 pb-3">
        <h1 className="text-xl font-semibold text-brand-800">Catch-up calculation rules: reference</h1>
        <p lang="ar" dir="rtl" className="mt-0.5 text-sm text-slate-600">قواعد حساب التطعيمات التداركية (مرجع)</p>
        <p className="mt-2 text-[11px] text-slate-500">
          Ruleset version {RULESET_META.version}, updated {RULESET_META.updated}. Downloaded {displayDate(todayISO())}.
        </p>
      </header>

      <section className="avoid-break mt-4 rounded-md border border-amber-300 bg-due-tint p-3">
        <p className="font-semibold text-due">Review status</p>
        <p lang="en">{RULESET_META.reviewStatus}</p>
        <p lang="ar" dir="rtl" className="mt-1 leading-loose">{RULESET_META.reviewStatusAr}</p>
        <p className="mt-1 text-[11px] text-slate-600">
          Basis: {RULESET_META.basis}. These are catch-up minimums. For routine ages, use the current Saudi PHA national immunization schedule.
        </p>
      </section>

      <h2 className="mb-2 mt-5 text-sm font-semibold text-brand-800">Rules applied to every series</h2>
      <ul className="list-disc space-y-1 ps-5">
        {general.map((g) => <li key={g}>{g}</li>)}
      </ul>

      <h2 className="mb-2 mt-5 text-sm font-semibold text-brand-800">Minimum ages and intervals by vaccine</h2>
      <RulesTable />

      <section className="avoid-break mt-6 border-t border-slate-300 pt-3 text-[11px] leading-relaxed text-slate-600">
        <div className="grid grid-cols-2 gap-5">
          <div lang="en"><p className="font-semibold text-slate-800">{DISCLAIMER.titleEn}</p><p>{DISCLAIMER.bodyEn}</p></div>
          <div lang="ar" dir="rtl" className="leading-loose"><p className="font-semibold text-slate-800">{DISCLAIMER.titleAr}</p><p>{DISCLAIMER.bodyAr}</p></div>
        </div>
      </section>
    </div>
  );
});
