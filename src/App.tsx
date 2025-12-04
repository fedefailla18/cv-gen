import { useRef, useState } from 'react';
import { useReactToPrint } from 'react-to-print';

import { CVPreview } from './components/CVPreview';
import Editor from './components/Editor';
import { SectionsManager } from './components/SectionsManager';
import ThemeSelector from './components/ThemeSelector';
import { useResumeContext } from './context/ResumeContext';

type ViewMode = 'edit' | 'previewOnly';

const App = () => {
  const { resume, theme, sections, setSections } = useResumeContext();
  const [viewMode, setViewMode] = useState<ViewMode>('edit');
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${resume.basics.name}-CV`,
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">CV Generator</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('edit')}
              className={`px-4 py-2 rounded-lg text-sm ${
                viewMode === 'edit' ? 'bg-gray-900 text-white' : 'bg-white text-gray-800 border'
              }`}
            >
              Edit Mode
            </button>
            <button
              onClick={() => setViewMode('previewOnly')}
              className={`px-4 py-2 rounded-lg text-sm ${
                viewMode === 'previewOnly'
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-800 border'
              }`}
            >
              Preview Only
            </button>
            <button
              onClick={handlePrint}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition-colors"
            >
              Export to PDF
            </button>
          </div>
        </div>

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
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
              <div className="lg:col-span-1 space-y-4 w-1/6">
                <ThemeSelector />
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-xl font-semibold mb-4 space-y-3">CV Preview</h2>
                <div ref={componentRef}>
                  <CVPreview />
                </div>
              </div>
            </div>
          </>
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
