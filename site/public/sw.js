/* promptgarten Service Worker — Offline-Unterstützung.
 * Strategie: Navigationen network-first (frischer Inhalt, Cache als Fallback),
 * statische Assets stale-while-revalidate. Nur same-origin GET. */
const CACHE = 'pg-v1';
const OFFLINE_HTML =
  '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline — promptgarten</title></head>' +
  '<body style="font-family:system-ui;background:#faf6ee;color:#2b2118;display:flex;min-height:100vh;align-items:center;justify-content:center;text-align:center">' +
  '<div><div style="font-size:56px">🌱</div><h1 style="margin:10px 0 6px">Offline</h1>' +
  '<p style="margin:0;color:#7a6f60">Keine Verbindung — schon besuchte Seiten bleiben lesbar. / No connection — pages you visited stay readable.</p></div></body></html>';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(['/manifest.webmanifest', '/icon-192.png', '/icon-512.png'])).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

const ASSET_PREFIXES = ['/_next/static/', '/videos/', '/challenge/', '/search/', '/icon-', '/api/'];

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Statische Assets: aus dem Cache, im Hintergrund auffrischen.
  if (ASSET_PREFIXES.some((p) => url.pathname.startsWith(p))) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(req);
        const refresh = fetch(req)
          .then((res) => {
            if (res.ok) cache.put(req, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || refresh;
      })
    );
    return;
  }

  // Seiten (Navigationen): Netz zuerst, Cache als Fallback, sonst Offline-Hinweis.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res.ok) caches.open(CACHE).then((c) => c.put(req, res.clone()));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          return cached || new Response(OFFLINE_HTML, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        })
    );
  }
});
