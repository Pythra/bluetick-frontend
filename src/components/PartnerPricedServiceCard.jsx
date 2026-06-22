import ServiceDetailCard from './ServiceDetailCard';
import { useCurrency } from '../contexts/CurrencyContext';
import { usePartnerPackagePrice } from '../hooks/usePartnerPackagePrice';

export default function PartnerPricedServiceCard({
  service,
  onAddToCart,
  priceSuffix = '',
  ...props
}) {
  const { format } = useCurrency();
  const price = usePartnerPackagePrice(service?.packageId, service?.price);

  const handleAdd = () => {
    onAddToCart?.({
      ...service,
      price,
    });
  };

  return (
    <ServiceDetailCard
      {...props}
      price={`${format(price)}${priceSuffix}`}
      onAddToCart={handleAdd}
    />
  );
}
