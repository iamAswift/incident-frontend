// public/service-worker.js

const CACHE_NAME = "watchradar-cache-v1";
const STATIC_ASSETS = [
  "/",                    // index.html
  "/favicon.ico",
  "/watchradar.svg",      // your app logo
  "/manifest.json",
  "/robots.txt",
  "/_redirects",
  "/static/js/bundle.js", // adjust based on your build output
  "/static/js/main.js",
  "/static/css/main.css",
];

// ----- Install -----
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// ----- Activate -----
self.addEventListener("activate", (event) => {
  console.log("Service Worker activated.");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ----- Fetch -----
self.addEventListener("fetch", (event) => {
  const url = event.request.url;

  // Bypass SW for backend requests to avoid CORS issues
  if (url.startsWith("https://incident-backend-8yb5.onrender.com")) {
    return;
  }

  // Handle other requests (static assets) with cache-first strategy
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        return cached;
      }
      return fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          // Optional: fallback page/image for offline
          return caches.match("/");
        });
    })
  );
});