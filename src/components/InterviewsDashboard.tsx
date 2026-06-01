import React, { useRef, useState } from 'react';

import { CANDIDATES, generateCandidateMarkdown, generateJobMarkdown, JOBS } from '../utils/interviewData';
import { saveFile } from '../utils/persistence';

import CreateCandidateForm from './CreateCandidateForm';
import NotesEditor from './NotesEditor';

type ViewSubMode = 'none' | 'feedback' | 'notes';

const InterviewsDashboard: React.FC = () => {
  const [selectedJobId, setSelectedJobId] = useState<string>(JOBS[0].id);
  const [viewSubModes, setViewSubModes] = useState<Record<string, ViewSubMode>>({});
  const [localCandidates, setLocalCandidates] = useState(CANDIDATES);
  const [localJobs, setLocalJobs] = useState(JOBS);
  const [showAddForm, setShowAddForm] = useState(false);
  const feedbackRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredCandidates = localCandidates.filter((c) => c.job_id === selectedJobId);

  const toggleSubMode = (name: string, mode: ViewSubMode) => {
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

  const handleSaveNotes = async (name: string, newNotes: string) => {
    // Generate the path based on the candidate name
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const candidatePath = `interviews/candidates/${slug}/notes.md`;
    
    const result = await saveFile(candidatePath, newNotes);

    if (result.success) {
      setLocalCandidates((prev) => 
        prev.map((c) => (c.candidate_name === name ? { ...c, rawNotes: newNotes } : c))
      );
      toggleSubMode(name, 'notes'); // Close editor
    } else {
      console.error('Failed to save notes to disk:', result.error);
      alert(`Error saving to disk: ${result.error}`);
    }
  };

  const handleCreateCandidate = async (input: any) => {
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
      } else {
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
    } else {
      alert(`Failed to create candidate file: ${candidateResult.error}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-5xl mx-auto pb-20">
      {/* Header Area */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-800 tracking-tight text-blue-900">Interview Pipeline</h2>
          <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Technical Calibration Hub</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold shadow-md hover:bg-blue-700 transition-all flex items-center gap-2 active:scale-95"
        >
          <span className="text-xl leading-none">+</span> Add Candidate
        </button>
      </div>

      {showAddForm && (
        <CreateCandidateForm 
          jobs={localJobs} 
          onSubmit={handleCreateCandidate} 
          onCancel={() => setShowAddForm(false)} 
        />
      )}

      {/* Job Selector - More Compact */}
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        {localJobs.map((job) => (
          <button
            key={job.id}
            onClick={() => setSelectedJobId(job.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all border-2 ${
              selectedJobId === job.id
                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
            }`}
          >
            {job.title}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredCandidates.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow text-center text-gray-500 italic">
            No candidates interviewed for this role yet.
          </div>
        ) : (
          filteredCandidates.map((candidate) => (
            <div key={candidate.candidate_name} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden transition-all">
              {/* Compact Header Row */}
              <div className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-blue-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-inner">
                    {candidate.candidate_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 leading-tight">{candidate.candidate_name}</h3>
                    <div className="text-[9px] text-gray-400 uppercase font-black tracking-widest mt-0.5">
                      {candidate.interview_date} • {candidate.status}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Mini Score Summary */}
                  <div className="hidden md:flex gap-3">
                    {Object.entries(candidate.scores || {}).slice(0, 4).map(([skill, score]) => (
                      <div key={skill} className="text-center px-2 border-r border-gray-100 last:border-0">
                        <div className="text-[8px] text-gray-400 uppercase font-black tracking-tighter">{skill.split(' ')[0]}</div>
                        <div className="text-sm font-bold text-blue-600">{score}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleSubMode(candidate.candidate_name, 'notes')}
                      className={`p-2 rounded-lg transition-all ${
                        viewSubModes[candidate.candidate_name] === 'notes'
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-300 hover:bg-gray-100 hover:text-gray-600'
                      }`}
                      title="Edit Notes"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => toggleSubMode(candidate.candidate_name, 'feedback')}
                      className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        viewSubModes[candidate.candidate_name] === 'feedback'
                          ? 'bg-gray-900 text-white'
                          : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'
                      }`}
                    >
                      {viewSubModes[candidate.candidate_name] === 'feedback' ? 'Hide Feedback' : 'View Feedback'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Reveal Section (Expanded) */}
              {viewSubModes[candidate.candidate_name] !== 'none' && (
                <div 
                  ref={(el) => (feedbackRefs.current[candidate.candidate_name] = el)}
                  className="bg-gray-50 border-t border-gray-100 p-6 animate-in slide-in-from-top-2 duration-300"
                >
                  {viewSubModes[candidate.candidate_name] === 'feedback' ? (
                    <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-100 prose prose-blue prose-sm">
                      <div className="bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded inline-block mb-6 uppercase tracking-widest">
                        Technical Calibration Report
                      </div>
                      {candidate.feedback ? (
                        <div className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                          {candidate.feedback}
                        </div>
                      ) : (
                        <div className="text-center py-10 space-y-4">
                          <p className="text-gray-500 italic">No feedback generated yet. Use the CLI to process the notes first.</p>
                          <div className="text-xs bg-gray-50 p-4 rounded border border-dashed border-gray-300 font-mono text-gray-600">
                            gemini: "Generate feedback for interviews/candidates/{candidate.candidate_name.toLowerCase().replace(/\s+/g, '-')}/notes.md"
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="max-w-4xl mx-auto space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Raw Interview Data Editor</h4>
                        <p className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded uppercase tracking-tight">Autosave to disk</p>
                      </div>
                      <NotesEditor 
                        initialNotes={candidate.rawNotes || ''} 
                        onSave={(notes) => handleSaveNotes(candidate.candidate_name, notes)}
                        onCancel={() => toggleSubMode(candidate.candidate_name, 'notes')}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Integration Roadmap - Small Footer Section */}
      <div className="mt-12 bg-gray-900 text-white p-6 rounded-xl shadow-lg border border-gray-800">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-blue-400">⚡</span> Integration Roadmap
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <h4 className="font-bold text-blue-300 uppercase text-[10px] tracking-widest">Model Context Protocol (MCP)</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Connect Gemini directly to your Jira backlog and Google Sheets. 
              The AI will automatically ingest rows and update these candidate files in real-time.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-blue-300 uppercase text-[10px] tracking-widest">Sync Scripts</h4>
            <p className="text-gray-400 text-xs leading-relaxed">
              Automated Node.js scripts to push evaluation reports to Jira tickets 
              and pull latest technical scores from team spreadsheets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewsDashboard;
