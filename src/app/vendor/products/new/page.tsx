'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Store,
  Package,
  ArrowLeft,
  Save,
  X,
  ShoppingBag,
  BarChart3,
  Wallet,
  Users,
  Settings,
  Home,
  Menu,
  LogOut,
  ExternalLink,
  BadgeCheck,
} from 'lucide-react';
import { Button, Input, ImageUpload } from '@/components/ui';
import { STORAGE_BUCKETS } from '@/lib/storage';

// Mock vendor data
const MOCK_VENDOR = {
  id: '1',
  store_name: 'Accra Textiles',
  is_verified: true,
  subscription: 'premium',
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

const CATEGORIES = [
  { id: '1', name: 'Fashion & Apparel' },
  { id: '2', name: 'Textiles & Fabrics' },
  { id: '3', name: 'Beauty & Personal Care' },
  { id: '4', name: 'Art & Crafts' },
  { id: '5', name: 'Home & Living' },
  { id: '6', name: 'Jewelry & Accessories' },
  { id: '7', name: 'Food & Beverages' },
];

export default function NewProductPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    compare_at_price: '',
    stock_quantity: '',
    sku: '',
    weight: '',
    dimensions: '',
    status: 'draft',
    is_featured: false,
    tags: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (imageUrls.length === 0) {
      alert('Please upload at least one product image');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare product data
      const productData = {
        ...formData,
        images: imagePaths, // Store storage paths in database
        price: parseFloat(formData.price),
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        stock_quantity: parseInt(formData.stock_quantity),
      };
      
      console.log('Product data:', productData);
      
      // TODO: Call API to create product
      // await createProduct(productData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Redirect to products list
      router.push('/vendor/products');
    } catch (error) {
      console.error('Failed to create product:', error);
      alert('Failed to create product. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
            const isActive = item.href === '/vendor/products';
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
                  href="/vendor/products"
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Link>
                <h1 className="text-xl font-heading font-bold text-primary">Add New Product</h1>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => router.push('/vendor/products')}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Product
                  </>
                )}
              </Button>
            </div>
          </div>
        </header>

        {/* Form Content */}
        <main className="p-4 lg:p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-heading font-bold text-primary mb-4">Basic Information</h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Product Name *
                      </label>
                      <Input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Description *
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={6}
                        placeholder="Describe your product in detail..."
                        className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                        required
                      />
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.description.length}/2000 characters
                      </p>
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-heading font-bold text-primary mb-4">Product Images *</h2>
                  
                  <ImageUpload
                    bucket={STORAGE_BUCKETS.products}
                    path={MOCK_VENDOR.id}
                    multiple
                    maxFiles={10}
                    value={imageUrls}
                    onChange={(urls) => setImageUrls(urls as string[])}
                    onPathsChange={(paths) => setImagePaths(paths as string[])}
                    compress
                  />
                  
                  <p className="text-sm text-muted-foreground mt-4">
                    Upload up to 10 images. First image will be the main product image. 
                    Recommended size: 1000x1000px. Maximum 5MB per image.
                  </p>
                </div>

                {/* Pricing & Inventory */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-heading font-bold text-primary mb-4">Pricing & Inventory</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Price (₦) *
                      </label>
                      <Input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Compare at Price (₦)
                      </label>
                      <Input
                        type="number"
                        name="compare_at_price"
                        value={formData.compare_at_price}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        min="0"
                        step="0.01"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Original price to show discount
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Stock Quantity *
                      </label>
                      <Input
                        type="number"
                        name="stock_quantity"
                        value={formData.stock_quantity}
                        onChange={handleInputChange}
                        placeholder="0"
                        min="0"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        SKU
                      </label>
                      <Input
                        type="text"
                        name="sku"
                        value={formData.sku}
                        onChange={handleInputChange}
                        placeholder="Product SKU"
                      />
                    </div>
                  </div>
                </div>

                {/* Shipping */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-heading font-bold text-primary mb-4">Shipping Information</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Weight (kg)
                      </label>
                      <Input
                        type="number"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        placeholder="0.0"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Dimensions (LxWxH cm)
                      </label>
                      <Input
                        type="text"
                        name="dimensions"
                        value={formData.dimensions}
                        onChange={handleInputChange}
                        placeholder="e.g., 20x15x5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Status */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-heading font-bold text-primary mb-4">Status</h2>
                  
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="status"
                        value="active"
                        checked={formData.status === 'active'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-secondary focus:ring-secondary"
                      />
                      <div>
                        <p className="font-medium">Active</p>
                        <p className="text-sm text-muted-foreground">Visible to customers</p>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="radio"
                        name="status"
                        value="draft"
                        checked={formData.status === 'draft'}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-secondary focus:ring-secondary"
                      />
                      <div>
                        <p className="font-medium">Draft</p>
                        <p className="text-sm text-muted-foreground">Hidden from store</p>
                      </div>
                    </label>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="is_featured"
                        checked={formData.is_featured}
                        onChange={handleInputChange}
                        className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                      />
                      <span className="text-sm font-medium">Featured Product</span>
                    </label>
                  </div>
                </div>

                {/* Category */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-heading font-bold text-primary mb-4">Category</h2>
                  
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    required
                  >
                    <option value="">Select category</option>
                    {CATEGORIES.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* Tags */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h2 className="font-heading font-bold text-primary mb-4">Tags</h2>
                  
                  <Input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="Enter tags separated by commas"
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    e.g., handmade, african, kente, traditional
                  </p>
                </div>

                {/* Quick Tips */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                  <h3 className="font-heading font-bold text-blue-800 mb-3">Quick Tips</h3>
                  <ul className="space-y-2 text-sm text-blue-700">
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Use high-quality images with good lighting</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Write detailed descriptions including materials and dimensions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Price competitively by checking similar products</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span>•</span>
                      <span>Use relevant tags to improve searchability</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
