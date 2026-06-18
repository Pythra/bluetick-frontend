import { useNavigate } from 'react-router-dom';
import Button from './Button';
import SectionHeader from './SectionHeader';
import ServicesSummaryLayout from './ServicesSummaryLayout';
import websiteHeroImage from '../assets/tech.jpg';
import { usePartnerAsset } from '../utils/partnerMedia';
import PartnerMediaFrame from './PartnerMediaFrame';
import { ServiceSectionTitle, usePartnerSectionContent } from '../utils/partnerSectionContent';
import './WebsiteServicesSection.css';

function WebsiteServicesSummary() {
  const navigate = useNavigate();
  const section = usePartnerSectionContent('websiteDevelopment');
  const { src: websiteImageSrc } = usePartnerAsset('websiteServicesImage', websiteHeroImage);

  return (
    <section id="website-services" className="website-services-section website-services-summary services-summary-layout">
      <ServicesSummaryLayout
        reverse
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
          <div className="website-hero-shell">
            <PartnerMediaFrame
              src={websiteImageSrc}
              alt="Website development services"
              className="website-hero-image-frame"
            />
            <div className="website-hero-overlay"></div>
            <div className="website-hero-content">
              <p className="website-hero-kicker">{section.heroKicker}</p>
              <h3>{section.heroTitle}</h3>
              <ul className="website-hero-types">
                {(section.bullets || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Button onClick={() => navigate('/services/websites')} className="bounce-btn website-hero-cta">
                Order Now
              </Button>
            </div>
          </div>
        )}
      />
    </section>
  );
}

export default WebsiteServicesSummary;
