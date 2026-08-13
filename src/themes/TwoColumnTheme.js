import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function TwoColumnTheme({ resume, section }) {
    const data = resume[section];
    if (!data)
        return null;
    const renderSection = () => {
        switch (section) {
            case 'basics':
                return (_jsxs("div", { className: "mb-8 pb-6 border-b-2 border-indigo-500", children: [_jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: data.name }), data.label && _jsx("p", { className: "text-xl text-gray-600 mb-4", children: data.label }), _jsxs("div", { className: "flex flex-wrap gap-4 text-sm text-gray-700 mb-4", children: [data.email && _jsxs("span", { children: ["\uD83D\uDCE7 ", data.email] }), data.phone && _jsxs("span", { children: ["\uD83D\uDCDE ", data.phone] }), data.url && (_jsxs("a", { href: data.url, target: "_blank", rel: "noopener noreferrer", className: "text-indigo-600 hover:underline", children: ["\uD83D\uDD17 ", data.url] })), data.location && (_jsxs("span", { children: ["\uD83D\uDCCD", ' ', [data.location.city, data.location.region, data.location.countryCode]
                                            .filter(Boolean)
                                            .join(', ')] }))] }), data.summary && _jsx("p", { className: "text-gray-700 leading-relaxed", children: data.summary })] }));
            case 'work':
                if (!Array.isArray(data))
                    return null;
                return (_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-500", children: "Work Experience" }), _jsx("div", { className: "space-y-6", children: data.map((job, idx) => (_jsxs("div", { className: "border-l-4 border-indigo-500 pl-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-gray-900", children: job.position || job.name }), _jsx("p", { className: "text-lg text-gray-700 font-medium", children: job.name })] }), _jsxs("span", { className: "text-sm text-gray-600 mt-1 sm:mt-0", children: [job.startDate, " - ", job.endDate] })] }), job.summary && (_jsx("p", { className: "text-gray-700 mb-3 leading-relaxed", children: job.summary })), job.highlights && Array.isArray(job.highlights) && job.highlights.length > 0 && (_jsx("ul", { className: "list-disc list-inside space-y-1 text-gray-700", children: job.highlights.map((highlight, hIdx) => (_jsx("li", { children: highlight }, hIdx))) }))] }, idx))) })] }));
            case 'education':
                if (!Array.isArray(data))
                    return null;
                return (_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-500", children: "Education" }), _jsx("div", { className: "space-y-4", children: data.map((edu, idx) => (_jsxs("div", { className: "border-l-4 border-indigo-500 pl-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900", children: edu.area || edu.studyType }), _jsx("p", { className: "text-gray-700 font-medium", children: edu.institution }), _jsxs("div", { className: "flex flex-wrap gap-3 text-sm text-gray-600 mt-1", children: [edu.startDate && edu.endDate && (_jsxs("span", { children: [edu.startDate, " - ", edu.endDate] })), edu.location && _jsxs("span", { children: ["\uD83D\uDCCD ", edu.location] })] })] }, idx))) })] }));
            case 'skills':
                if (!Array.isArray(data))
                    return null;
                return (_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-500", children: "Skills" }), _jsx("div", { className: "space-y-4", children: data.map((skill, idx) => (_jsxs("div", { className: "border-l-4 border-indigo-500 pl-4", children: [_jsxs("div", { className: "flex items-center gap-2 mb-1", children: [_jsx("span", { className: "font-semibold text-gray-900", children: skill.name }), skill.level && _jsxs("span", { className: "text-sm text-gray-600", children: ["(", skill.level, ")"] })] }), skill.keywords && Array.isArray(skill.keywords) && skill.keywords.length > 0 && (_jsx("div", { className: "flex flex-wrap gap-2 mt-2", children: skill.keywords.map((keyword, kIdx) => (_jsx("span", { className: "px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm", children: keyword }, kIdx))) }))] }, idx))) })] }));
            case 'languages':
                if (!Array.isArray(data))
                    return null;
                return (_jsxs("div", { className: "mb-6", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-500", children: "Languages" }), _jsx("div", { className: "space-y-2", children: data.map((lang, idx) => (_jsxs("div", { className: "flex items-center justify-between border-l-4 border-indigo-500 pl-4", children: [_jsx("span", { className: "font-medium text-gray-900", children: lang.language }), lang.fluency && _jsx("span", { className: "text-sm text-gray-600", children: lang.fluency })] }, idx))) })] }));
            default:
                return null;
        }
    };
    return _jsx("div", { children: renderSection() });
}
