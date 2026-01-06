'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
  Globe,
  LogOut,
  Settings,
  Package,
  Store,
  Shield,
} from 'lucide-react';
import { useCurrencyStore, useCartStore } from '@/stores';
import { useAuth } from '@/components/providers';
import { CURRENCIES, CurrencyCode } from '@/types';
import { signOut } from '@/app/auth/actions';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Categories', href: '/categories' },
  { label: 'New Arrivals', href: '/products?sort=newest' },
  { label: 'Best Sellers', href: '/products?sort=popular' },
  { label: 'Vendors', href: '/vendors' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mounted, setMounted] = useState(false);
  
  const { currentCurrency, setCurrency, getCurrency } = useCurrencyStore();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const { user, profile, isAuthenticated, isLoading } = useAuth();

  // Prevent hydration mismatch for currency
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border/50 shadow-sm">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-primary to-primary/90 text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-end items-center">
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/vendor/register" className="hover:text-secondary transition-colors duration-200 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5" />
              Sell on ShopThings
            </Link>
            <Link href="/help" className="hover:text-secondary transition-colors duration-200">
              Help & Support
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 transition-transform duration-200 hover:scale-[1.02]">
            <Image
              src="/images/logo.jpeg"
              alt="ShopThings"
              width={140}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
          
          {/* Search bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full group">
              <input
                type="text"
                placeholder="Search for products, categories, vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-3 px-5 pr-14 border border-border bg-muted/30 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:bg-white transition-all duration-200 placeholder:text-muted-foreground/60"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all duration-200 hover:shadow-md hover:shadow-secondary/20"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </form>
          
          {/* Right section */}
          <div className="flex items-center space-x-1 md:space-x-2">
            {/* Currency selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center space-x-1.5 px-3 py-2.5 rounded-lg hover:bg-muted/80 transition-all duration-200"
              >
                <Globe className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium">{mounted ? getCurrency().symbol : '₦'}</span>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${isCurrencyOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isCurrencyOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsCurrencyOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-border/50 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {Object.values(CURRENCIES).map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => {
                          setCurrency(currency.code);
                          setIsCurrencyOpen(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-muted/70 transition-colors duration-150 flex items-center justify-between ${
                          currentCurrency === currency.code ? 'bg-secondary/10 text-secondary font-medium' : ''
                        }`}
                      >
                        <span>
                          {currency.symbol} {currency.code}
                        </span>
                        <span className="text-muted-foreground text-sm">
                          {currency.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
            
            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="p-2.5 rounded-lg hover:bg-muted/80 transition-all duration-200 relative group"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5 group-hover:text-primary transition-colors duration-200" />
            </Link>
            
            {/* Cart */}
            <Link
              href="/cart"
              className="p-2.5 rounded-lg hover:bg-muted/80 transition-all duration-200 relative group"
              aria-label="Cart"
            >
              <ShoppingCart className="w-5 h-5 group-hover:text-primary transition-colors duration-200" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-accent text-white text-xs font-bold rounded-full min-w-[20px] h-5 px-1 flex items-center justify-center shadow-sm">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
            
            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 rounded-lg hover:bg-muted/80 transition-all duration-200 flex items-center gap-2"
                aria-label="Account"
              >
                {isAuthenticated && profile ? (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-secondary/70 flex items-center justify-center shadow-sm">
                    <span className="text-sm font-bold text-white">
                      {profile.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                ) : (
                  <User className="w-5 h-5" />
                )}
              </button>
              
              {isUserMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-60 bg-white rounded-xl shadow-xl border border-border/50 z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {isAuthenticated && profile ? (
                      <>
                        {/* User info */}
                        <div className="px-4 py-4 border-b border-border/50 bg-muted/30">
                          <p className="font-semibold text-foreground truncate">
                            {profile.full_name || 'User'}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {user?.email}
                          </p>
                        </div>
                        
                        {/* Menu items */}
                        <div className="py-2">
                          <Link
                            href="/orders"
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/70 transition-colors duration-150"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Package className="w-4 h-4 text-muted-foreground" />
                            My Orders
                          </Link>
                          <Link
                            href="/wishlist"
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/70 transition-colors duration-150"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Heart className="w-4 h-4 text-muted-foreground" />
                            Wishlist
                          </Link>
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/70 transition-colors duration-150"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4 text-muted-foreground" />
                            Settings
                          </Link>
                          
                          {/* Vendor/Admin links */}
                          {(profile.role === 'vendor' || profile.role === 'admin') && (
                            <Link
                              href="/vendor/dashboard"
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/70 transition-colors duration-150"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Store className="w-4 h-4 text-secondary" />
                              <span className="text-secondary font-medium">Vendor Dashboard</span>
                            </Link>
                          )}
                          {profile.role === 'admin' && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/70 transition-colors duration-150"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Shield className="w-4 h-4 text-primary" />
                              <span className="text-primary font-medium">Admin Panel</span>
                            </Link>
                          )}
                        </div>
                        
                        {/* Logout */}
                        <div className="border-t border-border/50 py-2">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              signOut();
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-left hover:bg-error/10 transition-colors duration-150 text-error"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <div className="py-2">
                        <Link
                          href="/auth/login"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/70 transition-colors duration-150 font-medium"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/auth/signup"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/70 transition-colors duration-150"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Create Account
                        </Link>
                        <hr className="my-2 border-border/50" />
                        <Link
                          href="/orders"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/70 transition-colors duration-150 text-muted-foreground"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Package className="w-4 h-4" />
                          My Orders
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/70 transition-colors duration-150 text-muted-foreground"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Settings className="w-4 h-4" />
                          Profile Settings
                        </Link>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 md:hidden rounded-lg hover:bg-muted/80 transition-all duration-200"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        
        {/* Mobile search */}
        <form onSubmit={handleSearch} className="mt-4 md:hidden">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-3 px-5 pr-14 border border-border bg-muted/30 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary focus:bg-white transition-all duration-200 placeholder:text-muted-foreground/60"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2.5 bg-secondary text-white rounded-full hover:bg-secondary/90 transition-all duration-200"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
      
      {/* Desktop navigation */}
      <nav className="hidden md:block border-t border-border/50 bg-white/50">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center space-x-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-4 py-3 text-foreground hover:text-secondary transition-colors duration-200 font-medium relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-border/50 bg-white animate-in slide-in-from-top-2 duration-200">
          <ul className="px-4 py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-3.5 text-foreground hover:text-secondary transition-colors duration-200 font-medium border-b border-border/30 last:border-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/vendor/register"
                className="flex items-center gap-2 py-3.5 text-secondary font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Store className="w-4 h-4" />
                Sell on ShopThings
              </Link>
            </li>
          </ul>
          
          {/* Mobile currency selector */}
          <div className="px-4 py-4 border-t border-border/50 bg-muted/30">
            <p className="text-sm text-muted-foreground mb-3 font-medium">Currency</p>
            <div className="flex flex-wrap gap-2">
              {Object.values(CURRENCIES).map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setCurrency(currency.code);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    currentCurrency === currency.code
                      ? 'bg-secondary text-white shadow-sm'
                      : 'bg-white hover:bg-border/50 border border-border'
                  }`}
                >
                  {currency.symbol} {currency.code}
                </button>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
