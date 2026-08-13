import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { generateCandidateMarkdown, generateJobMarkdown } from '../utils/interviewData';
import { saveFile } from '../utils/persistence';
import CreateCandidateForm from './CreateCandidateForm';
import NotesEditor from './NotesEditor';
import FeedbackEditor from './FeedbackEditor';
const InterviewsDashboard = () => {
    const [localJobs, setLocalJobs] = useState([]);
    const [localCandidates, setLocalCandidates] = useState([]);
    const [selectedJobId, setSelectedJobId] = useState('');
    const [viewSubModes, setViewSubModes] = useState({});
    const [showAddForm, setShowAddForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const feedbackRefs = useRef({});
    // 1. Fetch dynamic data on mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/data');
                if (response.ok) {
                    const { jobs, candidates } = await response.json();
                    setLocalJobs(jobs);
                    setLocalCandidates(candidates);
                    if (jobs.length > 0)
                        setSelectedJobId(jobs[0].id);
                }
            }
            catch (error) {
                console.error('Failed to load data:', error);
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);
    const filteredCandidates = localCandidates
        .filter((c) => c.job_id === selectedJobId)
        .sort((a, b) => new Date(b.interview_date).getTime() - new Date(a.interview_date).getTime());
    const toggleSubMode = (name, mode) => {
        setViewSubModes((prev) => {
            const currentMode = prev[name] || 'none';
            const newMode = currentMode === mode ? 'none' : mode;
            if (newMode !== 'none') {
                setTimeout(() => {
                    feedbackRefs.current[name]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
            return { ...prev, [name]: newMode };
        });
    };
    const handleSaveNotes = async (name, newNotes) => {
        const candidate = localCandidates.find(c => c.candidate_name === name);
        if (!candidate)
            return;
        // 1. Reconstruct the YAML frontmatter to prevent it from being removed
        const header = `---
candidate_name: ${candidate.candidate_name}
interview_date: ${candidate.interview_date}
interviewer: ${candidate.interviewer || 'Federico'}
role: ${candidate.role}
job_id: ${candidate.job_id}
status: ${candidate.status}
---

`;
        const fullContent = header + newNotes.trim();
        // 2. Generate path and save
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        const candidatePath = `interviews/candidates/${slug}/notes.md`;
        const result = await saveFile(candidatePath, fullContent);
        if (result.success) {
            // 3. Re-parse scores from the new notes to update UI scorecards immediately
            const newScores = {};
            const scoreMatches = newNotes.match(/- \*\*([\s\S]*?):\*\* ([\d.]+)/g);
            if (scoreMatches) {
                scoreMatches.forEach(m => {
                    const match = m.match(/- \*\*([\s\S]*?):\*\* ([\d.]+)/);
                    if (match)
                        newScores[match[1]] = parseFloat(match[2]);
                });
            }
            setLocalCandidates((prev) => prev.map((c) => (c.candidate_name === name ? { ...c, rawNotes: newNotes, scores: newScores } : c)));
            toggleSubMode(name, 'notes'); // Close editor
        }
        else {
            console.error('Failed to save notes to disk:', result.error);
            alert(`Error saving to disk: ${result.error}`);
        }
    };
    const handleSaveFeedback = async (name, newFeedback) => {
        const candidate = localCandidates.find(c => c.candidate_name === name);
        if (!candidate)
            return;
        const slug = name.toLowerCase().replace(/\s+/g, '-');
        const feedbackPath = `interviews/candidates/${slug}/feedback.md`;
        const result = await saveFile(feedbackPath, newFeedback.trim());
        if (result.success) {
            setLocalCandidates((prev) => prev.map((c) => (c.candidate_name === name ? { ...c, feedback: newFeedback } : c)));
            setViewSubModes((prev) => ({ ...prev, [name]: 'feedback' }));
        }
        else {
            console.error('Failed to save feedback to disk:', result.error);
            alert(`Error saving to disk: ${result.error}`);
        }
    };
    const handleCreateCandidate = async (input) => {
        let finalJobId = input.job_id;
        let jobTitle = localJobs.find(j => j.id === finalJobId)?.title || '';
        // 1. Handle New Job Creation
        if (input.new_job) {
            const jobSlug = input.new_job.title.toLowerCase().replace(/\s+/g, '-');
            const jobPath = `interviews/jobs/${jobSlug}.md`;
            const jobMarkdown = generateJobMarkdown(input.new_job);
            const jobResult = await saveFile(jobPath, jobMarkdown);
            if (jobResult.success) {
                const newJob = { id: jobSlug, title: input.new_job.title, department: input.new_job.department, status: 'Open', description: input.new_job.description };
                setLocalJobs([...localJobs, newJob]);
                finalJobId = jobSlug;
                jobTitle = input.new_job.title;
            }
            else {
                alert(`Failed to create job file: ${jobResult.error}`);
                return;
            }
        }
        // 2. Handle Candidate Creation
        const candidateSlug = input.candidate_name.toLowerCase().replace(/\s+/g, '-');
        const candidatePath = `interviews/candidates/${candidateSlug}/notes.md`;
        const candidateMarkdown = generateCandidateMarkdown(input, jobTitle);
        const candidateResult = await saveFile(candidatePath, candidateMarkdown);
        if (candidateResult.success) {
            const newCandidate = {
                candidate_name: input.candidate_name,
                interview_date: input.interview_date,
                interviewer: 'Federico',
                role: jobTitle,
                job_id: finalJobId,
                status: 'Technical Interview Completed',
                scores: input.scores,
                rawNotes: candidateMarkdown,
                feedback: '' // Initial feedback is empty
            };
            setLocalCandidates([newCandidate, ...localCandidates]);
            setSelectedJobId(finalJobId);
            setShowAddForm(false);
        }
        else {
            alert(`Failed to create candidate file: ${candidateResult.error}`);
        }
    };
    return (_jsxs("div", { className: "space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20", children: [_jsxs("div", { className: "flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-xl font-bold text-gray-800 tracking-tight text-blue-900", children: "Interview Pipeline" }), _jsx("p", { className: "text-[10px] text-gray-400 uppercase font-black tracking-widest", children: "Technical Calibration Hub" })] }), _jsxs("button", { onClick: () => setShowAddForm(true), className: "px-6 py-2 bg-blue-600 text-white rounded-full font-bold shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95", children: [_jsx("span", { className: "text-xl leading-none", children: "+" }), " Add Candidate"] })] }), isLoading ? (_jsx("div", { className: "text-center py-20 text-gray-400 italic animate-pulse", children: "Loading dynamic records..." })) : (_jsxs(_Fragment, { children: [showAddForm && (_jsx(CreateCandidateForm, { jobs: localJobs, onSubmit: handleCreateCandidate, onCancel: () => setShowAddForm(false) })), _jsx("div", { className: "flex gap-2 overflow-x-auto pb-2 no-scrollbar", children: localJobs.map((job) => (_jsx("button", { onClick: () => setSelectedJobId(job.id), className: `whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border-2 ${selectedJobId === job.id
                                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'}`, children: job.title }, job.id))) }), _jsx("div", { className: "space-y-3", children: filteredCandidates.length === 0 ? (_jsx("div", { className: "bg-white p-12 rounded-xl shadow text-center text-gray-500 italic border border-dashed border-gray-200", children: "No candidates found for this role." })) : (filteredCandidates.map((candidate) => (_jsxs("div", { className: "bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all", children: [_jsxs("div", { className: "p-4 flex items-center justify-between hover:bg-gray-50 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-inner", children: candidate.candidate_name.charAt(0) }), _jsxs("div", { children: [_jsx("h3", { className: "font-bold text-gray-900 leading-tight", children: candidate.candidate_name }), _jsxs("div", { className: "text-[9px] text-gray-400 uppercase font-black tracking-widest mt-0.5", children: [candidate.interview_date, " \u2022 ", candidate.status] })] })] }), _jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "hidden md:flex gap-3", children: Object.entries(candidate.scores || {}).slice(0, 4).map(([skill, score]) => (_jsxs("div", { className: "text-center px-2 border-r border-gray-100 last:border-0", children: [_jsx("div", { className: "text-[8px] text-gray-400 uppercase font-black tracking-tighter", children: skill.split(' ')[0] }), _jsx("div", { className: "text-sm font-bold text-blue-600", children: String(score) })] }, skill))) }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => toggleSubMode(candidate.candidate_name, 'notes'), className: `p-2 rounded-lg transition-all ${viewSubModes[candidate.candidate_name] === 'notes'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : 'text-gray-300 hover:bg-gray-100 hover:text-gray-600'}`, title: "Edit Notes", children: _jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: [_jsx("path", { d: "M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" }), _jsx("path", { fillRule: "evenodd", d: "M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z", clipRule: "evenodd" })] }) }), _jsx("button", { onClick: () => toggleSubMode(candidate.candidate_name, 'feedback'), className: `px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${viewSubModes[candidate.candidate_name] === 'feedback'
                                                                ? 'bg-gray-900 text-white'
                                                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'}`, children: viewSubModes[candidate.candidate_name] === 'feedback' ? 'Hide Feedback' : 'View Feedback' })] })] })] }), (viewSubModes[candidate.candidate_name] && viewSubModes[candidate.candidate_name] !== 'none') && (_jsx("div", { ref: (el) => (feedbackRefs.current[candidate.candidate_name] = el), className: "bg-gray-50 border-t border-gray-100 p-6 animate-in slide-in-from-top-2 duration-300", children: viewSubModes[candidate.candidate_name] === 'feedback' ? (_jsxs("div", { className: "max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100 prose prose-blue prose-sm relative group", children: [_jsxs("div", { className: "flex justify-between items-start mb-6", children: [_jsx("div", { className: "bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded inline-block uppercase tracking-widest", children: "Technical Calibration Report" }), _jsx("button", { onClick: () => setViewSubModes(prev => ({ ...prev, [candidate.candidate_name]: 'edit-feedback' })), className: "opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-gray-100 text-gray-500 rounded hover:bg-blue-100 hover:text-blue-600", title: "Edit Feedback", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-4 w-4", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { d: "M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" }) }) })] }), candidate.feedback ? (_jsx("div", { className: "whitespace-pre-wrap font-sans text-gray-800 leading-relaxed", children: candidate.feedback })) : (_jsxs("div", { className: "text-center py-10 space-y-4", children: [_jsx("p", { className: "text-gray-500 italic", children: "No feedback generated yet. Use the CLI or add it manually." }), _jsxs("div", { className: "flex flex-col gap-3 items-center", children: [_jsx("button", { onClick: () => setViewSubModes(prev => ({ ...prev, [candidate.candidate_name]: 'edit-feedback' })), className: "px-6 py-2 bg-white border border-blue-200 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-50 transition-colors shadow-sm", children: "+ Add Manual Feedback" }), _jsxs("div", { className: "text-[10px] bg-gray-50 p-4 rounded border border-dashed border-gray-300 font-mono text-gray-600 max-w-md", children: ["gemini: \"Generate feedback for interviews/candidates/", candidate.candidate_name.toLowerCase().replace(/\s+/g, '-'), "/notes.md\""] })] })] }))] })) : viewSubModes[candidate.candidate_name] === 'edit-feedback' ? (_jsx("div", { className: "max-w-3xl mx-auto", children: _jsx(FeedbackEditor, { initialFeedback: candidate.feedback || '', onSave: (fb) => handleSaveFeedback(candidate.candidate_name, fb), onCancel: () => setViewSubModes(prev => ({ ...prev, [candidate.candidate_name]: 'feedback' })) }) })) : (_jsxs("div", { className: "max-w-4xl mx-auto space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-2", children: [_jsx("h4", { className: "text-[10px] font-black text-gray-400 uppercase tracking-widest", children: "Raw Interview Data Editor" }), _jsx("p", { className: "text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tight", children: "Autosave to disk" })] }), _jsx(NotesEditor, { initialNotes: candidate.rawNotes || '', onSave: (notes) => handleSaveNotes(candidate.candidate_name, notes), onCancel: () => toggleSubMode(candidate.candidate_name, 'notes') })] })) }))] }, candidate.candidate_name)))) })] })), _jsxs("div", { className: "mt-12 bg-gray-900 text-white p-6 rounded-xl shadow-lg border border-gray-800", children: [_jsxs("h3", { className: "text-lg font-bold mb-4 flex items-center gap-2", children: [_jsx("span", { className: "text-blue-400", children: "\u26A1" }), " Integration Roadmap"] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6 text-sm", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-bold text-blue-300 uppercase text-[10px] tracking-widest", children: "Model Context Protocol (MCP)" }), _jsx("p", { className: "text-gray-400 text-xs leading-relaxed", children: "Connect Gemini directly to your Jira backlog and Google Sheets. The AI will automatically ingest rows and update these candidate files in real-time." })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("h4", { className: "font-bold text-blue-300 uppercase text-[10px] tracking-widest", children: "Sync Scripts" }), _jsx("p", { className: "text-gray-400 text-xs leading-relaxed", children: "Automated Node.js scripts to push evaluation reports to Jira tickets and pull latest technical scores from team spreadsheets." })] })] })] })] }));
};
export default InterviewsDashboard;
