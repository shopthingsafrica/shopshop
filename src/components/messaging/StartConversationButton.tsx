'use client';

import { useState } from 'react';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { messagingService } from '@/lib/messaging';
import { Button } from '@/components/ui';

interface StartConversationButtonProps {
  buyerId: string;
  vendorId: string;
  productId?: string;
  productName?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export function StartConversationButton({
  buyerId,
  vendorId,
  productId,
  productName,
  variant = 'outline',
  size = 'md',
  fullWidth = false,
}: StartConversationButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStartConversation = async () => {
    setLoading(true);
    try {
      const conversationId = await messagingService.getOrCreateConversation(
        buyerId,
        vendorId,
        productId
      );

      // Send initial message if product is specified
      if (productId && productName) {
        await messagingService.sendMessage(
          conversationId,
          buyerId,
          `Hi! I'm interested in "${productName}". Can you provide more information?`,
          true
        );
      }

      // Redirect to messages page
      router.push('/messages');
    } catch (error) {
      console.error('Error starting conversation:', error);
      alert('Failed to start conversation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      onClick={handleStartConversation}
      disabled={loading}
      className="flex items-center justify-center gap-2"
    >
      <MessageCircle className="w-4 h-4" />
      <span>{loading ? 'Starting...' : 'Message Vendor'}</span>
    </Button>
  );
}
