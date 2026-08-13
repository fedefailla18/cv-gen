import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { CVPreview } from './components/CVPreview';
import Editor from './components/Editor';
import { SectionsManager } from './components/SectionsManager';
import ThemeSelector from './components/ThemeSelector';
import InterviewsDashboard from './components/InterviewsDashboard';
import KnowledgeBase from './components/KnowledgeBase';
import Navbar from './components/Navbar';
import { useResumeContext } from './context/ResumeContext';
import { exportToPDF } from './utils/pdfExport';

type ViewMode = 'edit' | 'previewOnly' | 'interviews' | 'knowledge';

const App = () => {
  const { resume, theme, sections, setSections } = useResumeContext();
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${resume.basics.name}-CV`,
  });

  const handleDownloadPDF = async () => {
    // Use the preview component reference if available, otherwise create a temporary one
    let elementToExport: HTMLElement;

    if (componentRef.current) {
      // Clone the element to avoid affecting the display
      elementToExport = componentRef.current.cloneNode(true) as HTMLElement;
    } else {
      // Create a temporary preview if we're in edit mode
      const tempPreview = document.createElement('div');
      tempPreview.innerHTML = '<div>Loading...</div>';
      document.body.appendChild(tempPreview);
      elementToExport = tempPreview;
      // We'd need to render CVPreview here, but it's easier to just prompt user
      document.body.removeChild(tempPreview);
      alert('Please switch to Preview Only mode to generate PDF with your selected theme.');
      return;
    }

    setIsGeneratingPDF(true);
    try {
      // Remove drag and drop handlers and non-printable elements
      const dragElements = elementToExport.querySelectorAll('[class*="DragDrop"], [class*="dnd"]');
      dragElements.forEach((el) => el.remove());

      // Remove preview title
      const previewTitle = elementToExport.querySelector('h2');
      if (previewTitle) previewTitle.remove();

      await exportToPDF(elementToExport, `${resume.basics.name}-CV.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar
        viewMode={viewMode}
        onViewChange={setViewMode}
        onDownloadPDF={handleDownloadPDF}
        onPrint={handlePrint}
        isGeneratingPDF={isGeneratingPDF}
      />
      <div className="container mx-auto px-4 max-w-7xl py-8">
        {viewMode === 'edit' ? (
          <div className="grid grid-cols-3 lg:grid-cols-7 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <ThemeSelector />
              <SectionsManager />
            </div>
            <div className="lg:col-span-5">
              <Editor />
            </div>
          </div>
        ) : viewMode === 'previewOnly' ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="lg:col-span-1 space-y-4 w-1/6">
                <ThemeSelector />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg print:shadow-none print:rounded-none print:p-0">
                <h2 className="text-xl font-semibold mb-4 space-y-3 print:hidden">CV Preview</h2>
                <div ref={componentRef} className="print:p-0">
                  <CVPreview />
                </div>
              </div>
            </div>
          </>
        ) : viewMode === 'interviews' ? (
          <InterviewsDashboard />
        ) : (
          <KnowledgeBase />
        )}

        <div className="mt-6 text-sm text-gray-600 bg-white p-4 rounded-lg shadow">
          <p className="font-semibold mb-1">💡 Tips:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Edit your CV JSON in the editor on the left</li>
            <li>Drag and drop sections to reorder them</li>
            <li>Switch themes to see different styles</li>
            <li>Click "Export to PDF" to save your CV</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
