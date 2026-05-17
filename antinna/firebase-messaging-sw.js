// =========================================================================
// Firebase Cloud Messaging Core Background Worker Engine
// Hosted on GitHub - Initialized dynamically via local Blob compilation
// =========================================================================

// Import production-grade Firebase Compatibility SDK platforms
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/11.6.1/firebase-messaging-compat.js');

// Establish runtime environment confirmation nodes
if (self.FIREBASE_CONFIG_SETTING) {
  firebase.initializeApp(self.FIREBASE_CONFIG_SETTING);
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
} else {
  console.error('[SW] Service Worker context initialization aborted: Configuration payload missing.');
}

// Global Lifecycle System Triggers
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Primary Client Routing Actions Trigger
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const routeTarget = event.notification.data?.click_action || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientsList) => {
      for (const client of clientsList) {
        if (client.url === routeTarget && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(routeTarget);
    })
  );
});
