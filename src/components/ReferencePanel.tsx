import { useRef, useState } from 'react';
import { saveReportPdf } from '../export/pdf';
import { RULESET_META } from '../config/appMeta';
import { BookIcon, DownloadIcon } from './Icons';
import { ReferenceSheet, RulesTable } from './ReferenceSheet';

export function ReferencePanel() {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const download = async () => {
    if (!sheetRef.current) return;
    setBusy(true);
    setError(undefined);
    try {
      await saveReportPdf(sheetRef.current, `immunization-catchup-rules-v${RULESET_META.version}.pdf`);
    } catch {
      setError('Could not create the PDF. Try again, or use your browser\u2019s print function.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="reference" aria-labelledby="ref-h" className="card card-pad scroll-mt-4 print:hidden">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600"><BookIcon /></span>
          <div>
            <h2 id="ref-h" className="text-lg font-semibold">Calculation rules reference</h2>
            <p className="max-w-xl text-sm text-slate-500">
              A PDF of the minimum ages, intervals and validation rules this tool applies, generated from the
              live ruleset (version {RULESET_META.version}).
            </p>
          </div>
        </div>
        <button type="button" onClick={download} disabled={busy} className="btn-primary w-full sm:w-auto">
          <DownloadIcon width={18} height={18} /> {busy ? 'Preparing PDF...' : 'Download rules PDF'}
        </button>
      </div>

      {error && <p role="alert" className="mt-3 rounded-lg bg-repeat-tint px-3 py-2 text-sm text-repeat">{error}</p>}

      <details className="mt-4">
        <summary className="cursor-pointer text-sm font-medium text-brand-700">Preview the rules</summary>
        <div className="mt-3 overflow-x-auto"><RulesTable /></div>
      </details>

      {/* Off-screen copy that html2pdf renders. Kept mounted so the PDF is always ready. */}
      <div aria-hidden="true" className="pointer-events-none fixed -left-[10000px] top-0 w-[190mm]">
        <ReferenceSheet ref={sheetRef} />
      </div>
    </section>
  );
}
