import JSONInput from 'react-json-editor-ajrm';
// @ts-ignore - locale file doesn't have types
import locale from 'react-json-editor-ajrm/locale/en';

import { useResumeContext } from '../context/ResumeContext';
import { Resume } from '../types';

const Editor = () => {
  const { resume, setResume } = useResumeContext();

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-2">Edit your CV JSON</h2>
      <JSONInput
        id="resume-editor"
        locale={locale}
        height="400px"
        placeholder={resume}
        onChange={(e: any) => {
          if (!e.error) setResume(e.jsObject as Resume);
        }}
      />
    </div>
  );
};

export default Editor;
