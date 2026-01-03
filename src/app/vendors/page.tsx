'use client';

import Link from 'next/link';
import { Star, BadgeCheck, MapPin, Package } from 'lucide-react';

const MOCK_VENDORS = [
  {
    id: '1',
    store_name: 'Accra Textiles',
    description: 'Authentic Ghanaian textiles including Kente, Batik, and traditional fabrics.',
    logo: null,
    banner: null,
    location: 'Accra, Ghana',
    is_verified: true,
    rating: 4.9,
    review_count: 456,
    product_count: 87,
    total_sales: 1250,
  },
  {
    id: '2',
    store_name: 'Lagos Fashion House',
    description: 'Contemporary African fashion with a modern twist. Ankara, Dashiki, and custom designs.',
    logo: null,
    banner: null,
    location: 'Lagos, Nigeria',
    is_verified: true,
    rating: 4.7,
    review_count: 324,
    product_count: 156,
    total_sales: 2100,
  },
  {
    id: '3',
    store_name: 'Natural Ghana',
    description: 'Organic beauty products made from shea butter, moringa, and other natural ingredients.',
    logo: null,
    banner: null,
    location: 'Kumasi, Ghana',
    is_verified: true,
    rating: 4.8,
    review_count: 512,
    product_count: 45,
    total_sales: 3200,
  },
  {
    id: '4',
    store_name: 'Nairobi Crafts',
    description: 'Handcrafted jewelry and accessories from East Africa. Each piece tells a story.',
    logo: null,
    banner: null,
    location: 'Nairobi, Kenya',
    is_verified: false,
    rating: 4.5,
    review_count: 178,
    product_count: 62,
    total_sales: 890,
  },
  {
    id: '5',
    store_name: 'Mali Instruments',
    description: 'Traditional African musical instruments. Djembe drums, kora, balafon, and more.',
    logo: null,
    banner: null,
    location: 'Bamako, Mali',
    is_verified: true,
    rating: 4.9,
    review_count: 234,
    product_count: 34,
    total_sales: 567,
  },
  {
    id: '6',
    store_name: 'Benin Arts',
    description: 'Traditional Nigerian art including wooden carvings, bronze sculptures, and masks.',
    logo: null,
    banner: null,
    location: 'Benin City, Nigeria',
    is_verified: true,
    rating: 4.7,
    review_count: 145,
    product_count: 78,
    total_sales: 445,
  },
  {
    id: '7',
    store_name: 'Cape Town Curios',
    description: 'South African crafts, Zulu beadwork, and unique curios from the Rainbow Nation.',
    logo: null,
    banner: null,
    location: 'Cape Town, South Africa',
    is_verified: true,
    rating: 4.6,
    review_count: 267,
    product_count: 92,
    total_sales: 1100,
  },
  {
    id: '8',
    store_name: 'Ethiopian Treasures',
    description: 'Coffee, spices, traditional clothing, and handwoven baskets from Ethiopia.',
    logo: null,
    banner: null,
    location: 'Addis Ababa, Ethiopia',
    is_verified: false,
    rating: 4.4,
    review_count: 89,
    product_count: 56,
    total_sales: 320,
  },
];

export default function VendorsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary to-primary/90 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Meet Our Verified Vendors
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Discover talented artisans and businesses from across Africa. Each vendor brings authentic products and unique stories to our marketplace.
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold">{MOCK_VENDORS.length}+</div>
              <div className="text-sm text-white/70">Active Vendors</div>
            </div>
            <div>
              <div className="text-3xl font-bold">15+</div>
              <div className="text-sm text-white/70">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm text-white/70">Products</div>
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="bg-muted border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">Vendors</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <p className="text-muted-foreground">
            Showing {MOCK_VENDORS.length} vendors
          </p>
          <div className="flex items-center gap-4">
            <select className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary">
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest</option>
              <option value="products">Most Products</option>
            </select>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-border text-secondary focus:ring-secondary"
              />
              <span className="text-sm">Verified Only</span>
            </label>
          </div>
        </div>

        {/* Vendors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_VENDORS.map((vendor) => (
            <Link
              key={vendor.id}
              href={`/vendors/${vendor.id}`}
              className="bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow group"
            >
              {/* Banner */}
              <div className="h-32 bg-gradient-to-br from-secondary/20 to-primary/20 relative">
                {/* Avatar */}
                <div className="absolute -bottom-8 left-4">
                  <div className="w-16 h-16 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center">
                    <span className="text-2xl font-bold text-secondary">
                      {vendor.store_name.charAt(0)}
                    </span>
                  </div>
                </div>
                {vendor.is_verified && (
                  <div className="absolute top-3 right-3 bg-secondary text-white text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" />
                    Verified
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="pt-10 p-4">
                <h3 className="font-heading font-semibold text-lg text-primary group-hover:text-secondary transition-colors">
                  {vendor.store_name}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 mb-2">
                  <MapPin className="w-4 h-4" />
                  {vendor.location}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {vendor.description}
                </p>

                {/* Stats */}
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{vendor.rating}</span>
                    <span className="text-sm text-muted-foreground">
                      ({vendor.review_count})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Package className="w-4 h-4" />
                    {vendor.product_count} products
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 bg-accent/10 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary mb-4">
            Want to Sell on ShopThings?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
            Join our community of African vendors and reach customers worldwide. Low fees, easy setup, and dedicated support.
          </p>
          <Link
            href="/vendor/register"
            className="inline-flex items-center justify-center px-6 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
          >
            Start Selling Today
          </Link>
        </div>
      </div>
    </div>
  );
}
