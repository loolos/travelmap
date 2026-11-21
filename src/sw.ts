/// <reference lib="webworker" />
import { cleanupOutdatedCaches, createHandlerBoundToURL, matchPrecache, precacheAndRoute } from 'workbox-precaching';
import { NavigationRoute, registerRoute } from 'workbox-routing';
import { setCacheNameDetails } from 'workbox-core';

declare let self: ServiceWorkerGlobalScope;

const BASE = import.meta.env.BASE_URL;
const CORE_CACHE = 'travelmap-core';

setCacheNameDetails({ prefix: 'travelmap' });
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Hash routes all live on index.html; serve the cached shell for navigations within our scope.
registerRoute(new NavigationRoute(createHandlerBoundToURL(`${BASE}index.html`)));

const placeholder = async () => (await matchPrecache(`${BASE}placeholder.svg`)) ?? Response.error();

// Core media: cache-first from the core cache (filled by the offline page), else network, else placeholder.
registerRoute(
  ({ url, sameOrigin }) => sameOrigin && url.pathname.startsWith(`${BASE}media/`) && !url.searchParams.has('dl'),
  async ({ request, url }) => {
    const cache = await caches.open(CORE_CACHE);
    const hit = await cache.match(url.origin + url.pathname);
    if (hit) return hit;
    try {
      return await fetch(request);
    } catch {
      return placeholder();
    }
  },
);

// Non-essential online images: network only, placeholder when offline.
registerRoute(
  ({ request, sameOrigin }) => !sameOrigin && request.destination === 'image',
  async ({ request }) => {
    try {
      return await fetch(request);
    } catch {
      return placeholder();
    }
  },
);

self.addEventListener('message', (e) => {
  if (e.data?.type === 'SKIP_WAITING') void self.skipWaiting();
});
