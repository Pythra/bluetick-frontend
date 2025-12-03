import SectionHeader from './SectionHeader';
import './PublicationSection.css';

const packages = [
  {
    id: 1,
    title: 'Package 1',
    price: '$2,500',
    description: 'Publications on all major platforms plus over 10 news platforms',
    delivery: '2-7 days'
  },
  {
    id: 2,
    title: 'Package 2',
    price: '$300 per platform',
    description: 'Publications on individual platforms',
    delivery: '6 hours'
  },
  {
    id: 3,
    title: 'Package 3 - National Dailies (Nigerian Platforms)',
    price: 'Content writing: N20,000',
    description: 'Various publication types available',
    delivery: 'Varies',
    note: 'See Publication Types & Pricing below'
  },
  {
    id: 4,
    title: 'Package 4 - USA Newswire',
    price: '$400',
    description: 'Syndicated on 400+ US sites across all states. Includes FOX News affiliates. Full list of published links provided in Excel format',
    delivery: 'Varies'
  },
  {
    id: 5,
    title: 'Package 5 - Television Features',
    price: 'Contact for pricing',
    description: 'Interviews and TV features locally and internationally',
    delivery: 'More information available on request'
  },
  {
    id: 6,
    title: 'Package 6',
    price: '$550 each',
    description: 'Publication on individual international platforms',
    delivery: 'More information available on request'
  },
  {
    id: 7,
    title: 'Package 7',
    price: '$2,500',
    description: 'Multiple platform options: MSN ($1,000), Bloomberg ($700), 5 Google News Sites',
    delivery: 'Varies',
    bonus: 'Bonus: 3 platforms from Package 2'
  },
  {
    id: 8,
    title: 'Package 8 - African Authority Sites',
    price: 'Contact for pricing',
    description: 'Tech, Entertainment, and Lifestyle platforms',
    delivery: 'More information available on request'
  },
  {
    id: 9,
    title: 'Package 9 - Tech and Entertainment Platforms',
    price: '$2,400',
    description: 'Individual platform pricing: $200, $1,000, $200, $500, $300, $200, $200 (various platforms)',
    delivery: 'Varies',
    bonus: 'Bonus: 3 platforms from Package 2'
  },
  {
    id: 10,
    title: 'Package 10',
    price: '$1,200 / $1,200 / $600 / $300',
    description: 'Make a selection from available platforms',
    delivery: 'Varies'
  },
  {
    id: 11,
    title: 'Package 11',
    price: '$3,500',
    description: 'Publications on all platforms plus over 10 news platforms',
    delivery: '2-7 days'
  },
  {
    id: 12,
    title: 'Package 12',
    price: '$4,500',
    description: 'Different articles can be published on each news platform',
    delivery: 'Varies',
    bonus: 'Bonus: 3 platforms from Package 2'
  },
  {
    id: 13,
    title: 'Package 13 - Ghana Platforms',
    price: 'Contact for pricing',
    description: 'Featured placement on Ghana authority sites',
    delivery: 'More information available on request'
  },
  {
    id: 14,
    title: 'Package 14 - Uganda Platforms',
    price: '$2,200 per platform',
    description: 'Featured placement on Uganda authority sites',
    delivery: 'More information available on request'
  },
  {
    id: 15,
    title: 'Package 15 - Pulse Platforms',
    price: 'Contact for pricing',
    description: 'Featured placement on Pulse platforms across Africa',
    delivery: 'More information available on request'
  },
  {
    id: 16,
    title: 'Package 16 - Top UK Platforms',
    price: 'Contact for pricing',
    description: 'Featured placement on leading UK platforms',
    delivery: 'More information available on request'
  }
];

const publicationTypes = [
  {
    type: 'Interview Style',
    price: 'N40,000',
    details: '400-700 words, group/individual portrait'
  },
  {
    type: 'News Story',
    price: 'From N100,000',
    details: '400-500 words, self portrait, excludes Punch, Premium Times, BusinessDay, Vanguard'
  },
  {
    type: 'Opinion Piece',
    price: 'From N100,000',
    details: '400-500 words, self portrait, includes Punch, Premium Times, BusinessDay, Vanguard'
  },
  {
    type: 'Sponsored/Featured/Branded Article',
    price: 'From N100,000',
    details: '400-500 words, self portrait, includes backlinks/contact details and logo'
  },
  {
    type: 'Sponsored Articles on National Dailies',
    price: 'N130,000 - N700,000',
    details: 'Range varies by platform and requirements'
  }
];

function PublicationSection() {
  return (
    <section id="publication-services" className="publication-section">
      <div className="container">
        <SectionHeader
          title="PUBLICATION PACKAGES"
          subtitle="Comprehensive publication services across multiple platforms"
        />

        <div className="packages-grid">
          {packages.map((pkg) => (
            <div key={pkg.id} className="package-card">
              <div className="package-header">
                <h3 className="package-title">{pkg.title}</h3>
                <div className="package-price">{pkg.price}</div>
              </div>
              <p className="package-description">{pkg.description}</p>
              <div className="package-delivery">
                <span className="delivery-label">Delivery:</span>
                <span className="delivery-time">{pkg.delivery}</span>
              </div>
              {pkg.bonus && (
                <div className="package-bonus">
                  <span className="bonus-icon">🎁</span>
                  {pkg.bonus}
                </div>
              )}
              {pkg.note && (
                <div className="package-note">
                  <span className="note-icon">ℹ️</span>
                  {pkg.note}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="publication-types-section">
          <h3 className="types-title">PUBLICATION TYPES & PRICING</h3>
          <p className="types-subtitle">(Package 3 - National Dailies)</p>
          <div className="types-grid">
            {publicationTypes.map((pubType, index) => (
              <div key={index} className="type-card">
                <h4 className="type-name">{pubType.type}</h4>
                <div className="type-price">{pubType.price}</div>
                <p className="type-details">{pubType.details}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="policies-section">
          <h3 className="policies-title">IMPORTANT POLICIES</h3>
          
          <div className="policy-card">
            <h4 className="policy-card-title">Content Review Process</h4>
            <ul className="policy-list">
              <li><strong>Thorough Review:</strong> Clients must carefully review each article before approval</li>
              <li><strong>Accurate Submission:</strong> Double-check all information for correctness and completeness</li>
              <li><strong>Potential Editing:</strong> Editors may modify articles to fit platform standards (verbatim sharing or contact details inclusion available for additional fee)</li>
              <li><strong>Post-Publication:</strong> Once published, articles are difficult to remove or substantially edit</li>
            </ul>
          </div>

          <div className="policy-card">
            <h4 className="policy-card-title">Refund Policy</h4>
            <ul className="policy-list">
              <li>Bluetickgeng's responsibility is to refund fees only if services are not delivered as promised</li>
              <li>Payments may not be refundable but can be converted for other services</li>
              <li>Refunds issued only if services cannot be provided</li>
              <li>Refund processing takes up to 14 working days</li>
            </ul>
          </div>

          <div className="policy-card pricing-notes">
            <h4 className="policy-card-title">Pricing Notes</h4>
            <ul className="policy-list">
              <li>All rates exclude 7.5% VAT (added at checkout)</li>
              <li>Delivery durations vary by package (6 hours to 7 days)</li>
            </ul>
          </div>
        </div>

        <div className="sample-publications">
          <h3 className="sample-title">SAMPLE PUBLICATIONS</h3>
          <p className="sample-description">
            The company provides various publication styles including interview style articles, news story articles, 
            opinion pieces, and sponsored/branded content. Examples available on platforms like The US Times, 
            Vanguard Nigeria, The Guardian Nigeria, and Punch Nigeria.
          </p>
        </div>
      </div>
    </section>
  );
}

export default PublicationSection;
