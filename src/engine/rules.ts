import type { Duration } from 'date-fns';
import type { SeriesId } from '../types';

/**
 * CLINICAL RULES AS DATA.
 *
 * The attached Saudi PHA schedule gives ROUTINE ages only (2/4/6/9/12/18 months, 3-6 y ...).
 * It does not publish catch-up minimum ages/intervals, so the values below follow the widely used
 * CDC/ACIP catch-up minimums and MUST be reviewed and signed off by a clinical lead against
 * PHA/MOH catch-up guidance before real use. Changing a rule = editing this file only.
 */

export interface ValidDose {
  date: Date;
  ageInMonths: number;
}

export interface DoseRule {
  /** Dose may not be given before this age. */
  minAge: Duration;
  /** Minimum gap after the previous VALID dose of the same series. */
  minIntervalFromPrev?: Duration;
  /** Minimum gap after the FIRST valid dose (e.g. HepB dose 3). */
  minIntervalFromFirst?: Duration;
  /** Dose is no longer indicated once the child reaches this age (exclusive). */
  maxAge?: Duration;
}

export interface SeriesRule {
  id: SeriesId;
  name: string;
  /** Live parenteral vaccine: needs 28-day spacing from other live vaccines unless same day. */
  live?: boolean;
  doses: DoseRule[];
  /** Late-start shortcuts (fewer doses needed). Return true when no more doses are required. */
  isComplete?: (valid: ValidDose[]) => boolean;
  note?: string;
  /** Plain-language description of the isComplete shortcut (printed in the rules reference). */
  completionNote?: string;
  agedOutNote?: string;
}

export const SERIES_RULES: SeriesRule[] = [
  {
    id: 'HepB',
    name: 'Hepatitis B',
    doses: [
      { minAge: { days: 0 } },
      { minAge: { days: 0 }, minIntervalFromPrev: { weeks: 4 } },
      { minAge: { weeks: 24 }, minIntervalFromPrev: { weeks: 8 }, minIntervalFromFirst: { weeks: 16 } },
    ],
    note: 'PHA routine schedule gives HepB at birth then as part of the hexavalent at 2/4/6 months.',
  },
  {
    id: 'DTaP',
    name: 'DTaP',
    doses: [
      { minAge: { weeks: 6 }, maxAge: { years: 7 } },
      { minAge: { weeks: 6 }, minIntervalFromPrev: { weeks: 4 }, maxAge: { years: 7 } },
      { minAge: { weeks: 6 }, minIntervalFromPrev: { weeks: 4 }, maxAge: { years: 7 } },
      { minAge: { months: 12 }, minIntervalFromPrev: { months: 6 }, maxAge: { years: 7 } },
      { minAge: { years: 4 }, minIntervalFromPrev: { months: 6 }, maxAge: { years: 7 } },
    ],
    agedOutNote: 'Age 7 y or older: use Tdap/Td catch-up (adult/adolescent schedule), not DTaP.',
    note: 'Dose 5 is not needed if dose 4 was given at 4 y or older (not yet modelled).',
  },
  {
    id: 'IPV',
    name: 'Polio (IPV)',
    doses: [
      { minAge: { weeks: 6 } },
      { minAge: { weeks: 6 }, minIntervalFromPrev: { weeks: 4 } },
      { minAge: { weeks: 6 }, minIntervalFromPrev: { weeks: 4 } },
      { minAge: { years: 4 }, minIntervalFromPrev: { months: 6 } },
    ],
    note: 'OPV doses on the PHA schedule (9 m, 18 m, 3-6 y) are not modelled here.',
  },
  {
    id: 'Hib',
    name: 'Hib',
    doses: [
      { minAge: { weeks: 6 }, maxAge: { years: 5 } },
      { minAge: { weeks: 6 }, minIntervalFromPrev: { weeks: 4 }, maxAge: { years: 5 } },
      { minAge: { weeks: 6 }, minIntervalFromPrev: { weeks: 4 }, maxAge: { years: 5 } },
      { minAge: { months: 12 }, minIntervalFromPrev: { weeks: 8 }, maxAge: { years: 5 } },
    ],
    // VERIFY: a valid dose at >= 15 months completes the series for a healthy child.
    isComplete: (valid) => valid.some((d) => d.ageInMonths >= 15),
    completionNote: 'Series is complete once a valid dose has been given at 15 months or older.',
    agedOutNote: 'Not routinely indicated from age 5 y in healthy children; assess risk conditions.',
  },
  {
    id: 'PCV',
    name: 'Pneumococcal conjugate (PCV)',
    doses: [
      { minAge: { weeks: 6 }, maxAge: { years: 5 } },
      { minAge: { weeks: 6 }, minIntervalFromPrev: { weeks: 4 }, maxAge: { years: 5 } },
      { minAge: { weeks: 6 }, minIntervalFromPrev: { weeks: 4 }, maxAge: { years: 5 } },
      { minAge: { months: 12 }, minIntervalFromPrev: { weeks: 8 }, maxAge: { years: 5 } },
    ],
    // VERIFY: healthy child needs no more once a valid dose is at >= 24 months,
    // or 3 valid doses with the last at >= 12 months.
    isComplete: (valid) =>
      valid.some((d) => d.ageInMonths >= 24) ||
      (valid.length >= 3 && valid[valid.length - 1].ageInMonths >= 12),
    completionNote: 'Series is complete once a valid dose has been given at 24 months or older, or after 3 valid doses with the last given at 12 months or older.',
    note: 'PHA prefers PCV20; PCV15/PCV13 are acceptable alternatives.',
    agedOutNote: 'Not routinely indicated from age 5 y in healthy children; assess risk conditions.',
  },
  {
    id: 'RV',
    name: 'Rotavirus',
    doses: [
      { minAge: { weeks: 6 }, maxAge: { weeks: 15 } }, // first dose by 14 w 6 d
      { minAge: { weeks: 6 }, minIntervalFromPrev: { weeks: 4 }, maxAge: { months: 8, days: 1 } },
      { minAge: { weeks: 6 }, minIntervalFromPrev: { weeks: 4 }, maxAge: { months: 8, days: 1 } },
    ],
    note: 'If monovalent RV1 was used, 2 doses complete the series (PHA note 4).',
    agedOutNote: 'Too old to start/finish rotavirus vaccine; do not give.',
  },
  {
    id: 'MMR',
    name: 'MMR',
    live: true,
    doses: [
      { minAge: { months: 12 } },
      { minAge: { months: 12 }, minIntervalFromPrev: { weeks: 4 } },
    ],
    note: 'PHA lists additional measles/MMR contacts (9 m, 3-6 y); only the 2 doses needed for catch-up are modelled.',
  },
  {
    id: 'Varicella',
    name: 'Varicella',
    live: true,
    doses: [
      { minAge: { months: 12 } },
      { minAge: { months: 12 }, minIntervalFromPrev: { weeks: 12 } },
    ],
    note: 'Interval is 12 weeks under 13 y; 4 weeks from 13 y (age-dependent interval not yet modelled).',
  },
  {
    id: 'HepA',
    name: 'Hepatitis A',
    doses: [
      { minAge: { months: 12 } },
      { minAge: { months: 12 }, minIntervalFromPrev: { months: 6 } },
    ],
  },
];
