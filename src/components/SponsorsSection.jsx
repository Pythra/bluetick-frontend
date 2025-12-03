import circoImage from '../assets/circo.jpg';
import gulderImage from '../assets/gulder.jpg';
import mtnImage from '../assets/mtn.jpg';
import zenithImage from '../assets/zenith.jpg';
import leatherImage from '../assets/leatherback.jpg';
import lightImage from '../assets/light.jpg';
import indriveImage from '../assets/indrive.jpg';
import './SponsorsSection.css';

function SponsorsSection() {
  const sponsors = [
    { name: 'Circo', image: circoImage },
    { name: 'Gulder', image: gulderImage },
    { name: 'MTN', image: mtnImage },
    { name: 'Zenith', image: zenithImage },
    { name: 'Leatherback', image: leatherImage },
    { name: 'Light', image: lightImage },
    { name: 'Indrive', image: indriveImage },
  ];

  return (
    <section id="sponsors" className="sponsors-section">
      <div className="container">
        <h2 className="sponsors-title">Our Sponsors</h2>
        <div className="sponsors-grid">
          {sponsors.map((sponsor, index) => (
            <div key={index} className="sponsor-card">
              <img 
                src={sponsor.image} 
                alt={sponsor.name} 
                className="sponsor-image"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SponsorsSection;

