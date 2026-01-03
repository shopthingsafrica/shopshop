'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Package } from 'lucide-react';

const CATEGORIES = [
  {
    id: '1',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Traditional and modern African fashion including ankara, kente, and dashiki styles',
    image: '/categories/fashion.jpg',
    productCount: 245,
    subcategories: ['Men\'s Wear', 'Women\'s Wear', 'Children\'s Wear', 'Traditional Attire']
  },
  {
    id: '2',
    name: 'Beauty & Skincare',
    slug: 'beauty',
    description: 'Natural beauty products made from shea butter, moringa, and other African botanicals',
    image: '/categories/beauty.jpg',
    productCount: 156,
    subcategories: ['Skincare', 'Haircare', 'Body Care', 'Natural Oils']
  },
  {
    id: '3',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Handcrafted jewelry, bags, and accessories featuring African designs',
    image: '/categories/accessories.jpg',
    productCount: 89,
    subcategories: ['Jewelry', 'Bags & Purses', 'Headwear', 'Footwear']
  },
  {
    id: '4',
    name: 'Art & Crafts',
    slug: 'art-crafts',
    description: 'Authentic African art, sculptures, paintings, and handmade crafts',
    image: '/categories/art.jpg',
    productCount: 67,
    subcategories: ['Paintings', 'Sculptures', 'Masks', 'Textiles']
  },
  {
    id: '5',
    name: 'Home & Living',
    slug: 'home-living',
    description: 'African-inspired home decor, furniture, and living essentials',
    image: '/categories/home.jpg',
    productCount: 123,
    subcategories: ['Decor', 'Furniture', 'Kitchen', 'Bedding']
  },
  {
    id: '6',
    name: 'Food & Beverages',
    slug: 'food-beverages',
    description: 'Authentic African spices, snacks, and specialty food items',
    image: '/categories/food.jpg',
    productCount: 45,
    subcategories: ['Spices', 'Snacks', 'Beverages', 'Specialty Foods']
  },
  {
    id: '7',
    name: 'Musical Instruments',
    slug: 'musical-instruments',
    description: 'Traditional African instruments including drums, stringed instruments, and more',
    image: '/categories/music.jpg',
    productCount: 34,
    subcategories: ['Drums', 'Stringed', 'Wind', 'Percussion']
  },
  {
    id: '8',
    name: 'Books & Literature',
    slug: 'books',
    description: 'African literature, history books, and educational materials',
    image: '/categories/books.jpg',
    productCount: 78,
    subcategories: ['Fiction', 'Non-Fiction', 'Children\'s Books', 'Educational']
  },
];

export default function CategoriesPage() {
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
            <span className="text-foreground font-medium">Categories</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-primary mb-4">
            Browse Categories
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover authentic African products across our curated categories. From fashion to art, find treasures that celebrate African heritage.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group bg-white rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Category Image */}
              <div className="relative h-48 bg-gradient-to-br from-primary/10 to-secondary/10">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Package className="w-16 h-16 text-primary/30" />
                </div>
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-primary/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-medium flex items-center gap-2">
                    Browse {category.name}
                    <ChevronRight className="w-5 h-5" />
                  </span>
                </div>
              </div>

              {/* Category Info */}
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <h2 className="text-xl font-heading font-semibold text-primary group-hover:text-secondary transition-colors">
                    {category.name}
                  </h2>
                  <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                    {category.productCount} items
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {category.description}
                </p>
                
                {/* Subcategories */}
                <div className="flex flex-wrap gap-2">
                  {category.subcategories.slice(0, 3).map((sub, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                    >
                      {sub}
                    </span>
                  ))}
                  {category.subcategories.length > 3 && (
                    <span className="text-xs text-secondary">
                      +{category.subcategories.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Featured Banner */}
        <div className="mt-12 bg-gradient-to-r from-primary to-primary/90 rounded-2xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-heading font-bold mb-4">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Our marketplace is constantly growing. Request products or become a vendor to share your African treasures with the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/vendor/register"
              className="inline-flex items-center justify-center px-6 py-3 bg-secondary text-white font-medium rounded-lg hover:bg-secondary/90 transition-colors"
            >
              Become a Vendor
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
            >
              Request a Product
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
