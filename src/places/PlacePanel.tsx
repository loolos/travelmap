import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Place } from '../data/schema';
import { activityById, noteById, regionById, sourceById } from '../data/content';
import { foundCount, isLit, markOpened, toggleFound, toggleVisited, useProgress } from '../progress/store';
import { Hero } from './Img';
import { InlineText } from './InlineText';
import { PriceLine } from './Price';
import styles from './PlacePanel.module.css';

type Tab = 'facts' | 'find' | 'notes';

interface Props {
  place: Place;
  wide: boolean;
  state: 'peek' | 'full';
  onExpand: () => void;
  onCollapse: () => void;
  onClose: () => void;
}

export function PlacePanel({ place, wide, state, onExpand, onCollapse, onClose }: Props) {
  const progress = useProgress();
  const [tab, setTab] = useState<Tab | null>(null);

  useEffect(() => markOpened(place.id), [place.id]);

  if (state === 'peek' && !wide) {
    return (
      <aside className={styles.peek} aria-label={place.nameZh}>
        <button type="button" className={styles.peekMain} onClick={onExpand} aria-label={`展開 ${place.nameZh}`}>
          <Hero assetId={place.heroAssetId} kind={place.kind} small />
          <span className={styles.peekText}>
            <strong>{place.nameZh}</strong>
            <span>{place.question}</span>
          </span>
          <span className={styles.chev} aria-hidden="true">
            ⌃
          </span>
        </button>
        <button type="button" className={styles.x} onClick={onClose} aria-label="關閉">
          ✕
        </button>
      </aside>
    );
  }

  const lit = isLit(place, progress);
  const n = foundCount(place, progress);
  const visited = !!progress.visited[place.id];
  const ready = place.status === 'ready';
  const acts = place.activityIds.map((id) => activityById.get(id)!).filter(Boolean);
  const pick = (t: Tab) => setTab((cur) => (cur === t ? null : t));

  return (
    <aside className={wide ? styles.side : styles.full} aria-label={place.nameZh}>
      <div className={styles.toolbar}>
        <button type="button" onClick={onClose} className={styles.back}>
          ← 地圖
        </button>
        <span className={styles.region}>{regionById.get(place.regionId)?.nameZh}</span>
        <button
          type="button"
          className={visited ? styles.visitedOn : styles.visited}
          aria-pressed={visited}
          onClick={() => toggleVisited(place.id)}
        >
          {visited ? '✓ 已到訪' : '到訪'}
        </button>
        {!wide && (
          <button type="button" className={styles.x} onClick={onCollapse} aria-label="收合">
            ⌄
          </button>
        )}
      </div>
      <div className={styles.scroll}>
        <Hero assetId={place.heroAssetId} kind={place.kind} />
        <div className={styles.titles}>
          <h1>
            {place.nameZh}
            {lit && (
              <span className={styles.litBadge} title="找找看全部完成，地圖已點亮">
                ✨
              </span>
            )}
          </h1>
          <p className="en" lang="en">
            {place.nameEn}
          </p>
        </div>
        <p className={styles.question}>{place.question}</p>

        {ready ? (
          <>
            <div className={styles.tabs} role="tablist">
              <TabBtn active={tab === 'facts'} onClick={() => pick('facts')} icon="🔍" label="重點" />
              <TabBtn active={tab === 'find'} onClick={() => pick('find')} icon="👀" label="找找看" badge={`${n}/${place.findItems.length}`} />
              <TabBtn active={tab === 'notes'} onClick={() => pick('notes')} icon="🧳" label="手記" />
              {acts.map((a) => (
                <Link key={a.id} to={`/place/${place.id}/${a.id}`} className={styles.tab}>
                  <span aria-hidden="true">{a.icon}</span> {a.label}
                </Link>
              ))}
            </div>

            {tab === 'facts' && (
              <section className={styles.detail} role="tabpanel" aria-label="重點">
                {place.era && <p className={styles.era}>{place.era}</p>}
                {place.intro && <p>{place.intro}</p>}
                <ol className={styles.facts}>
                  {place.facts.map((f, i) => (
                    <li key={i}>
                      <InlineText text={f} />
                    </li>
                  ))}
                </ol>
                {place.sourceIds.length > 0 && (
                  <details className={styles.sources}>
                    <summary>來源</summary>
                    <ul>
                      {place.sourceIds.map((s) => {
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
              </section>
            )}

            {tab === 'find' && (
              <section className={styles.detail} role="tabpanel" aria-label="找找看">
                <ul className={styles.find}>
                  {place.findItems.map((f) => {
                    const on = !!progress.found[f.id];
                    return (
                      <li key={f.id}>
                        <label className={on ? styles.foundOn : undefined}>
                          <input type="checkbox" checked={on} onChange={() => toggleFound(place, f.id)} />
                          <span>{f.text}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
                <p className={styles.hint}>{lit ? '✨ 全部找到了！地圖上這個點已經亮起。' : '三個都找到，地圖上的這個點會亮起。'}</p>
              </section>
            )}

            {tab === 'notes' && (
              <section className={styles.detail} role="tabpanel" aria-label="手記">
                {place.noteIds.map((id) => {
                  const note = noteById.get(id);
                  return (
                    note && (
                      <details key={id} className={styles.note}>
                        <summary>
                          <span aria-hidden="true">{note.icon}</span> {note.title}
                        </summary>
                        <p>{note.body}</p>
                        {note.price && <PriceLine price={note.price} />}
                      </details>
                    )
                  );
                })}
              </section>
            )}
          </>
        ) : (
          <p className={styles.draft}>內容準備中</p>
        )}
      </div>
    </aside>
  );
}

function TabBtn({
  active,
  onClick,
  icon,
  label,
  badge,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  badge?: string;
}) {
  return (
    <button type="button" role="tab" aria-selected={active} className={active ? styles.tabOn : styles.tab} onClick={onClick}>
      <span aria-hidden="true">{icon}</span> {label}
      {badge && <span className={styles.tabBadge}>{badge}</span>}
    </button>
  );
}
