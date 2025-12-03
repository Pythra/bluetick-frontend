/**
 * Formats a price string to a human-readable format
 * @param {string|number} price - The price to format (can be a number or string with currency symbol)
 * @param {string} [currency='₦'] - The currency symbol to use (defaults to '₦' for Naira)
 * @returns {string} Formatted price string with thousands separators
 */
const formatPrice = (price, currency = '₦') => {
  if (price === undefined || price === null) return '';
  
  // If price is a string, extract the numeric part
  if (typeof price === 'string') {
    // Remove any existing formatting and extract the number
    const numericValue = price.replace(/[^0-9.]/g, '');
    
    // If we don't have a valid number, return the original string
    if (!numericValue) return price;
    
    // Format the number with thousands separators
    const formattedNumber = parseFloat(numericValue).toLocaleString('en-US');
    
    // Check if the original string had 'k' or other shorthand
    if (price.toLowerCase().includes('k') && !price.includes('000')) {
      return `${currency}${formattedNumber}K`;
    }
    
    return `${currency}${formattedNumber}`;
  }
  
  // If price is a number, format it directly
  if (typeof price === 'number') {
    return `${currency}${price.toLocaleString('en-US')}`;
  }
  
  return '';
};

/**
 * Converts a price with 'k' or 'K' to full numeric value (e.g., '₦10k' to '₦10,000')
 * @param {string} price - The price string to convert
 * @returns {string} The converted price string
 */
const convertKToFullNumber = (price) => {
  if (!price) return '';
  
  // Check if the price contains 'k' or 'K'
  if (typeof price === 'string' && /\d+[kK]/.test(price)) {
    const numericPart = parseFloat(price.replace(/[^0-9.]/g, ''));
    if (!isNaN(numericPart)) {
      const fullAmount = numericPart * 1000;
      return formatPrice(fullAmount);
    }
  }
  
  return price;
};

export { formatPrice, convertKToFullNumber };
