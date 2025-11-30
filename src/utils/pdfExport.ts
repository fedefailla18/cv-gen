// Note: This utility is available but not currently used in the app.
// The App component uses react-to-print instead, which is already installed.
// If you prefer html2pdf.js for more control, install it with:
// npm install html2pdf.js
// Then uncomment the code below and use this function.

export function exportToPDF() {
  const element = document.body;
  // Using window.print() as a fallback since html2pdf.js needs to be installed
  // If html2pdf.js is added, uncomment the following:
  // import html2pdf from "html2pdf.js";
  // html2pdf().from(element).save("cv.pdf");

  // For now, use browser's print functionality
  window.print();
}
