// Placeholder images for products without images
// Uses images from /public/images/collections folder

export const PLACEHOLDER_IMAGES = [
  '/images/collections/fasion.png',
  '/images/collections/home&art.png',
  '/images/collections/skincare.png',
];

/**
 * Get a placeholder image for a product
 * Uses the product ID or index to consistently return the same placeholder
 * for the same product
 */
export function getPlaceholderImage(identifier?: string | number): string {
  if (!identifier) {
    return PLACEHOLDER_IMAGES[0];
  }
  
  // Use a simple hash to consistently pick the same image for the same product
  let hash = 0;
  const str = String(identifier);
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  const index = Math.abs(hash) % PLACEHOLDER_IMAGES.length;
  return PLACEHOLDER_IMAGES[index];
}

/**
 * Get the product image or a placeholder if no image exists
 */
export function getProductImage(images: string[] | undefined | null, productId?: string): string {
  if (images && images.length > 0 && images[0]) {
    return images[0];
  }
  return getPlaceholderImage(productId);
}
