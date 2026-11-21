import { Link } from 'react-router-dom';
import { parseInline } from '../data/inline';
import { activityById, noteById } from '../data/content';
import { isKnowledge } from '../data/schema';

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
              : noteLink(s.id);
        return (
          <Link key={i} to={to}>
            {s.text}
          </Link>
        );
      })}
    </>
  );
}

function noteLink(id: string): string {
  const r = noteById.get(id)?.regionId ?? '';
  return isKnowledge(r) ? `/knowledge/${r}` : `/notes/${r}`;
}
