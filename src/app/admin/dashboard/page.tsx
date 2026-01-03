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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Plus,
  ChevronRight,
  BadgeCheck,
  FileText,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { useCurrencyStore } from '@/stores';

// Mock admin stats
const STATS = [
  {
    label: 'Total Users',
    value: '12,543',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    label: 'Active Vendors',
    value: '856',
    change: '+8.3%',
    trend: 'up',
    icon: Store,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    label: 'Total Products',
    value: '45,231',
    change: '+23.1%',
    trend: 'up',
    icon: Package,
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
  {
    label: 'Sales Volume',
    value: 28500000,
    change: '+15.7%',
    trend: 'up',
    icon: DollarSign,
    iconBg: 'bg-yellow-100',
    iconColor: 'text-yellow-600',
    isCurrency: true,
  },
];

// Mock pending items
const PENDING_ITEMS = {
  vendors: 12,
  products: 34,
  withdrawals: 8,
  reports: 5,
};

// Mock recent activities
const RECENT_ACTIVITIES = [
  {
    id: '1',
    type: 'vendor_registered',
    message: 'New vendor registration: Lagos Fashion Hub',
    time: '5 minutes ago',
    icon: Store,
  },
  {
    id: '2',
    type: 'product_submitted',
    message: 'Product submitted for review: Traditional Kente Cloth',
    time: '15 minutes ago',
    icon: Package,
  },
  {
    id: '3',
    type: 'withdrawal_requested',
    message: 'Withdrawal request: ₦150,000 from Accra Textiles',
    time: '32 minutes ago',
    icon: DollarSign,
  },
  {
    id: '4',
    type: 'vendor_verified',
    message: 'Vendor verified: African Arts Gallery',
    time: '1 hour ago',
    icon: BadgeCheck,
  },
  {
    id: '5',
    type: 'order_completed',
    message: 'Order #ORD-2024-001234 completed',
    time: '2 hours ago',
    icon: ShoppingBag,
  },
];

// Mock top vendors
const TOP_VENDORS = [
  { id: '1', name: 'Accra Textiles', sales: 4500000, products: 156, orders: 342 },
  { id: '2', name: 'Lagos Fashion Hub', sales: 3200000, products: 89, orders: 278 },
  { id: '3', name: 'Nairobi Crafts', sales: 2800000, products: 234, orders: 198 },
  { id: '4', name: 'African Arts Gallery', sales: 2100000, products: 67, orders: 156 },
  { id: '5', name: 'Addis Designs', sales: 1900000, products: 112, orders: 134 },
];

// Mock user growth data for chart simulation
const USER_GROWTH = [
  { month: 'Aug', users: 8500 },
  { month: 'Sep', users: 9200 },
  { month: 'Oct', users: 10100 },
  { month: 'Nov', users: 11200 },
  { month: 'Dec', users: 11800 },
  { month: 'Jan', users: 12543 },
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

export default function AdminDashboardPage() {
  const { formatPrice } = useCurrencyStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const maxUsers = Math.max(...USER_GROWTH.map(d => d.users));

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
            const isActive = item.href === '/admin/dashboard';
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
              <h1 className="text-xl font-heading font-bold text-primary">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="relative p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-500" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${stat.iconBg} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${
                      stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {stat.change}
                    </div>
                  </div>
                  <p className="text-2xl font-bold text-foreground">
                    {stat.isCurrency ? formatPrice(stat.value as number) : stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              );
            })}
          </div>

          {/* Quick Actions & Pending Items */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pending Items */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b">
                <h2 className="font-heading font-bold text-primary">Pending Actions</h2>
              </div>
              <div className="p-4 space-y-3">
                <Link
                  href="/admin/vendors?status=pending"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Store className="w-5 h-5 text-orange-600" />
                    </div>
                    <span className="font-medium">Vendor Approvals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-100 text-orange-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {PENDING_ITEMS.vendors}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>

                <Link
                  href="/admin/products?status=pending"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Package className="w-5 h-5 text-purple-600" />
                    </div>
                    <span className="font-medium">Product Reviews</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-purple-100 text-purple-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {PENDING_ITEMS.products}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>

                <Link
                  href="/admin/withdrawals?status=pending"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-green-600" />
                    </div>
                    <span className="font-medium">Withdrawal Requests</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {PENDING_ITEMS.withdrawals}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>

                <Link
                  href="/admin/reports"
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                    </div>
                    <span className="font-medium">User Reports</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                      {PENDING_ITEMS.reports}
                    </span>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </Link>
              </div>
            </div>

            {/* User Growth Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-heading font-bold text-primary">User Growth</h2>
                <select className="text-sm border rounded-lg px-3 py-1.5 bg-white">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                  <option>All Time</option>
                </select>
              </div>
              <div className="p-6">
                <div className="flex items-end justify-between gap-2 h-48">
                  {USER_GROWTH.map((data) => (
                    <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-secondary/80 rounded-t-lg transition-all hover:bg-secondary"
                        style={{ height: `${(data.users / maxUsers) * 100}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{data.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity & Top Vendors */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-heading font-bold text-primary">Recent Activity</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="divide-y">
                {RECENT_ACTIVITIES.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div key={activity.id} className="p-4 flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Top Vendors */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-4 border-b flex items-center justify-between">
                <h2 className="font-heading font-bold text-primary">Top Performing Vendors</h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Vendor
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Sales
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                        Products
                      </th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                        Orders
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {TOP_VENDORS.map((vendor, index) => (
                      <tr key={vendor.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                              {index + 1}
                            </span>
                            <span className="font-medium text-foreground">{vendor.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right font-medium text-green-600">
                          {formatPrice(vendor.sales)}
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground hidden sm:table-cell">
                          {vendor.products}
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground hidden sm:table-cell">
                          {vendor.orders}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-heading font-bold text-primary mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Link
                href="/admin/users/new"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed hover:border-secondary hover:bg-secondary/5 transition-colors"
              >
                <Plus className="w-6 h-6 text-gray-400" />
                <span className="text-sm font-medium text-center">Add User</span>
              </Link>
              <Link
                href="/admin/vendors/new"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed hover:border-secondary hover:bg-secondary/5 transition-colors"
              >
                <Store className="w-6 h-6 text-gray-400" />
                <span className="text-sm font-medium text-center">Add Vendor</span>
              </Link>
              <Link
                href="/admin/categories"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed hover:border-secondary hover:bg-secondary/5 transition-colors"
              >
                <Package className="w-6 h-6 text-gray-400" />
                <span className="text-sm font-medium text-center">Manage Categories</span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex flex-col items-center gap-2 p-4 rounded-lg border-2 border-dashed hover:border-secondary hover:bg-secondary/5 transition-colors"
              >
                <Settings className="w-6 h-6 text-gray-400" />
                <span className="text-sm font-medium text-center">Platform Settings</span>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
