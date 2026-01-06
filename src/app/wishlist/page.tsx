'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';
import { useCartStore, useCurrencyStore } from '@/stores';
import { getPlaceholderImage } from '@/lib/placeholders';

// Mock wishlist data - in a real app this would come from a store or API
const MOCK_WISHLIST = [
  {
    id: '1',
    productId: '1',
    name: 'Traditional Kente Cloth',
    price: 15000,
    comparePrice: 18000,
    inStock: true,
    vendorName: 'Accra Textiles',
    slug: 'traditional-kente-cloth',
  },
  {
    id: '2',
    productId: '2',
    name: 'Ankara Print Dress',
    price: 12500,
    comparePrice: null,
    inStock: true,
    vendorName: 'Lagos Fashion House',
    slug: 'ankara-print-dress',
  },
  {
    id: '3',
    productId: '3',
    name: 'Handmade Leather Sandals',
    price: 8000,
    comparePrice: 10000,
    inStock: false,
    vendorName: 'Nairobi Crafts',
    slug: 'handmade-leather-sandals',
  },
  {
    id: '4',
    productId: '4',
    name: 'Shea Butter Collection',
    price: 5500,
    comparePrice: null,
    inStock: true,
    vendorName: 'Natural Ghana',
    slug: 'shea-butter-collection',
  },
];

export default function WishlistPage() {
  const { addItem } = useCartStore();
  const { formatConvertedPrice } = useCurrencyStore();

  const handleAddToCart = (item: typeof MOCK_WISHLIST[0]) => {
    addItem({
      id: `cart-${item.productId}`,
      quantity: 1,
      product: {
        id: item.productId,
        name: item.name,
        slug: item.slug,
        price: item.price,
        currency: 'NGN',
        images: [],
        stock_quantity: item.inStock ? 10 : 0,
        vendor: {
          id: '1',
          store_name: item.vendorName,
          is_verified: true,
        },
      },
    });
  };

  if (MOCK_WISHLIST.length === 0) {
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
              <span className="text-foreground font-medium">Wishlist</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-heading font-bold text-primary mb-2">
              Your Wishlist is Empty
            </h1>
            <p className="text-muted-foreground mb-8">
              Save items you love for later by clicking the heart icon on any product.
            </p>
            <Link href="/products">
              <Button variant="primary" size="lg">
                Explore Products
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
            <span className="text-foreground font-medium">Wishlist</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
            My Wishlist ({MOCK_WISHLIST.length})
          </h1>
          <Button variant="outline" size="sm" className="text-error hover:text-error hover:bg-error/10">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        {/* Wishlist Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_WISHLIST.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl border border-border overflow-hidden group"
            >
              {/* Image */}
              <Link href={`/products/${item.slug}`} className="block">
                <div className="aspect-square bg-muted relative overflow-hidden">
                  <Image
                    src={getPlaceholderImage(item.id)}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                  {!item.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-foreground text-sm font-medium px-3 py-1 rounded-full">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>
              </Link>

              {/* Info */}
              <div className="p-4">
                <Link
                  href={`/products/${item.slug}`}
                  className="font-medium text-primary hover:text-secondary transition-colors line-clamp-2 mb-1"
                >
                  {item.name}
                </Link>
                <p className="text-sm text-muted-foreground mb-3">
                  by {item.vendorName}
                </p>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-lg font-bold text-primary">
                    {formatConvertedPrice(item.price, 'NGN')}
                  </span>
                  {item.comparePrice && (
                    <span className="text-sm text-muted-foreground line-through">
                      {formatConvertedPrice(item.comparePrice, 'NGN')}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    fullWidth
                    disabled={!item.inStock}
                    onClick={() => handleAddToCart(item)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    {item.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  <button
                    className="p-2 border border-border rounded-lg hover:bg-error/10 hover:border-error hover:text-error transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Link href="/products">
            <Button variant="outline" size="lg">
              Continue Shopping
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
