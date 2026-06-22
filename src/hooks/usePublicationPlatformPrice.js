import { useMemo } from 'react';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { useCurrency } from '../contexts/CurrencyContext';
import { resolvePublicationPlatformPrice } from '../utils/publicationPricing';

export function usePublicationPlatformPrice(categoryId, platformName, priceValue, packageId) {
  const { isPartnerSite, packagePricing } = usePartnerBranding();
  return useMemo(
    () =>
      resolvePublicationPlatformPrice({
        categoryId,
        platformName,
        priceValue,
        packageId,
        packagePricing,
        isPartnerSite,
      }),
    [categoryId, platformName, priceValue, packageId, packagePricing, isPartnerSite]
  );
}

export function useFormattedPublicationPlatformPrice(categoryId, platformName, priceValue, packageId) {
  const { format } = useCurrency();
  const { priceValue: resolved } = usePublicationPlatformPrice(
    categoryId,
    platformName,
    priceValue,
    packageId
  );
  return useMemo(() => format(resolved), [format, resolved]);
}
