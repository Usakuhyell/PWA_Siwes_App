const CACHE_NAME = 'siwes-showcase-v1';

const FILES_TO_CACHE = [
  './',
  './siwesapp.html',
  './siwesapp.css',
  './siwesapp.js',
  './manifest.json',
  './cover.png',
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    }),
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
