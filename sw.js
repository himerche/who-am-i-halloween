// Con conexión: siempre la última versión. Sin conexión: la copia guardada.
const CACHE = "whoami-d9996b99ff";
const FILES = ["./", "apple-touch-icon.png", "carta.css", "carta.js", "datos.enc", "fonts.css", "fonts/f1.woff2", "fonts/f2.woff2", "fonts/f3.woff2", "fonts/f4.woff2", "fonts/f5.woff2", "fonts/f6.woff2", "fonts/f7.woff2", "fonts/f8.woff2", "fonts/f9.woff2", "icono-192.png", "icono-512-maskable.png", "icono-512.png", "index.html", "manifest.webmanifest"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE)
    .then(c => Promise.all(FILES.map(f => fetch(f, { cache: "reload" }).then(r => c.put(f, r)))))
    .then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  if (new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request, { cache: "no-cache" })
      .then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
