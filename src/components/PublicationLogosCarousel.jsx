import punchLogo from '../assets/punch.png';
import guardianLogo from '../assets/guardian.png';
import businessDayLogo from '../assets/platforms/buisnessday.png';
import cableLogo from '../assets/platforms/cable.jpg';
import dailyPostLogo from '../assets/platforms/dailypost.jpg';
import nairametricsLogo from '../assets/platforms/nairametrics.png';
import techCabalLogo from '../assets/platforms/techcabal.png';
import vanguardLogo from '../assets/platforms/Vanguard.png';
import './PublicationLogosCarousel.css';

function PublicationLogosCarousel({ title = 'Our Partners', className = '' }) {
  const logos = [
    { name: 'Punch', image: punchLogo },
    { name: 'Guardian', image: guardianLogo },
    { name: 'BusinessDay', image: businessDayLogo },
    { name: 'The Cable', image: cableLogo },
    { name: 'Daily Post', image: dailyPostLogo },
    { name: 'Nairametrics', image: nairametricsLogo },
    { name: 'TechCabal', image: techCabalLogo },
    { name: 'Vanguard', image: vanguardLogo },
  ];

  // Duplicate logos for seamless loop
  const duplicatedLogos = [...logos, ...logos];

  return (
    <section className={`publication-logos-section ${className}`.trim()}>
      <div className="publication-logos-container">
        {title && <h2 className="publication-logos-title">{title}</h2>}
        <div className="logos-carousel-wrapper">
          <div className="logos-carousel">
            {duplicatedLogos.map((logo, index) => (
              <div key={index} className="logo-item">
                <img 
                  src={logo.image} 
                  alt={logo.name} 
                  className="logo-image"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PublicationLogosCarousel;

