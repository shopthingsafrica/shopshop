/**
 * Search and filtering utilities for products
 */

import { createClient } from '@/lib/supabase/client';
import type { ProductWithDetails } from '@/types';

export interface SearchFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  verifiedOnly?: boolean;
  inStockOnly?: boolean;
  minRating?: number;
  sortBy?: 'newest' | 'popular' | 'price-low' | 'price-high' | 'rating';
  page?: number;
  limit?: number;
}

export interface SearchResult {
  products: ProductWithDetails[];
  total: number;
  page: number;
  totalPages: number;
}

/**
 * Search products with filters
 */
export async function searchProducts(filters: SearchFilters = {}): Promise<SearchResult> {
  const supabase = createClient();
  
  const {
    query = '',
    category,
    minPrice,
    maxPrice,
    verifiedOnly = false,
    inStockOnly = true,
    minRating,
    sortBy = 'newest',
    page = 1,
    limit = 12,
  } = filters;

  // Calculate pagination
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  // Build query
  let dbQuery = supabase
    .from('products')
    .select(`
      *,
      vendor:vendors!inner(
        id,
        store_name,
        is_verified,
        logo_url
      ),
      category:categories!inner(
        id,
        name,
        slug
      )
    `, { count: 'exact' })
    .eq('status', 'active');

  // Full-text search
  if (query) {
    dbQuery = dbQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`);
  }

  // Category filter
  if (category) {
    dbQuery = dbQuery.eq('category.slug', category);
  }

  // Price range filter
  if (minPrice !== undefined) {
    dbQuery = dbQuery.gte('price', minPrice);
  }
  if (maxPrice !== undefined) {
    dbQuery = dbQuery.lte('price', maxPrice);
  }

  // Verified vendors only
  if (verifiedOnly) {
    dbQuery = dbQuery.eq('vendor.is_verified', true);
  }

  // In stock only
  if (inStockOnly) {
    dbQuery = dbQuery.gt('stock_quantity', 0);
  }

  // Rating filter
  if (minRating !== undefined) {
    dbQuery = dbQuery.gte('average_rating', minRating);
  }

  // Sorting
  switch (sortBy) {
    case 'newest':
      dbQuery = dbQuery.order('created_at', { ascending: false });
      break;
    case 'popular':
      dbQuery = dbQuery.order('review_count', { ascending: false });
      break;
    case 'price-low':
      dbQuery = dbQuery.order('price', { ascending: true });
      break;
    case 'price-high':
      dbQuery = dbQuery.order('price', { ascending: false });
      break;
    case 'rating':
      dbQuery = dbQuery.order('average_rating', { ascending: false });
      break;
  }

  // Pagination
  dbQuery = dbQuery.range(from, to);

  // Execute query
  const { data, error, count } = await dbQuery;

  if (error) {
    console.error('Search error:', error);
    throw error;
  }

  const total = count || 0;
  const totalPages = Math.ceil(total / limit);

  return {
    products: (data || []) as ProductWithDetails[],
    total,
    page,
    totalPages,
  };
}

/**
 * Get search suggestions based on query
 */
export async function getSearchSuggestions(query: string, limit: number = 5): Promise<string[]> {
  if (!query || query.length < 2) return [];

  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select('name')
    .eq('status', 'active')
    .ilike('name', `%${query}%`)
    .limit(limit);

  if (error) {
    console.error('Suggestions error:', error);
    return [];
  }

  return data?.map(p => p.name) || [];
}

/**
 * Get popular search terms
 */
export async function getPopularSearches(limit: number = 10): Promise<string[]> {
  // This would typically come from a search_logs table
  // For now, return some common searches
  return [
    'African print',
    'Kente cloth',
    'Ankara fabric',
    'Traditional wear',
    'Handmade jewelry',
    'African art',
    'Dashiki',
    'Beaded accessories',
  ].slice(0, limit);
}

/**
 * Get related products
 */
export async function getRelatedProducts(
  productId: string,
  limit: number = 4
): Promise<ProductWithDetails[]> {
  const supabase = createClient();

  // Get the current product's category
  const { data: product } = await supabase
    .from('products')
    .select('category_id')
    .eq('id', productId)
    .single();

  if (!product) return [];

  // Get products from the same category
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      vendor:vendors!inner(
        id,
        store_name,
        is_verified,
        logo_url
      ),
      category:categories!inner(
        id,
        name,
        slug
      )
    `)
    .eq('status', 'active')
    .eq('category_id', product.category_id)
    .neq('id', productId)
    .gt('stock_quantity', 0)
    .order('average_rating', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Related products error:', error);
    return [];
  }

  return (data || []) as ProductWithDetails[];
}

/**
 * Get featured products
 */
export async function getFeaturedProducts(limit: number = 8): Promise<ProductWithDetails[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      vendor:vendors!inner(
        id,
        store_name,
        is_verified,
        logo_url
      ),
      category:categories!inner(
        id,
        name,
        slug
      )
    `)
    .eq('status', 'active')
    .eq('is_featured', true)
    .gt('stock_quantity', 0)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Featured products error:', error);
    return [];
  }

  return (data || []) as ProductWithDetails[];
}

/**
 * Get trending products (most viewed/purchased)
 */
export async function getTrendingProducts(limit: number = 8): Promise<ProductWithDetails[]> {
  const supabase = createClient();

  // For now, use products with highest ratings and review count
  // In production, you'd track views/purchases
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      vendor:vendors!inner(
        id,
        store_name,
        is_verified,
        logo_url
      ),
      category:categories!inner(
        id,
        name,
        slug
      )
    `)
    .eq('status', 'active')
    .gt('stock_quantity', 0)
    .gt('review_count', 0)
    .order('review_count', { ascending: false })
    .order('average_rating', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Trending products error:', error);
    return [];
  }

  return (data || []) as ProductWithDetails[];
}

/**
 * Get new arrivals
 */
export async function getNewArrivals(limit: number = 8): Promise<ProductWithDetails[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      vendor:vendors!inner(
        id,
        store_name,
        is_verified,
        logo_url
      ),
      category:categories!inner(
        id,
        name,
        slug
      )
    `)
    .eq('status', 'active')
    .gt('stock_quantity', 0)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('New arrivals error:', error);
    return [];
  }

  return (data || []) as ProductWithDetails[];
}

/**
 * Get products by vendor
 */
export async function getVendorProducts(
  vendorId: string,
  limit: number = 12
): Promise<ProductWithDetails[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      vendor:vendors!inner(
        id,
        store_name,
        is_verified,
        logo_url
      ),
      category:categories!inner(
        id,
        name,
        slug
      )
    `)
    .eq('status', 'active')
    .eq('vendor_id', vendorId)
    .gt('stock_quantity', 0)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Vendor products error:', error);
    return [];
  }

  return (data || []) as ProductWithDetails[];
}

/**
 * Get price range for a category
 */
export async function getCategoryPriceRange(categorySlug?: string): Promise<{ min: number; max: number }> {
  const supabase = createClient();

  let query = supabase
    .from('products')
    .select('price')
    .eq('status', 'active');

  if (categorySlug) {
    query = query.eq('category.slug', categorySlug);
  }

  const { data, error } = await query;

  if (error || !data || data.length === 0) {
    return { min: 0, max: 100000 };
  }

  const prices = data.map(p => p.price);
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
}
