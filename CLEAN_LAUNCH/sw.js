// Night God Tarot Service Worker
const CACHE_NAME = 'night-god-tarot-v1';
const urlsToCache = [
  '/',
  '/PRODUCTION_READY.html',
  './src/assets/night-god-logo.jpg',
  './src/assets/final.png',
  './src/assets/khrarl full.png',
  'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Uncial+Antiqua&display=swap'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('🌙 Night God Tarot: Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});