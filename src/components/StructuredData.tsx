'use client';

import { ProductWithDetails } from '@/types';

interface ProductStructuredDataProps {
  product: ProductWithDetails;
}

export function ProductStructuredData({ product }: ProductStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.images || [],
    "sku": product.id,
    "brand": {
      "@type": "Brand",
      "name": product.vendor?.store_name || "ShopThings Vendor"
    },
    "offers": {
      "@type": "Offer",
      "url": `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.id}`,
      "priceCurrency": "NGN",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.stock_quantity > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": product.vendor?.store_name || "ShopThings Vendor"
      }
    },
    "aggregateRating": product.average_rating && product.review_count > 0 ? {
      "@type": "AggregateRating",
      "ratingValue": product.average_rating,
      "reviewCount": product.review_count,
      "bestRating": 5,
      "worstRating": 1
    } : undefined,
    "category": product.category?.name,
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Condition",
        "value": "New"
      },
      {
        "@type": "PropertyValue", 
        "name": "Origin",
        "value": "Africa"
      }
    ]
  };

  // Remove undefined properties
  const cleanStructuredData = JSON.parse(JSON.stringify(structuredData));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanStructuredData) }}
    />
  );
}

interface OrganizationStructuredDataProps {
  vendor?: {
    store_name: string;
    description?: string;
    contact_email?: string;
    contact_phone?: string;
    address?: string;
    logo_url?: string;
    is_verified?: boolean;
  };
}

export function OrganizationStructuredData({ vendor }: OrganizationStructuredDataProps) {
  if (!vendor) return null;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": vendor.store_name,
    "description": vendor.description,
    "email": vendor.contact_email,
    "telephone": vendor.contact_phone,
    "address": vendor.address ? {
      "@type": "PostalAddress",
      "streetAddress": vendor.address
    } : undefined,
    "logo": vendor.logo_url ? `${process.env.NEXT_PUBLIC_SITE_URL}${vendor.logo_url}` : undefined,
    "url": `${process.env.NEXT_PUBLIC_SITE_URL}/vendors/${vendor.store_name}`,
    "sameAs": [],
    "aggregateRating": vendor.is_verified ? {
      "@type": "AggregateRating",
      "ratingValue": 5,
      "reviewCount": 1,
      "bestRating": 5,
      "worstRating": 1
    } : undefined
  };

  const cleanStructuredData = JSON.parse(JSON.stringify(structuredData));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(cleanStructuredData) }}
    />
  );
}

export function WebsiteStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ShopThings",
    "description": "Discover the Spirit of Africa. Explore authentic African products, fashion, art, and more from verified sellers.",
    "url": process.env.NEXT_PUBLIC_SITE_URL || "https://shopthings.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL}/products?search={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "ShopThings",
      "logo": {
        "@type": "ImageObject",
        "url": `${process.env.NEXT_PUBLIC_SITE_URL}/images/logo.png`
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

interface BreadcrumbStructuredDataProps {
  items: Array<{
    name: string;
    url: string;
  }>;
}

export function BreadcrumbStructuredData({ items }: BreadcrumbStructuredDataProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${process.env.NEXT_PUBLIC_SITE_URL}${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}