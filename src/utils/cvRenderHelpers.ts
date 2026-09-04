import { Basics, WorkItem } from '../types';

const TECH_DUMP_PATTERN = /^(tech\s*stack|technologies?)\s*:/i;

export function formatDateRange(startDate?: string, endDate?: string): string | undefined {
  if (!startDate && !endDate) return undefined;
  if (startDate && endDate) return `${startDate} – ${endDate}`;
  return startDate ?? endDate;
}

export function formatLocation(basics: Basics): string | undefined {
  const parts = [
    basics.location?.city,
    basics.location?.region,
    basics.location?.countryCode,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(', ') : undefined;
}

export function formatContactItems(basics: Basics): string[] {
  const items: string[] = [];

  if (basics.email) items.push(basics.email);
  if (basics.phone) items.push(basics.phone);
  if (basics.url) items.push(basics.url);
  if (basics.profiles?.length) {
    for (const profile of basics.profiles) {
      if (profile.url) items.push(profile.url);
    }
  }

  const location = formatLocation(basics);
  if (location) items.push(location);

  return items;
}

/** Recent roles get more bullets; older roles compress progressively. */
export function getBulletLimit(roleIndex: number, totalRoles: number): number {
  if (roleIndex === 0) return 6;
  if (roleIndex === 1) return 4;
  if (roleIndex >= totalRoles - 1 && totalRoles > 3) return 2;
  return 3;
}

export function isTechnologyDumpLine(line: string): boolean {
  return TECH_DUMP_PATTERN.test(line.trim());
}

export function parseTechnologyDump(line: string): Record<string, string[]> | null {
  if (!isTechnologyDumpLine(line)) return null;

  const raw = line.replace(TECH_DUMP_PATTERN, '').trim();
  const items = raw
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);

  if (items.length === 0) return null;

  return { Technologies: items };
}

export function mergeWorkBullets(job: WorkItem, roleIndex: number, totalRoles: number): string[] {
  const limit = getBulletLimit(roleIndex, totalRoles);
  const bullets: string[] = [];

  if (job.achievements?.length) {
    bullets.push(...job.achievements);
  }

  if (job.responsibilities?.length) {
    bullets.push(...job.responsibilities);
  }

  if (bullets.length === 0 && job.highlights?.length) {
    bullets.push(...job.highlights.filter((line) => !isTechnologyDumpLine(line)));
  }

  return bullets.slice(0, limit);
}

export function resolveWorkTechnologies(job: WorkItem): Record<string, string[]> | null {
  if (Array.isArray(job.technologies)) {
    return job.technologies.length > 0 ? { Technologies: job.technologies } : null;
  }

  if (job.technologies && Object.keys(job.technologies).length > 0) {
    return job.technologies;
  }

  const techLine = job.highlights?.find((line) => isTechnologyDumpLine(line));
  if (!techLine) return null;

  return parseTechnologyDump(techLine);
}

export function formatTechnologyGroups(groups: Record<string, string[]>): string[] {
  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([category, items]) => `${category}: ${items.join(' · ')}`);
}

export function joinInline(items: string[], separator = ' · '): string {
  return items.filter(Boolean).join(separator);
}
