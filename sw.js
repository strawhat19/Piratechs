const CACHE_NAME = `piratechs-static-v5`;
const APP_SHELL = [
  `./`,
  `./index.html`,
  `./about.html`,
  `./projects.html`,
  `./services.html`,
  `./store.html`,
  `./features.html`,
  `./gallery.html`,
  `./contact.html`,
  `./styles/main.css`,
  `./scripts/site.config.js`,
  `./scripts/app.js`,
  `./manifest.webmanifest`,
  `./public/icon-192x192.png`,
  `./public/assets/piratechs/svg/Piratechs-Icon-White.svg`,
  `./public/assets/piratechs/svg/Piratechs-Icon-Navy.svg`
];

self.addEventListener(`install`, event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener(`activate`, event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key !== CACHE_NAME)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener(`fetch`, event => {
  if (event.request.method !== `GET`) return;

  event.respondWith(
    caches.match(event.request)
      .then(cached => cached || fetch(event.request)
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(`./index.html`)))
  );
});
