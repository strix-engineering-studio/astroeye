const CACHE_NAME = "strix-pwa-v1"
const CORE_ROUTES = ["/", "/about", "/services", "/work", "/blog", "/contact", "/project-inquiry", "/capabilities", "/uses"]
const CORE_ASSETS = ["/manifest.webmanifest", "/icon", "/apple-icon", "/strix.svg", "/offline.html"]

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME)
      await cache.addAll([...CORE_ROUTES, ...CORE_ASSETS])
      self.skipWaiting()
    })()
  )
})

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheKeys = await caches.keys()
      await Promise.all(cacheKeys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      await self.clients.claim()
    })()
  )
})

function isAssetRequest(request) {
  const url = new URL(request.url)
  return url.pathname.startsWith("/_next/") || /\.(?:js|css|png|jpg|jpeg|gif|webp|svg|ico|avif|woff2?)$/i.test(url.pathname)
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME)
  const cached = await cache.match(request)
  if (cached) {
    return cached
  }

  const response = await fetch(request)
  if (response.ok) {
    cache.put(request, response.clone())
  }
  return response
}

self.addEventListener("fetch", (event) => {
  const { request } = event

  if (request.method !== "GET") {
    return
  }

  const url = new URL(request.url)
  if (url.origin !== self.location.origin) {
    return
  }

  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request)
          const cache = await caches.open(CACHE_NAME)
          cache.put(request, networkResponse.clone())
          return networkResponse
        } catch {
          const cache = await caches.open(CACHE_NAME)
          return (await cache.match(request)) || (await cache.match("/offline.html")) || Response.error()
        }
      })()
    )
    return
  }

  if (isAssetRequest(request)) {
    event.respondWith(cacheFirst(request))
    return
  }

  event.respondWith(
    (async () => {
      try {
        const response = await fetch(request)
        if (response.ok) {
          const cache = await caches.open(CACHE_NAME)
          cache.put(request, response.clone())
        }
        return response
      } catch {
        return (await caches.match(request)) || Response.error()
      }
    })()
  )
})