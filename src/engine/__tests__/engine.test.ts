import { describe, expect, it } from 'vitest';
import { calculateSchedule } from '../calculate';

const dose = (seriesId: any, date: string, id = date + seriesId) => ({ id, seriesId, date });

describe('calculateSchedule', () => {
  it('newborn: DTaP dose 1 is upcoming at exactly 6 weeks, HepB dose 1 is due', () => {
    const r = calculateSchedule({ dob: '2025-01-01', targetDate: '2025-01-02', doses: [] });
    expect(r.due.map((d) => d.seriesId)).toContain('HepB');
    const dtap = r.upcoming.find((d) => d.seriesId === 'DTaP' && d.doseNumber === 1);
    expect(dtap?.scheduledDate).toBe('2025-02-12');
  });

  it('flags a dose given too soon after the previous one as repeat', () => {
    const r = calculateSchedule({
      dob: '2025-01-01',
      targetDate: '2025-06-01',
      doses: [dose('DTaP', '2025-02-12'), dose('DTaP', '2025-02-20')],
    });
    expect(r.assessments.map((a) => a.status)).toEqual(['valid', 'repeat']);
    expect(r.due.some((d) => d.seriesId === 'DTaP' && d.doseNumber === 2)).toBe(true);
  });

  it('MMR before 12 months does not count', () => {
    const r = calculateSchedule({ dob: '2024-01-01', targetDate: '2025-06-01', doses: [dose('MMR', '2024-10-01')] });
    expect(r.assessments[0].status).toBe('repeat');
  });

  it('accepts a dose within the 4-day grace period', () => {
    const r = calculateSchedule({ dob: '2025-01-01', targetDate: '2025-06-01', doses: [dose('DTaP', '2025-02-09')] });
    expect(r.assessments[0].status).toBe('valid');
  });

  it('rejects a second live vaccine given 10 days after the first', () => {
    const r = calculateSchedule({
      dob: '2024-01-01',
      targetDate: '2025-06-01',
      doses: [dose('MMR', '2025-01-10'), dose('Varicella', '2025-01-20')],
    });
    expect(r.assessments.find((a) => a.seriesId === 'Varicella')?.status).toBe('repeat');
  });

  it('rotavirus is aged out for an older child', () => {
    const r = calculateSchedule({ dob: '2024-01-01', targetDate: '2025-06-01', doses: [] });
    expect(r.agedOut.some((d) => d.seriesId === 'RV')).toBe(true);
  });
});
