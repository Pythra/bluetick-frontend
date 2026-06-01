const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; i += 1) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

const registerServiceWorker = async () => {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service workers are not supported by this browser.');
  }
  return navigator.serviceWorker.register('/push-sw.js');
};

export const subscribeToPushNotifications = async (apiUrl) => {
  if (!('Notification' in window)) {
    throw new Error('Notifications are not supported by this browser.');
  }

  const permission = await Notification.requestPermission();
  if (permission !== 'granted') {
    throw new Error('Notification permission was not granted.');
  }

  const keyResponse = await fetch(`${apiUrl}/api/notifications/public-key`);
  const keyData = await keyResponse.json();
  if (!keyResponse.ok || !keyData.success || !keyData.publicKey) {
    throw new Error(keyData.error || 'Push notifications are not available right now.');
  }

  const registration = await registerServiceWorker();
  const existingSubscription = await registration.pushManager.getSubscription();
  const subscription =
    existingSubscription ||
    (await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(keyData.publicKey),
    }));

  const saveResponse = await fetch(`${apiUrl}/api/notifications/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ subscription }),
  });
  const saveData = await saveResponse.json();
  if (!saveResponse.ok || !saveData.success) {
    throw new Error(saveData.error || 'Unable to save push subscription.');
  }

  return subscription;
};

export const unsubscribeFromPushNotifications = async (apiUrl) => {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const registration = await navigator.serviceWorker.ready;
  const subscription = await registration.pushManager.getSubscription();
  if (!subscription) {
    return;
  }

  await fetch(`${apiUrl}/api/notifications/unsubscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ endpoint: subscription.endpoint }),
  });

  await subscription.unsubscribe();
};
