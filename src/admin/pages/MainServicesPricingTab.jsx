import { useState } from 'react';
import PartnerServicesTab from '../partner/PartnerServicesTab';
import MainHomepageMediaSection from '../components/MainHomepageMediaSection';
import { useMainAdminPricingApi } from '../mainAdminPricingApi';

const VIEWS = {
  pricing: 'pricing',
  backgrounds: 'backgrounds',
  carousel: 'carousel',
  categoryLogos: 'category-logos',
};

export default function MainServicesPricingTab({ apiUrl, adminToken, onMessage }) {
  const api = useMainAdminPricingApi(apiUrl, adminToken);
  const [view, setView] = useState(VIEWS.pricing);

  if (!api) {
    return null;
  }

  return (
    <div className="pdash-panel pdash-main-services">
      <div className="adm-panel-head-row">
        <div>
          <h2 className="adm-panel-title">Services</h2>
          <p className="pdash-panel-lead">
            Manage main-site package pricing, homepage service backgrounds, publication logos, and
            publication category logos.
          </p>
        </div>
        <div className="adm-btn-group adm-btn-group-wrap">
          <button
            type="button"
            className={`adm-btn ${view === VIEWS.pricing ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
            onClick={() => setView(VIEWS.pricing)}
          >
            Pricing
          </button>
          <button
            type="button"
            className={`adm-btn ${view === VIEWS.backgrounds ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
            onClick={() => setView(VIEWS.backgrounds)}
          >
            Service backgrounds
          </button>
          <button
            type="button"
            className={`adm-btn ${view === VIEWS.carousel ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
            onClick={() => setView(VIEWS.carousel)}
          >
            Publication logos
          </button>
          <button
            type="button"
            className={`adm-btn ${view === VIEWS.categoryLogos ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
            onClick={() => setView(VIEWS.categoryLogos)}
          >
            Publication category logos
          </button>
        </div>
      </div>

      {view === VIEWS.pricing ? (
        <PartnerServicesTab api={api} onMessage={onMessage} pricingMode="main" embedded />
      ) : (
        <MainHomepageMediaSection
          apiUrl={apiUrl}
          adminToken={adminToken}
          view={view}
          hideHeader
        />
      )}
    </div>
  );
}
