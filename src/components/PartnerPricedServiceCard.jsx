import ServiceDetailCard from './ServiceDetailCard';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePartnerPackagePrice } from '../hooks/usePartnerPackagePrice';
import { formatDeliveryMeta } from '../utils/serviceDeliveryMeta';

export default function PartnerPricedServiceCard({
  service,
  onAddToCart,
  priceSuffix = '',
  meta,
  ...props
}) {
  const { format } = useCurrency();
  const price = usePartnerPackagePrice(service?.packageId, service?.price);

  const handleAdd = () => {
    onAddToCart?.({
      ...service,
      price: format(price),
      priceValue: price,
    });
  };

  return (
    <ServiceDetailCard
      {...props}
      meta={formatDeliveryMeta(service, meta)}
      price={`${format(price)}${priceSuffix}`}
      onAddToCart={handleAdd}
    />
  );
}
