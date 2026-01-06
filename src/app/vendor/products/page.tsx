'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Store,
  Package,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Copy,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
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
  AlertTriangle,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useCurrencyStore } from '@/stores';
import { getProductImage } from '@/lib/placeholders';

// Mock vendor data
const MOCK_VENDOR = {
  id: '1',
  store_name: 'Accra Textiles',
  is_verified: true,
  subscription: 'premium',
};

// Mock products data
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Traditional Kente Cloth',
    slug: 'traditional-kente-cloth',
    price: 15000,
    compare_at_price: 18000,
    stock_quantity: 25,
    status: 'active',
    images: [],
    category: 'Textiles',
    sales: 45,
    views: 1250,
    created_at: '2024-01-01',
  },
  {
    id: '2',
    name: 'Ankara Print Fabric Set',
    slug: 'ankara-print-fabric-set',
    price: 8500,
    compare_at_price: null,
    stock_quantity: 5,
    status: 'active',
    images: [],
    category: 'Textiles',
    sales: 32,
    views: 890,
    created_at: '2024-01-05',
  },
  {
    id: '3',
    name: 'Batik Tie-Dye Fabric',
    slug: 'batik-tie-dye-fabric',
    price: 6000,
    compare_at_price: 7500,
    stock_quantity: 0,
    status: 'active',
    images: [],
    category: 'Textiles',
    sales: 28,
    views: 650,
    created_at: '2024-01-10',
  },
  {
    id: '4',
    name: 'Kente Stole Scarf',
    slug: 'kente-stole-scarf',
    price: 4500,
    compare_at_price: null,
    stock_quantity: 40,
    status: 'draft',
    images: [],
    category: 'Accessories',
    sales: 0,
    views: 0,
    created_at: '2024-01-12',
  },
  {
    id: '5',
    name: 'Adinkra Symbol T-Shirt',
    slug: 'adinkra-symbol-tshirt',
    price: 3500,
    compare_at_price: null,
    stock_quantity: 100,
    status: 'active',
    images: [],
    category: 'Apparel',
    sales: 67,
    views: 2100,
    created_at: '2024-01-08',
  },
];

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/vendor/dashboard', icon: Home },
  { label: 'Products', href: '/vendor/products', icon: Package },
  { label: 'Orders', href: '/vendor/orders', icon: ShoppingBag },
  { label: 'Analytics', href: '/vendor/analytics', icon: BarChart3 },
  { label: 'Wallet', href: '/vendor/wallet', icon: Wallet },
  { label: 'Customers', href: '/vendor/customers', icon: Users },
  { label: 'Settings', href: '/vendor/settings', icon: Settings },
];

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-800',
  draft: 'bg-gray-100 text-gray-800',
  archived: 'bg-red-100 text-red-800',
};

export default function VendorProductsPage() {
  const { formatConvertedPrice } = useCurrencyStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const toggleProductSelection = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const toggleAllProducts = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      console.log('Delete product:', productId);
      setShowActions(null);
    }
  };

  const handleToggleStatus = (productId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'draft' : 'active';
    console.log('Toggle status:', productId, newStatus);
    setShowActions(null);
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
              <h1 className="text-xl font-heading font-bold text-primary">Products</h1>
            </div>
            
            <Link href="/vendor/products/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </header>

        {/* Products Content */}
        <main className="p-4 lg:p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold text-primary mt-1">{MOCK_PRODUCTS.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Active</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {MOCK_PRODUCTS.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600 mt-1">
                {MOCK_PRODUCTS.filter(p => p.stock_quantity === 0).length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {MOCK_PRODUCTS.filter(p => p.stock_quantity > 0 && p.stock_quantity <= 10).length}
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm mb-6">
            <div className="p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </select>
                <Button variant="outline">
                  <Filter className="w-4 h-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>

            {/* Bulk Actions */}
            {selectedProducts.length > 0 && (
              <div className="px-4 py-2 bg-gray-50 border-t flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {selectedProducts.length} selected
                </span>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-2" />
                  Activate
                </Button>
                <Button variant="outline" size="sm">
                  <EyeOff className="w-4 h-4 mr-2" />
                  Deactivate
                </Button>
                <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                        onChange={toggleAllProducts}
                        className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      <button className="flex items-center gap-1 hover:text-foreground">
                        Product
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      <button className="flex items-center gap-1 hover:text-foreground">
                        Price
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      <button className="flex items-center gap-1 hover:text-foreground">
                        Stock
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">
                      <button className="flex items-center gap-1 hover:text-foreground">
                        Sales
                        <ArrowUpDown className="w-3 h-3" />
                      </button>
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                          className="w-4 h-4 rounded border-gray-300 text-secondary focus:ring-secondary"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={getProductImage(product.images, product.id)}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <Link
                              href={`/vendor/products/${product.id}/edit`}
                              className="font-medium text-foreground hover:text-secondary"
                            >
                              {product.name}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              {product.views} views
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${
                          STATUS_COLORS[product.status]
                        }`}>
                          {product.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{formatConvertedPrice(product.price, 'NGN')}</p>
                        {product.compare_at_price && (
                          <p className="text-xs text-muted-foreground line-through">
                            {formatConvertedPrice(product.compare_at_price, 'NGN')}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {product.stock_quantity === 0 ? (
                            <>
                              <AlertTriangle className="w-4 h-4 text-red-500" />
                              <span className="text-red-600 font-medium">Out of stock</span>
                            </>
                          ) : product.stock_quantity <= 10 ? (
                            <>
                              <AlertTriangle className="w-4 h-4 text-yellow-500" />
                              <span className="text-yellow-600 font-medium">{product.stock_quantity} left</span>
                            </>
                          ) : (
                            <span>{product.stock_quantity}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {product.category}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {product.sales}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1 relative">
                          <Link
                            href={`/products/${product.slug}`}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="View product"
                          >
                            <ExternalLink className="w-4 h-4 text-muted-foreground" />
                          </Link>
                          <Link
                            href={`/vendor/products/${product.id}/edit`}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4 text-muted-foreground" />
                          </Link>
                          <div className="relative">
                            <button
                              onClick={() => setShowActions(showActions === product.id ? null : product.id)}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <MoreVertical className="w-4 h-4 text-muted-foreground" />
                            </button>
                            
                            {showActions === product.id && (
                              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border z-10">
                                <button
                                  onClick={() => handleToggleStatus(product.id, product.status)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                  {product.status === 'active' ? (
                                    <>
                                      <EyeOff className="w-4 h-4" />
                                      Deactivate
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4" />
                                      Activate
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      `${window.location.origin}/products/${product.slug}`
                                    );
                                    setShowActions(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                                >
                                  <Copy className="w-4 h-4" />
                                  Copy Link
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Delete
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-4 py-3 border-t flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredProducts.length} of {MOCK_PRODUCTS.length} products
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm px-3">Page {currentPage}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-heading font-bold text-primary mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery
                  ? "No products match your search criteria"
                  : "Start by adding your first product"}
              </p>
              {!searchQuery && (
                <Link href="/vendor/products/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </Link>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Click outside to close actions menu */}
      {showActions && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowActions(null)}
        />
      )}
    </div>
  );
}
