import React, { useRef, useState } from 'react';

import { CANDIDATES, JOBS } from '../utils/interviewData';

import NotesEditor from './NotesEditor';

type ViewSubMode = 'none' | 'feedback' | 'notes';

const InterviewsDashboard: React.FC = () => {
  const [selectedJobId, setSelectedJobId] = useState<string>(JOBS[0].id);
  const [viewSubModes, setViewSubModes] = useState<Record<string, ViewSubMode>>({});
  const [localCandidates, setLocalCandidates] = useState(CANDIDATES);
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

  const handleSaveNotes = (name: string, newNotes: string) => {
    setLocalCandidates((prev) => 
      prev.map((c) => (c.candidate_name === name ? { ...c, rawNotes: newNotes } : c))
    );
    toggleSubMode(name, 'notes'); // Close editor
  };


  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Job Openings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {JOBS.map((job) => (
            <button
              key={job.id}
              onClick={() => setSelectedJobId(job.id)}
              className={`text-left p-4 rounded-lg border-2 transition-all ${
                selectedJobId === job.id
                  ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-100'
                  : 'border-gray-100 hover:border-gray-200 bg-gray-50'
              }`}
            >
              <div className="font-bold text-lg text-gray-900">{job.title}</div>
              <div className="text-sm text-gray-600 mt-1">{job.department} • {job.status}</div>
              <p className="text-xs text-gray-500 mt-2 line-clamp-2">{job.description}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-baseline justify-between">
          <h2 className="text-2xl font-bold text-gray-800">Candidates</h2>
          <span className="text-sm text-gray-500">{filteredCandidates.length} found for selected role</span>
        </div>

        {filteredCandidates.length === 0 ? (
          <div className="bg-white p-12 rounded-xl shadow text-center text-gray-500 italic">
            No candidates interviewed for this role yet.
          </div>
        ) : (
          <div className="space-y-6">
            {filteredCandidates.map((candidate) => (
              <div key={candidate.candidate_name} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900">{candidate.candidate_name}</h3>
                      <div className="text-sm text-gray-600 mt-1">
                        {candidate.interview_date} • Interviewed by {candidate.interviewer}
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {candidate.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    {Object.entries(candidate.scores || {}).map(([skill, score]) => (
                      <div key={skill} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <div className="text-[10px] text-gray-400 uppercase font-bold tracking-tight mb-1">{skill}</div>
                        <div className="text-lg font-bold text-blue-600">{score}</div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-center border-t border-gray-50 pt-6 gap-4">
                    <button
                      onClick={() => toggleSubMode(candidate.candidate_name, 'notes')}
                      className={`flex-1 max-w-[240px] px-6 py-3 rounded-full font-bold transition-all shadow-md active:scale-95 border-2 ${
                        viewSubModes[candidate.candidate_name] === 'notes'
                          ? 'bg-blue-50 border-blue-600 text-blue-700'
                          : 'bg-white border-gray-200 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {viewSubModes[candidate.candidate_name] === 'notes' ? 'Close Notes' : 'Edit Interview Notes'}
                    </button>
                    <button
                      onClick={() => toggleSubMode(candidate.candidate_name, 'feedback')}
                      className={`flex-1 max-w-[240px] px-6 py-3 rounded-full font-bold transition-all shadow-md active:scale-95 ${
                        viewSubModes[candidate.candidate_name] === 'feedback'
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                      }`}
                    >
                      {viewSubModes[candidate.candidate_name] === 'feedback' ? 'Hide Evaluation' : 'View Technical Feedback'}
                    </button>
                  </div>
                </div>

                {viewSubModes[candidate.candidate_name] !== 'none' && (
                  <div 
                    ref={(el) => (feedbackRefs.current[candidate.candidate_name] = el)}
                    className="bg-gray-50 p-8 border-t border-blue-100 animate-in slide-in-from-top-4 duration-500"
                  >
                    <div className="max-w-4xl mx-auto">
                      {viewSubModes[candidate.candidate_name] === 'feedback' ? (
                        <div className="prose prose-blue prose-sm mx-auto">
                          <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded inline-block mb-4 uppercase tracking-widest">
                            AI Generated Calibration
                          </div>
                          <div className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                            {candidate.feedback}
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest">Raw Interview Notes</h4>
                            <p className="text-xs text-gray-400 italic">Changes are saved to the local session</p>
                          </div>
                          <NotesEditor 
                            initialNotes={candidate.rawNotes || ''} 
                            onSave={(notes) => handleSaveNotes(candidate.candidate_name, notes)}
                            onCancel={() => toggleSubMode(candidate.candidate_name, 'notes')}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewsDashboard;
