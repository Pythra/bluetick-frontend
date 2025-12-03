import moonImage from '../assets/Moon.svg';
import './AppServicesSection.css';

function AppServicesSection() {
  return (
    <section id="app-services" className="app-services-section" style={{ backgroundImage: `url("${moonImage}")`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
    </section>
  );
}

export default AppServicesSection;


