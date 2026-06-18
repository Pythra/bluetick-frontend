export function ServiceSectionTitle({ section, blackKey = 'titleBlack', blueKey = 'titleBlue' }) {
  return (
    <>
      <span className="services-summary-title-black">{section[blackKey]}</span>{' '}
      <span className="services-summary-title-blue">{section[blueKey]}</span>
    </>
  );
}
