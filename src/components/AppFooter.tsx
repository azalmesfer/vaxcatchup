import { RULESET_META } from '../config/appMeta';
import { LegalNotices } from './LegalNotices';

export function AppFooter({ onOpenNotices }: { onOpenNotices: () => void }) {
  return (
    <footer id="notices" className="mt-10 border-t border-slate-200 bg-white print:hidden">
      <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6">
        <LegalNotices />
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>Ruleset version {RULESET_META.version}, updated {RULESET_META.updated}.</p>
          <nav className="flex gap-5" aria-label="Footer">
            <a href="#reference" className="font-medium text-brand-700 hover:underline">Download rules reference</a>
            <button type="button" onClick={onOpenNotices} className="font-medium text-brand-700 hover:underline">
              Open notices
            </button>
          </nav>
        </div>
      </div>
    </footer>
  );
}
