import { useMemo } from 'react';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';

export function resolvePartnerPackagePrice(packageId, defaultPrice, packagePricing) {
  if (!packageId || defaultPrice == null) return defaultPrice;
  const stored = packagePricing?.[packageId];
  if (!stored?.sellingPriceNgn) return defaultPrice;
  return stored.sellingPriceNgn;
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
