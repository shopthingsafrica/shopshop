'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  Upload,
  Camera,
  Globe,
  Instagram,
  MessageCircle,
  Save,
  ArrowLeft,
  Package,
  ShoppingBag,
  BarChart3,
  Wallet,
  Users,
  Settings,
  Home,
  Menu,
  X,
  LogOut,
  ExternalLink,
  BadgeCheck,
  MapPin,
  Phone,
  Mail,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';

// Mock vendor data
const MOCK_VENDOR = {
  id: '1',
  store_name: 'Accra Textiles',
  description: 'Authentic Ghanaian textiles including Kente, Batik, and traditional fabrics. We are a family-owned business that has been operating for over 25 years.',
  logo_url: null,
  banner_url: null,
  is_verified: true,
  subscription: 'premium',
  email: 'contact@accratextiles.com',
  phone: '+233 20 123 4567',
  country: 'GH',
  city: 'Accra',
  address: '123 Independence Avenue, Accra, Ghana',
  website: 'https://accratextiles.com',
  instagram: '@accratextiles',
  tiktok: '@accratextiles',
  whatsapp: '+233201234567',
  shipping_policy: 'We ship worldwide within 3-5 business days. Free shipping on orders over $100.',
  return_policy: '30-day return policy for unused items in original packaging.',
  business_hours: 'Monday - Friday: 9AM - 6PM\nSaturday: 10AM - 4PM\nSunday: Closed',
};

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/vendor/dashboard', icon: Home },
  { label: 'Products', href: '/vendor/products', icon: Package },
  { label: 'Orders', href: '/vendor/orders', icon: ShoppingBag },
  { label: 'Analytics', href: '/vendor/analytics', icon: BarChart3 },
  { label: 'Wallet', href: '/vendor/wallet', icon: Wallet },
  { label: 'Customers', href: '/vendor/customers', icon: Users },
  { label: 'Settings', href: '/vendor/settings', icon: Settings },
];

const TABS = [
  { id: 'general', label: 'General' },
  { id: 'contact', label: 'Contact' },
  { id: 'social', label: 'Social Media' },
  { id: 'policies', label: 'Policies' },
];

export default function VendorSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    store_name: MOCK_VENDOR.store_name,
    description: MOCK_VENDOR.description,
    email: MOCK_VENDOR.email,
    phone: MOCK_VENDOR.phone,
    country: MOCK_VENDOR.country,
    city: MOCK_VENDOR.city,
    address: MOCK_VENDOR.address,
    website: MOCK_VENDOR.website,
    instagram: MOCK_VENDOR.instagram,
    tiktok: MOCK_VENDOR.tiktok,
    whatsapp: MOCK_VENDOR.whatsapp,
    shipping_policy: MOCK_VENDOR.shipping_policy,
    return_policy: MOCK_VENDOR.return_policy,
    business_hours: MOCK_VENDOR.business_hours,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    alert('Settings saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-primary text-white transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2">
            <Store className="w-8 h-8 text-secondary" />
            <span className="font-heading font-bold text-lg">
              Shop<span className="text-secondary">Things</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 hover:bg-white/10 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Vendor Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-secondary/20 rounded-full flex items-center justify-center">
              <Store className="w-5 h-5 text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <p className="font-medium truncate">{MOCK_VENDOR.store_name}</p>
                {MOCK_VENDOR.is_verified && (
                  <BadgeCheck className="w-4 h-4 text-secondary flex-shrink-0" />
                )}
              </div>
              <p className="text-xs text-white/60 capitalize">{MOCK_VENDOR.subscription} Plan</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/vendor/settings';
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                  ${isActive ? 'bg-secondary text-white' : 'text-white/80 hover:bg-white/10'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link
            href={`/vendors/${MOCK_VENDOR.id}`}
            className="flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ExternalLink className="w-5 h-5" />
            <span>View Public Store</span>
          </Link>
          <button className="flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors w-full">
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <Link
                  href="/vendor/dashboard"
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-heading font-bold text-primary">Store Settings</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Settings Content */}
        <main className="p-4 lg:p-6">
          {/* Banner & Logo Section */}
          <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
            {/* Banner */}
            <div className="relative h-48 bg-gradient-to-r from-primary to-secondary">
              {MOCK_VENDOR.banner_url ? (
                <div className="absolute inset-0 bg-gray-200" />
              ) : null}
              <button className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-lg text-sm font-medium">
                <Camera className="w-4 h-4" />
                Change Banner
              </button>
            </div>

            {/* Logo */}
            <div className="relative px-6 pb-6">
              <div className="absolute -top-12 left-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-white rounded-xl shadow-lg flex items-center justify-center border-4 border-white">
                    {MOCK_VENDOR.logo_url ? (
                      <span className="text-3xl font-bold text-primary">
                        {MOCK_VENDOR.store_name.charAt(0)}
                      </span>
                    ) : (
                      <Store className="w-10 h-10 text-gray-400" />
                    )}
                  </div>
                  <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-secondary text-white rounded-full flex items-center justify-center shadow hover:bg-secondary/90">
                    <Camera className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="pt-16">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-heading font-bold text-primary">
                    {MOCK_VENDOR.store_name}
                  </h2>
                  {MOCK_VENDOR.is_verified && (
                    <BadgeCheck className="w-5 h-5 text-secondary" />
                  )}
                </div>
                <p className="text-muted-foreground mt-1">
                  Manage your store profile and settings
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="border-b">
              <nav className="flex overflow-x-auto">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                      ${activeTab === tab.id
                        ? 'border-secondary text-secondary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                      }
                    `}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* General Tab */}
              {activeTab === 'general' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Store Name *
                    </label>
                    <Input
                      type="text"
                      name="store_name"
                      value={formData.store_name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Store Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-1">
                      {formData.description.length}/500 characters
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Country *
                      </label>
                      <select
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        required
                      >
                        <option value="NG">Nigeria</option>
                        <option value="GH">Ghana</option>
                        <option value="KE">Kenya</option>
                        <option value="ZA">South Africa</option>
                        <option value="EG">Egypt</option>
                        <option value="TZ">Tanzania</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        City *
                      </label>
                      <Input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Business Address
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                      <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full pl-10 pr-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Tab */}
              {activeTab === 'contact' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Business Hours
                    </label>
                    <textarea
                      name="business_hours"
                      value={formData.business_hours}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Monday - Friday: 9AM - 6PM&#10;Saturday: 10AM - 4PM&#10;Sunday: Closed"
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Social Media Tab */}
              {activeTab === 'social' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Website
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        placeholder="https://yourwebsite.com"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Instagram
                    </label>
                    <div className="relative">
                      <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="text"
                        name="instagram"
                        value={formData.instagram}
                        onChange={handleInputChange}
                        placeholder="@username"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      TikTok
                    </label>
                    <div className="relative">
                      <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                      <Input
                        type="text"
                        name="tiktok"
                        value={formData.tiktok}
                        onChange={handleInputChange}
                        placeholder="@username"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      WhatsApp
                    </label>
                    <div className="relative">
                      <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input
                        type="tel"
                        name="whatsapp"
                        value={formData.whatsapp}
                        onChange={handleInputChange}
                        placeholder="+234 800 000 0000"
                        className="pl-10"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Include country code for WhatsApp chat button to work
                    </p>
                  </div>
                </div>
              )}

              {/* Policies Tab */}
              {activeTab === 'policies' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Shipping Policy
                    </label>
                    <textarea
                      name="shipping_policy"
                      value={formData.shipping_policy}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Describe your shipping policy, delivery times, and any shipping fees..."
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Return Policy
                    </label>
                    <textarea
                      name="return_policy"
                      value={formData.return_policy}
                      onChange={handleInputChange}
                      rows={4}
                      placeholder="Describe your return and refund policy..."
                      className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    />
                  </div>
                </div>
              )}

              {/* Save Button */}
              <div className="mt-8 pt-6 border-t">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
