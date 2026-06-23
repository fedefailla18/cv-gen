import React, { useState } from 'react';

interface FeedbackEditorProps {
  initialFeedback: string;
  onSave: (feedback: string) => void;
  onCancel: () => void;
}

const FeedbackEditor: React.FC<FeedbackEditorProps> = ({ initialFeedback, onSave, onCancel }) => {
  const [feedback, setFeedback] = useState(initialFeedback);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Manual Feedback Editor</h4>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="text-[10px] px-3 py-1 bg-white border border-gray-200 text-gray-500 rounded font-bold hover:bg-gray-50 uppercase tracking-wider transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(feedback)}
            className="text-[10px] px-3 py-1 bg-blue-600 text-white rounded font-bold hover:bg-blue-700 uppercase tracking-wider transition-colors"
          >
            Save Feedback
          </button>
        </div>
      </div>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        className="w-full h-64 p-4 font-sans text-sm text-gray-800 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none bg-white"
        placeholder="Paste or type candidate feedback here..."
        autoFocus
      />
    </div>
  );
};

export default FeedbackEditor;
