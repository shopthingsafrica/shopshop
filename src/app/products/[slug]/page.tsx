'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  Share2,
  ShoppingCart,
  Minus,
  Plus,
  Star,
  BadgeCheck,
  Truck,
  Shield,
  RotateCcw,
  ChevronRight,
  Package,
  MessageCircle,
  Copy,
  Check,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { ProductCard } from '@/components/products';
import { useCurrencyStore, useCartStore } from '@/stores';

// WhatsApp icon component
const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Mock product data
const MOCK_PRODUCT = {
  id: '1',
  name: 'Handwoven Kente Cloth',
  slug: 'handwoven-kente-cloth',
  description: `Experience the rich heritage of Ghana with this authentic handwoven Kente cloth. Each piece is meticulously crafted by master artisans in the Ashanti region, using traditional techniques passed down through generations.

This stunning Kente cloth features vibrant colors and intricate geometric patterns, each with its own symbolic meaning. Perfect for special occasions, cultural celebrations, or as a statement piece in your home.

**Features:**
- 100% handwoven by skilled artisans
- Premium quality cotton and silk blend
- Vibrant, fade-resistant colors
- Traditional Ashanti patterns
- Approximate size: 6 yards x 45 inches

**Care Instructions:**
- Dry clean recommended
- If washing, use cold water and mild detergent
- Do not bleach
- Iron on low heat`,
  price: 45000,
  compare_at_price: 55000,
  images: [
    '/products/kente-1.jpg',
    '/products/kente-2.jpg',
    '/products/kente-3.jpg',
    '/products/kente-4.jpg',
  ],
  category: { id: '1', name: 'Fashion', slug: 'fashion' },
  vendor: {
    id: '1',
    store_name: 'Accra Textiles',
    is_verified: true,
    avatar: '/vendors/accra-textiles.jpg',
    rating: 4.9,
    total_sales: 1250,
    whatsapp: '+233501234567',
  },
  rating: 4.8,
  review_count: 124,
  stock_quantity: 15,
  sku: 'KC-001-GLD',
  tags: ['kente', 'traditional', 'handwoven', 'ghanaian'],
  specifications: [
    { name: 'Material', value: 'Cotton & Silk Blend' },
    { name: 'Length', value: '6 yards' },
    { name: 'Width', value: '45 inches' },
    { name: 'Origin', value: 'Ashanti Region, Ghana' },
    { name: 'Weight', value: '0.8 kg' },
  ],
};

const MOCK_REVIEWS = [
  {
    id: '1',
    user: 'Adaeze N.',
    avatar: null,
    rating: 5,
    date: '2024-01-15',
    comment: 'Absolutely stunning! The quality is exceptional and the colors are even more vibrant in person. Arrived well packaged and on time. Will definitely order again!',
    helpful: 24,
  },
  {
    id: '2',
    user: 'Marcus J.',
    avatar: null,
    rating: 4,
    date: '2024-01-10',
    comment: 'Beautiful Kente cloth. The craftsmanship is evident. Only giving 4 stars because delivery took a bit longer than expected, but the product itself is perfect.',
    helpful: 12,
  },
  {
    id: '3',
    user: 'Fatima A.',
    avatar: null,
    rating: 5,
    date: '2024-01-05',
    comment: 'I bought this for my wedding and it was the highlight of my outfit! So many compliments. The seller was also very helpful in answering my questions.',
    helpful: 38,
  },
];

const RELATED_PRODUCTS = [
  {
    id: '2',
    name: 'Ankara Print Maxi Dress',
    slug: 'ankara-print-maxi-dress',
    description: 'Beautiful Ankara print maxi dress',
    price: 28000,
    compare_at_price: null,
    currency: 'NGN',
    images: ['/products/ankara-dress.jpg'],
    status: 'active',
    average_rating: 4.6,
    review_count: 89,
    is_featured: false,
    created_at: '2024-01-01',
    stock_quantity: 25,
    category: { id: '1', name: 'Fashion', slug: 'fashion' },
    vendor: { id: '2', store_name: 'Lagos Fashion House', logo_url: null, is_verified: true },
  },
  {
    id: '6',
    name: 'Dashiki Shirt - Men',
    slug: 'dashiki-shirt-men',
    description: 'Classic Dashiki shirt for men',
    price: 18000,
    compare_at_price: null,
    currency: 'NGN',
    images: ['/products/dashiki.jpg'],
    status: 'active',
    average_rating: 4.4,
    review_count: 112,
    is_featured: false,
    created_at: '2024-01-01',
    stock_quantity: 50,
    category: { id: '1', name: 'Fashion', slug: 'fashion' },
    vendor: { id: '2', store_name: 'Lagos Fashion House', logo_url: null, is_verified: true },
  },
  {
    id: '4',
    name: 'Beaded Statement Necklace',
    slug: 'beaded-statement-necklace',
    description: 'Handmade beaded statement necklace',
    price: 15000,
    compare_at_price: null,
    currency: 'NGN',
    images: ['/products/necklace.jpg'],
    status: 'active',
    average_rating: 4.5,
    review_count: 67,
    is_featured: false,
    created_at: '2024-01-01',
    stock_quantity: 30,
    category: { id: '3', name: 'Accessories', slug: 'accessories' },
    vendor: { id: '4', store_name: 'Nairobi Crafts', logo_url: null, is_verified: false },
  },
  {
    id: '8',
    name: 'Wooden Carved Mask',
    slug: 'wooden-carved-mask',
    description: 'Traditional wooden carved mask',
    price: 35000,
    compare_at_price: null,
    currency: 'NGN',
    images: ['/products/mask.jpg'],
    status: 'active',
    average_rating: 4.6,
    review_count: 34,
    is_featured: false,
    created_at: '2024-01-01',
    stock_quantity: 12,
    category: { id: '4', name: 'Art & Crafts', slug: 'art-crafts' },
    vendor: { id: '6', store_name: 'Benin Arts', logo_url: null, is_verified: true },
  },
];

export default function ProductDetailPage() {
  const params = useParams();
  const { formatPrice } = useCurrencyStore();
  const { addItem } = useCartStore();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);

  const product = MOCK_PRODUCT;
  const discountPercentage = product.compare_at_price 
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : 0;

  const productUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/products/${product.slug}` 
    : `/products/${product.slug}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const openWhatsAppChat = () => {
    const message = `Hi! I'm interested in "${product.name}" on ShopThings.\n${productUrl}`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${product.vendor.whatsapp?.replace(/[^0-9]/g, '')}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleAddToCart = () => {
    addItem({
      id: `cart-${product.id}-${Date.now()}`,
      quantity,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        currency: 'NGN',
        images: product.images,
        stock_quantity: product.stock_quantity,
        vendor: {
          id: product.vendor.id,
          store_name: product.vendor.store_name,
          is_verified: product.vendor.is_verified,
        },
      },
    });
  };

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, Math.min(product.stock_quantity, prev + delta)));
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Share Product</h3>
              <button 
                onClick={() => setShowShareModal(false)}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Product Preview */}
            <div className="flex items-center gap-4 mb-6 p-4 bg-muted rounded-xl">
              <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-border">
                <Package className="w-8 h-8 text-primary/20" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                <p className="text-sm text-secondary font-semibold">{formatPrice(product.price)}</p>
              </div>
            </div>

            {/* Product Link */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Product Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={productUrl}
                  readOnly
                  className="flex-1 px-4 py-2 border border-border rounded-lg bg-muted text-sm"
                />
                <Button
                  onClick={copyToClipboard}
                  variant={copied ? 'secondary' : 'outline'}
                  size="sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-1" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Share on Social */}
            <div>
              <label className="block text-sm font-medium mb-3">Share on Social Media</label>
              <div className="flex items-center gap-3">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Check out ${product.name} on ShopThings! ${productUrl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-[#25D366] text-white rounded-full hover:opacity-90 transition-opacity"
                >
                  <WhatsAppIcon className="w-6 h-6" />
                </a>
                <a
                  href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${product.name} on ShopThings!`)}&url=${encodeURIComponent(productUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-black text-white rounded-full hover:opacity-90 transition-opacity"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-[#1877F2] text-white rounded-full hover:opacity-90 transition-opacity"
                >
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div className="bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link href="/products" className="text-muted-foreground hover:text-foreground">
              Products
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <Link href={`/products?category=${product.category.slug}`} className="text-muted-foreground hover:text-foreground">
              {product.category.name}
            </Link>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-muted rounded-xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Package className="w-24 h-24 text-primary/20" />
              </div>
              {discountPercentage > 0 && (
                <span className="absolute top-4 left-4 bg-accent text-white text-sm font-bold px-3 py-1 rounded-full">
                  -{discountPercentage}%
                </span>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? 'border-secondary' : 'border-border hover:border-secondary/50'
                  }`}
                >
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <Package className="w-8 h-8 text-primary/20" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Vendor */}
            <Link 
              href={`/vendors/${product.vendor.id}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
            >
              <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                <span className="text-xs font-bold text-secondary">
                  {product.vendor.store_name.charAt(0)}
                </span>
              </div>
              {product.vendor.store_name}
              {product.vendor.is_verified && (
                <BadgeCheck className="w-4 h-4 text-secondary" />
              )}
            </Link>

            {/* Title & Rating */}
            <div>
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating}</span>
                  <span className="text-muted-foreground">({product.review_count} reviews)</span>
                </div>
                <span className="text-muted-foreground">|</span>
                <span className="text-muted-foreground">SKU: {product.sku}</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {product.stock_quantity > 10 ? (
                <span className="text-success flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-success"></span>
                  In Stock
                </span>
              ) : product.stock_quantity > 0 ? (
                <span className="text-accent flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-accent"></span>
                  Only {product.stock_quantity} left
                </span>
              ) : (
                <span className="text-error flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-error"></span>
                  Out of Stock
                </span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  className="p-3 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock_quantity}
                  className="p-3 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={product.stock_quantity === 0}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Add to Cart
              </Button>

              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`p-3 border rounded-lg transition-colors ${
                  isWishlisted 
                    ? 'bg-accent/10 border-accent text-accent' 
                    : 'border-border hover:bg-muted'
                }`}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="p-3 border border-border rounded-lg hover:bg-muted transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>

            {/* WhatsApp Chat Button */}
            {product.vendor.whatsapp && (
              <Button
                variant="outline"
                size="lg"
                className="w-full border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white"
                onClick={openWhatsAppChat}
              >
                <WhatsAppIcon className="w-5 h-5 mr-2" />
                Chat with Seller on WhatsApp
              </Button>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-secondary" />
                <span className="text-xs text-muted-foreground">Free Shipping</span>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-secondary" />
                <span className="text-xs text-muted-foreground">Secure Payment</span>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-secondary" />
                <span className="text-xs text-muted-foreground">Easy Returns</span>
              </div>
            </div>

            {/* Vendor Card */}
            <div className="bg-muted rounded-xl p-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center">
                  <span className="text-xl font-bold text-secondary">
                    {product.vendor.store_name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{product.vendor.store_name}</h3>
                    {product.vendor.is_verified && (
                      <BadgeCheck className="w-5 h-5 text-secondary" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {product.vendor.rating}
                    </span>
                    <span>{product.vendor.total_sales.toLocaleString()} sales</span>
                  </div>
                </div>
                <Link
                  href={`/vendors/${product.vendor.id}`}
                  className="px-4 py-2 border border-border rounded-lg hover:bg-white transition-colors text-sm font-medium"
                >
                  Visit Store
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="border-b border-border">
            <div className="flex gap-8">
              {(['description', 'specifications', 'reviews'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 font-medium capitalize transition-colors ${
                    activeTab === tab 
                      ? 'text-secondary border-b-2 border-secondary' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                  {tab === 'reviews' && ` (${product.review_count})`}
                </button>
              ))}
            </div>
          </div>

          <div className="py-8">
            {activeTab === 'description' && (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                  {product.description}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="max-w-2xl">
                <table className="w-full">
                  <tbody>
                    {product.specifications.map((spec, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-muted' : ''}>
                        <td className="px-4 py-3 font-medium text-foreground">{spec.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {/* Review Summary */}
                <div className="flex flex-col sm:flex-row gap-8 p-6 bg-muted rounded-xl">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-primary">{product.rating}</div>
                    <div className="flex items-center justify-center gap-1 my-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.round(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Based on {product.review_count} reviews
                    </div>
                  </div>
                  <div className="flex-1">
                    <Button variant="primary">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Write a Review
                    </Button>
                  </div>
                </div>

                {/* Review List */}
                <div className="space-y-6">
                  {MOCK_REVIEWS.map((review) => (
                    <div key={review.id} className="border-b border-border pb-6 last:border-0">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                          <span className="font-bold text-secondary">
                            {review.user.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{review.user}</span>
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= review.rating
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground mb-2">
                            {new Date(review.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </div>
                          <p className="text-foreground">{review.comment}</p>
                          <button className="mt-2 text-sm text-muted-foreground hover:text-foreground">
                            Helpful ({review.helpful})
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-heading font-bold text-primary mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {RELATED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
