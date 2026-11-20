// Funciona sin conexión: guarda la página y el mapa base. Cambia de versión en cada publicación.
const V = "atlas-202611201925";
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(["./", "index.html", "manifest.webmanifest", "assets/leonida-dia.ace46761.svg"]))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k))))); self.clients.claim(); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  // archivos con huella en el nombre (assets/leonida-dia.1a2b3c4d.svg): primero caché, nunca cambian
  if (/\.[0-9a-f]{8}\.svg$/.test(e.request.url)) { e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(n => { const c = n.clone(); caches.open(V).then(x => x.put(e.request, c)); return n; }))); return; }
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(V).then(x => x.put(e.request, c)); return r; }).catch(() => caches.match(e.request).then(r => r || caches.match("index.html"))));
});
