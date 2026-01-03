import { createClient } from '@/lib/supabase/client';
import type { Conversation, Message, ConversationWithDetails } from '@/types/messaging';

export class MessagingService {
  private supabase = createClient();

  /**
   * Get or create a conversation between buyer and vendor
   */
  async getOrCreateConversation(
    buyerId: string,
    vendorId: string,
    productId?: string
  ): Promise<string> {
    const { data, error } = await this.supabase.rpc('get_or_create_conversation', {
      p_buyer_id: buyerId,
      p_vendor_id: vendorId,
      p_product_id: productId || null,
    } as any);

    if (error) throw error;
    return data;
  }

  /**
   * Get all conversations for a user
   */
  async getConversations(userId: string, isVendor: boolean = false): Promise<ConversationWithDetails[]> {
    let query = this.supabase
      .from('conversations')
      .select(`
        *,
        buyer:profiles!buyer_id(id, full_name, avatar_url),
        vendor:vendors!vendor_id(id, store_name, logo_url),
        product:products(id, name, images)
      `)
      .order('last_message_at', { ascending: false });

    if (isVendor) {
      // Get vendor ID for this user
      const { data: vendorData } = await this.supabase
        .from('vendors')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (vendorData) {
        query = query.eq('vendor_id', (vendorData as any).id);
      }
    } else {
      query = query.eq('buyer_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data as any) || [];
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await this.supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!sender_id(id, full_name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data as any) || [];
  }

  /**
   * Send a message
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    isFromBuyer: boolean,
    attachments: string[] = []
  ): Promise<Message> {
    const { data, error } = await this.supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
        is_from_buyer: isFromBuyer,
        attachments,
      } as any)
      .select(`
        *,
        sender:profiles!sender_id(id, full_name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data as any;
  }

  /**
   * Mark messages as read
   */
  async markAsRead(conversationId: string, userId: string, isBuyer: boolean): Promise<void> {
    const { error } = await this.supabase.rpc('mark_messages_as_read', {
      p_conversation_id: conversationId,
      p_user_id: userId,
      p_is_buyer: isBuyer,
    } as any);

    if (error) throw error;
  }

  /**
   * Subscribe to new messages in a conversation
   */
  subscribeToMessages(
    conversationId: string,
    callback: (message: Message) => void
  ) {
    return this.supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Fetch the complete message with sender info
          const { data } = await this.supabase
            .from('messages')
            .select(`
              *,
              sender:profiles!sender_id(id, full_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            callback(data as any);
          }
        }
      )
      .subscribe();
  }

  /**
   * Subscribe to conversation updates
   */
  subscribeToConversations(userId: string, callback: () => void) {
    return this.supabase
      .channel(`conversations:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        () => {
          callback();
        }
      )
      .subscribe();
  }

  /**
   * Archive a conversation
   */
  async archiveConversation(conversationId: string, isBuyer: boolean): Promise<void> {
    const updateField = isBuyer ? 'is_archived_by_buyer' : 'is_archived_by_vendor';
    
    const { error } = await (this.supabase as any)
      .from('conversations')
      .update({ [updateField]: true })
      .eq('id', conversationId);

    if (error) throw error;
  }

  /**
   * Get unread message count
   */
  async getUnreadCount(userId: string, isVendor: boolean = false): Promise<number> {
    let query = this.supabase
      .from('conversations')
      .select('buyer_unread_count, vendor_unread_count');

    if (isVendor) {
      const { data: vendorData } = await this.supabase
        .from('vendors')
        .select('id')
        .eq('user_id', userId)
        .single();

      if (vendorData) {
        query = query.eq('vendor_id', (vendorData as any).id);
      }
    } else {
      query = query.eq('buyer_id', userId);
    }

    const { data, error } = await query;

    if (error) throw error;

    const count = (data as any)?.reduce((sum: number, conv: any) => {
      return sum + (isVendor ? conv.vendor_unread_count : conv.buyer_unread_count);
    }, 0) || 0;

    return count;
  }
}

export const messagingService = new MessagingService();
