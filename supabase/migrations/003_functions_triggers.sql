-- ============================================
-- ShopThings Marketplace - Functions and Triggers
-- ============================================
-- This migration creates database functions and triggers
-- for automatic updates, validations, and computed values

-- ============================================
-- 1. UPDATED_AT TRIGGER FUNCTION
-- ============================================

-- Generic function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at
    BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at
    BEFORE UPDATE ON cart_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_addresses_updated_at
    BEFORE UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendor_wallets_updated_at
    BEFORE UPDATE ON vendor_wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_methods_updated_at
    BEFORE UPDATE ON payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at
    BEFORE UPDATE ON coupons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 2. CREATE PROFILE ON AUTH USER CREATION
-- ============================================

-- Function to create profile when user signs up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
        NEW.raw_user_meta_data->>'avatar_url'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users insert
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- 3. VENDOR WALLET AUTO-CREATION
-- ============================================

-- Function to create wallet when vendor is approved
CREATE OR REPLACE FUNCTION create_vendor_wallet()
RETURNS TRIGGER AS $$
BEGIN
    -- Create wallet when vendor is created
    IF TG_OP = 'INSERT' THEN
        INSERT INTO vendor_wallets (vendor_id, currency)
        VALUES (NEW.id, 'NGN');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on vendor insert
CREATE TRIGGER on_vendor_created
    AFTER INSERT ON vendors
    FOR EACH ROW EXECUTE FUNCTION create_vendor_wallet();

-- ============================================
-- 4. ORDER NUMBER GENERATION
-- ============================================

-- Function to generate unique order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
DECLARE
    date_part TEXT;
    random_part TEXT;
    new_order_number TEXT;
BEGIN
    -- Format: ST-YYYYMMDD-XXXXX (ST = ShopThings)
    date_part := TO_CHAR(NOW(), 'YYYYMMDD');
    random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 5));
    new_order_number := 'ST-' || date_part || '-' || random_part;
    
    -- Ensure uniqueness
    WHILE EXISTS (SELECT 1 FROM orders WHERE order_number = new_order_number) LOOP
        random_part := UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 5));
        new_order_number := 'ST-' || date_part || '-' || random_part;
    END LOOP;
    
    NEW.order_number := new_order_number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to generate order number before insert
CREATE TRIGGER generate_order_number_trigger
    BEFORE INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
    EXECUTE FUNCTION generate_order_number();

-- ============================================
-- 5. PRODUCT RATING UPDATE
-- ============================================

-- Function to update product average rating and review count
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating DECIMAL(3,2);
    total_reviews INTEGER;
BEGIN
    -- Calculate new average and count
    SELECT 
        COALESCE(AVG(rating)::DECIMAL(3,2), 0),
        COUNT(*)
    INTO avg_rating, total_reviews
    FROM reviews
    WHERE product_id = COALESCE(NEW.product_id, OLD.product_id);
    
    -- Update the product
    UPDATE products
    SET 
        average_rating = avg_rating,
        review_count = total_reviews,
        updated_at = NOW()
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers for review changes
CREATE TRIGGER on_review_insert
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER on_review_update
    AFTER UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER on_review_delete
    AFTER DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- ============================================
-- 6. STOCK QUANTITY MANAGEMENT
-- ============================================

-- Function to decrease stock when order is placed
CREATE OR REPLACE FUNCTION decrease_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE products
    SET 
        stock_quantity = stock_quantity - NEW.quantity,
        updated_at = NOW()
    WHERE id = NEW.product_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on order item insert
CREATE TRIGGER on_order_item_created
    AFTER INSERT ON order_items
    FOR EACH ROW EXECUTE FUNCTION decrease_product_stock();

-- Function to restore stock when order is cancelled/refunded
CREATE OR REPLACE FUNCTION restore_product_stock()
RETURNS TRIGGER AS $$
BEGIN
    -- Only restore if status changed to cancelled or refunded
    IF NEW.status IN ('cancelled', 'refunded') AND OLD.status NOT IN ('cancelled', 'refunded') THEN
        UPDATE products p
        SET 
            stock_quantity = p.stock_quantity + oi.quantity,
            updated_at = NOW()
        FROM order_items oi
        WHERE oi.order_id = NEW.id AND p.id = oi.product_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on order status update
CREATE TRIGGER on_order_cancelled
    AFTER UPDATE ON orders
    FOR EACH ROW
    WHEN (NEW.status IS DISTINCT FROM OLD.status)
    EXECUTE FUNCTION restore_product_stock();

-- ============================================
-- 7. VENDOR WALLET TRANSACTIONS
-- ============================================

-- Function to handle sale transaction (when order is delivered)
CREATE OR REPLACE FUNCTION process_vendor_sale()
RETURNS TRIGGER AS $$
DECLARE
    item RECORD;
    vendor_wallet_id UUID;
    commission_rate DECIMAL := 0.10; -- 10% platform commission
    vendor_amount DECIMAL;
BEGIN
    -- Only process when status changes to delivered
    IF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
        -- Process each order item
        FOR item IN 
            SELECT oi.*, v.id as vendor_uuid
            FROM order_items oi
            JOIN vendors v ON v.id = oi.vendor_id
            WHERE oi.order_id = NEW.id
        LOOP
            -- Get vendor wallet
            SELECT id INTO vendor_wallet_id
            FROM vendor_wallets
            WHERE vendor_id = item.vendor_uuid;
            
            -- Calculate vendor amount (after commission)
            vendor_amount := item.total_price * (1 - commission_rate);
            
            -- Add to pending balance (can be moved to available after hold period)
            UPDATE vendor_wallets
            SET 
                pending_balance = pending_balance + vendor_amount,
                updated_at = NOW()
            WHERE id = vendor_wallet_id;
            
            -- Record transaction
            INSERT INTO wallet_transactions (
                wallet_id, type, amount, currency, status, 
                reference, description, metadata
            ) VALUES (
                vendor_wallet_id,
                'sale',
                vendor_amount,
                item.currency,
                'pending',
                NEW.order_number,
                'Sale from order ' || NEW.order_number,
                jsonb_build_object(
                    'order_id', NEW.id,
                    'order_item_id', item.id,
                    'product_id', item.product_id,
                    'quantity', item.quantity,
                    'gross_amount', item.total_price,
                    'commission', item.total_price * commission_rate
                )
            );
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for vendor sale processing
CREATE TRIGGER on_order_delivered
    AFTER UPDATE ON orders
    FOR EACH ROW
    WHEN (NEW.status = 'delivered' AND OLD.status != 'delivered')
    EXECUTE FUNCTION process_vendor_sale();

-- ============================================
-- 8. DEFAULT ADDRESS MANAGEMENT
-- ============================================

-- Ensure only one default address per user
CREATE OR REPLACE FUNCTION manage_default_address()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = true THEN
        -- Remove default from other addresses
        UPDATE addresses
        SET is_default = false
        WHERE user_id = NEW.user_id 
          AND id != NEW.id 
          AND is_default = true;
    END IF;
    
    -- If this is the first address, make it default
    IF NOT EXISTS (
        SELECT 1 FROM addresses 
        WHERE user_id = NEW.user_id AND id != NEW.id
    ) THEN
        NEW.is_default := true;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for default address management
CREATE TRIGGER on_address_upsert
    BEFORE INSERT OR UPDATE ON addresses
    FOR EACH ROW EXECUTE FUNCTION manage_default_address();

-- ============================================
-- 9. DEFAULT PAYMENT METHOD MANAGEMENT
-- ============================================

-- Ensure only one default payment method per vendor
CREATE OR REPLACE FUNCTION manage_default_payment_method()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_default = true THEN
        -- Remove default from other payment methods
        UPDATE payment_methods
        SET is_default = false
        WHERE vendor_id = NEW.vendor_id 
          AND id != NEW.id 
          AND is_default = true;
    END IF;
    
    -- If this is the first payment method, make it default
    IF NOT EXISTS (
        SELECT 1 FROM payment_methods 
        WHERE vendor_id = NEW.vendor_id AND id != NEW.id
    ) THEN
        NEW.is_default := true;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for default payment method management
CREATE TRIGGER on_payment_method_upsert
    BEFORE INSERT OR UPDATE ON payment_methods
    FOR EACH ROW EXECUTE FUNCTION manage_default_payment_method();

-- ============================================
-- 10. COUPON USAGE TRACKING
-- ============================================

-- Function to increment coupon usage
CREATE OR REPLACE FUNCTION increment_coupon_usage()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.coupon_code IS NOT NULL THEN
        UPDATE coupons
        SET used_count = used_count + 1
        WHERE code = NEW.coupon_code;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on order insert with coupon
CREATE TRIGGER on_order_with_coupon
    AFTER INSERT ON orders
    FOR EACH ROW
    WHEN (NEW.coupon_code IS NOT NULL)
    EXECUTE FUNCTION increment_coupon_usage();

-- ============================================
-- 11. PRODUCT SLUG GENERATION
-- ============================================

-- Function to generate URL-friendly slug
CREATE OR REPLACE FUNCTION generate_product_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Only generate if slug is empty
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        -- Convert name to lowercase, replace spaces with hyphens
        base_slug := LOWER(REGEXP_REPLACE(
            REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9\s-]', '', 'g'),
            '\s+', '-', 'g'
        ));
        
        final_slug := base_slug;
        
        -- Ensure uniqueness
        WHILE EXISTS (SELECT 1 FROM products WHERE slug = final_slug AND id != COALESCE(NEW.id, uuid_nil())) LOOP
            counter := counter + 1;
            final_slug := base_slug || '-' || counter;
        END LOOP;
        
        NEW.slug := final_slug;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for product slug generation
CREATE TRIGGER generate_product_slug_trigger
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION generate_product_slug();

-- ============================================
-- 12. CATEGORY SLUG GENERATION
-- ============================================

-- Function to generate category slug
CREATE OR REPLACE FUNCTION generate_category_slug()
RETURNS TRIGGER AS $$
DECLARE
    base_slug TEXT;
    final_slug TEXT;
    counter INTEGER := 0;
BEGIN
    -- Only generate if slug is empty
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        base_slug := LOWER(REGEXP_REPLACE(
            REGEXP_REPLACE(NEW.name, '[^a-zA-Z0-9\s-]', '', 'g'),
            '\s+', '-', 'g'
        ));
        
        final_slug := base_slug;
        
        WHILE EXISTS (SELECT 1 FROM categories WHERE slug = final_slug AND id != COALESCE(NEW.id, uuid_nil())) LOOP
            counter := counter + 1;
            final_slug := base_slug || '-' || counter;
        END LOOP;
        
        NEW.slug := final_slug;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for category slug generation
CREATE TRIGGER generate_category_slug_trigger
    BEFORE INSERT OR UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION generate_category_slug();

-- ============================================
-- 13. UTILITY FUNCTIONS
-- ============================================

-- Function to validate coupon
CREATE OR REPLACE FUNCTION validate_coupon(
    p_code TEXT,
    p_cart_total DECIMAL
)
RETURNS TABLE (
    is_valid BOOLEAN,
    discount_amount DECIMAL,
    error_message TEXT
) AS $$
DECLARE
    coupon_record RECORD;
BEGIN
    -- Find the coupon
    SELECT * INTO coupon_record
    FROM coupons
    WHERE code = UPPER(p_code);
    
    -- Check if coupon exists
    IF NOT FOUND THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Invalid coupon code';
        RETURN;
    END IF;
    
    -- Check if active
    IF NOT coupon_record.is_active THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Coupon is no longer active';
        RETURN;
    END IF;
    
    -- Check date validity
    IF coupon_record.valid_from > NOW() THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Coupon is not yet valid';
        RETURN;
    END IF;
    
    IF coupon_record.valid_until < NOW() THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Coupon has expired';
        RETURN;
    END IF;
    
    -- Check usage limit
    IF coupon_record.usage_limit IS NOT NULL AND 
       coupon_record.used_count >= coupon_record.usage_limit THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 'Coupon usage limit reached';
        RETURN;
    END IF;
    
    -- Check minimum purchase
    IF coupon_record.min_purchase IS NOT NULL AND 
       p_cart_total < coupon_record.min_purchase THEN
        RETURN QUERY SELECT false, 0::DECIMAL, 
            'Minimum purchase of ' || coupon_record.min_purchase || ' required';
        RETURN;
    END IF;
    
    -- Calculate discount
    DECLARE
        calculated_discount DECIMAL;
    BEGIN
        IF coupon_record.discount_type = 'percentage' THEN
            calculated_discount := p_cart_total * (coupon_record.discount_value / 100);
        ELSE
            calculated_discount := coupon_record.discount_value;
        END IF;
        
        -- Apply max discount cap if set
        IF coupon_record.max_discount IS NOT NULL AND 
           calculated_discount > coupon_record.max_discount THEN
            calculated_discount := coupon_record.max_discount;
        END IF;
        
        -- Don't exceed cart total
        IF calculated_discount > p_cart_total THEN
            calculated_discount := p_cart_total;
        END IF;
        
        RETURN QUERY SELECT true, calculated_discount, NULL::TEXT;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get vendor statistics
CREATE OR REPLACE FUNCTION get_vendor_stats(p_vendor_id UUID)
RETURNS TABLE (
    total_products INTEGER,
    active_products INTEGER,
    total_orders INTEGER,
    pending_orders INTEGER,
    total_revenue DECIMAL,
    average_rating DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM products WHERE vendor_id = p_vendor_id),
        (SELECT COUNT(*)::INTEGER FROM products WHERE vendor_id = p_vendor_id AND status = 'active'),
        (SELECT COUNT(*)::INTEGER FROM order_items WHERE vendor_id = p_vendor_id),
        (SELECT COUNT(*)::INTEGER FROM order_items oi 
         JOIN orders o ON o.id = oi.order_id 
         WHERE oi.vendor_id = p_vendor_id AND o.status = 'pending'),
        (SELECT COALESCE(SUM(oi.total_price), 0)::DECIMAL 
         FROM order_items oi 
         JOIN orders o ON o.id = oi.order_id 
         WHERE oi.vendor_id = p_vendor_id AND o.payment_status = 'completed'),
        (SELECT COALESCE(AVG(p.average_rating), 0)::DECIMAL(3,2) 
         FROM products p WHERE p.vendor_id = p_vendor_id AND p.review_count > 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search products with full-text search
CREATE OR REPLACE FUNCTION search_products(
    search_query TEXT,
    p_category_id UUID DEFAULT NULL,
    p_min_price DECIMAL DEFAULT NULL,
    p_max_price DECIMAL DEFAULT NULL,
    p_limit INTEGER DEFAULT 20,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    name TEXT,
    slug TEXT,
    price DECIMAL,
    images JSONB,
    average_rating DECIMAL,
    vendor_name TEXT,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.name,
        p.slug,
        p.price,
        p.images,
        p.average_rating,
        v.store_name,
        ts_rank(to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')), 
                plainto_tsquery('english', search_query)) as rank
    FROM products p
    JOIN vendors v ON v.id = p.vendor_id
    WHERE 
        p.status = 'active'
        AND to_tsvector('english', p.name || ' ' || COALESCE(p.description, '')) 
            @@ plainto_tsquery('english', search_query)
        AND (p_category_id IS NULL OR p.category_id = p_category_id)
        AND (p_min_price IS NULL OR p.price >= p_min_price)
        AND (p_max_price IS NULL OR p.price <= p_max_price)
    ORDER BY rank DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
