/* GLOW Class service worker — KG-APP-BASE v1.0 §4.
 * Screens (html · js · css) are NETWORK FIRST, so a phone never stays pinned on an old version
 * (the reason this app had no worker before). Pictures and video are cache first. Offline, the
 * last screen that loaded still opens. A new version waits until the reader taps "Update now". */
const VERSION = 'glow-sw-v1';
const SCREENS = `${VERSION}-screens`;
const MEDIA = `${VERSION}-media`;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SCREENS).then((cache) => cache.add('./')).catch(() => undefined));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

const isMedia = (url) => /\.(?:jpe?g|png|webp|gif|svg|mp4|webm|woff2?)$/i.test(url.pathname);

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // Live answers (the Like count) are never cached: offline they should fail, not show an old number.
  if (url.origin !== self.location.origin || url.pathname.startsWith('/.netlify/') || url.pathname.startsWith('/api/')) return;
  // Video is streamed with range requests; let the browser handle those directly.
  if (request.headers.has('range')) return;

  if (isMedia(url)) {
    event.respondWith(
      caches.match(request).then(
        (hit) =>
          hit ||
          fetch(request).then((response) => {
            if (response.ok) {
              const copy = response.clone();
              caches.open(MEDIA).then((cache) => cache.put(request, copy));
            }
            return response;
          }),
      ),
    );
    return;
  }

  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const copy = response.clone();
          caches.open(SCREENS).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() =>
        caches.match(request).then((hit) => hit || (request.mode === 'navigate' ? caches.match('./') : undefined)),
      ),
  );
});
