import html2pdf from 'html2pdf.js';

/** Renders the report element to an A4 PDF entirely in the browser (no upload). */
export async function saveReportPdf(el: HTMLElement, filename: string): Promise<void> {
  await html2pdf()
    .set({
      margin: [10, 10, 14, 10],
      filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: false, backgroundColor: '#ffffff' },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: ['css', 'legacy'], avoid: ['.avoid-break', 'tr'] },
    })
    .from(el)
    .save();
}

export const printReport = () => window.print();
