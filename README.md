# Catch-up Immunization Planner

Client-side only (React + TypeScript + Tailwind, date-fns, Dexie/IndexedDB, html2pdf.js).

    npm install
    npm run dev      # development
    npm test         # engine unit tests
    npm run build    # production build; injects a CSP with connect-src 'none'

## Layout
- `src/engine/rules.ts`      clinical rules as data (edit here to change clinical behaviour)
- `src/engine/calculate.ts`  pure validation + projection engine
- `src/db/`                  Dexie schema + patient repository (save/search/delete)
- `src/components/`          form, history entry, search, report (shared by screen/print/PDF)
- `src/export/pdf.ts`        html2pdf.js wrapper; printing uses `window.print()` + Tailwind `print:` classes

## Before clinical use
Rules in `rules.ts` are CDC-style catch-up minimums, NOT taken from the Saudi PHA PDF (which lists routine
ages only). Have a clinician verify every rule marked VERIFY and the "not yet modelled" notes.
IndexedDB is not encrypted: use device-level disk encryption and a locked-down browser profile.

## v0.2 additions
- Redesigned dashboard UI (Tailwind tokens in `tailwind.config.js`, shared classes in `src/index.css`).
- Bilingual (EN/AR) clinical disclaimer + privacy notice: text lives in `src/config/legal.ts` and is reused by the
  footer, the Notices dialog, the printed report and the rules PDF.
- Rules reference PDF generated from `src/engine/rules.ts` (`ReferenceSheet`); update review status in `src/config/appMeta.ts`.
