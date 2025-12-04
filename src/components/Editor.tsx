import React, { useEffect, useRef, useState } from 'react';

import { useResumeContext } from '../context/ResumeContext';
import { Resume } from '../types';

const Editor = () => {
  const { resume, setResume } = useResumeContext();

  // Initialize JSON text from resume
  const initializeJsonText = () => JSON.stringify(resume, null, 2);

  // Keep edits local until the user saves
  const [jsonText, setJsonText] = useState<string>(initializeJsonText);
  const [pendingResume, setPendingResume] = useState<Resume | null>(null);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);
  const lastSavedResumeRef = useRef<string>(JSON.stringify(resume));

  // Simple toast state
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (toastTimer.current) clearTimeout(toastTimer.current);
    // eslint-disable-next-line no-restricted-globals
    toastTimer.current = setTimeout(() => setToast(null), 2500);
  };

  useEffect(
    () => () => {
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  // Sync with resume when it changes externally (not from our own save)
  // This is a valid use case for syncing external state changes
  useEffect(() => {
    const currentResumeString = JSON.stringify(resume);
    // Only update if resume changed externally and we don't have unsaved changes
    if (lastSavedResumeRef.current !== currentResumeString && !hasChanges) {
      lastSavedResumeRef.current = currentResumeString;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setJsonText(JSON.stringify(resume, null, 2));
      setPendingResume(null);
      setHasError(false);
      setErrorMessage('');
    }
    // hasChanges is intentionally excluded from deps to prevent unnecessary updates
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resume]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setJsonText(newText);
    setHasChanges(true);

    // Try to parse JSON
    try {
      const parsed = JSON.parse(newText) as Resume;
      setPendingResume(parsed);
      setHasError(false);
      setErrorMessage('');
    } catch (error) {
      setHasError(true);
      setPendingResume(null);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Invalid JSON syntax');
      }
    }
  };

  const handleSave = () => {
    if (hasError) {
      showToast('error', 'Cannot save: JSON has errors.');
      return;
    }
    if (!pendingResume || !hasChanges) {
      showToast('error', 'No changes to save.');
      return;
    }
    setResume(pendingResume);
    lastSavedResumeRef.current = JSON.stringify(pendingResume);
    setHasChanges(false);
    showToast('success', 'CV saved successfully.');
  };

  const handleCancel = () => {
    // Revert to the last saved resume
    const formattedJson = JSON.stringify(resume, null, 2);
    setJsonText(formattedJson);
    setPendingResume(null);
    setHasError(false);
    setErrorMessage('');
    setHasChanges(false);
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(jsonText);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonText(formatted);
      setPendingResume(parsed as Resume);
      setHasError(false);
      setErrorMessage('');
      setHasChanges(true);
    } catch {
      showToast('error', 'Cannot format: JSON has errors.');
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Edit your CV JSON</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Format JSON"
            title="Format JSON"
            onClick={handleFormat}
            className="rounded-md px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-sm transition-colors"
          >
            Format
          </button>
          <button
            type="button"
            aria-label="Save changes"
            title={hasError ? 'Fix JSON errors before saving' : 'Save changes'}
            onClick={handleSave}
            disabled={hasError || !hasChanges || !pendingResume}
            className={`rounded-md px-2 py-1 text-white text-sm transition-colors ${
              hasError || !hasChanges || !pendingResume
                ? 'bg-green-300 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            ✓
          </button>
          <button
            type="button"
            aria-label="Cancel changes"
            title="Discard edits"
            onClick={handleCancel}
            className="rounded-md px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-sm"
          >
            X
          </button>
        </div>
      </div>
      <textarea
        value={jsonText}
        onChange={handleTextChange}
        className={`w-full p-3 border rounded-md font-mono text-sm resize-y min-h-[400px] ${
          hasError ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'
        }`}
        spellCheck={false}
        placeholder="Enter your CV JSON here..."
      />
      {hasError && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm font-semibold text-red-600">JSON Error:</p>
          <p className="text-sm text-red-600">{errorMessage}</p>
        </div>
      )}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-md shadow-lg text-white z-50 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
          role="status"
          aria-live="polite"
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default Editor;
