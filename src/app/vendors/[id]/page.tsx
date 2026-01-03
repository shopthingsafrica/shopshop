'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import {
  Star,
  BadgeCheck,
  MapPin,
  Calendar,
  Package,
  ShoppingBag,
  MessageCircle,
  Share2,
  Heart,
  Copy,
  Check,
  ExternalLink,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui';
import ProductCard from '@/components/products/ProductCard';
import type { ProductWithDetails } from '@/types';

// Social media icons components
const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const WhatsAppIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const MOCK_VENDOR = {
  id: '1',
  store_name: 'Accra Textiles',
  description: 'Authentic Ghanaian textiles including Kente, Batik, and traditional fabrics. We are a family-owned business that has been operating for over 25 years, specializing in hand-woven Kente cloth from the Ashanti region. Our artisans use traditional techniques passed down through generations to create beautiful, high-quality textiles that celebrate African heritage.',
  logo: null,
  banner: null,
  location: 'Accra, Ghana',
  is_verified: true,
  rating: 4.9,
  review_count: 456,
  product_count: 87,
  total_sales: 1250,
  created_at: '2020-03-15',
  response_rate: 98,
  response_time: '1-2 hours',
  whatsapp: '+233501234567',
  social_links: {
    instagram: 'https://instagram.com/accratextiles',
    tiktok: 'https://tiktok.com/@accratextiles',
    facebook: 'https://facebook.com/accratextiles',
  },
  policies: {
    shipping: 'We ship worldwide within 3-5 business days. Free shipping on orders over $100.',
    returns: '30-day return policy for unused items in original packaging.',
    warranty: 'All our products are guaranteed authentic and handmade.',
  },
};

const MOCK_PRODUCTS: ProductWithDetails[] = [
  {
    id: '1',
    name: 'Traditional Kente Cloth',
    description: 'Hand-woven Kente cloth from Ghana',
    slug: 'traditional-kente-cloth',
    price: 15000,
    compare_at_price: 18000,
    currency: 'GHS',
    stock_quantity: 25,
    images: [],
    status: 'active',
    average_rating: 4.8,
    review_count: 124,
    is_featured: true,
    created_at: '2024-01-01',
    category: { id: 'cat-1', name: 'Textiles', slug: 'textiles' },
    vendor: { id: '1', store_name: 'Accra Textiles', logo_url: null, is_verified: true },
  },
  {
    id: '2',
    name: 'Ankara Print Fabric Set',
    description: '6 yards of premium Ankara fabric',
    slug: 'ankara-print-fabric-set',
    price: 8500,
    compare_at_price: null,
    currency: 'GHS',
    stock_quantity: 50,
    images: [],
    status: 'active',
    average_rating: 4.7,
    review_count: 89,
    is_featured: false,
    created_at: '2024-01-05',
    category: { id: 'cat-1', name: 'Textiles', slug: 'textiles' },
    vendor: { id: '1', store_name: 'Accra Textiles', logo_url: null, is_verified: true },
  },
  {
    id: '3',
    name: 'Batik Tie-Dye Fabric',
    description: 'Beautiful hand-dyed batik fabric',
    slug: 'batik-tie-dye-fabric',
    price: 6000,
    compare_at_price: 7500,
    currency: 'GHS',
    stock_quantity: 30,
    images: [],
    status: 'active',
    average_rating: 4.5,
    review_count: 67,
    is_featured: false,
    created_at: '2024-01-10',
    category: { id: 'cat-1', name: 'Textiles', slug: 'textiles' },
    vendor: { id: '1', store_name: 'Accra Textiles', logo_url: null, is_verified: true },
  },
  {
    id: '4',
    name: 'Kente Stole Scarf',
    description: 'Elegant Kente stole for special occasions',
    slug: 'kente-stole-scarf',
    price: 4500,
    compare_at_price: null,
    currency: 'GHS',
    stock_quantity: 40,
    images: [],
    status: 'active',
    average_rating: 4.9,
    review_count: 156,
    is_featured: true,
    created_at: '2024-01-15',
    category: { id: 'cat-2', name: 'Accessories', slug: 'accessories' },
    vendor: { id: '1', store_name: 'Accra Textiles', logo_url: null, is_verified: true },
  },
];

const MOCK_REVIEWS = [
  {
    id: '1',
    userName: 'Sarah M.',
    rating: 5,
    date: '2024-01-10',
    comment: 'Absolutely beautiful Kente cloth! The quality is outstanding and it arrived faster than expected. Will definitely order again.',
    product: 'Traditional Kente Cloth',
  },
  {
    id: '2',
    userName: 'James O.',
    rating: 5,
    date: '2024-01-08',
    comment: 'Great communication and excellent products. The colors are vibrant and true to the photos.',
    product: 'Ankara Print Fabric Set',
  },
  {
    id: '3',
    userName: 'Ama K.',
    rating: 4,
    date: '2024-01-05',
    comment: 'Beautiful fabrics. Shipping took a bit longer than expected but the quality made up for it.',
    product: 'Batik Tie-Dye Fabric',
  },
];

export default function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <div className="min-h-screen bg-background">
      {/* Banner */}
      <div className="h-48 md:h-64 bg-gradient-to-br from-secondary/30 to-primary/30 relative">
        <div className="absolute inset-0 bg-primary/10" />
      </div>

      {/* Vendor Info */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-white rounded-xl border border-border p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="shrink-0">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center border-4 border-white shadow-lg">
                <span className="text-4xl md:text-5xl font-bold text-white">
                  {MOCK_VENDOR.store_name.charAt(0)}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
                      {MOCK_VENDOR.store_name}
                    </h1>
                    {MOCK_VENDOR.is_verified && (
                      <span className="inline-flex items-center gap-1 bg-secondary text-white text-xs font-medium px-2 py-1 rounded-full">
                        <BadgeCheck className="w-3 h-3" />
                        Verified
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {MOCK_VENDOR.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      Joined {new Date(MOCK_VENDOR.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm">
                    <Heart className="w-4 h-4 mr-1" />
                    Follow
                  </Button>
                  <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                  <Button variant="primary" size="sm">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-border">
                <div>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-bold">{MOCK_VENDOR.rating}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{MOCK_VENDOR.review_count} reviews</p>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Package className="w-5 h-5 text-secondary" />
                    <span className="text-xl font-bold">{MOCK_VENDOR.product_count}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Products</p>
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <ShoppingBag className="w-5 h-5 text-secondary" />
                    <span className="text-xl font-bold">{MOCK_VENDOR.total_sales.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Sales</p>
                </div>
                <div>
                  <div className="text-xl font-bold">{MOCK_VENDOR.response_rate}%</div>
                  <p className="text-sm text-muted-foreground">Response Rate</p>
                </div>
                <div>
                  <div className="text-xl font-bold">{MOCK_VENDOR.response_time}</div>
                  <p className="text-sm text-muted-foreground">Response Time</p>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-muted-foreground leading-relaxed">
              {MOCK_VENDOR.description}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs & Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 border-b border-border mb-8">
          <button className="px-4 py-3 text-primary font-medium border-b-2 border-secondary">
            Products ({MOCK_VENDOR.product_count})
          </button>
          <button className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors">
            Reviews ({MOCK_VENDOR.review_count})
          </button>
          <button className="px-4 py-3 text-muted-foreground hover:text-foreground transition-colors">
            Policies
          </button>
        </div>

        {/* Products Grid */}
        <div className="mb-12">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {MOCK_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" size="lg">
              View All Products
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mb-12">
          <h2 className="text-xl font-heading font-semibold mb-6">Customer Reviews</h2>
          <div className="space-y-4">
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className="bg-white rounded-xl border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-medium">{review.userName}</p>
                    <p className="text-sm text-muted-foreground">
                      Purchased: {review.product}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'fill-muted text-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Policies Section */}
        <div className="bg-white rounded-xl border border-border p-6">
          <h2 className="text-xl font-heading font-semibold mb-6">Store Policies</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">Shipping Policy</h3>
              <p className="text-sm text-muted-foreground">{MOCK_VENDOR.policies.shipping}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Return Policy</h3>
              <p className="text-sm text-muted-foreground">{MOCK_VENDOR.policies.returns}</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Warranty</h3>
              <p className="text-sm text-muted-foreground">{MOCK_VENDOR.policies.warranty}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
