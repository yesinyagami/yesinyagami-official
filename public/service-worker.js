/**
 * Night God Tarot Service Worker
 * Handles offline functionality, caching, and background sync
 */

const CACHE_NAME = 'night-god-tarot-v1.0.0';
const DYNAMIC_CACHE = 'night-god-tarot-dynamic-v1.0.0';
const API_CACHE = 'night-god-tarot-api-v1.0.0';

// Resources to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/main.css',
  '/assets/base.css',
  '/assets/design-system.css',
  // Add card images
  ...Array.from({length: 94}, (_, i) => {
    const num = String(i + 1).padStart(2, '0');
    return `/assets/${num}_*.png`;
  })
];

// API endpoints to cache
const API_ENDPOINTS = [
  '/api/cards',
  '/api/spreads',
  '/api/meanings'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        // Cache core assets, ignore card images if they don't exist yet
        return cache.addAll(STATIC_ASSETS.filter(asset => !asset.includes('*')));
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName.startsWith('night-god-tarot-') &&
                   cacheName !== CACHE_NAME &&
                   cacheName !== DYNAMIC_CACHE &&
                   cacheName !== API_CACHE;
          })
          .map((cacheName) => {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Handle Monica AI requests
  if (url.hostname === 'openapi.monica.im') {
    event.respondWith(handleMonicaRequest(request));
    return;
  }

  // Handle static assets
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached version
            return cachedResponse;
          }

          // Fetch from network and cache
          return fetch(request).then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type === 'error') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the fetched response
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseToCache);
            });

            return response;
          });
        })
        .catch(() => {
          // Offline fallback
          if (request.destination === 'document') {
            return caches.match('/offline.html');
          }
          
          // Return placeholder image for card images
          if (request.destination === 'image' && url.pathname.includes('/assets/')) {
            return caches.match('/assets/card-placeholder.png');
          }
        })
    );
  }
});

// Handle API requests with cache-first strategy
async function handleApiRequest(request) {
  try {
    // Try cache first
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      // Fetch in background to update cache
      fetch(request).then(response => {
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(API_CACHE).then(cache => {
            cache.put(request, responseToCache);
          });
        }
      });
      return cachedResponse;
    }

    // Network request with timeout
    const networkResponse = await fetchWithTimeout(request, 5000);
    
    // Cache successful responses
    if (networkResponse && networkResponse.status === 200) {
      const responseToCache = networkResponse.clone();
      const cache = await caches.open(API_CACHE);
      cache.put(request, responseToCache);
    }
    
    return networkResponse;
  } catch (error) {
    console.error('[Service Worker] API request failed:', error);
    
    // Return offline response
    return new Response(JSON.stringify({
      error: 'Offline',
      message: 'The divine connection is temporarily unavailable. Please try again.',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Handle Monica AI requests with intelligent caching
async function handleMonicaRequest(request) {
  // Don't cache POST requests to Monica API
  if (request.method === 'POST') {
    try {
      return await fetchWithTimeout(request, 30000);
    } catch (error) {
      console.error('[Service Worker] Monica API request failed:', error);
      
      // Return mock response for development
      return new Response(JSON.stringify({
        choices: [{
          message: {
            content: 'The divine wisdom flows through mysterious channels. Your reading reveals profound insights about your journey.'
          }
        }]
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
  
  return fetch(request);
}

// Fetch with timeout
function fetchWithTimeout(request, timeout = 5000) {
  return Promise.race([
    fetch(request),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), timeout)
    )
  ]);
}

// Background sync for offline readings
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-readings') {
    event.waitUntil(syncOfflineReadings());
  }
});

// Sync offline readings when back online
async function syncOfflineReadings() {
  try {
    const cache = await caches.open('offline-readings');
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      const data = await response.json();
      
      // Send to server
      await fetch('/api/readings/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      // Remove from cache
      await cache.delete(request);
    }
    
    console.log('[Service Worker] Synced', requests.length, 'offline readings');
  } catch (error) {
    console.error('[Service Worker] Sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Your divine guidance awaits',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Reading',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Night God Tarot', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/demo')
    );
  }
});

// Message handler for skip waiting
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[Service Worker] Night God Tarot service worker loaded');