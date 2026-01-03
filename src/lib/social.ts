/**
 * Social Commerce Utilities
 * Helper functions for social media integration (TikTok, Instagram, WhatsApp)
 */

import { SocialLinks } from '@/types';

/**
 * Generate WhatsApp chat URL with pre-filled message
 */
export function generateWhatsAppUrl(
  phoneNumber: string,
  message?: string
): string {
  // Remove all non-numeric characters from phone number
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  
  // Default message if none provided
  const defaultMessage = 'Hi! I found your store on ShopThings and I\'m interested in your products.';
  const finalMessage = message || defaultMessage;
  
  // Encode message for URL
  const encodedMessage = encodeURIComponent(finalMessage);
  
  // Return WhatsApp URL
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

/**
 * Generate WhatsApp chat URL for product inquiry
 */
export function generateProductWhatsAppUrl(
  phoneNumber: string,
  productName: string,
  storeName: string,
  productUrl?: string
): string {
  const message = productUrl
    ? `Hi! I'm interested in "${productName}" from ${storeName} on ShopThings.\n\n${productUrl}`
    : `Hi! I'm interested in "${productName}" from ${storeName} on ShopThings.`;
  
  return generateWhatsAppUrl(phoneNumber, message);
}

/**
 * Generate shareable store link for social media
 */
export function generateStoreShareUrl(
  vendorId: string,
  storeName: string,
  baseUrl: string = typeof window !== 'undefined' ? window.location.origin : ''
): string {
  const storeUrl = `${baseUrl}/vendors/${vendorId}`;
  return storeUrl;
}

/**
 * Generate social media share text
 */
export function generateShareText(
  storeName: string,
  description?: string
): string {
  const text = description
    ? `Check out ${storeName} on ShopThings! ${description}`
    : `Check out ${storeName} on ShopThings - Discover authentic African products!`;
  
  return text;
}

/**
 * Generate Instagram story share URL
 */
export function generateInstagramShareUrl(
  storeUrl: string,
  imageUrl?: string
): string {
  // Instagram doesn't support direct URL sharing, but we can prepare the data
  // This would typically be used with Instagram's native share sheet on mobile
  return `instagram://story-camera`;
}

/**
 * Generate TikTok share URL
 */
export function generateTikTokShareUrl(text: string, url: string): string {
  // TikTok doesn't have a direct web share URL, but we can prepare the data
  // This would typically be used with TikTok's native share on mobile
  return `https://www.tiktok.com/`;
}

/**
 * Generate Twitter/X share URL
 */
export function generateTwitterShareUrl(text: string, url: string): string {
  const encodedText = encodeURIComponent(text);
  const encodedUrl = encodeURIComponent(url);
  return `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
}

/**
 * Generate Facebook share URL
 */
export function generateFacebookShareUrl(url: string): string {
  const encodedUrl = encodeURIComponent(url);
  return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
}

/**
 * Open WhatsApp chat in new window
 */
export function openWhatsAppChat(
  phoneNumber: string,
  message?: string
): void {
  const url = generateWhatsAppUrl(phoneNumber, message);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Open product WhatsApp chat
 */
export function openProductWhatsAppChat(
  phoneNumber: string,
  productName: string,
  storeName: string,
  productUrl?: string
): void {
  const url = generateProductWhatsAppUrl(phoneNumber, productName, storeName, productUrl);
  window.open(url, '_blank', 'noopener,noreferrer');
}

/**
 * Copy store link to clipboard
 */
export async function copyStoreLinkToClipboard(
  vendorId: string,
  storeName: string
): Promise<boolean> {
  try {
    const storeUrl = generateStoreShareUrl(vendorId, storeName);
    await navigator.clipboard.writeText(storeUrl);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
}

/**
 * Share store using Web Share API (mobile)
 */
export async function shareStoreNative(
  vendorId: string,
  storeName: string,
  description?: string
): Promise<boolean> {
  if (!navigator.share) {
    return false;
  }
  
  try {
    const storeUrl = generateStoreShareUrl(vendorId, storeName);
    const text = generateShareText(storeName, description);
    
    await navigator.share({
      title: storeName,
      text: text,
      url: storeUrl,
    });
    
    return true;
  } catch (error) {
    // User cancelled or error occurred
    console.error('Share failed:', error);
    return false;
  }
}

/**
 * Validate social media username/handle
 */
export function validateSocialHandle(handle: string, platform: 'instagram' | 'tiktok' | 'twitter'): boolean {
  // Remove @ if present
  const cleanHandle = handle.replace(/^@/, '');
  
  // Basic validation: alphanumeric, underscores, dots (3-30 chars)
  const regex = /^[a-zA-Z0-9._]{3,30}$/;
  return regex.test(cleanHandle);
}

/**
 * Validate WhatsApp phone number
 */
export function validateWhatsAppNumber(phone: string): boolean {
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  
  // Should be between 10-15 digits
  return cleanPhone.length >= 10 && cleanPhone.length <= 15;
}

/**
 * Format social media handle (add @ if missing)
 */
export function formatSocialHandle(handle: string): string {
  if (!handle) return '';
  return handle.startsWith('@') ? handle : `@${handle}`;
}

/**
 * Get social media profile URL
 */
export function getSocialProfileUrl(handle: string, platform: 'instagram' | 'tiktok' | 'twitter' | 'facebook'): string {
  const cleanHandle = handle.replace(/^@/, '');
  
  const baseUrls = {
    instagram: 'https://instagram.com/',
    tiktok: 'https://tiktok.com/@',
    twitter: 'https://twitter.com/',
    facebook: 'https://facebook.com/',
  };
  
  return `${baseUrls[platform]}${cleanHandle}`;
}

/**
 * Check if social links are configured
 */
export function hasSocialLinks(socialLinks?: SocialLinks): boolean {
  if (!socialLinks) return false;
  return !!(socialLinks.instagram || socialLinks.tiktok || socialLinks.whatsapp || socialLinks.twitter || socialLinks.facebook);
}

/**
 * Get configured social platforms
 */
export function getConfiguredPlatforms(socialLinks?: SocialLinks): string[] {
  if (!socialLinks) return [];
  
  const platforms: string[] = [];
  if (socialLinks.instagram) platforms.push('instagram');
  if (socialLinks.tiktok) platforms.push('tiktok');
  if (socialLinks.whatsapp) platforms.push('whatsapp');
  if (socialLinks.twitter) platforms.push('twitter');
  if (socialLinks.facebook) platforms.push('facebook');
  
  return platforms;
}
