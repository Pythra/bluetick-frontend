const GENERIC_BLUETICK_PRODUCT_NAME = /^Bluetick services?\s*\(\d+\s+items?\)/i

function collectItemTitles(items = []) {
  return items
    .map((item) => (item?.title || item?.name || '').trim())
    .filter(Boolean)
}

export function getOrderServiceLabel(order) {
  const fromCart = collectItemTitles(order?.cartItems)
  if (fromCart.length > 0) {
    return fromCart.join(', ')
  }

  const fromMeta = collectItemTitles(order?.metadata?.cartItems)
  if (fromMeta.length > 0) {
    return fromMeta.join(', ')
  }

  const fromServices = collectItemTitles(order?.services)
  if (fromServices.length > 0) {
    return fromServices.join(', ')
  }

  const productName = (order?.productName || '').trim()
  if (productName && !GENERIC_BLUETICK_PRODUCT_NAME.test(productName)) {
    return productName
  }

  return productName || 'Service order'
}

export function orderMatchesServiceSearch(order, searchTerm) {
  const term = searchTerm.toLowerCase()
  return getOrderServiceLabel(order).toLowerCase().includes(term)
}
