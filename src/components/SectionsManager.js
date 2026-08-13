import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useResumeContext } from '../context/ResumeContext';
export const SectionsManager = () => {
    const { sections, addSection, removeSection } = useResumeContext();
    const [newSectionId, setNewSectionId] = useState('');
    const handleAdd = () => {
        const trimmed = newSectionId.trim();
        if (!trimmed)
            return;
        addSection(trimmed);
        setNewSectionId('');
    };
    return (_jsxs("div", { className: "bg-white p-4 rounded-lg shadow space-y-3", children: [_jsx("h3", { className: "font-semibold text-gray-800", children: "Sections" }), _jsx("ul", { className: "space-y-1 text-sm", children: sections.map((section) => (_jsxs("li", { className: "flex items-center justify-between", children: [_jsx("span", { children: section }), _jsx("button", { type: "button", onClick: () => removeSection(section), className: "text-xs text-red-600 hover:underline", children: "Remove" })] }, section))) }), _jsxs("div", { className: "flex gap-2 pt-2", children: [_jsx("input", { type: "text", value: newSectionId, onChange: (e) => setNewSectionId(e.target.value), placeholder: "custom-section-id", className: "flex-1 border rounded px-2 py-1 text-sm" }), _jsx("button", { type: "button", onClick: handleAdd, className: "text-sm bg-blue-600 text-white px-2 py-1 rounded", children: "Add" })] }), _jsxs("p", { className: "text-xs text-gray-500", children: ["Section IDs like ", _jsx("code", { children: "basics" }), ", ", _jsx("code", { children: "work" }), ", etc. Custom IDs can be anything; just make sure your theme knows how to render them."] })] }));
};
