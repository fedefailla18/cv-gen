import { Resume } from '../types';
import { ContactLine } from './shared/ContactLine';
import { ExperienceItem } from './shared/ExperienceItem';
import { SectionHeading } from './shared/SectionHeading';
import { SkillGroupRow } from './shared/SkillGroupRow';
import { joinInline } from '../utils/cvRenderHelpers';

interface EngineeringThemeProps {
  resume: Resume;
  section: string;
}

export default function EngineeringTheme({ resume, section }: EngineeringThemeProps) {
  const data = resume[section as keyof Resume];

  if (!data) return null;

  switch (section) {
    case 'basics': {
      const basics = resume.basics;

      return (
        <header className="mb-6 pb-4 border-b border-gray-300 page-break-avoid">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">{basics.name}</h1>
          {basics.label && (
            <p className="mt-1 text-sm font-medium text-gray-700">{basics.label}</p>
          )}
          <ContactLine basics={basics} className="mt-2" />
          {basics.summary && (
            <p className="mt-3 text-sm leading-relaxed text-gray-800">{basics.summary}</p>
          )}
        </header>
      );
    }

    case 'work': {
      if (!Array.isArray(data)) return null;

      return (
        <section className="mb-6 page-break-avoid">
          <SectionHeading title="Experience" />
          <div className="space-y-5">
            {data.map((job, index) => (
              <ExperienceItem
                key={`${job.name}-${job.startDate}-${index}`}
                job={job}
                roleIndex={index}
                totalRoles={data.length}
                compact={index >= 2}
              />
            ))}
          </div>
        </section>
      );
    }

    case 'education': {
      if (!Array.isArray(data)) return null;

      return (
        <section className="mb-6 page-break-avoid">
          <SectionHeading title="Education" />
          <div className="space-y-3">
            {data.map((edu, index) => {
              const title = [edu.studyType, edu.area].filter(Boolean).join(' — ');
              const meta = joinInline(
                [edu.institution, edu.location, joinInline([edu.startDate, edu.endDate], ' – ')].filter(
                  Boolean,
                ) as string[],
              );

              return (
                <div key={`${edu.institution}-${index}`} className="text-sm">
                  {title && <p className="font-medium text-gray-900">{title}</p>}
                  {meta && <p className="text-gray-700">{meta}</p>}
                </div>
              );
            })}
          </div>
        </section>
      );
    }

    case 'skills': {
      if (!Array.isArray(data)) return null;

      return (
        <section className="mb-6 page-break-avoid">
          <SectionHeading title="Technical Skills" />
          <div className="space-y-1.5">
            {data.map((skill, index) => (
              <SkillGroupRow key={`${skill.name}-${index}`} name={skill.name} keywords={skill.keywords} />
            ))}
          </div>
        </section>
      );
    }

    case 'languages': {
      if (!Array.isArray(data)) return null;

      const inline = data
        .map((lang) => (lang.fluency ? `${lang.language} (${lang.fluency})` : lang.language))
        .filter(Boolean);

      return (
        <section className="mb-4 page-break-avoid">
          <SectionHeading title="Languages" />
          <p className="text-sm text-gray-700">{joinInline(inline)}</p>
        </section>
      );
    }

    default:
      return null;
  }
}
