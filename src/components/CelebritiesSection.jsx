import donjazzImage from '../assets/donjazz.jpeg';
import blordImage from '../assets/blord.jpg';
import eniolaImage from '../assets/eniola.jpg';
import sandraImage from '../assets/sandra.jpg';
import clintianooImage from '../assets/clintianoo.jpg';
import reekadoImage from '../assets/reekado.jpg';
import skibiiImage from '../assets/skibii.jpg';
import kenzyImage from '../assets/kenzy.jpg';
import oxladeImage from '../assets/oxlade.jpg';
import joblaqImage from '../assets/joblaq.jpg';
import mayorkunImage from '../assets/mayorkun.jpg';
import './CelebritiesSection.css';

function CelebritiesSection() {
  const celebrities = [
    { name: 'Don Jazzy', image: donjazzImage },
    { name: 'Blord', image: blordImage },
    { name: 'Eniola', image: eniolaImage },
    { name: 'Sandra', image: sandraImage },
    { name: 'Clintianoo', image: clintianooImage },
    { name: 'Reekado', image: reekadoImage },
    { name: 'Skibii', image: skibiiImage },
    { name: 'Kenzy', image: kenzyImage },
    { name: 'Oxlade', image: oxladeImage },
    { name: 'Joblaq', image: joblaqImage },
    { name: 'Mayorkun', image: mayorkunImage },
  ];

  return (
    <section className="celebrities-section">
      <div className="container">
        <h2 className="celebrities-title">Notable celebrities we've worked with</h2>
        <div className="celebrities-grid">
          {celebrities.map((celebrity, index) => (
            <div key={index} className="celebrity-card">
              <div className="celebrity-image-wrapper">
                <img 
                  src={celebrity.image} 
                  alt={celebrity.name} 
                  className="celebrity-image"
                />
              </div>
              <h3 className="celebrity-name">{celebrity.name}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CelebritiesSection;

