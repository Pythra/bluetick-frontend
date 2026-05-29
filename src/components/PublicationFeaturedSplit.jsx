import { useState } from 'react';
import { IoChevronDown } from 'react-icons/io5';
import asSeenOnGraphic from '../assets/publication-as-seen-on.png';

const publicationFeaturedReasons = [
  {
    id: 'authority',
    title: '"As Seen On" Authority & Credibility',
    body: (
      <>
        Gain the prestige of being featured on major media platforms, including top Nigerian news
        sites like{' '}
        <strong>
          Punch, The Guardian, Forbes Africa, Business Day, ThisDay, Vanguard, The Nation,
          Leadership, Crest Africa
        </strong>{' '}
        and more, plus respected international media.
      </>
    ),
  },
  {
    id: 'guaranteed',
    title: 'Guaranteed Publication on Local & International News Platforms',
    body: (
      <>
        We place your story on vetted Nigerian dailies, African outlets, tech press, and tier-one
        global publications — with editorial review and confirmed live links, not anonymous wire
        dumps.
      </>
    ),
  },
  {
    id: 'links',
    title: 'Official Publication Links',
    body: (
      <>
        Every campaign includes shareable URLs you can add to your website, pitch decks, investor
        updates, and social profiles — real proof prospects can click and verify.
      </>
    ),
  },
  {
    id: 'visibility',
    title: 'Increased Visibility & Website Traffic',
    body: (
      <>
        News features put your brand in front of readers who already trust the outlet — driving
        qualified visits to your site, product pages, and campaigns.
      </>
    ),
  },
  {
    id: 'seo',
    title: 'SEO Power & Google Indexing',
    body: (
      <>
        Backlinks from high-authority news domains strengthen your search presence and help Google
        surface your brand for relevant queries over time.
      </>
    ),
  },
  {
    id: 'trust',
    title: 'Investor & Partner Confidence',
    body: (
      <>
        Press coverage signals legitimacy to investors, banks, and enterprise buyers evaluating
        whether your business is established, serious, and worth their time.
      </>
    ),
  },
  {
    id: 'sales',
    title: 'Sales & Marketing Leverage',
    body: (
      <>
        &ldquo;As seen on&rdquo; badges and media mentions give your sales and marketing teams
        social proof that shortens cycles, lifts conversions, and sets you apart from competitors.
      </>
    ),
  },
];

function PublicationFeaturedSplit() {
  const [openId, setOpenId] = useState(publicationFeaturedReasons[0].id);

  const toggleReason = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="publication-feature-split" aria-labelledby="publication-featured-reasons-title">
      <div className="container publication-feature-split-grid">
        <div className="publication-as-seen-visual">
          <img
            src={asSeenOnGraphic}
            alt="As seen on Pulse, Business Insider, Punch, Vanguard, Premium Times, Business Day, Yahoo Finance, AP, and more"
            className="publication-as-seen-image"
            loading="lazy"
          />
        </div>

        <div className="publication-reasons">
          <h2 id="publication-featured-reasons-title" className="publication-reasons-title">
            7 Reasons To Get Your Brand Featured
          </h2>
          <div className="publication-reasons-accordion">
            {publicationFeaturedReasons.map((reason, index) => {
              const isOpen = openId === reason.id;
              const panelId = `publication-reason-panel-${reason.id}`;
              const triggerId = `publication-reason-trigger-${reason.id}`;

              return (
                <div
                  key={reason.id}
                  className={`publication-reason-item ${isOpen ? 'is-open' : ''}`}
                >
                  <button
                    type="button"
                    id={triggerId}
                    className="publication-reason-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleReason(reason.id)}
                  >
                    <span className="publication-reason-trigger-label">
                      {index + 1}. {reason.title}
                    </span>
                    <span className="publication-reason-chevron" aria-hidden="true">
                      <IoChevronDown />
                    </span>
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className="publication-reason-panel"
                    hidden={!isOpen}
                  >
                    <p>{reason.body}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default PublicationFeaturedSplit;
