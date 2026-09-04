import { Basics } from '../../types';
import { formatContactItems } from '../../utils/cvRenderHelpers';

interface ContactLineProps {
  basics: Basics;
  className?: string;
}

export function ContactLine({ basics, className = '' }: ContactLineProps) {
  const items = formatContactItems(basics);

  if (items.length === 0) return null;

  return (
    <p className={`text-xs text-gray-600 leading-relaxed ${className}`}>
      {items.map((item, index) => (
        <span key={`${item}-${index}`}>
          {index > 0 && <span className="text-gray-400"> · </span>}
          {item.startsWith('http') ? (
            <a href={item} className="text-gray-700 underline-offset-2 hover:underline">
              {item.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
          ) : (
            item
          )}
        </span>
      ))}
    </p>
  );
}
