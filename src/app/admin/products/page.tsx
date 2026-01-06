'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Store,
  Package,
  ShoppingBag,
  BarChart3,
  Users,
  Settings,
  Home,
  Menu,
  X,
  LogOut,
  Shield,
  Search,
  Download,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Eye,
  XCircle,
  CheckCircle,
  Clock,
  Flag,
  AlertTriangle,
  Calendar,
  FileText,
  ImageIcon,
  Tag,
  DollarSign,
  Star,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useCurrencyStore } from '@/stores';
import { getProductImage } from '@/lib/placeholders';

// Mock products data for moderation
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Traditional Kente Cloth',
    slug: 'traditional-kente-cloth',
    description: 'Authentic hand-woven Kente cloth from Ghana. This beautiful textile features traditional Ashanti patterns passed down through generations.',
    price: 15000,
    compare_at_price: 18000,
    status: 'pending_review',
    vendor: {
      id: '1',
      store_name: 'Accra Textiles',
      is_verified: true,
    },
    category: 'Fashion & Clothing',
    images: [],
    stock_quantity: 25,
    created_at: '2024-01-17T10:30:00Z',
    submitted_at: '2024-01-17T10:30:00Z',
  },
  {
    id: '2',
    name: 'Ankara Print Fabric Set',
    slug: 'ankara-print-fabric-set',
    description: 'Vibrant Ankara print fabric, perfect for traditional and modern African fashion designs.',
    price: 8500,
    compare_at_price: null,
    status: 'pending_review',
    vendor: {
      id: '2',
      store_name: 'Lagos Fashion Hub',
      is_verified: true,
    },
    category: 'Fashion & Clothing',
    images: [],
    stock_quantity: 50,
    created_at: '2024-01-16T14:00:00Z',
    submitted_at: '2024-01-16T14:00:00Z',
  },
  {
    id: '3',
    name: 'Wooden Carved Mask',
    slug: 'wooden-carved-mask',
    description: 'Handcrafted wooden mask representing traditional African artistry.',
    price: 12000,
    compare_at_price: 15000,
    status: 'approved',
    vendor: {
      id: '4',
      store_name: 'African Arts Gallery',
      is_verified: false,
    },
    category: 'Art & Crafts',
    images: [],
    stock_quantity: 10,
    created_at: '2024-01-15T11:20:00Z',
    approved_at: '2024-01-15T14:30:00Z',
  },
  {
    id: '4',
    name: 'Beaded Necklace Set',
    slug: 'beaded-necklace-set',
    description: 'Beautiful handmade beaded necklace with matching earrings.',
    price: 4500,
    compare_at_price: null,
    status: 'rejected',
    vendor: {
      id: '3',
      store_name: 'Nairobi Crafts',
      is_verified: false,
    },
    category: 'Jewelry',
    images: [],
    stock_quantity: 15,
    created_at: '2024-01-14T09:00:00Z',
    rejection_reason: 'Poor image quality. Please upload higher resolution product images.',
    rejected_at: '2024-01-14T16:00:00Z',
  },
  {
    id: '5',
    name: 'Leather Handbag',
    slug: 'leather-handbag',
    description: 'Premium quality leather handbag with African-inspired designs.',
    price: 22000,
    compare_at_price: 28000,
    status: 'flagged',
    vendor: {
      id: '7',
      store_name: 'Morocco Leather',
      is_verified: false,
    },
    category: 'Bags & Accessories',
    images: [],
    stock_quantity: 8,
    created_at: '2024-01-13T10:30:00Z',
    flag_reason: 'Suspected counterfeit product. Description claims "genuine Italian leather" but vendor is based in Morocco.',
    flagged_at: '2024-01-14T11:00:00Z',
  },
  {
    id: '6',
    name: 'Ethiopian Coffee Beans',
    slug: 'ethiopian-coffee-beans',
    description: 'Premium single-origin Ethiopian coffee beans from the highlands of Yirgacheffe.',
    price: 3500,
    compare_at_price: null,
    status: 'pending_review',
    vendor: {
      id: '5',
      store_name: 'Addis Designs',
      is_verified: false,
    },
    category: 'Food & Beverages',
    images: [],
    stock_quantity: 100,
    created_at: '2024-01-17T08:00:00Z',
    submitted_at: '2024-01-17T08:00:00Z',
  },
];

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Vendors', href: '/admin/vendors', icon: Store },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { label: 'Reports', href: '/admin/reports', icon: FileText },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
];

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  pending_review: { label: 'Pending Review', bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
  approved: { label: 'Approved', bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
  rejected: { label: 'Rejected', bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
  flagged: { label: 'Flagged', bg: 'bg-orange-100', text: 'text-orange-800', icon: Flag },
};

export default function AdminProductsPage() {
  const { formatConvertedPrice } = useCurrencyStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [showFlagModal, setShowFlagModal] = useState<string | null>(null);
  const [reasonText, setReasonText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.vendor.store_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getProduct = (id: string) => MOCK_PRODUCTS.find(p => p.id === id);

  const pendingProducts = MOCK_PRODUCTS.filter(p => p.status === 'pending_review');

  const handleApprove = (productId: string) => {
    console.log('Approve product:', productId);
    setShowActions(null);
  };

  const handleReject = (productId: string) => {
    console.log('Reject product:', productId, 'Reason:', reasonText);
    setShowRejectModal(null);
    setReasonText('');
  };

  const handleFlag = (productId: string) => {
    console.log('Flag product:', productId, 'Reason:', reasonText);
    setShowFlagModal(null);
    setReasonText('');
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
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Admin Badge */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <Shield className="w-5 h-5 text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium">Admin Panel</p>
              <p className="text-xs text-white/60">Super Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === '/admin/products';
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
                {item.label === 'Products' && pendingProducts.length > 0 && (
                  <span className="ml-auto bg-yellow-500 text-xs px-2 py-0.5 rounded-full">
                    {pendingProducts.length}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 text-white/80 hover:bg-white/10 rounded-lg transition-colors"
          >
            <Store className="w-5 h-5" />
            <span>View Store</span>
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
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-heading font-bold text-primary">Product Moderation</h1>
            </div>

            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Total Products</p>
              <p className="text-2xl font-bold text-primary mt-1">{MOCK_PRODUCTS.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {MOCK_PRODUCTS.filter(p => p.status === 'pending_review').length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Flagged</p>
              <p className="text-2xl font-bold text-orange-600 mt-1">
                {MOCK_PRODUCTS.filter(p => p.status === 'flagged').length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Approved Today</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {MOCK_PRODUCTS.filter(p => p.status === 'approved').length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search products or vendors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                    aria-label="Filter by status"
                  >
                    <option value="all">All Status</option>
                    <option value="pending_review">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="flagged">Flagged</option>
                  </select>
                </div>
              </div>

              {/* Product Cards */}
              {filteredProducts.map((product) => {
                const statusConfig = STATUS_CONFIG[product.status];
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={product.id}
                    className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${
                      selectedProduct === product.id ? 'ring-2 ring-secondary' : ''
                    }`}
                    onClick={() => setSelectedProduct(product.id)}
                  >
                    <div className="p-4">
                      <div className="flex gap-4">
                        {/* Product Image */}
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          <Image
                            src={getProductImage(product.images, product.id)}
                            alt={product.name}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <h3 className="font-medium text-foreground truncate pr-2">{product.name}</h3>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusConfig.label}
                              </span>
                              <div className="relative">
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowActions(showActions === product.id ? null : product.id);
                                  }}
                                  className="p-1 hover:bg-gray-100 rounded"
                                  aria-label="More actions"
                                >
                                  <MoreVertical className="w-4 h-4 text-gray-500" />
                                </button>
                                {showActions === product.id && (
                                  <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                                    <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-50">
                                      <Eye className="w-4 h-4" />
                                      View Details
                                    </button>
                                    {product.status === 'pending_review' && (
                                      <>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleApprove(product.id);
                                          }}
                                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-green-600 hover:bg-green-50"
                                        >
                                          <CheckCircle className="w-4 h-4" />
                                          Approve
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setShowRejectModal(product.id);
                                            setShowActions(null);
                                          }}
                                          className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                                        >
                                          <XCircle className="w-4 h-4" />
                                          Reject
                                        </button>
                                      </>
                                    )}
                                    {product.status !== 'flagged' && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setShowFlagModal(product.id);
                                          setShowActions(null);
                                        }}
                                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-orange-600 hover:bg-orange-50"
                                      >
                                        <Flag className="w-4 h-4" />
                                        Flag Product
                                      </button>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-2">
                            by <span className="text-foreground">{product.vendor.store_name}</span>
                          </p>

                          <div className="flex items-center gap-4 text-sm">
                            <span className="flex items-center gap-1">
                              <Tag className="w-4 h-4 text-gray-400" />
                              {product.category}
                            </span>
                            <span className="font-medium text-primary">
                              {formatConvertedPrice(product.price, 'NGN')}
                            </span>
                            {product.compare_at_price && (
                              <span className="text-muted-foreground line-through">
                                {formatConvertedPrice(product.compare_at_price, 'NGN')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions for Pending */}
                    {product.status === 'pending_review' && (
                      <div className="px-4 py-3 bg-yellow-50 border-t border-yellow-100 flex items-center justify-between">
                        <span className="text-sm text-yellow-800">
                          Submitted {new Date(product.submitted_at || product.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowRejectModal(product.id);
                            }}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(product.id);
                            }}
                          >
                            Approve
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Flagged Alert */}
                    {product.status === 'flagged' && product.flag_reason && (
                      <div className="px-4 py-3 bg-orange-50 border-t border-orange-100">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
                          <p className="text-sm text-orange-800">{product.flag_reason}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Pagination */}
              <div className="flex items-center justify-between py-4">
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

            {/* Product Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedProduct ? (
                <div className="bg-white rounded-xl shadow-sm sticky top-24">
                  {(() => {
                    const product = getProduct(selectedProduct);
                    if (!product) return null;

                    const statusConfig = STATUS_CONFIG[product.status];

                    return (
                      <>
                        <div className="p-4 border-b">
                          <h2 className="font-heading font-bold text-primary">Product Details</h2>
                        </div>
                        <div className="p-4 space-y-4">
                          {/* Product Image */}
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <Image
                              src={getProductImage(product.images, product.id)}
                              alt={product.name}
                              width={400}
                              height={400}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Product Name & Status */}
                          <div>
                            <h3 className="font-bold text-foreground">{product.name}</h3>
                            <span className={`inline-flex items-center gap-1 mt-2 px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                              {statusConfig.label}
                            </span>
                          </div>

                          {/* Vendor */}
                          <div className="pt-4 border-t">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Vendor</p>
                            <Link
                              href={`/admin/vendors?id=${product.vendor.id}`}
                              className="flex items-center gap-2 hover:text-secondary"
                            >
                              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <Store className="w-4 h-4 text-gray-400" />
                              </div>
                              <span className="font-medium">{product.vendor.store_name}</span>
                            </Link>
                          </div>

                          {/* Pricing */}
                          <div className="pt-4 border-t">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Pricing</p>
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span className="text-xl font-bold text-primary">{formatConvertedPrice(product.price, 'NGN')}</span>
                              {product.compare_at_price && (
                                <span className="text-sm text-muted-foreground line-through">
                                  {formatConvertedPrice(product.compare_at_price, 'NGN')}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Category */}
                          <div className="pt-4 border-t">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Category</p>
                            <div className="flex items-center gap-2">
                              <Tag className="w-4 h-4 text-gray-400" />
                              <span>{product.category}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <div className="pt-4 border-t">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                            <p className="text-sm text-foreground">{product.description}</p>
                          </div>

                          {/* Stock */}
                          <div className="pt-4 border-t">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Stock Quantity</p>
                            <p className="font-medium">{product.stock_quantity} units</p>
                          </div>

                          {/* Rejection Reason */}
                          {product.rejection_reason && (
                            <div className="pt-4 border-t">
                              <p className="text-sm font-medium text-red-600 mb-2">Rejection Reason</p>
                              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                {product.rejection_reason}
                              </p>
                            </div>
                          )}

                          {/* Flag Reason */}
                          {product.flag_reason && (
                            <div className="pt-4 border-t">
                              <p className="text-sm font-medium text-orange-600 mb-2">Flag Reason</p>
                              <p className="text-sm text-orange-600 bg-orange-50 p-3 rounded-lg">
                                {product.flag_reason}
                              </p>
                            </div>
                          )}

                          {/* Created Date */}
                          <div className="pt-4 border-t">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Created on {new Date(product.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          {product.status === 'pending_review' && (
                            <div className="pt-4 border-t flex gap-2">
                              <Button
                                variant="outline"
                                className="flex-1 text-red-600 border-red-200 hover:bg-red-50"
                                onClick={() => setShowRejectModal(product.id)}
                              >
                                Reject
                              </Button>
                              <Button
                                className="flex-1"
                                onClick={() => handleApprove(product.id)}
                              >
                                Approve
                              </Button>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a product to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-heading font-bold text-primary">Reject Product</h2>
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setReasonText('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Please provide a reason for rejecting this product. This will be sent to the vendor.
              </p>
              <textarea
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={4}
              />
            </div>
            <div className="p-4 border-t flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectModal(null);
                  setReasonText('');
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                disabled={!reasonText.trim()}
                onClick={() => handleReject(showRejectModal)}
              >
                Reject Product
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Flag Modal */}
      {showFlagModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="font-heading font-bold text-primary">Flag Product</h2>
              <button
                onClick={() => {
                  setShowFlagModal(null);
                  setReasonText('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Flag this product for further review. Please provide a reason.
              </p>
              <textarea
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Enter flag reason..."
                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={4}
              />
            </div>
            <div className="p-4 border-t flex items-center justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowFlagModal(null);
                  setReasonText('');
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-orange-600 hover:bg-orange-700"
                disabled={!reasonText.trim()}
                onClick={() => handleFlag(showFlagModal)}
              >
                Flag Product
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
