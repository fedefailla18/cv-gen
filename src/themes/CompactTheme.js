import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function CompactTheme({ resume, section }) {
    const data = resume[section];
    if (!data)
        return null;
    const renderSection = () => {
        switch (section) {
            case 'basics':
                return (_jsxs("div", { className: "mb-6 pb-3 border-b border-gray-200", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-1", children: data.name }), data.label && _jsx("p", { className: "text-base text-gray-600 mb-2", children: data.label }), _jsxs("div", { className: "flex flex-wrap gap-2 text-xs text-gray-600 mb-2", children: [data.email && _jsx("span", { children: data.email }), data.phone && _jsxs("span", { children: ["\u2022 ", data.phone] }), data.url && (_jsxs("a", { href: data.url, target: "_blank", rel: "noopener noreferrer", className: "text-gray-700 hover:underline", children: ["\u2022 ", data.url] })), data.location && (_jsxs("span", { children: ["\u2022", ' ', [data.location.city, data.location.region, data.location.countryCode]
                                            .filter(Boolean)
                                            .join(', ')] }))] }), data.summary && (_jsx("p", { className: "text-xs text-gray-700 leading-relaxed", children: data.summary }))] }));
            case 'work':
                if (!Array.isArray(data))
                    return null;
                return (_jsxs("div", { className: "mb-5", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-200", children: "Work Experience" }), _jsx("div", { className: "space-y-3", children: data.map((job, idx) => (_jsxs("div", { className: "pl-2 border-l border-gray-200", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-base font-semibold text-gray-900", children: job.position || job.name }), _jsx("p", { className: "text-sm text-gray-700", children: job.name })] }), _jsxs("span", { className: "text-xs text-gray-500 mt-0.5 sm:mt-0", children: [job.startDate, " - ", job.endDate] })] }), job.summary && (_jsx("p", { className: "text-xs text-gray-700 mb-1.5 leading-relaxed mt-1", children: job.summary })), job.highlights && Array.isArray(job.highlights) && job.highlights.length > 0 && (_jsx("ul", { className: "list-disc list-inside space-y-0.5 text-xs text-gray-600 mt-1.5", children: job.highlights.map((highlight, hIdx) => (_jsx("li", { children: highlight }, hIdx))) }))] }, idx))) })] }));
            case 'education':
                if (!Array.isArray(data))
                    return null;
                return (_jsxs("div", { className: "mb-5", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-200", children: "Education" }), _jsx("div", { className: "space-y-2", children: data.map((edu, idx) => (_jsxs("div", { className: "pl-2 border-l border-gray-200", children: [_jsx("h3", { className: "text-sm font-semibold text-gray-900", children: edu.area || edu.studyType }), _jsx("p", { className: "text-xs text-gray-700", children: edu.institution }), _jsxs("div", { className: "flex flex-wrap gap-2 text-xs text-gray-500 mt-0.5", children: [edu.startDate && edu.endDate && (_jsxs("span", { children: [edu.startDate, " - ", edu.endDate] })), edu.location && _jsxs("span", { children: ["\u2022 ", edu.location] })] })] }, idx))) })] }));
            case 'skills':
                if (!Array.isArray(data))
                    return null;
                return (_jsxs("div", { className: "mb-5", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-200", children: "Skills" }), _jsx("div", { className: "space-y-2", children: data.map((skill, idx) => (_jsxs("div", { className: "pl-2 border-l border-gray-200", children: [_jsxs("div", { className: "flex items-center gap-1.5", children: [_jsx("span", { className: "font-medium text-gray-900 text-xs", children: skill.name }), skill.level && _jsxs("span", { className: "text-xs text-gray-500", children: ["(", skill.level, ")"] })] }), skill.keywords && Array.isArray(skill.keywords) && skill.keywords.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-1 mt-1", children: skill.keywords.map((keyword, kIdx) => (_jsx("span", { className: "px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs", children: keyword }, kIdx))) }))] }, idx))) })] }));
            case 'languages':
                if (!Array.isArray(data))
                    return null;
                return (_jsxs("div", { className: "mb-5", children: [_jsx("h2", { className: "text-lg font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-200", children: "Languages" }), _jsx("div", { className: "space-y-1", children: data.map((lang, idx) => (_jsxs("div", { className: "flex items-center justify-between pl-2 border-l border-gray-200", children: [_jsx("span", { className: "text-xs font-medium text-gray-900", children: lang.language }), lang.fluency && _jsx("span", { className: "text-xs text-gray-500", children: lang.fluency })] }, idx))) })] }));
            default:
                return null;
        }
    };
    return _jsx("div", { children: renderSection() });
}
