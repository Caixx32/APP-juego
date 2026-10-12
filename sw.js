// Caché simple para que la app funcione sin conexión.
const CACHE = 'minijuegos-v1';
const FILES = [
  './', 'index.html', 'css/style.css', 'manifest.json', 'icon.svg',
  'js/app.js', 'js/games/tictactoe.js', 'js/games/connect4.js', 'js/games/reflex.js',
  'js/games/memory.js', 'js/games/rps.js', 'js/games/tapwar.js',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))));
  self.clients.claim();
});

// Red primero (para recibir cambios), caché si no hay conexión.
self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
