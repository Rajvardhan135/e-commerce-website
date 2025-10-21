import { createContext, useContext, useState } from 'react';
import { detectUserCurrency, getSupportedCurrencies } from '../utils/currency.utils';

const CurrencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
  const supportedCurrencies = getSupportedCurrencies();
  const [currency, setCurrency] = useState(() => detectUserCurrency() || 'USD');

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, supportedCurrencies }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error('useCurrency must be used within CurrencyProvider');
  return ctx;
};

export default CurrencyContext;
