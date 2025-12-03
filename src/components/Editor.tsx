import { useEffect, useRef, useState } from 'react';
import JSONInput from 'react-json-editor-ajrm';
// @ts-ignore - locale file doesn't have types
import locale from 'react-json-editor-ajrm/locale/en';

import { useResumeContext } from '../context/ResumeContext';
import { Resume } from '../types';

const Editor = () => {
  const { resume, setResume } = useResumeContext();

  // Keep edits local until the user saves
  const [pendingResume, setPendingResume] = useState<Resume | null>(null);
  const [hasError, setHasError] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  // Changing this key will remount the JSON editor, resetting it to the latest resume
  const [editorKey, setEditorKey] = useState(0);

  // Simple toast state
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const toastTimer = useRef<number | null>(null);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2500);
  };

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current);
    },
    [],
  );

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
    setHasChanges(false);
    showToast('success', 'CV saved successfully.');
  };

  const handleCancel = () => {
    setPendingResume(null);
    setHasError(false);
    setHasChanges(false);
    // Remount editor so it reloads current resume from context
    setEditorKey((k) => k + 1);
  };

  const handleJsonEditorChange = (e: any) => {
    // react-json-editor-ajrm provides e.error when JSON is invalid
    if (e?.error) {
      setHasError(true);
      setHasChanges(true); // user started editing
    } else {
      setHasError(false);
      setHasChanges(true);
      setPendingResume(e?.jsObject as Resume);
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Edit your CV JSON</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Save changes"
            title={hasError ? 'Fix JSON errors before saving' : 'Save changes'}
            onClick={handleSave}
            disabled={false}
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
      <JSONInput
        key={editorKey}
        id="resume-editor"
        locale={locale}
        height="400px"
        placeholder={resume}
        onChange={handleJsonEditorChange}
      />
      {hasError && (
        <p className="mt-2 text-sm text-red-600">
          There is a JSON error. Please fix it before saving.
        </p>
      )}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-md shadow-lg text-white ${
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
};;

export default Editor;
