// Service Worker for Survivor 51 Fantasy League
const CACHE_NAME = 'survivor-51-v6';
const urlsToCache = [
    './',
    './index.html',
    './chat.html',
    './scoring.html',
    './notifications.html',
    './manifest.json',
    './js/config.js',
    './js/scoring-engine.js',
    './js/api.js',
    './seasons/season-50.json',
    './seasons/season-51.json'
];

// Install event
self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

// Activate event
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            self.clients.claim(),
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});

// Fetch event (Network first for scripts and HTML, cache fallback)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                if (response && response.status === 200 && event.request.method === 'GET') {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }
                return response;
            })
            .catch(() => caches.match(event.request))
    );
});

// Push event - handle incoming push notifications
self.addEventListener('push', (event) => {
    console.log('Push notification received:', event);
    
    let notificationData = {
        title: 'Survivor 50',
        body: 'You have a new notification',
        icon: 'icons/icon-192x192.png',
        badge: 'icons/icon-72x72.png',
        data: {}
    };
    
    if (event.data) {
        try {
            const payload = event.data.json();
            notificationData = {
                title: payload.title || notificationData.title,
                body: payload.body || notificationData.body,
                icon: payload.icon || notificationData.icon,
                badge: payload.badge || notificationData.badge,
                data: payload.data || {}
            };
        } catch (e) {
            notificationData.body = event.data.text();
        }
    }
    
    event.waitUntil(
        Promise.all([
            // Show notification
            self.registration.showNotification(notificationData.title, {
                body: notificationData.body,
                icon: notificationData.icon,
                badge: notificationData.badge,
                data: notificationData.data,
                vibrate: [200, 100, 200],
                tag: notificationData.data.type || 'general'
            }),
            // Update badge count
            updateBadgeCount()
        ])
    );
});

// Update badge count from Firebase
async function updateBadgeCount() {
    try {
        // Get all clients (open tabs/windows)
        const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        
        if (clients.length > 0) {
            // Ask the first client to update the badge
            clients[0].postMessage({ type: 'UPDATE_BADGE' });
        }
    } catch (error) {
        console.error('Error updating badge:', error);
    }
}

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then((clientList) => {
                // If a window is already open, focus it
                for (let client of clientList) {
                    if ('focus' in client) {
                        return client.focus();
                    }
                }
                // Otherwise, open a new window
                if (clients.openWindow) {
                    return clients.openWindow('./chat.html');
                }
            })
    );
});
