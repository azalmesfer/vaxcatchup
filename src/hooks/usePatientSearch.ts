import { useLiveQuery } from 'dexie-react-hooks';
import { searchPatients } from '../db/patientRepo';

export function usePatientSearch(query: string) {
  return useLiveQuery(() => searchPatients(query), [query], []);
}
