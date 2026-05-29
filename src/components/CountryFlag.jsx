function CountryFlag({ code, alt = '' }) {
  const iso = code.toLowerCase();

  return (
    <img
      className="country-flag"
      src={`https://flagcdn.com/w40/${iso}.png`}
      srcSet={`https://flagcdn.com/w80/${iso}.png 2x`}
      width={28}
      height={21}
      alt={alt}
      loading="lazy"
      decoding="async"
    />
  );
}

export default CountryFlag;
