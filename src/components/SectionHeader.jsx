import './SectionHeader.css';

function SectionHeader({ title, subtitle, eyebrow, homepage = false }) {
  return (
    <div className={`section-header ${homepage ? 'section-header--homepage' : ''}`}>
      {eyebrow && <span className="section-eyebrow">{eyebrow}</span>}
      <h2 className={`section-title ${homepage ? 'section-title--homepage' : ''}`}>{title}</h2>
      {subtitle && <p className="section-subtitle">{subtitle}</p>}
    </div>
  );
}

export default SectionHeader;






