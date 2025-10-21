// Simple currency utilities for local/demo use
// Assumes base amounts are in USD

const supportedCurrencies = {
  USD: { symbol: '$', name: 'US Dollar' },
  INR: { symbol: '₹', name: 'Indian Rupee' },
  CNY: { symbol: '¥', name: 'Chinese Yuan' },
  RUB: { symbol: '₽', name: 'Russian Ruble' },
  JPY: { symbol: '¥', name: 'Japanese Yen' },
};

// Example exchange rates relative to 1 USD
// These are stubbed values for demo. Replace with a real API for production.
const exchangeRates = {
  USD: 1,
  INR: 83.5,
  CNY: 7.2,
  RUB: 95.0,
  JPY: 155.0,
};

export async function fetchCurrencyData() {
  // Placeholder for fetching real exchange rates from an API
  // Return the local exchangeRates object for now
  return new Promise((resolve) => setTimeout(() => resolve({ rates: exchangeRates }), 50));
}

export function getSupportedCurrencies() {
  return Object.keys(supportedCurrencies);
}

export function getCurrencySymbol(code = 'USD') {
  return (supportedCurrencies[code] && supportedCurrencies[code].symbol) || '$';
}

export function convertPrice(amountUSD = 0, targetCurrency = 'USD') {
  const rate = exchangeRates[targetCurrency] || 1;
  return amountUSD * rate;
}

export function detectUserCurrency() {
  if (typeof navigator === 'undefined') return 'USD';
  const lang = (navigator.language || '').toLowerCase();
  if (lang.startsWith('hi') || lang.includes('in')) return 'INR';
  if (lang.startsWith('zh') || lang.includes('cn')) return 'CNY';
  if (lang.startsWith('ru')) return 'RUB';
  if (lang.startsWith('ja')) return 'JPY';
  return 'USD';
}

export default {
  fetchCurrencyData,
  getSupportedCurrencies,
  getCurrencySymbol,
  convertPrice,
  detectUserCurrency,
};
