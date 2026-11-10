import {
  add,
  differenceInCalendarDays,
  differenceInMonths,
  isAfter,
  isBefore,
  isSameDay,
  max as maxDate,
  subDays,
} from 'date-fns';
import type { DoseAssessment, PendingDose, RecordedDose, ScheduleResult, SeriesId } from '../types';
import { formatAge, formatDuration, GRACE_DAYS, parseDate, toISO } from './dateUtils';
import { SERIES_RULES, type SeriesRule, type ValidDose } from './rules';

export interface EngineInput {
  dob: string;
  targetDate: string;
  doses: RecordedDose[];
}

export const LIVE_SPACING_DAYS = 28;

/**
 * Pure function: no I/O, no globals, no Date.now(). Easy to unit-test and audit.
 *
 * Pass 1 - walk recorded doses chronologically; each is VALID or REPEAT (does not count).
 * Pass 2 - for each series, project the remaining doses at their earliest valid dates.
 */
export function calculateSchedule(input: EngineInput, rules: SeriesRule[] = SERIES_RULES): ScheduleResult {
  const dob = parseDate(input.dob);
  const target = parseDate(input.targetDate);
  if (isAfter(dob, target)) throw new Error('Date of birth is after the calculation date.');

  const byId = new Map(rules.map((r) => [r.id, r]));
  const validBySeries = new Map<SeriesId, ValidDose[]>(rules.map((r) => [r.id, []]));
  const lastInvalid = new Map<SeriesId, Date>();
  const liveGiven: { seriesId: SeriesId; date: Date }[] = [];
  const assessments: DoseAssessment[] = [];

  const recorded = input.doses
    .filter((d) => d.date && byId.has(d.seriesId))
    .map((d) => ({ ...d, when: parseDate(d.date) }))
    .sort((a, b) => a.when.getTime() - b.when.getTime());

  // ---- Pass 1: validate history -------------------------------------------------------------
  for (const dose of recorded) {
    const rule = byId.get(dose.seriesId)!;
    const valid = validBySeries.get(rule.id)!;
    const n = valid.length + 1;
    const push = (status: DoseAssessment['status'], reasons: string[]) =>
      assessments.push({
        recordId: dose.id,
        seriesId: rule.id,
        vaccine: rule.name,
        doseNumber: n,
        date: dose.date,
        status,
        reasons,
      });

    if (isBefore(dose.when, dob)) { push('error', ['Date is before the date of birth - check entry.']); continue; }
    if (isAfter(dose.when, target)) { push('error', ['Date is after the calculation date - check entry.']); continue; }
    if (valid.some((v) => isSameDay(v.date, dose.when))) { push('extra', ['Duplicate entry for the same day.']); continue; }

    const doseRule = rule.doses[valid.length];
    if (!doseRule || rule.isComplete?.(valid)) {
      push('extra', ['Series already complete - this dose was not required.']);
      continue;
    }

    const reasons: string[] = [];
    const early = (limit: Date) => isBefore(dose.when, subDays(limit, GRACE_DAYS));
    const prev = valid[valid.length - 1];
    const first = valid[0];

    if (early(add(dob, doseRule.minAge)))
      reasons.push(`Given before the minimum age for dose ${n} (${formatDuration(doseRule.minAge)}).`);
    if (prev && doseRule.minIntervalFromPrev && early(add(prev.date, doseRule.minIntervalFromPrev)))
      reasons.push(`Interval from previous valid dose is shorter than ${formatDuration(doseRule.minIntervalFromPrev)}.`);
    if (first && doseRule.minIntervalFromFirst && early(add(first.date, doseRule.minIntervalFromFirst)))
      reasons.push(`Interval from first dose is shorter than ${formatDuration(doseRule.minIntervalFromFirst)}.`);

    if (rule.live) {
      // No grace period for live-vaccine spacing.
      const clash = liveGiven.find((l) => {
        const gap = differenceInCalendarDays(dose.when, l.date);
        return l.seriesId !== rule.id && gap > 0 && gap < LIVE_SPACING_DAYS;
      });
      if (clash) reasons.push(`Live vaccine given less than 28 days after ${clash.seriesId} (not on the same day).`);
    }

    if (reasons.length) {
      push('repeat', reasons);
      lastInvalid.set(rule.id, dose.when);
    } else {
      push('valid', []);
      valid.push({ date: dose.when, ageInMonths: differenceInMonths(dose.when, dob) });
      if (rule.live) liveGiven.push({ seriesId: rule.id, date: dose.when });
    }
  }

  // ---- Pass 2: project remaining doses ------------------------------------------------------
  // ASSUMPTION: every due dose is given on the target date, later doses follow at their minimum.
  // NOT YET MODELLED: re-aligning different live vaccines in future visits (28-day rule).
  const due: PendingDose[] = [];
  const upcoming: PendingDose[] = [];
  const agedOut: PendingDose[] = [];
  const completedSeries: string[] = [];

  for (const rule of rules) {
    const valid = validBySeries.get(rule.id)!;
    if (valid.length >= rule.doses.length || rule.isComplete?.(valid)) {
      if (valid.length) completedSeries.push(rule.name);
      continue;
    }
    const firstPendingIndex = valid.length;
    const projected = [...valid];

    while (projected.length < rule.doses.length && !rule.isComplete?.(projected)) {
      const idx = projected.length;
      const dr = rule.doses[idx];
      const prev = projected[idx - 1];
      let earliest = add(dob, dr.minAge);
      if (prev && dr.minIntervalFromPrev) earliest = maxDate([earliest, add(prev.date, dr.minIntervalFromPrev)]);
      if (projected[0] && dr.minIntervalFromFirst)
        earliest = maxDate([earliest, add(projected[0].date, dr.minIntervalFromFirst)]);
      // VERIFY: a repeat dose is spaced from the invalid dose by the normal minimum interval.
      const bad = lastInvalid.get(rule.id);
      if (idx === firstPendingIndex && bad && dr.minIntervalFromPrev)
        earliest = maxDate([earliest, add(bad, dr.minIntervalFromPrev)]);

      const scheduled = maxDate([earliest, target]);
      const item: PendingDose = {
        seriesId: rule.id,
        vaccine: rule.name,
        doseNumber: idx + 1,
        totalDoses: rule.doses.length,
        earliestDate: toISO(earliest),
        scheduledDate: toISO(scheduled),
        status: 'upcoming',
        note: rule.note,
      };

      if (dr.maxAge && !isBefore(scheduled, add(dob, dr.maxAge))) {
        agedOut.push({ ...item, status: 'aged_out', note: rule.agedOutNote ?? 'Beyond the maximum age for this dose - clinician review.' });
        break;
      }
      if (idx === firstPendingIndex && !isAfter(earliest, target)) {
        item.status = 'due';
        due.push(item);
      } else {
        upcoming.push(item);
      }
      projected.push({ date: scheduled, ageInMonths: differenceInMonths(scheduled, dob) });
    }
  }

  upcoming.sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate));

  return {
    dob: input.dob,
    targetDate: input.targetDate,
    ageAtTarget: formatAge(dob, target),
    assessments,
    due,
    upcoming,
    agedOut,
    completedSeries,
  };
}
