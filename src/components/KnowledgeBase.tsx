import { marked } from 'marked';
import { useMemo, useState } from 'react';

import { getCategories, loadThoughts, type Thought } from '../utils/knowledgeUtils';

// ─── Badge helpers ────────────────────────────────────────────────────────────

const RELEVANCE_STYLES: Record<string, string> = {
  high: 'bg-green-100 text-green-700 border border-green-200',
  medium: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
  low: 'bg-gray-100 text-gray-600 border border-gray-200',
};

const DIFFICULTY_STYLES: Record<string, string> = {
  beginner: 'bg-blue-100 text-blue-700 border border-blue-200',
  intermediate: 'bg-orange-100 text-orange-700 border border-orange-200',
  advanced: 'bg-red-100 text-red-700 border border-red-200',
};

const Badge = ({ label, styles }: { label: string; styles: string }) => (
  <span className={`px-2 py-0.5 rounded text-xs font-medium capitalize ${styles}`}>{label}</span>
);

// ─── Sidebar item ─────────────────────────────────────────────────────────────

const ThoughtCard = ({
  thought,
  selected,
  onClick,
}: {
  thought: Thought;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-3 rounded-lg border transition-all ${
      selected
        ? 'bg-gray-900 text-white border-gray-900'
        : 'bg-white text-gray-800 border-gray-200 hover:border-gray-400 hover:shadow-sm'
    }`}
  >
    <p className={`font-medium text-sm leading-snug mb-1 ${selected ? 'text-white' : 'text-gray-900'}`}>
      {thought.title}
    </p>
    <p className={`text-xs mb-2 truncate ${selected ? 'text-gray-300' : 'text-gray-500'}`}>
      {thought.summary}
    </p>
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className={`text-xs ${selected ? 'text-gray-400' : 'text-gray-400'}`}>
        {thought.category}
      </span>
      <span className={`text-xs ${selected ? 'text-gray-500' : 'text-gray-300'}`}>·</span>
      <Badge
        label={`interview: ${thought.interviewRelevance}`}
        styles={selected ? 'bg-white/20 text-white border-white/30' : RELEVANCE_STYLES[thought.interviewRelevance]}
      />
    </div>
  </button>
);

// ─── Content viewer ───────────────────────────────────────────────────────────

const ThoughtViewer = ({ thought }: { thought: Thought }) => {
  const html = useMemo(() => marked.parse(thought.content) as string, [thought.content]);

  return (
    <div className="h-full overflow-y-auto">
      {/* Metadata header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{thought.title}</h2>
        <p className="text-gray-600 text-sm mb-4">{thought.summary}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          <Badge label={thought.category} styles="bg-gray-100 text-gray-700 border border-gray-200" />
          <Badge label={thought.difficulty} styles={DIFFICULTY_STYLES[thought.difficulty]} />
          <Badge
            label={`Interview: ${thought.interviewRelevance}`}
            styles={RELEVANCE_STYLES[thought.interviewRelevance]}
          />
          {thought.date && (
            <span className="text-xs text-gray-400 self-center">{thought.date}</span>
          )}
        </div>

        {thought.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {thought.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs rounded border border-blue-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Rendered markdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div
          className="knowledge-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </div>
  );
};

// ─── Empty state ──────────────────────────────────────────────────────────────

const EmptyState = () => (
  <div className="h-full flex items-center justify-center">
    <div className="text-center text-gray-400">
      <div className="text-5xl mb-4">📖</div>
      <p className="text-lg font-medium text-gray-500">Select a topic</p>
      <p className="text-sm mt-1">
        Add notes to{' '}
        <code className="text-xs bg-gray-100 px-1.5 py-0.5 rounded">src/my-thoughts/*.md</code>
      </p>
    </div>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────

const KnowledgeBase = () => {
  const thoughts = useMemo(() => loadThoughts(), []);
  const categories = useMemo(() => getCategories(thoughts), [thoughts]);

  const [selectedSlug, setSelectedSlug] = useState<string | null>(
    thoughts.length > 0 ? thoughts[0].slug : null
  );
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return thoughts.filter((t) => {
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)) ||
        t.summary.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [thoughts, search, activeCategory]);

  const selected = thoughts.find((t) => t.slug === selectedSlug) ?? null;

  return (
    <div className="flex gap-4 h-[calc(100vh-160px)]">
      {/* Sidebar */}
      <div className="w-72 flex-shrink-0 flex flex-col gap-3">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3">
          <input
            type="text"
            placeholder="Search topics or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
        </div>

        {/* Category filter */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${
                activeCategory === cat
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto space-y-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">No topics found</p>
          ) : (
            filtered.map((thought) => (
              <ThoughtCard
                key={thought.slug}
                thought={thought}
                selected={selectedSlug === thought.slug}
                onClick={() => setSelectedSlug(thought.slug)}
              />
            ))
          )}
        </div>

        <div className="text-xs text-gray-400 text-center">
          {filtered.length} / {thoughts.length} topics
        </div>
      </div>

      {/* Content panel */}
      <div className="flex-1 min-w-0">
        {selected ? <ThoughtViewer thought={selected} /> : <EmptyState />}
      </div>
    </div>
  );
};

export default KnowledgeBase;
