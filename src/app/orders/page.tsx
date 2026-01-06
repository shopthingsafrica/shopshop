'use client';

import Link from 'next/link';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  ShoppingBag,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { useCurrencyStore } from '@/stores';

const MOCK_ORDERS = [
  {
    id: 'ORD-1705123456789',
    date: '2024-01-15',
    status: 'delivered',
    total: 45000,
    itemCount: 3,
    items: [
      { name: 'Traditional Kente Cloth', quantity: 1 },
      { name: 'Ankara Print Dress', quantity: 2 },
    ],
  },
  {
    id: 'ORD-1705234567890',
    date: '2024-01-12',
    status: 'shipped',
    total: 32500,
    itemCount: 2,
    items: [
      { name: 'Shea Butter Collection', quantity: 1 },
      { name: 'Natural Hair Oil', quantity: 1 },
    ],
  },
  {
    id: 'ORD-1705345678901',
    date: '2024-01-10',
    status: 'processing',
    total: 18000,
    itemCount: 1,
    items: [
      { name: 'Handmade Leather Bag', quantity: 1 },
    ],
  },
  {
    id: 'ORD-1705456789012',
    date: '2024-01-05',
    status: 'cancelled',
    total: 25000,
    itemCount: 2,
    items: [
      { name: 'Batik Tie-Dye Fabric', quantity: 2 },
    ],
  },
];

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'text-yellow-600 bg-yellow-50',
  },
  processing: {
    label: 'Processing',
    icon: Package,
    color: 'text-blue-600 bg-blue-50',
  },
  shipped: {
    label: 'Shipped',
    icon: Truck,
    color: 'text-purple-600 bg-purple-50',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle,
    color: 'text-success bg-success/10',
  },
  cancelled: {
    label: 'Cancelled',
    icon: XCircle,
    color: 'text-error bg-error/10',
  },
};

export default function OrdersPage() {
  const { formatConvertedPrice } = useCurrencyStore();

  if (MOCK_ORDERS.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Breadcrumb */}
        <div className="bg-muted border-b border-border">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="text-foreground font-medium">Orders</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-primary mb-2">
              No Orders Yet
            </h1>
            <p className="text-muted-foreground mb-8">
              Start shopping to see your orders here.
            </p>
            <Link href="/products">
              <Button variant="primary" size="lg">
                Start Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Orders</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-8">
          My Orders
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((filter) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'All'
                  ? 'bg-primary text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {MOCK_ORDERS.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig];
            const StatusIcon = status.icon;

            return (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white rounded-xl border border-border p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <span className="font-mono font-medium text-primary">
                        {order.id}
                      </span>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Placed on {new Date(order.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {order.items.map((item, i) => (
                        <span key={i}>
                          {item.name}
                          {item.quantity > 1 && ` ×${item.quantity}`}
                          {i < order.items.length - 1 && ', '}
                        </span>
                      ))}
                      {order.itemCount > order.items.length && (
                        <span> +{order.itemCount - order.items.reduce((acc, i) => acc + i.quantity, 0)} more</span>
                      )}
                    </p>
                  </div>

                  {/* Price & Arrow */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">
                        {formatConvertedPrice(order.total, 'NGN')}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
