import { DISCLAIMER, PRIVACY } from '../config/legal';

/** Printed with every report and PDF. Pulls the same text as the footer. */
export function Disclaimer() {
  return (
    <section className="avoid-break mt-8 border-t border-slate-300 pt-4 text-xs leading-relaxed text-slate-600">
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-6">
        <div lang="en">
          <p className="mb-0.5 font-semibold text-slate-800">{DISCLAIMER.titleEn}</p>
          <p>{DISCLAIMER.bodyEn}</p>
          <p className="mt-1.5 text-slate-500">{PRIVACY.shortEn}</p>
        </div>
        <div lang="ar" dir="rtl" className="text-[13px] leading-loose">
          <p className="mb-0.5 font-semibold text-slate-800">{DISCLAIMER.titleAr}</p>
          <p>{DISCLAIMER.bodyAr}</p>
          <p className="mt-1.5 text-slate-500">{PRIVACY.shortAr}</p>
        </div>
      </div>
    </section>
  );
}
