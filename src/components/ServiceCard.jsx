import './ServiceCard.css';

function ServiceCard({ title, price, description }) {
  return (
    <div className="service-card">
      <h3 className="service-card-title">{title}</h3>
      {price && (
        <div className="service-card-price">
          Starting from <span className="price-amount">{price}</span>
        </div>
      )}
      {description && (
        <p className="service-card-description">{description}</p>
      )}
    </div>
  );
}

export default ServiceCard;






