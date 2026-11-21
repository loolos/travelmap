import { useEffect } from 'react';
import { checkCore, downloadCore, isReady, useOfflineState } from './coreCache';
import styles from '../pages/Pages.module.css';

const mb = (b: number) => (b / 1024 / 1024).toFixed(b < 1024 * 1024 ? 2 : 1);

export function OfflinePage() {
  const s = useOfflineState();
  useEffect(() => {
    void checkCore();
  }, []);
  const ready = isReady(s);
  const pct = s.totalBytes ? Math.round((s.doneBytes / s.totalBytes) * 100) : 100;

  return (
    <div>
      <div className={`${styles.status} ${ready ? styles.ready : ''}`} data-testid="offline-status" data-ready={ready}>
        {!s.checked ? '檢查中…' : ready ? '✅ 離線就緒：沒有網路也能使用' : '⏳ 尚未離線就緒'}
      </div>

      {!s.swSupported && <p className={styles.small}>這個瀏覽器不支援離線功能（Service Worker）。</p>}

      <h2 className={styles.h2}>App 主程式</h2>
      <p>{s.shellReady ? '✓ 已存到這台裝置' : '尚未完成（重新整理一次通常就會完成）'}</p>

      <h2 className={styles.h2}>核心內容（圖片）</h2>
      <div className={styles.bar} aria-label={`已下載 ${pct}%`}>
        <div style={{ width: `${pct}%` }} />
      </div>
      <p className={styles.small}>
        {s.doneFiles}／{s.totalFiles} 個檔案 · {mb(s.doneBytes)}／{mb(s.totalBytes)} MB
      </p>
      <button
        type="button"
        className={styles.primary}
        disabled={s.downloading || (ready && !s.failed.length)}
        onClick={() => void downloadCore()}
      >
        {s.downloading ? '下載中…' : s.missing.length ? '下載全部核心內容' : '已全部下載'}
      </button>
      {s.failed.length > 0 && (
        <p className={styles.small} role="alert">
          有 {s.failed.length} 個檔案下載失敗，請確認網路後再按一次。
        </p>
      )}
      {s.persisted === false && (
        <p className={styles.small}>瀏覽器沒有承諾永久保存；請把 App 加入主畫面，並在出發前實測。</p>
      )}

      <h2 className={styles.h2}>出發前檢查</h2>
      <details className={styles.card}>
        <summary>📱 iPhone：加入主畫面</summary>
        <ol>
          <li>用 Safari 開啟本網站。</li>
          <li>點「分享」→「加入主畫面」。</li>
          <li>從主畫面圖示打開，回到這頁確認「離線就緒」。</li>
        </ol>
        <p className={styles.small}>iOS 可能清除超過 7 天沒開的網站資料；加入主畫面的 App 比較不受影響。</p>
      </details>
      <details className={styles.card}>
        <summary>✈️ 飛行模式實測</summary>
        <ol>
          <li>完全關掉 App。</li>
          <li>開飛行模式（Wi‑Fi 也關）。</li>
          <li>重新打開，確認地圖、地點與圖片都正常。</li>
        </ol>
      </details>
    </div>
  );
}
