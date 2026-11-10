import type { ReactNode, SVGProps } from 'react';

type P = SVGProps<SVGSVGElement>;

const Icon = ({ children, ...p }: P & { children: ReactNode }) => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}>
    {children}
  </svg>
);

export const ShieldIcon = (p: P) => (<Icon {...p}><path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z" /><path d="M9 12l2 2 4-4" /></Icon>);
export const InfoIcon = (p: P) => (<Icon {...p}><circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 8h.01" /></Icon>);
export const SearchIcon = (p: P) => (<Icon {...p}><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></Icon>);
export const UsersIcon = (p: P) => (<Icon {...p}><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20c0-3.5 2.9-6 6.5-6s6.5 2.5 6.5 6" /><path d="M16 4.5a3.5 3.5 0 010 7M18.5 14.5c1.8.8 3 2.6 3 5.5" /></Icon>);
export const PlusIcon = (p: P) => (<Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>);
export const TrashIcon = (p: P) => (<Icon {...p}><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" /></Icon>);
export const XIcon = (p: P) => (<Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>);
export const ChevronIcon = (p: P) => (<Icon {...p}><path d="M6 9l6 6 6-6" /></Icon>);
export const DownloadIcon = (p: P) => (<Icon {...p}><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></Icon>);
export const PrinterIcon = (p: P) => (<Icon {...p}><path d="M7 9V4h10v5M7 17H5a1 1 0 01-1-1v-5a2 2 0 012-2h12a2 2 0 012 2v5a1 1 0 01-1 1h-2" /><path d="M7 14h10v6H7z" /></Icon>);
export const BookIcon = (p: P) => (<Icon {...p}><path d="M5 4h10a3 3 0 013 3v13H8a3 3 0 01-3-3V4z" /><path d="M5 17a3 3 0 013-3h10" /></Icon>);
export const SyringeIcon = (p: P) => (
  <Icon {...p}>
    <path d="m18 2 4 4" /><path d="m17 7 3-3" /><path d="M19 9 8.7 19.3c-1 1-2.5 1-3.4 0l-.6-.6c-1-1-1-2.5 0-3.4L15 5" />
    <path d="m9 11 4 4" /><path d="m5 19-3 3" /><path d="m14 4 6 6" />
  </Icon>
);
