const CACHE_NAME = 'fire-alert-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  // Skip API calls, let them go to network
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => new Response('Offline - API unavailable', { status: 503 }))
    );
    return;
  }

  // Cache first for other resources
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request)
          .then(response => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(cache => cache.put(event.request, responseToCache));
            return response;
          })
          .catch(() => new Response('Offline', { status: 503 }));
      })
  );
});

// Background sync for sending alerts
self.addEventListener('sync', event => {
  if (event.tag === 'send-alert') {
    event.waitUntil(
      // Retry sending alert if failed
      Promise.resolve()
    );
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  if (event.data) {
    const options = {
      body: event.data.text(),
      icon: '/data:image/svg+xml,<svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg"><rect fill="%23ff4500" width="192" height="192" rx="45"/><text x="96" y="120" font-size="80" fill="white" text-anchor="middle">🔥</text></svg>',
      badge: '/data:image/svg+xml,<svg viewBox="0 0 192 192" xmlns="http://www.w3.org/2000/svg"><rect fill="white" width="192" height="192"/><text x="96" y="120" font-size="80" text-anchor="middle">🔥</text></svg>',
      tag: 'fire-alert',
      requireInteraction: true
    };

    event.waitUntil(
      self.registration.showNotification('🔥 FIRE/SMOKE ALERT 🔥', options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        for (let client of clientList) {
          if (client.url === '/' && 'focus' in client) {
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
  );
});
