const CACHE_NAME = 'minesweeper-cache-v1';
const OFFLINE_URL = 'offline.html';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([OFFLINE_URL]);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Bereinige alte Caches, wenn nötig
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
    if (event.request.mode === 'navigate') {
      event.respondWith(
        fetch(event.request).catch(() => {
          return caches.open(CACHE_NAME).then(cache => {
            return cache.match(OFFLINE_URL);
          });
        })
      );
    } else {
      event.respondWith(fetch(event.request));
    }
  });
  
