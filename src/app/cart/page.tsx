'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  Tag,
  Package,
  Truck,
  Shield,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useCartStore, useCurrencyStore } from '@/stores';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart, getSubtotal } = useCartStore();
  const { formatPrice } = useCurrencyStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');

  const subtotal = getSubtotal();
  const shipping = subtotal > 50000 ? 0 : 2500;
  const discount = couponApplied ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toLowerCase() === 'welcome10') {
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code');
      setCouponApplied(false);
    }
  };

  if (items.length === 0) {
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
              <span className="text-foreground font-medium">Cart</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-primary mb-2">
              Your Cart is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Link href="/products">
              <Button variant="primary" size="lg">
                Start Shopping
                <ArrowRight className="w-5 h-5 ml-2" />
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
            <span className="text-foreground font-medium">Cart</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-8">
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header - Desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-border text-sm font-medium text-muted-foreground">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {/* Items */}
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-border p-4 md:grid md:grid-cols-12 md:gap-4 md:items-center"
              >
                {/* Product */}
                <div className="md:col-span-6 flex gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-muted rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                    <Package className="w-8 h-8 text-primary/20" />
                  </div>
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="font-medium text-primary hover:text-secondary transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sold by: {item.product.vendor.store_name}
                    </p>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="md:hidden mt-2 text-sm text-error hover:underline flex items-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </div>

                {/* Price - Mobile */}
                <div className="md:hidden flex justify-between items-center mt-4 pt-4 border-t border-border">
                  <span className="text-muted-foreground">Price:</span>
                  <span className="font-medium">{formatPrice(item.product.price)}</span>
                </div>

                {/* Price - Desktop */}
                <div className="hidden md:block md:col-span-2 text-center">
                  {formatPrice(item.product.price)}
                </div>

                {/* Quantity */}
                <div className="md:col-span-2 flex items-center justify-between mt-4 md:mt-0 md:justify-center">
                  <span className="md:hidden text-muted-foreground">Quantity:</span>
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      className="p-2 hover:bg-muted disabled:opacity-50"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="p-2 hover:bg-muted"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Total - Mobile */}
                <div className="md:hidden flex justify-between items-center mt-4 pt-4 border-t border-border">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-bold text-primary">{formatPrice(item.product.price * item.quantity)}</span>
                </div>

                {/* Total - Desktop */}
                <div className="hidden md:flex md:col-span-2 items-center justify-end gap-4">
                  <span className="font-bold text-primary">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-muted-foreground hover:text-error transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/products">
                <Button variant="outline">
                  Continue Shopping
                </Button>
              </Link>
              <Button variant="ghost" onClick={clearCart} className="text-error hover:text-error hover:bg-error/10">
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
              <h2 className="text-lg font-heading font-semibold mb-4">Order Summary</h2>

              {/* Coupon */}
              <div className="mb-6">
                <div className="flex gap-2">
                  <Input
                    placeholder="Coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    leftIcon={<Tag className="w-5 h-5" />}
                    error={couponError || undefined}
                  />
                  <Button 
                    variant="outline" 
                    onClick={handleApplyCoupon}
                    disabled={!couponCode}
                  >
                    Apply
                  </Button>
                </div>
                {couponApplied && (
                  <p className="text-sm text-success mt-2 flex items-center gap-1">
                    ✓ Coupon applied: 10% off
                  </p>
                )}
              </div>

              {/* Totals */}
              <div className="space-y-3 pb-4 border-b border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-success">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <div className="flex justify-between py-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>

              <Link href="/checkout">
                <Button variant="primary" fullWidth size="lg">
                  Proceed to Checkout
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Truck className="w-5 h-5 text-secondary" />
                  <span>Free shipping on orders over ₦50,000</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="w-5 h-5 text-secondary" />
                  <span>Secure checkout with SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
