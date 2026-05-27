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
import SectionHeader from './SectionHeader';
import './CelebritiesSection.css';

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

const rowSplitIndex = Math.ceil(celebrities.length / 2);
const topRowCelebrities = celebrities.slice(0, rowSplitIndex);
const bottomRowCelebrities = celebrities.slice(rowSplitIndex);

function CelebrityMarqueeRow({ items, direction }) {
  const duplicatedItems = [...items, ...items];

  return (
    <div className="celebrities-marquee-viewport">
      <div
        className={`celebrities-marquee-track celebrities-marquee-track--${direction}`}
        aria-hidden={false}
      >
        {duplicatedItems.map((celebrity, index) => (
          <article
            key={`${celebrity.name}-${index}`}
            className="celebrity-marquee-item"
            aria-hidden={index >= items.length}
          >
            <img
              src={celebrity.image}
              alt={celebrity.name}
              className="celebrity-marquee-image"
              loading="lazy"
            />
            <p className="celebrity-marquee-name">{celebrity.name}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function CelebritiesSection() {
  return (
    <section className="celebrities-section" aria-label="Celebrities we have worked with">
      <div className="container">
        <SectionHeader
          title={(
            <>
              <span className="services-summary-title-black">NOTABLE CELEBRITIES</span>{' '}
              <span className="services-summary-title-blue">WE&apos;VE WORKED WITH</span>
            </>
          )}
        />
        <p className="celebrities-section-intro">
          A few of the artists and creators we have partnered with.
        </p>

        <div className="celebrities-marquee-rows">
          <CelebrityMarqueeRow items={topRowCelebrities} direction="right" />
          <CelebrityMarqueeRow items={bottomRowCelebrities} direction="left" />
        </div>
      </div>
    </section>
  );
}

export default CelebritiesSection;
