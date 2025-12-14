const CACHE_NAME = "photo-watermark-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./service-worker.js",
  "./assets/icon.png",
  "./assets/checkmark.png",
  "./assets/BigShouldersText-Medium.ttf",
  "./assets/Roboto-Regular.ttf",
  "./assets/RobotoCondensed-Regular.ttf",
  "./assets/Roboto-Medium.ttf"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      // Optional: return fallback if offline and request not in cache
      if (event.request.mode === "navigate") {
        return caches.match("index.html");
      }
    })
  );
});
