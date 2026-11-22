import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { dayRoleById, dayRoles, type DayRole } from './dayData';
import { resolveDayLink } from './dayLinks';
import { DayScene } from './DayScene';
import pages from './Pages.module.css';
import tiles from './CollectionPage.module.css';
import styles from './DayPage.module.css';

function RoleGrid({ except }: { except?: string }) {
  return (
    <ul className={tiles.grid}>
      {dayRoles
        .filter((r) => r.id !== except)
        .map((r) => (
          <li key={r.id}>
            <Link to={`/day/${r.id}`} replace={!!except} className={`${tiles.tile} ${styles.roleTile}`}>
              <span className={tiles.icon} aria-hidden="true">
                {r.icon}
              </span>
              <span className={tiles.name}>
                <strong>{r.name}</strong>
                <br />
                <span className={styles.tag}>{r.tag}</span>
              </span>
            </Link>
          </li>
        ))}
    </ul>
  );
}

/** 古埃及人的一天: pick a role, then step through their day. */
export function DayPage() {
  const { roleId } = useParams();
  const role = roleId ? dayRoleById.get(roleId) : undefined;
  if (!role)
    return (
      <div>
        <p className={styles.lead}>選一個身分，過一天三千年前的生活</p>
        <RoleGrid />
      </div>
    );
  return <RoleDay key={role.id} role={role} />;
}

function RoleDay({ role }: { role: DayRole }) {
  const navigate = useNavigate();
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(false);
  const [fact, setFact] = useState<number | null>(null);
  const m = role.moments[i];
  const last = i === role.moments.length - 1;
  const go = (n: number) => {
    setI(n);
    setOpen(false);
  };

  return (
    <div>
      <div className={styles.head}>
        <button type="button" className={styles.back} onClick={() => navigate('/day', { replace: true })} aria-label="換身分">
          ‹
        </button>
        <h2 className={styles.role}>
          {role.icon} {role.name}的一天
        </h2>
      </div>

      <DayScene scene={role.scene} t={m.t} icon={m.icon} />

      <ol className={styles.steps} aria-label="時段">
        {role.moments.map((x, n) => (
          <li key={n}>
            <button
              type="button"
              className={`${styles.step} ${n === i ? styles.stepOn : ''} ${n < i ? styles.stepDone : ''}`}
              aria-current={n === i ? 'step' : undefined}
              aria-label={x.time}
              onClick={() => go(n)}
            >
              <span aria-hidden="true">{x.icon}</span>
            </button>
          </li>
        ))}
      </ol>

      <section className={styles.card} aria-live="polite">
        <button type="button" className={styles.cardHead} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span className={styles.time}>{m.time}</span>
          <span className={styles.title}>{m.title}</span>
          <span className={styles.more} aria-hidden="true">
            {open ? '▴' : '▾'}
          </span>
        </button>
        {open && (
          <div className={styles.body}>
            <p>{m.body}</p>
            {m.links && (
              <p className={styles.links}>
                {m.links.map((l) => {
                  const r = resolveDayLink(l);
                  return (
                    r && (
                      <Link key={`${l.kind}:${l.id}`} to={r.to} className={styles.chip}>
                        {r.label}
                      </Link>
                    )
                  );
                })}
              </p>
            )}
          </div>
        )}
      </section>

      <div className={styles.nav}>
        <button type="button" className={pages.btn} disabled={i === 0} onClick={() => go(i - 1)}>
          ◀ 前一段
        </button>
        <button type="button" className={pages.primary} disabled={last} onClick={() => go(i + 1)}>
          下一段 ▶
        </button>
      </div>

      <div className={styles.facts} role="group" aria-label={`${role.name}的生活`}>
        {role.facts.map((f, n) => (
          <button
            key={f.label}
            type="button"
            className={`${styles.fact} ${fact === n ? styles.factOn : ''}`}
            aria-expanded={fact === n}
            onClick={() => setFact(fact === n ? null : n)}
          >
            {f.icon} {f.label}
          </button>
        ))}
      </div>
      {fact !== null && <p className={styles.factText}>{role.facts[fact].text}</p>}

      {last && (
        <>
          <h3 className={pages.h3}>換個身分</h3>
          <RoleGrid except={role.id} />
        </>
      )}

      <details className={pages.small}>
        <summary>來源</summary>
        <ul>
          {role.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noreferrer">
                {s.title}
              </a>
            </li>
          ))}
          <li>場景圖為示意，以新王國時期（約西元前 1550–1070 年）的底比斯一帶為主。</li>
        </ul>
      </details>
    </div>
  );
}
