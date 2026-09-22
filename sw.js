const CACHE_NAME = 'alpine-apex-runtime-v17';

self.addEventListener('install', (event) => {
  // Activate immediately so an installed copy does not stay on an older worker.
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  // Only cache this app's own files. CDN libraries remain under normal browser caching.
  if (url.origin !== self.location.origin) return;

  // Always ask the server for the HTML shell. This is the important part for
  // installed PWAs: a new GitHub Pages deployment becomes visible on the next
  // online launch instead of being hidden behind an old cached index.html.
  if (request.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname === '/') {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(new Request(request, { cache: 'no-store' }));
        if (fresh.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, fresh.clone());
        }
        return fresh;
      } catch (_) {
        const cached = await caches.match(request);
        return cached || caches.match('./index.html');
      }
    })());
    return;
  }

  // Runtime-cache same-origin assets, while preferring the network so changed
  // files are picked up without requiring users to clear browser data.
  event.respondWith((async () => {
    try {
      const fresh = await fetch(request, { cache: 'no-store' });
      if (fresh.ok) {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, fresh.clone());
      }
      return fresh;
    } catch (_) {
      return (await caches.match(request)) || Response.error();
    }
  })());
});

// Allow the page to explicitly request an update if it wants to.
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
