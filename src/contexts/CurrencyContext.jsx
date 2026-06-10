import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext';
import {
  BASE_CURRENCY,
  FLUTTERWAVE_CURRENCIES,
  SUPPORTED_CURRENCY_CODES,
  getCurrencyByCode,
} from '../data/flutterwaveCurrencies';
import { mapCountryToCurrency } from '../data/countryCurrencyMap';

const CurrencyContext = createContext(null);
const STORAGE_KEY = 'bluetick_preferred_currency';
const MANUAL_KEY = 'bluetick_currency_manual';
const RATES_CACHE_KEY = 'bluetick_exchange_rates';
const DETECTED_CACHE_KEY = 'bluetick_detected_currency';
const RATES_TTL_MS = 60 * 60 * 1000;
const DETECT_TTL_MS = 30 * 60 * 1000;

const isManualCurrency = () => localStorage.getItem(MANUAL_KEY) === 'true';

const detectCurrencyFromBrowser = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/', {
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) return null;
    const data = await response.json();
    const countryCode = data.country_code || data.country;
    if (!countryCode) return null;
    return {
      countryCode: String(countryCode).toUpperCase(),
      currency: mapCountryToCurrency(countryCode),
      source: 'ipapi-client',
    };
  } catch {
    return null;
  }
};

const getStoredCurrency = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return SUPPORTED_CURRENCY_CODES.includes(stored) ? stored : BASE_CURRENCY;
};

const readCachedRates = () => {
  try {
    const raw = localStorage.getItem(RATES_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.rates || !parsed?.fetchedAt) return null;
    if (Date.now() - parsed.fetchedAt > RATES_TTL_MS) return null;
    return parsed.rates;
  } catch {
    return null;
  }
};

const writeCachedRates = (rates) => {
  localStorage.setItem(
    RATES_CACHE_KEY,
    JSON.stringify({
      rates,
      fetchedAt: Date.now(),
    })
  );
};

const readDetectedCurrency = () => {
  try {
    const raw = sessionStorage.getItem(DETECTED_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed?.currency || !parsed?.fetchedAt) return null;
    if (Date.now() - parsed.fetchedAt > DETECT_TTL_MS) return null;
    return SUPPORTED_CURRENCY_CODES.includes(parsed.currency) ? parsed : null;
  } catch {
    return null;
  }
};

const writeDetectedCurrency = (payload) => {
  sessionStorage.setItem(
    DETECTED_CACHE_KEY,
    JSON.stringify({
      ...payload,
      fetchedAt: Date.now(),
    })
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};

export const CurrencyProvider = ({ children }) => {
  const { apiUrl } = useAuth();
  const [currency, setCurrencyState] = useState(() => {
    if (isManualCurrency()) {
      return getStoredCurrency();
    }
    const detected = readDetectedCurrency();
    return detected?.currency || BASE_CURRENCY;
  });
  const [rates, setRates] = useState(() => readCachedRates() || { [BASE_CURRENCY]: 1 });
  const [loading, setLoading] = useState(false);
  const [isManual, setIsManual] = useState(isManualCurrency);
  const [detecting, setDetecting] = useState(() => !isManualCurrency() && !readDetectedCurrency());

  useEffect(() => {
    let cancelled = false;

    const detectCurrency = async () => {
      if (isManual) {
        setDetecting(false);
        return;
      }

      const cachedDetection = readDetectedCurrency();
      if (cachedDetection?.currency) {
        setCurrencyState(cachedDetection.currency);
        setDetecting(false);
        return;
      }

      setDetecting(true);
      try {
        let detection = null;

        try {
          const response = await fetch(`${apiUrl}/api/detect-currency`);
          const data = await response.json();
          if (
            response.ok
            && data?.currency
            && SUPPORTED_CURRENCY_CODES.includes(data.currency)
            && data.source !== 'fallback'
          ) {
            detection = {
              currency: data.currency,
              countryCode: data.countryCode || null,
              source: data.source || 'server',
            };
          }
        } catch (error) {
          console.error('Server currency detection failed:', error);
        }

        if (!detection) {
          detection = await detectCurrencyFromBrowser();
        }

        if (
          !cancelled
          && detection?.currency
          && SUPPORTED_CURRENCY_CODES.includes(detection.currency)
        ) {
          setCurrencyState(detection.currency);
          writeDetectedCurrency(detection);
        }
      } catch (error) {
        console.error('Failed to detect currency:', error);
      } finally {
        if (!cancelled) {
          setDetecting(false);
        }
      }
    };

    detectCurrency();
    return () => {
      cancelled = true;
    };
  }, [apiUrl, isManual]);

  useEffect(() => {
    let cancelled = false;

    const fetchRates = async () => {
      const cached = readCachedRates();
      if (cached) {
        setRates(cached);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/exchange-rates?base=${BASE_CURRENCY}`);
        const data = await response.json();

        if (!cancelled && response.ok && data?.rates) {
          const nextRates = { [BASE_CURRENCY]: 1, ...data.rates };
          setRates(nextRates);
          writeCachedRates(nextRates);
        }
      } catch (error) {
        console.error('Failed to load exchange rates:', error);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchRates();
    return () => {
      cancelled = true;
    };
  }, [apiUrl]);

  const setCurrency = useCallback((code) => {
    if (!SUPPORTED_CURRENCY_CODES.includes(code)) return;
    setCurrencyState(code);
    localStorage.setItem(STORAGE_KEY, code);
    localStorage.setItem(MANUAL_KEY, 'true');
    setIsManual(true);
    sessionStorage.removeItem(DETECTED_CACHE_KEY);
  }, []);

  const resetToAutoCurrency = useCallback(() => {
    localStorage.removeItem(MANUAL_KEY);
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(DETECTED_CACHE_KEY);
    setIsManual(false);
    window.location.reload();
  }, []);

  const convert = useCallback(
    (amountNgn) => {
      const numeric = Number(amountNgn);
      if (!Number.isFinite(numeric)) return 0;
      if (currency === BASE_CURRENCY) return numeric;
      const rate = rates[currency];
      if (!rate) return numeric;
      return numeric * rate;
    },
    [currency, rates]
  );

  const format = useCallback(
    (amountNgn, options = {}) => {
      const targetCurrency = options.currency || currency;
      const numeric = Number(amountNgn);
      if (!Number.isFinite(numeric)) return '';

      const converted =
        targetCurrency === BASE_CURRENCY
          ? numeric
          : numeric * (rates[targetCurrency] || (targetCurrency === currency ? rates[currency] : 0) || 1);

      const locale =
        targetCurrency === 'USD'
          ? 'en-US'
          : targetCurrency === 'GBP'
            ? 'en-GB'
            : targetCurrency === 'EUR'
              ? 'de-DE'
              : 'en-NG';

      try {
        return new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: targetCurrency,
          maximumFractionDigits: ['USD', 'EUR', 'GBP', 'CAD'].includes(targetCurrency) ? 2 : 0,
        }).format(converted);
      } catch {
        const meta = getCurrencyByCode(targetCurrency);
        return `${meta.symbol}${Math.round(converted).toLocaleString()}`;
      }
    },
    [currency, rates]
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      resetToAutoCurrency,
      rates,
      loading,
      detecting,
      isManual,
      convert,
      format,
      currencies: FLUTTERWAVE_CURRENCIES,
      baseCurrency: BASE_CURRENCY,
      getCurrencyByCode,
    }),
    [currency, setCurrency, resetToAutoCurrency, rates, loading, detecting, isManual, convert, format]
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
};
