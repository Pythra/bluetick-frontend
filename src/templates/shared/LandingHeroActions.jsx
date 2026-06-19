import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlaceOrderDropdown from '../../components/PlaceOrderDropdown';
import CountryFlag from '../../components/CountryFlag';
import { useAuth } from '../../contexts/AuthContext';
import { useCurrency } from '../../contexts/CurrencyContext';
import { getCurrencyByCode } from '../../data/flutterwaveCurrencies';

function LandingHeroActions({ className = 'landing-actions' }) {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { currency, setCurrency, currencies } = useCurrency();
  const selectedCurrency = getCurrencyByCode(currency);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const currencyDropdownRef = useRef(null);

  useEffect(() => {
    if (!isCurrencyDropdownOpen) return undefined;

    const handlePointerDown = (event) => {
      if (currencyDropdownRef.current && !currencyDropdownRef.current.contains(event.target)) {
        setIsCurrencyDropdownOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsCurrencyDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isCurrencyDropdownOpen]);

  return (
    <div className={`${className}${isAuthenticated ? ' landing-actions--auth' : ''}`}>
      <PlaceOrderDropdown />
      {!isAuthenticated && (
        <button
          type="button"
          className="landing-btn landing-btn-secondary"
          onClick={() => navigate('/signup')}
        >
          Get Started
        </button>
      )}
      <div className="landing-currency-selector" ref={currencyDropdownRef}>
        <button
          type="button"
          className="landing-btn landing-btn-secondary landing-currency-btn"
          onClick={() => setIsCurrencyDropdownOpen((open) => !open)}
        >
          <span className="landing-currency-btn-flag">
            <CountryFlag code={selectedCurrency.countryCode} size="sm" />
          </span>
          <span>Change Currency</span>
          <span className="landing-currency-btn-symbol">{selectedCurrency.symbol}</span>
        </button>
        {isCurrencyDropdownOpen && (
          <div className="landing-currency-dropdown">
            <ul className="landing-currency-list">
              {currencies.map((item) => {
                const isActive = item.code === currency;
                return (
                  <li key={item.code}>
                    <button
                      type="button"
                      className={`landing-currency-option${isActive ? ' is-active' : ''}`}
                      onClick={() => {
                        setCurrency(item.code);
                        setIsCurrencyDropdownOpen(false);
                      }}
                    >
                      <span className="landing-currency-option-flag">
                        <CountryFlag code={item.countryCode} size="sm" />
                      </span>
                      <span className="landing-currency-option-name">{item.name}</span>
                      <span className="landing-currency-option-code">{item.code}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default LandingHeroActions;
