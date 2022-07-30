const cacheName = 'chat-app_v1'
const files = [
    '/',
    '/static/js/main.js',
    '/static/images/favicon.ico'
];

self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(files);
        })
    );
});

self.addEventListener('fetch', e => {
    if(e.request.method === 'POST') return;
    e.respondWith(
        fetch(e.request.url).then(res => {
            return caches.open(cacheName).then(cache => {
                cache.put(e.request, res.clone());
                return res;
            });
        }).catch(() => {
            return caches.match(e.request.url);
        })
    )
});

self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys.filter(key => key !== cacheName).map(key => {
                return caches.delete(key);
            }))
        })
    )
});