import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { parseEvaluationCsv } from '../utils/csvUtils';
const CreateCandidateForm = ({ jobs, onSubmit, onCancel }) => {
    const [csvInput, setCsvInput] = useState('');
    const [showCsvImporter, setShowCsvImporter] = useState(false);
    const [formData, setFormData] = useState({
        candidate_name: '',
        interview_date: new Date().toISOString().split('T')[0],
        job_id: jobs[0]?.id || '',
        profile_summary: '',
        hr_context: '',
        technical_summary: '',
        scores: {
            'Agile/Scrum': 3,
            'English Level': 3,
            'Java (JVM/Memory)': 3,
            'Spring/Boot': 3,
            'SQL/Database': 3,
        }
    });
    const [isNewJob, setIsNewJob] = useState(false);
    const [newJobData, setNewJobData] = useState({
        title: '',
        department: '',
        description: ''
    });
    const handleJobChange = (e) => {
        const value = e.target.value;
        if (value === 'NEW_JOB') {
            setIsNewJob(true);
            setFormData({ ...formData, job_id: 'new-job-role' });
        }
        else {
            setIsNewJob(false);
            setFormData({ ...formData, job_id: value });
        }
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        const finalInput = {
            ...formData,
            new_job: isNewJob ? newJobData : undefined
        };
        onSubmit(finalInput);
    };
    const handleImportCsv = () => {
        const { scores, notes } = parseEvaluationCsv(csvInput);
        if (Object.keys(scores).length > 0 || notes.length > 0) {
            setFormData({
                ...formData,
                scores: { ...formData.scores, ...scores },
                technical_summary: formData.technical_summary + (notes.length > 0 ? '\n\n' + notes.join('\n') : '')
            });
            setShowCsvImporter(false);
            setCsvInput('');
        }
        else {
            alert('No valid score data found. Please ensure you copied the rows from the evaluation sheet correctly.');
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-6 animate-in slide-in-from-bottom-4 duration-500", children: [_jsxs("div", { className: "flex justify-between items-center border-b pb-4", children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800 tracking-tight", children: "Add New Candidate" }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: () => setShowCsvImporter(!showCsvImporter), className: "px-4 py-2 text-[10px] font-black uppercase text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all mr-4 tracking-widest border border-blue-100 shadow-sm", children: showCsvImporter ? 'Close Importer' : '⚡ Import CSV from Sheet' }), _jsx("button", { type: "button", onClick: onCancel, className: "px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all active:scale-95", children: "Create Candidate" })] })] }), showCsvImporter && (_jsxs("div", { className: "bg-blue-600 p-6 rounded-xl space-y-4 animate-in zoom-in-95 duration-300 shadow-inner", children: [_jsxs("div", { className: "flex justify-between items-center text-white", children: [_jsx("h4", { className: "font-bold uppercase text-[10px] tracking-widest", children: "Smart CSV Importer" }), _jsx("span", { className: "text-[9px] opacity-75 font-bold uppercase tracking-tight", children: "Copy rows from your Google Sheet and paste them here" })] }), _jsx("textarea", { value: csvInput, onChange: (e) => setCsvInput(e.target.value), className: "w-full p-4 h-32 bg-white/10 border border-blue-400 rounded-lg text-white font-mono text-xs placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50", placeholder: "Paste CSV rows here (e.g. 'Experience in development processes',3,100%)..." }), _jsx("button", { type: "button", onClick: handleImportCsv, className: "w-full py-3 bg-white text-blue-700 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-blue-50 transition-all shadow-lg active:scale-95", children: "Parse & Populate Scores" })] })), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1", children: "Candidate Name" }), _jsx("input", { type: "text", required: true, value: formData.candidate_name, onChange: (e) => setFormData({ ...formData, candidate_name: e.target.value }), className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none", placeholder: "e.g. John Doe" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1", children: "Interview Date" }), _jsx("input", { type: "date", required: true, value: formData.interview_date, onChange: (e) => setFormData({ ...formData, interview_date: e.target.value }), className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1", children: "Job Role" }), _jsxs("select", { value: isNewJob ? 'NEW_JOB' : formData.job_id, onChange: handleJobChange, className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none", children: [jobs.map(job => _jsx("option", { value: job.id, children: job.title }, job.id)), _jsx("option", { value: "NEW_JOB", className: "text-blue-600 font-bold", children: "+ Add New Role..." })] })] }), isNewJob && (_jsxs("div", { className: "p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-4 animate-in zoom-in-95 duration-300", children: [_jsx("h4", { className: "text-sm font-bold text-blue-800", children: "New Job Details" }), _jsx("input", { type: "text", required: true, placeholder: "Job Title", value: newJobData.title, onChange: (e) => setNewJobData({ ...newJobData, title: e.target.value }), className: "w-full p-2 bg-white border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" }), _jsx("input", { type: "text", required: true, placeholder: "Department", value: newJobData.department, onChange: (e) => setNewJobData({ ...newJobData, department: e.target.value }), className: "w-full p-2 bg-white border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm" }), _jsx("textarea", { required: true, placeholder: "Role Description", value: newJobData.description, onChange: (e) => setNewJobData({ ...newJobData, description: e.target.value }), className: "w-full p-2 bg-white border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm min-h-[80px]" })] }))] }), _jsx("div", { className: "space-y-4", children: _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1", children: "Technical Scores (0-4)" }), _jsx("div", { className: "grid grid-cols-2 gap-3", children: Object.entries(formData.scores).map(([skill, score]) => (_jsxs("div", { className: "flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-100", children: [_jsx("span", { className: "text-[10px] font-bold text-gray-600 flex-1 truncate", children: skill }), _jsx("input", { type: "number", min: "0", max: "4", step: "0.1", value: score, onChange: (e) => setFormData({
                                                    ...formData,
                                                    scores: { ...formData.scores, [skill]: parseFloat(e.target.value) }
                                                }), className: "w-12 p-1 text-center bg-white border border-gray-200 rounded text-xs font-bold text-blue-600" })] }, skill))) })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-50", children: [_jsxs("div", { className: "md:col-span-1", children: [_jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1", children: "Candidate Profile" }), _jsx("textarea", { value: formData.profile_summary, onChange: (e) => setFormData({ ...formData, profile_summary: e.target.value }), className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm min-h-[120px]", placeholder: "Brief profile summary..." })] }), _jsxs("div", { className: "md:col-span-1", children: [_jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1", children: "HR Context" }), _jsx("textarea", { value: formData.hr_context, onChange: (e) => setFormData({ ...formData, hr_context: e.target.value }), className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm min-h-[120px]", placeholder: "HR interview highlights..." })] }), _jsxs("div", { className: "md:col-span-1", children: [_jsx("label", { className: "block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1", children: "Technical Interview Note" }), _jsx("textarea", { value: formData.technical_summary, onChange: (e) => setFormData({ ...formData, technical_summary: e.target.value }), className: "w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm min-h-[120px]", placeholder: "Brief technical interview notes..." })] })] })] }));
};
export default CreateCandidateForm;
