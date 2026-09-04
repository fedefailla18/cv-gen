interface SkillGroupRowProps {
  name: string;
  keywords?: string[];
  compact?: boolean;
}

export function SkillGroupRow({ name, keywords, compact = false }: SkillGroupRowProps) {
  if (!keywords?.length) return null;

  return (
    <p className={`leading-relaxed ${compact ? 'text-xs' : 'text-sm'}`}>
      <span className="font-medium text-gray-800">{name}: </span>
      <span className="text-gray-700">{keywords.join(' · ')}</span>
    </p>
  );
}
