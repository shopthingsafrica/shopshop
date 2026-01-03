'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  Package,
  Search,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
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
  Eye,
  Printer,
  Calendar,
  Clock,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useCurrencyStore } from '@/stores';

// Mock vendor data
const MOCK_VENDOR = {
  id: '1',
  store_name: 'Accra Textiles',
  is_verified: true,
  subscription: 'premium',
};

// Mock orders data
const MOCK_ORDERS = [
  {
    id: '1',
    order_number: 'ORD-2024-001234',
    customer: {
      name: 'Amina Johnson',
      email: 'amina@example.com',
      phone: '+234 801 234 5678',
    },
    items: [
      { name: 'Traditional Kente Cloth', quantity: 1, price: 15000 },
      { name: 'Ankara Print Fabric Set', quantity: 2, price: 8500 },
    ],
    subtotal: 32000,
    shipping: 2500,
    total: 34500,
    status: 'pending',
    payment_status: 'paid',
    shipping_address: '123 Victoria Island, Lagos, Nigeria',
    created_at: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    order_number: 'ORD-2024-001233',
    customer: {
      name: 'Kwame Asante',
      email: 'kwame@example.com',
      phone: '+233 20 123 4567',
    },
    items: [
      { name: 'Batik Tie-Dye Fabric', quantity: 3, price: 6000 },
    ],
    subtotal: 18000,
    shipping: 1500,
    total: 19500,
    status: 'processing',
    payment_status: 'paid',
    shipping_address: '45 Independence Ave, Accra, Ghana',
    created_at: '2024-01-15T09:15:00Z',
  },
  {
    id: '3',
    order_number: 'ORD-2024-001232',
    customer: {
      name: 'Sarah Okonkwo',
      email: 'sarah@example.com',
      phone: '+234 802 345 6789',
    },
    items: [
      { name: 'Kente Stole Scarf', quantity: 2, price: 4500 },
      { name: 'Traditional Kente Cloth', quantity: 1, price: 15000 },
    ],
    subtotal: 24000,
    shipping: 2000,
    total: 26000,
    status: 'shipped',
    payment_status: 'paid',
    shipping_address: '789 Lekki Phase 1, Lagos, Nigeria',
    tracking_number: 'GIG123456789NG',
    created_at: '2024-01-14T16:45:00Z',
  },
  {
    id: '4',
    order_number: 'ORD-2024-001231',
    customer: {
      name: 'David Mensah',
      email: 'david@example.com',
      phone: '+233 24 567 8901',
    },
    items: [
      { name: 'Adinkra Symbol T-Shirt', quantity: 4, price: 3500 },
    ],
    subtotal: 14000,
    shipping: 1000,
    total: 15000,
    status: 'delivered',
    payment_status: 'paid',
    shipping_address: '22 Oxford Street, Osu, Accra, Ghana',
    created_at: '2024-01-14T11:20:00Z',
    delivered_at: '2024-01-16T14:30:00Z',
  },
  {
    id: '5',
    order_number: 'ORD-2024-001230',
    customer: {
      name: 'Fatima Bello',
      email: 'fatima@example.com',
      phone: '+234 803 456 7890',
    },
    items: [
      { name: 'Traditional Kente Cloth', quantity: 2, price: 15000 },
      { name: 'Batik Tie-Dye Fabric', quantity: 1, price: 6000 },
    ],
    subtotal: 36000,
    shipping: 3000,
    total: 39000,
    status: 'cancelled',
    payment_status: 'refunded',
    shipping_address: '56 Wuse 2, Abuja, Nigeria',
    created_at: '2024-01-13T14:00:00Z',
    cancelled_at: '2024-01-14T10:00:00Z',
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

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-800' },
  processing: { bg: 'bg-blue-100', text: 'text-blue-800' },
  shipped: { bg: 'bg-purple-100', text: 'text-purple-800' },
  delivered: { bg: 'bg-green-100', text: 'text-green-800' },
  cancelled: { bg: 'bg-red-100', text: 'text-red-800' },
};

const STATUS_OPTIONS = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function VendorOrdersPage() {
  const { formatPrice } = useCurrencyStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getOrder = (id: string) => MOCK_ORDERS.find(o => o.id === id);

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    console.log('Update order status:', orderId, newStatus);
    // In real app, this would call an API
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
            const isActive = item.href === '/vendor/orders';
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
              <h1 className="text-xl font-heading font-bold text-primary">Orders</h1>
            </div>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </header>

        {/* Orders Content */}
        <main className="p-4 lg:p-6">
          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">All Orders</p>
              <p className="text-2xl font-bold text-primary mt-1">{MOCK_ORDERS.length}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-600 mt-1">
                {MOCK_ORDERS.filter(o => o.status === 'pending').length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Processing</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">
                {MOCK_ORDERS.filter(o => o.status === 'processing').length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Shipped</p>
              <p className="text-2xl font-bold text-purple-600 mt-1">
                {MOCK_ORDERS.filter(o => o.status === 'shipped').length}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-2xl font-bold text-green-600 mt-1">
                {MOCK_ORDERS.filter(o => o.status === 'delivered').length}
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
                  placeholder="Search by order number or customer..."
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
                  {STATUS_OPTIONS.map(status => (
                    <option key={status} value={status} className="capitalize">{status}</option>
                  ))}
                </select>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Orders List */}
            <div className="lg:col-span-2 space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${
                    selectedOrder === order.id ? 'ring-2 ring-secondary' : ''
                  }`}
                  onClick={() => setSelectedOrder(order.id)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-medium text-foreground">{order.order_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                        STATUS_COLORS[order.status]?.bg
                      } ${STATUS_COLORS[order.status]?.text}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{order.customer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </p>
                      </div>
                      <p className="font-bold text-primary">{formatPrice(order.total)}</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  {(order.status === 'pending' || order.status === 'processing') && (
                    <div className="px-4 py-2 bg-gray-50 border-t flex items-center justify-end gap-2">
                      {order.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(order.id, 'processing');
                          }}
                        >
                          Accept Order
                        </Button>
                      )}
                      {order.status === 'processing' && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpdateStatus(order.id, 'shipped');
                          }}
                        >
                          Mark as Shipped
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Pagination */}
              <div className="flex items-center justify-between py-4">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredOrders.length} of {MOCK_ORDERS.length} orders
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

            {/* Order Details Sidebar */}
            <div className="lg:col-span-1">
              {selectedOrder ? (
                <div className="bg-white rounded-xl shadow-sm sticky top-24">
                  {(() => {
                    const order = getOrder(selectedOrder);
                    if (!order) return null;
                    
                    return (
                      <>
                        <div className="p-4 border-b">
                          <div className="flex items-center justify-between">
                            <h2 className="font-heading font-bold text-primary">Order Details</h2>
                            <div className="flex items-center gap-1">
                              <button className="p-2 hover:bg-gray-100 rounded-lg" title="Print">
                                <Printer className="w-4 h-4 text-muted-foreground" />
                              </button>
                              <button className="p-2 hover:bg-gray-100 rounded-lg" title="View Full">
                                <Eye className="w-4 h-4 text-muted-foreground" />
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="p-4 space-y-4">
                          {/* Order Info */}
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-1">Order Number</p>
                            <p className="font-medium">{order.order_number}</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(order.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </span>
                          </div>

                          {/* Customer */}
                          <div className="pt-4 border-t">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Customer</p>
                            <p className="font-medium">{order.customer.name}</p>
                            <p className="text-sm text-muted-foreground">{order.customer.email}</p>
                            <p className="text-sm text-muted-foreground">{order.customer.phone}</p>
                          </div>

                          {/* Shipping Address */}
                          <div className="pt-4 border-t">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Shipping Address</p>
                            <p className="text-sm">{order.shipping_address}</p>
                          </div>

                          {/* Items */}
                          <div className="pt-4 border-t">
                            <p className="text-sm font-medium text-muted-foreground mb-2">Items</p>
                            <div className="space-y-2">
                              {order.items.map((item, i) => (
                                <div key={i} className="flex items-center justify-between text-sm">
                                  <span>{item.name} × {item.quantity}</span>
                                  <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Totals */}
                          <div className="pt-4 border-t space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Subtotal</span>
                              <span>{formatPrice(order.subtotal)}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Shipping</span>
                              <span>{formatPrice(order.shipping)}</span>
                            </div>
                            <div className="flex items-center justify-between font-bold pt-2 border-t">
                              <span>Total</span>
                              <span className="text-primary">{formatPrice(order.total)}</span>
                            </div>
                          </div>

                          {/* Update Status */}
                          {order.status !== 'delivered' && order.status !== 'cancelled' && (
                            <div className="pt-4 border-t">
                              <p className="text-sm font-medium text-muted-foreground mb-2">Update Status</p>
                              <select
                                value={order.status}
                                onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                                className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                              >
                                {STATUS_OPTIONS.map(status => (
                                  <option key={status} value={status} className="capitalize">{status}</option>
                                ))}
                              </select>
                            </div>
                          )}

                          {/* Tracking */}
                          {order.status === 'shipped' && (
                            <div className="pt-4 border-t">
                              <p className="text-sm font-medium text-muted-foreground mb-2">Tracking Number</p>
                              <Input
                                type="text"
                                defaultValue={order.tracking_number || ''}
                                placeholder="Enter tracking number"
                              />
                            </div>
                          )}
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Select an order to view details
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
