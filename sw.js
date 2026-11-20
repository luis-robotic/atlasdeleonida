// Funciona sin conexión: guarda la página (todo va dentro de index.html). Cambia de versión en cada publicación.
const V = "atlas-202611200512";
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(["./", "index.html", "manifest.webmanifest"]))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
