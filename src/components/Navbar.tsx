import type { FC } from 'react';

type ViewMode = 'edit' | 'previewOnly' | 'interviews' | 'knowledge';

interface NavbarProps {
  viewMode: ViewMode;
  onViewChange: (mode: ViewMode) => void;
  onDownloadPDF: () => void;
  onPrint: () => void;
  isGeneratingPDF: boolean;
}

const CV_MODES: { id: ViewMode; label: string }[] = [
  { id: 'edit', label: 'Edit' },
  { id: 'previewOnly', label: 'Preview' },
];

const TOOL_MODES: { id: ViewMode; label: string }[] = [
  { id: 'interviews', label: 'Interviews' },
  { id: 'knowledge', label: 'Knowledge' },
];

const Navbar: FC<NavbarProps> = ({
  viewMode,
  onViewChange,
  onDownloadPDF,
  onPrint,
  isGeneratingPDF,
}) => {
  const isCVMode = viewMode === 'edit' || viewMode === 'previewOnly';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-semibold text-gray-900 tracking-tight">CV Studio</span>
        </div>

        {/* Navigation tabs */}
        <div className="flex items-center gap-1">
          {/* CV group */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
            {CV_MODES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          {/* Management group */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
            {TOOL_MODES.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  viewMode === id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Context-aware actions */}
        <div className="flex items-center gap-2 shrink-0">
          {isCVMode ? (
            <>
              <button
                onClick={onPrint}
                className="px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Print
              </button>
              <button
                onClick={onDownloadPDF}
                disabled={isGeneratingPDF}
                className="px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors"
              >
                {isGeneratingPDF ? 'Generating…' : 'Download PDF'}
              </button>
            </>
          ) : (
            <span className="text-xs text-gray-400 italic">
              {viewMode === 'interviews' ? 'Interview pipeline' : 'Knowledge base'}
            </span>
          )}
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
