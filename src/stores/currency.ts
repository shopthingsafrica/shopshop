'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CurrencyCode, CURRENCIES, Currency } from '@/types';

interface CurrencyState {
  currentCurrency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  convertPrice: (price: number, fromCurrency: CurrencyCode) => number;
  formatPrice: (price: number, currency?: CurrencyCode) => string;
  formatConvertedPrice: (price: number, fromCurrency: CurrencyCode) => string;
  getCurrency: () => Currency;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currentCurrency: 'NGN',
      
      setCurrency: (currency: CurrencyCode) => {
        set({ currentCurrency: currency });
      },
      
      convertPrice: (price: number, fromCurrency: CurrencyCode) => {
        const from = CURRENCIES[fromCurrency];
        const to = CURRENCIES[get().currentCurrency];
        
        // Convert to USD first, then to target currency
        const priceInUsd = price / from.rate;
        const convertedPrice = priceInUsd * to.rate;
        
        return Math.round(convertedPrice * 100) / 100;
      },
      
      formatPrice: (price: number, currency?: CurrencyCode) => {
        const currencyCode = currency || get().currentCurrency;
        const currencyInfo = CURRENCIES[currencyCode];
        
        const formattedNumber = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(price);
        
        return `${currencyInfo.symbol}${formattedNumber}`;
      },

      formatConvertedPrice: (price: number, fromCurrency: CurrencyCode) => {
        const from = CURRENCIES[fromCurrency];
        const to = CURRENCIES[get().currentCurrency];
        
        // Convert to USD first, then to target currency
        const priceInUsd = price / from.rate;
        const convertedPrice = priceInUsd * to.rate;
        const roundedPrice = Math.round(convertedPrice * 100) / 100;
        
        const formattedNumber = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(roundedPrice);
        
        return `${to.symbol}${formattedNumber}`;
      },
      
      getCurrency: () => {
        return CURRENCIES[get().currentCurrency];
      },
    }),
    {
      name: 'currency-storage',
    }
  )
);

// Utility functions for use outside of React components
export function convertPrice(price: number, fromCurrency: CurrencyCode, toCurrency: CurrencyCode): number {
  const from = CURRENCIES[fromCurrency];
  const to = CURRENCIES[toCurrency];
  
  const priceInUsd = price / from.rate;
  const convertedPrice = priceInUsd * to.rate;
  
  return Math.round(convertedPrice * 100) / 100;
}

export function formatPrice(price: number, currency: CurrencyCode): string {
  const currencyInfo = CURRENCIES[currency];
  
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
  
  return `${currencyInfo.symbol}${formattedNumber}`;
}
