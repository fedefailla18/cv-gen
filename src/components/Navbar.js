import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const CV_MODES = [
    { id: 'edit', label: 'Edit' },
    { id: 'previewOnly', label: 'Preview' },
];
const TOOL_MODES = [
    { id: 'interviews', label: 'Interviews' },
    { id: 'knowledge', label: 'Knowledge' },
];
const Navbar = ({ viewMode, onViewChange, onDownloadPDF, onPrint, isGeneratingPDF, }) => {
    const isCVMode = viewMode === 'edit' || viewMode === 'previewOnly';
    return (_jsx("nav", { className: "sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm print:hidden", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4", children: [_jsx("div", { className: "flex items-center gap-2 shrink-0", children: _jsx("span", { className: "text-lg font-semibold text-gray-900 tracking-tight", children: "CV Studio" }) }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("div", { className: "flex items-center bg-gray-100 rounded-lg p-1 gap-1", children: CV_MODES.map(({ id, label }) => (_jsx("button", { onClick: () => onViewChange(id), className: `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === id
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'}`, children: label }, id))) }), _jsx("div", { className: "w-px h-5 bg-gray-200 mx-1" }), _jsx("div", { className: "flex items-center bg-gray-100 rounded-lg p-1 gap-1", children: TOOL_MODES.map(({ id, label }) => (_jsx("button", { onClick: () => onViewChange(id), className: `px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${viewMode === id
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'}`, children: label }, id))) })] }), _jsx("div", { className: "flex items-center gap-2 shrink-0", children: isCVMode ? (_jsxs(_Fragment, { children: [_jsx("button", { onClick: onPrint, className: "px-3 py-1.5 text-sm font-medium text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors", children: "Print" }), _jsx("button", { onClick: onDownloadPDF, disabled: isGeneratingPDF, className: "px-4 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed rounded-lg shadow-sm transition-colors", children: isGeneratingPDF ? 'Generating…' : 'Download PDF' })] })) : (_jsx("span", { className: "text-xs text-gray-400 italic", children: viewMode === 'interviews' ? 'Interview pipeline' : 'Knowledge base' })) })] }) }));
};
export default Navbar;
