import './ServiceCard.css';
import { useCurrency } from '../contexts/CurrencyContext.jsx';

function ServiceCard({ title, price, description }) {
  const { format } = useCurrency();

  // If price is numeric (or can be parsed), show formatted currency
  const showPrice = (() => {
    if (price === undefined || price === null) return '';
    if (typeof price === 'number') return format(price);
    // try to parse numeric strings
    const numeric = Number(String(price).replace(/[^0-9.]/g, ''));
    if (!Number.isNaN(numeric) && numeric > 0) return format(numeric);
    return price;
  })();

  return (
    <div className="service-card">
      <h3 className="service-card-title">{title}</h3>
      {showPrice && (
        <div className="service-card-price">
          Starting from <span className="price-amount">{showPrice}</span>
        </div>
      )}
      {description && (
        <p className="service-card-description">{description}</p>
      )}
    </div>
  );
}

export default ServiceCard;






