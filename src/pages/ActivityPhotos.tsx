import { useState } from 'react';
import { assetById, assetUrl } from '../data/content';

/** 「實景照片」: real photos of what an interaction's diagram shows, behind a toggle so the diagram stays first. */
export function ActivityPhotos({ ids }: { ids: string[] }) {
  const [open, setOpen] = useState(false);
  const photos = ids.map((id) => assetById.get(id)).filter((a) => a && assetUrl(a.id));
  if (!photos.length) return null;
  return (
    <div style={{ marginBottom: 12 }}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        style={{
          minHeight: 36,
          padding: '0 14px',
          borderRadius: 18,
          border: '1px solid var(--line)',
          background: open ? 'var(--panel-2)' : '#fff',
          fontSize: 14,
          color: 'var(--ink)',
        }}
      >
        📷 {open ? '收起實景照片' : '實景照片'}
      </button>
      {open && (
        <div style={{ display: 'grid', gap: 10, marginTop: 10 }}>
          {photos.map(
            (a) =>
              a && (
                <figure key={a.id} style={{ margin: 0 }}>
                  <img
                    src={assetUrl(a.id)}
                    alt={a.alt}
                    loading="lazy"
                    style={{ width: '100%', maxHeight: 260, objectFit: 'contain', background: 'var(--panel-2)', borderRadius: 12, display: 'block' }}
                  />
                  <figcaption style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                    {a.alt} · {a.credit} · {a.license}
                    {a.sourceUrl && (
                      <>
                        {' · '}
                        <a href={a.sourceUrl} target="_blank" rel="noreferrer">
                          出處
                        </a>
                      </>
                    )}
                  </figcaption>
                </figure>
              ),
          )}
        </div>
      )}
    </div>
  );
}
