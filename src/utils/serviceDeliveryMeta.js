export function formatDeliveryMeta(service, fallback = '') {
  const delivery = service?.delivery || service?.deliveryTime;
  if (!delivery) return fallback;

  const base = `Delivery: ${delivery}`;
  if (service?.note) {
    return `${base} · ${service.note}`;
  }
  return base;
}
