import './CountryFlag.css';

function CountryFlag({ code, alt = '', size = 'md', rounded = false }) {
  const iso = code.toLowerCase();

  const sizeMap = {
    sm: { width: 20, height: 15 },
    md: { width: 28, height: 21 },
    lg: { width: 36, height: 27 },
  };

  const { width, height } = sizeMap[size] || sizeMap.md;

  return (
    <img
      className={`country-flag ${rounded ? 'country-flag-rounded' : ''}`}
      src={`https://flagcdn.com/w40/${iso}.png`}
      srcSet={`https://flagcdn.com/w80/${iso}.png 2x`}
      width={width}
      height={height}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}

export default CountryFlag;
