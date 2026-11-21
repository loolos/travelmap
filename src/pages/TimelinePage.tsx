import { useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { eras, places, sourceById } from '../data/content';
import { eraForYear, formatSpan, formatYear } from '../data/eras';
import { EraMap } from '../timeline/EraMap';
import styles from './TimelinePage.module.css';

/** 埃及歷史時間線: one row per era; tap to see rulers, capital, territory and the places built then. */
export function TimelinePage() {
  const { eraId } = useParams();
  const navigate = useNavigate();
  const openRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    openRef.current?.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }, [eraId]);

  return (
    <div>
      <p className={styles.lead}>點一個時期，看當時的王朝、首都和疆域。</p>
      <ol className={styles.list}>
        {eras.map((e) => {
          const open = e.id === eraId;
          const built = places
            .filter((p) => p.builtYear !== undefined && eraForYear(eras, p.builtYear)?.id === e.id)
            .sort((a, b) => a.builtYear! - b.builtYear!);
          return (
            <li key={e.id} ref={open ? openRef : undefined} className={open ? styles.open : undefined}>
              <button
                type="button"
                className={styles.row}
                aria-expanded={open}
                onClick={() => navigate(open ? '/timeline' : `/timeline/${e.id}`, { replace: true })}
              >
                <span className={styles.span}>{formatSpan(e)}</span>
                <span className={styles.name}>{e.nameZh}</span>
                {built.length > 0 && (
                  <span className={styles.count} aria-label={`${built.length} 個景點`}>
                    📍{built.length}
                  </span>
                )}
              </button>
              {open && (
                <div className={styles.detail}>
                  <p className="en" lang="en">
                    {e.nameEn}
                  </p>
                  <p>{e.summary}</p>
                  <dl className={styles.facts}>
                    <dt>王朝／統治者</dt>
                    <dd>{e.rulers}</dd>
                    <dt>首都</dt>
                    <dd>{e.capital}</dd>
                    {e.ruledFrom && (
                      <>
                        <dt>由哪裡統治</dt>
                        <dd>{e.ruledFrom}</dd>
                      </>
                    )}
                    <dt>疆域</dt>
                    <dd>{e.extent}</dd>
                  </dl>
                  <EraMap era={e} />
                  {built.length > 0 && (
                    <>
                      <h2 className={styles.h2}>這時期建的景點</h2>
                      <ul className={styles.chips}>
                        {built.map((p) => (
                          <li key={p.id}>
                            <Link to={`/place/${p.id}`}>
                              {p.nameZh}
                              <small>{formatYear(p.builtYear!)}</small>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  <p className={styles.src}>
                    來源：
                    {e.sourceIds.map((s, i) => {
                      const src = sourceById.get(s)!;
                      return (
                        <span key={s}>
                          {i > 0 && '、'}
                          <a href={src.url} target="_blank" rel="noreferrer">
                            {src.title.replace(/^Wikipedia：/, '')}
                          </a>
                        </span>
                      );
                    })}
                    。年代採常見的通行年表，古代部分有數十年誤差。
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
