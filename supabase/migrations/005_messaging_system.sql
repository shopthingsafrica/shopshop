-- ============================================
-- ShopThings Marketplace - Messaging System
-- ============================================
-- This migration creates tables for in-app messaging between buyers and vendors

-- ============================================
-- 1. CREATE MESSAGE STATUS ENUM
-- ============================================
DO $$ BEGIN
    CREATE TYPE message_status AS ENUM ('sent', 'delivered', 'read');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- 2. CREATE CONVERSATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    last_message_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    buyer_unread_count INTEGER NOT NULL DEFAULT 0,
    vendor_unread_count INTEGER NOT NULL DEFAULT 0,
    is_archived_by_buyer BOOLEAN NOT NULL DEFAULT false,
    is_archived_by_vendor BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure unique conversation per buyer-vendor pair
    UNIQUE(buyer_id, vendor_id)
);

-- Indexes for conversation queries
CREATE INDEX IF NOT EXISTS idx_conversations_buyer_id ON conversations(buyer_id);
CREATE INDEX IF NOT EXISTS idx_conversations_vendor_id ON conversations(vendor_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_product_id ON conversations(product_id);

-- ============================================
-- 3. CREATE MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    status message_status NOT NULL DEFAULT 'sent',
    is_from_buyer BOOLEAN NOT NULL,
    attachments JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read_at TIMESTAMPTZ,
    
    -- Ensure content is not empty
    CONSTRAINT messages_content_not_empty CHECK (length(trim(content)) > 0)
);

-- Indexes for message queries
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_status ON messages(status);

-- ============================================
-- 4. CREATE FUNCTIONS
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
            WHEN NEW.is_from_buyer = false THEN buyer_unread_count + 1
            ELSE buyer_unread_count
        END,
        vendor_unread_count = CASE 
            WHEN NEW.is_from_buyer = true THEN vendor_unread_count + 1
            ELSE vendor_unread_count
        END
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(
    p_conversation_id UUID,
    p_user_id UUID,
    p_is_buyer BOOLEAN
)
RETURNS void AS $$
BEGIN
    -- Update message status to 'read'
    UPDATE messages
    SET 
        status = 'read',
        read_at = NOW()
    WHERE 
        conversation_id = p_conversation_id
        AND sender_id != p_user_id
        AND status != 'read';
    
    -- Reset unread count for the user
    IF p_is_buyer THEN
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
-- 5. CREATE TRIGGERS
-- ============================================

-- Drop trigger if exists before creating
DROP TRIGGER IF EXISTS trigger_update_conversation_last_message ON messages;

-- Trigger to update conversation when new message is sent
CREATE TRIGGER trigger_update_conversation_last_message
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_conversation_last_message();

-- ============================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Buyers can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Vendors can view their conversations" ON conversations;
DROP POLICY IF EXISTS "Buyers can create conversations" ON conversations;
DROP POLICY IF EXISTS "Users can update conversation settings" ON conversations;
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON messages;
DROP POLICY IF EXISTS "Users can send messages" ON messages;
DROP POLICY IF EXISTS "Users can update message status" ON messages;

-- Conversations policies
-- Buyers can view their own conversations
CREATE POLICY "Buyers can view their conversations"
    ON conversations FOR SELECT
    USING (buyer_id = auth.uid());

-- Vendors can view conversations for their store
CREATE POLICY "Vendors can view their conversations"
    ON conversations FOR SELECT
    USING (
        vendor_id IN (
            SELECT id FROM vendors WHERE user_id = auth.uid()
        )
    );

-- Buyers can create conversations
CREATE POLICY "Buyers can create conversations"
    ON conversations FOR INSERT
    WITH CHECK (buyer_id = auth.uid());

-- Users can update their own conversation settings (archive, etc.)
CREATE POLICY "Users can update conversation settings"
    ON conversations FOR UPDATE
    USING (
        buyer_id = auth.uid() OR
        vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
    );

-- Messages policies
-- Users can view messages in their conversations
CREATE POLICY "Users can view messages in their conversations"
    ON messages FOR SELECT
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
    WITH CHECK (
        sender_id = auth.uid() AND
        conversation_id IN (
            SELECT id FROM conversations
            WHERE buyer_id = auth.uid()
            OR vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
        )
    );

-- Users can update their own messages (for status updates)
CREATE POLICY "Users can update message status"
    ON messages FOR UPDATE
    USING (
        conversation_id IN (
            SELECT id FROM conversations
            WHERE buyer_id = auth.uid()
            OR vendor_id IN (SELECT id FROM vendors WHERE user_id = auth.uid())
        )
    );

-- ============================================
-- 7. GRANT PERMISSIONS
-- ============================================

-- Grant usage on sequences
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Grant permissions on tables
GRANT SELECT, INSERT, UPDATE ON conversations TO authenticated;
GRANT SELECT, INSERT, UPDATE ON messages TO authenticated;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION get_or_create_conversation TO authenticated;
GRANT EXECUTE ON FUNCTION mark_messages_as_read TO authenticated;

-- ============================================
-- 8. COMMENTS
-- ============================================

COMMENT ON TABLE conversations IS 'Stores conversation threads between buyers and vendors';
COMMENT ON TABLE messages IS 'Stores individual messages within conversations';
COMMENT ON FUNCTION get_or_create_conversation IS 'Gets existing conversation or creates new one between buyer and vendor';
COMMENT ON FUNCTION mark_messages_as_read IS 'Marks all unread messages in a conversation as read for a specific user';
