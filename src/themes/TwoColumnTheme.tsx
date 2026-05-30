import { Resume } from '../types';

interface TwoColumnThemeProps {
  resume: Resume;
  section: string;
}

export default function TwoColumnTheme({ resume, section }: TwoColumnThemeProps) {
  const data = (resume as any)[section];
  if (!data) return null;

  const renderSection = () => {
    switch (section) {
      case 'basics':
        return (
          <div className="mb-8 pb-6 border-b-2 border-indigo-500">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.name}</h1>
            {data.label && <p className="text-xl text-gray-600 mb-4">{data.label}</p>}
            <div className="flex flex-wrap gap-4 text-sm text-gray-700 mb-4">
              {data.email && <span>📧 {data.email}</span>}
              {data.phone && <span>📞 {data.phone}</span>}
              {data.url && (
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:underline"
                >
                  🔗 {data.url}
                </a>
              )}
              {data.location && (
                <span>
                  📍{' '}
                  {[data.location.city, data.location.region, data.location.countryCode]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              )}
            </div>
            {data.summary && <p className="text-gray-700 leading-relaxed">{data.summary}</p>}
          </div>
        );

      case 'work':
        if (!Array.isArray(data)) return null;
        return (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-500">
              Work Experience
            </h2>
            <div className="space-y-6">
              {data.map((job: any, idx: number) => (
                <div key={idx} className="border-l-4 border-indigo-500 pl-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {job.position || job.name}
                      </h3>
                      <p className="text-lg text-gray-700 font-medium">{job.name}</p>
                    </div>
                    <span className="text-sm text-gray-600 mt-1 sm:mt-0">
                      {job.startDate} - {job.endDate}
                    </span>
                  </div>
                  {job.summary && (
                    <p className="text-gray-700 mb-3 leading-relaxed">{job.summary}</p>
                  )}
                  {job.highlights && Array.isArray(job.highlights) && job.highlights.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-gray-700">
                      {job.highlights.map((highlight: string, hIdx: number) => (
                        <li key={hIdx}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'education':
        if (!Array.isArray(data)) return null;
        return (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-500">
              Education
            </h2>
            <div className="space-y-4">
              {data.map((edu: any, idx: number) => (
                <div key={idx} className="border-l-4 border-indigo-500 pl-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {edu.area || edu.studyType}
                  </h3>
                  <p className="text-gray-700 font-medium">{edu.institution}</p>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mt-1">
                    {edu.startDate && edu.endDate && (
                      <span>
                        {edu.startDate} - {edu.endDate}
                      </span>
                    )}
                    {edu.location && <span>📍 {edu.location}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (!Array.isArray(data)) return null;
        return (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-500">
              Skills
            </h2>
            <div className="space-y-4">
              {data.map((skill: any, idx: number) => (
                <div key={idx} className="border-l-4 border-indigo-500 pl-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900">{skill.name}</span>
                    {skill.level && <span className="text-sm text-gray-600">({skill.level})</span>}
                  </div>
                  {skill.keywords && Array.isArray(skill.keywords) && skill.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {skill.keywords.map((keyword: string, kIdx: number) => (
                        <span
                          key={kIdx}
                          className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 'languages':
        if (!Array.isArray(data)) return null;
        return (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-500">
              Languages
            </h2>
            <div className="space-y-2">
              {data.map((lang: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-l-4 border-indigo-500 pl-4"
                >
                  <span className="font-medium text-gray-900">{lang.language}</span>
                  {lang.fluency && <span className="text-sm text-gray-600">{lang.fluency}</span>}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div>{renderSection()}</div>;
}
