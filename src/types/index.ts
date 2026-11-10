export type SeriesId = 'HepB' | 'DTaP' | 'IPV' | 'Hib' | 'PCV' | 'RV' | 'MMR' | 'Varicella' | 'HepA';

/** One administered dose as entered by the clinician. Dates are 'yyyy-MM-dd' (local, no time zone). */
export interface RecordedDose {
  id: string;
  seriesId: SeriesId;
  date: string;
}

/** What is stored in IndexedDB. */
export interface PatientRecord {
  id?: number;
  name: string;
  nameLower: string; // search index
  mrn: string; // National ID / MRN (unique)
  dob: string;
  doses: RecordedDose[];
  createdAt: string;
  updatedAt: string;
}

/** What the form edits (no DB-only fields). */
export interface PatientDraft {
  name: string;
  mrn: string;
  dob: string;
  targetDate: string;
  doses: RecordedDose[];
}

export type DoseStatus = 'valid' | 'repeat' | 'extra' | 'error';

export interface DoseAssessment {
  recordId: string;
  seriesId: SeriesId;
  vaccine: string;
  doseNumber: number;
  date: string;
  status: DoseStatus;
  reasons: string[];
}

export type PendingStatus = 'due' | 'upcoming' | 'aged_out';

export interface PendingDose {
  seriesId: SeriesId;
  vaccine: string;
  doseNumber: number;
  totalDoses: number;
  earliestDate: string; // first date the dose is valid
  scheduledDate: string; // today if due, else earliestDate
  status: PendingStatus;
  note?: string;
}

export interface ScheduleResult {
  dob: string;
  targetDate: string;
  ageAtTarget: string;
  assessments: DoseAssessment[];
  due: PendingDose[];
  upcoming: PendingDose[];
  agedOut: PendingDose[];
  completedSeries: string[];
}
