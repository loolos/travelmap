import { useSyncExternalStore } from 'react';
import { registerSW } from 'virtual:pwa-register';
import { checkCore, downloadCore } from './coreCache';

/** Build stamp of the running version, e.g. "11/21 20:56 · c8845ce". */
export const APP_VERSION = __APP_VERSION__;

export type CheckResult = 'idle' | 'checking' | 'latest' | 'update' | 'content' | 'error' | 'unsupported';

interface UpdateState {
  /** A new version has been downloaded and waits for a reload. */
  needRefresh: boolean;
  result: CheckResult;
  lastChecked?: number;
}

let state: UpdateState = { needRefresh: false, result: 'idle' };
const listeners = new Set<() => void>();
const setState = (patch: Partial<UpdateState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

export function useAppUpdate(): UpdateState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}

const AUTO_CHECK_MS = 30 * 60 * 1000;
let registration: ServiceWorkerRegistration | undefined;
let updateSW: ((reload?: boolean) => Promise<void>) | undefined;
let started = false;

/** Registers the service worker once and keeps checking for new versions in the background. */
export function startAppUpdates() {
  if (started || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return;
  started = true;
  updateSW = registerSW({
    onNeedRefresh: () => setState({ needRefresh: true, result: 'update' }),
    onOfflineReady: () => void checkCore(),
    onRegisteredSW: (_url, reg) => {
      registration = reg;
      if (!reg) return;
      const quietCheck = () => {
        if (navigator.onLine) void reg.update().catch(() => undefined);
      };
      setInterval(quietCheck, AUTO_CHECK_MS);
      document.addEventListener('visibilitychange', () => document.visibilityState === 'visible' && quietCheck());
      window.addEventListener('online', quietCheck);
    },
  });
}

/** Wait until a freshly found service worker has finished installing (or a timeout). */
function settle(reg: ServiceWorkerRegistration, ms = 15_000): Promise<void> {
  const sw = reg.installing;
  if (!sw) return Promise.resolve();
  return new Promise((resolve) => {
    const done = () => resolve();
    const t = setTimeout(done, ms);
    sw.addEventListener('statechange', () => {
      if (sw.state === 'installed' || sw.state === 'activated' || sw.state === 'redundant') {
        clearTimeout(t);
        // onNeedRefresh fires from the same event; give it a tick.
        setTimeout(done, 50);
      }
    });
  });
}

/**
 * One button for everything: look for a new app version; if there is none,
 * make sure all offline content is present and fetch anything missing or changed.
 */
export async function checkForUpdates(): Promise<CheckResult> {
  if (state.needRefresh) return 'update';
  setState({ result: 'checking' });
  try {
    if (registration) {
      await registration.update();
      await settle(registration);
      if (state.needRefresh || registration.waiting) {
        setState({ needRefresh: true, result: 'update', lastChecked: Date.now() });
        return 'update';
      }
    }
    const core = await checkCore();
    let result: CheckResult = registration ? 'latest' : 'unsupported';
    if (core.missing.length) {
      await downloadCore();
      result = 'content';
    }
    setState({ result, lastChecked: Date.now() });
    return result;
  } catch {
    setState({ result: 'error', lastChecked: Date.now() });
    return 'error';
  }
}

let reloading = false;
const reloadOnce = () => {
  if (reloading) return;
  reloading = true;
  window.location.reload();
};

/** Activate the waiting version and reload the page. */
export function applyUpdate() {
  const waiting = registration?.waiting;
  if (waiting) {
    // Pages the old worker never controlled get no controllerchange, so reload once the new one is active.
    waiting.addEventListener('statechange', () => waiting.state === 'activated' && reloadOnce());
  }
  void updateSW?.(true);
  setTimeout(reloadOnce, 4000);
}
