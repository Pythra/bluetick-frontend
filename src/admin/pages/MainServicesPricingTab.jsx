import { useState } from 'react';
import PartnerServicesTab from '../partner/PartnerServicesTab';
import MainHomepageMediaSection from '../components/MainHomepageMediaSection';
import { useMainAdminPricingApi } from '../mainAdminPricingApi';

const VIEWS = {
  pricing: 'pricing',
  videos: 'videos',
  backgrounds: 'backgrounds',
  partnerSection: 'partner-section',
  clientLogos: 'client-logos',
  celebrityLogos: 'celebrity-logos',
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
      <nav className="adm-services-tabs" aria-label="Services sections">
        <button
          type="button"
          className={`adm-services-tab${view === VIEWS.pricing ? ' is-active' : ''}`}
          onClick={() => setView(VIEWS.pricing)}
        >
          Pricing
        </button>
        <button
          type="button"
          className={`adm-services-tab${view === VIEWS.videos ? ' is-active' : ''}`}
          onClick={() => setView(VIEWS.videos)}
        >
          Hero videos
        </button>
        <button
          type="button"
          className={`adm-services-tab${view === VIEWS.backgrounds ? ' is-active' : ''}`}
          onClick={() => setView(VIEWS.backgrounds)}
        >
          Service backgrounds
        </button>
        <button
          type="button"
          className={`adm-services-tab${view === VIEWS.partnerSection ? ' is-active' : ''}`}
          onClick={() => setView(VIEWS.partnerSection)}
        >
          Partner section
        </button>
        <button
          type="button"
          className={`adm-services-tab${view === VIEWS.celebrityLogos ? ' is-active' : ''}`}
          onClick={() => setView(VIEWS.celebrityLogos)}
        >
          Celebrity photos
        </button>
        <button
          type="button"
          className={`adm-services-tab${view === VIEWS.clientLogos ? ' is-active' : ''}`}
          onClick={() => setView(VIEWS.clientLogos)}
        >
          Client logos
        </button>
        <button
          type="button"
          className={`adm-services-tab${view === VIEWS.carousel ? ' is-active' : ''}`}
          onClick={() => setView(VIEWS.carousel)}
        >
          Publication logos
        </button>
        <button
          type="button"
          className={`adm-services-tab${view === VIEWS.categoryLogos ? ' is-active' : ''}`}
          onClick={() => setView(VIEWS.categoryLogos)}
        >
          Publication category logos
        </button>
      </nav>

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
