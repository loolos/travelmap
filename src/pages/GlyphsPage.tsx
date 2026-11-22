import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { glyphs } from '../data/content';
import { toggleGlyph, useProgress } from '../progress/store';
import pages from './Pages.module.css';
import styles from './GlyphsPage.module.css';

/** 象形文字小字典: common signs to recognise on temple walls. */
export function GlyphsPage() {
  const progress = useProgress();
  const [params] = useSearchParams();
  const [open, setOpen] = useState<string | null>(params.get('id'));
  const sel = glyphs.find((g) => g.id === open);
  const seen = glyphs.filter((g) => progress.glyphs[g.id]).length;
  return (
    <div>
      <p className={styles.count}>
        點符號看意思。在牆上看到了就打勾：<strong>{seen}</strong> / {glyphs.length}
      </p>
      <ul className={styles.grid}>
        {glyphs.map((g) => (
          <li key={g.id}>
            <button
              type="button"
              className={`${styles.cell} ${open === g.id ? styles.on : ''}`}
              aria-pressed={open === g.id}
              onClick={() => setOpen((c) => (c === g.id ? null : g.id))}
            >
              <span className={styles.glyph} aria-hidden="true">
                {g.glyph}
              </span>
              <span>
                {progress.glyphs[g.id] ? '✓ ' : ''}
                {g.nameZh}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {sel && (
        <section className={styles.detail} aria-live="polite">
          <div className={styles.big} aria-hidden="true">
            {sel.glyph}
          </div>
          <h2 className={pages.h2}>
            {sel.nameZh} <span className="en">{sel.nameEn}</span>
          </h2>
          <p>{sel.meaning}</p>
          <p>
            <strong>去哪裡看：</strong>
            {sel.where}
          </p>
          {sel.id === 'cartouche' && (
            <p>
              <Link to="/place/luxor/cartouche">用王名圈產生器寫自己的名字</Link>
            </p>
          )}
          <label className={styles.seen}>
            <input type="checkbox" checked={!!progress.glyphs[sel.id]} onChange={() => toggleGlyph(sel.id)} />
            我在牆上看到了
          </label>
        </section>
      )}
    </div>
  );
}
