import { useState } from 'react';

import { useResumeContext } from '../context/ResumeContext';

export const SectionsManager = () => {
  const { sections, addSection, removeSection } = useResumeContext();
  const [newSectionId, setNewSectionId] = useState('');

  const handleAdd = () => {
    const trimmed = newSectionId.trim();
    if (!trimmed) return;
    addSection(trimmed);
    setNewSectionId('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow space-y-3">
      <h3 className="font-semibold text-gray-800">Sections</h3>

      <ul className="space-y-1 text-sm">
        {sections.map((section) => (
          <li key={section} className="flex items-center justify-between">
            <span>{section}</span>
            <button
              type="button"
              onClick={() => removeSection(section)}
              className="text-xs text-red-600 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="flex gap-2 pt-2">
        <input
          type="text"
          value={newSectionId}
          onChange={(e) => setNewSectionId(e.target.value)}
          placeholder="custom-section-id"
          className="flex-1 border rounded px-2 py-1 text-sm"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="text-sm bg-blue-600 text-white px-2 py-1 rounded"
        >
          Add
        </button>
      </div>

      <p className="text-xs text-gray-500">
        Section IDs like <code>basics</code>, <code>work</code>, etc. Custom IDs can be anything;
        just make sure your theme knows how to render them.
      </p>
    </div>
  );
};
