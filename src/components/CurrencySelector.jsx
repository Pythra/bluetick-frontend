import { useEffect, useRef, useState } from 'react';
import { useCurrency } from '../contexts/CurrencyContext';
import { getCurrencyByCode } from '../data/flutterwaveCurrencies';
import CountryFlag from './CountryFlag';
import './CurrencySelector.css';

function CurrencySelector() {
  const { currency, setCurrency, currencies, loading } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = getCurrencyByCode(currency);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className="currency-selector" ref={rootRef}>
      <button
        type="button"
        className="currency-selector-trigger"
        onClick={() => setIsOpen((open) => !open)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={`Selected currency ${selected.code}`}
        title={selected.code}
      >
        <span className="currency-selector-flag" aria-hidden="true">
          <CountryFlag code={selected.countryCode} size="sm" rounded />
        </span>
        <span className="currency-selector-symbol" aria-hidden="true">
          {selected.symbol}
        </span>
        <span className="currency-selector-chevron" aria-hidden="true" />
      </button>

      {isOpen && (
        <div className="currency-selector-panel" role="listbox" aria-label="Choose currency">
          <ul className="currency-selector-list">
            {currencies.map((item) => {
              const isActive = item.code === currency;
              return (
                <li key={item.code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isActive}
                    className={`currency-selector-option${isActive ? ' is-active' : ''}`}
                    onClick={() => {
                      setCurrency(item.code);
                      setIsOpen(false);
                    }}
                  >
                    <span className="currency-selector-option-leading">
                      <span className="currency-selector-option-flag" aria-hidden="true">
                        <CountryFlag code={item.countryCode} size="sm" rounded />
                      </span>
                      <span className="currency-selector-option-name">{item.name}</span>
                    </span>
                    <span className="currency-selector-option-code">{item.code}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {loading && <p className="currency-selector-loading">Updating rates…</p>}
        </div>
      )}
    </div>
  );
}

export default CurrencySelector;
