import { useEffect, useRef, useState } from 'react';
import { AppFooter } from './components/AppFooter';
import { AppHeader } from './components/AppHeader';
import { DownloadIcon, PrinterIcon } from './components/Icons';
import { NoticesDialog } from './components/NoticesDialog';
import { PatientForm } from './components/PatientForm';
import { PatientSearch } from './components/PatientSearch';
import { ReferencePanel } from './components/ReferencePanel';
import { ReportView } from './components/ReportView';
import { ResultsSummary } from './components/ResultsSummary';
import { calculateSchedule } from './engine/calculate';
import { todayISO } from './engine/dateUtils';
import { deletePatient, savePatient } from './db/patientRepo';
import { printReport, saveReportPdf } from './export/pdf';
import type { PatientDraft, PatientRecord, ScheduleResult } from './types';

const blank = (): PatientDraft => ({ name: '', mrn: '', dob: '', targetDate: todayISO(), doses: [] });

export default function App() {
  const [draft, setDraft] = useState<PatientDraft>(blank);
  const [result, setResult] = useState<ScheduleResult | null>(null);
  const [error, setError] = useState<string>();
  const [notice, setNotice] = useState<string>();
  const [noticesOpen, setNoticesOpen] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const resultsTop = useRef<HTMLDivElement>(null);

  // Bring fresh results into view (matters on phones, where the form is long).
  useEffect(() => {
    if (!result) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resultsTop.current?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }, [result]);

  const calculate = () => {
    setError(undefined);
    setNotice(undefined);
    try {
      setResult(calculateSchedule({ dob: draft.dob, targetDate: draft.targetDate, doses: draft.doses }));
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : 'Could not calculate the schedule.');
    }
  };

  const save = async () => {
    setError(undefined);
    try {
      await savePatient(draft);
      setNotice('Saved on this device.');
    } catch {
      setError('Could not save. Check that browser storage is not blocked or full.');
    }
  };

  const load = (p: PatientRecord) => {
    setDraft({ name: p.name, mrn: p.mrn, dob: p.dob, targetDate: todayISO(), doses: p.doses });
    setResult(null);
    setError(undefined);
    setNotice(`Loaded ${p.name}. Press "Calculate schedule" to update for today.`);
  };

  const reset = () => {
    setDraft(blank());
    setResult(null);
    setError(undefined);
    setNotice(undefined);
  };

  const pdf = async () => {
    if (!reportRef.current) return;
    setPdfBusy(true);
    try {
      await saveReportPdf(reportRef.current, `catchup-${draft.mrn || 'patient'}-${draft.targetDate}.pdf`);
    } catch {
      setError('Could not create the PDF. Use "Print schedule" and choose "Save as PDF" instead.');
    } finally {
      setPdfBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <AppHeader onOpenNotices={() => setNoticesOpen(true)} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[22rem_minmax(0,1fr)] print:block">
          <aside className="print:hidden lg:sticky lg:top-4 lg:self-start">
            <PatientSearch onSelect={load} onDelete={(p) => p.id !== undefined && deletePatient(p.id)} />
          </aside>

          <main className="min-w-0 space-y-6">
            <div className="print:hidden">
              <PatientForm
                value={draft}
                onChange={setDraft}
                onCalculate={calculate}
                onSave={save}
                onReset={reset}
                error={error}
                notice={notice}
              />
            </div>

            {result && (
              <div ref={resultsTop} className="scroll-mt-4 space-y-4">
                <ResultsSummary result={result} />
                <div className="flex flex-wrap gap-2 print:hidden">
                  <button type="button" onClick={printReport} className="btn-secondary">
                    <PrinterIcon width={18} height={18} /> Print schedule
                  </button>
                  <button type="button" onClick={pdf} disabled={pdfBusy} className="btn-primary">
                    <DownloadIcon width={18} height={18} /> {pdfBusy ? 'Preparing PDF...' : 'Save as PDF'}
                  </button>
                </div>
                <ReportView ref={reportRef} patient={draft} result={result} />
              </div>
            )}

            <ReferencePanel />
          </main>
        </div>
      </div>

      <AppFooter onOpenNotices={() => setNoticesOpen(true)} />
      <NoticesDialog open={noticesOpen} onClose={() => setNoticesOpen(false)} />
    </div>
  );
}
