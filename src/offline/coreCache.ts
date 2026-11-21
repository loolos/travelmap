import { useSyncExternalStore } from 'react';
import manifest from 'virtual:core-manifest';

export const CORE_CACHE = 'travelmap-core';
const BASE = import.meta.env.BASE_URL;
const REV_HEADER = 'x-travelmap-rev';
const CONCURRENCY = 4;

export type CoreEntry = (typeof manifest)[number];

export interface OfflineState {
  checked: boolean;
  /** App shell (HTML/JS/CSS/map) precached by the service worker. */
  shellReady: boolean;
  swSupported: boolean;
  totalFiles: number;
  totalBytes: number;
  doneFiles: number;
  doneBytes: number;
  missing: CoreEntry[];
  failed: string[];
  downloading: boolean;
  persisted: boolean | null;
}

const totalBytes = manifest.reduce((s, e) => s + e.bytes, 0);
let state: OfflineState = {
  checked: false,
  shellReady: false,
  swSupported: typeof navigator !== 'undefined' && 'serviceWorker' in navigator,
  totalFiles: manifest.length,
  totalBytes,
  doneFiles: 0,
  doneBytes: 0,
  missing: manifest,
  failed: [],
  downloading: false,
  persisted: null,
};
const listeners = new Set<() => void>();
const setState = (patch: Partial<OfflineState>) => {
  state = { ...state, ...patch };
  listeners.forEach((l) => l());
};

export function useOfflineState(): OfflineState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}

export const isReady = (s: OfflineState) => s.checked && s.shellReady && s.missing.length === 0;
const urlOf = (e: CoreEntry) => new URL(BASE + e.path, location.href).href;

async function shellCached(): Promise<boolean> {
  if (!('caches' in self) || !state.swSupported) return false;
  const reg = await navigator.serviceWorker.getRegistration(BASE);
  if (!reg?.active) return false;
  const hit = await caches.match(new URL(BASE + 'index.html', location.href).href, { ignoreSearch: true });
  return !!hit;
}

/** Re-verify every essential file against the cache (never trusts an old "done" flag). */
export async function checkCore(): Promise<OfflineState> {
  if (!('caches' in self)) {
    setState({ checked: true });
    return state;
  }
  const cache = await caches.open(CORE_CACHE);
  const missing: CoreEntry[] = [];
  let doneBytes = 0;
  for (const e of manifest) {
    const hit = await cache.match(urlOf(e));
    if (hit && hit.headers.get(REV_HEADER) === e.rev) doneBytes += e.bytes;
    else missing.push(e);
  }
  const persisted = navigator.storage?.persisted ? await navigator.storage.persisted() : null;
  setState({
    checked: true,
    shellReady: await shellCached(),
    missing,
    doneBytes,
    doneFiles: manifest.length - missing.length,
    persisted,
  });
  return state;
}

/** Download every missing essential file into Cache Storage, resuming from where it stopped. */
export async function downloadCore(): Promise<void> {
  if (state.downloading || !('caches' in self)) return;
  setState({ downloading: true, failed: [] });
  try {
    if (navigator.storage?.persist) setState({ persisted: await navigator.storage.persist() });
    await checkCore();
    const cache = await caches.open(CORE_CACHE);
    const queue = [...state.missing];
    const failed: string[] = [];
    const worker = async () => {
      for (let e = queue.shift(); e; e = queue.shift()) {
        try {
          // `dl` makes the service worker pass this request straight to the network.
          const res = await fetch(`${BASE}${e.path}?dl=${e.rev}`, { cache: 'no-store' });
          if (!res.ok) throw new Error(String(res.status));
          const blob = await res.blob();
          const headers = new Headers({ 'content-type': res.headers.get('content-type') ?? '', [REV_HEADER]: e.rev });
          await cache.put(urlOf(e), new Response(blob, { headers }));
          setState({
            doneFiles: state.doneFiles + 1,
            doneBytes: state.doneBytes + e.bytes,
            missing: state.missing.filter((m) => m !== e),
          });
        } catch {
          failed.push(e.path);
        }
      }
    };
    await Promise.all(Array.from({ length: CONCURRENCY }, worker));
    setState({ failed });
  } finally {
    setState({ downloading: false });
    await checkCore();
  }
}

/** Kick off a quiet background download once the app is idle and online. */
export function scheduleBackgroundDownload() {
  if (!state.swSupported) return;
  navigator.serviceWorker.ready.then(() => {
    setTimeout(() => {
      if (navigator.onLine) downloadCore().catch(() => undefined);
      else checkCore().catch(() => undefined);
    }, 2500);
  });
}
