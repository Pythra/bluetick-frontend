import PartnerServicesTab from '../partner/PartnerServicesTab';
import { useMainAdminPricingApi } from '../mainAdminPricingApi';

export default function MainServicesPricingTab({ apiUrl, adminToken, onMessage }) {
  const api = useMainAdminPricingApi(apiUrl, adminToken);

  if (!api) {
    return null;
  }

  return (
    <PartnerServicesTab
      api={api}
      onMessage={onMessage}
      pricingMode="main"
    />
  );
}
