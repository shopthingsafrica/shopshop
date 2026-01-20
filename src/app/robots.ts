import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://shopthings.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',
          '/vendor/',
          '/dashboard/',
          '/api/',
          '/auth/',
          '/_next/',
          '/checkout/',
          '/cart/',
          '/account/',
          '/orders/',
          '/wishlist/',
          '/messages/',
        ],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/vendor/',
          '/dashboard/',
          '/api/',
          '/auth/',
          '/checkout/',
          '/cart/',
          '/account/',
          '/orders/',
          '/wishlist/',
          '/messages/',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}