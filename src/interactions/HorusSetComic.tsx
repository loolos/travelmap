import { useState } from 'react';
import { Link } from 'react-router-dom';
import { assetUrl, deityById } from '../data/content';
import { markActivityDone } from '../progress/store';
import styles from './Lab.module.css';
import c from './Comic.module.css';

interface Panel {
  cast: string[];
  caption: string;
  say?: string;
  glyph?: string;
}

/** 荷魯斯與賽特：常見版本的神話，八格。 */
const PANELS: Panel[] = [
  { cast: ['osiris', 'isis'], caption: '很久以前，歐西里斯是埃及的好國王，和妻子伊西斯一起教人民種田、過好日子。' },
  { cast: ['seth'], caption: '他的弟弟賽特很嫉妒，想自己當國王。', say: '誰躺得進這個漂亮箱子，箱子就送給誰！' },
  { cast: ['seth', 'osiris'], caption: '歐西里斯一躺進去，賽特就蓋上蓋子，把箱子丟進尼羅河。' },
  { cast: ['isis'], caption: '伊西斯走遍各地，終於把丈夫找回來，用魔法讓他短暫醒來，後來生下兒子荷魯斯。' },
  { cast: ['osiris', 'isis'], caption: '歐西里斯從此到冥界當王，審判死去的人。伊西斯把小荷魯斯藏在三角洲的沼澤裡長大。' },
  { cast: ['horus', 'seth'], caption: '荷魯斯長大後向賽特挑戰，要拿回父親的王位。打了好多回合，賽特弄傷了他的一隻眼睛。', say: '王位是我父親的！' },
  { cast: ['horus'], caption: '智慧之神托特治好了這隻眼睛。它成了代表完整與平安的「荷魯斯之眼」，人們把它做成護身符。', glyph: '𓂀' },
  { cast: ['horus'], caption: '眾神最後判荷魯斯贏。他成為埃及的王，之後每一位法老都被看作「人間的荷魯斯」。' },
];

export function HorusSetComic({ activityId }: { activityId: string }) {
  const [i, setI] = useState(0);
  const [finished, setFinished] = useState(false);
  const panel = PANELS[i];
  const last = i === PANELS.length - 1;

  return (
    <div className={styles.lab}>
      <p className={styles.question}>為什麼艾德夫神殿到處都是老鷹？</p>
      <figure className={c.panel} aria-live="polite">
        <div className={c.cast}>
          {panel.cast.map((id) => {
            const d = deityById.get(id)!;
            return (
              <div key={id} className={c.who}>
                <img src={assetUrl(d.assetId)} alt={`${d.nameZh}的圖像`} />
                <span>{d.nameZh}</span>
              </div>
            );
          })}
          {panel.glyph && (
            <div className={c.glyph} aria-label="荷魯斯之眼">
              {panel.glyph}
            </div>
          )}
        </div>
        {panel.say && <p className={c.say}>「{panel.say}」</p>}
        <figcaption>{panel.caption}</figcaption>
      </figure>

      <div className={c.nav}>
        <button type="button" disabled={i === 0} onClick={() => setI(i - 1)}>
          ← 上一格
        </button>
        <span className={c.dots} aria-label={`第 ${i + 1} 格，共 ${PANELS.length} 格`}>
          {PANELS.map((_, k) => (
            <span key={k} className={k === i ? c.dotOn : c.dot} />
          ))}
        </span>
        {!last ? (
          <button type="button" className={c.next} onClick={() => setI(i + 1)}>
            下一格 →
          </button>
        ) : (
          <button
            type="button"
            className={c.next}
            disabled={finished}
            onClick={() => {
              setFinished(true);
              markActivityDone(activityId);
            }}
          >
            到神殿找找看
          </button>
        )}
      </div>

      {finished && (
        <div className={styles.explain}>
          <p>
            艾德夫神殿就是獻給荷魯斯的。門口有黑色花崗岩的鷹像，外圍走廊的牆上刻著一整齣「荷魯斯的勝利」：
            荷魯斯一次次用長矛刺向變成小河馬的賽特。這齣戲以前每年都會在神殿裡演出。
          </p>
          <p>
            回到<Link to="/place/edfu">艾德夫</Link>的「找找看」，去牆上找那隻河馬。眼睛的符號可以在<Link to="/glyphs">象形文字小字典</Link>裡打勾。
          </p>
          <p>
            <span className={styles.tag}>神話</span> 這個故事流傳了幾千年，版本很多，細節常常不一樣。這裡是比較溫和的常見說法。
          </p>
        </div>
      )}
    </div>
  );
}
