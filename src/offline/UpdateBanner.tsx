import { applyUpdate, useAppUpdate } from './appUpdate';

/** Shown in the top bar whenever a new version has been detected (checked automatically). */
export function UpdateBanner() {
  const { needRefresh } = useAppUpdate();
  if (!needRefresh) return null;
  return (
    <button
      type="button"
      onClick={applyUpdate}
      style={{
        minHeight: 36,
        padding: '0 10px',
        borderRadius: 18,
        border: 'none',
        background: '#F2C14E',
        color: '#292720',
        fontSize: 13,
        whiteSpace: 'nowrap',
      }}
    >
      有新版本 ↻
    </button>
  );
}
