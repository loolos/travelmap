import { Link } from 'react-router-dom';
import { parseInline } from '../data/inline';
import { activityById } from '../data/content';

export function InlineText({ text }: { text: string }) {
  return (
    <>
      {parseInline(text).map((s, i) => {
        if (s.type === 'text') return <span key={i}>{s.text}</span>;
        const to =
          s.kind === 'place'
            ? `/place/${s.id}`
            : s.kind === 'activity'
              ? `/place/${activityById.get(s.id)?.placeId}/${s.id}`
              : `/notes`;
        return (
          <Link key={i} to={to}>
            {s.text}
          </Link>
        );
      })}
    </>
  );
}
