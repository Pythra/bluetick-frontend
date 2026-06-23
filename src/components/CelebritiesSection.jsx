import SectionHeader from './SectionHeader';
import { usePartnerBranding } from '../contexts/PartnerBrandingContext';
import { useMainSiteMedia } from '../contexts/MainSiteMediaContext';
import { DEFAULT_CELEBRITIES, mapCelebrityEntries } from '../data/defaultCelebrities';
import './CelebritiesSection.css';

function CelebrityMarqueeRow({ items, direction }) {
  if (!items.length) return null;

  const duplicatedItems = [...items, ...items];

  return (
    <div className="celebrities-marquee-viewport">
      <div
        className={`celebrities-marquee-track celebrities-marquee-track--${direction}`}
        aria-hidden={false}
      >
        {duplicatedItems.map((celebrity, index) => (
          <article
            key={`${celebrity.id || celebrity.name}-${index}`}
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
  const { isPartnerSite } = usePartnerBranding();
  const { getCelebrityLogos } = useMainSiteMedia();
  const configured = isPartnerSite ? [] : mapCelebrityEntries(getCelebrityLogos());
  const celebrities = configured.length ? configured : DEFAULT_CELEBRITIES;

  const rowSplitIndex = Math.ceil(celebrities.length / 2);
  const topRowCelebrities = celebrities.slice(0, rowSplitIndex);
  const bottomRowCelebrities = celebrities.slice(rowSplitIndex);

  if (!celebrities.length) {
    return null;
  }

  return (
    <section className="celebrities-section" aria-label="Celebrities we have worked with">
      <div className="container">
        <SectionHeader
          title={(
            <>
              <span className="services-summary-title-black">NOTABLE CELEBRITIES</span>
              <span className="services-summary-title-blue">WE&apos;VE WORKED WITH</span>
            </>
          )}
        />

        <div className="celebrities-marquee-rows">
          <CelebrityMarqueeRow items={topRowCelebrities} direction="right" />
          <CelebrityMarqueeRow items={bottomRowCelebrities} direction="left" />
        </div>
      </div>
    </section>
  );
}

export default CelebritiesSection;
