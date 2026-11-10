import { useEffect, useRef } from 'react';
import { LegalNotices } from './LegalNotices';
import { XIcon } from './Icons';

interface Props {
  open: boolean;
  onClose: () => void;
}

/** Native <dialog>: focus trap, Esc to close and backdrop come from the browser. */
export function NoticesDialog({ open, onClose }: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby="notices-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="max-h-[85vh] w-[min(48rem,calc(100vw-1.5rem))] overflow-auto rounded-2xl p-0 shadow-lift backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm"
    >
      <div className="sticky top-0 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3">
        <h2 id="notices-title" className="text-base font-semibold">
          Notices <span lang="ar" className="ms-2 font-normal text-slate-500">الإشعارات</span>
        </h2>
        <button type="button" onClick={onClose} aria-label="Close notices" className="btn-ghost !p-2">
          <XIcon />
        </button>
      </div>
      <div className="p-4 sm:p-5">
        <LegalNotices />
      </div>
    </dialog>
  );
}
