const cacheName = 'my-site-cache-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/location.html',
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
      return response || fetch(event.request);
    })
  );
});