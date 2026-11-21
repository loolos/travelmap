import { Navigate, useParams } from 'react-router-dom';
import { activityById } from '../data/content';
import { Sheet } from '../app/Sheet';

/** Flagship interactions are registered here (M1+). */
export function ActivityPage() {
  const { id, activity } = useParams();
  const a = activity ? activityById.get(activity) : undefined;
  if (!a || a.placeId !== id) return <Navigate to={id ? `/place/${id}` : '/map'} replace />;
  return (
    <Sheet title={a.title}>
      <p>{a.question}</p>
      <p>互動準備中。</p>
    </Sheet>
  );
}
