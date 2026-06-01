import React, { useEffect, useState } from 'react';
import { parseEvaluationCsv } from '../utils/csvUtils';

interface NotesEditorProps {
  initialNotes: string;
  onSave: (newNotes: string) => void;
  onCancel: () => void;
}

const NotesEditor: React.FC<NotesEditorProps> = ({ initialNotes, onSave, onCancel }) => {
  const [notes, setNotes] = useState(initialNotes);
  const [hasChanges, setHasChanges] = useState(false);
  const [csvInput, setCsvInput] = useState('');
  const [showImporter, setShowImporter] = useState(false);

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

  const handleImportCsv = () => {
    const { scores, notes: csvNotes } = parseEvaluationCsv(csvInput);
    if (Object.keys(scores).length > 0 || csvNotes.length > 0) {
      const scoresMarkdown = Object.entries(scores)
        .map(([skill, score]) => `- **${skill}:** ${score}`)
        .join('\n');
      
      const commentsMarkdown = csvNotes.length > 0 
        ? '\n\n### Technical Comments\n' + csvNotes.join('\n')
        : '';
      
      const importedContent = scoresMarkdown + commentsMarkdown;
      
      // Append to the technical assessment section if it exists, or just to the end
      if (notes.includes('## Scoring (0-4)')) {
        setNotes(prev => prev.replace('## Scoring (0-4)', `## Scoring (0-4)\n${importedContent}`));
      } else {
        setNotes(prev => `${prev}\n\n# Technical Assessment\n\n## Scoring (0-4)\n${importedContent}`);
      }
      
      setHasChanges(true);
      setShowImporter(false);
      setCsvInput('');
    } else {
      alert('No valid score data found.');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-inner overflow-hidden flex flex-col h-[600px] relative">
      <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Markdown Editor</span>
          <button 
            onClick={() => setShowImporter(!showImporter)}
            className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 px-2 py-0.5 rounded hover:bg-blue-100"
          >
            {showImporter ? 'Close Importer' : '⚡ Import CSV'}
          </button>
        </div>
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

      {showImporter && (
        <div className="absolute inset-0 bg-blue-600/95 p-6 flex flex-col animate-in fade-in duration-300 z-10">
          <div className="flex justify-between items-center text-white mb-4">
            <h4 className="font-bold uppercase text-xs tracking-widest text-white">Paste CSV from Sheet</h4>
            <button onClick={() => setShowImporter(false)} className="text-white text-xs font-bold hover:bg-white/10 px-2 py-1 rounded">Close [X]</button>
          </div>
          <p className="text-[10px] text-blue-100 mb-4 uppercase font-bold tracking-tight">Copy the rows from your Google Sheet evaluation form and paste them below.</p>
          <textarea
            value={csvInput}
            onChange={(e) => setCsvInput(e.target.value)}
            className="flex-1 p-4 bg-white/10 border border-blue-400 rounded-lg text-white font-mono text-xs placeholder:text-blue-200 focus:outline-none mb-4"
            placeholder="Paste your Google Sheet rows here..."
          />
          <button
            onClick={handleImportCsv}
            className="w-full py-3 bg-white text-blue-700 rounded-lg font-black uppercase text-xs tracking-widest hover:bg-blue-50 transition-all shadow-lg active:scale-95"
          >
            Inject Scores into Markdown
          </button>
        </div>
      )}
    </div>
  );
};

export default NotesEditor;
