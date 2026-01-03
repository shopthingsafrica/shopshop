'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Facebook, Twitter } from 'lucide-react';
import { 
  shareStoreNative, 
  copyStoreLinkToClipboard,
  generateFacebookShareUrl,
  generateTwitterShareUrl,
  generateStoreShareUrl,
  generateShareText,
} from '@/lib/social';
import { Button } from '@/components/ui';

interface ShareButtonProps {
  vendorId: string;
  storeName: string;
  description?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

export default function ShareButton({
  vendorId,
  storeName,
  description,
  variant = 'outline',
  size = 'md',
  showLabel = true,
  className = '',
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleNativeShare = async () => {
    const success = await shareStoreNative(vendorId, storeName, description);
    if (success) {
      setIsOpen(false);
    } else {
      // Fallback to showing share options
      setIsOpen(!isOpen);
    }
  };
  
  const handleCopyLink = async () => {
    const success = await copyStoreLinkToClipboard(vendorId, storeName);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleFacebookShare = () => {
    const storeUrl = generateStoreShareUrl(vendorId, storeName);
    const url = generateFacebookShareUrl(storeUrl);
    window.open(url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };
  
  const handleTwitterShare = () => {
    const storeUrl = generateStoreShareUrl(vendorId, storeName);
    const text = generateShareText(storeName, description);
    const url = generateTwitterShareUrl(text, storeUrl);
    window.open(url, '_blank', 'width=600,height=400');
    setIsOpen(false);
  };
  
  return (
    <div className="relative">
      <Button
        variant={variant}
        size={size}
        onClick={handleNativeShare}
        className={className}
      >
        <Share2 className="w-4 h-4" />
        {showLabel && <span className="ml-2">Share</span>}
      </Button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-border z-50 py-2">
            <button
              onClick={handleCopyLink}
              className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-3"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-success" />
                  <span className="text-success">Link copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-muted-foreground" />
                  <span>Copy link</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleFacebookShare}
              className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-3"
            >
              <Facebook className="w-4 h-4 text-[#1877F2]" />
              <span>Share on Facebook</span>
            </button>
            
            <button
              onClick={handleTwitterShare}
              className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-3"
            >
              <Twitter className="w-4 h-4 text-black" />
              <span>Share on Twitter</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
