// Minimal service worker — no caching, standalone PWA shell only.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key)))),
  );
  self.clients.claim();
});

// Web Push notification handler
self.addEventListener("push", (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    return;
  }

  const { title, body, url } = payload;

  event.waitUntil(
    self.registration.showNotification(title || "Oggi a Ortona", {
      body: body || "",
      icon: "/icon-192.png",
      badge: "/icon-192.png",
      data: { url: url || "/admin" },
    }),
  );
});

// Open admin panel on notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/admin";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    }),
  );
});
