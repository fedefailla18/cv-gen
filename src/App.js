import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
const App = () => {
    const { resume, theme, sections, setSections } = useResumeContext();
    const [viewMode, setViewMode] = useState('edit');
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
    const componentRef = useRef(null);
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `${resume.basics.name}-CV`,
    });
    const handleDownloadPDF = async () => {
        // Use the preview component reference if available, otherwise create a temporary one
        let elementToExport;
        if (componentRef.current) {
            // Clone the element to avoid affecting the display
            elementToExport = componentRef.current.cloneNode(true);
        }
        else {
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
            if (previewTitle)
                previewTitle.remove();
            await exportToPDF(elementToExport, `${resume.basics.name}-CV.pdf`);
        }
        catch (error) {
            console.error('Failed to generate PDF:', error);
            alert('Failed to generate PDF. Please try again.');
        }
        finally {
            setIsGeneratingPDF(false);
        }
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-100", children: [_jsx(Navbar, { viewMode: viewMode, onViewChange: setViewMode, onDownloadPDF: handleDownloadPDF, onPrint: handlePrint, isGeneratingPDF: isGeneratingPDF }), _jsxs("div", { className: "container mx-auto px-4 max-w-7xl py-8", children: [viewMode === 'edit' ? (_jsxs("div", { className: "grid grid-cols-3 lg:grid-cols-7 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-4", children: [_jsx(ThemeSelector, {}), _jsx(SectionsManager, {})] }), _jsx("div", { className: "lg:col-span-5", children: _jsx(Editor, {}) })] })) : viewMode === 'previewOnly' ? (_jsx(_Fragment, { children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-1 gap-6", children: [_jsx("div", { className: "lg:col-span-1 space-y-4 w-1/6", children: _jsx(ThemeSelector, {}) }), _jsxs("div", { className: "bg-white p-6 rounded-xl shadow-lg print:shadow-none print:rounded-none print:p-0", children: [_jsx("h2", { className: "text-xl font-semibold mb-4 space-y-3 print:hidden", children: "CV Preview" }), _jsx("div", { ref: componentRef, className: "print:p-0", children: _jsx(CVPreview, {}) })] })] }) })) : viewMode === 'interviews' ? (_jsx(InterviewsDashboard, {})) : (_jsx(KnowledgeBase, {})), _jsxs("div", { className: "mt-6 text-sm text-gray-600 bg-white p-4 rounded-lg shadow", children: [_jsx("p", { className: "font-semibold mb-1", children: "\uD83D\uDCA1 Tips:" }), _jsxs("ul", { className: "list-disc list-inside space-y-1", children: [_jsx("li", { children: "Edit your CV JSON in the editor on the left" }), _jsx("li", { children: "Drag and drop sections to reorder them" }), _jsx("li", { children: "Switch themes to see different styles" }), _jsx("li", { children: "Click \"Export to PDF\" to save your CV" })] })] })] })] }));
};
export default App;
