'use client';

import { useEffect, useState } from 'react';
import { MessageCircle, Search } from 'lucide-react';
import { messagingService } from '@/lib/messaging';
import type { Conversation, ConversationWithDetails } from '@/types/messaging';
import { formatDistanceToNow } from 'date-fns';

interface ConversationListProps {
  userId: string;
  isVendor?: boolean;
  onSelectConversation: (conversation: ConversationWithDetails) => void;
  selectedConversationId?: string;
}

export function ConversationList({
  userId,
  isVendor = false,
  onSelectConversation,
  selectedConversationId,
}: ConversationListProps) {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadConversations();

    // Subscribe to conversation updates
    const subscription = messagingService.subscribeToConversations(userId, () => {
      loadConversations();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [userId, isVendor]);

  const loadConversations = async () => {
    try {
      const data = await messagingService.getConversations(userId, isVendor);
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery) return true;
    
    const searchLower = searchQuery.toLowerCase();
    const name = isVendor 
      ? conv.buyer?.full_name || 'Unknown'
      : conv.vendor?.store_name || 'Unknown';
    
    return name.toLowerCase().includes(searchLower);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search */}
      <div className="p-4 border-b border-border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <MessageCircle className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              {searchQuery ? 'No conversations found' : 'No messages yet'}
            </p>
          </div>
        ) : (
          <div>
            {filteredConversations.map((conversation) => {
              const unreadCount = isVendor 
                ? conversation.vendor_unread_count 
                : conversation.buyer_unread_count;
              
              const name = isVendor
                ? conversation.buyer?.full_name || 'Unknown Buyer'
                : conversation.vendor?.store_name || 'Unknown Vendor';
              
              const avatar = isVendor
                ? conversation.buyer?.avatar_url
                : conversation.vendor?.logo_url;

              return (
                <button
                  key={conversation.id}
                  onClick={() => onSelectConversation(conversation)}
                  className={`w-full p-4 flex items-start gap-3 hover:bg-muted transition-colors border-b border-border ${
                    selectedConversationId === conversation.id ? 'bg-muted' : ''
                  }`}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center">
                        <span className="text-lg font-bold text-secondary">
                          {name.charAt(0)}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-foreground truncate">
                        {name}
                      </h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">
                        {formatDistanceToNow(new Date(conversation.last_message_at), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    
                    {conversation.product && (
                      <p className="text-xs text-muted-foreground truncate mb-1">
                        Re: {conversation.product.title}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversation.last_message?.content || 'No messages yet'}
                      </p>
                      {unreadCount > 0 && (
                        <span className="flex-shrink-0 ml-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
