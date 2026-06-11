export const BASE_CURRENCY = 'NGN';

export const FLUTTERWAVE_CURRENCIES = [
  { code: 'GBP', name: 'British Pound Sterling', symbol: '£', flag: '🇬🇧', countryCode: 'GB' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'CA$', flag: '🇨🇦', countryCode: 'CA' },
  { code: 'XAF', name: 'Central African CFA Franc', symbol: 'FCFA', flag: '🇨🇲', countryCode: 'CM' },
  { code: 'COP', name: 'Colombian Peso', symbol: 'COL$', flag: '🇨🇴', countryCode: 'CO' },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', flag: '🇪🇬', countryCode: 'EG' },
  { code: 'EUR', name: 'SEPA', symbol: '€', flag: '🇪🇺', countryCode: 'EU' },
  { code: 'GHS', name: 'Ghanaian Cedi', symbol: '₵', flag: '🇬🇭', countryCode: 'GH' },
  { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪', countryCode: 'KE' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳', countryCode: 'IN' },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', flag: '🇳🇬', countryCode: 'NG' },
  { code: 'RWF', name: 'Rwandan Franc', symbol: 'FRw', flag: '🇷🇼', countryCode: 'RW' },
  { code: 'SLL', name: 'Sierra Leonean Leone', symbol: 'Le', flag: '🇸🇱', countryCode: 'SL' },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦', countryCode: 'ZA' },
  { code: 'TZS', name: 'Tanzanian Shilling', symbol: 'TSh', flag: '🇹🇿', countryCode: 'TZ' },
  { code: 'UGX', name: 'Ugandan Shilling', symbol: 'USh', flag: '🇺🇬', countryCode: 'UG' },
  { code: 'USD', name: 'United States Dollar', symbol: '$', flag: '🇺🇸', countryCode: 'US' },
  { code: 'XOF', name: 'West African CFA Franc BCEAO', symbol: 'CFA', flag: '🇸🇳', countryCode: 'SN' },
  { code: 'ZMW', name: 'Zambian Kwacha', symbol: 'ZK', flag: '🇿🇲', countryCode: 'ZM' },
];

export const SUPPORTED_CURRENCY_CODES = FLUTTERWAVE_CURRENCIES.map((currency) => currency.code);

export const getCurrencyByCode = (code) =>
  FLUTTERWAVE_CURRENCIES.find((currency) => currency.code === code) || FLUTTERWAVE_CURRENCIES.find((c) => c.code === BASE_CURRENCY);
