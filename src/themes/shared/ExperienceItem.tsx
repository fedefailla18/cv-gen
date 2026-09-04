import { WorkItem } from '../../types';
import {
  formatDateRange,
  formatTechnologyGroups,
  mergeWorkBullets,
  resolveWorkTechnologies,
} from '../../utils/cvRenderHelpers';

interface ExperienceItemProps {
  job: WorkItem;
  roleIndex: number;
  totalRoles: number;
  compact?: boolean;
}

export function ExperienceItem({ job, roleIndex, totalRoles, compact = false }: ExperienceItemProps) {
  const dateRange = formatDateRange(job.startDate, job.endDate);
  const subtitle = [job.position, dateRange].filter(Boolean).join(' · ');
  const bullets = mergeWorkBullets(job, roleIndex, totalRoles);
  const technologyGroups = resolveWorkTechnologies(job);
  const technologyLines = technologyGroups ? formatTechnologyGroups(technologyGroups) : [];
  const isRecent = roleIndex === 0;

  return (
    <article
      className={`page-break-avoid ${compact ? 'space-y-1' : 'space-y-1.5'} ${
        isRecent ? '' : 'opacity-[0.97]'
      }`}
    >
      <header>
        <p className={`font-semibold text-gray-900 ${compact ? 'text-sm' : 'text-[15px]'}`}>
          {job.name}
        </p>
        {subtitle && (
          <p className={`text-gray-600 ${compact ? 'text-xs' : 'text-sm'}`}>{subtitle}</p>
        )}
      </header>

      {job.summary && (
        <p
          className={`text-gray-700 leading-relaxed ${
            compact || !isRecent ? 'text-xs' : 'text-sm'
          }`}
        >
          {job.summary}
        </p>
      )}

      {bullets.length > 0 && (
        <ul
          className={`list-disc pl-4 space-y-0.5 text-gray-700 ${
            compact || !isRecent ? 'text-xs' : 'text-sm'
          }`}
        >
          {bullets.map((bullet, bulletIndex) => (
            <li key={bulletIndex} className="leading-relaxed">
              {bullet}
            </li>
          ))}
        </ul>
      )}

      {technologyLines.length > 0 && (
        <div className={`space-y-0.5 ${compact ? 'text-[11px]' : 'text-xs'} text-gray-600`}>
          {technologyLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      )}
    </article>
  );
}
