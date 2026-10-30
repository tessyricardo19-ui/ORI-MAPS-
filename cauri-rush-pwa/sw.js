/* Cauri Rush : service worker. Incrémente V à chaque nouvelle version du jeu. */
const V = 'cauri-v5';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'g3.js', 'w3.js', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png', 'audio/fon-boss.m4a', 'audio/fon-fourmis.m4a'];
const CDN = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || r.headers.has('range')) return;
  const u = new URL(r.url);
  if (u.hostname.endsWith('supabase.co')) return;           // le temps réel ne passe jamais par le cache

  if (u.origin === location.origin) {                        // le jeu : réseau d'abord, cache si hors ligne
    e.respondWith(
      fetch(r)
        .then(res => { if (res.ok && res.status === 200) { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)).catch(() => {}); } return res; })
        .catch(() => caches.match(r).then(m => m || caches.match('index.html')))
    );
    return;
  }

  if (CDN.includes(u.hostname)) {                            // bibliothèque et police : cache d'abord, mise à jour en fond
    e.respondWith(
      caches.match(r).then(m => {
        const net = fetch(r)
          .then(res => { const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); return res; })
          .catch(() => m);
        return m || net;
      })
    );
  }
});
