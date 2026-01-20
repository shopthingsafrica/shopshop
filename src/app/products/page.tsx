'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Filter, 
  Grid3X3, 
  LayoutList, 
  ChevronDown, 
  ChevronLeft, 
  ChevronRight,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { Header, Footer } from '@/components/layout';
import { ProductCard } from '@/components/products';
import { Button, Input, Select, Checkbox } from '@/components/ui';
import { useCurrencyStore } from '@/stores';
import { searchProducts, getSearchSuggestions, SearchFilters } from '@/lib/search';
import { ProductWithDetails } from '@/types';

// Mock data removed in favor of Supabase fetching


const CATEGORIES = [
  { id: '1', name: 'Fashion', slug: 'fashion', count: 245 },
  { id: '2', name: 'Beauty', slug: 'beauty', count: 156 },
  { id: '3', name: 'Accessories', slug: 'accessories', count: 89 },
  { id: '4', name: 'Art & Crafts', slug: 'art-crafts', count: 67 },
  { id: '5', name: 'Home & Living', slug: 'home-living', count: 123 },
  { id: '6', name: 'Food & Beverages', slug: 'food-beverages', count: 45 },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

function ProductsContent() {
  const searchParams = useSearchParams();
  // Currency formatting handled by ProductCard component
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  
  const [products, setProducts] = useState<ProductWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch products with search and filters
  useEffect(() => {
    async function fetchProducts() {
      setIsLoading(true);
      try {
        const filters: SearchFilters = {
          query: searchQuery,
          category: categorySlug,
          minPrice: priceRange.min ? parseInt(priceRange.min) : undefined,
          maxPrice: priceRange.max ? parseInt(priceRange.max) : undefined,
          verifiedOnly,
          sortBy: sortBy as any,
          page: currentPage,
          limit: productsPerPage,
        };

        const result = await searchProducts(filters);
        setProducts(result.products);
        setTotalProducts(result.total);
        setTotalPages(result.totalPages);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, [searchQuery, categorySlug, priceRange, verifiedOnly, sortBy, currentPage]);
  
  const productsPerPage = 12;

  const searchQuery = searchParams.get('search') || '';
  const categorySlug = searchParams.get('category') || '';

  // Filter and sort products - now handled by searchProducts
  const filteredProducts = products; // Products are already filtered by the search function

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setVerifiedOnly(false);
    setPriceRange({ min: '', max: '' });
  };

  const hasActiveFilters = selectedCategories.length > 0 || verifiedOnly || priceRange.min || priceRange.max;

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
            <span className="text-foreground font-medium">Products</span>
            {searchQuery && (
              <>
                <span className="text-muted-foreground">/</span>
                <span className="text-foreground">Search: &quot;{searchQuery}&quot;</span>
              </>
            )}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-heading font-bold text-primary mb-2">
            {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
          </h1>
          <p className="text-muted-foreground">
            {totalProducts} products found
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Filter Header */}
              <div className="flex items-center justify-between">
                <h2 className="font-heading font-semibold text-lg flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filters
                </h2>
                {hasActiveFilters && (
                  <button 
                    onClick={clearFilters}
                    className="text-sm text-secondary hover:underline"
                  >
                    Clear all
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="bg-white rounded-lg border border-border p-4">
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(category => (
                    <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="w-4 h-4 rounded border-border text-secondary focus:ring-secondary"
                      />
                      <span className="text-sm">{category.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">({category.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="bg-white rounded-lg border border-border p-4">
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="text-sm"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Verified Sellers */}
              <div className="bg-white rounded-lg border border-border p-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-secondary focus:ring-secondary"
                  />
                  <span className="text-sm font-medium">Verified Sellers Only</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white rounded-lg border border-border p-4">
              {/* Mobile filter button */}
              <button
                onClick={() => setShowFilters(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {hasActiveFilters && (
                  <span className="bg-secondary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {selectedCategories.length + (verifiedOnly ? 1 : 0) + (priceRange.min || priceRange.max ? 1 : 0)}
                  </span>
                )}
              </button>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  aria-label="Sort products by"
                >
                  {SORT_OPTIONS.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode */}
              <div className="flex items-center gap-1 border border-border rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-muted'}`}
                  aria-label="List view"
                  title="List view"
                >
                  <LayoutList className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedCategories.map(catId => {
                  const cat = CATEGORIES.find(c => c.id === catId);
                  return cat ? (
                    <span key={catId} className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                      {cat.name}
                      <button onClick={() => handleCategoryToggle(catId)} aria-label={`Remove ${cat.name} filter`}>
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ) : null;
                })}
                {verifiedOnly && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                    Verified Only
                    <button onClick={() => setVerifiedOnly(false)} aria-label="Remove verified filter">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {(priceRange.min || priceRange.max) && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
                    {priceRange.min ? `₦${priceRange.min}` : '₦0'} - {priceRange.max ? `₦${priceRange.max}` : '∞'}
                    <button onClick={() => setPriceRange({ min: '', max: '' })} aria-label="Remove price filter">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
              </div>
            )}

            {/* Products Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-lg"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className={
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-10 h-10 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-heading font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 rounded-lg font-medium ${
                      currentPage === page 
                        ? 'bg-primary text-white' 
                        : 'border border-border hover:bg-muted'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-white shadow-xl overflow-y-auto">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="font-heading font-semibold text-lg">Filters</h2>
              <button onClick={() => setShowFilters(false)} aria-label="Close filters">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {CATEGORIES.map(category => (
                    <label key={category.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryToggle(category.id)}
                        className="w-4 h-4 rounded border-border text-secondary focus:ring-secondary"
                      />
                      <span className="text-sm">{category.name}</span>
                      <span className="text-xs text-muted-foreground ml-auto">({category.count})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                    className="text-sm"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Verified Sellers */}
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 rounded border-border text-secondary focus:ring-secondary"
                  />
                  <span className="text-sm font-medium">Verified Sellers Only</span>
                </label>
              </div>
            </div>

            <div className="p-4 border-t border-border space-y-2">
              <Button variant="primary" fullWidth onClick={() => setShowFilters(false)}>
                Apply Filters
              </Button>
              {hasActiveFilters && (
                <Button variant="outline" fullWidth onClick={clearFilters}>
                  Clear All
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}
