import { format, intervalToDuration, parseISO, startOfDay, type Duration } from 'date-fns';

/** Parse 'yyyy-MM-dd' as a LOCAL date at 00:00 (avoids UTC off-by-one bugs). */
export const parseDate = (iso: string): Date => startOfDay(parseISO(iso));
export const toISO = (d: Date): string => format(d, 'yyyy-MM-dd');
export const displayDate = (iso: string): string => format(parseDate(iso), 'dd MMM yyyy');
export const todayISO = (): string => toISO(new Date());

/** Grace period: doses given up to 4 days early are accepted (CDC-style convention). */
export const GRACE_DAYS = 4;

const UNITS: (keyof Duration)[] = ['years', 'months', 'weeks', 'days'];

export function formatDuration(d: Duration): string {
  return (
    UNITS.filter((u) => d[u])
      .map((u) => `${d[u]} ${String(u).slice(0, -1)}${(d[u] as number) > 1 ? 's' : ''}`)
      .join(' ') || '0 days'
  );
}

export function formatAge(dob: Date, on: Date): string {
  const { years = 0, months = 0, days = 0 } = intervalToDuration({ start: dob, end: on });
  const parts = [];
  if (years) parts.push(`${years} y`);
  if (months) parts.push(`${months} m`);
  if (!years && (days || !months)) parts.push(`${days} d`);
  return parts.join(' ');
}
