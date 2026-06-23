export type InterviewRelevance = 'low' | 'medium' | 'high';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Thought {
  slug: string;
  title: string;
  category: string;
  tags: string[];
  interviewRelevance: InterviewRelevance;
  difficulty: Difficulty;
  date: string;
  summary: string;
  content: string;
}

// Vite auto-discovers all .md files in my-thoughts/ at build time.
// Adding a new topic is just creating a new .md file — no code changes needed.
const raw = import.meta.glob('../my-thoughts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
}) as Record<string, string>;

function parseFrontmatter(source: string): { meta: Record<string, unknown>; content: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { meta: {}, content: source };

  const meta: Record<string, unknown> = {};
  for (const line of match[1].split('\n')) {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');

    if (key === 'tags') {
      meta[key] = value
        .replace(/^\[|\]$/g, '')
        .split(',')
        .map((t) => t.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      meta[key] = value;
    }
  }

  return { meta, content: match[2].trim() };
}

export function loadThoughts(): Thought[] {
  return Object.entries(raw)
    .map(([path, source]) => {
      const slug = path.replace('../my-thoughts/', '').replace('.md', '');
      const { meta, content } = parseFrontmatter(source);

      return {
        slug,
        title: (meta['title'] as string) ?? slug,
        category: (meta['category'] as string) ?? 'General',
        tags: (meta['tags'] as string[]) ?? [],
        interviewRelevance: ((meta['interviewRelevance'] as InterviewRelevance) ?? 'medium'),
        difficulty: ((meta['difficulty'] as Difficulty) ?? 'intermediate'),
        date: (meta['date'] as string) ?? '',
        summary: (meta['summary'] as string) ?? '',
        content,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getCategories(thoughts: Thought[]): string[] {
  return ['All', ...new Set(thoughts.map((t) => t.category))].sort((a, b) =>
    a === 'All' ? -1 : b === 'All' ? 1 : a.localeCompare(b)
  );
}
