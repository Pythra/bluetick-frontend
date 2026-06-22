export function buildPartnerCartItem(service, { title, description, category, tier, price, formatPrice }) {
  const resolvedPrice = price ?? service.priceValue ?? service.price;
  const formattedPrice =
    typeof resolvedPrice === 'number'
      ? (formatPrice ? formatPrice(resolvedPrice) : String(resolvedPrice))
      : resolvedPrice;

  return {
    itemId: service.packageId || service.id || `${service.title}-${tier || 'item'}`,
    packageId: service.packageId || service.id,
    title: title || service.title,
    price: formattedPrice,
    priceValue: typeof resolvedPrice === 'number' ? resolvedPrice : undefined,
    description: description || '',
    category,
    quantity: 1,
  };
}
