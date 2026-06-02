self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (error) {
    data = {};
  }

  const title = data.title || 'Bluetickgeng';
  const options = {
    body: data.body || 'A new update is available.',
    icon: data.icon || '/favicon.svg',
    image: data.image || undefined,
    badge: data.icon || '/favicon.svg',
    data: {
      url: data.url || '/',
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      const matchingClient = windowClients.find((client) => client.url.includes(targetUrl));
      if (matchingClient) {
        return matchingClient.focus();
      }
      return clients.openWindow(targetUrl);
    })
  );
});
