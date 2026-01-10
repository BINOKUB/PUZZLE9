const CACHE_NAME = 'jak-patience-v1';
const ASSETS = [
  './tapis.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Installation du Service Worker et mise en cache des fichiers
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Stratégie de cache : Répondre avec le cache si disponible, sinon chercher sur le réseau
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
