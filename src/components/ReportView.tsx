import { forwardRef, type ReactNode } from 'react';
import type { DoseAssessment, PatientDraft, PendingDose, ScheduleResult } from '../types';
import { displayDate } from '../engine/dateUtils';
import { Disclaimer } from './Disclaimer';

interface Props {
  patient: PatientDraft;
  result: ScheduleResult;
}

const STATUS_STYLE: Record<DoseAssessment['status'], string> = {
  valid: 'bg-teal-50 text-teal-800 ring-teal-200',
  repeat: 'bg-repeat-tint text-repeat ring-rose-200',
  extra: 'bg-slate-100 text-slate-600 ring-slate-200',
  error: 'bg-due-tint text-due ring-amber-200',
};
const STATUS_LABEL: Record<DoseAssessment['status'], string> = {
  valid: 'Valid',
  repeat: 'Repeat dose',
  extra: 'Not required',
  error: 'Check entry',
};

function groupByDate(items: PendingDose[]) {
  const map = new Map<string, PendingDose[]>();
  items.forEach((i) => map.set(i.scheduledDate, [...(map.get(i.scheduledDate) ?? []), i]));
  return [...map.entries()];
}

function Section({ title, count, children }: { title: string; count?: number; children: ReactNode }) {
  return (
    <section className="mt-8 first:mt-0">
      <h3 className="mb-3 flex items-center gap-2 border-b border-slate-200 pb-2 text-base font-semibold text-brand-800">
        {title}
        {count !== undefined && (
          <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">{count}</span>
        )}
      </h3>
      {children}
    </section>
  );
}

/** Single source of truth for on-screen results, print and PDF. */
export const ReportView = forwardRef<HTMLDivElement, Props>(function ReportView({ patient, result }, ref) {
  const sorted = [...result.assessments].sort((a, b) => a.date.localeCompare(b.date));
  const info = [
    ['Patient', patient.name],
    ['ID / MRN', patient.mrn],
    ['Date of birth', displayDate(result.dob)],
    ['Age on calculation date', result.ageAtTarget],
  ];

  return (
    <div
      ref={ref}
      id="report"
      className="card overflow-hidden border-t-4 border-t-brand-600 bg-white p-5 sm:p-8 print:rounded-none print:border-0 print:p-0 print:shadow-none"
    >
      <header className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold">Catch-up immunization schedule</h2>
          <p className="text-sm text-slate-500">Calculated for {displayDate(result.targetDate)}</p>
        </div>
        <p lang="ar" dir="rtl" className="text-sm font-medium text-brand-700">جدول التطعيمات التداركية</p>
      </header>

      <dl className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3 rounded-xl bg-slate-50 p-4 text-sm sm:grid-cols-4">
        {info.map(([k, v]) => (
          <div key={k}><dt className="text-xs text-slate-500">{k}</dt><dd className="font-semibold">{v}</dd></div>
        ))}
      </dl>

      <div className="mt-8">
        <Section title="Dose validation" count={sorted.length}>
          {sorted.length === 0 ? (
            <p className="text-sm text-slate-500">No previous doses were entered.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[30rem] text-sm">
                <thead className="text-left text-xs text-slate-500">
                  <tr><th className="py-1.5 pr-3 font-medium">Date</th><th className="pr-3 font-medium">Vaccine</th><th className="pr-3 font-medium">Counted as</th><th className="font-medium">Result</th></tr>
                </thead>
                <tbody>
                  {sorted.map((a) => (
                    <tr key={a.recordId} className="border-t border-slate-100 align-top">
                      <td className="whitespace-nowrap py-2 pr-3">{displayDate(a.date)}</td>
                      <td className="pr-3">{a.vaccine}</td>
                      <td className="pr-3">{a.status === 'valid' || a.status === 'repeat' ? `Dose ${a.doseNumber}` : '-'}</td>
                      <td>
                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ${STATUS_STYLE[a.status]}`}>
                          {STATUS_LABEL[a.status]}
                        </span>
                        {a.reasons.map((r) => <p key={r} className="mt-1 text-xs text-slate-600">{r}</p>)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {result.completedSeries.length > 0 && (
            <p className="mt-3 text-sm text-slate-600">Series complete: {result.completedSeries.join(', ')}.</p>
          )}
        </Section>

        <Section title="Due today" count={result.due.length}>
          {result.due.length === 0 ? (
            <p className="text-sm text-slate-500">No vaccines are due on this date.</p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {result.due.map((d) => (
                <li key={d.seriesId} className="avoid-break rounded-lg border-l-4 border-due bg-due-tint px-3 py-2 text-sm">
                  <span className="font-semibold">{d.vaccine}</span>
                  <span className="text-slate-600">, dose {d.doseNumber} of {d.totalDoses}</span>
                  {d.note && <p className="mt-0.5 text-xs text-slate-600">{d.note}</p>}
                </li>
              ))}
            </ul>
          )}
        </Section>

        <Section title="Upcoming appointments" count={result.upcoming.length}>
          {result.upcoming.length === 0 ? (
            <p className="text-sm text-slate-500">No further doses to schedule.</p>
          ) : (
            <>
              <ol className="relative ml-2 border-l-2 border-brand-100">
                {groupByDate(result.upcoming).map(([date, items]) => (
                  <li key={date} className="avoid-break relative pb-5 pl-6 last:pb-0">
                    <span className="absolute -left-[7px] top-1.5 h-3 w-3 rounded-full border-2 border-white bg-brand-600 ring-2 ring-brand-100" />
                    <p className="font-semibold">{displayDate(date)}</p>
                    <ul className="mt-1 space-y-0.5 text-sm text-slate-700">
                      {items.map((i) => (
                        <li key={`${i.seriesId}${i.doseNumber}`}>{i.vaccine}, dose {i.doseNumber} of {i.totalDoses}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
              <p className="mt-4 text-xs text-slate-500">
                Dates assume doses due today are given today. Each date is the earliest valid date; a later date is acceptable.
              </p>
            </>
          )}
        </Section>

        {result.agedOut.length > 0 && (
          <Section title="Not scheduled (age limits)">
            <ul className="space-y-1.5 text-sm">
              {result.agedOut.map((d) => (
                <li key={d.seriesId}><span className="font-semibold">{d.vaccine}</span>: {d.note}</li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      <Disclaimer />
    </div>
  );
});
