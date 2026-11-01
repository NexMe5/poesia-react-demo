/*
 * Poesia service worker: repeat visits open instantly and keep working offline.
 *
 *   /assets/*   code, styles, fonts, photos — content-hashed, so cache-first and kept for good
 *   pages       network-first (always the latest deploy), falling back to that page's cached copy offline
 *
 * Bump VERSION to drop every cache on the next visit.
 */
const VERSION = 'v3';
const PAGES = `poesia-pages-${VERSION}`;
const ASSETS = `poesia-assets-${VERSION}`;
const MAX_ASSETS = 160;               // old hashed files from earlier deploys are trimmed past this
const NETWORK_TIMEOUT = 4000;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(PAGES).then((c) => c.add('/')).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = [PAGES, ASSETS];
    for (const key of await caches.keys()) if (key.startsWith('poesia-') && !keep.includes(key)) await caches.delete(key);
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

async function trim(cache) {
  const keys = await cache.keys();
  for (let i = 0; i < keys.length - MAX_ASSETS; i++) await cache.delete(keys[i]);
}

async function cacheFirst(request) {
  const cache = await caches.open(ASSETS);
  const hit = await cache.match(request);
  if (hit) return hit;
  const res = await fetch(request);
  if (res.ok && res.type === 'basic') { cache.put(request, res.clone()); trim(cache); }
  return res;
}

/** Each page is cached under its own path (/, /privacy-policy, /terms), ignoring query, hash and a trailing slash. */
const pageKey = (request) => {
  const { pathname } = new URL(request.url);
  return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
};

async function networkFirst(event) {
  const cache = await caches.open(PAGES);
  try {
    const preload = event.preloadResponse ? await event.preloadResponse : null;
    const res = preload || await Promise.race([
      fetch(event.request),
      new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), NETWORK_TIMEOUT)),
    ]);
    if (res.ok) cache.put(pageKey(event.request), res.clone());
    return res;
  } catch {
    return (await cache.match(pageKey(event.request))) || (await cache.match('/')) || Response.error();
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') { event.respondWith(networkFirst(event)); return; }
  if (url.pathname.startsWith('/assets/')) event.respondWith(cacheFirst(request));
});
