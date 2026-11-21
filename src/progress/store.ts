import { useSyncExternalStore } from 'react';
import { createStore, get, set } from 'idb-keyval';
import type { Place } from '../data/schema';

export interface Progress {
  opened: Record<string, number>;
  visited: Record<string, number>;
  /** findItemId -> timestamp */
  found: Record<string, number>;
  /** deityId -> place ids where it was spotted */
  deities: Record<string, string[]>;
  activities: Record<string, number>;
}

const empty = (): Progress => ({ opened: {}, visited: {}, found: {}, deities: {}, activities: {} });
const KEY = 'progress-v1';

let idb: ReturnType<typeof createStore> | null = null;
const db = () => (idb ??= createStore('travelmap', 'state'));

let state: Progress = empty();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const loaded: Promise<void> =
  typeof indexedDB === 'undefined'
    ? Promise.resolve()
    : get<Progress>(KEY, db())
        .then((v) => {
          if (v) {
            state = { ...empty(), ...v };
            emit();
          }
        })
        .catch(() => undefined);

function update(fn: (p: Progress) => Progress) {
  state = fn(state);
  emit();
  if (typeof indexedDB !== 'undefined') set(KEY, state, db()).catch(() => undefined);
}

export function useProgress(): Progress {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}

export const getProgress = () => state;

export function markOpened(placeId: string) {
  if (state.opened[placeId]) return;
  update((p) => ({ ...p, opened: { ...p.opened, [placeId]: Date.now() } }));
}

export function toggleVisited(placeId: string) {
  update((p) => {
    const visited = { ...p.visited };
    if (visited[placeId]) delete visited[placeId];
    else visited[placeId] = Date.now();
    return { ...p, visited };
  });
}

export function toggleFound(place: Place, itemId: string) {
  const item = place.findItems.find((f) => f.id === itemId);
  if (!item) return;
  update((p) => {
    const found = { ...p.found };
    const deities = { ...p.deities };
    if (found[itemId]) {
      delete found[itemId];
    } else {
      found[itemId] = Date.now();
      // Spotting a deity collects it (unchecking never un-collects).
      if (item.deityId) {
        const at = deities[item.deityId] ?? [];
        if (!at.includes(place.id)) deities[item.deityId] = [...at, place.id];
      }
    }
    return { ...p, found, deities };
  });
}

export function resetAll() {
  update(() => empty());
}

/** A place lights up on the map once all of its find items are checked. */
export function isLit(place: Place, p: Progress): boolean {
  return place.findItems.length > 0 && place.findItems.every((f) => !!p.found[f.id]);
}

export function foundCount(place: Place, p: Progress): number {
  return place.findItems.filter((f) => !!p.found[f.id]).length;
}
