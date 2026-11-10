import type { ScheduleResult } from '../types';

export function ResultsSummary({ result }: { result: ScheduleResult }) {
  const count = (s: string) => result.assessments.filter((a) => a.status === s).length;
  const tiles = [
    { label: 'Valid doses', value: count('valid'), cls: 'bg-teal-50 text-teal-800 ring-teal-100' },
    { label: 'Repeat doses', value: count('repeat'), cls: 'bg-repeat-tint text-repeat ring-rose-100' },
    { label: 'Due today', value: result.due.length, cls: 'bg-due-tint text-due ring-amber-100' },
    { label: 'Upcoming doses', value: result.upcoming.length, cls: 'bg-brand-50 text-brand-700 ring-brand-100' },
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4 print:hidden">
      {tiles.map((t) => (
        <div key={t.label} className={`rounded-xl p-4 ring-1 ${t.cls}`}>
          <dd className="text-3xl font-semibold leading-none">{t.value}</dd>
          <dt className="mt-1.5 text-sm font-medium">{t.label}</dt>
        </div>
      ))}
    </dl>
  );
}
