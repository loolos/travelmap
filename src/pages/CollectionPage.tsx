import { useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { activityById, artifacts, assetById, assetUrl, eras, placeById, sourceById } from '../data/content';
import { eraForYear } from '../data/eras';
import pages from './Pages.module.css';
import styles from './CollectionPage.module.css';

const halls = [...new Set(artifacts.map((a) => a.hall))];

/** 館藏圖鑑: museum objects as photo tiles grouped by hall; tapping one opens its story under that hall. */
export function CollectionPage() {
  const { artifactId } = useParams();
  const navigate = useNavigate();
  const sel = artifacts.find((a) => a.id === artifactId);
  const detailRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sel) detailRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [sel]);

  const toggle = (id: string) => navigate(id === artifactId ? '/collection' : `/collection/${id}`, { replace: true });
  const museums = [...new Set(artifacts.map((a) => a.placeId))].map((id) => placeById.get(id)!);

  return (
    <div>
      <p className={styles.lead}>
        {museums.map((m) => (
          <Link key={m.id} to={`/place/${m.id}`}>
            {m.nameZh}
          </Link>
        ))}
        的重點藏品，點一下看故事。
      </p>
      {halls.map((hall) => {
        const list = artifacts.filter((a) => a.hall === hall);
        const open = list.find((a) => a.id === sel?.id);
        const era = open?.year !== undefined ? eraForYear(eras, open.year) : undefined;
        const photo = open?.assetId ? assetById.get(open.assetId) : undefined;
        const act = open?.activityId ? activityById.get(open.activityId) : undefined;
        return (
          <section key={hall}>
            <h2 className={pages.h2}>{hall}</h2>
            <ul className={styles.grid}>
              {list.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    className={`${styles.tile} ${a.id === sel?.id ? styles.on : ''}`}
                    aria-pressed={a.id === sel?.id}
                    onClick={() => toggle(a.id)}
                  >
                    {a.assetId ? (
                      <img className={styles.thumb} src={assetUrl(a.assetId)} alt="" loading="lazy" />
                    ) : (
                      <span className={styles.icon} aria-hidden="true">
                        {a.icon}
                      </span>
                    )}
                    <span className={styles.name}>{a.nameZh}</span>
                  </button>
                </li>
              ))}
            </ul>
            {open && (
              <section ref={detailRef} className={styles.detail} aria-live="polite">
                {open.assetId && <img className={styles.pic} src={assetUrl(open.assetId)} alt={photo?.alt ?? open.nameZh} />}
                <h3 className={styles.title}>
                  {open.icon} {open.nameZh} <span className="en">{open.nameEn}</span>
                </h3>
                <p className={styles.era}>
                  {era ? <Link to={`/timeline/${era.id}`}>📜 {open.era}</Link> : open.era}
                </p>
                <p>
                  <strong>看什麼：</strong>
                  {open.look}
                </p>
                <p>{open.story}</p>
                {act && (
                  <p>
                    <Link to={`/place/${act.placeId}/${act.id}`}>
                      {act.icon} {act.title} →
                    </Link>
                  </p>
                )}
                <details className={pages.small}>
                  <summary>來源</summary>
                  <ul>
                    {photo && (
                      <li>
                        圖片：{photo.credit} · {photo.license}
                        {photo.sourceUrl && (
                          <>
                            {' '}
                            <a href={photo.sourceUrl} target="_blank" rel="noreferrer">
                              出處
                            </a>
                          </>
                        )}
                      </li>
                    )}
                    {open.sourceIds.map((s) => {
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
              </section>
            )}
          </section>
        );
      })}
    </div>
  );
}
