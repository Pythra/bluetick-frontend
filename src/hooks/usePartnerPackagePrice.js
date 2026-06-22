import { useMemo } from 'react';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';

export function resolvePartnerPackagePrice(packageId, defaultPrice, packagePricing) {
  if (!packageId || defaultPrice == null) return defaultPrice;
  if (!packagePricing || !Object.prototype.hasOwnProperty.call(packagePricing, packageId)) {
    return defaultPrice;
  }
  const stored = packagePricing[packageId];
  const selling = Number(stored?.sellingPriceNgn);
  if (Number.isFinite(selling) && selling > 0) {
    return selling;
  }
  return defaultPrice;
}

export function usePartnerPackagePrice(packageId, defaultPrice) {
  const { isPartnerSite, packagePricing } = usePartnerBranding();
  return useMemo(() => {
    if (!isPartnerSite) return defaultPrice;
    return resolvePartnerPackagePrice(packageId, defaultPrice, packagePricing);
  }, [isPartnerSite, packageId, defaultPrice, packagePricing]);
}

export function useResolvedServiceItem(item) {
  const price = usePartnerPackagePrice(item.packageId, item.price);
  return { ...item, price };
}
