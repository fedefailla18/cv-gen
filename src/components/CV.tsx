import React from 'react';
import { Resume } from '../types';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-lg font-semibold mb-2">{children}</h3>
);

const CV: React.FC<{ data: Resume }> = ({ data }) => {
  const { basics, work = [], education = [], skills = [], languages = [] } = data;

  return (
    <div className="max-w-3xl mx-auto bg-white p-8 shadow-md print:p-0">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{basics.name}</h1>
        {basics.label && <p className="text-sm text-gray-600">{basics.label}</p>}
        <div className="mt-2 text-sm text-gray-700">
          {basics.email} • {basics.phone} • {basics.location?.city}, {basics.location?.region}
        </div>
        {basics.profiles?.length ? (
          <div className="mt-2 text-sm">
            {basics.profiles.map((p) => (
              <a
                key={p.network}
                href={p.url}
                className="mr-3 underline"
                target="_blank"
                rel="noreferrer"
              >
                {p.network}
              </a>
            ))}
          </div>
        ) : null}
      </header>

      {basics.summary && (
        <section className="mb-6">
          <SectionTitle>Professional Summary</SectionTitle>
          <p className="text-sm text-gray-800">{basics.summary}</p>
        </section>
      )}

      <section className="mb-6">
        <SectionTitle>Work Experience</SectionTitle>
        <div className="space-y-4">
          {work.map((w, i) => (
            <div key={i}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold">
                    {w.position} — {w.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {w.startDate} — {w.endDate}
                  </div>
                </div>
              </div>
              {w.summary && <p className="mt-2 text-sm">{w.summary}</p>}
              {w.highlights?.length && (
                <ul className="list-disc ml-6 mt-2 text-sm text-gray-800">
                  {w.highlights.map((h, idx) => (
                    <li key={idx}>{h}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <SectionTitle>Education</SectionTitle>
        <div className="space-y-3">
          {education.map((e, i) => (
            <div key={i}>
              <div className="font-semibold">
                {e.institution} — {e.area}
              </div>
              <div className="text-sm text-gray-600">
                {e.startDate} — {e.endDate} • {e.location}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-6">
        <SectionTitle>Skills</SectionTitle>
        <div className="flex flex-wrap gap-2">
          {skills.map((s, i) => (
            <div key={i} className="border rounded px-3 py-1 text-sm">
              {s.name}: {s.keywords?.join(', ')}
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionTitle>Languages</SectionTitle>
        <div className="text-sm">
          {languages.map((l, i) => (
            <div key={i}>
              {l.language} — {l.fluency}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default CV;
