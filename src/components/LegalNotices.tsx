import { DISCLAIMER, PRIVACY, type Notice } from '../config/legal';
import { InfoIcon, ShieldIcon } from './Icons';

function NoticeCard({ notice, tone }: { notice: Notice; tone: 'blue' | 'teal' }) {
  const styles =
    tone === 'blue'
      ? { box: 'border-brand-100 bg-brand-50/60', icon: 'bg-brand-100 text-brand-700' }
      : { box: 'border-teal-100 bg-teal-50/60', icon: 'bg-teal-100 text-teal-700' };
  const Icon = tone === 'blue' ? InfoIcon : ShieldIcon;
  return (
    <section className={`rounded-xl border p-4 sm:p-5 ${styles.box}`}>
      <div className="grid gap-4 md:grid-cols-2 md:gap-6">
        <div lang="en">
          <h3 className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
            <span className={`grid h-7 w-7 place-items-center rounded-lg ${styles.icon}`}><Icon width={16} height={16} /></span>
            {notice.titleEn}
          </h3>
          <p className="text-sm leading-relaxed text-slate-700">{notice.bodyEn}</p>
        </div>
        <div lang="ar" dir="rtl" className="md:border-s md:border-slate-200/80 md:ps-6">
          <h3 className="mb-1.5 text-sm font-semibold">{notice.titleAr}</h3>
          <p className="text-[15px] leading-loose text-slate-700">{notice.bodyAr}</p>
        </div>
      </div>
    </section>
  );
}

/** Permanent bilingual notices (English left / Arabic right-to-left). */
export function LegalNotices() {
  return (
    <div className="space-y-4">
      <NoticeCard notice={DISCLAIMER} tone="blue" />
      <NoticeCard notice={PRIVACY} tone="teal" />
    </div>
  );
}
