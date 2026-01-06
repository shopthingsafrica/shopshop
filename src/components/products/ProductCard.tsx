'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Star, BadgeCheck } from 'lucide-react';
import { useCurrencyStore, useCartStore } from '@/stores';
import { getProductImage } from '@/lib/placeholders';
import type { ProductWithDetails, CurrencyCode } from '@/types';

interface ProductCardProps {
  product: ProductWithDetails;
  showVendor?: boolean;
}

export default function ProductCard({ product, showVendor = true }: ProductCardProps) {
  const { convertPrice, formatPrice, currentCurrency } = useCurrencyStore();
  const addItem = useCartStore((state) => state.addItem);
  
  const displayPrice = convertPrice(product.price, product.currency as CurrencyCode);
  const displayComparePrice = product.compare_at_price 
    ? convertPrice(product.compare_at_price, product.currency as CurrencyCode)
    : null;
  
  const discount = displayComparePrice 
    ? Math.round(((displayComparePrice - displayPrice) / displayComparePrice) * 100)
    : null;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: `cart-${product.id}`,
      quantity: 1,
      product: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        currency: product.currency,
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

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // TODO: Implement wishlist functionality
    console.log('Add to wishlist:', product.id);
  };

  const mainImage = getProductImage(product.images, product.id);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block bg-white rounded-xl overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300"
    >
      {/* Image container */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Discount badge */}
        {discount && (
          <span className="absolute top-3 left-3 bg-accent text-white text-xs font-bold px-2 py-1 rounded">
            -{discount}%
          </span>
        )}
        
        {/* Featured badge */}
        {product.is_featured && (
          <span className="absolute top-3 right-3 bg-secondary text-white text-xs font-bold px-2 py-1 rounded">
            Featured
          </span>
        )}
        
        {/* Quick actions */}
        <div className="absolute bottom-3 left-3 right-3 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleAddToWishlist}
            className="p-2 bg-white rounded-full shadow-md hover:bg-accent hover:text-white transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart className="w-5 h-5" />
          </button>
          <button
            onClick={handleAddToCart}
            className="p-2 bg-secondary text-white rounded-full shadow-md hover:bg-secondary/90 transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Vendor info */}
        {showVendor && (
          <div className="flex items-center text-sm text-muted-foreground mb-1">
            <span className="truncate">{product.vendor.store_name}</span>
            {product.vendor.is_verified && (
              <BadgeCheck className="w-4 h-4 ml-1 text-secondary flex-shrink-0" />
            )}
          </div>
        )}
        
        {/* Product name */}
        <h3 className="font-medium text-foreground line-clamp-2 mb-2 group-hover:text-secondary transition-colors">
          {product.name}
        </h3>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.average_rating)
                    ? 'text-warning fill-warning'
                    : 'text-border'
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground ml-2">
            ({product.review_count})
          </span>
        </div>
        
        {/* Price */}
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-primary">
            {formatPrice(displayPrice)}
          </span>
          {displayComparePrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(displayComparePrice)}
            </span>
          )}
        </div>
        
        {/* Stock status */}
        {product.stock_quantity <= 5 && product.stock_quantity > 0 && (
          <p className="text-xs text-warning mt-2">
            Only {product.stock_quantity} left in stock
          </p>
        )}
        {product.stock_quantity === 0 && (
          <p className="text-xs text-error mt-2">Out of stock</p>
        )}
      </div>
    </Link>
  );
}
