'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  ArrowRight,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order') || 'ORD-DEFAULT';

  return (
    <div className="min-h-screen bg-muted flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl border border-border p-8 md:p-12 max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-success" />
        </div>

        <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-2">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground mb-6">
          Thank you for shopping with ShopThings. Your order has been placed successfully.
        </p>

        {/* Order ID */}
        <div className="bg-muted rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-1">Order Number</p>
          <p className="text-lg font-mono font-bold text-primary">{orderId}</p>
        </div>

        {/* Order Timeline */}
        <div className="text-left space-y-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="font-medium">Order Placed</p>
              <p className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
              <Package className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Processing</p>
              <p className="text-sm text-muted-foreground">Your order is being prepared</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Shipped</p>
              <p className="text-sm text-muted-foreground">Estimated: 3-5 business days</p>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-secondary/10 rounded-lg p-4 mb-6 text-left">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm">Confirmation Email Sent</p>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent order details and tracking information to your email address.
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link href={`/orders/${orderId}`} className="block">
            <Button variant="primary" fullWidth>
              View Order Details
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>

          <Button variant="outline" fullWidth>
            <Download className="w-5 h-5 mr-2" />
            Download Receipt
          </Button>

          <Link href="/products" className="block">
            <Button variant="ghost" fullWidth>
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-muted flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
