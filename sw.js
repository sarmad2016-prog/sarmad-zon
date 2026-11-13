const CACHE_NAME = "sarmad-zone-v5";
const APP_SCOPE = new URL(self.registration.scope);
const APP_FILES = [
  "./library/",
  "./cv/",
  "./games/",
  "./s.scaner/",
  "./s.scaner/index.html",
  "./s.scaner/manifest.webmanifest",
  "./manifest.webmanifest",
  "./cv/manifest.webmanifest",
  "./games/manifest.webmanifest",
  "./install-prompt.js",
  "./zone-icon.svg",
  "./cv/cv-icon.svg",
  "./games/games-icon.svg"
].map(path => new URL(path, APP_SCOPE).href);

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== APP_SCOPE.origin ||
      !url.pathname.startsWith(APP_SCOPE.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then(response => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      }).catch(async () => {
        const cached = await caches.match(request);
        return cached || caches.match(new URL("./library/", APP_SCOPE).href);
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      const fresh = fetch(request).then(response => {
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return response;
      }).catch(() => cached);
      return cached || fresh;
    })
  );
});