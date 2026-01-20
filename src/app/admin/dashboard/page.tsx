'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAdminDashboardStats, type DashboardStats } from '../actions';
import {
  Store,
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Download,
  Calendar,
  CreditCard,
  Layers,
  Activity,
  Server,
  Megaphone,
  Plus,
  Settings,
  ImageIcon,
  Tag,
  FileText,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { AdminLayout } from '@/components/admin';
import { useCurrencyStore } from '@/stores';

export default function AdminDashboardPage() {
  const { formatConvertedPrice } = useCurrencyStore();
  const [selectedRange, setSelectedRange] = useState('7D');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Failed to load dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  const statsCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers.toLocaleString() || '0',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
    },
    {
      label: 'Active Vendors',
      value: stats?.activeVendors.toLocaleString() || '0',
      change: '+8.3%',
      trend: 'up',
      icon: Store,
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
    {
      label: 'Total Products',
      value: stats?.totalProducts.toLocaleString() || '0',
      change: '+23.1%',
      trend: 'up',
      icon: Package,
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600',
    },
    {
      label: 'Sales Volume',
      value: stats?.salesVolume || 0,
      change: '+15.7%',
      trend: 'up',
      icon: DollarSign,
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600',
      isCurrency: true,
    },
  ];

  const systemHealthData = [
    { 
      label: 'Database', 
      status: stats?.systemHealth?.database?.status || 'Loading...', 
      value: stats?.systemHealth ? `${stats.systemHealth.database.latency}ms` : '...', 
      color: 'text-green-600', 
      bg: 'bg-green-100', 
      icon: Server 
    },
    { 
      label: 'API Latency', 
      status: stats?.systemHealth?.api?.status || 'Loading...', 
      value: stats?.systemHealth ? `${stats.systemHealth.api.latency}ms` : '...', 
      color: 'text-green-600', 
      bg: 'bg-green-100', 
      icon: Activity 
    },
    { label: 'Payment Gateway', status: 'Healthy', value: 'Operational', color: 'text-green-600', bg: 'bg-green-100', icon: CreditCard },
    { label: 'Email Service', status: 'Degraded', value: 'High Queue', color: 'text-yellow-600', bg: 'bg-yellow-100', icon: Megaphone },
  ];

  return (
    <AdminLayout title="Admin Dashboard" showSearch>
      <div className="space-y-6">
        {/* Date Range Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-gray-700">Overview</h2>
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm">
            {['7D', '30D', '3M', 'YTD', 'ALL'].map((range) => (
              <button 
                key={range}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  selectedRange === range ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
                onClick={() => setSelectedRange(range)}
              >
                {range}
              </button>
            ))}
            <div className="w-px h-6 bg-gray-200 mx-1" />
            <button className="flex items-center gap-2 px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Custom</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((stat) => {
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
                  {stat.isCurrency ? formatConvertedPrice(stat.value as number, 'NGN') : stat.value}
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
                    {stats?.pendingVendors || 0}
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
                    {stats?.pendingProducts || 0}
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
                    {stats?.pendingWithdrawals || 0}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </Link>

              <Link
                href="/admin/analytics"
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
                    {stats?.pendingReports || 0}
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
                {(stats?.userGrowth?.length ? stats.userGrowth : []).map((data: any) => {
                  const max = Math.max(...(stats?.userGrowth?.map((d: any) => d.users) || [1])) || 1;
                  return (
                    <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                      <div 
                        className="w-full bg-secondary/80 rounded-t-lg transition-all hover:bg-secondary"
                        style={{ height: `${(data.users / max) * 100}%` }}
                      />
                      <span className="text-xs text-muted-foreground">{data.month}</span>
                    </div>
                  );
                })}
                {!stats?.userGrowth?.length && (
                   <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No growth data available</div>
                )}
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
              {(stats?.recentActivities || []).map((activity) => {
                const Icon = activity.type === 'vendor_registered' ? Store :
                             activity.type === 'product_submitted' ? Package :
                             activity.type === 'order_completed' ? ShoppingBag :
                             activity.type === 'withdrawal_requested' ? DollarSign : Bell;

                const date = new Date(activity.time);
                const timeString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <div key={activity.id} className="p-4 flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-foreground">{activity.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">{timeString}</p>
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
                  {(stats?.topVendors || []).map((vendor: any, index: number) => (
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
                        {formatConvertedPrice(vendor.sales, 'NGN')}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground hidden sm:table-cell">
                        {vendor.products}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground hidden sm:table-cell">
                        {vendor.orders}
                      </td>
                    </tr>
                  ))}
                  {!stats?.topVendors?.length && (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-muted-foreground text-sm">
                        No vendor data available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Financial Overview & Exports */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="font-heading font-bold text-primary flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Financial Overview
            </h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Sales
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export Taxes
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
              <p className="text-sm text-blue-600 mb-1">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-900">
                {stats?.financials ? formatConvertedPrice(stats.financials.revenue, 'NGN') : '...'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
              <p className="text-sm text-purple-600 mb-1">Vendor Payouts</p>
              <p className="text-2xl font-bold text-purple-900">
                {stats?.financials ? formatConvertedPrice(stats.financials.payouts, 'NGN') : '...'}
              </p>
            </div>
            <div className="p-4 rounded-lg bg-green-50 border border-green-100">
              <p className="text-sm text-green-600 mb-1">Platform Commission</p>
              <p className="text-2xl font-bold text-green-900">
                {stats?.financials ? formatConvertedPrice(stats.financials.commission, 'NGN') : '...'}
              </p>
            </div>
          </div>
        </div>

        {/* CMS Shortcuts */}
        <div className="bg-white rounded-xl shadow-sm p-4">
          <h2 className="font-heading font-bold text-primary mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5" />
            Content Management
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors">
              <ImageIcon className="w-6 h-6 text-indigo-500" />
              <span className="text-sm font-medium">Hero Banners</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors">
              <Tag className="w-6 h-6 text-pink-500" />
              <span className="text-sm font-medium">Collections</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors">
              <Megaphone className="w-6 h-6 text-orange-500" />
              <span className="text-sm font-medium">Announcements</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors">
              <FileText className="w-6 h-6 text-teal-500" />
              <span className="text-sm font-medium">Blog Posts</span>
            </button>
          </div>
        </div>

        {/* System Health */}
        <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-primary flex items-center gap-2">
                <Activity className="w-5 h-5" />
                System Health
              </h2>
              <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                All Systems Operational
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {systemHealthData.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
                    <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      <div className="flex items-center justify-between">
                        <p className={`text-xs ${item.label === 'Email Service' ? 'text-yellow-600' : 'text-green-600'}`}>{item.status}</p>
                        <p className="text-xs text-gray-500">{item.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
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
              <span className="text-sm font-medium text-center">Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsCards.map((stat) => {
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
                    {stat.isCurrency ? formatConvertedPrice(stat.value as number, 'NGN') : stat.value}
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
                      {stats?.pendingVendors || 0}
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
                      {stats?.pendingProducts || 0}
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
                      {stats?.pendingWithdrawals || 0}
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
                      {stats?.pendingReports || 0}
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
                  {(stats?.userGrowth?.length ? stats.userGrowth : []).map((data: any) => {
                    const max = Math.max(...(stats?.userGrowth?.map((d: any) => d.users) || [1])) || 1;
                    return (
                      <div key={data.month} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-secondary/80 rounded-t-lg transition-all hover:bg-secondary"
                          style={{ height: `${(data.users / max) * 100}%` }}
                        />
                        <span className="text-xs text-muted-foreground">{data.month}</span>
                      </div>
                    );
                  })}
                  {!stats?.userGrowth?.length && (
                     <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">No growth data available</div>
                  )}
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
                {(stats?.recentActivities || []).map((activity) => {
                  const Icon = activity.type === 'vendor_registered' ? Store :
                               activity.type === 'product_submitted' ? Package :
                               activity.type === 'order_completed' ? ShoppingBag :
                               activity.type === 'withdrawal_requested' ? DollarSign : Bell;

                  // Format date to something readable like "2 hours ago" or just the date
                  const date = new Date(activity.time);
                  const timeString = date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                  return (
                    <div key={activity.id} className="p-4 flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground">{activity.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{timeString}</p>
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
                    {(stats?.topVendors || []).map((vendor: any, index: number) => (
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
                          {formatConvertedPrice(vendor.sales, 'NGN')}
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground hidden sm:table-cell">
                          {vendor.products}
                        </td>
                        <td className="py-3 px-4 text-right text-muted-foreground hidden sm:table-cell">
                          {vendor.orders}
                        </td>
                      </tr>
                    ))}
                    {!stats?.topVendors?.length && (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-muted-foreground text-sm">
                          No vendor data available.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Financial Overview & Exports */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <h2 className="font-heading font-bold text-primary flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Financial Overview
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Sales
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export Taxes
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <p className="text-sm text-blue-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-900">
                  {stats?.financials ? formatConvertedPrice(stats.financials.revenue, 'NGN') : '...'}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-purple-50 border border-purple-100">
                <p className="text-sm text-purple-600 mb-1">Vendor Payouts</p>
                <p className="text-2xl font-bold text-purple-900">
                  {stats?.financials ? formatConvertedPrice(stats.financials.payouts, 'NGN') : '...'}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-green-50 border border-green-100">
                <p className="text-sm text-green-600 mb-1">Platform Commission</p>
                <p className="text-2xl font-bold text-green-900">
                  {stats?.financials ? formatConvertedPrice(stats.financials.commission, 'NGN') : '...'}
                </p>
              </div>
            </div>
          </div>

          {/* CMS Shortcuts */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <h2 className="font-heading font-bold text-primary mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5" />
              Content Management
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors">
                <ImageIcon className="w-6 h-6 text-indigo-500" />
                <span className="text-sm font-medium">Hero Banners</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors">
                <Tag className="w-6 h-6 text-pink-500" />
                <span className="text-sm font-medium">Collections</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors">
                <Megaphone className="w-6 h-6 text-orange-500" />
                <span className="text-sm font-medium">Announcements</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 rounded-lg border hover:border-primary hover:bg-primary/5 transition-colors">
                <FileText className="w-6 h-6 text-teal-500" />
                <span className="text-sm font-medium">Blog Posts</span>
              </button>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-heading font-bold text-primary flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  System Health
                </h2>
                <span className="text-xs font-medium px-2 py-1 bg-green-100 text-green-700 rounded-full">
                  All Systems Operational
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {systemHealthData.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
                      <div className={`w-10 h-10 ${item.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${item.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <div className="flex items-center justify-between">
                          <p className={`text-xs ${item.label === 'Email Service' ? 'text-yellow-600' : 'text-green-600'}`}>{item.status}</p>
                          <p className="text-xs text-gray-500">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
