export function buildPartnerCartItem(service, { title, description, category, tier, price }) {
  return {
    itemId: service.packageId || service.id || `${service.title}-${tier || 'item'}`,
    packageId: service.packageId || service.id,
    title: title || service.title,
    price: price ?? service.price,
    description: description || '',
    category,
    quantity: 1,
  };
}
