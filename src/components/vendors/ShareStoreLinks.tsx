'use client';

import { useState } from 'react';
import { Share2, Copy, Check, Instagram, Music, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui';

interface ShareStoreLinksProps {
  vendorId: string;
  storeName: string;
}

export function ShareStoreLinks({ vendorId, storeName }: ShareStoreLinksProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const storeUrl = `${baseUrl}/vendors/${vendorId}`;

  const shareLinks = [
    {
      platform: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-[#25D366]',
      link: storeUrl,
      shareUrl: `https://wa.me/?text=${encodeURIComponent(`Check out ${storeName} on ShopThings: ${storeUrl}`)}`,
    },
    {
      platform: 'Instagram',
      icon: Instagram,
      color: 'bg-gradient-to-tr from-[#FD5949] via-[#D6249F] to-[#285AEB]',
      link: storeUrl,
      note: 'Copy link to share in your Instagram bio or stories',
    },
    {
      platform: 'TikTok',
      icon: Music,
      color: 'bg-black',
      link: storeUrl,
      note: 'Copy link to share in your TikTok bio or videos',
    },
  ];

  const copyToClipboard = async (text: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(platform);
      setTimeout(() => setCopiedLink(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="md"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        <span>Share Store</span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-lg border border-border z-50 p-4">
            <h3 className="font-semibold text-foreground mb-3">Share Your Store</h3>
            
            <div className="space-y-3">
              {shareLinks.map((item) => {
                const Icon = item.icon;
                const isCopied = copiedLink === item.platform;
                
                return (
                  <div key={item.platform} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`${item.color} p-2 rounded-full text-white`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">{item.platform}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        {item.shareUrl && (
                          <a
                            href={item.shareUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs px-3 py-1.5 bg-muted hover:bg-border rounded-md transition-colors"
                          >
                            Share
                          </a>
                        )}
                        <button
                          onClick={() => copyToClipboard(item.link, item.platform)}
                          className="text-xs px-3 py-1.5 bg-secondary hover:bg-secondary/90 text-white rounded-md transition-colors flex items-center gap-1"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3 h-3" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              Copy Link
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    
                    {item.note && (
                      <p className="text-xs text-muted-foreground pl-10">
                        {item.note}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Direct Store Link:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={storeUrl}
                  readOnly
                  className="flex-1 text-xs px-3 py-2 bg-muted rounded-md border border-border"
                />
                <button
                  onClick={() => copyToClipboard(storeUrl, 'Direct')}
                  className="p-2 hover:bg-muted rounded-md transition-colors"
                  title="Copy link"
                >
                  {copiedLink === 'Direct' ? (
                    <Check className="w-4 h-4 text-success" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
