-- ============================================
-- ShopThings Marketplace - Messaging System
-- ============================================
-- This migration creates tables for in-app messaging between buyers and vendors

-- ============================================
-- 1. CREATE CONVERSATIONS TABLE
-- ============================================
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    last_message_at TIMESTAMPTZ,
    buyer_unread_count INTEGER NOT NULL DEFAULT 0,
    vendor_unread_count INTEGER NOT NULL DEFAULT 0,
    is_archived_by_buyer BOOLEAN NOT NULL DEFAULT false,
    is_archived_by_vendor BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure unique conversation per buyer-vendor pair
    UNIQUE(buyer_id, vendor_id)
);

-- Indexes for conversations
CREATE INDEX idx_conversations_buyer_id ON conversations(buyer_id);
CREATE INDEX idx_conversations_vendor_id ON conversations(vendor_id);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);
CREATE INDEX idx_conversations_product_id ON conversations(product_id);

-- ============================================
-- 2. CREATE MESSAGES TABLE
-- ============================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMPTZ,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for messages
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_is_read ON messages(is_read);

-- ============================================
-- 3. CREATE FUNCTIONS
-- ============================================

-- Function to update conversation's last_message_at
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE conversations
    SET 
        last_message_at = NEW.created_at,
        updated_at = NOW(),
        -- Increment unread count for the recipient
        buyer_unread_count = CASE 
            WHEN NEW.sender_id != (SELECT buyer_id FROM conversations WHERE id = NEW.conversation_id)
            THEN buyer_unread_count + 1
            ELSE buyer_unread_count
        END,
        vendor_unread_count = CASE 
            WHEN NEW.sender_id = (SELECT buyer_id FROM conversations WHERE id = NEW.conversation_id)
            THEN vendor_unread_count + 1
            ELSE vendor_unread_count
        END
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update conversation when new message is sent
CREATE TRIGGER trigger_update_conversation_last_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message();

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(
    p_conversation_id UUID,
    p_user_id UUID
)
RETURNS void AS $$
DECLARE
    v_is_buyer BOOLEAN;
BEGIN
    -- Check if user is the buyer in this conversation
    SELECT buyer_id = p_user_id INTO v_is_buyer
    FROM conversations
    WHERE id = p_conversation_id;
    
    -- Mark unread messages as read
    UPDATE messages
    SET 
        is_read = true,
        read_at = NOW()
    WHERE 
        conversation_id = p_conversation_id
        AND sender_id != p_user_id
        AND is_read = false;
    
    -- Reset unread count for the user
    IF v_is_buyer THEN
        UPDATE conversations
        SET buyer_unread_count = 0
        WHERE id = p_conversation_id;
    ELSE
        UPDATE conversations
        SET vendor_unread_count = 0
        WHERE id = p_conversation_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to get or create conversation
CREATE OR REPLACE FUNCTION get_or_create_conversation(
    p_buyer_id UUID,
    p_vendor_id UUID,
    p_product_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_conversation_id UUID;
BEGIN
    -- Try to find existing conversation
    SELECT id INTO v_conversation_id
    FROM conversations
    WHERE buyer_id = p_buyer_id AND vendor_id = p_vendor_id;
    
    -- If not found, create new conversation
    IF v_conversation_id IS NULL THEN
        INSERT INTO conversations (buyer_id, vendor_id, product_id)
        VALUES (p_buyer_id, p_vendor_id, p_product_id)
        RETURNING id INTO v_conversation_id;
    END IF;
    
    RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on conversations
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

-- Buyers can see their own conversations
CREATE POLICY "Buyers can view their conversations"
ON conversations FOR SELECT
TO authenticated
USING (buyer_id = auth.uid());

-- Vendors can see conversations for their store
CREATE POLICY "Vendors can view their conversations"
ON conversations FOR SELECT
TO authenticated
USING (
    vendor_id IN (
        SELECT id FROM vendors WHERE user_id = auth.uid()
    )
);

-- Buyers can create conversations
CREATE POLICY "Buyers can create conversations"
ON conversations FOR INSERT
TO authenticated
WITH CHECK (buyer_id = auth.uid());

-- Users can update their own conversation settings
CREATE POLICY "Users can update their conversations"
ON conversations FOR UPDATE
TO authenticated
USING (
    buyer_id = auth.uid() OR
    vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
);

-- Enable RLS on messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages in their conversations
CREATE POLICY "Users can view their messages"
ON messages FOR SELECT
TO authenticated
USING (
    conversation_id IN (
        SELECT id FROM conversations
        WHERE buyer_id = auth.uid()
        OR vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    )
);

-- Users can send messages in their conversations
CREATE POLICY "Users can send messages"
ON messages FOR INSERT
TO authenticated
WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
        SELECT id FROM conversations
        WHERE buyer_id = auth.uid()
        OR vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    )
);

-- Users can update their own messages (for read status)
CREATE POLICY "Users can update messages"
ON messages FOR UPDATE
TO authenticated
USING (
    conversation_id IN (
        SELECT id FROM conversations
        WHERE buyer_id = auth.uid()
        OR vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    )
);

-- ============================================
-- 5. COMMENTS
-- ============================================

COMMENT ON TABLE conversations IS 'Stores conversations between buyers and vendors';
COMMENT ON TABLE messages IS 'Stores individual messages within conversations';
COMMENT ON FUNCTION update_conversation_last_message() IS 'Updates conversation metadata when new message is sent';
COMMENT ON FUNCTION mark_messages_as_read(UUID, UUID) IS 'Marks all unread messages in a conversation as read for a user';
COMMENT ON FUNCTION get_or_create_conversation(UUID, UUID, UUID) IS 'Gets existing conversation or creates new one between buyer and vendor';
