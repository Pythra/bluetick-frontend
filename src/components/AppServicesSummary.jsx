import { useNavigate } from 'react-router-dom';
import Button from './Button';
import SectionHeader from './SectionHeader';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import appHeroImage from '../assets/app.png';
import { usePartnerAsset } from '../utils/partnerMedia';
import PartnerMediaFrame from './PartnerMediaFrame';
import ServiceSectionTitle from './ServiceSectionTitle';
import { usePartnerSectionContent } from '../utils/partnerSectionContent';
import './AppServicesSection.css';

function AppServicesSummary() {
  const navigate = useNavigate();
  const section = usePartnerSectionContent('appDevelopment');
  const { src: appImageSrc } = usePartnerAsset('appDevelopmentImage', appHeroImage);

  return (
    <section id="app-services" className="app-services-section app-services-summary services-summary-layout">
      <ServicesSummaryLayout
        copy={(
          <>
            <SectionHeader
              eyebrow={section.eyebrow}
              title={<ServiceSectionTitle section={section} />}
            />
            <p className="services-summary-intro">{section.intro}</p>
          </>
        )}
        media={(
          <div className="app-hero-shell">
            <PartnerMediaFrame
              src={appImageSrc}
              alt="App development services"
              className="app-hero-image-frame"
            />
            <div className="app-hero-overlay"></div>
            <div className="app-hero-content">
              <p className="app-hero-kicker">{section.heroKicker}</p>
              <h3>{section.heroTitle}</h3>
              <ul className="app-hero-types">
                {(section.bullets || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Button onClick={() => navigate('/services/apps')} className="bounce-btn app-hero-cta">
                Order Now
              </Button>
            </div>
          </div>
        )}
      />
    </section>
  );
}

export default AppServicesSummary;
