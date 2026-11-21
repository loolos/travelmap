import { useRegisterSW } from 'virtual:pwa-register/react';
import { checkCore } from './coreCache';

/** Registers the service worker and offers a reload when a new version is waiting. */
export function UpdateBanner() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onOfflineReady: () => void checkCore(),
  });
  if (!needRefresh) return null;
  return (
    <button
      type="button"
      onClick={() => updateServiceWorker(true)}
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
