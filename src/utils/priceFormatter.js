/**
 * Locale-aware price formatting utility.
 * Accepts numeric values or numeric strings and formats using Intl.NumberFormat.
 * @param {string|number} value - Numeric value or string containing a number
 * @param {string} [currency='NGN'] - Currency code (e.g. 'NGN', 'USD') or symbol ('$','₦')
 * @param {string} [locale] - Optional locale (e.g. 'en-US'). If omitted the browser default is used.
 * @returns {string} Formatted currency string (e.g. ₦1,200,000 or $3,200.00)
 */
const SYMBOL_TO_CODE = {
  '₦': 'NGN',
  'N': 'NGN',
  '₤': 'GBP',
  '$': 'USD',
  '€': 'EUR',
};

const formatPrice = (value, currency = 'NGN', locale) => {
  if (value === undefined || value === null || value === '') return '';

  // Normalize currency input: allow symbol or three-letter code
  let currencyCode = String(currency || 'NGN');
  if (currencyCode.length === 1 && SYMBOL_TO_CODE[currencyCode]) {
    currencyCode = SYMBOL_TO_CODE[currencyCode];
  }
  if (currencyCode.length === 3) {
    currencyCode = currencyCode.toUpperCase();
  }

  // Extract numeric value
  let numeric = 0;
  if (typeof value === 'number' && !Number.isNaN(value)) {
    numeric = value;
  } else if (typeof value === 'string') {
    const cleaned = value.replace(/[^0-9.]/g, '');
    numeric = cleaned ? parseFloat(cleaned) : 0;
  }

  try {
    const formatter = new Intl.NumberFormat(locale || undefined, {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 0,
    });
    return formatter.format(numeric);
  } catch (e) {
    // Fallback: simple symbol + localized number
    const formatted = numeric.toLocaleString();
    const symbol = currencyCode === 'NGN' ? '₦' : currencyCode;
    return `${symbol}${formatted}`;
  }
};

/**
 * Converts a price with 'k' or 'K' to full numeric value (e.g., '₦10k' to '₦10,000')
 * @param {string} price - The price string to convert
 * @returns {string} The converted price string
 */
const convertKToFullNumber = (price) => {
  if (!price) return '';

  if (typeof price === 'string' && /\d+[kK]/.test(price)) {
    const numericPart = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (!isNaN(numericPart)) {
      const fullAmount = numericPart * 1000;
      return formatPrice(fullAmount);
    }
  }

  return price;
};

/**
 * Extracts numeric amount from formatted price strings for cart/checkout.
 * @param {string|number} price
 * @returns {number}
 */
const parsePriceToNumber = (price) => {
  if (typeof price === 'number' && !Number.isNaN(price)) {
    return price;
  }
  if (typeof price === 'string') {
    const numericValue = price.replace(/[^0-9.]/g, '');
    return numericValue ? parseFloat(numericValue) : 0;
  }
  return 0;
};

export { formatPrice, convertKToFullNumber, parsePriceToNumber };
