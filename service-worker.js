const cacheName = 'my-site-cache-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/icons/manifest-icon-001.png',
  '/images/edu.jpg',
  '/images/franchise.jpeg',
  '/images/home2.jpg',
  '/images/softdev.jpg',
  '/images/contact.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
    event.respondWith(
      caches.match(event.request).then(response => {
        if (response) {
          // Check if it's a redirect response
          if (response.status >= 300 && response.status < 400) {
            // If it's a redirect, simply fetch from network.
            return fetch(event.request);
          }
          return response; // Serve from cache if not a redirect
        }
        return fetch(event.request); // Fetch from network if not in cache
      })
    );
  });