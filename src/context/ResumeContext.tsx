import React, { createContext, ReactNode,useContext, useState } from 'react'

import resumeData from '../resume.json'
import { ThemeName } from "../themes";
import { Resume } from '../types'

export type ResumeSectionId =
    | 'basics'
    | 'work'
    | 'education'
    | 'skills'
    | 'languages'
    | string // for custom sections

interface ResumeContextValue {
    resume: Resume,
    setResume: (resume: Resume) => void,
    theme: ThemeName,
    setTheme: (theme: ThemeName) => void,
    sections: ResumeSectionId[],
    addSection: (id: ResumeSectionId) => void,
    removeSection: (id: ResumeSectionId) => void,
    setSections: (sections: ResumeSectionId[]) => void,
}

const ResumeContext = createContext<ResumeContextValue | undefined>(undefined)

export const ResumeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [resume, setResume] = useState<Resume>(resumeData as unknown as Resume)
    const [theme, setTheme] = useState<ThemeName>('modern')
    const [sections, setSections] = useState<ResumeSectionId[]>([
        'basics',
        'work',
        'education',
        'skills',
        'languages',
    ])

    const addSection = (id: ResumeSectionId) => {
        setSections((prev) => (prev.includes(id) ? prev : [...prev, id]))
    }

    const removeSection = (id: ResumeSectionId) => {
        setSections((prev) => prev.filter((s) => s !== id))
    }

    const value: ResumeContextValue = {
        resume,
        setResume,
        theme,
        setTheme,
        sections,
        addSection,
        removeSection,
        setSections,
    }

    return <ResumeContext.Provider value={value}>{children}</ResumeContext.Provider>
}

export const useResumeContext = (): ResumeContextValue => {
    const ctx = useContext(ResumeContext)
    if (!ctx) {
        throw new Error('useResumeContext must be used within a ResumeProvider')
    }
    return ctx
}