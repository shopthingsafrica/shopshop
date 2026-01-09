import { createClient } from '@/lib/supabase/client';
import { ProductWithDetails } from '@/types';

export const getProducts = async (): Promise<ProductWithDetails[]> => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories!inner(id, name, slug),
      vendor:vendors!inner(id, store_name, logo_url, is_verified)
    `)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  // Cast JSON images to string[] array if needed, though Supabase returns as Json
  return (data as any[]).map(product => ({
    ...product,
    images: Array.isArray(product.images) ? product.images : []
  })) as ProductWithDetails[];
};

export const getFeaturedProducts = async (): Promise<ProductWithDetails[]> => {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      category:categories!inner(id, name, slug),
      vendor:vendors!inner(id, store_name, logo_url, is_verified)
    `)
    .eq('status', 'active')
    .eq('is_featured', true)
    .limit(8);

  if (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }

  return (data as any[]).map(product => ({
    ...product,
    images: Array.isArray(product.images) ? product.images : []
  })) as ProductWithDetails[];
};
