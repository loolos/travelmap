import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useMatch, useNavigate } from 'react-router-dom';
import { buildNavIndex, matches, type NavItem } from './navIndex';
import { activityById, placeById, regionById } from '../data/content';
import { UpdateBanner } from '../offline/UpdateBanner';
import styles from './TopNav.module.css';

const pageTitles: Record<string, string> = {
  '/journal': '探索日誌',
  '/offline': '離線下載',
  '/glyphs': '象形文字小字典',
  '/deities': '神祇圖鑑',
};

function useBreadcrumb(): string[] {
  const loc = useLocation();
  const place = useMatch('/place/:id/*');
  const act = useMatch('/place/:id/:activity');
  if (place) {
    const p = placeById.get(place.params.id!);
    if (p) {
      const crumbs = [regionById.get(p.regionId)?.nameZh ?? '', p.nameZh];
      const a = act && activityById.get(act.params.activity!);
      if (a) crumbs.push(a.label);
      return crumbs;
    }
  }
  if (loc.pathname.startsWith('/notes')) return ['旅人手記'];
  if (loc.pathname.startsWith('/knowledge')) return ['知識卡'];
  if (loc.pathname.startsWith('/timeline')) return ['埃及歷史時間線'];
  return [pageTitles[loc.pathname] ?? '埃及探索'];
}

export function TopNav() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  // Menu categories start folded; remembered while the app is open.
  const [openGroups, setOpenGroups] = useState<Set<string>>(() => new Set());
  const crumbs = useBreadcrumb();
  const navigate = useNavigate();
  const loc = useLocation();
  const groups = useMemo(() => buildNavIndex(), []);
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setOpen(false), [loc.pathname]);
  useEffect(() => {
    if (open) {
      setQ('');
      // Don't pop the keyboard on touch devices; focus search on desktop.
      if (matchMedia('(pointer: fine)').matches) inputRef.current?.focus();
    }
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const filtered = groups
    .map((g) => ({
      ...g,
      sections: g.sections
        .map((s) => ({ ...s, items: s.items.filter((i) => matches(i, q)) }))
        .filter((s) => s.items.length),
    }))
    .filter((g) => g.sections.length);
  const first = filtered[0]?.sections[0]?.items[0];

  return (
    <header className={styles.bar}>
      <Link to="/map" className={styles.home} aria-label="回到地圖">
        <img src={`${import.meta.env.BASE_URL}icons/icon.svg`} alt="" width={28} height={28} />
      </Link>
      <nav className={styles.crumbs} aria-label="目前位置">
        {crumbs.map((c, i) => (
          <span key={i} className={i === crumbs.length - 1 ? styles.current : undefined}>
            {i > 0 && <span className={styles.sep}>›</span>}
            {c}
          </span>
        ))}
      </nav>
      <UpdateBanner />
      <button
        ref={btnRef}
        type="button"
        className={styles.menuBtn}
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? '✕' : '☰'} 目錄
      </button>
      {open && (
        <>
          <div className={styles.backdrop} onClick={() => setOpen(false)} />
          <div id="site-menu" className={styles.menu} role="dialog" aria-label="全部內容">
            <input
              ref={inputRef}
              className={styles.search}
              type="search"
              placeholder="搜尋地點、互動…（中英文皆可）"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && first) navigate(first.to);
              }}
              aria-label="搜尋"
            />
            <div className={styles.groups}>
              {filtered.map((g) => {
                const searching = !!q.trim();
                const count = g.sections.reduce((n, s) => n + s.items.length, 0);
                // A one-link group (地圖) needs no folding.
                if (count === 1 && !g.sections[0].title)
                  return (
                    <section key={g.title}>
                      <ul>
                        <NavLink it={g.sections[0].items[0]} />
                      </ul>
                    </section>
                  );
                const isOpen = searching || openGroups.has(g.title);
                return (
                  <section key={g.title}>
                    <button
                      type="button"
                      className={styles.fold}
                      aria-expanded={isOpen}
                      onClick={() => toggle(setOpenGroups, g.title)}
                    >
                      <span>{g.title}</span>
                      <span className={styles.count}>{count}</span>
                      <span className={styles.chev} aria-hidden="true">
                        {isOpen ? '▾' : '▸'}
                      </span>
                    </button>
                    {isOpen &&
                      g.sections.map((s, i) => {
                        if (!s.title)
                          return (
                            <ul key={i}>
                              {s.items.map((it) => (
                                <NavLink key={it.id} it={it} />
                              ))}
                            </ul>
                          );
                        const key = `${g.title}/${s.title}`;
                        const subOpen = searching || openGroups.has(key);
                        return (
                          <div key={key} className={styles.sub2}>
                            <button
                              type="button"
                              className={styles.fold2}
                              aria-expanded={subOpen}
                              onClick={() => toggle(setOpenGroups, key)}
                            >
                              <span>{s.title}</span>
                              <span className={styles.count}>{s.items.length}</span>
                              <span className={styles.chev} aria-hidden="true">
                                {subOpen ? '▾' : '▸'}
                              </span>
                            </button>
                            {subOpen && (
                              <ul>
                                {s.items.map((it) => (
                                  <NavLink key={it.id} it={it} />
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                  </section>
                );
              })}
              {!filtered.length && <p className={styles.empty}>找不到「{q}」</p>}
            </div>
          </div>
        </>
      )}
    </header>
  );
}

function toggle(set: (fn: (s: Set<string>) => Set<string>) => void, key: string) {
  set((s) => {
    const n = new Set(s);
    if (n.has(key)) n.delete(key);
    else n.add(key);
    return n;
  });
}

function NavLink({ it }: { it: NavItem }) {
  return (
    <li>
      <Link to={it.to} className={it.muted ? styles.muted : undefined}>
        {it.icon && <span aria-hidden="true">{it.icon} </span>}
        {it.label}
        {it.sub && (
          <span className={`${styles.sub} en`} lang="en">
            {it.sub}
          </span>
        )}
      </Link>
    </li>
  );
}
