'use client';

import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui';

interface ChatWithVendorProps {
  vendorName: string;
  whatsappNumber?: string;
  productName?: string;
  productUrl?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function ChatWithVendor({
  vendorName,
  whatsappNumber,
  productName,
  productUrl,
  variant = 'outline',
  size = 'md',
  fullWidth = false,
}: ChatWithVendorProps) {
  const handleChatClick = () => {
    if (!whatsappNumber) {
      alert('Vendor has not provided a WhatsApp number');
      return;
    }

    // Clean the phone number (remove spaces, dashes, etc.)
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    
    // Create pre-filled message
    let message = `Hi ${vendorName}, I'm interested in your products on ShopThings.`;
    
    if (productName) {
      message = `Hi ${vendorName}, I'm interested in "${productName}" on ShopThings.`;
      if (productUrl) {
        message += `\n\nProduct link: ${productUrl}`;
      }
    }
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={handleChatClick}
      className="flex items-center justify-center gap-2"
    >
      <MessageCircle className="w-4 h-4" />
      <span>Chat with Vendor</span>
    </Button>
  );
}
