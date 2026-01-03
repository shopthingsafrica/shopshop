'use client';

import { MessageCircle, Instagram, Music } from 'lucide-react';
import Link from 'next/link';

interface SocialLinksProps {
  socialLinks?: {
    whatsapp?: string;
    instagram?: string;
    tiktok?: string;
  };
  vendorName: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export function SocialLinks({ 
  socialLinks, 
  vendorName, 
  size = 'md',
  showLabels = false 
}: SocialLinksProps) {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizes = {
    sm: 'p-2',
    md: 'p-2.5',
    lg: 'p-3',
  };

  const iconSize = iconSizes[size];
  const buttonSize = buttonSizes[size];

  if (!socialLinks || (!socialLinks.whatsapp && !socialLinks.instagram && !socialLinks.tiktok)) {
    return null;
  }

  return (
    <div className={`flex items-center ${showLabels ? 'flex-col sm:flex-row' : ''} gap-2`}>
      {socialLinks.whatsapp && (
        <Link
          href={`https://wa.me/${socialLinks.whatsapp.replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonSize} rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white transition-colors flex items-center gap-2 ${
            showLabels ? 'px-4' : ''
          }`}
          title={`Chat with ${vendorName} on WhatsApp`}
        >
          <MessageCircle className={iconSize} />
          {showLabels && <span className="text-sm font-medium">WhatsApp</span>}
        </Link>
      )}

      {socialLinks.instagram && (
        <Link
          href={`https://instagram.com/${socialLinks.instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonSize} rounded-full bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB] hover:opacity-90 text-white transition-opacity flex items-center gap-2 ${
            showLabels ? 'px-4' : ''
          }`}
          title={`Follow ${vendorName} on Instagram`}
        >
          <Instagram className={iconSize} />
          {showLabels && <span className="text-sm font-medium">Instagram</span>}
        </Link>
      )}

      {socialLinks.tiktok && (
        <Link
          href={`https://tiktok.com/@${socialLinks.tiktok.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className={`${buttonSize} rounded-full bg-black hover:bg-gray-800 text-white transition-colors flex items-center gap-2 ${
            showLabels ? 'px-4' : ''
          }`}
          title={`Follow ${vendorName} on TikTok`}
        >
          <Music className={iconSize} />
          {showLabels && <span className="text-sm font-medium">TikTok</span>}
        </Link>
      )}
    </div>
  );
}
