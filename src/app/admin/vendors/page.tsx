'use client';

import { useState } from 'react';
import Link from 'next/link';
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
  BadgeCheck,
  XCircle,
  CheckCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  Calendar,
  FileText,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useCurrencyStore } from '@/stores';

// Mock vendors data
const MOCK_VENDORS = [
  {
    id: '1',
    store_name: 'Accra Textiles',
    owner_name: 'Kwame Asante',
    email: 'kwame@accratextiles.com',
    phone: '+233 20 123 4567',
    status: 'approved',
    is_verified: true,
    location: 'Accra, Ghana',
    category: 'Fashion & Clothing',
    products: 156,
    total_sales: 4500000,
    created_at: '2023-09-15T10:30:00Z',
    description: 'Premium African textiles and traditional wear',
    logo_url: null,
  },
  {
    id: '2',
    store_name: 'Lagos Fashion Hub',
    owner_name: 'Chioma Eze',
    email: 'chioma@lagosfashion.com',
    phone: '+234 801 234 5678',
    status: 'approved',
    is_verified: true,
    location: 'Lagos, Nigeria',
    category: 'Fashion & Clothing',
    products: 89,
    total_sales: 3200000,
    created_at: '2023-10-20T08:15:00Z',
    description: 'Contemporary African fashion for the modern woman',
    logo_url: null,
  },
  {
    id: '3',
    store_name: 'Nairobi Crafts',
    owner_name: 'John Kamau',
    email: 'john@nairobicrafts.com',
    phone: '+254 70 987 6543',
    status: 'pending',
    is_verified: false,
    location: 'Nairobi, Kenya',
    category: 'Art & Crafts',
    products: 0,
    total_sales: 0,
    created_at: '2024-01-15T14:00:00Z',
    description: 'Handmade Kenyan crafts and home decor',
    logo_url: null,
    documents: ['business_license.pdf', 'tax_certificate.pdf'],
  },
  {
    id: '4',
    store_name: 'African Arts Gallery',
    owner_name: 'Amara Diop',
    email: 'amara@africanarts.com',
    phone: '+221 77 456 7890',
    status: 'approved',
    is_verified: false,
    location: 'Dakar, Senegal',
    category: 'Art & Crafts',
    products: 67,
    total_sales: 2100000,
    created_at: '2023-11-05T11:20:00Z',
    description: 'Authentic West African art and sculptures',
    logo_url: null,
  },
  {
    id: '5',
    store_name: 'Addis Designs',
    owner_name: 'Solomon Bekele',
    email: 'solomon@addisdesigns.com',
    phone: '+251 91 234 5678',
    status: 'pending',
    is_verified: false,
    location: 'Addis Ababa, Ethiopia',
    category: 'Fashion & Clothing',
    products: 0,
    total_sales: 0,
    created_at: '2024-01-17T09:00:00Z',
    description: 'Traditional Ethiopian garments and accessories',
    logo_url: null,
    documents: ['business_license.pdf'],
  },
  {
    id: '6',
    store_name: 'Cape Jewelry',
    owner_name: 'Thandiwe Nkosi',
    email: 'thandiwe@capejewelry.com',
    phone: '+27 82 345 6789',
    status: 'rejected',
    is_verified: false,
    location: 'Cape Town, South Africa',
    category: 'Jewelry',
    products: 0,
    total_sales: 0,
    created_at: '2024-01-10T16:45:00Z',
    rejection_reason: 'Incomplete documentation - missing business license',
    logo_url: null,
  },
  {
    id: '7',
    store_name: 'Morocco Leather',
    owner_name: 'Youssef Alaoui',
    email: 'youssef@moroccoleather.com',
    phone: '+212 661 234 567',
    status: 'suspended',
    is_verified: false,
    location: 'Marrakech, Morocco',
    category: 'Bags & Accessories',
    products: 45,
    total_sales: 890000,
    created_at: '2023-08-20T10:30:00Z',
    suspension_reason: 'Multiple customer complaints about product quality',
    logo_url: null,
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

const STATUS_COLORS: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
  approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
  rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
  suspended: { bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertTriangle },
};

export default function AdminVendorsPage() {
  const { formatPrice } = useCurrencyStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredVendors = MOCK_VENDORS.filter((vendor) => {
    const matchesSearch =
      vendor.store_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.owner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vendor.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getVendor = (id: string) => MOCK_VENDORS.find(v => v.id === id);

  const pendingVendors = MOCK_VENDORS.filter(v => v.status === 'pending');

  const handleApprove = (vendorId: string) => {
    console.log('Approve vendor:', vendorId);
    setShowActions(null);
  };

  const handleReject = (vendorId: string) => {
    console.log('Reject vendor:', vendorId, 'Reason:', rejectReason);
    setShowRejectModal(null);
    setRejectReason('');
  };

  const handleVerify = (vendorId: string) => {
    console.log('Verify vendor:', vendorId);
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
            const isActive = item.href === '/admin/vendors';
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
                {item.label === 'Vendors' && pendingVendors.length > 0 && (
                  <span className="ml-auto bg-yellow-500 text-xs px-2 py-0.5 rounded-full">
                    {pendingVendors.length}
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
              >
                <Menu className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-heading font-bold text-primary">Vendor Management</h1>
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
              <p className="text-sm text-muted-foreground">Total Vendors</p>
              <p className="text-2xl font-bold text-primary mt-1">{MOCK_VENDORS.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Pending Approval</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {MOCK_VENDORS.filter(v => v.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Verified</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {MOCK_VENDORS.filter(v => v.is_verified).length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Total Sales</p>
              <p className="text-2xl font-bold text-secondary mt-1">
                {formatPrice(MOCK_VENDORS.reduce((sum, v) => sum + v.total_sales, 0))}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vendors List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Filters */}
              <div className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="Search vendors..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Vendor Cards */}
              {filteredVendors.map((vendor) => {
                const statusConfig = STATUS_COLORS[vendor.status];
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={vendor.id}
                    className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${
                      selectedVendor === vendor.id ? 'ring-2 ring-secondary' : ''
                    }`}
                    onClick={() => setSelectedVendor(vendor.id)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Store className="w-6 h-6 text-gray-400" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-foreground">{vendor.store_name}</h3>
                              {vendor.is_verified && (
                                <BadgeCheck className="w-4 h-4 text-secondary" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{vendor.owner_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                            <StatusIcon className="w-3 h-3" />
                            {vendor.status}
                          </span>
                          <div className="relative">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setShowActions(showActions === vendor.id ? null : vendor.id);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                              <MoreVertical className="w-4 h-4 text-gray-500" />
                            </button>
                            {showActions === vendor.id && (
                              <div className="absolute right-0 mt-1 w-48 bg-white border rounded-lg shadow-lg z-10">
                                <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-gray-50">
                                  <Eye className="w-4 h-4" />
                                  View Details
                                </button>
                                {vendor.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleApprove(vendor.id);
                                      }}
                                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-green-600 hover:bg-green-50"
                                    >
                                      <CheckCircle className="w-4 h-4" />
                                      Approve
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setShowRejectModal(vendor.id);
                                        setShowActions(null);
                                      }}
                                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50"
                                    >
                                      <XCircle className="w-4 h-4" />
                                      Reject
                                    </button>
                                  </>
                                )}
                                {vendor.status === 'approved' && !vendor.is_verified && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVerify(vendor.id);
                                    }}
                                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-secondary hover:bg-secondary/10"
                                  >
                                    <BadgeCheck className="w-4 h-4" />
                                    Grant Verified Badge
                                  </button>
                                )}
                                {vendor.status === 'approved' && (
                                  <button className="flex items-center gap-2 w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-red-50">
                                    <AlertTriangle className="w-4 h-4" />
                                    Suspend Vendor
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mt-3 flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {vendor.location}
                        </span>
                        <span>{vendor.category}</span>
                      </div>

                      {vendor.status === 'approved' && (
                        <div className="mt-3 flex items-center gap-6 text-sm">
                          <span>
                            <span className="font-medium text-foreground">{vendor.products}</span>
                            <span className="text-muted-foreground"> products</span>
                          </span>
                          <span>
                            <span className="font-medium text-green-600">{formatPrice(vendor.total_sales)}</span>
                            <span className="text-muted-foreground"> sales</span>
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Quick Actions for Pending */}
                    {vendor.status === 'pending' && (
                      <div className="px-4 py-3 bg-yellow-50 border-t border-yellow-100 flex items-center justify-between">
                        <span className="text-sm text-yellow-800">
                          Awaiting review since {new Date(vendor.created_at).toLocaleDateString()}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowRejectModal(vendor.id);
                            }}
                          >
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApprove(vendor.id);
                            }}
                          >
                            Approve
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Pagination */}
              <div className="flex items-center justify-between py-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredVendors.length} of {MOCK_VENDORS.length} vendors
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

            {/* Vendor Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedVendor ? (
                <div className="bg-white rounded-xl shadow-sm sticky top-24">
                  {(() => {
                    const vendor = getVendor(selectedVendor);
                    if (!vendor) return null;

                    const statusConfig = STATUS_COLORS[vendor.status];

                    return (
                      <>
                        <div className="p-4 border-b">
                          <h2 className="font-heading font-bold text-primary">Vendor Details</h2>
                        </div>
                        <div className="p-4 space-y-4">
                          {/* Store Info */}
                          <div className="text-center">
                            <div className="w-20 h-20 bg-gray-200 rounded-lg mx-auto flex items-center justify-center mb-3">
                              <Store className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="font-bold text-foreground flex items-center justify-center gap-1">
                              {vendor.store_name}
                              {vendor.is_verified && (
                                <BadgeCheck className="w-5 h-5 text-secondary" />
                              )}
                            </h3>
                            <p className="text-sm text-muted-foreground">{vendor.category}</p>
                            <span className={`inline-flex items-center gap-1 mt-2 px-2 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                              {vendor.status}
                            </span>
                          </div>

                          {/* Contact */}
                          <div className="pt-4 border-t space-y-2">
                            <p className="text-sm font-medium text-muted-foreground">Owner</p>
                            <p className="font-medium">{vendor.owner_name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              {vendor.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              {vendor.phone}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              {vendor.location}
                            </div>
                          </div>

                          {/* Description */}
                          <div className="pt-4 border-t">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                            <p className="text-sm">{vendor.description}</p>
                          </div>

                          {/* Stats */}
                          {vendor.status === 'approved' && (
                            <div className="pt-4 border-t grid grid-cols-2 gap-4">
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-xl font-bold text-foreground">{vendor.products}</p>
                                <p className="text-xs text-muted-foreground">Products</p>
                              </div>
                              <div className="text-center p-3 bg-gray-50 rounded-lg">
                                <p className="text-xl font-bold text-green-600">{formatPrice(vendor.total_sales)}</p>
                                <p className="text-xs text-muted-foreground">Total Sales</p>
                              </div>
                            </div>
                          )}

                          {/* Documents */}
                          {vendor.documents && (
                            <div className="pt-4 border-t">
                              <p className="text-sm font-medium text-muted-foreground mb-2">Submitted Documents</p>
                              <div className="space-y-2">
                                {vendor.documents.map((doc, i) => (
                                  <button
                                    key={i}
                                    className="flex items-center gap-2 w-full p-2 rounded-lg hover:bg-gray-50 text-sm"
                                  >
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span className="flex-1 text-left">{doc}</span>
                                    <ExternalLink className="w-4 h-4 text-gray-400" />
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Rejection/Suspension Reason */}
                          {vendor.rejection_reason && (
                            <div className="pt-4 border-t">
                              <p className="text-sm font-medium text-red-600 mb-2">Rejection Reason</p>
                              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                                {vendor.rejection_reason}
                              </p>
                            </div>
                          )}
                          {vendor.suspension_reason && (
                            <div className="pt-4 border-t">
                              <p className="text-sm font-medium text-gray-600 mb-2">Suspension Reason</p>
                              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                {vendor.suspension_reason}
                              </p>
                            </div>
                          )}

                          {/* Created Date */}
                          <div className="pt-4 border-t">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Registered on {new Date(vendor.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}
                              </span>
                            </div>
                          </div>

                          {/* Actions */}
                          {vendor.status === 'approved' && (
                            <div className="pt-4 border-t">
                              <Link
                                href={`/vendors/${vendor.id}`}
                                className="flex items-center justify-center gap-2 w-full py-2 border rounded-lg text-sm hover:bg-gray-50"
                              >
                                <ExternalLink className="w-4 h-4" />
                                View Public Store
                              </Link>
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <Store className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select a vendor to view details
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
              <h2 className="font-heading font-bold text-primary">Reject Vendor Application</h2>
              <button
                onClick={() => {
                  setShowRejectModal(null);
                  setRejectReason('');
                }}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Please provide a reason for rejecting this vendor application. This will be sent to the vendor.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
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
                  setRejectReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 hover:bg-red-700"
                disabled={!rejectReason.trim()}
                onClick={() => handleReject(showRejectModal)}
              >
                Reject Application
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
