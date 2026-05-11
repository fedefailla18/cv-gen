/* eslint-env browser */
import html2pdf from 'html2pdf.js';

/**
 * Exports the resume to PDF using html2pdf.js
 * This captures the actual rendered HTML with the selected theme
 * and creates a professional PDF with proper page breaks
 */
export async function exportToPDF(
  element: HTMLElement,
  filename?: string
): Promise<void> {
  try {
    const opt = {
      margin: [15, 15, 15, 15] as [number, number, number, number],
      filename: filename || 'CV.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        logging: false,
        letterRendering: true,
      },
      jsPDF: {
        unit: 'mm' as const,
        format: 'a4' as const,
        orientation: 'portrait' as const,
      },
      pagebreak: {
        mode: ['avoid-all', 'css', 'legacy'],
        before: '.page-break-before',
        after: '.page-break-after',
        avoid: [
          'div[class*="mb-6"]',
          'div[class*="mb-8"]',
          'div[class*="mb-5"]',
          'div[class*="space-y"] > div',
          'h1',
          'h2',
          'h3',
          'p',
          'ul',
          'li',
        ],
      },
    };

    await html2pdf().set(opt).from(element).save();
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}

