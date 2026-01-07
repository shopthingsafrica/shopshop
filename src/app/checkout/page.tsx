'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  CreditCard,
  MapPin,
  Phone,
  User,
  Check,
  Lock,
  Package,
  Truck,
} from 'lucide-react';
import { Button, Input } from '@/components/ui';
import { useCartStore, useCurrencyStore } from '@/stores';
import { getProductImage } from '@/lib/placeholders';
import type { CurrencyCode } from '@/types';

type CheckoutStep = 'shipping' | 'payment' | 'review';

// Helper to format cart item prices with conversion
const formatItemPrice = (price: number, currency: string, formatFn: (price: number, from: CurrencyCode) => string) => {
  const currencyCode = (['USD', 'NGN', 'GBP', 'EUR'] as const).includes(currency as any) ? currency : 'NGN';
  return formatFn(price, currencyCode as CurrencyCode);
};

export default function CheckoutPage() {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { formatConvertedPrice } = useCurrencyStore();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping form state
  const [shippingForm, setShippingForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Nigeria',
  });

  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardForm, setCardForm] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const subtotal = getSubtotal();
  const shipping = subtotal > 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  const steps: { key: CheckoutStep; label: string }[] = [
    { key: 'shipping', label: 'Shipping' },
    { key: 'payment', label: 'Payment' },
    { key: 'review', label: 'Review' },
  ];

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep('review');
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    clearCart();
    window.location.href = '/orders/confirmation?order=ORD-' + Date.now();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
          <Link href="/products">
            <Button variant="primary">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted">
      {/* Header */}
      <div className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/cart" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Cart
          </Link>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            {steps.map((step, index) => (
              <div key={step.key} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      currentStep === step.key
                        ? 'bg-secondary text-white'
                        : steps.findIndex((s) => s.key === currentStep) > index
                        ? 'bg-success text-white'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {steps.findIndex((s) => s.key === currentStep) > index ? (
                      <Check className="w-5 h-5" />
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      currentStep === step.key ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 md:w-24 h-px bg-border mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Shipping Step */}
            {currentStep === 'shipping' && (
              <form onSubmit={handleShippingSubmit} className="bg-white rounded-xl border border-border p-6">
                <h2 className="text-xl font-heading font-semibold mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-secondary" />
                  Shipping Address
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    placeholder="John"
                    value={shippingForm.firstName}
                    onChange={(e) => setShippingForm({ ...shippingForm, firstName: e.target.value })}
                    leftIcon={<User className="w-5 h-5" />}
                    required
                  />
                  <Input
                    label="Last Name"
                    placeholder="Doe"
                    value={shippingForm.lastName}
                    onChange={(e) => setShippingForm({ ...shippingForm, lastName: e.target.value })}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="john@example.com"
                    value={shippingForm.email}
                    onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                    required
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    placeholder="+234 800 000 0000"
                    value={shippingForm.phone}
                    onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                    leftIcon={<Phone className="w-5 h-5" />}
                    required
                  />
                  <div className="md:col-span-2">
                    <Input
                      label="Street Address"
                      placeholder="123 Main Street, Apt 4B"
                      value={shippingForm.address}
                      onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                      leftIcon={<MapPin className="w-5 h-5" />}
                      required
                    />
                  </div>
                  <Input
                    label="City"
                    placeholder="Lagos"
                    value={shippingForm.city}
                    onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                    required
                  />
                  <Input
                    label="State"
                    placeholder="Lagos State"
                    value={shippingForm.state}
                    onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                    required
                  />
                  <Input
                    label="Postal Code"
                    placeholder="100001"
                    value={shippingForm.postalCode}
                    onChange={(e) => setShippingForm({ ...shippingForm, postalCode: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Country
                    </label>
                    <select
                      className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-secondary"
                      value={shippingForm.country}
                      onChange={(e) => setShippingForm({ ...shippingForm, country: e.target.value })}
                    >
                      <option value="Nigeria">Nigeria</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Kenya">Kenya</option>
                      <option value="South Africa">South Africa</option>
                      <option value="Egypt">Egypt</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <Button type="submit" variant="primary" size="lg">
                    Continue to Payment
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </form>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <form onSubmit={handlePaymentSubmit} className="bg-white rounded-xl border border-border p-6">
                <h2 className="text-xl font-heading font-semibold mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-secondary" />
                  Payment Method
                </h2>

                {/* Payment Options */}
                <div className="space-y-3 mb-6">
                  {[
                    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
                    { id: 'paystack', label: 'Paystack', icon: Lock },
                    { id: 'flutterwave', label: 'Flutterwave', icon: Lock },
                  ].map((method) => (
                    <label
                      key={method.id}
                      className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === method.id
                          ? 'border-secondary bg-secondary/5'
                          : 'border-border hover:border-secondary/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={() => setPaymentMethod(method.id)}
                        className="text-secondary focus:ring-secondary"
                      />
                      <method.icon className="w-5 h-5 text-muted-foreground" />
                      <span className="font-medium">{method.label}</span>
                    </label>
                  ))}
                </div>

                {/* Card Details */}
                {paymentMethod === 'card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
                    <div className="md:col-span-2">
                      <Input
                        label="Card Number"
                        placeholder="1234 5678 9012 3456"
                        value={cardForm.cardNumber}
                        onChange={(e) => setCardForm({ ...cardForm, cardNumber: e.target.value })}
                        leftIcon={<CreditCard className="w-5 h-5" />}
                        required
                      />
                    </div>
                    <Input
                      label="Expiry Date"
                      placeholder="MM/YY"
                      value={cardForm.expiry}
                      onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                      required
                    />
                    <Input
                      label="CVV"
                      placeholder="123"
                      value={cardForm.cvv}
                      onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                      required
                    />
                    <div className="md:col-span-2">
                      <Input
                        label="Name on Card"
                        placeholder="John Doe"
                        value={cardForm.name}
                        onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep('shipping')}
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button type="submit" variant="primary" size="lg">
                    Review Order
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </div>
              </form>
            )}

            {/* Review Step */}
            {currentStep === 'review' && (
              <div className="space-y-6">
                {/* Shipping Summary */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Truck className="w-5 h-5 text-secondary" />
                      Shipping Address
                    </h3>
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="text-sm text-secondary hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-muted-foreground">
                    <p>{shippingForm.firstName} {shippingForm.lastName}</p>
                    <p>{shippingForm.address}</p>
                    <p>{shippingForm.city}, {shippingForm.state} {shippingForm.postalCode}</p>
                    <p>{shippingForm.country}</p>
                    <p className="mt-2">{shippingForm.phone}</p>
                    <p>{shippingForm.email}</p>
                  </div>
                </div>

                {/* Payment Summary */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-secondary" />
                      Payment Method
                    </h3>
                    <button
                      onClick={() => setCurrentStep('payment')}
                      className="text-sm text-secondary hover:underline"
                    >
                      Edit
                    </button>
                  </div>
                  <div className="text-muted-foreground">
                    {paymentMethod === 'card' && (
                      <p>Card ending in ****{cardForm.cardNumber.slice(-4) || '0000'}</p>
                    )}
                    {paymentMethod === 'paystack' && <p>Paystack</p>}
                    {paymentMethod === 'flutterwave' && <p>Flutterwave</p>}
                  </div>
                </div>

                {/* Items Summary */}
                <div className="bg-white rounded-xl border border-border p-6">
                  <h3 className="font-semibold flex items-center gap-2 mb-4">
                    <Package className="w-5 h-5 text-secondary" />
                    Order Items ({items.length})
                  </h3>
                  <div className="divide-y divide-border">
                    {items.map((item) => (
                      <div key={item.id} className="py-3 flex items-center gap-4">
                        <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden">
                          <Image
                            src={getProductImage(item.product.images, item.product.id)}
                            alt={item.product.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="font-medium">{formatItemPrice(item.product.price * item.quantity, item.product.currency, formatConvertedPrice)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('payment')}
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={handlePlaceOrder}
                    isLoading={isProcessing}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Place Order'}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-border p-6 sticky top-24">
              <h2 className="text-lg font-heading font-semibold mb-4">Order Summary</h2>

              <div className="space-y-3 pb-4 border-b border-border">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.product.name} × {item.quantity}
                    </span>
                    <span>{formatItemPrice(item.product.price * item.quantity, item.product.currency, formatConvertedPrice)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 py-4 border-b border-border">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>{formatConvertedPrice(subtotal, 'NGN')}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : formatConvertedPrice(shipping, 'NGN')}</span>
                </div>
              </div>

              <div className="flex justify-between py-4 text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">{formatConvertedPrice(total, 'NGN')}</span>
              </div>

              <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                <Lock className="w-4 h-4" />
                Secure checkout with 256-bit SSL
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
