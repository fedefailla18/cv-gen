import React, { useEffect, useState } from 'react';

interface NotesEditorProps {
  initialNotes: string;
  onSave: (newNotes: string) => void;
  onCancel: () => void;
}

const NotesEditor: React.FC<NotesEditorProps> = ({ initialNotes, onSave, onCancel }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setNotes(initialNotes);
    setHasChanges(false);
  }, [initialNotes]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setHasChanges(true);
  };

  const handleSave = () => {
    onSave(notes);
    setHasChanges(false);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-inner overflow-hidden flex flex-col h-[500px]">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Markdown Editor</span>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="text-xs px-3 py-1 bg-white border border-gray-300 text-gray-600 rounded hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className={`text-xs px-3 py-1 text-white rounded transition-colors ${
              hasChanges ? 'bg-green-600 hover:bg-green-700' : 'bg-green-300 cursor-not-allowed'
            }`}
          >
            Save Notes
          </button>
        </div>
      </div>
      <textarea
        value={notes}
        onChange={handleChange}
        spellCheck={false}
        className="flex-1 p-4 font-mono text-sm text-gray-800 focus:outline-none resize-none bg-gray-50/30"
        placeholder="Enter interview notes here..."
      />
    </div>
  );
};

export default NotesEditor;
