import React, { useRef, useState } from 'react';

import { CANDIDATES, JOBS } from '../utils/interviewData';

const InterviewsDashboard: React.FC = () => {
  const [selectedJobId, setSelectedJobId] = useState<string>(JOBS[0].id);
  const [revealedFeedback, setRevealedFeedback] = useState<Record<string, boolean>>({});
  const feedbackRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const filteredCandidates = CANDIDATES.filter((c) => c.job_id === selectedJobId);

  const toggleFeedback = (name: string) => {
    setRevealedFeedback((prev) => {
      const isNowRevealed = !prev[name];
      
      if (isNowRevealed) {
        // Use timeout to allow React to render the hidden section before scrolling
        setTimeout(() => {
          feedbackRefs.current[name]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
      
      return { ...prev, [name]: isNowRevealed };
    });
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

                  <div className="flex justify-center border-t border-gray-50 pt-6">
                    <button
                      onClick={() => toggleFeedback(candidate.candidate_name)}
                      className={`px-8 py-3 rounded-full font-bold transition-all shadow-md active:scale-95 ${
                        revealedFeedback[candidate.candidate_name]
                          ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          : 'bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg'
                      }`}
                    >
                      {revealedFeedback[candidate.candidate_name] ? 'Hide Evaluation' : 'View Full Technical Feedback'}
                    </button>
                  </div>
                </div>

                {revealedFeedback[candidate.candidate_name] && (
                  <div 
                    ref={(el) => (feedbackRefs.current[candidate.candidate_name] = el)}
                    className="bg-gray-50 p-8 border-t border-blue-100 animate-in slide-in-from-top-4 duration-500"
                  >
                    <div className="max-w-3xl mx-auto prose prose-blue prose-sm">
                      <div className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded inline-block mb-4 uppercase tracking-widest">
                        AI Generated Calibration
                      </div>
                      <div className="whitespace-pre-wrap font-sans text-gray-800 leading-relaxed">
                        {candidate.feedback}
                      </div>
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
