// Firebase Cloud Messaging Service Worker
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAls1zpuUGgNx7xhlpCjF4bDEXp8qfxQ3A",
    authDomain: "survivorfantasy-cc908.firebaseapp.com",
    databaseURL: "https://survivorfantasy-cc908-default-rtdb.firebaseio.com",
    projectId: "survivorfantasy-cc908",
    storageBucket: "survivorfantasy-cc908.firebasestorage.app",
    messagingSenderId: "401357232113",
    appId: "1:401357232113:web:a9980c49bde38ff981d650"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message:', payload);
    
    const notificationTitle = payload.notification.title || 'Survivor 50 Fantasy League';
    const notificationOptions = {
        body: payload.notification.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        tag: payload.data?.type || 'general',
        data: payload.data,
        requireInteraction: false,
        vibrate: [200, 100, 200]
    };
    
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    // Determine where to navigate based on notification type
    let urlToOpen = '/';
    
    if (event.notification.data) {
        switch (event.notification.data.type) {
            case 'chat':
                urlToOpen = '/chat.html';
                break;
            case 'scoring':
                urlToOpen = '/scoring.html';
                break;
            case 'draft':
                urlToOpen = '/index.html';
                break;
            default:
                urlToOpen = '/';
        }
    }
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Check if there's already a window open
            for (let client of clientList) {
                if (client.url.includes(urlToOpen) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Otherwise open a new window
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});
