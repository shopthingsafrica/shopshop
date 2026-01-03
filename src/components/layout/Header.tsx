'use client';

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
  
  const { currentCurrency, setCurrency, getCurrency } = useCurrencyStore();
  const cartItemCount = useCartStore((state) => state.getItemCount());
  const { user, profile, isAuthenticated, isLoading } = useAuth();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
      {/* Top bar */}
      <div className="bg-primary text-white text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
          <p>Free shipping on orders over ₦50,000 🎉</p>
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/vendor/register" className="hover:text-secondary transition-colors">
              Sell on ShopThings
            </Link>
            <Link href="/help" className="hover:text-secondary transition-colors">
              Help & Support
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
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
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for products, categories, vendors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2.5 px-4 pr-12 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </form>
          
          {/* Right section */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Currency selector */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span className="font-medium">{getCurrency().symbol}</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              {isCurrencyOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsCurrencyOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-border z-20">
                    {Object.values(CURRENCIES).map((currency) => (
                      <button
                        key={currency.code}
                        onClick={() => {
                          setCurrency(currency.code);
                          setIsCurrencyOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center justify-between ${
                          currentCurrency === currency.code ? 'bg-muted' : ''
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
              className="p-2 rounded-lg hover:bg-muted transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-6 h-6" />
            </Link>
            
            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 rounded-lg hover:bg-muted transition-colors relative"
              aria-label="Cart"
            >
              <ShoppingCart className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
            
            {/* User menu */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="p-2 rounded-lg hover:bg-muted transition-colors flex items-center gap-2"
                aria-label="Account"
              >
                {isAuthenticated && profile ? (
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-secondary">
                      {profile.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    </span>
                  </div>
                ) : (
                  <User className="w-6 h-6" />
                )}
              </button>
              
              {isUserMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-border z-20">
                    {isAuthenticated && profile ? (
                      <>
                        {/* User info */}
                        <div className="px-4 py-3 border-b border-border">
                          <p className="font-medium text-foreground truncate">
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
                            className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Package className="w-4 h-4 text-muted-foreground" />
                            My Orders
                          </Link>
                          <Link
                            href="/wishlist"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Heart className="w-4 h-4 text-muted-foreground" />
                            Wishlist
                          </Link>
                          <Link
                            href="/profile"
                            className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="w-4 h-4 text-muted-foreground" />
                            Settings
                          </Link>
                          
                          {/* Vendor/Admin links */}
                          {(profile.role === 'vendor' || profile.role === 'admin') && (
                            <Link
                              href="/vendor/dashboard"
                              className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Store className="w-4 h-4 text-muted-foreground" />
                              Vendor Dashboard
                            </Link>
                          )}
                          {profile.role === 'admin' && (
                            <Link
                              href="/admin"
                              className="flex items-center gap-3 px-4 py-2 hover:bg-muted transition-colors"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              <Shield className="w-4 h-4 text-muted-foreground" />
                              Admin Panel
                            </Link>
                          )}
                        </div>
                        
                        {/* Logout */}
                        <div className="border-t border-border py-2">
                          <button
                            onClick={() => {
                              setIsUserMenuOpen(false);
                              signOut();
                            }}
                            className="flex items-center gap-3 w-full px-4 py-2 text-left hover:bg-muted transition-colors text-error"
                          >
                            <LogOut className="w-4 h-4" />
                            Sign Out
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <Link
                          href="/auth/login"
                          className="block px-4 py-2 hover:bg-muted transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Sign In
                        </Link>
                        <Link
                          href="/auth/signup"
                          className="block px-4 py-2 hover:bg-muted transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Create Account
                        </Link>
                        <hr className="my-1 border-border" />
                        <Link
                          href="/orders"
                          className="block px-4 py-2 hover:bg-muted transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          My Orders
                        </Link>
                        <Link
                          href="/profile"
                          className="block px-4 py-2 hover:bg-muted transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          Profile Settings
                        </Link>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 md:hidden rounded-lg hover:bg-muted transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
        
        {/* Mobile search */}
        <form onSubmit={handleSearch} className="mt-4 md:hidden">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.5 px-4 pr-12 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
      
      {/* Desktop navigation */}
      <nav className="hidden md:block border-t border-border">
        <div className="max-w-7xl mx-auto px-4">
          <ul className="flex items-center space-x-8">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-3 text-foreground hover:text-secondary transition-colors font-medium"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      
      {/* Mobile navigation */}
      {isMobileMenuOpen && (
        <nav className="md:hidden border-t border-border bg-white">
          <ul className="px-4 py-2">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block py-3 text-foreground hover:text-secondary transition-colors font-medium border-b border-border last:border-0"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/vendor/register"
                className="block py-3 text-secondary font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sell on ShopThings
              </Link>
            </li>
          </ul>
          
          {/* Mobile currency selector */}
          <div className="px-4 py-3 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2">Currency</p>
            <div className="flex flex-wrap gap-2">
              {Object.values(CURRENCIES).map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setCurrency(currency.code);
                  }}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    currentCurrency === currency.code
                      ? 'bg-secondary text-white'
                      : 'bg-muted hover:bg-border'
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
