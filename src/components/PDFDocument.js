import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
// Register fonts for better typography (optional - uses system fonts if not available)
// You can add custom fonts later if needed
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 11,
        fontFamily: 'Helvetica',
        lineHeight: 1.5,
    },
    header: {
        marginBottom: 20,
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#2563eb',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#111827',
    },
    label: {
        fontSize: 14,
        color: '#4b5563',
        marginBottom: 10,
    },
    contactInfo: {
        fontSize: 10,
        color: '#6b7280',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 5,
    },
    contactItem: {
        marginRight: 10,
    },
    summary: {
        marginTop: 10,
        fontSize: 11,
        color: '#374151',
        lineHeight: 1.6,
    },
    section: {
        marginBottom: 20,
        minHeight: 50, // Minimum height to prevent awkward breaks
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 12,
        paddingBottom: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#2563eb',
        color: '#111827',
        marginTop: 10,
    },
    workItem: {
        marginBottom: 15,
        minHeight: 40, // Keep work items together when possible
    },
    workHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    workPosition: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#111827',
    },
    workCompany: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#2563eb',
    },
    workDates: {
        fontSize: 10,
        color: '#6b7280',
        fontStyle: 'italic',
    },
    workSummary: {
        fontSize: 10,
        color: '#374151',
        marginTop: 5,
        lineHeight: 1.5,
    },
    highlights: {
        marginTop: 5,
        paddingLeft: 15,
    },
    highlightItem: {
        fontSize: 10,
        color: '#374151',
        marginBottom: 3,
    },
    educationItem: {
        marginBottom: 10,
        minHeight: 30,
    },
    educationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 3,
    },
    educationInstitution: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#111827',
    },
    educationArea: {
        fontSize: 11,
        color: '#4b5563',
    },
    educationDates: {
        fontSize: 10,
        color: '#6b7280',
    },
    skillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 5,
    },
    skillItem: {
        fontSize: 10,
        color: '#374151',
        marginRight: 10,
        marginBottom: 5,
    },
    languageItem: {
        fontSize: 10,
        color: '#374151',
        marginBottom: 5,
    },
});
const PDFDocument = ({ resume, sections }) => {
    const { basics, work = [], education = [], skills = [], languages = [] } = resume;
    const renderBasics = () => (_jsxs(View, { style: styles.header, children: [_jsx(Text, { style: styles.name, children: basics.name }), basics.label && _jsx(Text, { style: styles.label, children: basics.label }), _jsxs(View, { style: styles.contactInfo, children: [basics.email && _jsx(Text, { style: styles.contactItem, children: basics.email }), basics.phone && _jsxs(Text, { style: styles.contactItem, children: ["\u2022 ", basics.phone] }), basics.url && _jsxs(Text, { style: styles.contactItem, children: ["\u2022 ", basics.url] }), basics.location && (_jsxs(Text, { style: styles.contactItem, children: ["\u2022 ", [basics.location.city, basics.location.region, basics.location.countryCode]
                                .filter(Boolean)
                                .join(', ')] }))] }), basics.summary && _jsx(Text, { style: styles.summary, children: basics.summary })] }));
    const renderWork = () => {
        if (!work.length)
            return null;
        return (_jsxs(View, { style: styles.section, children: [_jsx(Text, { style: styles.sectionTitle, children: "Work Experience" }), work.map((w, i) => (_jsxs(View, { style: styles.workItem, children: [_jsxs(View, { style: styles.workHeader, children: [_jsxs(View, { children: [_jsx(Text, { style: styles.workPosition, children: w.position || 'Position' }), _jsx(Text, { style: styles.workCompany, children: w.name })] }), _jsxs(Text, { style: styles.workDates, children: [w.startDate, " - ", w.endDate || 'Present'] })] }), w.summary && _jsx(Text, { style: styles.workSummary, children: w.summary }), w.highlights && w.highlights.length > 0 && (_jsx(View, { style: styles.highlights, children: w.highlights.map((h, idx) => (_jsxs(Text, { style: styles.highlightItem, children: ["\u2022 ", h] }, idx))) }))] }, i)))] }));
    };
    const renderEducation = () => {
        if (!education.length)
            return null;
        return (_jsxs(View, { style: styles.section, children: [_jsx(Text, { style: styles.sectionTitle, children: "Education" }), education.map((e, i) => (_jsxs(View, { style: styles.educationItem, children: [_jsxs(View, { style: styles.educationHeader, children: [_jsxs(View, { children: [_jsx(Text, { style: styles.educationInstitution, children: e.institution }), _jsx(Text, { style: styles.educationArea, children: e.area })] }), _jsxs(Text, { style: styles.educationDates, children: [e.startDate, " - ", e.endDate || 'Present'] })] }), e.location && (_jsx(Text, { style: { fontSize: 10, color: '#6b7280' }, children: e.location }))] }, i)))] }));
    };
    const renderSkills = () => {
        if (!skills.length)
            return null;
        return (_jsxs(View, { style: styles.section, children: [_jsx(Text, { style: styles.sectionTitle, children: "Skills" }), skills.map((s, i) => (_jsxs(View, { style: { marginBottom: 8 }, children: [_jsxs(Text, { style: { fontSize: 11, fontWeight: 'bold', marginBottom: 3 }, children: [s.name, s.level && ` - ${s.level}`] }), s.keywords && s.keywords.length > 0 && (_jsx(View, { style: styles.skillsContainer, children: s.keywords.map((keyword, idx) => (_jsxs(Text, { style: styles.skillItem, children: [keyword, idx < s.keywords.length - 1 ? ', ' : ''] }, idx))) }))] }, i)))] }));
    };
    const renderLanguages = () => {
        if (!languages.length)
            return null;
        return (_jsxs(View, { style: styles.section, children: [_jsx(Text, { style: styles.sectionTitle, children: "Languages" }), languages.map((l, i) => (_jsxs(Text, { style: styles.languageItem, children: [l.language, " - ", l.fluency || 'Proficient'] }, i)))] }));
    };
    const renderSection = (section) => {
        switch (section) {
            case 'basics':
                return renderBasics();
            case 'work':
                return renderWork();
            case 'education':
                return renderEducation();
            case 'skills':
                return renderSkills();
            case 'languages':
                return renderLanguages();
            default:
                return null;
        }
    };
    return (_jsx(Document, { children: _jsx(Page, { size: "A4", style: styles.page, wrap: true, children: sections.map((section) => (_jsx(React.Fragment, { children: renderSection(section) }, section))) }) }));
};
export default PDFDocument;
