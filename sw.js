const CACHE_NAME = "mirachange-cache-v1";

// 1. mode hors-ligne
const ASSETS = ["/", "/index.html", "/style.css", "/app.js", "/manifest.json"];

// 2. Installation
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Cache ouvert");
      return cache.addAll(ASSETS);
    }),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            (networkResponse.type !== "basic" &&
              networkResponse.type !== "cors")
          ) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            // On stocke le nouveau taux de change
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          console.log("Mode hors ligne.");
        });
    }),
  );
});
