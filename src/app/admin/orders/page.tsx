'use client';

import { useState, useEffect } from 'react';
import {
  Search,
  Download,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  X,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { AdminLayout } from '@/components/admin';
import { useCurrencyStore } from '@/stores';
import { getAdminOrdersList, getAdminDashboardStats, DashboardStats } from '../actions';

const STATUS_CONFIG: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  completed: { label: 'Paid', bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
  pending: { label: 'Pending', bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
  failed: { label: 'Failed', bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
  refunded: { label: 'Refunded', bg: 'bg-gray-100', text: 'text-gray-800', icon: AlertCircle },
};

export default function AdminOrdersPage() {
  const { formatConvertedPrice } = useCurrencyStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const fetchOrders = async () => {
      setIsLoading(true);
      try {
          const { orders: data, count } = await getAdminOrdersList(currentPage, 20, searchQuery, statusFilter);
          setOrders(data);
          setTotalCount(count);
      } catch (err) {
          console.error(err);
      } finally {
          setIsLoading(false);
      }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, searchQuery, statusFilter]);

  useEffect(() => {
    getAdminDashboardStats().then(setStats);
  }, []);

  const selectedOrderData = orders.find(o => o.id === selectedOrder);

  const headerActions = (
    <Button variant='outline'>
      <Download className='w-4 h-4 mr-2' />
      Export CSV
    </Button>
  );

  return (
    <AdminLayout title="Orders Management" headerActions={headerActions}>
          {/* Stats */}
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
            <div className='bg-white rounded-xl p-4 shadow-sm'>
                <p className='text-sm text-muted-foreground'>Total Revenue</p>
                <p className='text-2xl font-bold text-primary mt-1'>
                    {formatConvertedPrice(stats?.financials?.revenue || 0, 'NGN')}
                </p>
            </div>
            <div className='bg-white rounded-xl p-4 shadow-sm'>
                <p className='text-sm text-muted-foreground'>Total Orders</p>
                <p className='text-2xl font-bold text-blue-600 mt-1'>
                    {totalCount}
                </p>
            </div>
             {/* More stats placeholder */}
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Orders List */}
                <div className='lg:col-span-2 space-y-4'>
                    {/* Filters */}
                    <div className='bg-white rounded-xl shadow-sm p-4'>
                    <div className='flex flex-col sm:flex-row gap-4'>
                        <div className='flex-1 relative'>
                        <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground' />
                        <Input
                            type='text'
                            placeholder='Search order #...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='pl-10'
                        />
                        </div>
                        <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className='px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent'
                        >
                        <option value='all'>All Payments</option>
                        <option value='completed'>Paid</option>
                        <option value='pending'>Pending</option>
                        <option value='failed'>Failed</option>
                        </select>
                    </div>
                    </div>

                    {/* Order Cards */}
                    {isLoading ? (
                        <div className='text-center p-8'>Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className='text-center p-8'>No orders found.</div>
                    ) : (
                        orders.map((order) => {
                        const statusConfig = STATUS_CONFIG[order.payment_status] || STATUS_CONFIG['pending'];
                        const StatusIcon = statusConfig.icon;

                        return (
                            <div
                            key={order.id}
                            className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transition-shadow hover:shadow-md ${
                                selectedOrder === order.id ? 'ring-2 ring-secondary' : ''
                            }`}
                            onClick={() => setSelectedOrder(order.id)}
                            >
                            <div className='flex flex-col sm:flex-row gap-4 p-4 items-start sm:items-center justify-between'>
                                <div>
                                    <h3 className='font-bold text-gray-900'>Order #{order.order_number}</h3>
                                    <p className='text-sm text-gray-500'>{order.customer?.full_name || order.customer?.email}</p>
                                    <p className='text-xs text-gray-400 mt-1'>{new Date(order.created_at).toLocaleString()}</p>
                                </div>
                                <div className='flex items-center gap-4'>
                                    <span className='font-bold text-primary'>{formatConvertedPrice(order.total, 'NGN')}</span>
                                    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                                        <StatusIcon className='w-3 h-3' />
                                        <span>{statusConfig.label}</span>
                                    </span>
                                </div>
                            </div>
                            </div>
                        );
                        })
                    )}
                    <div className='flex justify-between items-center bg-white p-4 rounded-xl shadow-sm'>
                        <Button variant='outline' disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)}>Previous</Button>
                        <div className='text-sm text-gray-500'>Page {currentPage}</div>
                        <Button variant='outline' disabled={orders.length < 20} onClick={() => setCurrentPage(p => p + 1)}>Next</Button>
                    </div>
                </div>

                {/* Order Details Sidebar */}
                <div className='lg:col-span-1'>
                    {selectedOrder ? (
                         <div className='bg-white rounded-xl shadow-sm p-4 sticky top-24'>
                            <div className='flex items-start justify-between mb-4'>
                                <h2 className='font-bold text-lg'>Order Details</h2>
                                <button
                                onClick={() => setSelectedOrder(null)}
                                className='p-1 hover:bg-gray-100 rounded-full lg:hidden'
                                >
                                <X className='w-5 h-5' />
                                </button>
                            </div>

                            {selectedOrderData && (
                                <div className='space-y-4'>
                                    <div>
                                        <label className='text-xs text-gray-500 uppercase'>Customer</label>
                                        <p className='font-medium'>{selectedOrderData.customer?.full_name}</p>
                                        <p className='text-sm text-gray-600'>{selectedOrderData.customer?.email}</p>
                                    </div>
                                    <div>
                                        <label className='text-xs text-gray-500 uppercase'>Payment Status</label>
                                        <div className='mt-1'>
                                            <span className='capitalize px-2 py-1 bg-gray-100 rounded text-sm'>
                                                {selectedOrderData.payment_status}
                                            </span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className='text-xs text-gray-500 uppercase'>Total Amount</label>
                                        <p className='font-bold text-xl text-primary'>{formatConvertedPrice(selectedOrderData.total, 'NGN')}</p>
                                    </div>

                                    {/* Note: Items would require another query or joined fetch. For now we show summary. */}
                                    <div className='pt-4 border-t'>
                                        <p className='text-sm text-gray-500 italic'>
                                            Order items details not loaded in this view.
                                        </p>
                                    </div>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className='bg-white rounded-xl shadow-sm p-8 text-center text-gray-500 sticky top-24'>
                            <ShoppingBag className='w-12 h-12 mx-auto mb-3 opacity-20' />
                            <p>Select an order to view details.</p>
                        </div>
                    )}
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}
