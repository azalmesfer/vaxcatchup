import Dexie, { type Table } from 'dexie';
import type { PatientRecord } from '../types';

class VaxDB extends Dexie {
  patients!: Table<PatientRecord, number>;
  constructor() {
    super('vaxcatchup');
    // &mrn = unique index: saving an existing MRN updates that patient instead of duplicating.
    this.version(1).stores({ patients: '++id, &mrn, nameLower, updatedAt' });
  }
}

export const db = new VaxDB();
