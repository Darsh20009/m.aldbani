// Cache version — bump this string on every deploy to force a cache wipe in all browsers
const CACHE = "maldbani-v2";

// Only pre-cache static assets that never change (no HTML — index.html must always come from network)
const PRECACHE = ["/manifest.json", "/logo-transparent.png", "/favicon.png", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/apple-touch-icon.png"];

// ── Install: pre-cache safe static assets ───────────────────────────────────
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then((c) => c.addAll(PRECACHE.map(u => new Request(u, { cache: "no-cache" }))))
      .catch(() => { /* non-critical — ignore pre-cache failures */ })
      .finally(() => self.skipWaiting())
  );
});

// ── Activate: wipe ALL old caches so stale chunks never survive a deploy ────
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: smart strategy per resource type ──────────────────────────────────
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;

  const url = new URL(e.request.url);

  // 1. API calls → always go to network, never cache
  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/uploads/")) return;

  // 2. HTML (index.html / SPA routes) → NETWORK FIRST, no caching
  //    This is critical: index.html must always be fresh so chunk hashes are current.
  if (e.request.headers.get("accept")?.includes("text/html") || url.pathname === "/") {
    e.respondWith(
      fetch(e.request, { cache: "no-cache" }).catch(() => {
        // Offline fallback: serve whatever we have cached
        return caches.match("/") || new Response("Offline", { status: 503 });
      })
    );
    return;
  }

  // 3. Hashed JS/CSS assets (/assets/name-HASH.js) → CACHE FIRST (safe: hash changes with content)
  if (url.pathname.startsWith("/assets/")) {
    e.respondWith(
      caches.match(e.request).then((cached) => {
        if (cached) return cached;
        return fetch(e.request).then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        });
      })
    );
    return;
  }

  // 4. Other static files (icons, manifest, images) → stale-while-revalidate
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const network = fetch(e.request).then((res) => {
        if (res.ok) caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
        return res;
      });
      return cached || network;
    })
  );
});
