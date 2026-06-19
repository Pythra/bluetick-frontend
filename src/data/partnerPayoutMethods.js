export const PAYOUT_METHOD_LABELS = {
  bank: 'Local Bank Account',
  paypal: 'PayPal',
  wise: 'Wise',
  payoneer: 'Payoneer',
  crypto: 'Cryptocurrency',
};

export const CRYPTO_NETWORKS = ['USDT TRC20', 'USDT ERC20', 'USDT BEP20', 'Bitcoin', 'Ethereum'];

export const NIGERIA_BANKS = [
  'Moniepoint', 'Opay', 'PalmPay', 'Kuda', 'Access Bank', 'GTBank', 'Zenith Bank',
  'UBA', 'First Bank', 'FCMB', 'Wema Bank', 'Sterling Bank', 'Fidelity Bank',
  'Union Bank', 'Any Commercial Bank', 'Any Licensed Microfinance Bank',
];

export const WITHDRAWAL_STATUS_LABELS = {
  pending: 'Pending',
  approved: 'Approved',
  paid: 'Paid',
  rejected: 'Rejected',
};

export function getPayoutMethodFields(type) {
  switch (type) {
    case 'bank':
      return [
        { key: 'bankName', label: 'Bank Name', type: 'select', options: NIGERIA_BANKS },
        { key: 'accountName', label: 'Account Name', type: 'text' },
        { key: 'accountNumber', label: 'Account Number', type: 'text' },
      ];
    case 'paypal':
    case 'wise':
    case 'payoneer':
      return [{ key: 'email', label: `${PAYOUT_METHOD_LABELS[type]} Email`, type: 'email' }];
    case 'crypto':
      return [
        { key: 'network', label: 'Network', type: 'select', options: CRYPTO_NETWORKS },
        { key: 'walletAddress', label: 'Wallet Address', type: 'text' },
      ];
    default:
      return [];
  }
}
