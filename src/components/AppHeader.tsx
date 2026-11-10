import { BookIcon, InfoIcon, ShieldIcon, SyringeIcon } from './Icons';

export function AppHeader({ onOpenNotices }: { onOpenNotices: () => void }) {
  return (
    <header className="bg-gradient-to-r from-brand-800 via-brand-700 to-teal-600 text-white print:hidden">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/30">
            <SyringeIcon width={22} height={22} />
          </span>
          <div>
            <h1 className="text-lg font-semibold leading-tight sm:text-xl">Catch-up Immunization Planner</h1>
            <p lang="ar" dir="rtl" className="text-sm text-white/80">مخطط التطعيمات التداركية</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-medium ring-1 ring-white/25">
            <ShieldIcon width={16} height={16} /> Data stays on this device
          </span>
          <a href="#reference" className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium hover:bg-white/15">
            <BookIcon width={16} height={16} /> Rules reference
          </a>
          <button type="button" onClick={onOpenNotices}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium hover:bg-white/15">
            <InfoIcon width={16} height={16} /> Notices
          </button>
        </div>
      </div>
    </header>
  );
}
