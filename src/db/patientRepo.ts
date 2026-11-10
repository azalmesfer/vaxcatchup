import { db } from './db';
import type { PatientDraft, PatientRecord } from '../types';

export async function savePatient(d: PatientDraft): Promise<number> {
  const now = new Date().toISOString();
  const mrn = d.mrn.trim();
  const name = d.name.trim();
  return db.transaction('rw', db.patients, async () => {
    const existing = await db.patients.where('mrn').equals(mrn).first();
    const rec: PatientRecord = {
      name,
      nameLower: name.toLowerCase(),
      mrn,
      dob: d.dob,
      doses: d.doses,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };
    if (existing?.id !== undefined) {
      await db.patients.put({ ...rec, id: existing.id });
      return existing.id;
    }
    return db.patients.add(rec);
  });
}

/** Empty query returns the most recently updated patients. */
export async function searchPatients(query: string, limit = 20): Promise<PatientRecord[]> {
  const q = query.trim().toLowerCase();
  if (!q) return db.patients.orderBy('updatedAt').reverse().limit(limit).toArray();
  // Linear scan is fine for a single clinic's local data (thousands of rows).
  return db.patients
    .filter((p) => p.nameLower.includes(q) || p.mrn.toLowerCase().includes(q))
    .limit(limit)
    .toArray();
}

export const deletePatient = (id: number) => db.patients.delete(id);
