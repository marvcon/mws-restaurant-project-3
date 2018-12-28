const applicationName = "restaurant-reviews-application"
const staticCacheName = applicationName + "-v2.0";

const contentImgsCache = applicationName + "-images";

var allCaches = [
    staticCacheName,
    contentImgsCache
  ];

  self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(staticCacheName).then(function(cache) {
        return cache.addAll([
          '/', // this caches index.html
          '/restaurant.html',
          '/js/restaurant_info.js',
          '/css/styles.css',
          '/js/main.js',
          '/manifest.json',
          '/images/icons/icon-72x72.png',
          '/images/icons/icon-96x96.png',
          '/images/icons/icon-128x128.png',
          '/images/icons/icon-144x144.png',
          '/images/icons/icon-152x152.png',
          '/images/icons/icon-192x192.png',
          '/images/icons/icon-384x384.png',
          '/images/icons/icon-512x512.png'

        ]);
      })
    );
  });

self.addEventListener('activate', function(event) {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.filter(function(cacheName) {
            return cacheName.startsWith(applicationName) &&
                   !allCaches.includes(cacheName);
          }).map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      })
    );
  });

  self.addEventListener('fetch', function(event) {
    const requestUrl = new URL(event.request.url);

   
    if (requestUrl.origin === location.origin) {
  
     
      if (requestUrl.pathname.startsWith('/restaurant.html')) {
        event.respondWith(caches.match('/restaurant.html'));
        return;
      }
      if (requestUrl.pathname.startsWith('/img')) {
        event.respondWith(serveImage(event.request));
        return;
      }
    }
  
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  
  function serveImage(request) {
    let imageStorageUrl = request.url;
  
  
    imageStorageUrl = imageStorageUrl.replace(/-small\.\w{3}|-medium\.\w{3}|-large\.\w{3}/i, '');
  
    return caches.open(contentImgsCache).then(function(cache) {
      return cache.match(imageStorageUrl).then(function(response) {
        // if image is in cache, return it, else fetch from network, cache a clone, then return network response
        return response || fetch(request).then(function(networkResponse) {
          cache.put(imageStorageUrl, networkResponse.clone());
          return networkResponse;
        });
      });
    });
  }
