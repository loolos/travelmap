import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { allPhrases, numberWords, phraseGroups, pound, toArabicDigits, type Line } from './arabicData';
import styles from './ArabicPage.module.css';

const NUM = 'num';
const tabs = [...phraseGroups.map((g) => ({ id: g.id, icon: g.icon, title: g.title })), { id: NUM, icon: '🔢', title: '數字' }];

/** An Arabic voice, if the device has one (many phones do offline); undefined hides the 🔊 button. */
function useArabicVoice() {
  const [voice, setVoice] = useState<SpeechSynthesisVoice>();
  useEffect(() => {
    const synth = typeof window !== 'undefined' ? window.speechSynthesis : undefined;
    if (!synth) return;
    const pick = () => {
      const vs = synth.getVoices().filter((v) => v.lang.toLowerCase().startsWith('ar'));
      setVoice(vs.find((v) => /eg/i.test(v.lang)) ?? vs[0]);
    };
    pick();
    synth.addEventListener('voiceschanged', pick);
    return () => synth.removeEventListener('voiceschanged', pick);
  }, []);
  if (!voice) return undefined;
  return (text: string) => {
    const u = new SpeechSynthesisUtterance(text.replace('...', ''));
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = 0.8;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  };
}

/** Full-screen card to hold up to a shopkeeper or driver. */
function ShowCard({ ar, zh, onClose }: { ar: string; zh: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  // Portal: the sheet is its own stacking context, and the card must cover the top menu too.
  return createPortal(
    <div className={styles.show} role="dialog" aria-modal="true" aria-label={zh} onClick={onClose}>
      <p className={styles.showAr} lang="ar" dir="rtl">
        {ar}
      </p>
      <p className={styles.showZh}>{zh}</p>
      <p className={styles.showHint}>點一下關閉</p>
    </div>,
    document.body,
  );
}

function LineView({ line, big, speak }: { line: Line; big?: boolean; speak?: (s: string) => void }) {
  return (
    <div className={styles.line}>
      {line.label && <span className={styles.label}>{line.label}</span>}
      <p className={big ? styles.arBig : styles.ar} lang="ar" dir="rtl">
        {line.ar}
      </p>
      <p className={styles.say}>
        🗣️ {line.say}
        {speak && (
          <button type="button" className={styles.speak} onClick={() => speak(line.ar)} aria-label="播放發音">
            🔊
          </button>
        )}
      </p>
      <p className={styles.latin}>
        {line.latin}
        {line.zh && ` · ${line.zh}`}
      </p>
    </div>
  );
}

function NumberTab({ selected, speak }: { selected?: number; speak?: (s: string) => void }) {
  const navigate = useNavigate();
  const [price, setPrice] = useState('');
  const [show, setShow] = useState(false);
  const sel = numberWords.find((w) => w.n === selected);
  const digits = price.replace(/[^0-9]/g, '').slice(0, 7);
  return (
    <>
      <label className={styles.conv}>
        <span>輸入價格</span>
        <input
          inputMode="numeric"
          value={digits}
          placeholder="250"
          onChange={(e) => setPrice(e.target.value)}
          aria-label="輸入數字，轉成阿拉伯數字"
        />
      </label>
      {digits && (
        <button type="button" className={styles.convOut} onClick={() => setShow(true)} aria-label="全螢幕給對方看">
          <span lang="ar" dir="rtl">
            {toArabicDigits(digits)} <span className={styles.convUnit}>{pound.ar}</span>
          </span>
        </button>
      )}
      {show && digits && (
        <ShowCard ar={`${toArabicDigits(digits)} ${pound.ar}`} zh={`${digits} 埃及鎊`} onClose={() => setShow(false)} />
      )}
      <ul className={styles.nums}>
        {numberWords.map((w) => (
          <li key={w.n}>
            <button
              type="button"
              className={`${styles.num} ${w.n === selected ? styles.on : ''}`}
              aria-pressed={w.n === selected}
              onClick={() => navigate(w.n === selected ? `/arabic?c=${NUM}` : `/arabic/n${w.n}`, { replace: true })}
            >
              <span className={styles.numAr} lang="ar">
                {toArabicDigits(String(w.n))}
              </span>
              <span className={styles.numEn}>{w.n}</span>
            </button>
          </li>
        ))}
      </ul>
      {sel ? (
        <section className={styles.detail} aria-live="polite">
          <h3 className={styles.title}>
            {sel.n} · {toArabicDigits(String(sel.n))}
          </h3>
          <LineView line={sel} speak={speak} />
        </section>
      ) : (
        <details className={styles.more}>
          <summary>看懂價格牌</summary>
          <p>阿拉伯文由右往左寫，但數字一樣由左往右讀。最容易認錯的是 ٥（5，像 0）和 ٠（0，只是一個點）、٦（6）和 ٧（7）。</p>
          <p>
            「鎊」是 <span lang="ar">{pound.ar}</span>（{pound.say}，{pound.latin}），常縮寫成 LE 或 EGP。
          </p>
        </details>
      )}
    </>
  );
}

/** 生存阿拉伯語: tabs of short Egyptian Arabic phrases; tap one for big script, reading, and a show-to-them card. */
export function ArabicPage() {
  const { phraseId } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const speak = useArabicVoice();
  const [show, setShow] = useState(false);
  const detailRef = useRef<HTMLElement>(null);

  const numSel = phraseId?.match(/^n(\d+)$/);
  const sel = allPhrases.find((p) => p.id === phraseId);
  const tabId = numSel ? NUM : (sel?.group ?? params.get('c') ?? tabs[0].id);
  const group = phraseGroups.find((g) => g.id === tabId);

  useEffect(() => {
    setShow(false);
    if (sel) detailRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [sel]);

  const toggle = (id: string) => navigate(id === phraseId ? `/arabic?c=${tabId}` : `/arabic/${id}`, { replace: true });

  return (
    <div>
      <div className={styles.tabs} role="tablist" aria-label="分類">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={t.id === tabId}
            className={`${styles.tab} ${t.id === tabId ? styles.tabOn : ''}`}
            onClick={() => navigate(`/arabic?c=${t.id}`, { replace: true })}
          >
            <span aria-hidden="true">{t.icon}</span> {t.title}
          </button>
        ))}
      </div>
      {tabId === NUM ? (
        <NumberTab selected={numSel ? Number(numSel[1]) : undefined} speak={speak} />
      ) : (
        group && (
          <>
            <ul className={styles.grid} role="tabpanel" aria-label={group.title}>
              {group.phrases.map((p) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={`${styles.tile} ${p.id === sel?.id ? styles.on : ''}`}
                    aria-pressed={p.id === sel?.id}
                    onClick={() => toggle(p.id)}
                  >
                    <span aria-hidden="true">{p.icon}</span> {p.zh}
                  </button>
                </li>
              ))}
            </ul>
            {sel && (
              <section ref={detailRef} className={styles.detail} aria-live="polite">
                <h3 className={styles.title}>
                  {sel.icon} {sel.zh}
                </h3>
                <LineView line={sel} big speak={speak} />
                {sel.alt?.map((l) => <LineView key={l.ar} line={l} speak={speak} />)}
                {sel.tip && <p className={styles.tip}>💡 {sel.tip}</p>}
                <button type="button" className={styles.showBtn} onClick={() => setShow(true)}>
                  📱 給對方看
                </button>
                {show && <ShowCard ar={sel.ar} zh={sel.zh} onClose={() => setShow(false)} />}
              </section>
            )}
          </>
        )
      )}
      <p className={styles.foot}>埃及口語（Egyptian Arabic），中文讀音只是近似。</p>
    </div>
  );
}
