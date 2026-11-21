import { useEffect, useState } from 'react';
import { ALL_GLYPHS, MAX_LETTERS, transliterate, type Sign } from '../games/cartouche';
import { markActivityDone } from '../progress/store';
import styles from './Lab.module.css';
import c from './Cartouche.module.css';

const FONT = 'Hiero';
const G = 56; // glyph cell size in px (SVG / canvas units)
const PAD = 22;

function layout(signs: Sign[], vertical: boolean) {
  const n = Math.max(signs.length, 1);
  const long = n * G + PAD * 2 + 14;
  const short = G + PAD * 2;
  return vertical ? { w: short, h: long } : { w: long, h: short };
}

export function CartoucheMaker({ activityId }: { activityId: string }) {
  const [name, setName] = useState('Cleopatra');
  const [vertical, setVertical] = useState(false);
  const [fontReady, setFontReady] = useState(false);
  const signs = transliterate(name);
  const { w, h } = layout(signs, vertical);

  useEffect(() => {
    let alive = true;
    document.fonts
      ?.load(`${G}px ${FONT}`, ALL_GLYPHS.join(''))
      .then(() => alive && setFontReady(true))
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const save = () => {
    const scale = 3;
    const canvas = document.createElement('canvas');
    canvas.width = (w + 20) * scale;
    canvas.height = (h + 20) * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.scale(scale, scale);
    ctx.fillStyle = '#f7efe0';
    ctx.fillRect(0, 0, w + 20, h + 20);
    ctx.translate(10, 10);
    drawCanvas(ctx, signs, vertical, w, h);
    const a = document.createElement('a');
    a.download = `cartouche-${signs.map((s) => s.latin).join('') || 'name'}.png`;
    a.href = canvas.toDataURL('image/png');
    a.click();
    markActivityDone(activityId);
  };

  return (
    <div className={styles.lab}>
      <p className={styles.question}>你的名字，用古埃及的象形符號怎麼寫？</p>
      <p className={styles.how}>輸入英文名字或拼音（最多 {MAX_LETTERS} 個字母）。</p>

      <label className={c.input}>
        <span>名字</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={40}
          autoCapitalize="off"
          autoComplete="off"
          spellCheck={false}
          aria-label="名字（英文或拼音）"
        />
      </label>

      <div className={c.stage}>
        <svg
          viewBox={`-4 -4 ${w + 8} ${h + 8}`}
          width={Math.min(w + 8, 600)}
          className={vertical ? c.vertical : c.horizontal}
          role="img"
          aria-label={`王名圈：${signs.map((s) => s.nameZh).join('、') || '空白'}`}
          style={{ opacity: fontReady ? 1 : 0.4 }}
        >
          <CartoucheShape w={w} h={h} vertical={vertical} />
          {signs.map((s, i) => {
            const x = vertical ? w / 2 : PAD + G * i + G / 2;
            const y = vertical ? PAD + G * i + G / 2 : h / 2;
            return (
              <text key={i} x={x} y={y} fontFamily={FONT} fontSize={G * 0.95} textAnchor="middle" dominantBaseline="central" fill="#2b2418">
                {s.glyph}
              </text>
            );
          })}
        </svg>
      </div>

      <div className={styles.toggle} role="group" aria-label="排列">
        <button type="button" aria-pressed={!vertical} onClick={() => setVertical(false)}>
          橫排
        </button>
        <button type="button" aria-pressed={vertical} onClick={() => setVertical(true)}>
          直排
        </button>
      </div>

      {signs.length > 0 && (
        <ol className={c.key} aria-label="符號對照">
          {signs.map((s, i) => (
            <li key={i}>
              <span className={c.glyph} aria-hidden="true">
                {s.glyph}
              </span>
              <strong>{s.latin.replace('x·s', 's').toUpperCase()}</strong>
              <span>{s.nameZh}</span>
            </li>
          ))}
        </ol>
      )}

      <div className={styles.actions}>
        <button type="button" className={styles.primary} onClick={save} disabled={!signs.length}>
          存成圖片
        </button>
      </div>

      <div className={styles.explain}>
        <p>
          <span className={styles.tag}>現代趣味音譯</span> 古埃及文字只寫子音，母音靠讀者自己補，而且同一個音有好幾種寫法。
          這裡用一套簡化的對照表，每個字母配一個「單子音符號」，不是古埃及人真正會寫的拼法。
        </p>
        <p>
          王名圈（cartouche）是圍住法老名字的橢圓繩圈。1822 年商博良（Champollion）比對羅塞塔石碑上托勒密和克麗奧佩脫拉的王名圈，
          才解開象形文字之謎。L 用獅子，也是從這些托勒密時代的名字來的。
        </p>
      </div>
    </div>
  );
}

function CartoucheShape({ w, h, vertical }: { w: number; h: number; vertical: boolean }) {
  const r = vertical ? w / 2 : h / 2;
  return (
    <>
      <rect x={0} y={0} width={w} height={h} rx={r} ry={r} fill="#f7efe0" stroke="#6b4f2a" strokeWidth={4} />
      {vertical ? (
        <line x1={6} x2={w - 6} y1={h + 0} y2={h + 0} stroke="#6b4f2a" strokeWidth={6} />
      ) : (
        <line x1={w} x2={w} y1={6} y2={h - 6} stroke="#6b4f2a" strokeWidth={6} />
      )}
    </>
  );
}

function drawCanvas(ctx: CanvasRenderingContext2D, signs: Sign[], vertical: boolean, w: number, h: number) {
  const r = vertical ? w / 2 : h / 2;
  ctx.strokeStyle = '#6b4f2a';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, r);
  ctx.stroke();
  ctx.lineWidth = 6;
  ctx.beginPath();
  if (vertical) {
    ctx.moveTo(6, h);
    ctx.lineTo(w - 6, h);
  } else {
    ctx.moveTo(w, 6);
    ctx.lineTo(w, h - 6);
  }
  ctx.stroke();
  ctx.fillStyle = '#2b2418';
  ctx.font = `${G * 0.95}px ${FONT}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  signs.forEach((s, i) => {
    const x = vertical ? w / 2 : PAD + G * i + G / 2;
    const y = vertical ? PAD + G * i + G / 2 : h / 2;
    ctx.fillText(s.glyph, x, y);
  });
}
