import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const FeedbackEditor = ({ initialFeedback, onSave, onCancel }) => {
    const [feedback, setFeedback] = useState(initialFeedback);
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Manual Feedback Editor" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: onCancel, className: "text-[10px] px-3 py-1 bg-white border border-gray-200 text-gray-500 rounded font-bold hover:bg-gray-50 uppercase tracking-wider transition-colors", children: "Cancel" }), _jsx("button", { onClick: () => onSave(feedback), className: "text-[10px] px-3 py-1 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 uppercase tracking-wider transition-colors", children: "Save Feedback" })] })] }), _jsx("textarea", { value: feedback, onChange: (e) => setFeedback(e.target.value), className: "w-full h-64 p-4 font-sans text-sm text-gray-800 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white", placeholder: "Paste or type candidate feedback here...", autoFocus: true })] }));
};
export default FeedbackEditor;
