import { useNavigate } from 'react-router-dom';
import {
  FaHandshake,
  FaArrowRight,
  FaChartLine,
  FaWallet,
  FaUniversity,
  FaGlobeAfrica,
  FaShieldAlt,
  FaCrown,
  FaCheckCircle,
  FaCoins,
  FaHourglassHalf,
  FaMoneyBillWave,
} from 'react-icons/fa';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import partnerHero from '../assets/partner.png';
import './PartnerPage.css';

const earningMethods = [
  'White-Label Service Sales',
  'Referral Sales',
  'Approved Partner Promotions',
  'Special Campaigns',
  'Additional Incentive Programs',
];

const withdrawalMethods = [
  {
    icon: FaUniversity,
    title: 'Local Bank Accounts',
    items: ['Commercial Banks', 'Microfinance Banks', 'Digital Banks', 'Mobile Money (where supported)'],
  },
  {
    icon: FaGlobeAfrica,
    title: 'International Banks',
    items: ['Direct withdrawals to local bank accounts in supported countries'],
  },
  {
    icon: FaWallet,
    title: 'Digital Payment Providers',
    items: ['Wise', 'Payoneer', 'PayPal'],
  },
  {
    icon: FaCoins,
    title: 'Cryptocurrency',
    items: ['USDT (Supported Networks)', 'Other approved cryptocurrencies'],
  },
];

const partnerTiers = [
  {
    name: 'Standard',
    accent: 'standard',
    perks: ['Core commissions', 'Partner dashboard access', 'Standard support'],
  },
  {
    name: 'Silver',
    accent: 'silver',
    perks: ['Increased commissions', 'Priority support', 'Promotional access'],
  },
  {
    name: 'Gold',
    accent: 'gold',
    perks: ['Higher commission rates', 'Faster payout processing', 'Exclusive promotions'],
  },
  {
    name: 'Platinum',
    accent: 'platinum',
    perks: ['Top-tier commissions', 'Fastest payouts', 'Additional platform features'],
  },
];

const policyPoints = [
  {
    title: 'Commission Reversals',
    text: 'Commissions may be reversed where fraud is detected, payment disputes or chargebacks occur, orders are cancelled, payments are refunded, or policy violations are discovered.',
  },
  {
    title: 'Chargebacks',
    text: 'If a client initiates a chargeback or payment dispute, related commissions may be frozen or reversed, and withdrawal requests may be delayed.',
  },
  {
    title: 'Fraud Prevention',
    text: 'Self-referrals, fake transactions, artificial orders, stolen payment methods, commission manipulation, and account abuse are strictly prohibited and may result in account termination and legal action.',
  },
  {
    title: 'Tax Responsibility',
    text: 'Partners are solely responsible for their own tax filings, reporting, and local financial compliance. We encourage seeking professional tax guidance where necessary.',
  },
];

function PartnerPage() {
  const navigate = useNavigate();

  return (
    <div className="partner-page">
      <Navbar />

      {/* Hero */}
      <header className="partner-page-hero">
        <div
          className="partner-page-hero-bg"
          style={{ backgroundImage: `url(${partnerHero})` }}
        />
        <div className="partner-page-hero-content">
          <div className="partner-page-badge">
            <FaHandshake />
            <span>Bluetick Partner Program</span>
          </div>
          <h1>
            Earn With Us.
            <span> Grow With Us.</span>
          </h1>
          <p>
            Join the Bluetick Partner Program and White-Label Partner Program — refer clients,
            sell services under your own brand, and earn real commissions and profits.
          </p>
          <div className="partner-page-hero-actions">
            <button type="button" className="partner-page-cta" onClick={() => navigate('/partner/apply')}>
              <span>Become a Partner</span>
              <FaArrowRight />
            </button>
            <button
              type="button"
              className="partner-page-cta partner-page-cta--ghost"
              onClick={() => navigate('/legal/partner-commission-payout-policy')}
            >
              Read Full Policy
            </button>
          </div>
        </div>
      </header>

      {/* How you earn */}
      <section className="partner-page-section">
        <div className="partner-page-container">
          <h2 className="partner-page-title">How Partners Earn</h2>
          <p className="partner-page-subtitle">
            Approved Partners earn commissions and profits by referring clients and selling
            services through the Partner Platform and White-Label Website system.
          </p>
          <ul className="partner-earn-list">
            {earningMethods.map((method) => (
              <li key={method}>
                <FaCheckCircle className="partner-earn-check" />
                <span>{method}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* White-label profit model */}
      <section className="partner-page-section partner-page-section--dark">
        <div className="partner-page-container">
          <h2 className="partner-page-title">White-Label Profit Model</h2>
          <p className="partner-page-subtitle">
            Set your own selling prices above our base service price — the difference is yours.
            The system automatically calculates and records your earnings after every successful order.
          </p>
          <div className="partner-profit-example">
            <div className="partner-profit-row">
              <span className="partner-profit-label">Company Base Price</span>
              <span className="partner-profit-value">₦800,000</span>
            </div>
            <div className="partner-profit-row">
              <span className="partner-profit-label">Your Selling Price</span>
              <span className="partner-profit-value">₦1,200,000</span>
            </div>
            <div className="partner-profit-row partner-profit-row--highlight">
              <span className="partner-profit-label">Your Profit</span>
              <span className="partner-profit-value">₦400,000</span>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings flow */}
      <section className="partner-page-section">
        <div className="partner-page-container">
          <h2 className="partner-page-title">How Earnings Flow</h2>
          <div className="partner-flow-grid">
            <div className="partner-flow-card">
              <div className="partner-flow-icon"><FaChartLine /></div>
              <h3>1. Earn</h3>
              <p>Make a sale or referral. The system records your commission instantly after a successful order.</p>
            </div>
            <div className="partner-flow-card">
              <div className="partner-flow-icon"><FaHourglassHalf /></div>
              <h3>2. Pending Earnings</h3>
              <p>Earnings stay pending while payment is confirmed, fraud checks are completed, and chargeback windows pass.</p>
            </div>
            <div className="partner-flow-card">
              <div className="partner-flow-icon"><FaWallet /></div>
              <h3>3. Available Balance</h3>
              <p>Once verified, earnings move to your Available Balance — ready to withdraw at any time.</p>
            </div>
            <div className="partner-flow-card">
              <div className="partner-flow-icon"><FaMoneyBillWave /></div>
              <h3>4. Withdraw</h3>
              <p>Request a payout through your preferred method. Limits and thresholds are shown in your Partner Dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Withdrawal methods */}
      <section className="partner-page-section partner-page-section--soft">
        <div className="partner-page-container">
          <h2 className="partner-page-title">Withdrawal Methods</h2>
          <p className="partner-page-subtitle">Available payout methods may vary by country.</p>
          <div className="partner-withdraw-grid">
            {withdrawalMethods.map(({ icon: Icon, title, items }) => (
              <div className="partner-withdraw-card" key={title}>
                <div className="partner-withdraw-icon"><Icon /></div>
                <h3>{title}</h3>
                <ul>
                  {items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner tiers */}
      <section className="partner-page-section">
        <div className="partner-page-container">
          <h2 className="partner-page-title">Partner Tiers</h2>
          <p className="partner-page-subtitle">
            Grow your tier, grow your benefits — higher commissions, priority support, and faster payouts.
          </p>
          <div className="partner-tier-grid">
            {partnerTiers.map(({ name, accent, perks }) => (
              <div className={`partner-tier-card partner-tier-card--${accent}`} key={name}>
                <div className="partner-tier-crown"><FaCrown /></div>
                <h3>{name}</h3>
                <ul>
                  {perks.map((perk) => (
                    <li key={perk}>{perk}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policies */}
      <section className="partner-page-section partner-page-section--soft">
        <div className="partner-page-container">
          <h2 className="partner-page-title">
            <FaShieldAlt className="partner-page-title-icon" />
            Fair Play &amp; Compliance
          </h2>
          <div className="partner-policy-grid">
            {policyPoints.map(({ title, text }) => (
              <div className="partner-policy-card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
          <p className="partner-policy-note">
            Commission structures and this policy may be updated at any time. See the full{' '}
            <button
              type="button"
              className="partner-policy-link"
              onClick={() => navigate('/legal/partner-commission-payout-policy')}
            >
              Partner Commission &amp; Payout Policy
            </button>{' '}
            for complete terms.
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="partner-page-final-cta">
        <div className="partner-page-container">
          <h2>Building Digital Solutions. Creating Global Opportunities.</h2>
          <p>Questions about commissions, payouts, or earnings? Reach us through official Bluetick support channels.</p>
          <button type="button" className="partner-page-cta" onClick={() => navigate('/partner/apply')}>
            <span>Start Partnering Today</span>
            <FaArrowRight />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default PartnerPage;
