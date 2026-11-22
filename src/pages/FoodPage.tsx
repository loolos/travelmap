import { useEffect, useRef } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { assetById, assetUrl, foods, placeById, sourceById } from '../data/content';
import { foodCategories } from '../data/schema';
import pages from './Pages.module.css';
import tiles from './CollectionPage.module.css';
import styles from './FoodPage.module.css';

const budgetLabel = ['', '💰 小吃價', '💰💰 餐廳價', '💰💰💰 較貴'];

/** 美食圖鑑: one tab per category, photo tiles; tapping a dish opens its card under the grid. */
export function FoodPage() {
  const { foodId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const sel = foods.find((f) => f.id === foodId);
  const cat = foodCategories.find((c) => c.id === (sel?.category ?? params.get('c'))) ?? foodCategories[0];
  const list = foods.filter((f) => f.category === cat.id);
  const detailRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (sel) detailRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [sel]);

  const toggle = (id: string) => navigate(id === foodId ? `/food?c=${cat.id}` : `/food/${id}`, { replace: true });
  const photo = sel?.assetId ? assetById.get(sel.assetId) : undefined;

  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label="分類">
        {foodCategories.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={c.id === cat.id}
            className={`${styles.tab} ${c.id === cat.id ? styles.tabOn : ''}`}
            onClick={() => navigate(`/food?c=${c.id}`, { replace: true })}
          >
            <span aria-hidden="true">{c.icon}</span> {c.title}
          </button>
        ))}
      </div>
      <ul className={tiles.grid} role="tabpanel" aria-label={cat.title}>
        {list.map((f) => (
          <li key={f.id}>
            <button
              type="button"
              className={`${tiles.tile} ${f.id === sel?.id ? tiles.on : ''}`}
              aria-pressed={f.id === sel?.id}
              onClick={() => toggle(f.id)}
            >
              {f.assetId ? (
                <img className={tiles.thumb} src={assetUrl(f.assetId)} alt="" loading="lazy" />
              ) : (
                <span className={tiles.icon} aria-hidden="true">
                  {f.icon}
                </span>
              )}
              <span className={tiles.name}>
                {f.nameZh}
                {f.placeIds.length > 0 && (
                  <span className={styles.pin} title="地方特色">
                    {' '}
                    📍
                  </span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {sel && (
        <section ref={detailRef} className={tiles.detail} aria-live="polite">
          {sel.assetId && <img className={tiles.pic} src={assetUrl(sel.assetId)} alt={photo?.alt ?? sel.nameZh} />}
          <h3 className={tiles.title}>
            {sel.icon} {sel.nameZh} <span className="en">{sel.nameEn}</span>
          </h3>
          <p className={styles.ar} lang="ar" dir="rtl" title="點餐時可以給店家看">
            {sel.nameAr}
          </p>
          <p className={styles.look}>{sel.look}</p>
          <p className={styles.badges}>
            <span>{budgetLabel[sel.budget]}</span>
            {sel.veg && <span>🌱 素食可</span>}
          </p>
          <p>{sel.story}</p>
          {sel.tip && <p className={styles.tip}>💡 {sel.tip}</p>}
          {sel.placeIds.length > 0 && (
            <p>
              📍 哪裡吃：
              {sel.placeIds.map((id, i) => (
                <span key={id}>
                  {i > 0 && '、'}
                  <Link to={`/place/${id}`}>{placeById.get(id)?.nameZh}</Link>
                </span>
              ))}
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
              {sel.sourceIds.map((s) => {
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
    </div>
  );
}
