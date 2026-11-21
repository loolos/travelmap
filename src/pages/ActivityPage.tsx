import { Navigate, useParams } from 'react-router-dom';
import { activityById, sourceById } from '../data/content';
import { Sheet } from '../app/Sheet';
import { activityComponents } from '../interactions/registry';

export function ActivityPage() {
  const { id, activity } = useParams();
  const a = activity ? activityById.get(activity) : undefined;
  if (!a || a.placeId !== id) return <Navigate to={id ? `/place/${id}` : '/map'} replace />;
  const Comp = activityComponents[a.id];
  return (
    <Sheet title={a.title} backTo={`/place/${a.placeId}`}>
      {Comp ? <Comp activityId={a.id} /> : <p>互動準備中。</p>}
      {a.sourceIds.length > 0 && (
        <details style={{ marginTop: 16, fontSize: 13, color: 'var(--muted)' }}>
          <summary>來源</summary>
          <ul>
            {a.sourceIds.map((s) => {
              const src = sourceById.get(s);
              return (
                src && (
                  <li key={s}>
                    <a href={src.url} target="_blank" rel="noreferrer">
                      {src.title}
                    </a>
                  </li>
                )
              );
            })}
          </ul>
        </details>
      )}
    </Sheet>
  );
}
