'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  Package,
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
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  CreditCard,
  Building2,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  TrendingUp,
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

// Mock wallet data
const WALLET_DATA = {
  available_balance: 245000,
  pending_balance: 48500,
  total_earned: 1250000,
  total_withdrawn: 956500,
  currency: 'NGN',
};

// Mock transactions
const TRANSACTIONS = [
  {
    id: '1',
    type: 'credit',
    description: 'Payment for Order #ORD-2024-001234',
    amount: 32500,
    status: 'completed',
    date: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    type: 'withdrawal',
    description: 'Withdrawal to GTBank ****4521',
    amount: 150000,
    status: 'completed',
    date: '2024-01-14T14:00:00Z',
  },
  {
    id: '3',
    type: 'credit',
    description: 'Payment for Order #ORD-2024-001233',
    amount: 18000,
    status: 'completed',
    date: '2024-01-14T11:20:00Z',
  },
  {
    id: '4',
    type: 'credit',
    description: 'Payment for Order #ORD-2024-001232',
    amount: 24000,
    status: 'pending',
    date: '2024-01-14T09:15:00Z',
  },
  {
    id: '5',
    type: 'withdrawal',
    description: 'Withdrawal to GTBank ****4521',
    amount: 200000,
    status: 'completed',
    date: '2024-01-10T16:45:00Z',
  },
  {
    id: '6',
    type: 'credit',
    description: 'Payment for Order #ORD-2024-001220',
    amount: 45000,
    status: 'completed',
    date: '2024-01-10T10:30:00Z',
  },
  {
    id: '7',
    type: 'withdrawal',
    description: 'Withdrawal to GTBank ****4521',
    amount: 100000,
    status: 'failed',
    date: '2024-01-08T14:00:00Z',
    failure_reason: 'Invalid account number',
  },
];

// Mock payment methods
const PAYMENT_METHODS = [
  {
    id: '1',
    type: 'bank',
    name: 'GTBank',
    details: 'Account ending in ****4521',
    is_default: true,
  },
  {
    id: '2',
    type: 'bank',
    name: 'First Bank',
    details: 'Account ending in ****7890',
    is_default: false,
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

const STATUS_ICONS: Record<string, React.ElementType> = {
  completed: CheckCircle,
  pending: Clock,
  failed: AlertCircle,
};

const STATUS_COLORS: Record<string, { icon: string; bg: string; text: string }> = {
  completed: { icon: 'text-green-600', bg: 'bg-green-100', text: 'text-green-800' },
  pending: { icon: 'text-yellow-600', bg: 'bg-yellow-100', text: 'text-yellow-800' },
  failed: { icon: 'text-red-600', bg: 'bg-red-100', text: 'text-red-800' },
};

export default function VendorWalletPage() {
  const { formatConvertedPrice } = useCurrencyStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'transactions' | 'withdraw' | 'payment-methods'>('transactions');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(PAYMENT_METHODS[0]?.id || '');

  const handleWithdraw = () => {
    console.log('Withdraw:', withdrawAmount, selectedPaymentMethod);
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
            const isActive = item.href === '/vendor/wallet';
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
              <h1 className="text-xl font-heading font-bold text-primary">Wallet</h1>
            </div>
            
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export Statement
            </Button>
          </div>
        </header>

        {/* Wallet Content */}
        <main className="p-4 lg:p-6">
          {/* Balance Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-primary to-primary/80 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <Wallet className="w-10 h-10 opacity-80" />
                <span className="text-sm bg-white/20 px-2 py-1 rounded-full">Available</span>
              </div>
              <p className="text-sm text-white/80 mb-1">Available Balance</p>
              <p className="text-3xl font-bold">{formatConvertedPrice(WALLET_DATA.available_balance, 'NGN')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <Clock className="w-10 h-10 text-yellow-500" />
                <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Pending</span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Pending Balance</p>
              <p className="text-2xl font-bold text-foreground">{formatConvertedPrice(WALLET_DATA.pending_balance, 'NGN')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <TrendingUp className="w-10 h-10 text-green-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Earned</p>
              <p className="text-2xl font-bold text-green-600">{formatConvertedPrice(WALLET_DATA.total_earned, 'NGN')}</p>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <ArrowUpRight className="w-10 h-10 text-blue-500" />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Total Withdrawn</p>
              <p className="text-2xl font-bold text-blue-600">{formatConvertedPrice(WALLET_DATA.total_withdrawn, 'NGN')}</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="border-b">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('transactions')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'transactions'
                      ? 'border-secondary text-secondary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Transaction History
                </button>
                <button
                  onClick={() => setActiveTab('withdraw')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'withdraw'
                      ? 'border-secondary text-secondary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Withdraw Funds
                </button>
                <button
                  onClick={() => setActiveTab('payment-methods')}
                  className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === 'payment-methods'
                      ? 'border-secondary text-secondary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Payment Methods
                </button>
              </div>
            </div>

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="p-4 lg:p-6">
                <div className="space-y-3">
                  {TRANSACTIONS.map((transaction) => {
                    const StatusIcon = STATUS_ICONS[transaction.status];
                    const colors = STATUS_COLORS[transaction.status];
                    
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === 'credit' ? 'bg-green-100' : 'bg-blue-100'
                        }`}>
                          {transaction.type === 'credit' ? (
                            <ArrowDownLeft className="w-5 h-5 text-green-600" />
                          ) : (
                            <ArrowUpRight className="w-5 h-5 text-blue-600" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {transaction.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>
                              {new Date(transaction.date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <StatusIcon className={`w-3 h-3 ${colors.icon}`} />
                              <span className="capitalize">{transaction.status}</span>
                            </div>
                          </div>
                          {transaction.failure_reason && (
                            <p className="text-xs text-red-600 mt-1">{transaction.failure_reason}</p>
                          )}
                        </div>

                        <p className={`font-bold ${
                          transaction.type === 'credit' ? 'text-green-600' : 'text-foreground'
                        }`}>
                          {transaction.type === 'credit' ? '+' : '-'}{formatConvertedPrice(transaction.amount, 'NGN')}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* Load More */}
                <div className="text-center mt-6">
                  <Button variant="outline">
                    Load More Transactions
                  </Button>
                </div>
              </div>
            )}

            {/* Withdraw Tab */}
            {activeTab === 'withdraw' && (
              <div className="p-4 lg:p-6 max-w-lg">
                <div className="space-y-6">
                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Withdrawal Amount
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₦</span>
                      <Input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        className="pl-8"
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      Available: <span className="font-medium text-foreground">{formatConvertedPrice(WALLET_DATA.available_balance, 'NGN')}</span>
                    </p>
                  </div>

                  {/* Quick Amounts */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Quick Select
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[50000, 100000, 200000].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setWithdrawAmount(amount.toString())}
                          className="px-4 py-2 border rounded-lg text-sm hover:border-secondary hover:text-secondary transition-colors"
                        >
                          {formatConvertedPrice(amount, 'NGN')}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Withdraw To
                    </label>
                    <div className="space-y-2">
                      {PAYMENT_METHODS.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center gap-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                            selectedPaymentMethod === method.id
                              ? 'border-secondary bg-secondary/5'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <input
                            type="radio"
                            name="payment-method"
                            value={method.id}
                            checked={selectedPaymentMethod === method.id}
                            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                            className="sr-only"
                          />
                          <Building2 className="w-5 h-5 text-gray-400" />
                          <div className="flex-1">
                            <p className="font-medium">{method.name}</p>
                            <p className="text-sm text-muted-foreground">{method.details}</p>
                          </div>
                          {method.is_default && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                          <div className={`w-5 h-5 rounded-full border-2 ${
                            selectedPaymentMethod === method.id
                              ? 'border-secondary bg-secondary'
                              : 'border-gray-300'
                          }`}>
                            {selectedPaymentMethod === method.id && (
                              <div className="w-full h-full flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white" />
                              </div>
                            )}
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Withdrawal Amount</span>
                      <span>{formatConvertedPrice(Number(withdrawAmount) || 0, 'NGN')}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Processing Fee</span>
                      <span>₦50</span>
                    </div>
                    <div className="flex items-center justify-between font-bold pt-2 border-t">
                      <span>You&apos;ll Receive</span>
                      <span className="text-primary">
                        {formatConvertedPrice(Math.max(0, (Number(withdrawAmount) || 0) - 50), 'NGN')}
                      </span>
                    </div>
                  </div>

                  {/* Submit */}
                  <Button
                    className="w-full"
                    disabled={!withdrawAmount || Number(withdrawAmount) < 1000}
                    onClick={handleWithdraw}
                  >
                    Withdraw Funds
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    Withdrawals are processed within 24-48 hours
                  </p>
                </div>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'payment-methods' && (
              <div className="p-4 lg:p-6">
                <div className="space-y-4 max-w-2xl">
                  {PAYMENT_METHODS.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover:border-gray-300 transition-colors"
                    >
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{method.name}</p>
                          {method.is_default && (
                            <span className="text-xs bg-secondary/10 text-secondary px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{method.details}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        {!method.is_default && (
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add New */}
                  <button className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed text-muted-foreground hover:text-foreground hover:border-gray-400 transition-colors">
                    <Plus className="w-5 h-5" />
                    <span>Add Bank Account</span>
                  </button>

                  {/* Mobile Money Section */}
                  <div className="pt-6 mt-6 border-t">
                    <h3 className="font-heading font-bold text-foreground mb-4">Mobile Money</h3>
                    <button className="w-full flex items-center justify-center gap-2 p-4 rounded-lg border-2 border-dashed text-muted-foreground hover:text-foreground hover:border-gray-400 transition-colors">
                      <Plus className="w-5 h-5" />
                      <span>Add Mobile Money</span>
                    </button>
                    <p className="text-sm text-muted-foreground mt-2">
                      Supports MTN MoMo, Vodafone Cash, AirtelTigo Money
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
