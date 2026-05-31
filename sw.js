const CACHE = 'ahorraya-v2';
const ARCHIVOS = ['/', '/index.html', '/app.html', '/manifest.json'];

self.addEventListener('install', function(e) {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(function(cache) { return cache.addAll(ARCHIVOS); }));
});

self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  e.respondWith(caches.match(e.request).then(function(r){ return r || fetch(e.request); }));
});

// Push notifications
self.addEventListener('push', function(e) {
  var data = e.data ? e.data.json() : {title:'AhorraYa', body:'Tienes una notificación'};
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body, icon: 'https://placehold.co/192x192/00C896/ffffff?text=AY',
    badge: 'https://placehold.co/96x96/00C896/ffffff?text=AY', vibrate: [200,100,200]
  }));
});

// Background sync
self.addEventListener('sync', function(e) {
  if(e.tag === 'sync-datos') { console.log('Sincronizando datos...'); }
});
