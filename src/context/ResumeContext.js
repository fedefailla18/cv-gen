import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState } from 'react';
import resumeData from '../resume.json';
const ResumeContext = createContext(undefined);
export const ResumeProvider = ({ children }) => {
    const [resume, setResume] = useState(resumeData);
    const [theme, setTheme] = useState('modern');
    const [sections, setSections] = useState([
        'basics',
        'work',
        'education',
        'skills',
        'languages',
    ]);
    const addSection = (id) => {
        setSections((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };
    const removeSection = (id) => {
        setSections((prev) => prev.filter((s) => s !== id));
    };
    const value = {
        resume,
        setResume,
        theme,
        setTheme,
        sections,
        addSection,
        removeSection,
        setSections,
    };
    return _jsx(ResumeContext.Provider, { value: value, children: children });
};
export const useResumeContext = () => {
    const ctx = useContext(ResumeContext);
    if (!ctx) {
        throw new Error('useResumeContext must be used within a ResumeProvider');
    }
    return ctx;
};
