'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { useCurrencyStore } from '@/stores';
import { CURRENCIES, CurrencyCode } from '@/types';

export function CurrencySelector() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentCurrency, setCurrency, getCurrency } = useCurrencyStore();
  const currency = getCurrency();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleCurrencyChange = (code: CurrencyCode) => {
    setCurrency(code);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
        aria-label="Select currency"
      >
        <Globe className="w-4 h-4 text-muted-foreground" />
        <span className="font-medium text-sm">{currency.code}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-border z-50 py-2">
          <div className="px-4 py-2 border-b border-border">
            <p className="text-sm font-semibold text-foreground">Select Currency</p>
          </div>
          
          <div className="max-h-80 overflow-y-auto">
            {Object.values(CURRENCIES).map((curr) => (
              <button
                key={curr.code}
                onClick={() => handleCurrencyChange(curr.code)}
                className={`w-full px-4 py-3 flex items-center justify-between hover:bg-muted transition-colors ${
                  currentCurrency === curr.code ? 'bg-muted/50' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{curr.symbol}</span>
                  <div className="text-left">
                    <p className="font-medium text-sm text-foreground">{curr.code}</p>
                    <p className="text-xs text-muted-foreground">{curr.name}</p>
                  </div>
                </div>
                
                {currentCurrency === curr.code && (
                  <Check className="w-5 h-5 text-secondary" />
                )}
              </button>
            ))}
          </div>
          
          <div className="px-4 py-2 border-t border-border mt-2">
            <p className="text-xs text-muted-foreground">
              Prices are converted using current exchange rates
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
