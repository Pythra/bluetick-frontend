import PartnerServicesTab from '../partner/PartnerServicesTab';
import MainHomepageMediaSection from '../components/MainHomepageMediaSection';
import { useMainAdminPricingApi } from '../mainAdminPricingApi';

export default function MainServicesPricingTab({ apiUrl, adminToken, onMessage }) {
  const api = useMainAdminPricingApi(apiUrl, adminToken);

  if (!api) {
    return null;
  }

  return (
    <>
      <MainHomepageMediaSection apiUrl={apiUrl} adminToken={adminToken} />
      <PartnerServicesTab api={api} onMessage={onMessage} pricingMode="main" />
    </>
  );
}
