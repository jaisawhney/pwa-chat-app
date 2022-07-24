const cacheName = 'pwa-chat-app'
const files = [
    '/',
    '/static/js/main.js'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(files);
        })
    );
});

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(res => {
            return res || fetch(e.request);
        })
    )
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(keys.filter(key => key !== cacheName).map(key => {
                return caches.delete(key);
            }))
        })
    )
});