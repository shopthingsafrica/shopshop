'use client';

import { use } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Package,
  Truck,
  CheckCircle,
  MapPin,
  CreditCard,
  MessageCircle,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { useCurrencyStore } from '@/stores';

const MOCK_ORDER = {
  id: 'ORD-1705123456789',
  date: '2024-01-15',
  status: 'shipped',
  shippingAddress: {
    name: 'John Doe',
    address: '123 Main Street, Apt 4B',
    city: 'Lagos',
    state: 'Lagos State',
    postalCode: '100001',
    country: 'Nigeria',
    phone: '+234 800 000 0000',
  },
  paymentMethod: 'Card ending in 4242',
  items: [
    {
      id: '1',
      name: 'Traditional Kente Cloth',
      price: 15000,
      quantity: 1,
      vendor: 'Accra Textiles',
      slug: 'traditional-kente-cloth',
    },
    {
      id: '2',
      name: 'Ankara Print Dress',
      price: 12500,
      quantity: 2,
      vendor: 'Lagos Fashion House',
      slug: 'ankara-print-dress',
    },
  ],
  subtotal: 40000,
  shipping: 0,
  discount: 0,
  total: 40000,
  tracking: {
    number: 'TRK-789456123',
    carrier: 'GIG Logistics',
    estimatedDelivery: '2024-01-20',
    updates: [
      { date: '2024-01-15 09:00', status: 'Order placed', completed: true },
      { date: '2024-01-15 14:30', status: 'Order confirmed', completed: true },
      { date: '2024-01-16 10:00', status: 'Shipped', completed: true },
      { date: '2024-01-17 08:00', status: 'In transit', completed: true },
      { date: '2024-01-20', status: 'Delivered', completed: false },
    ],
  },
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { formatPrice } = useCurrencyStore();

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
            <Link href="/orders" className="text-muted-foreground hover:text-foreground">
              Orders
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">{id}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <Link
              href="/orders"
              className="inline-flex items-center text-muted-foreground hover:text-foreground mb-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Orders
            </Link>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
              Order {MOCK_ORDER.id}
            </h1>
            <p className="text-muted-foreground">
              Placed on {new Date(MOCK_ORDER.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Invoice
            </Button>
            <Button variant="outline" size="sm">
              <MessageCircle className="w-4 h-4 mr-2" />
              Help
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tracking */}
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-heading font-semibold">
                  Order Status
                </h2>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-600">
                  <Truck className="w-4 h-4" />
                  Shipped
                </span>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                {MOCK_ORDER.tracking.updates.map((update, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          update.completed
                            ? 'bg-success text-white'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </div>
                      {index < MOCK_ORDER.tracking.updates.length - 1 && (
                        <div
                          className={`w-0.5 flex-1 min-h-[2rem] ${
                            update.completed && MOCK_ORDER.tracking.updates[index + 1]?.completed
                              ? 'bg-success'
                              : 'bg-border'
                          }`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className={`font-medium ${update.completed ? '' : 'text-muted-foreground'}`}>
                        {update.status}
                      </p>
                      <p className="text-sm text-muted-foreground">{update.date}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tracking Number */}
              <div className="mt-6 pt-6 border-t border-border">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tracking Number</p>
                    <p className="font-mono font-medium">{MOCK_ORDER.tracking.number}</p>
                    <p className="text-sm text-muted-foreground">{MOCK_ORDER.tracking.carrier}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Track Package
                  </Button>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h2 className="text-lg font-heading font-semibold mb-4">
                Order Items ({MOCK_ORDER.items.length})
              </h2>

              <div className="divide-y divide-border">
                {MOCK_ORDER.items.map((item) => (
                  <div key={item.id} className="py-4 first:pt-0 last:pb-0 flex gap-4">
                    <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center shrink-0">
                      <Package className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-medium text-primary hover:text-secondary transition-colors"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        Sold by: {item.vendor}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-secondary" />
                Shipping Address
              </h3>
              <div className="text-sm text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">{MOCK_ORDER.shippingAddress.name}</p>
                <p>{MOCK_ORDER.shippingAddress.address}</p>
                <p>
                  {MOCK_ORDER.shippingAddress.city}, {MOCK_ORDER.shippingAddress.state} {MOCK_ORDER.shippingAddress.postalCode}
                </p>
                <p>{MOCK_ORDER.shippingAddress.country}</p>
                <p className="pt-2">{MOCK_ORDER.shippingAddress.phone}</p>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-secondary" />
                Payment Method
              </h3>
              <p className="text-sm text-muted-foreground">{MOCK_ORDER.paymentMethod}</p>
            </div>

            {/* Summary */}
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(MOCK_ORDER.subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{MOCK_ORDER.shipping === 0 ? 'Free' : formatPrice(MOCK_ORDER.shipping)}</span>
                </div>
                {MOCK_ORDER.discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-{formatPrice(MOCK_ORDER.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(MOCK_ORDER.total)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button variant="outline" fullWidth>
                <RefreshCw className="w-4 h-4 mr-2" />
                Buy Again
              </Button>
              <Button variant="ghost" fullWidth className="text-error hover:text-error hover:bg-error/10">
                Request Return
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
