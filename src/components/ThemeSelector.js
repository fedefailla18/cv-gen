import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useResumeContext } from '../context/ResumeContext';
import { THEMES } from '../themes';
const prettyThemeLabels = {
    modern: 'Modern',
    minimal: 'Minimal',
    compact: 'Compact',
    twocolumn: 'Two Column',
};
const ThemeSelector = () => {
    const { theme, setTheme } = useResumeContext();
    const handleThemeChange = (e) => {
        setTheme(e.target.value);
    };
    return (_jsxs("div", { className: "bg-white p-4 rounded-xl shadow", children: [_jsx("h2", { className: "text-lg font-semibold mb-2", children: "Theme" }), _jsx("select", { className: "w-full p-2 border rounded", value: theme, onChange: handleThemeChange, children: Object.keys(THEMES).map((key) => {
                    const name = key;
                    return (_jsx("option", { value: key, children: prettyThemeLabels[name] ?? name }, key));
                }) })] }));
};
export default ThemeSelector;
