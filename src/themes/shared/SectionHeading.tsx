interface SectionHeadingProps {
  title: string;
  className?: string;
}

export function SectionHeading({ title, className = '' }: SectionHeadingProps) {
  return (
    <h2
      className={`text-[11px] font-semibold uppercase tracking-[0.14em] text-gray-500 border-b border-gray-300 pb-1 mb-4 ${className}`}
    >
      {title}
    </h2>
  );
}
