/* GLOW Class service worker — KG-APP-BASE v1.0 §4.
 * Screens (html · js · css) are NETWORK FIRST, so a phone never stays pinned on an old version
 * (the reason this app had no worker before). Pictures and video are cache first. Offline, the
 * last screen that loaded still opens. A new version waits until the reader taps "Update now".
 * Recorded voice (.mp3, the intro's narration) is cache first too; the player asks for byte ranges,
 * so ranges are cut from the cached whole file (206), which Safari needs. */
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

const isMedia = (url) => /\.(?:jpe?g|png|webp|gif|svg|mp4|webm|woff2?|mp3)$/i.test(url.pathname);
const isAudio = (url) => /\.mp3$/i.test(url.pathname);

/** The whole audio file from the cache (fetched and kept on first use), then the range asked for. */
async function audioResponse(request) {
  const cache = await caches.open(MEDIA);
  let whole = await cache.match(request.url);
  if (!whole) {
    const fresh = await fetch(request.url);
    if (!fresh.ok) return fresh;
    await cache.put(request.url, fresh.clone());
    whole = fresh;
  }
  const range = /^bytes=(\d*)-(\d*)$/.exec(request.headers.get('range') || '');
  if (!range) return whole;
  const body = await whole.arrayBuffer();
  const size = body.byteLength;
  let start = range[1] === '' ? size - Number(range[2] || 0) : Number(range[1]);
  let end = range[1] === '' || range[2] === '' ? size - 1 : Math.min(Number(range[2]), size - 1);
  start = Math.max(0, start);
  if (start > end || start >= size) {
    return new Response(null, { status: 416, headers: { 'content-range': `bytes */${size}` } });
  }
  return new Response(body.slice(start, end + 1), {
    status: 206,
    headers: {
      'content-type': whole.headers.get('content-type') || 'audio/mpeg',
      'content-range': `bytes ${start}-${end}/${size}`,
      'content-length': String(end - start + 1),
      'accept-ranges': 'bytes',
    },
  });
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  // API answers (the owner's report above all) are never cached on the phone.
  if (url.origin !== self.location.origin || url.pathname.startsWith('/.netlify/') || url.pathname.startsWith('/api/')) return;
  if (isAudio(url)) {
    event.respondWith(audioResponse(request));
    return;
  }
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
