import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { marked } from 'marked';
import { useMemo, useState } from 'react';
import { getCategories, loadThoughts } from '../utils/knowledgeUtils';
// ─── Badge helpers ────────────────────────────────────────────────────────────
const RELEVANCE_STYLES = {
    high: 'bg-green-100 text-green-700 border border-green-200',
    medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
    low: 'bg-gray-100 text-gray-600 border border-gray-200',
};
const DIFFICULTY_STYLES = {
    beginner: 'bg-blue-100 text-blue-700 border border-blue-200',
    intermediate: 'bg-orange-100 text-orange-700 border border-orange-200',
    advanced: 'bg-red-100 text-red-700 border border-red-200',
};
const Badge = ({ label, styles }) => (_jsx("span", { className: `px-2 py-0.5 rounded text-xs font-medium capitalize ${styles}`, children: label }));
// ─── Sidebar item ─────────────────────────────────────────────────────────────
const ThoughtCard = ({ thought, selected, onClick, }) => (_jsxs("button", { onClick: onClick, className: `w-full text-left p-3 rounded-lg border transition-all ${selected
        ? 'bg-gray-900 text-white border-gray-900'
        : 'bg-white text-gray-800 border-gray-200 hover:border-gray-400 hover:shadow-sm'}`, children: [_jsx("p", { className: `font-medium text-sm leading-snug mb-1 ${selected ? 'text-white' : 'text-gray-900'}`, children: thought.title }), _jsx("p", { className: `text-xs mb-2 truncate ${selected ? 'text-gray-300' : 'text-gray-500'}`, children: thought.summary }), _jsxs("div", { className: "flex items-center gap-1.5 flex-wrap", children: [_jsx("span", { className: `text-xs ${selected ? 'text-gray-400' : 'text-gray-400'}`, children: thought.category }), _jsx("span", { className: `text-xs ${selected ? 'text-gray-500' : 'text-gray-300'}`, children: "\u00B7" }), _jsx(Badge, { label: `interview: ${thought.interviewRelevance}`, styles: selected ? 'bg-white/20 text-white border-white/30' : RELEVANCE_STYLES[thought.interviewRelevance] })] })] }));
// ─── Content viewer ───────────────────────────────────────────────────────────
const ThoughtViewer = ({ thought }) => {
    const html = useMemo(() => marked.parse(thought.content), [thought.content]);
    return (_jsxs("div", { className: "h-full overflow-y-auto", children: [_jsxs("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-3", children: thought.title }), _jsx("p", { className: "text-gray-600 text-sm mb-4", children: thought.summary }), _jsxs("div", { className: "flex flex-wrap gap-2 mb-4", children: [_jsx(Badge, { label: thought.category, styles: "bg-gray-100 text-gray-700 border border-gray-200" }), _jsx(Badge, { label: thought.difficulty, styles: DIFFICULTY_STYLES[thought.difficulty] }), _jsx(Badge, { label: `Interview: ${thought.interviewRelevance}`, styles: RELEVANCE_STYLES[thought.interviewRelevance] }), thought.date && (_jsx("span", { className: "text-xs text-gray-400 self-center", children: thought.date }))] }), thought.tags.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1.5", children: thought.tags.map((tag) => (_jsxs("span", { className: "px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded border border-blue-100", children: ["#", tag] }, tag))) }))] }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-6", children: _jsx("div", { className: "knowledge-prose", dangerouslySetInnerHTML: { __html: html } }) })] }));
};
// ─── Empty state ──────────────────────────────────────────────────────────────
const EmptyState = () => (_jsx("div", { className: "h-full flex items-center justify-center", children: _jsxs("div", { className: "text-center text-gray-400", children: [_jsx("div", { className: "text-5xl mb-4", children: "\uD83D\uDCD6" }), _jsx("p", { className: "text-lg font-medium text-gray-500", children: "Select a topic" }), _jsxs("p", { className: "text-sm mt-1", children: ["Add notes to", ' ', _jsx("code", { className: "text-xs bg-gray-100 px-1.5 py-0.5 rounded", children: "src/my-thoughts/*.md" })] })] }) }));
// ─── Main component ───────────────────────────────────────────────────────────
const KnowledgeBase = () => {
    const thoughts = useMemo(() => loadThoughts(), []);
    const categories = useMemo(() => getCategories(thoughts), [thoughts]);
    const [selectedSlug, setSelectedSlug] = useState(thoughts.length > 0 ? thoughts[0].slug : null);
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return thoughts.filter((t) => {
            const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
            const matchesSearch = !q ||
                t.title.toLowerCase().includes(q) ||
                t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
                t.summary.toLowerCase().includes(q);
            return matchesCategory && matchesSearch;
        });
    }, [thoughts, search, activeCategory]);
    const selected = thoughts.find((t) => t.slug === selectedSlug) ?? null;
    return (_jsxs("div", { className: "flex gap-4 h-[calc(100vh-160px)]", children: [_jsxs("div", { className: "w-72 flex-shrink-0 flex flex-col gap-3", children: [_jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-3", children: _jsx("input", { type: "text", placeholder: "Search topics or tags...", value: search, onChange: (e) => setSearch(e.target.value), className: "w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300" }) }), _jsx("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex flex-wrap gap-1.5", children: categories.map((cat) => (_jsx("button", { onClick: () => setActiveCategory(cat), className: `px-2.5 py-1 text-xs rounded-lg border transition-colors ${activeCategory === cat
                                ? 'bg-gray-900 text-white border-gray-900'
                                : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'}`, children: cat }, cat))) }), _jsx("div", { className: "flex-1 overflow-y-auto space-y-2", children: filtered.length === 0 ? (_jsx("p", { className: "text-sm text-gray-400 text-center py-8", children: "No topics found" })) : (filtered.map((thought) => (_jsx(ThoughtCard, { thought: thought, selected: selectedSlug === thought.slug, onClick: () => setSelectedSlug(thought.slug) }, thought.slug)))) }), _jsxs("div", { className: "text-xs text-gray-400 text-center", children: [filtered.length, " / ", thoughts.length, " topics"] })] }), _jsx("div", { className: "flex-1 min-w-0", children: selected ? _jsx(ThoughtViewer, { thought: selected }) : _jsx(EmptyState, {}) })] }));
};
export default KnowledgeBase;
