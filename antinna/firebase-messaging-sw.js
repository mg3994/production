// Import production-grade Firebase Compatibility SDK platforms
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

// Initialize inside the worker thread explicitly using your project credentials
firebase.initializeApp({
  apiKey: "AIzaSyDtRB-0S8VNgY-HoQYAAvkLX7iOAK-K-i0",
  authDomain: "antinnamain.firebaseapp.com",
  projectId: "antinnamain",
  storageBucket: "antinnamain.appspot.com",
  messagingSenderId: "907520801915",
  appId: "1:907520801915:web:5a99962f7ce400da54b6de"
});

const messaging = firebase.messaging();

// Wire up incoming background message pipelines safely
messaging.onBackgroundMessage((payload) => {
  console.log('[SW] Background channel payload intercepted: ', payload);
  
  const title = payload.notification?.title || 'Notification Update';
  const options = {
    body: payload.notification?.body || '',
    icon: payload.notification?.image || '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data || {}
  };

  self.registration.showNotification(title, options);
});

// Global Lifecycle System Triggers
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const routeTarget = event.notification.data?.click_action || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsList) => {
      for (const client of clientsList) {
        if (client.url === routeTarget && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(routeTarget);
    })
  );
});
