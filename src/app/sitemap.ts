import { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shopthings.com';
  const supabase = createClient();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/vendors`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/help`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
  ];

  try {
    // Get active products
    const { data: products } = await supabase
      .from('products')
      .select('id, updated_at')
      .eq('status', 'active')
      .limit(1000); // Limit for performance

    const productPages: MetadataRoute.Sitemap = products?.map((product) => ({
      url: `${baseUrl}/products/${product.id}`,
      lastModified: new Date(product.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || [];

    // Get categories
    const { data: categories } = await supabase
      .from('categories')
      .select('slug, updated_at')
      .eq('is_active', true);

    const categoryPages: MetadataRoute.Sitemap = categories?.map((category) => ({
      url: `${baseUrl}/products?category=${category.slug}`,
      lastModified: new Date(category.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })) || [];

    // Get verified vendors
    const { data: vendors } = await supabase
      .from('vendors')
      .select('id, updated_at')
      .eq('status', 'approved')
      .eq('is_verified', true)
      .limit(500);

    const vendorPages: MetadataRoute.Sitemap = vendors?.map((vendor) => ({
      url: `${baseUrl}/vendors/${vendor.id}`,
      lastModified: new Date(vendor.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })) || [];

    return [...staticPages, ...productPages, ...categoryPages, ...vendorPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}