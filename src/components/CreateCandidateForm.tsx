import React, { useState } from 'react';
import { CreateCandidateInput, InterviewJob } from '../types';
import { parseEvaluationCsv } from '../utils/csvUtils';

interface CreateCandidateFormProps {
  jobs: InterviewJob[];
  onSubmit: (input: CreateCandidateInput) => void;
  onCancel: () => void;
}

const CreateCandidateForm: React.FC<CreateCandidateFormProps> = ({ jobs, onSubmit, onCancel }) => {
  const [csvInput, setCsvInput] = useState('');
  const [showCsvImporter, setShowCsvImporter] = useState(false);
  const [formData, setFormData] = useState<CreateCandidateInput>({
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

  const handleJobChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === 'NEW_JOB') {
      setIsNewJob(true);
      setFormData({ ...formData, job_id: 'new-job-role' });
    } else {
      setIsNewJob(false);
      setFormData({ ...formData, job_id: value });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalInput = {
      ...formData,
      new_job: isNewJob ? newJobData : undefined
    };
    onSubmit(finalInput);
  };

  const handleImportCsv = () => {
    const { scores } = parseEvaluationCsv(csvInput);
    if (Object.keys(scores).length > 0) {
      setFormData({
        ...formData,
        scores: { ...formData.scores, ...scores }
      });
      setShowCsvImporter(false);
      setCsvInput('');
    } else {
      alert('No valid score data found in the CSV. Please ensure you copied the rows from the evaluation sheet correctly.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Add New Candidate</h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowCsvImporter(!showCsvImporter)}
            className="px-4 py-2 text-[10px] font-black uppercase text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-all mr-4 tracking-widest border border-blue-100 shadow-sm"
          >
            {showCsvImporter ? 'Close Importer' : '⚡ Import CSV from Sheet'}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-700">Cancel</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all active:scale-95">Create Candidate</button>
        </div>
      </div>

      {showCsvImporter && (
        <div className="bg-blue-600 p-6 rounded-xl space-y-4 animate-in zoom-in-95 duration-300 shadow-inner">
          <div className="flex justify-between items-center text-white">
            <h4 className="font-bold uppercase text-[10px] tracking-widest">Smart CSV Importer</h4>
            <span className="text-[9px] opacity-75 font-bold uppercase tracking-tight">Copy rows from your Google Sheet and paste them here</span>
          </div>
          <textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            className="w-full p-4 h-32 bg-white/10 border border-blue-400 rounded-lg text-white font-mono text-xs placeholder:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
            placeholder="Paste CSV rows here (e.g. 'Experience in development processes',3,100%)..."
          />
          <button
            type="button"
            onClick={handleImportCsv}
            className="w-full py-3 bg-white text-blue-700 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-blue-50 transition-all shadow-lg active:scale-95"
          >
            Parse & Populate Scores
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Candidate Name</label>
            <input
              type="text"
              required
              value={formData.candidate_name}
              onChange={(e) => setFormData({ ...formData, candidate_name: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Interview Date</label>
            <input
              type="date"
              required
              value={formData.interview_date}
              onChange={(e) => setFormData({ ...formData, interview_date: e.target.value })}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Job Role</label>
            <select
              value={isNewJob ? 'NEW_JOB' : formData.job_id}
              onChange={handleJobChange}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            >
              {jobs.map(job => <option key={job.id} value={job.id}>{job.title}</option>)}
              <option value="NEW_JOB" className="text-blue-600 font-bold">+ Add New Role...</option>
            </select>
          </div>

          {isNewJob && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 space-y-4 animate-in zoom-in-95 duration-300">
              <h4 className="text-sm font-bold text-blue-800">New Job Details</h4>
              <input
                type="text"
                required
                placeholder="Job Title"
                value={newJobData.title}
                onChange={(e) => setNewJobData({ ...newJobData, title: e.target.value })}
                className="w-full p-2 bg-white border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
              <input
                type="text"
                required
                placeholder="Department"
                value={newJobData.department}
                onChange={(e) => setNewJobData({ ...newJobData, department: e.target.value })}
                className="w-full p-2 bg-white border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
              />
              <textarea
                required
                placeholder="Role Description"
                value={newJobData.description}
                onChange={(e) => setNewJobData({ ...newJobData, description: e.target.value })}
                className="w-full p-2 bg-white border border-blue-200 rounded focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm min-h-[80px]"
              />
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Technical Scores (0-4)</label>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(formData.scores).map(([skill, score]) => (
                <div key={skill} className="flex items-center gap-2 bg-gray-50 p-2 rounded border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-600 flex-1 truncate">{skill}</span>
                  <input
                    type="number"
                    min="0"
                    max="4"
                    step="0.1"
                    value={score}
                    onChange={(e) => setFormData({
                      ...formData,
                      scores: { ...formData.scores, [skill]: parseFloat(e.target.value) }
                    })}
                    className="w-12 p-1 text-center bg-white border border-gray-200 rounded text-xs font-bold text-blue-600"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-50">
        <div className="md:col-span-1">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Candidate Profile</label>
          <textarea
            value={formData.profile_summary}
            onChange={(e) => setFormData({ ...formData, profile_summary: e.target.value })}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm min-h-[120px]"
            placeholder="Brief profile summary..."
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">HR Context</label>
          <textarea
            value={formData.hr_context}
            onChange={(e) => setFormData({ ...formData, hr_context: e.target.value })}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm min-h-[120px]"
            placeholder="HR interview highlights..."
          />
        </div>
        <div className="md:col-span-1">
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Technical Interview Note</label>
          <textarea
            value={formData.technical_summary}
            onChange={(e) => setFormData({ ...formData, technical_summary: e.target.value })}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm min-h-[120px]"
            placeholder="Brief technical interview notes..."
          />
        </div>
      </div>
    </form>
  );
};

export default CreateCandidateForm;
