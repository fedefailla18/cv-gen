import { Resume } from '../types';

interface CompactThemeProps {
  resume: Resume;
  section: string;
}

export default function CompactTheme({ resume, section }: CompactThemeProps) {
  const data = (resume as any)[section];
  if (!data) return null;

  const renderSection = () => {
    switch (section) {
      case 'basics':
        return (
          <div className="mb-6 pb-3 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.name}</h1>
            {data.label && <p className="text-base text-gray-600 mb-2">{data.label}</p>}
            <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2">
              {data.email && <span>{data.email}</span>}
              {data.phone && <span>• {data.phone}</span>}
              {data.url && (
                <a
                  href={data.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:underline"
                >
                  • {data.url}
                </a>
              )}
              {data.location && (
                <span>
                  •{' '}
                  {[data.location.city, data.location.region, data.location.countryCode]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              )}
            </div>
            {data.summary && (
              <p className="text-xs text-gray-700 leading-relaxed">{data.summary}</p>
            )}
          </div>
        );

      case 'work':
        if (!Array.isArray(data)) return null;
        return (
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-200">
              Work Experience
            </h2>
            <div className="space-y-3">
              {data.map((job: any, idx: number) => (
                <div key={idx} className="pl-2 border-l border-gray-200">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-1">
                    <div>
                      <h3 className="text-base font-semibold text-gray-900">
                        {job.position || job.name}
                      </h3>
                      <p className="text-sm text-gray-700">{job.name}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-0.5 sm:mt-0">
                      {job.startDate} - {job.endDate}
                    </span>
                  </div>
                  {job.summary && (
                    <p className="text-xs text-gray-700 mb-1.5 leading-relaxed mt-1">
                      {job.summary}
                    </p>
                  )}
                  {job.highlights && Array.isArray(job.highlights) && job.highlights.length > 0 && (
                    <ul className="list-disc list-inside space-y-0.5 text-xs text-gray-600 mt-1.5">
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
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-200">
              Education
            </h2>
            <div className="space-y-2">
              {data.map((edu: any, idx: number) => (
                <div key={idx} className="pl-2 border-l border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {edu.area || edu.studyType}
                  </h3>
                  <p className="text-xs text-gray-700">{edu.institution}</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500 mt-0.5">
                    {edu.startDate && edu.endDate && (
                      <span>
                        {edu.startDate} - {edu.endDate}
                      </span>
                    )}
                    {edu.location && <span>• {edu.location}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'skills':
        if (!Array.isArray(data)) return null;
        return (
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-200">
              Skills
            </h2>
            <div className="space-y-2">
              {data.map((skill: any, idx: number) => (
                <div key={idx} className="pl-2 border-l border-gray-200">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-gray-900 text-xs">{skill.name}</span>
                    {skill.level && <span className="text-xs text-gray-500">({skill.level})</span>}
                  </div>
                  {skill.keywords && Array.isArray(skill.keywords) && skill.keywords.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {skill.keywords.map((keyword: string, kIdx: number) => (
                        <span
                          key={kIdx}
                          className="px-1.5 py-0.5 bg-gray-100 text-gray-700 rounded text-xs"
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
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-200">
              Languages
            </h2>
            <div className="space-y-1">
              {data.map((lang: any, idx: number) => (
                <div
                  key={idx}
                  className="flex items-center justify-between pl-2 border-l border-gray-200"
                >
                  <span className="text-xs font-medium text-gray-900">{lang.language}</span>
                  {lang.fluency && <span className="text-xs text-gray-500">{lang.fluency}</span>}
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
